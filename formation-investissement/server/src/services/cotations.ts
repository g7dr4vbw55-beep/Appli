/**
 * Recuperation des cotations.
 *
 * Trois sources possibles :
 *  - CoinGecko (API publique) pour les crypto-actifs ;
 *  - un fournisseur actions/ETF configurable (Finnhub ou Alpha Vantage) ;
 *  - la saisie manuelle, qui sert a la fois de mode degrade quand une API est
 *    indisponible ou non configuree, et de source unique pour les supports
 *    qu'aucune API gratuite ne couvre correctement (ETF europeens notamment).
 *
 * Aucun appel reseau n'est declenche pour un actif en mode manuel.
 */
import { config, equityProviderUsable } from '../config.js';
import { db, getSetting, nowIso, setSetting } from '../db/index.js';

export interface Actif {
  id: number;
  symbol: string;
  name: string;
  asset_class: 'action' | 'etf' | 'crypto';
  provider: 'coingecko' | 'finnhub' | 'alphavantage' | 'manual';
  provider_ref: string;
  currency: string;
  is_benchmark: number;
  notes: string;
}

export type SourcePrix = 'coingecko' | 'finnhub' | 'alphavantage' | 'manuel' | 'indisponible';

export interface Cotation {
  actifId: number;
  symbole: string;
  prix: number | null;
  devise: string;
  prixEuros: number | null;
  source: SourcePrix;
  horodatage: string | null;
  /** Message affiche quand le prix vient d'une source degradee ou est absent. */
  avertissement: string | null;
}

interface EntreeCache {
  prix: number;
  horodatage: number;
  source: SourcePrix;
}

const cache = new Map<string, EntreeCache>();

function duCache(cle: string): EntreeCache | null {
  const entree = cache.get(cle);
  if (!entree) return null;
  if (Date.now() - entree.horodatage > config.quotes.cacheTtlSeconds * 1000) return null;
  return entree;
}

async function recuperer(url: string, entetes: Record<string, string> = {}): Promise<unknown> {
  const controleur = new AbortController();
  const minuteur = setTimeout(() => controleur.abort(), 8000);
  try {
    const reponse = await fetch(url, { headers: entetes, signal: controleur.signal });
    if (!reponse.ok) throw new Error(`HTTP ${reponse.status}`);
    return await reponse.json();
  } finally {
    clearTimeout(minuteur);
  }
}

// --- Taux de change USD -> EUR ---------------------------------------------
// Choix technique : plutot que d'ajouter un troisieme fournisseur d'API, le
// taux est deduit du prix du bitcoin cote simultanement en euros et en dollars
// par CoinGecko (prix_eur / prix_usd = euros par dollar). Ce taux est approche.
// Il peut etre remplace a tout moment par une valeur saisie a la main
// (parametre fx_usd_eur), qui est alors prioritaire.
export async function tauxUsdVersEur(): Promise<{ taux: number; source: string }> {
  const manuel = getSetting('fx_usd_eur', 0);
  if (manuel > 0) return { taux: manuel, source: 'saisi manuellement' };

  const enCache = duCache('fx:usdeur');
  if (enCache) return { taux: enCache.prix, source: 'CoinGecko (déduit)' };

  try {
    const url = `${config.quotes.coingeckoBaseUrl}/simple/price?ids=bitcoin&vs_currencies=eur,usd`;
    const donnees = (await recuperer(url, enteteCoinGecko())) as {
      bitcoin?: { eur?: number; usd?: number };
    };
    const eur = donnees.bitcoin?.eur;
    const usd = donnees.bitcoin?.usd;
    if (eur && usd && usd > 0) {
      const taux = eur / usd;
      cache.set('fx:usdeur', { prix: taux, horodatage: Date.now(), source: 'coingecko' });
      return { taux, source: 'CoinGecko (déduit)' };
    }
  } catch {
    // Repli silencieux : le taux par defaut est renvoye avec sa source explicite.
  }
  return { taux: 0.92, source: 'valeur par défaut approximative' };
}

