/**
 * Jeu de demonstration et remise a zero.
 *
 * Toutes les donnees ci-dessous sont FICTIVES et servent uniquement a pouvoir
 * tester chaque module immediatement. Les prix sont inventes, aucune valeur
 * n'est une cotation reelle et aucun scenario n'est une recommandation.
 *
 * Le scenario est concu pour faire apparaitre, dans le tableau de bord du
 * module 3, plusieurs schemas repetitifs typiques d'un debutant : sortie en
 * perte peu apres l'ouverture, horizon annonce non tenu, condition
 * d'invalidation atteinte sans action, renforcement sous le prix moyen,
 * positions gagnantes conservees moins longtemps que les perdantes, et bilan
 * manquant. Le portefeuille final declenche egalement les alertes de
 * concentration.
 *
 * Les prix sont inseres comme prix manuels : le jeu de demonstration
 * fonctionne donc entierement hors ligne, sans aucun appel reseau.
 */
import { db, ensureAccount, nowIso } from './index.js';
import { config } from '../config.js';

/** Supprime toutes les donnees produites par l'utilisateur. Le contenu pedagogique reste. */
export function effacerDonneesUtilisateur(): void {
  const database = db();
  database.transaction(() => {
    database.exec(`
      DELETE FROM reviews;
      DELETE FROM orders;
      DELETE FROM positions;
      DELETE FROM decisions;
      DELETE FROM manual_prices;
      DELETE FROM portfolio_snapshots;
      DELETE FROM quiz_attempts;
      DELETE FROM lesson_progress;
      DELETE FROM decoder_analyses;
      DELETE FROM account;
      DELETE FROM settings;
    `);
  })();
  ensureAccount();
}

function jour(n: number): string {
  const d = new Date();
  d.setUTCHours(12, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString();
}

function arrondi(v: number, d = 2): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}

// --- Series de prix fictives ------------------------------------------------
// Chaque serie est une liste [jours avant aujourd'hui, prix en euros].
const series: Record<string, [number, number][]> = {
  CW8: [
    [120, 372], [105, 379], [90, 380], [75, 366], [60, 358], [55, 360],
    [40, 371], [25, 388], [15, 394], [7, 401], [0, 405],
  ],
  ESE: [
    [120, 24.1], [105, 24.6], [90, 24.9], [80, 25.0], [60, 24.2], [45, 25.4],
    [30, 26.1], [15, 26.6], [7, 26.9], [0, 27.1],
  ],
  BTC: [
    [120, 52000], [105, 54500], [100, 55000], [85, 51000], [70, 46500], [60, 48000],
    [45, 52500], [30, 57000], [15, 59500], [7, 61000], [0, 62000],
  ],
  ETH: [
    [120, 2650], [90, 2520], [60, 2380], [40, 2400], [30, 2180], [20, 2090],
    [15, 2050], [7, 2160], [0, 2240],
  ],
  SOL: [
    [120, 82], [100, 90], [95, 104], [88, 115], [70, 96], [45, 112], [15, 128], [0, 134],
  ],
  ADA: [
    [120, 0.58], [40, 0.62], [35, 0.6], [25, 0.5], [13, 0.42], [7, 0.44], [0, 0.46],
  ],
  XRP: [
    [120, 0.47], [95, 0.5], [85, 0.58], [77, 0.62], [50, 0.55], [20, 0.6], [0, 0.63],
  ],
  AAPL: [
    [120, 178], [90, 185], [70, 191], [45, 172], [20, 158], [5, 150], [0, 154],
  ],
};

interface Etape {
  jours: number;
  symbole: string;
  side: 'achat' | 'vente';
  quantite: number;
  prix: number;
  these: string;
  horizon: 'court' | 'moyen' | 'long';
  horizonMois: number;
  risque: number;
  invalidation: string;
  conviction: number;
  emotion: string;
  /** Bilan a la cloture, quand la position se ferme sur cet ordre. */
  bilan?: {
    cequisEstPasse: string;
    issue: 'verifiee' | 'partiellement' | 'invalidee' | 'indeterminee';
    invalidationDeclenchee: boolean;
    invalidationRespectee: boolean;
    raison: 'these_atteinte' | 'invalidation' | 'besoin_argent' | 'peur' | 'euphorie' | 'rebalancement' | 'autre';
    emotion: string;
    lecon: string;
  };
}

