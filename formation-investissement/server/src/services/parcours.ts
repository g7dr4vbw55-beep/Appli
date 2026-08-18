import { db, nowIso } from '../db/index.js';

export interface LeconResume {
  id: number;
  slug: string;
  titre: string;
  resume: string;
  nombreMots: number;
  lue: boolean;
}

export interface NiveauResume {
  id: number;
  position: number;
  slug: string;
  titre: string;
  sousTitre: string;
  intro: string;
  seuilReussite: number;
  deverrouille: boolean;
  raisonVerrouillage: string | null;
  meilleurScore: number | null;
  valide: boolean;
  nombreTentatives: number;
  leconsLues: number;
  nombreLecons: number;
  lecons: LeconResume[];
}

interface LigneNiveau {
  id: number;
  position: number;
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  pass_percent: number;
}

/** Meilleur score obtenu sur un niveau, ou null si aucune tentative. */
function meilleurScore(levelId: number): number | null {
  const ligne = db()
    .prepare('SELECT MAX(score_percent) AS s FROM quiz_attempts WHERE level_id = ?')
    .get(levelId) as { s: number | null };
  return ligne.s;
}

function nombreTentatives(levelId: number): number {
  return (
    db()
      .prepare('SELECT COUNT(*) AS n FROM quiz_attempts WHERE level_id = ?')
      .get(levelId) as { n: number }
  ).n;
}

/**
 * Etat complet du parcours. Un niveau n'est deverrouille que si le quiz du
 * niveau precedent a ete reussi avec au moins 80 % de bonnes reponses.
 */
export function etatParcours(): NiveauResume[] {
  const database = db();
  const niveaux = database
    .prepare('SELECT * FROM levels ORDER BY position')
    .all() as LigneNiveau[];

  const resultat: NiveauResume[] = [];
  let precedentValide = true;
  let titrePrecedent = '';

  for (const niveau of niveaux) {
    const lecons = database
      .prepare(
        `SELECT le.id, le.slug, le.title, le.summary, le.word_count,
                (p.lesson_id IS NOT NULL) AS lue
           FROM lessons le
           LEFT JOIN lesson_progress p ON p.lesson_id = le.id
          WHERE le.level_id = ?
          ORDER BY le.position`,
      )
      .all(niveau.id) as {
      id: number;
      slug: string;
      title: string;
      summary: string;
      word_count: number;
      lue: number;
    }[];

    const score = meilleurScore(niveau.id);
    const valide = score !== null && score >= niveau.pass_percent;

    resultat.push({
      id: niveau.id,
      position: niveau.position,
      slug: niveau.slug,
      titre: niveau.title,
      sousTitre: niveau.subtitle,
      intro: niveau.intro,
      seuilReussite: niveau.pass_percent,
      deverrouille: precedentValide,
      raisonVerrouillage: precedentValide
        ? null
        : `Ce niveau se débloque en obtenant au moins ${niveau.pass_percent} % de bonnes réponses au quiz du niveau précédent (${titrePrecedent}).`,
      meilleurScore: score,
      valide,
      nombreTentatives: nombreTentatives(niveau.id),
      leconsLues: lecons.filter((l) => l.lue).length,
      nombreLecons: lecons.length,
      lecons: lecons.map((l) => ({
        id: l.id,
        slug: l.slug,
        titre: l.title,
        resume: l.summary,
        nombreMots: l.word_count,
        lue: Boolean(l.lue),
      })),
    });

    precedentValide = valide;
    titrePrecedent = niveau.title;
  }

  return resultat;
}

export function niveauEstAccessible(slug: string): { ok: boolean; message?: string } {
  const etat = etatParcours();
  const niveau = etat.find((n) => n.slug === slug);
  if (!niveau) return { ok: false, message: 'Niveau inconnu.' };
  if (!niveau.deverrouille) return { ok: false, message: niveau.raisonVerrouillage ?? 'Niveau verrouillé.' };
  return { ok: true };
}

/** Contenu complet d'une lecon. */
export function lecon(slug: string) {
  const ligne = db()
    .prepare(
      `SELECT le.*, l.slug AS niveau_slug, l.title AS niveau_titre, l.position AS niveau_position
         FROM lessons le JOIN levels l ON l.id = le.level_id
        WHERE le.slug = ?`,
    )
    .get(slug) as
    | {
        id: number;
        slug: string;
        title: string;
        summary: string;
        body: string;
        key_points: string;
        sources: string;
        word_count: number;
        position: number;
        niveau_slug: string;
        niveau_titre: string;
        niveau_position: number;
      }
    | undefined;
  if (!ligne) return null;

  const acces = niveauEstAccessible(ligne.niveau_slug);
  if (!acces.ok) return { verrouille: true as const, message: acces.message };

  const lue = db()
    .prepare('SELECT 1 FROM lesson_progress WHERE lesson_id = ?')
    .get(ligne.id);

  return {
    verrouille: false as const,
    id: ligne.id,
    slug: ligne.slug,
    titre: ligne.title,
    resume: ligne.summary,
    corps: ligne.body,
    pointsCles: JSON.parse(ligne.key_points) as string[],
    sources: JSON.parse(ligne.sources) as { label: string; url: string }[],
    nombreMots: ligne.word_count,
    position: ligne.position,
    niveau: {
      slug: ligne.niveau_slug,
      titre: ligne.niveau_titre,
      position: ligne.niveau_position,
    },
    lue: Boolean(lue),
  };
}

