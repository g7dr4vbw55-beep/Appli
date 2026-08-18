/**
 * Chargement du contenu pedagogique dans la base SQLite.
 *
 * Principe : le contenu (niveaux, lecons, quiz, glossaire, actifs de reference)
 * est reseme a l'identique a chaque execution, tandis que les donnees produites
 * par l'utilisateur (progression, ordres, journal) ne sont jamais touchees.
 *
 * Usage :
 *   npm run seed          -> contenu pedagogique uniquement
 *   npm run seed:demo     -> contenu + jeu de demonstration
 *   npm run reset         -> remise a zero complete + contenu + demonstration
 */
import { db, ensureAccount, nowIso } from './index.js';
import { niveaux, glossaire, actifs } from '../content/index.js';
import { chargerDemonstration, effacerDonneesUtilisateur } from './demo.js';

function compterMots(texte: string): number {
  return texte
    .replace(/[#*`>-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

export function semerContenu(): void {
  const database = db();

  const upsertLevel = database.prepare(`
    INSERT INTO levels (position, slug, title, subtitle, intro, pass_percent)
    VALUES (@position, @slug, @title, @subtitle, @intro, 80)
    ON CONFLICT(slug) DO UPDATE SET
      position = excluded.position,
      title = excluded.title,
      subtitle = excluded.subtitle,
      intro = excluded.intro,
      pass_percent = excluded.pass_percent
  `);

  const upsertLesson = database.prepare(`
    INSERT INTO lessons (level_id, position, slug, title, summary, body, key_points, sources, word_count)
    VALUES (@level_id, @position, @slug, @title, @summary, @body, @key_points, @sources, @word_count)
    ON CONFLICT(slug) DO UPDATE SET
      level_id = excluded.level_id,
      position = excluded.position,
      title = excluded.title,
      summary = excluded.summary,
      body = excluded.body,
      key_points = excluded.key_points,
      sources = excluded.sources,
      word_count = excluded.word_count
  `);

  const upsertQuestion = database.prepare(`
    INSERT INTO quiz_questions (level_id, position, slug, prompt, takeaway)
    VALUES (@level_id, @position, @slug, @prompt, @takeaway)
    ON CONFLICT(slug) DO UPDATE SET
      level_id = excluded.level_id,
      position = excluded.position,
      prompt = excluded.prompt,
      takeaway = excluded.takeaway
  `);

  const supprimerChoix = database.prepare('DELETE FROM quiz_choices WHERE question_id = ?');
  const insererChoix = database.prepare(`
    INSERT INTO quiz_choices (question_id, position, label, is_correct, explanation)
    VALUES (?, ?, ?, ?, ?)
  `);

  const upsertTerme = database.prepare(`
    INSERT INTO glossary_terms (slug, term, category, definition, example, caution, related)
    VALUES (@slug, @term, @category, @definition, @example, @caution, @related)
    ON CONFLICT(slug) DO UPDATE SET
      term = excluded.term,
      category = excluded.category,
      definition = excluded.definition,
      example = excluded.example,
      caution = excluded.caution,
      related = excluded.related
  `);

  const upsertActif = database.prepare(`
    INSERT INTO assets (symbol, name, asset_class, provider, provider_ref, currency, is_benchmark, notes)
    VALUES (@symbol, @name, @asset_class, @provider, @provider_ref, @currency, @is_benchmark, @notes)
    ON CONFLICT(symbol) DO UPDATE SET
      name = excluded.name,
      asset_class = excluded.asset_class,
      provider = excluded.provider,
      provider_ref = excluded.provider_ref,
      currency = excluded.currency,
      is_benchmark = excluded.is_benchmark,
      notes = excluded.notes
  `);

  const tout = database.transaction(() => {
    // --- Niveaux, lecons et quiz -------------------------------------------
    niveaux.forEach((niveau, indexNiveau) => {
      upsertLevel.run({
        position: indexNiveau + 1,
        slug: niveau.slug,
        title: niveau.title,
        subtitle: niveau.subtitle,
        intro: niveau.intro,
      });
      const levelId = (
        database.prepare('SELECT id FROM levels WHERE slug = ?').get(niveau.slug) as {
          id: number;
        }
      ).id;

      niveau.lessons.forEach((lecon, indexLecon) => {
        upsertLesson.run({
          level_id: levelId,
          position: indexLecon + 1,
          slug: lecon.slug,
          title: lecon.title,
          summary: lecon.summary,
          body: lecon.body,
          key_points: JSON.stringify(lecon.keyPoints),
          sources: JSON.stringify(lecon.sources),
          word_count: compterMots(lecon.body),
        });
      });

      niveau.quiz.forEach((question, indexQuestion) => {
        upsertQuestion.run({
          level_id: levelId,
          position: indexQuestion + 1,
          slug: question.slug,
          prompt: question.prompt,
          takeaway: question.takeaway,
        });
        const questionId = (
          database.prepare('SELECT id FROM quiz_questions WHERE slug = ?').get(question.slug) as {
            id: number;
          }
        ).id;
        // Les choix sont remplaces en bloc : leur ordre et leur nombre peuvent changer.
        supprimerChoix.run(questionId);
        question.choices.forEach((choix, indexChoix) => {
          insererChoix.run(
            questionId,
            indexChoix + 1,
            choix.label,
            choix.correct ? 1 : 0,
            choix.explanation,
          );
        });
      });
    });

    // --- Glossaire ---------------------------------------------------------
    for (const terme of glossaire) {
      upsertTerme.run({
        slug: terme.slug,
        term: terme.term,
        category: terme.category,
        definition: terme.definition,
        example: terme.example,
        caution: terme.caution ?? '',
        related: JSON.stringify(terme.related ?? []),
      });
    }

    // --- Actifs de reference ----------------------------------------------
    for (const actif of actifs) {
      upsertActif.run({
        symbol: actif.symbol,
        name: actif.name,
        asset_class: actif.assetClass,
        provider: actif.provider,
        provider_ref: actif.providerRef,
        currency: actif.currency ?? 'EUR',
        is_benchmark: actif.isBenchmark ? 1 : 0,
        notes: actif.notes ?? '',
      });
    }
  });

  tout();
  ensureAccount();
}

function verifierIntegrite(): void {
  const database = db();
  const problemes: string[] = [];

  const questions = database
    .prepare(
      `SELECT q.slug, q.position, l.slug AS niveau,
              (SELECT COUNT(*) FROM quiz_choices c WHERE c.question_id = q.id) AS nb_choix,
              (SELECT COUNT(*) FROM quiz_choices c WHERE c.question_id = q.id AND c.is_correct = 1) AS nb_correct
         FROM quiz_questions q JOIN levels l ON l.id = q.level_id`,
    )
    .all() as { slug: string; niveau: string; nb_choix: number; nb_correct: number }[];

  for (const q of questions) {
    if (q.nb_correct !== 1) {
      problemes.push(`Question ${q.slug} (${q.niveau}) : ${q.nb_correct} bonne(s) reponse(s) au lieu de 1.`);
    }
    if (q.nb_choix < 3) {
      problemes.push(`Question ${q.slug} : seulement ${q.nb_choix} propositions.`);
    }
  }

  const niveauxBase = database
    .prepare(
      `SELECT l.slug, l.position,
              (SELECT COUNT(*) FROM lessons le WHERE le.level_id = l.id) AS nb_lecons,
              (SELECT COUNT(*) FROM quiz_questions q WHERE q.level_id = l.id) AS nb_questions
         FROM levels l ORDER BY l.position`,
    )
    .all() as { slug: string; nb_lecons: number; nb_questions: number }[];

  for (const n of niveauxBase) {
    if (n.nb_lecons < 4 || n.nb_lecons > 6) {
      problemes.push(`Niveau ${n.slug} : ${n.nb_lecons} lecons (attendu 4 a 6).`);
    }
    if (n.nb_questions !== 5) {
      problemes.push(`Niveau ${n.slug} : ${n.nb_questions} questions (attendu 5).`);
    }
  }

  const lecons = database
    .prepare('SELECT slug, word_count FROM lessons WHERE word_count < 280 OR word_count > 620')
    .all() as { slug: string; word_count: number }[];
  for (const l of lecons) {
    problemes.push(`Lecon ${l.slug} : ${l.word_count} mots (cible 300 a 500).`);
  }

  const nbTermes = (
    database.prepare('SELECT COUNT(*) AS n FROM glossary_terms').get() as { n: number }
  ).n;
  if (nbTermes < 80) problemes.push(`Glossaire : ${nbTermes} termes (minimum 80).`);

  console.log('\n--- Verification du contenu ---');
  console.log(`Niveaux           : ${niveauxBase.length}`);
  console.log(
    `Lecons            : ${(database.prepare('SELECT COUNT(*) AS n FROM lessons').get() as { n: number }).n}`,
  );
  console.log(`Questions de quiz : ${questions.length}`);
  console.log(
    `Propositions      : ${(database.prepare('SELECT COUNT(*) AS n FROM quiz_choices').get() as { n: number }).n}`,
  );
  console.log(`Termes glossaire  : ${nbTermes}`);
  console.log(
    `Actifs            : ${(database.prepare('SELECT COUNT(*) AS n FROM assets').get() as { n: number }).n}`,
  );

  if (problemes.length > 0) {
    console.log('\nAnomalies detectees :');
    for (const p of problemes) console.log(`  - ${p}`);
  } else {
    console.log('\nAucune anomalie detectee.');
  }
}

const estExecutionDirecte = process.argv[1]?.includes('seed');

if (estExecutionDirecte) {
  const args = process.argv.slice(2);
  if (args.includes('--reset')) {
    console.log('Remise a zero des donnees utilisateur...');
    effacerDonneesUtilisateur();
  }
  console.log('Chargement du contenu pedagogique...');
  semerContenu();
  if (args.includes('--demo')) {
    console.log('Chargement du jeu de demonstration...');
    chargerDemonstration();
  }
  verifierIntegrite();
  console.log(`\nBase prete (${nowIso()}).`);
}
