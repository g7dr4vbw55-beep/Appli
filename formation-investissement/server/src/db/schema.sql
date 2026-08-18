-- ---------------------------------------------------------------------------
-- Schema de la base locale SQLite.
-- Tout est cree en "IF NOT EXISTS" : le fichier peut etre rejoue sans risque.
-- Convention : le contenu pedagogique (niveaux, lecons, quiz, glossaire, actifs
-- de reference) est reseme depuis les fichiers TypeScript ; les donnees de
-- l'utilisateur (progression, ordres, journal) ne sont jamais ecrasees.
-- ---------------------------------------------------------------------------

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- === Module 1 : parcours de formation ======================================

CREATE TABLE IF NOT EXISTS levels (
  id            INTEGER PRIMARY KEY,
  position      INTEGER NOT NULL UNIQUE,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  subtitle      TEXT    NOT NULL,
  intro         TEXT    NOT NULL,
  pass_percent  INTEGER NOT NULL DEFAULT 80
);

CREATE TABLE IF NOT EXISTS lessons (
  id              INTEGER PRIMARY KEY,
  level_id        INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  position        INTEGER NOT NULL,
  slug            TEXT    NOT NULL UNIQUE,
  title           TEXT    NOT NULL,
  summary         TEXT    NOT NULL,
  body            TEXT    NOT NULL,          -- markdown leger
  key_points      TEXT    NOT NULL DEFAULT '[]',  -- JSON: string[]
  sources         TEXT    NOT NULL DEFAULT '[]',  -- JSON: {label,url}[]
  word_count      INTEGER NOT NULL DEFAULT 0,
  UNIQUE (level_id, position)
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id          INTEGER PRIMARY KEY,
  level_id    INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  position    INTEGER NOT NULL,
  slug        TEXT    NOT NULL UNIQUE,
  prompt      TEXT    NOT NULL,
  takeaway    TEXT    NOT NULL DEFAULT '',   -- rappel pedagogique affiche apres reponse
  UNIQUE (level_id, position)
);

CREATE TABLE IF NOT EXISTS quiz_choices (
  id            INTEGER PRIMARY KEY,
  question_id   INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  position      INTEGER NOT NULL,
  label         TEXT    NOT NULL,
  is_correct    INTEGER NOT NULL DEFAULT 0,
  explanation   TEXT    NOT NULL,            -- pourquoi c'est juste OU pourquoi c'est faux
  UNIQUE (question_id, position)
);

-- Progression de l'utilisateur (jamais resemee)
CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id  INTEGER PRIMARY KEY REFERENCES lessons(id) ON DELETE CASCADE,
  read_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id             INTEGER PRIMARY KEY,
  level_id       INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
  score_percent  REAL    NOT NULL,
  correct_count  INTEGER NOT NULL,
  total_count    INTEGER NOT NULL,
  passed         INTEGER NOT NULL,
  answers        TEXT    NOT NULL,           -- JSON: {questionId, choiceId, correct}[]
  created_at     TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quiz_attempts_level ON quiz_attempts(level_id);

-- === Module 4 : glossaire ==================================================

CREATE TABLE IF NOT EXISTS glossary_terms (
  id          INTEGER PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  term        TEXT NOT NULL,
  category    TEXT NOT NULL,                 -- bases | actions-etf | crypto | risque | fiscalite | arnaques
  definition  TEXT NOT NULL,
  example     TEXT NOT NULL,
  caution     TEXT NOT NULL DEFAULT '',
  related     TEXT NOT NULL DEFAULT '[]'     -- JSON: string[] (slugs)
);

CREATE INDEX IF NOT EXISTS idx_glossary_category ON glossary_terms(category);

-- Historique des decryptages (module 4)
CREATE TABLE IF NOT EXISTS decoder_analyses (
  id            INTEGER PRIMARY KEY,
  title         TEXT NOT NULL,
  source_text   TEXT NOT NULL,
  source_label  TEXT NOT NULL DEFAULT '',
  result        TEXT NOT NULL,               -- JSON de l'analyse structuree
  model         TEXT NOT NULL DEFAULT '',
  created_at    TEXT NOT NULL
);

-- === Module 2 : portefeuille fictif ========================================

CREATE TABLE IF NOT EXISTS assets (
  id            INTEGER PRIMARY KEY,
  symbol        TEXT NOT NULL UNIQUE,        -- identifiant affiche (ex: CW8, BTC)
  name          TEXT NOT NULL,
  asset_class   TEXT NOT NULL,               -- action | etf | crypto
  provider      TEXT NOT NULL,               -- coingecko | finnhub | alphavantage | manual
  provider_ref  TEXT NOT NULL DEFAULT '',    -- ticker fournisseur ou id coingecko
  currency      TEXT NOT NULL DEFAULT 'EUR',
  is_benchmark  INTEGER NOT NULL DEFAULT 0,  -- 1 = indice de reference
  notes         TEXT NOT NULL DEFAULT ''
);

