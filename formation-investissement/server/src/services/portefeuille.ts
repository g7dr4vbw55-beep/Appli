/**
 * Module 2 : portefeuille fictif d'entrainement.
 *
 * Le portefeuille est integralement virtuel. Les frais de transaction sont
 * simules et parametrables (pourcentage + montant fixe). Aucun ordre ne peut
 * etre passe sans une decision de journal correspondante (module 3).
 */
import { config } from '../config.js';
import { db, ensureAccount, nowIso, simulationSettings } from '../db/index.js';
import {
  actifParId,
  cotations,
  dernierPrixManuel,
  tousLesActifs,
  type Actif,
  type Cotation,
} from './cotations.js';
import { decision } from './journal.js';

export interface FraisCalcules {
  pourcentage: number;
  fixe: number;
  total: number;
}

export function calculerFrais(montantBrut: number): FraisCalcules {
  const { feePercent, feeFixed } = simulationSettings();
  const pourcentage = (montantBrut * feePercent) / 100;
  return {
    pourcentage: arrondi(pourcentage),
    fixe: feeFixed,
    total: arrondi(pourcentage + feeFixed),
  };
}

function arrondi(valeur: number, decimales = 2): number {
  const facteur = 10 ** decimales;
  return Math.round(valeur * facteur) / facteur;
}

export interface LignePosition {
  id: number;
  asset_id: number;
  status: 'ouverte' | 'cloturee';
  quantity: number;
  avg_cost: number;
  invested: number;
  realized_pnl: number;
  total_fees: number;
  opened_at: string;
  closed_at: string | null;
  opening_decision_id: number | null;
  closing_decision_id: number | null;
}

// --- Passage d'ordre -------------------------------------------------------

export interface DemandeOrdre {
  decisionId: number;
  quantite: number;
  /** Prix unitaire. Obligatoire si aucune cotation n'est disponible (mode degrade). */
  prixUnitaire?: number;
}

export interface ResultatOrdre {
  ordreId: number;
  positionId: number;
  side: 'achat' | 'vente';
  quantite: number;
  prixUnitaire: number;
  sourcePrix: string;
  frais: FraisCalcules;
  montantBrut: number;
  fluxNet: number;
  plusValueRealisee: number;
  positionCloturee: boolean;
  liquiditesRestantes: number;
  /** Messages purement descriptifs affiches apres l'ordre. */
  observations: string[];
}