export function marquerLeconLue(slug: string): boolean {
  const ligne = db().prepare('SELECT id FROM lessons WHERE slug = ?').get(slug) as
    | { id: number }
    | undefined;
  if (!ligne) return false;
  db()
    .prepare('INSERT OR REPLACE INTO lesson_progress (lesson_id, read_at) VALUES (?, ?)')
    .run(ligne.id, nowIso());
  return true;
}

/** Questions du quiz, sans revelation de la bonne reponse. */
export function quiz(slugNiveau: string) {
  const database = db();
  const niveau = database.prepare('SELECT * FROM levels WHERE slug = ?').get(slugNiveau) as
    | LigneNiveau
    | undefined;
  if (!niveau) return null;

  const acces = niveauEstAccessible(slugNiveau);
  if (!acces.ok) return { verrouille: true as const, message: acces.message };

  const questions = database
    .prepare('SELECT id, slug, prompt FROM quiz_questions WHERE level_id = ? ORDER BY position')
    .all(niveau.id) as { id: number; slug: string; prompt: string }[];

  return {
    verrouille: false as const,
    niveau: { slug: niveau.slug, titre: niveau.title, seuilReussite: niveau.pass_percent },
    questions: questions.map((q) => ({
      id: q.id,
      slug: q.slug,
      enonce: q.prompt,
      propositions: (
        database
          .prepare('SELECT id, label FROM quiz_choices WHERE question_id = ? ORDER BY position')
          .all(q.id) as { id: number; label: string }[]
      ).map((c) => ({ id: c.id, libelle: c.label })),
    })),
  };
}

export interface ReponseSoumise {
  questionId: number;
  choiceId: number | null;
}

/**
 * Correction d'un quiz. Renvoie, pour chaque question, l'explication de la
 * bonne reponse ET celle de chaque mauvaise reponse.
 */
export function corrigerQuiz(slugNiveau: string, reponses: ReponseSoumise[]) {
  const database = db();
  const niveau = database.prepare('SELECT * FROM levels WHERE slug = ?').get(slugNiveau) as
    | LigneNiveau
    | undefined;
  if (!niveau) return null;

  const acces = niveauEstAccessible(slugNiveau);
  if (!acces.ok) return { verrouille: true as const, message: acces.message };

  const questions = database
    .prepare('SELECT id, slug, prompt, takeaway FROM quiz_questions WHERE level_id = ? ORDER BY position')
    .all(niveau.id) as { id: number; slug: string; prompt: string; takeaway: string }[];

  const details = questions.map((q) => {
    const propositions = database
      .prepare(
        'SELECT id, label, is_correct, explanation FROM quiz_choices WHERE question_id = ? ORDER BY position',
      )
      .all(q.id) as { id: number; label: string; is_correct: number; explanation: string }[];

    const soumise = reponses.find((r) => r.questionId === q.id);
    const choisi = propositions.find((p) => p.id === soumise?.choiceId) ?? null;
    const bonne = propositions.find((p) => p.is_correct === 1)!;

    return {
      questionId: q.id,
      enonce: q.prompt,
      aRetenir: q.takeaway,
      idChoisi: choisi?.id ?? null,
      idBonneReponse: bonne.id,
      correct: choisi?.is_correct === 1,
      propositions: propositions.map((p) => ({
        id: p.id,
        libelle: p.label,
        correcte: p.is_correct === 1,
        explication: p.explanation,
        choisie: p.id === choisi?.id,
      })),
    };
  });

  const total = details.length;
  const justes = details.filter((d) => d.correct).length;
  const score = total > 0 ? (justes / total) * 100 : 0;
  const reussi = score >= niveau.pass_percent;

  database
    .prepare(
      `INSERT INTO quiz_attempts (level_id, score_percent, correct_count, total_count, passed, answers, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      niveau.id,
      score,
      justes,
      total,
      reussi ? 1 : 0,
      JSON.stringify(
        details.map((d) => ({ questionId: d.questionId, choiceId: d.idChoisi, correct: d.correct })),
      ),
      nowIso(),
    );

  const suivant = database
    .prepare('SELECT slug, title FROM levels WHERE position = ?')
    .get(niveau.position + 1) as { slug: string; title: string } | undefined;

  return {
    verrouille: false as const,
    score,
    justes,
    total,
    seuilReussite: niveau.pass_percent,
    reussi,
    niveauSuivant: reussi && suivant ? { slug: suivant.slug, titre: suivant.title } : null,
    details,
  };
}

/** Historique des tentatives, tous niveaux confondus. */
export function historiqueTentatives() {
  return db()
    .prepare(
      `SELECT a.id, a.score_percent AS score, a.correct_count AS justes, a.total_count AS total,
              a.passed AS reussi, a.created_at AS date, l.slug AS niveauSlug, l.title AS niveauTitre
         FROM quiz_attempts a JOIN levels l ON l.id = a.level_id
        ORDER BY a.created_at DESC LIMIT 50`,
    )
    .all();
}
