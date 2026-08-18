import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { config } from '../config.js';

const here = path.dirname(fileURLToPath(import.meta.url));

/**
 * Fine couche au-dessus du module SQLite integre a Node (`node:sqlite`).
 *
 * Choix technique : aucune dependance native n'est utilisee. Un module comme
 * better-sqlite3 doit etre compile ou telecharge en binaire precompile, ce qui
 * echoue sur une machine Windows depourvue des outils de compilation C++.
 * `node:sqlite` est fourni avec Node lui-meme : `npm install` ne compile rien.
 *
 * Cette classe reproduit les deux commodites de better-sqlite3 utilisees dans
 * le projet, `pragma()` et `transaction()`, pour que le reste du code reste
 * inchange.
 */
/**
 * Requete preparee. Les lectures renvoient `unknown` : chaque appelant precise
 * la forme de ses lignes par une assertion de type, au plus pres de sa requete.
 */
export interface Requete {
  run(...params: unknown[]): { changes: number | bigint; lastInsertRowid: number | bigint };
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
}

export class BaseLocale {
  private readonly base: DatabaseSync;
  private profondeurTransaction = 0;

  constructor(chemin: string) {
    this.base = new DatabaseSync(chemin);
  }

  exec(sql: string): void {
    this.base.exec(sql);
  }

  prepare(sql: string): Requete {
    const requete = this.base.prepare(sql);
    const convertir = (params: unknown[]) => params as SQLInputValue[];
    return {
      run: (...params) => requete.run(...convertir(params)),
      get: (...params) => requete.get(...convertir(params)),
      all: (...params) => requete.all(...convertir(params)),
    };
  }

  /** Equivalent de db.pragma('journal_mode = WAL'). */
  pragma(directive: string): void {
    this.base.exec(`PRAGMA ${directive}`);
  }

  /**
   * Enveloppe une fonction dans une transaction. Les appels imbriques
   * utilisent un point de sauvegarde, comme le fait better-sqlite3.
   */
  transaction<T extends (...args: never[]) => unknown>(fonction: T): T {
    return ((...args: never[]) => {
      const imbriquee = this.profondeurTransaction > 0;
      const nom = `pt_${this.profondeurTransaction}`;
      this.base.exec(imbriquee ? `SAVEPOINT ${nom}` : 'BEGIN');
      this.profondeurTransaction += 1;
      try {
        const resultat = fonction(...args);
        this.base.exec(imbriquee ? `RELEASE ${nom}` : 'COMMIT');
        return resultat;
      } catch (erreur) {
        this.base.exec(imbriquee ? `ROLLBACK TO ${nom}` : 'ROLLBACK');
        throw erreur;
      } finally {
        this.profondeurTransaction -= 1;
      }
    }) as T;
  }

  close(): void {
    this.base.close();
  }
}

let instance: BaseLocale | null = null;

/** Connexion unique a la base locale, creee et migree a la premiere demande. */
export function db(): BaseLocale {
  if (instance) return instance;
  const database = new BaseLocale(config.databasePath);
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