export async function passerOrdre(demande: DemandeOrdre): Promise<ResultatOrdre> {
  const database = db();
  const compte = ensureAccount();

  const dec = decision(demande.decisionId);
  if (!dec) {
    throw new Error(
      "Aucune décision de journal ne correspond à cet identifiant. Renseignez d'abord le journal de décision.",
    );
  }
  if (dec.status !== 'brouillon') {
    throw new Error(
      'Cette décision de journal a déjà été exécutée ou annulée. Créez une nouvelle décision pour passer un nouvel ordre.',
    );
  }
  if (!(demande.quantite > 0)) throw new Error('La quantité doit être strictement positive.');

  const actif = actifParId(dec.asset_id);
  if (!actif) throw new Error('Actif inconnu.');

  // Prix : cotation si disponible, sinon saisie manuelle obligatoire.
  let prixUnitaire = demande.prixUnitaire;
  let sourcePrix = 'saisi à la main pour cet ordre';
  if (prixUnitaire === undefined) {
    const cotation = (await cotations([actif])).get(actif.id);
    if (!cotation?.prixEuros) {
      throw new Error(
        `Aucun prix disponible pour ${actif.symbol}. Saisissez un prix manuel pour passer cet ordre (mode dégradé).`,
      );
    }
    prixUnitaire = cotation.prixEuros;
    sourcePrix = cotation.source;
  }
  if (!(prixUnitaire > 0)) throw new Error('Le prix unitaire doit être strictement positif.');

  const montantBrut = arrondi(demande.quantite * prixUnitaire);
  const frais = calculerFrais(montantBrut);
  const observations: string[] = [];

  const positionOuverte = database
    .prepare("SELECT * FROM positions WHERE asset_id = ? AND status = 'ouverte'")
    .get(actif.id) as LignePosition | undefined;

  let positionId: number;
  let plusValueRealisee = 0;
  let fluxNet: number;
  let positionCloturee = false;

  if (dec.side === 'achat') {
    fluxNet = -arrondi(montantBrut + frais.total);
    if (compte.cash + fluxNet < -0.005) {
      throw new Error(
        `Liquidités insuffisantes : ${arrondi(montantBrut + frais.total)} € nécessaires (frais compris), ${arrondi(compte.cash)} € disponibles.`,
      );
    }

    if (positionOuverte) {
      const nouvelleQuantite = positionOuverte.quantity + demande.quantite;
      const nouveauCout = positionOuverte.invested + montantBrut + frais.total;
      database
        .prepare(
          'UPDATE positions SET quantity = ?, invested = ?, avg_cost = ?, total_fees = total_fees + ? WHERE id = ?',
        )
        .run(
          nouvelleQuantite,
          arrondi(nouveauCout, 6),
          arrondi(nouveauCout / nouvelleQuantite, 8),
          frais.total,
          positionOuverte.id,
        );
      positionId = positionOuverte.id;
    } else {
      const coutTotal = montantBrut + frais.total;
      const info = database
        .prepare(
          `INSERT INTO positions
             (asset_id, status, quantity, avg_cost, invested, realized_pnl, total_fees, opened_at, opening_decision_id)
           VALUES (?, 'ouverte', ?, ?, ?, 0, ?, ?, ?)`,
        )
        .run(
          actif.id,
          demande.quantite,
          arrondi(coutTotal / demande.quantite, 8),
          arrondi(coutTotal, 6),
          frais.total,
          nowIso(),
          dec.id,
        );
      positionId = Number(info.lastInsertRowid);
    }
  } else {
    if (!positionOuverte) {
      throw new Error(
        `Aucune position ouverte sur ${actif.symbol} : la vente à découvert n'est pas simulée dans cette application.`,
      );
    }
    if (demande.quantite > positionOuverte.quantity + 1e-9) {
      throw new Error(
        `Quantité supérieure à la position détenue (${positionOuverte.quantity} ${actif.symbol}).`,
      );
    }

    positionId = positionOuverte.id;
    const coutSorti = arrondi(positionOuverte.avg_cost * demande.quantite, 6);
    plusValueRealisee = arrondi(montantBrut - frais.total - coutSorti);
    fluxNet = arrondi(montantBrut - frais.total);

    const quantiteRestante = arrondi(positionOuverte.quantity - demande.quantite, 10);
    const investiRestant = arrondi(Math.max(0, positionOuverte.invested - coutSorti), 6);
    positionCloturee = quantiteRestante <= 1e-9;

    database
      .prepare(
        `UPDATE positions SET quantity = ?, invested = ?, realized_pnl = realized_pnl + ?,
                total_fees = total_fees + ?, status = ?, closed_at = ?, closing_decision_id = ?
           WHERE id = ?`,
      )
      .run(
        positionCloturee ? 0 : quantiteRestante,
        positionCloturee ? 0 : investiRestant,
        plusValueRealisee,
        frais.total,
        positionCloturee ? 'cloturee' : 'ouverte',
        positionCloturee ? nowIso() : null,
        positionCloturee ? dec.id : positionOuverte.closing_decision_id,
        positionOuverte.id,
      );

    if (positionCloturee) {
      observations.push(
        'La position est clôturée. Le journal attend maintenant votre bilan : il comparera ce qui était prévu à ce qui s’est passé.',
      );
    }
  }

  const infoOrdre = database
    .prepare(
      `INSERT INTO orders
         (position_id, asset_id, decision_id, side, quantity, unit_price, fees, gross, net, price_source, realized_pnl, executed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      positionId,
      actif.id,
      dec.id,
      dec.side,
      demande.quantite,
      prixUnitaire,
      frais.total,
      montantBrut,
      fluxNet,
      sourcePrix,
      plusValueRealisee,
      nowIso(),
    );

  const nouvellesLiquidites = arrondi(compte.cash + fluxNet);
  database.prepare('UPDATE account SET cash = ? WHERE id = 1').run(nouvellesLiquidites);
  database
    .prepare("UPDATE decisions SET status = 'executee', executed_at = ? WHERE id = ?")
    .run(nowIso(), dec.id);

  // Frais rapportes au montant engage : information factuelle, pas un jugement.
  const partFrais = montantBrut > 0 ? (frais.total / montantBrut) * 100 : 0;
  if (partFrais >= 1) {
    observations.push(
      `Les frais simulés représentent ${partFrais.toFixed(2)} % du montant de l’ordre. Sur de petits montants, la part fixe pèse lourd.`,
    );
  }

  await enregistrerInstantane();

  return {
    ordreId: Number(infoOrdre.lastInsertRowid),
    positionId,
    side: dec.side,
    quantite: demande.quantite,
    prixUnitaire,
    sourcePrix,
    frais,
    montantBrut,
    fluxNet,
    plusValueRealisee,
    positionCloturee,
    liquiditesRestantes: nouvellesLiquidites,
    observations,
  };
}

// --- Valorisation ----------------------------------------------------------

export interface PositionValorisee {
  positionId: number;
  actifId: number;
  symbole: string;
  nom: string;
  classe: 'action' | 'etf' | 'crypto';
  quantite: number;
  prixMoyen: number;
  investi: number;
  prixActuel: number | null;
  sourcePrix: string;
  avertissementPrix: string | null;
  valeur: number | null;
  plusValueLatente: number | null;
  plusValueLatentePourcent: number | null;
  plusValueRealisee: number;
  fraisCumules: number;
  poidsPourcent: number | null;
  ouvertLe: string;
  decisionOuverture: {
    id: number;
    these: string;
    horizon: string;
    horizonMois: number;
    risqueAccepteEuros: number;
    conditionInvalidation: string;
  } | null;
  /** Perte latente rapportee au risque annonce dans le journal. */
  suiviRisque: {
    risqueAccepteEuros: number;
    perteLatenteEuros: number;
    partDuRisqueConsomme: number | null;
    depasse: boolean;
  } | null;
}

export interface Alerte {
  type: 'concentration' | 'diversification' | 'prix' | 'liquidites';
  gravite: 'information' | 'attention';
  message: string;
}

export interface EtatPortefeuille {
  liquidites: number;
  capitalDepart: number;
  valeurInvestie: number;
  valeurTotale: number;
  performanceEuros: number;
  performancePourcent: number;
  plusValueLatente: number;
  plusValueRealisee: number;
  fraisCumules: number;
  positions: PositionValorisee[];
  repartition: { classe: string; libelle: string; valeur: number; pourcent: number }[];
  repartitionAvecLiquidites: { classe: string; libelle: string; valeur: number; pourcent: number }[];
  alertes: Alerte[];
  parametres: { fraisPourcent: number; fraisFixe: number; seuilConcentration: number };
  comparaisonIndice: ComparaisonIndice | null;
  historique: { date: string; portefeuille: number; indice: number | null }[];
}

const libelles: Record<string, string> = {
  action: 'Actions',
  etf: 'ETF',
  crypto: 'Cryptomonnaies',
  liquidites: 'Liquidités',
};

export interface ComparaisonIndice {
  symbole: string;
  nom: string;
  depuis: string;
  performancePortefeuillePourcent: number;
  performanceIndicePourcent: number | null;
  ecartPoints: number | null;
  avertissement: string;
}

export async function etatPortefeuille(): Promise<EtatPortefeuille> {
  const database = db();
  const compte = ensureAccount();
  const parametres = simulationSettings();

  const positions = database
    .prepare("SELECT * FROM positions WHERE status = 'ouverte' AND quantity > 0")
    .all() as LignePosition[];

  const actifsConcernes = positions
    .map((p) => actifParId(p.asset_id))
    .filter((a): a is Actif => a !== null);

  const prix = actifsConcernes.length > 0 ? await cotations(actifsConcernes) : new Map<number, Cotation>();

  const valorisees: PositionValorisee[] = positions.map((position) => {
    const actif = actifsConcernes.find((a) => a.id === position.asset_id)!;
    const cotation = prix.get(position.asset_id);
    const prixActuel = cotation?.prixEuros ?? null;
    const valeur = prixActuel !== null ? arrondi(prixActuel * position.quantity) : null;
    const plusValueLatente = valeur !== null ? arrondi(valeur - position.invested) : null;

    const dec = position.opening_decision_id
      ? (database.prepare('SELECT * FROM decisions WHERE id = ?').get(position.opening_decision_id) as
          | {
              id: number;
              thesis: string;
              horizon: string;
              horizon_months: number;
              risk_accepted_eur: number;
              invalidation_condition: string;
            }
          | undefined)
      : undefined;

    const perteLatente = plusValueLatente !== null && plusValueLatente < 0 ? -plusValueLatente : 0;

    return {
      positionId: position.id,
      actifId: position.asset_id,
      symbole: actif.symbol,
      nom: actif.name,
      classe: actif.asset_class,
      quantite: position.quantity,
      prixMoyen: position.avg_cost,
      investi: position.invested,
      prixActuel,
      sourcePrix: cotation?.source ?? 'indisponible',
      avertissementPrix: cotation?.avertissement ?? null,
      valeur,
      plusValueLatente,
      plusValueLatentePourcent:
        plusValueLatente !== null && position.invested > 0
          ? arrondi((plusValueLatente / position.invested) * 100)
          : null,
      plusValueRealisee: position.realized_pnl,
      fraisCumules: position.total_fees,
      poidsPourcent: null,
      ouvertLe: position.opened_at,
      decisionOuverture: dec
        ? {
            id: dec.id,
            these: dec.thesis,
            horizon: dec.horizon,
            horizonMois: dec.horizon_months,
            risqueAccepteEuros: dec.risk_accepted_eur,
            conditionInvalidation: dec.invalidation_condition,
          }
        : null,
      suiviRisque:
        dec && dec.risk_accepted_eur > 0
          ? {
              risqueAccepteEuros: dec.risk_accepted_eur,
              perteLatenteEuros: arrondi(perteLatente),
              partDuRisqueConsomme: arrondi((perteLatente / dec.risk_accepted_eur) * 100),
              depasse: perteLatente > dec.risk_accepted_eur,
            }
          : null,
    };
  });

  const valeurInvestie = arrondi(
    valorisees.reduce((somme, p) => somme + (p.valeur ?? p.investi), 0),
  );
  const valeurTotale = arrondi(compte.cash + valeurInvestie);

  for (const p of valorisees) {
    const base = p.valeur ?? p.investi;
    p.poidsPourcent = valeurTotale > 0 ? arrondi((base / valeurTotale) * 100) : null;
  }
  valorisees.sort((a, b) => (b.poidsPourcent ?? 0) - (a.poidsPourcent ?? 0));

  // Repartition par classe d'actif
  const parClasse = new Map<string, number>();
  for (const p of valorisees) {
    parClasse.set(p.classe, (parClasse.get(p.classe) ?? 0) + (p.valeur ?? p.investi));
  }
  const repartition = [...parClasse.entries()].map(([classe, valeur]) => ({
    classe,
    libelle: libelles[classe] ?? classe,
    valeur: arrondi(valeur),
    pourcent: valeurInvestie > 0 ? arrondi((valeur / valeurInvestie) * 100) : 0,
  }));
  const repartitionAvecLiquidites = [
    ...repartition.map((r) => ({
      ...r,
      pourcent: valeurTotale > 0 ? arrondi((r.valeur / valeurTotale) * 100) : 0,
    })),
    {
      classe: 'liquidites',
      libelle: libelles.liquidites,
      valeur: arrondi(compte.cash),
      pourcent: valeurTotale > 0 ? arrondi((compte.cash / valeurTotale) * 100) : 0,
    },
  ];

  const plusValueLatente = arrondi(
    valorisees.reduce((somme, p) => somme + (p.plusValueLatente ?? 0), 0),
  );
  const plusValueRealisee = arrondi(
    (
      database.prepare('SELECT COALESCE(SUM(realized_pnl), 0) AS s FROM orders').get() as {
        s: number;
      }
    ).s,
  );
  const fraisCumules = arrondi(
    (database.prepare('SELECT COALESCE(SUM(fees), 0) AS s FROM orders').get() as { s: number }).s,
  );

  return {
    liquidites: arrondi(compte.cash),
    capitalDepart: compte.starting_cash,
    valeurInvestie,
    valeurTotale,
    performanceEuros: arrondi(valeurTotale - compte.starting_cash),
    performancePourcent:
      compte.starting_cash > 0
        ? arrondi(((valeurTotale - compte.starting_cash) / compte.starting_cash) * 100)
        : 0,
    plusValueLatente,
    plusValueRealisee,
    fraisCumules,
    positions: valorisees,
    repartition,
    repartitionAvecLiquidites,
    alertes: construireAlertes(valorisees, repartition, valeurInvestie, valeurTotale, parametres),
    parametres: {
      fraisPourcent: parametres.feePercent,
      fraisFixe: parametres.feeFixed,
      seuilConcentration: parametres.concentrationAlertPercent,
    },
    comparaisonIndice: await comparerIndice(valeurTotale, compte.starting_cash),
    historique: historiqueInstantanes(),
  };
}

/**
 * Alertes visuelles. Elles sont descriptives : elles signalent un fait mesure
 * sur le portefeuille et n'indiquent jamais quoi acheter ni quoi vendre.
 */
function construireAlertes(
  positions: PositionValorisee[],
  repartition: { classe: string; libelle: string; valeur: number; pourcent: number }[],
  valeurInvestie: number,
  valeurTotale: number,
  parametres: { concentrationAlertPercent: number },
): Alerte[] {
  const alertes: Alerte[] = [];
  const seuil = parametres.concentrationAlertPercent;

  for (const position of positions) {
    if ((position.poidsPourcent ?? 0) > seuil) {
      alertes.push({
        type: 'concentration',
        gravite: 'attention',
        message: `${position.symbole} représente ${position.poidsPourcent} % du portefeuille, au-delà du repère de vigilance de ${seuil} %. Un événement propre à ce seul actif affecterait fortement l’ensemble.`,
      });
    }
    if (position.prixActuel === null) {
      alertes.push({
        type: 'prix',
        gravite: 'information',
        message: `Aucun prix disponible pour ${position.symbole} : la ligne est valorisée à son coût d’achat. Saisissez un prix manuel pour une valorisation à jour.`,
      });
    }
    if (position.suiviRisque?.depasse) {
      alertes.push({
        type: 'concentration',
        gravite: 'attention',
        message: `La perte latente sur ${position.symbole} (${position.suiviRisque.perteLatenteEuros} €) dépasse le risque de ${position.suiviRisque.risqueAccepteEuros} € que vous aviez inscrit au journal.`,
      });
    }
  }

  if (positions.length > 0 && positions.length < 3) {
    alertes.push({
      type: 'diversification',
      gravite: 'attention',
      message: `Le portefeuille ne compte que ${positions.length} ligne(s). Le risque spécifique d’un actif n’est pratiquement pas amorti.`,
    });
  }

  if (repartition.length === 1 && positions.length > 1) {
    alertes.push({
      type: 'diversification',
      gravite: 'attention',
      message: `Toutes les positions appartiennent à la même classe d’actif (${repartition[0].libelle}). Ces actifs réagissent largement aux mêmes événements.`,
    });
  }

  const classeDominante = repartition.find((r) => r.pourcent > 70);
  if (classeDominante && repartition.length > 1) {
    alertes.push({
      type: 'diversification',
      gravite: 'information',
      message: `${classeDominante.libelle} représente ${classeDominante.pourcent} % de la valeur investie. La corrélation interne à une classe d’actif limite l’effet de la diversification.`,
    });
  }

  const crypto = repartition.find((r) => r.classe === 'crypto');
  if (crypto && valeurTotale > 0 && (crypto.valeur / valeurTotale) * 100 > 25) {
    alertes.push({
      type: 'diversification',
      gravite: 'attention',
      message: `La poche crypto pèse ${arrondi((crypto.valeur / valeurTotale) * 100)} % du portefeuille total. Rappel factuel : cette classe d’actifs a connu des baisses de 70 à 85 % étalées sur plusieurs mois.`,
    });
  }

  if (valeurInvestie > 0 && valeurTotale > 0) {
    const partLiquidites = ((valeurTotale - valeurInvestie) / valeurTotale) * 100;
    if (partLiquidites < 2) {
      alertes.push({
        type: 'liquidites',
        gravite: 'information',
        message:
          'Les liquidités du portefeuille d’entraînement sont presque entièrement engagées : aucune marge pour un ordre supplémentaire.',
      });
    }
  }

  return alertes;
}

// --- Instantanes et comparaison a un indice --------------------------------

function actifIndice(): Actif | null {
  const parametre = db()
    .prepare('SELECT value FROM settings WHERE key = ?')
    .get('benchmark_symbol') as { value: string } | undefined;
  if (parametre) {
    const choisi = db().prepare('SELECT * FROM assets WHERE symbol = ?').get(parametre.value) as
      | Actif
      | undefined;
    if (choisi) return choisi;
  }
  return (
    (db()
      .prepare('SELECT * FROM assets WHERE is_benchmark = 1 ORDER BY id LIMIT 1')
      .get() as Actif | undefined) ?? null
  );
}

/** Enregistre une photographie du portefeuille et de l'indice pour la journee. */
export async function enregistrerInstantane(): Promise<void> {
  const database = db();
  const compte = ensureAccount();
  const positions = database
    .prepare("SELECT * FROM positions WHERE status = 'ouverte' AND quantity > 0")
    .all() as LignePosition[];

  const actifsConcernes = positions
    .map((p) => actifParId(p.asset_id))
    .filter((a): a is Actif => a !== null);
  const indice = actifIndice();
  const aCoter = indice ? [...actifsConcernes, indice] : actifsConcernes;
  const prix = aCoter.length > 0 ? await cotations(aCoter) : new Map<number, Cotation>();

  const valeurInvestie = positions.reduce((somme, position) => {
    const p = prix.get(position.asset_id)?.prixEuros;
    return somme + (p !== null && p !== undefined ? p * position.quantity : position.invested);
  }, 0);

  const prixIndice = indice
    ? (prix.get(indice.id)?.prixEuros ?? dernierPrixManuel(indice.id)?.price ?? null)
    : null;

  const jour = new Date().toISOString().slice(0, 10);
  database
    .prepare(
      `INSERT INTO portfolio_snapshots (as_of, total_value, cash, invested_value, benchmark_value)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(as_of) DO UPDATE SET
         total_value = excluded.total_value,
         cash = excluded.cash,
         invested_value = excluded.invested_value,
         benchmark_value = COALESCE(excluded.benchmark_value, portfolio_snapshots.benchmark_value)`,
    )
    .run(jour, arrondi(compte.cash + valeurInvestie), arrondi(compte.cash), arrondi(valeurInvestie), prixIndice);
}

export function historiqueInstantanes() {
  return (
    db()
      .prepare(
        'SELECT as_of AS date, total_value AS portefeuille, benchmark_value AS indice FROM portfolio_snapshots ORDER BY as_of',
      )
      .all() as { date: string; portefeuille: number; indice: number | null }[]
  );
}

async function comparerIndice(
  valeurTotale: number,
  capitalDepart: number,
): Promise<ComparaisonIndice | null> {
  const indice = actifIndice();
  if (!indice) return null;

  const instantanes = historiqueInstantanes().filter((i) => i.indice !== null);
  const premier = instantanes[0];
  const performancePortefeuille =
    capitalDepart > 0 ? arrondi(((valeurTotale - capitalDepart) / capitalDepart) * 100) : 0;

  let performanceIndice: number | null = null;
  if (premier && premier.indice) {
    const cotation = (await cotations([indice])).get(indice.id);
    const prixActuel = cotation?.prixEuros ?? dernierPrixManuel(indice.id)?.price ?? null;
    if (prixActuel) {
      performanceIndice = arrondi(((prixActuel - premier.indice) / premier.indice) * 100);
    }
  }

  return {
    symbole: indice.symbol,
    nom: indice.name,
    depuis: premier?.date ?? '',
    performancePortefeuillePourcent: performancePortefeuille,
    performanceIndicePourcent: performanceIndice,
    ecartPoints:
      performanceIndice !== null ? arrondi(performancePortefeuille - performanceIndice) : null,
    avertissement:
      "Comparaison indicative depuis le premier relevé enregistré. Vérifiez si la série de l'indice inclut ou non les dividendes (versions PR, NR, GR) : l'écart change le sens de la comparaison. Une comparaison passée ne dit rien de l'avenir.",
  };
}

// --- Ordres, positions cloturees, parametres --------------------------------

export function historiqueOrdres(limite = 200) {
  return db()
    .prepare(
      `SELECT o.*, a.symbol, a.name, a.asset_class, d.thesis, d.horizon, d.kind
         FROM orders o
         JOIN assets a ON a.id = o.asset_id
         JOIN decisions d ON d.id = o.decision_id
        ORDER BY o.executed_at DESC LIMIT ?`,
    )
    .all(limite);
}

export function reinitialiserPortefeuille(): void {
  const database = db();
  database.transaction(() => {
    database.exec(`
      DELETE FROM reviews;
      DELETE FROM orders;
      DELETE FROM positions;
      DELETE FROM decisions;
      DELETE FROM portfolio_snapshots;
    `);
    database
      .prepare('UPDATE account SET cash = starting_cash WHERE id = 1')
      .run();
  })();
}

export function definirParametres(entree: {
  fraisPourcent?: number;
  fraisFixe?: number;
  seuilConcentration?: number;
  symboleIndice?: string;
}): void {
  const database = db();
  const poser = database.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
  );
  if (entree.fraisPourcent !== undefined) poser.run('fee_percent', String(entree.fraisPourcent));
  if (entree.fraisFixe !== undefined) poser.run('fee_fixed', String(entree.fraisFixe));
  if (entree.seuilConcentration !== undefined) {
    poser.run('concentration_alert_percent', String(entree.seuilConcentration));
  }
  if (entree.symboleIndice !== undefined) poser.run('benchmark_symbol', entree.symboleIndice);
}

export function parametresActuels() {
  const parametres = simulationSettings();
  const indice = actifIndice();
  return {
    fraisPourcent: parametres.feePercent,
    fraisFixe: parametres.feeFixed,
    seuilConcentration: parametres.concentrationAlertPercent,
    capitalDepart: config.simulation.startingCash,
    symboleIndice: indice?.symbol ?? null,
    indicesDisponibles: (
      db().prepare('SELECT symbol, name FROM assets ORDER BY symbol').all() as {
        symbol: string;
        name: string;
      }[]
    ).map((a) => ({ symbole: a.symbol, nom: a.name })),
  };
}

export function actifsDisponibles() {
  const actifs = tousLesActifs();
  return actifs.map((actif) => {
    const manuel = dernierPrixManuel(actif.id);
    const position = db()
      .prepare("SELECT quantity FROM positions WHERE asset_id = ? AND status = 'ouverte'")
      .get(actif.id) as { quantity: number } | undefined;
    return {
      id: actif.id,
      symbole: actif.symbol,
      nom: actif.name,
      classe: actif.asset_class,
      fournisseur: actif.provider,
      referenceFournisseur: actif.provider_ref,
      devise: actif.currency,
      estIndice: actif.is_benchmark === 1,
      notes: actif.notes,
      dernierPrixManuel: manuel?.price ?? null,
      dernierPrixManuelDate: manuel?.as_of ?? null,
      quantiteDetenue: position?.quantity ?? 0,
    };
  });
}

export function positionsCloturees() {
  return db()
    .prepare(
      `SELECT p.*, a.symbol, a.name, a.asset_class,
              d.thesis, d.horizon, d.horizon_months, d.risk_accepted_eur,
              d.invalidation_condition, d.conviction, d.created_at AS decision_date,
              r.id AS review_id, r.what_happened, r.thesis_outcome, r.invalidation_triggered,
              r.invalidation_respected, r.exit_reason, r.emotion AS review_emotion, r.lesson
         FROM positions p
         JOIN assets a ON a.id = p.asset_id
         LEFT JOIN decisions d ON d.id = p.opening_decision_id
         LEFT JOIN reviews r ON r.position_id = p.id
        WHERE p.status = 'cloturee'
        ORDER BY p.closed_at DESC`,
    )
    .all();
}