-- Prix saisis a la main : mode degrade et actifs sans fournisseur.
CREATE TABLE IF NOT EXISTS manual_prices (
  id        INTEGER PRIMARY KEY,
  asset_id  INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  price     REAL NOT NULL,
  as_of     TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_manual_prices_asset ON manual_prices(asset_id, as_of DESC);

-- Compte virtuel unique (une seule ligne, id = 1).
CREATE TABLE IF NOT EXISTS account (
  id             INTEGER PRIMARY KEY CHECK (id = 1),
  cash           REAL NOT NULL,
  starting_cash  REAL NOT NULL,
  created_at     TEXT NOT NULL
);

-- Parametres de simulation modifiables depuis l'application.
CREATE TABLE IF NOT EXISTS settings (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS positions (
  id                   INTEGER PRIMARY KEY,
  asset_id             INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  status               TEXT NOT NULL DEFAULT 'ouverte',  -- ouverte | cloturee
  quantity             REAL NOT NULL DEFAULT 0,
  avg_cost             REAL NOT NULL DEFAULT 0,          -- prix moyen d'achat, frais inclus
  invested             REAL NOT NULL DEFAULT 0,          -- montant total engage restant
  realized_pnl         REAL NOT NULL DEFAULT 0,
  total_fees           REAL NOT NULL DEFAULT 0,
  opened_at            TEXT NOT NULL,
  closed_at            TEXT,
  opening_decision_id  INTEGER REFERENCES decisions(id) ON DELETE SET NULL,
  closing_decision_id  INTEGER REFERENCES decisions(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_positions_asset ON positions(asset_id, status);

CREATE TABLE IF NOT EXISTS orders (
  id           INTEGER PRIMARY KEY,
  position_id  INTEGER NOT NULL REFERENCES positions(id) ON DELETE CASCADE,
  asset_id     INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  decision_id  INTEGER NOT NULL REFERENCES decisions(id) ON DELETE CASCADE,
  side         TEXT NOT NULL,                -- achat | vente
  quantity     REAL NOT NULL,
  unit_price   REAL NOT NULL,
  fees         REAL NOT NULL,
  gross        REAL NOT NULL,                -- quantite x prix
  net          REAL NOT NULL,                -- flux de tresorerie effectif (frais inclus)
  price_source TEXT NOT NULL DEFAULT 'manual',
  realized_pnl REAL NOT NULL DEFAULT 0,      -- pour les ventes uniquement
  executed_at  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_asset ON orders(asset_id, executed_at);
CREATE INDEX IF NOT EXISTS idx_orders_position ON orders(position_id);

-- Photographie quotidienne de la valeur du portefeuille et de l'indice.
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id               INTEGER PRIMARY KEY,
  as_of            TEXT NOT NULL UNIQUE,
  total_value      REAL NOT NULL,
  cash             REAL NOT NULL,
  invested_value   REAL NOT NULL,
  benchmark_value  REAL
);

-- === Module 3 : journal de decisions =======================================

CREATE TABLE IF NOT EXISTS decisions (
  id                      INTEGER PRIMARY KEY,
  asset_id                INTEGER NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  kind                    TEXT NOT NULL,     -- ouverture | renforcement | allegement | cloture
  side                    TEXT NOT NULL,     -- achat | vente
  thesis                  TEXT NOT NULL,     -- these d'investissement
  horizon                 TEXT NOT NULL,     -- court | moyen | long
  horizon_months          INTEGER NOT NULL,
  risk_accepted_eur       REAL NOT NULL,     -- perte acceptee sur la position, en euros
  invalidation_condition  TEXT NOT NULL,     -- ce qui invaliderait la these
  conviction              INTEGER NOT NULL DEFAULT 3,  -- 1 a 5, declaratif
  emotion                 TEXT NOT NULL DEFAULT '',
  planned_quantity        REAL NOT NULL DEFAULT 0,
  planned_price           REAL NOT NULL DEFAULT 0,
  status                  TEXT NOT NULL DEFAULT 'brouillon', -- brouillon | executee | annulee
  created_at              TEXT NOT NULL,
  executed_at             TEXT
);

CREATE INDEX IF NOT EXISTS idx_decisions_asset ON decisions(asset_id, created_at);
CREATE INDEX IF NOT EXISTS idx_decisions_status ON decisions(status);

-- Bilan a la cloture d'une position.
CREATE TABLE IF NOT EXISTS reviews (
  id                       INTEGER PRIMARY KEY,
  position_id              INTEGER NOT NULL UNIQUE REFERENCES positions(id) ON DELETE CASCADE,
  what_happened            TEXT NOT NULL,
  thesis_outcome           TEXT NOT NULL,    -- verifiee | partiellement | invalidee | indeterminee
  invalidation_triggered   INTEGER NOT NULL DEFAULT 0,
  invalidation_respected   INTEGER NOT NULL DEFAULT 0,
  exit_reason              TEXT NOT NULL,    -- these_atteinte | invalidation | besoin_argent | peur | euphorie | rebalancement | autre
  emotion                  TEXT NOT NULL DEFAULT '',
  lesson                   TEXT NOT NULL DEFAULT '',
  created_at               TEXT NOT NULL
);
