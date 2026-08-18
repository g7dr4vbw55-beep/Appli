/**
 * Module 3 : bilan d'erreurs et detection de schemas repetitifs.
 *
 * Tous les constats produits ici sont DESCRIPTIFS et FACTUELS. Ils comparent
 * ce qui avait ete ecrit avant l'ordre a ce qui s'est reellement passe. Ils ne
 * portent aucun jugement sur la personne, ne notent pas ses decisions et ne
 * suggerent aucune action de marche.
 */
import { db } from '../db/index.js';

function arrondi(valeur: number, decimales = 2): number {
  const facteur = 10 ** decimales;
  return Math.round(valeur * facteur) / facteur;
}

function jours(depuis: string, jusqu: string): number {
  return Math.max(
    0,
    Math.round((new Date(jusqu).getTime() - new Date(depuis).getTime()) / 86_400_000),
  );
}

export interface EcartPrevuRealise {
  positionId: number;
  symbole: string;
  nom: string;
  classe: string;
  ouvertLe: string;
  clotureLe: string | null;
  dureeDetentionJours: number;
  horizonPrevuMois: number | null;
  horizonPrevuJours: number | null;
  /** Duree reelle rapportee a l'horizon annonce, en pourcentage. */
  respectHorizonPourcent: number | null;
  horizonTenu: boolean | null;
  risqueAccepteEuros: number | null;
  resultatRealiseEuros: number;
  resultatRealisePourcent: number | null;
  perteAuDelaDuRisqueAnnonce: boolean | null;
  these: string | null;
  conditionInvalidation: string | null;
  invalidationDeclenchee: boolean | null;
  invalidationRespectee: boolean | null;
  issueThese: string | null;
  raisonSortie: string | null;
  bilanRedige: boolean;
  lecon: string | null;
  /** Constats factuels propres a cette position. */
  constats: string[];
}

interface LignePositionCloturee {
  id: number;
  asset_id: number;
  symbol: string;
  name: string;
  asset_class: string;
  opened_at: string;
  closed_at: string | null;
  realized_pnl: number;
  total_fees: number;
  horizon_months: number | null;
  risk_accepted_eur: number | null;
  thesis: string | null;
  invalidation_condition: string | null;
  review_id: number | null;
  thesis_outcome: string | null;
  invalidation_triggered: number | null;
  invalidation_respected: number | null;
  exit_reason: string | null;
  lesson: string | null;
}

const libellesRaison: Record<string, string> = {
  these_atteinte: 'thèse atteinte',
  invalidation: 'condition d’invalidation atteinte',
  besoin_argent: 'besoin de liquidités',
  peur: 'inquiétude face à la baisse',
  euphorie: 'euphorie après une hausse',
  rebalancement: 'rééquilibrage du portefeuille',
  autre: 'autre motif',
};