const scenario: Etape[] = [
  {
    jours: 100, symbole: 'SOL', side: 'achat', quantite: 8, prix: 90,
    these:
      "Poche crypto d'entraînement volontairement petite. Je veux observer comment je réagis à une position très volatile, sans y mettre une somme qui compte.",
    horizon: 'moyen', horizonMois: 24, risque: 150,
    invalidation: "Si le volume d'échange du réseau baisse durablement sous son niveau de l'an dernier.",
    conviction: 2, emotion: 'curiosité',
  },
  {
    jours: 100, symbole: 'BTC', side: 'achat', quantite: 0.04, prix: 55000,
    these:
      "Exposition longue à l'actif crypto le plus ancien, avec une émission plafonnée. Je considère ce montant comme entièrement susceptible de disparaître.",
    horizon: 'long', horizonMois: 60, risque: 400,
    invalidation: "Si je constate que je consulte le cours plusieurs fois par jour, c'est que la position est trop grosse pour moi.",
    conviction: 3, emotion: 'calme',
  },
  {
    jours: 95, symbole: 'XRP', side: 'achat', quantite: 800, prix: 0.5,
    these:
      "Petite ligne prise après avoir lu un fil de discussion enthousiaste. Je note honnêtement que ma thèse est faible : je teste surtout mon propre comportement.",
    horizon: 'moyen', horizonMois: 24, risque: 100,
    invalidation: 'Si je suis incapable de réexpliquer le projet en trois phrases dans un mois.',
    conviction: 1, emotion: 'entraîné par la discussion',
  },
  {
    jours: 90, symbole: 'CW8', side: 'achat', quantite: 6, prix: 380,
    these:
      "Cœur de portefeuille : un ETF actions monde largement diversifié, destiné à rester en place très longtemps et alimenté par versements réguliers.",
    horizon: 'long', horizonMois: 120, risque: 300,
    invalidation:
      "Rien dans les variations de marché n'invalide cette thèse. Seul un changement de ma situation personnelle (besoin d'argent à court terme) la remettrait en cause.",
    conviction: 4, emotion: 'serein',
  },
  {
    jours: 90, symbole: 'AAPL', side: 'achat', quantite: 5, prix: 185,
    these:
      "Première action en direct pour comprendre la différence avec un ETF : marges élevées, trésorerie importante, dépendance forte à un seul produit.",
    horizon: 'moyen', horizonMois: 36, risque: 150,
    invalidation: "Si le chiffre d'affaires recule deux trimestres consécutifs.",
    conviction: 3, emotion: 'confiant',
  },
  {
    jours: 88, symbole: 'SOL', side: 'vente', quantite: 8, prix: 115,
    these:
      "Je vends après une hausse rapide de 28 % en douze jours, alors que mon horizon annoncé était de deux ans. Je note que la hausse seule a déclenché la vente.",
    horizon: 'moyen', horizonMois: 24, risque: 150,
    invalidation: 'Sans objet : je clôture.',
    conviction: 2, emotion: 'euphorie',
    bilan: {
      cequisEstPasse:
        "La position a monté de 28 % en douze jours. J'ai vendu par crainte de voir le gain disparaître, sans qu'aucun élément de ma thèse n'ait changé.",
      issue: 'indeterminee',
      invalidationDeclenchee: false,
      invalidationRespectee: true,
      raison: 'euphorie',
      emotion: 'excitation puis soulagement',
      lecon:
        "J'ai vendu sur un mouvement de prix, pas sur ma thèse. Mon horizon écrit était de 24 mois, j'ai tenu 12 jours.",
    },
  },
  {
    jours: 80, symbole: 'ESE', side: 'achat', quantite: 40, prix: 25,
    these:
      "Deuxième brique indicielle, sur les grandes entreprises américaines. Je sais qu'elle recoupe en grande partie l'ETF monde déjà détenu : la diversification apportée est limitée.",
    horizon: 'long', horizonMois: 96, risque: 200,
    invalidation: "Rien dans les variations de marché. Uniquement un changement de ma situation personnelle.",
    conviction: 4, emotion: 'serein',
  },
  {
    jours: 77, symbole: 'XRP', side: 'vente', quantite: 800, prix: 0.62,
    these:
      "Je clôture après 18 jours et 24 % de hausse. Ma thèse était faible dès le départ, je préférais sortir avec un gain qu'attendre sans raison claire.",
    horizon: 'moyen', horizonMois: 24, risque: 100,
    invalidation: 'Sans objet : je clôture.',
    conviction: 1, emotion: 'satisfaction',
    bilan: {
      cequisEstPasse:
        "Hausse de 24 % en 18 jours sans nouvelle information. J'ai vendu pour sécuriser le gain. Ma condition d'invalidation était en réalité déjà atteinte : je n'aurais pas su réexpliquer le projet.",
      issue: 'indeterminee',
      invalidationDeclenchee: true,
      invalidationRespectee: false,
      raison: 'euphorie',
      emotion: 'soulagement',
      lecon:
        "Une ligne prise sans thèse se solde par une décision prise sur le prix. Ce gain ne prouve rien sur la qualité de la décision.",
    },
  },
  {
    jours: 60, symbole: 'BTC', side: 'achat', quantite: 0.02, prix: 48000,
    these:
      "Renforcement après une baisse de 13 % sous mon prix moyen. Ce renforcement n'était pas prévu ni chiffré au moment de l'achat initial : je l'improvise.",
    horizon: 'long', horizonMois: 60, risque: 250,
    invalidation: "Si la position dépasse 25 % du portefeuille total, elle est trop grosse pour moi.",
    conviction: 3, emotion: 'envie de rattraper la baisse',
  },
  {
    jours: 55, symbole: 'CW8', side: 'achat', quantite: 3, prix: 360,
    these:
      "Versement programmé mensuel sur le cœur de portefeuille. Le prix est plus bas que mon prix moyen, ce qui est le fonctionnement normal d'un investissement programmé.",
    horizon: 'long', horizonMois: 120, risque: 300,
    invalidation: 'Uniquement un changement de ma situation personnelle.',
    conviction: 4, emotion: 'neutre, versement automatique',
  },
  {
    jours: 40, symbole: 'ETH', side: 'achat', quantite: 0.4, prix: 2400,
    these:
      "Deuxième crypto-actif, pour comprendre la différence entre une chaîne de paiement et une plateforme de contrats intelligents. Montant considéré comme entièrement perdable.",
    horizon: 'long', horizonMois: 48, risque: 250,
    invalidation: "Si le cours passe sous 2 100 EUR, je considère que je m'étais trompé sur le calendrier de mon entrée.",
    conviction: 2, emotion: 'intéressé',
  },
  {
    jours: 35, symbole: 'ADA', side: 'achat', quantite: 800, prix: 0.6,
    these:
      "Ligne prise après avoir vu passer plusieurs messages très positifs le même jour. Je reconnais que c'est de la FOMO et je le note pour pouvoir me relire.",
    horizon: 'moyen', horizonMois: 24, risque: 120,
    invalidation: 'Si dans un mois je ne peux pas citer une seule utilisation concrète du réseau.',
    conviction: 1, emotion: 'peur de rater',
  },
  {
    jours: 15, symbole: 'ETH', side: 'vente', quantite: 0.4, prix: 2050,
    these:
      "Le cours est passé sous mon seuil de 2 100 EUR il y a plusieurs jours et j'ai attendu, puis j'ai vendu quand la baisse a continué.",
    horizon: 'long', horizonMois: 48, risque: 250,
    invalidation: 'Sans objet : je clôture.',
    conviction: 2, emotion: 'inquiétude',
    bilan: {
      cequisEstPasse:
        "Le seuil de 2 100 EUR que j'avais écrit a été franchi au bout de 20 jours. Je n'ai rien fait à ce moment-là, puis j'ai vendu cinq jours plus tard, plus bas, quand je n'ai plus supporté de regarder la ligne.",
      issue: 'invalidee',
      invalidationDeclenchee: true,
      invalidationRespectee: false,
      raison: 'peur',
      emotion: 'inquiétude puis lassitude',
      lecon:
        "J'avais écrit la condition d'invalidation, je ne l'ai pas suivie. Mon horizon annoncé était de 48 mois, j'ai tenu 25 jours.",
    },
  },
  {
    jours: 13, symbole: 'ADA', side: 'vente', quantite: 800, prix: 0.42,
    these:
      "Je vends en perte de 30 % après 22 jours. Je n'ai pas de raison liée à ma thèse, uniquement le fait que la baisse continue.",
    horizon: 'moyen', horizonMois: 24, risque: 120,
    invalidation: 'Sans objet : je clôture.',
    conviction: 1, emotion: 'découragement',
  },
  {
    jours: 5, symbole: 'AAPL', side: 'vente', quantite: 5, prix: 150,
    these:
      "Je clôture en perte de 19 % après 85 jours. Aucun trimestre de baisse de chiffre d'affaires n'a été publié : ma condition d'invalidation n'était pas atteinte.",
    horizon: 'moyen', horizonMois: 36, risque: 150,
    invalidation: 'Sans objet : je clôture.',
    conviction: 3, emotion: 'lassitude',
    bilan: {
      cequisEstPasse:
        "Le cours a baissé de 19 % en trois mois sans que la condition d'invalidation que j'avais écrite (deux trimestres de recul du chiffre d'affaires) ne se produise. J'ai vendu parce que la ligne rouge me gênait à chaque consultation.",
      issue: 'indeterminee',
      invalidationDeclenchee: false,
      invalidationRespectee: false,
      raison: 'peur',
      emotion: 'gêne, puis soulagement',
      lecon:
        "J'ai vendu sur une variation de prix, pas sur ma thèse. Horizon annoncé 36 mois, durée réelle 85 jours. La perte de 182 EUR dépasse le risque de 150 EUR que j'avais accepté.",
    },
  },
];