export function definirTauxManuel(taux: number): void {
  setSetting('fx_usd_eur', taux);
}

function enteteCoinGecko(): Record<string, string> {
  return config.quotes.coingeckoKey ? { 'x-cg-demo-api-key': config.quotes.coingeckoKey } : {};
}

// --- Prix manuel ------------------------------------------------------------
export function dernierPrixManuel(actifId: number): { price: number; as_of: string } | null {
  return (
    (db()
      .prepare('SELECT price, as_of FROM manual_prices WHERE asset_id = ? ORDER BY as_of DESC LIMIT 1')
      .get(actifId) as { price: number; as_of: string } | undefined) ?? null
  );
}

export function enregistrerPrixManuel(actifId: number, prix: number, date?: string): void {
  db()
    .prepare('INSERT INTO manual_prices (asset_id, price, as_of) VALUES (?, ?, ?)')
    .run(actifId, prix, date ?? nowIso());
}

// --- CoinGecko --------------------------------------------------------------
async function prixCoinGecko(refs: string[]): Promise<Map<string, number>> {
  const resultat = new Map<string, number>();
  const manquants = refs.filter((ref) => {
    const entree = duCache(`cg:${ref}`);
    if (entree) {
      resultat.set(ref, entree.prix);
      return false;
    }
    return true;
  });
  if (manquants.length === 0) return resultat;

  const url = `${config.quotes.coingeckoBaseUrl}/simple/price?ids=${manquants.join(',')}&vs_currencies=eur`;
  const donnees = (await recuperer(url, enteteCoinGecko())) as Record<string, { eur?: number }>;
  for (const ref of manquants) {
    const prix = donnees[ref]?.eur;
    if (typeof prix === 'number') {
      cache.set(`cg:${ref}`, { prix, horodatage: Date.now(), source: 'coingecko' });
      resultat.set(ref, prix);
    }
  }
  return resultat;
}

// --- Fournisseur actions / ETF ---------------------------------------------
async function prixAction(ref: string): Promise<number | null> {
  const cle = `eq:${ref}`;
  const enCache = duCache(cle);
  if (enCache) return enCache.prix;

  let prix: number | null = null;

  if (config.quotes.equityProvider === 'finnhub' && config.quotes.finnhubKey) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(ref)}&token=${config.quotes.finnhubKey}`;
    const donnees = (await recuperer(url)) as { c?: number };
    prix = typeof donnees.c === 'number' && donnees.c > 0 ? donnees.c : null;
  } else if (config.quotes.equityProvider === 'alphavantage' && config.quotes.alphaVantageKey) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ref)}&apikey=${config.quotes.alphaVantageKey}`;
    const donnees = (await recuperer(url)) as Record<string, Record<string, string>>;
    const brut = donnees['Global Quote']?.['05. price'];
    const valeur = brut ? Number(brut) : NaN;
    prix = Number.isFinite(valeur) && valeur > 0 ? valeur : null;
  }

  if (prix !== null) {
    cache.set(cle, {
      prix,
      horodatage: Date.now(),
      source: config.quotes.equityProvider as SourcePrix,
    });
  }
  return prix;
}

/**
 * Cotations d'un lot d'actifs. La fonction ne leve jamais : un actif dont le
 * prix n'a pu etre obtenu revient avec source "manuel" ou "indisponible" et un
 * avertissement lisible par l'utilisateur.
 */