/** Ecart entre ce qui etait prevu et ce qui s'est passe, position par position. */
export function ecartsPrevuRealise(): EcartPrevuRealise[] {
  const lignes = db()
    .prepare(
      `SELECT p.id, p.asset_id, p.opened_at, p.closed_at, p.realized_pnl, p.total_fees,
              a.symbol, a.name, a.asset_class,
              d.horizon_months, d.risk_accepted_eur, d.thesis, d.invalidation_condition,
              r.id AS review_id, r.thesis_outcome, r.invalidation_triggered,
              r.invalidation_respected, r.exit_reason, r.lesson
         FROM positions p
         JOIN assets a ON a.id = p.asset_id
         LEFT JOIN decisions d ON d.id = p.opening_decision_id
         LEFT JOIN reviews r ON r.position_id = p.id
        WHERE p.status = 'cloturee'
        ORDER BY p.closed_at DESC`,
    )
    .all() as LignePositionCloturee[];

  return lignes.map((ligne) => {
    const duree = jours(ligne.opened_at, ligne.closed_at ?? new Date().toISOString());
    const horizonJours = ligne.horizon_months ? Math.round(ligne.horizon_months * 30.44) : null;
    const respect = horizonJours && horizonJours > 0 ? arrondi((duree / horizonJours) * 100) : null;

    const investi = (
      db()
        .prepare(
          "SELECT COALESCE(SUM(gross + fees), 0) AS s FROM orders WHERE position_id = ? AND side = 'achat'",
        )
        .get(ligne.id) as { s: number }
    ).s;

    const constats: string[] = [];

    if (respect !== null && respect < 50) {
      constats.push(
        `Position détenue ${duree} jour(s) pour un horizon annoncé de ${ligne.horizon_months} mois (${respect} % de la durée prévue).`,
      );
    }
    if (
      ligne.risk_accepted_eur !== null &&
      ligne.risk_accepted_eur > 0 &&
      ligne.realized_pnl < -ligne.risk_accepted_eur
    ) {
      constats.push(
        `Perte réalisée de ${arrondi(-ligne.realized_pnl)} € pour un risque annoncé de ${ligne.risk_accepted_eur} €.`,
      );
    }
    if (ligne.invalidation_triggered === 1 && ligne.invalidation_respected === 0) {
      constats.push(
        'La condition d’invalidation écrite avant l’achat a été atteinte, et la position a été conservée au-delà.',
      );
    }
    if (ligne.invalidation_triggered === 0 && ligne.realized_pnl < 0 && ligne.exit_reason === 'peur') {
      constats.push(
        'Sortie en perte alors que la condition d’invalidation annoncée n’était pas atteinte, avec l’inquiétude comme motif déclaré.',
      );
    }
    if (!ligne.review_id) {
      constats.push('Aucun bilan n’a encore été rédigé pour cette position clôturée.');
    }
    if (ligne.total_fees > 0 && investi > 0 && (ligne.total_fees / investi) * 100 > 2) {
      constats.push(
        `Les frais simulés ont représenté ${arrondi((ligne.total_fees / investi) * 100)} % du montant engagé sur cette position.`,
      );
    }

    return {
      positionId: ligne.id,
      symbole: ligne.symbol,
      nom: ligne.name,
      classe: ligne.asset_class,
      ouvertLe: ligne.opened_at,
      clotureLe: ligne.closed_at,
      dureeDetentionJours: duree,
      horizonPrevuMois: ligne.horizon_months,
      horizonPrevuJours: horizonJours,
      respectHorizonPourcent: respect,
      horizonTenu: respect === null ? null : respect >= 80,
      risqueAccepteEuros: ligne.risk_accepted_eur,
      resultatRealiseEuros: arrondi(ligne.realized_pnl),
      resultatRealisePourcent: investi > 0 ? arrondi((ligne.realized_pnl / investi) * 100) : null,
      perteAuDelaDuRisqueAnnonce:
        ligne.risk_accepted_eur && ligne.risk_accepted_eur > 0
          ? ligne.realized_pnl < -ligne.risk_accepted_eur
          : null,
      these: ligne.thesis,
      conditionInvalidation: ligne.invalidation_condition,
      invalidationDeclenchee:
        ligne.invalidation_triggered === null ? null : ligne.invalidation_triggered === 1,
      invalidationRespectee:
        ligne.invalidation_respected === null ? null : ligne.invalidation_respected === 1,
      issueThese: ligne.thesis_outcome,
      raisonSortie: ligne.exit_reason ? (libellesRaison[ligne.exit_reason] ?? ligne.exit_reason) : null,
      bilanRedige: ligne.review_id !== null,
      lecon: ligne.lesson,
      constats,
    };
  });
}

export interface Schema {
  code: string;
  titre: string;
  /** Constat factuel, sans jugement. */
  constat: string;
  occurrences: number;
  total: number;
  /** Rappel pedagogique et renvoi vers la lecon correspondante. */
  rappel: string;
  leconSlug: string | null;
  intensite: 'observe' | 'recurrent';
}

/**
 * Detection de schemas repetitifs. Un schema n'est signale qu'a partir de deux
 * occurrences, ou d'une occurrence sur un tres petit historique, et le nombre
 * d'occurrences est toujours affiche avec son denominateur.
 */
