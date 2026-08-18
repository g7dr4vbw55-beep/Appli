import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { config } from '../config.js';

const here = path.dirname(fileURLToPath(import.meta.url));

let instance: Database.Database | null = null;

/** Connexion unique a la base locale, creee et migree a la premiere demande. */
export function db(): Database.Database {
  if (instance) return instance;
  const database = new Database(config.databasePath);
  database.pragma('journal_mode = WAL');
  database.pragma('foreign_keys = ON');
  const schema = fs.readFileSync(path.join(here, 'schema.sql'), 'utf8');
  database.exec(schema);
  instance = database;
  return instance;
}

export function nowIso(): string {
  return new Date().toISOString();
}

/** Lecture d'un parametre de simulation, avec repli sur la valeur du .env. */
export function getSetting(key: string, fallback: number): number {
  const row = db().prepare('SELECT value FROM settings WHERE key = ?').get(key) as
    | { value: string }
    | undefined;
  if (!row) return fallback;
  const parsed = Number(row.value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function setSetting(key: string, value: number | string): void {
  db()
    .prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    )
    .run(key, String(value));
}

/** Parametres de simulation effectifs (base > .env > valeurs par defaut). */
export function simulationSettings() {
  return {
    feePercent: getSetting('fee_percent', config.simulation.feePercent),
    feeFixed: getSetting('fee_fixed', config.simulation.feeFixed),
    concentrationAlertPercent: getSetting(
      'concentration_alert_percent',
      config.simulation.concentrationAlertPercent,
    ),
  };
}

/** Le compte virtuel existe toujours : cree au premier acces si besoin. */
export function ensureAccount(): { id: number; cash: number; starting_cash: number } {
  const database = db();
  const existing = database.prepare('SELECT * FROM account WHERE id = 1').get() as
    | { id: number; cash: number; starting_cash: number }
    | undefined;
  if (existing) return existing;
  database
    .prepare('INSERT INTO account (id, cash, starting_cash, created_at) VALUES (1, ?, ?, ?)')
    .run(config.simulation.startingCash, config.simulation.startingCash, nowIso());
  return {
    id: 1,
    cash: config.simulation.startingCash,
    starting_cash: config.simulation.startingCash,
  };
}