export async function cotations(actifs: Actif[]): Promise<Map<number, Cotation>> {
  const resultat = new Map<number, Cotation>();
  const { taux } = await tauxUsdVersEur();

  const refsCrypto = actifs
    .filter((a) => a.provider === 'coingecko' && a.provider_ref)
    .map((a) => a.provider_ref);

  let prixCrypto = new Map<string, number>();
  let echecCoinGecko = false;
  if (refsCrypto.length > 0) {
    try {
      prixCrypto = await prixCoinGecko([...new Set(refsCrypto)]);
    } catch {
      echecCoinGecko = true;
    }
  }

  for (const actif of actifs) {
    const versEuros = (montant: number) =>
      actif.currency === 'USD' ? montant * taux : montant;

    const replierSurManuel = (avertissement: string): Cotation => {
      const manuel = dernierPrixManuel(actif.id);
      if (manuel) {
        return {
          actifId: actif.id,
          symbole: actif.symbol,
          prix: manuel.price,
          devise: actif.currency,
          prixEuros: versEuros(manuel.price),
          source: 'manuel',
          horodatage: manuel.as_of,
          avertissement,
        };
      }
      return {
        actifId: actif.id,
        symbole: actif.symbol,
        prix: null,
        devise: actif.currency,
        prixEuros: null,
        source: 'indisponible',
        horodatage: null,
        avertissement: `${avertissement} Aucun prix manuel enregistré : saisissez-en un pour valoriser cette ligne.`,
      };
    };

    if (actif.provider === 'coingecko') {
      const prix = prixCrypto.get(actif.provider_ref);
      if (prix !== undefined) {
        resultat.set(actif.id, {
          actifId: actif.id,
          symbole: actif.symbol,
          prix,
          devise: 'EUR',
          prixEuros: prix,
          source: 'coingecko',
          horodatage: nowIso(),
          avertissement: null,
        });
      } else {
        resultat.set(
          actif.id,
          replierSurManuel(
            echecCoinGecko
              ? 'CoinGecko injoignable : mode dégradé, prix saisi manuellement.'
              : "Cet identifiant CoinGecko n'a renvoyé aucun prix.",
          ),
        );
      }
      continue;
    }

    if (actif.provider === 'manual' || !equityProviderUsable()) {
      const manuel = dernierPrixManuel(actif.id);
      if (manuel) {
        resultat.set(actif.id, {
          actifId: actif.id,
          symbole: actif.symbol,
          prix: manuel.price,
          devise: actif.currency,
          prixEuros: versEuros(manuel.price),
          source: 'manuel',
          horodatage: manuel.as_of,
          avertissement:
            actif.provider === 'manual'
              ? 'Prix saisi manuellement.'
              : `Fournisseur actions non configuré (EQUITY_PROVIDER=${config.quotes.equityProvider}) : prix saisi manuellement.`,
        });
      } else {
        resultat.set(
          actif.id,
          replierSurManuel(
            actif.provider === 'manual'
              ? 'Cet actif fonctionne en saisie manuelle.'
              : 'Fournisseur actions non configuré.',
          ),
        );
      }
      continue;
    }

    try {
      const prix = await prixAction(actif.provider_ref);
      if (prix !== null) {
        resultat.set(actif.id, {
          actifId: actif.id,
          symbole: actif.symbol,
          prix,
          devise: actif.currency,
          prixEuros: versEuros(prix),
          source: config.quotes.equityProvider as SourcePrix,
          horodatage: nowIso(),
          avertissement:
            actif.currency === 'USD'
              ? `Prix converti en euros au taux approché de ${taux.toFixed(4)} EUR/USD.`
              : null,
        });
      } else {
        resultat.set(
          actif.id,
          replierSurManuel('Le fournisseur n’a renvoyé aucun prix pour ce symbole.'),
        );
      }
    } catch {
      resultat.set(
        actif.id,
        replierSurManuel('Fournisseur de cotations injoignable : mode dégradé.'),
      );
    }
  }

  return resultat;
}

export function tousLesActifs(): Actif[] {
  return db().prepare('SELECT * FROM assets ORDER BY asset_class, symbol').all() as Actif[];
}

export function actifParId(id: number): Actif | null {
  return (db().prepare('SELECT * FROM assets WHERE id = ?').get(id) as Actif | undefined) ?? null;
}