export function schemasRepetitifs(): { schemas: Schema[]; volumetrie: Volumetrie } {
  const database = db();
  const ecarts = ecartsPrevuRealise();
  const schemas: Schema[] = [];

  const ajouter = (
    code: string,
    titre: string,
    occurrences: number,
    total: number,
    constat: string,
    rappel: string,
    leconSlug: string | null,
    seuil = 2,
  ) => {
    if (occurrences >= seuil) {
      schemas.push({
        code,
        titre,
        constat,
        occurrences,
        total,
        rappel,
        leconSlug,
        intensite: total > 0 && occurrences / total >= 0.5 ? 'recurrent' : 'observe',
      });
    }
  };

  // 1. Sortie en perte peu de temps apres l'ouverture (capitulation)
  const ventesRapidesEnPerte = ecarts.filter(
    (e) => e.resultatRealiseEuros < 0 && e.dureeDetentionJours <= 30 && (e.horizonPrevuMois ?? 0) >= 6,
  );
  ajouter(
    'capitulation',
    'Sorties en perte peu après l’ouverture',
    ventesRapidesEnPerte.length,
    ecarts.length,
    `${ventesRapidesEnPerte.length} position(s) sur ${ecarts.length} ont été clôturées en perte en 30 jours ou moins, alors que l’horizon annoncé était de six mois ou plus (${ventesRapidesEnPerte
      .map((e) => e.symbole)
      .join(', ')}).`,
    'La leçon sur la FOMO et la capitulation décrit ce moment : la vente après une baisse procure un soulagement immédiat, souvent confondu avec une bonne décision.',
    'fomo-et-capitulation',
  );

  // 2. Horizon annonce non tenu
  const horizonNonTenu = ecarts.filter(
    (e) => e.respectHorizonPourcent !== null && e.respectHorizonPourcent < 50,
  );
  ajouter(
    'horizon',
    'Horizon de détention nettement plus court que prévu',
    horizonNonTenu.length,
    ecarts.length,
    `${horizonNonTenu.length} position(s) sur ${ecarts.length} ont été détenues moins de la moitié de la durée annoncée au journal.`,
    'L’horizon est une date, pas une intention. Un écart systématique entre l’horizon écrit et la durée réelle indique que l’horizon annoncé ne correspondait pas au projet réel.',
    'horizon-de-placement',
  );

  // 3. Condition d'invalidation atteinte mais non respectee
  const invalidationIgnoree = ecarts.filter(
    (e) => e.invalidationDeclenchee === true && e.invalidationRespectee === false,
  );
  ajouter(
    'invalidation-ignoree',
    'Condition d’invalidation atteinte sans action',
    invalidationIgnoree.length,
    ecarts.filter((e) => e.invalidationDeclenchee !== null).length,
    `${invalidationIgnoree.length} position(s) où la condition d’invalidation écrite avant l’achat a été atteinte et la position conservée au-delà.`,
    'Une condition d’invalidation qui n’est pas suivie ne remplit plus sa fonction : elle servait précisément à contourner le biais de confirmation, qui ne se ressent pas de l’intérieur.',
    'biais-de-confirmation',
  );

  // 4. Concentration : part du plus gros ordre unique dans le total engage
  const engagementParActif = database
    .prepare(
      `SELECT a.symbol, SUM(o.gross + o.fees) AS montant
         FROM orders o JOIN assets a ON a.id = o.asset_id
        WHERE o.side = 'achat'
        GROUP BY a.symbol ORDER BY montant DESC`,
    )
    .all() as { symbol: string; montant: number }[];
  const totalEngage = engagementParActif.reduce((s, e) => s + e.montant, 0);
  if (engagementParActif.length > 0 && totalEngage > 0) {
    const premier = engagementParActif[0];
    const part = arrondi((premier.montant / totalEngage) * 100);
    if (part > 40 && engagementParActif.length >= 2) {
      schemas.push({
        code: 'concentration',
        titre: 'Concentration des montants engagés sur un seul actif',
        constat: `${part} % du total acheté depuis le début a porté sur ${premier.symbol}, réparti sur ${engagementParActif.length} actif(s) différents au total.`,
        occurrences: 1,
        total: engagementParActif.length,
        rappel:
          'La diversification se mesure par la corrélation des expositions réelles, pas par le nombre de lignes. Le risque spécifique d’un actif n’est amorti que s’il pèse peu.',
        leconSlug: 'diversification',
        intensite: part > 60 ? 'recurrent' : 'observe',
      });
    }
  }

  // 5. Renforcement a la baisse : achat sous le prix moyen deja paye
  const renforcementsBaisse = compterRenforcementsALaBaisse();
  ajouter(
    'moyenner-baisse',
    'Renforcements effectués sous le prix moyen déjà payé',
    renforcementsBaisse.occurrences,
    renforcementsBaisse.totalRenforcements,
    `${renforcementsBaisse.occurrences} renforcement(s) sur ${renforcementsBaisse.totalRenforcements} ont été passés à un prix inférieur au prix moyen déjà payé sur la ligne (${renforcementsBaisse.symboles.join(', ')}).`,
    'Le renforcement à la baisse est défendable s’il était prévu et chiffré d’avance. Improvisé, il augmente l’exposition à une thèse qui se comporte moins bien que prévu.',
    'taille-de-position',
  );

  // 6. Effet de disposition : gagnantes vendues plus vite que les perdantes
  const gagnantes = ecarts.filter((e) => e.resultatRealiseEuros > 0);
  const perdantes = ecarts.filter((e) => e.resultatRealiseEuros < 0);
  if (gagnantes.length >= 2 && perdantes.length >= 2) {
    const moyenne = (liste: EcartPrevuRealise[]) =>
      liste.reduce((s, e) => s + e.dureeDetentionJours, 0) / liste.length;
    const dureeGagnantes = arrondi(moyenne(gagnantes), 0);
    const dureePerdantes = arrondi(moyenne(perdantes), 0);
    if (dureeGagnantes < dureePerdantes * 0.7) {
      schemas.push({
        code: 'effet-disposition',
        titre: 'Positions gagnantes conservées moins longtemps que les perdantes',
        constat: `Durée moyenne de détention : ${dureeGagnantes} jour(s) pour les positions clôturées en gain (${gagnantes.length}), ${dureePerdantes} jour(s) pour celles clôturées en perte (${perdantes.length}).`,
        occurrences: gagnantes.length,
        total: ecarts.length,
        rappel:
          'Ce déséquilibre est documenté sous le nom d’effet de disposition. Il découle de l’aversion à la perte : une perte est ressentie environ deux fois plus fort qu’un gain équivalent.',
        leconSlug: 'biais-de-confirmation',
        intensite: 'observe',
      });
    }
  }

  // 7. Bilans manquants
  const sansBilan = ecarts.filter((e) => !e.bilanRedige);
  ajouter(
    'bilan-manquant',
    'Positions clôturées sans bilan',
    sansBilan.length,
    ecarts.length,
    `${sansBilan.length} position(s) clôturée(s) sur ${ecarts.length} n’ont pas encore de bilan rédigé.`,
    'Le bilan est ce qui permet de se relire : sans lui, l’écart entre l’intention écrite et le résultat n’est jamais constaté.',
    null,
    1,
  );

  // 8. Poids des frais simules
  const totaux = database
    .prepare('SELECT COALESCE(SUM(fees),0) AS frais, COALESCE(SUM(gross),0) AS brut FROM orders')
    .get() as { frais: number; brut: number };
  if (totaux.brut > 0 && (totaux.frais / totaux.brut) * 100 > 1.5) {
    schemas.push({
      code: 'frais',
      titre: 'Poids des frais simulés sur l’ensemble des ordres',
      constat: `${arrondi(totaux.frais)} € de frais simulés pour ${arrondi(totaux.brut)} € échangés, soit ${arrondi((totaux.frais / totaux.brut) * 100)} % du montant total.`,
      occurrences: 1,
      total: 1,
      rappel:
        'Les frais sont le seul paramètre presque entièrement sous contrôle de l’investisseur. Une part fixe pèse d’autant plus lourd que les ordres sont petits et nombreux.',
      leconSlug: 'impact-des-frais',
      intensite: 'observe',
    });
  }

  return { schemas, volumetrie: volumetrie(ecarts) };
}