function prixSerie(symbole: string, joursAvant: number): number | null {
  const serie = series[symbole];
  if (!serie) return null;
  // Dernier point connu a cette date (jours decroissants = plus recent).
  const candidats = serie.filter(([j]) => j >= joursAvant);
  const choisi = candidats.length > 0 ? candidats[candidats.length - 1] : serie[0];
  return choisi[1];
}

function chargerPrixManuels(): void {
  const database = db();
  const inserer = database.prepare(
    'INSERT INTO manual_prices (asset_id, price, as_of) VALUES (?, ?, ?)',
  );
  for (const [symbole, points] of Object.entries(series)) {
    const actif = database.prepare('SELECT id FROM assets WHERE symbol = ?').get(symbole) as
      | { id: number }
      | undefined;
    if (!actif) continue;
    for (const [joursAvant, prix] of points) inserer.run(actif.id, prix, jour(joursAvant));
  }
}

function jouerScenario(): void {
  const database = db();
  const parametres = { fraisPourcent: 0.35, fraisFixe: 1.0 };
  let liquidites = config.simulation.startingCash;

  const actifParSymbole = (symbole: string) =>
    database.prepare('SELECT * FROM assets WHERE symbol = ?').get(symbole) as
      | { id: number; symbol: string }
      | undefined;

  for (const etape of scenario) {
    const actif = actifParSymbole(etape.symbole);
    if (!actif) continue;
    const date = jour(etape.jours);
    const brut = arrondi(etape.quantite * etape.prix);
    const frais = arrondi((brut * parametres.fraisPourcent) / 100 + parametres.fraisFixe);

    const nature =
      etape.side === 'achat'
        ? database
            .prepare("SELECT 1 FROM positions WHERE asset_id = ? AND status = 'ouverte'")
            .get(actif.id)
          ? 'renforcement'
          : 'ouverture'
        : 'allegement';

    const infoDecision = database
      .prepare(
        `INSERT INTO decisions
           (asset_id, kind, side, thesis, horizon, horizon_months, risk_accepted_eur,
            invalidation_condition, conviction, emotion, planned_quantity, planned_price,
            status, created_at, executed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'executee', ?, ?)`,
      )
      .run(
        actif.id, nature, etape.side, etape.these, etape.horizon, etape.horizonMois,
        etape.risque, etape.invalidation, etape.conviction, etape.emotion,
        etape.quantite, etape.prix, date, date,
      );
    const decisionId = Number(infoDecision.lastInsertRowid);

    const positionOuverte = database
      .prepare("SELECT * FROM positions WHERE asset_id = ? AND status = 'ouverte'")
      .get(actif.id) as
      | { id: number; quantity: number; avg_cost: number; invested: number }
      | undefined;

    let positionId: number;
    let plusValue = 0;
    let flux: number;
    let cloturee = false;

    if (etape.side === 'achat') {
      flux = -arrondi(brut + frais);
      if (positionOuverte) {
        const q = positionOuverte.quantity + etape.quantite;
        const cout = positionOuverte.invested + brut + frais;
        database
          .prepare(
            'UPDATE positions SET quantity = ?, invested = ?, avg_cost = ?, total_fees = total_fees + ? WHERE id = ?',
          )
          .run(q, arrondi(cout, 6), arrondi(cout / q, 8), frais, positionOuverte.id);
        positionId = positionOuverte.id;
      } else {
        const cout = brut + frais;
        positionId = Number(
          database
            .prepare(
              `INSERT INTO positions
                 (asset_id, status, quantity, avg_cost, invested, realized_pnl, total_fees, opened_at, opening_decision_id)
               VALUES (?, 'ouverte', ?, ?, ?, 0, ?, ?, ?)`,
            )
            .run(actif.id, etape.quantite, arrondi(cout / etape.quantite, 8), arrondi(cout, 6), frais, date, decisionId)
            .lastInsertRowid,
        );
      }
    } else {
      if (!positionOuverte) continue;
      positionId = positionOuverte.id;
      const coutSorti = arrondi(positionOuverte.avg_cost * etape.quantite, 6);
      plusValue = arrondi(brut - frais - coutSorti);
      flux = arrondi(brut - frais);
      const reste = arrondi(positionOuverte.quantity - etape.quantite, 10);
      cloturee = reste <= 1e-9;
      database
        .prepare(
          `UPDATE positions SET quantity = ?, invested = ?, realized_pnl = realized_pnl + ?,
                  total_fees = total_fees + ?, status = ?, closed_at = ?, closing_decision_id = ?
             WHERE id = ?`,
        )
        .run(
          cloturee ? 0 : reste,
          cloturee ? 0 : arrondi(Math.max(0, positionOuverte.invested - coutSorti), 6),
          plusValue, frais,
          cloturee ? 'cloturee' : 'ouverte',
          cloturee ? date : null,
          cloturee ? decisionId : null,
          positionOuverte.id,
        );
    }

    database
      .prepare(
        `INSERT INTO orders
           (position_id, asset_id, decision_id, side, quantity, unit_price, fees, gross, net, price_source, realized_pnl, executed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'demonstration', ?, ?)`,
      )
      .run(positionId, actif.id, decisionId, etape.side, etape.quantite, etape.prix, frais, brut, flux, plusValue, date);

    liquidites = arrondi(liquidites + flux);
    database.prepare('UPDATE account SET cash = ? WHERE id = 1').run(liquidites);

    if (cloturee && etape.bilan) {
      database
        .prepare(
          `INSERT INTO reviews
             (position_id, what_happened, thesis_outcome, invalidation_triggered,
              invalidation_respected, exit_reason, emotion, lesson, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(
          positionId, etape.bilan.cequisEstPasse, etape.bilan.issue,
          etape.bilan.invalidationDeclenchee ? 1 : 0,
          etape.bilan.invalidationRespectee ? 1 : 0,
          etape.bilan.raison, etape.bilan.emotion, etape.bilan.lecon, date,
        );
    }
  }
}

/**
 * Reconstitue un historique de valorisation hebdomadaire en rejouant les ordres
 * et en valorisant chaque ligne au prix fictif connu a la date consideree.
 */
function construireInstantanes(): void {
  const database = db();
  const ordres = database
    .prepare(
      `SELECT o.side, o.quantity, o.gross, o.fees, o.net, o.executed_at, a.symbol
         FROM orders o JOIN assets a ON a.id = o.asset_id ORDER BY o.executed_at`,
    )
    .all() as {
    side: 'achat' | 'vente';
    quantity: number;
    gross: number;
    fees: number;
    net: number;
    executed_at: string;
    symbol: string;
  }[];

  const indice = database
    .prepare('SELECT symbol FROM assets WHERE is_benchmark = 1 ORDER BY id LIMIT 1')
    .get() as { symbol: string } | undefined;

  const inserer = database.prepare(
    `INSERT INTO portfolio_snapshots (as_of, total_value, cash, invested_value, benchmark_value)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(as_of) DO UPDATE SET
       total_value = excluded.total_value, cash = excluded.cash,
       invested_value = excluded.invested_value, benchmark_value = excluded.benchmark_value`,
  );

  for (let joursAvant = 119; joursAvant >= 0; joursAvant -= 7) {
    const limite = new Date(jour(joursAvant)).getTime();
    const detention = new Map<string, number>();
    let liquidites = config.simulation.startingCash;

    for (const ordre of ordres) {
      if (new Date(ordre.executed_at).getTime() > limite) continue;
      const q = detention.get(ordre.symbol) ?? 0;
      detention.set(ordre.symbol, ordre.side === 'achat' ? q + ordre.quantity : q - ordre.quantity);
      liquidites += ordre.net;
    }

    let investi = 0;
    for (const [symbole, quantite] of detention) {
      if (quantite <= 1e-9) continue;
      const prix = prixSerie(symbole, joursAvant);
      if (prix !== null) investi += prix * quantite;
    }

    inserer.run(
      new Date(jour(joursAvant)).toISOString().slice(0, 10),
      arrondi(liquidites + investi),
      arrondi(liquidites),
      arrondi(investi),
      indice ? prixSerie(indice.symbol, joursAvant) : null,
    );
  }
}

/** Progression pedagogique fictive : niveaux 1 et 2 valides, niveau 3 echoue puis reussi. */
function chargerProgression(): void {
  const database = db();
  const niveaux = database
    .prepare('SELECT id, position FROM levels ORDER BY position')
    .all() as { id: number; position: number }[];

  const marquerLu = database.prepare(
    'INSERT OR REPLACE INTO lesson_progress (lesson_id, read_at) VALUES (?, ?)',
  );
  const insererTentative = database.prepare(
    `INSERT INTO quiz_attempts (level_id, score_percent, correct_count, total_count, passed, answers, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );

  const tentative = (levelId: number, justes: number, joursAvant: number) => {
    const questions = database
      .prepare('SELECT id FROM quiz_questions WHERE level_id = ? ORDER BY position')
      .all(levelId) as { id: number }[];
    const reponses = questions.map((q, i) => {
      const choix = database
        .prepare('SELECT id FROM quiz_choices WHERE question_id = ? AND is_correct = ? LIMIT 1')
        .get(q.id, i < justes ? 1 : 0) as { id: number } | undefined;
      return { questionId: q.id, choiceId: choix?.id ?? null, correct: i < justes };
    });
    const score = questions.length > 0 ? (justes / questions.length) * 100 : 0;
    insererTentative.run(
      levelId, score, justes, questions.length, score >= 80 ? 1 : 0,
      JSON.stringify(reponses), jour(joursAvant),
    );
  };

  for (const niveau of niveaux.slice(0, 2)) {
    const lecons = database
      .prepare('SELECT id FROM lessons WHERE level_id = ? ORDER BY position')
      .all(niveau.id) as { id: number }[];
    for (const lecon of lecons) marquerLu.run(lecon.id, jour(115 - niveau.position * 4));
    tentative(niveau.id, 5, 112 - niveau.position * 4);
  }

  const niveau3 = niveaux[2];
  if (niveau3) {
    const lecons = database
      .prepare('SELECT id FROM lessons WHERE level_id = ? ORDER BY position')
      .all(niveau3.id) as { id: number }[];
    for (const lecon of lecons) marquerLu.run(lecon.id, jour(70));
    tentative(niveau3.id, 3, 68);
    tentative(niveau3.id, 4, 62);
  }
}

export function chargerDemonstration(): void {
  const database = db();
  effacerDonneesUtilisateur();
  database.transaction(() => {
    chargerPrixManuels();
    jouerScenario();
    construireInstantanes();
    chargerProgression();
    database
      .prepare(
        'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
      )
      .run('benchmark_symbol', 'CW8');
  })();
  console.log(`Jeu de démonstration chargé (${nowIso()}).`);
}