function compterRenforcementsALaBaisse(): {
  occurrences: number;
  totalRenforcements: number;
  symboles: string[];
} {
  const database = db();
  const positions = database.prepare('SELECT id FROM positions').all() as { id: number }[];
  let occurrences = 0;
  let totalRenforcements = 0;
  const symboles = new Set<string>();

  for (const position of positions) {
    const ordres = database
      .prepare(
        `SELECT o.side, o.quantity, o.unit_price, o.fees, o.gross, a.symbol
           FROM orders o JOIN assets a ON a.id = o.asset_id
          WHERE o.position_id = ? ORDER BY o.executed_at`,
      )
      .all(position.id) as {
      side: 'achat' | 'vente';
      quantity: number;
      unit_price: number;
      fees: number;
      gross: number;
      symbol: string;
    }[];

    let quantite = 0;
    let cout = 0;
    for (const ordre of ordres) {
      if (ordre.side === 'achat') {
        if (quantite > 0) {
          totalRenforcements += 1;
          const prixMoyen = cout / quantite;
          if (ordre.unit_price < prixMoyen) {
            occurrences += 1;
            symboles.add(ordre.symbol);
          }
        }
        quantite += ordre.quantity;
        cout += ordre.gross + ordre.fees;
      } else {
        const prixMoyen = quantite > 0 ? cout / quantite : 0;
        cout -= prixMoyen * ordre.quantity;
        quantite -= ordre.quantity;
      }
    }
  }

  return { occurrences, totalRenforcements, symboles: [...symboles] };
}

export interface Volumetrie {
  decisionsEcrites: number;
  decisionsExecutees: number;
  decisionsAnnulees: number;
  ordresPasses: number;
  positionsOuvertes: number;
  positionsCloturees: number;
  bilansRediges: number;
  dureeDetentionMoyenneJours: number | null;
  tauxRespectHorizon: number | null;
  resultatRealiseTotal: number;
  fraisCumules: number;
}

function volumetrie(ecarts: EcartPrevuRealise[]): Volumetrie {
  const database = db();
  const compter = (sql: string, ...params: unknown[]) =>
    (database.prepare(sql).get(...(params as [])) as { n: number }).n;

  const avecHorizon = ecarts.filter((e) => e.horizonTenu !== null);

  return {
    decisionsEcrites: compter('SELECT COUNT(*) AS n FROM decisions'),
    decisionsExecutees: compter("SELECT COUNT(*) AS n FROM decisions WHERE status = 'executee'"),
    decisionsAnnulees: compter("SELECT COUNT(*) AS n FROM decisions WHERE status = 'annulee'"),
    ordresPasses: compter('SELECT COUNT(*) AS n FROM orders'),
    positionsOuvertes: compter("SELECT COUNT(*) AS n FROM positions WHERE status = 'ouverte'"),
    positionsCloturees: ecarts.length,
    bilansRediges: compter('SELECT COUNT(*) AS n FROM reviews'),
    dureeDetentionMoyenneJours:
      ecarts.length > 0
        ? arrondi(ecarts.reduce((s, e) => s + e.dureeDetentionJours, 0) / ecarts.length, 0)
        : null,
    tauxRespectHorizon:
      avecHorizon.length > 0
        ? arrondi((avecHorizon.filter((e) => e.horizonTenu).length / avecHorizon.length) * 100, 0)
        : null,
    resultatRealiseTotal: arrondi(
      (database.prepare('SELECT COALESCE(SUM(realized_pnl),0) AS n FROM orders').get() as {
        n: number;
      }).n,
    ),
    fraisCumules: arrondi(
      (database.prepare('SELECT COALESCE(SUM(fees),0) AS n FROM orders').get() as { n: number }).n,
    ),
  };
}
