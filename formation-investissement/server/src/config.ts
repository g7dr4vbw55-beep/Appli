import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const here = path.dirname(fileURLToPath(import.meta.url));
export const SERVER_ROOT = path.resolve(here, '..');
export const PROJECT_ROOT = path.resolve(SERVER_ROOT, '..');

// Le .env vit a la racine du projet (une seule configuration pour les deux
// espaces de travail). On accepte aussi un .env local au serveur.
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });
dotenv.config({ path: path.join(SERVER_ROOT, '.env') });

function num(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw.trim() === '') return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const databasePath = process.env.DATABASE_PATH?.trim() || './data/formation.db';
const resolvedDbPath = path.isAbsolute(databasePath)
  ? databasePath
  : path.join(SERVER_ROOT, databasePath);
fs.mkdirSync(path.dirname(resolvedDbPath), { recursive: true });

export type EquityProvider = 'finnhub' | 'alphavantage' | 'manual';

const rawProvider = (process.env.EQUITY_PROVIDER?.trim() || 'manual').toLowerCase();
const equityProvider: EquityProvider =
  rawProvider === 'finnhub' || rawProvider === 'alphavantage' ? rawProvider : 'manual';

export const config = {
  port: num('PORT', 3001),
  databasePath: resolvedDbPath,

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY?.trim() || '',
    // Modele impose par le cahier des charges, surchargeable par .env.
    model: process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-6',
  },

  quotes: {
    equityProvider,
    finnhubKey: process.env.FINNHUB_API_KEY?.trim() || '',
    alphaVantageKey: process.env.ALPHAVANTAGE_API_KEY?.trim() || '',
    coingeckoKey: process.env.COINGECKO_API_KEY?.trim() || '',
    coingeckoBaseUrl:
      process.env.COINGECKO_BASE_URL?.trim() || 'https://api.coingecko.com/api/v3',
    // Duree de vie du cache de cotations, en secondes.
    cacheTtlSeconds: num('QUOTE_CACHE_TTL_SECONDS', 120),
  },

  simulation: {
    startingCash: num('STARTING_CASH', 10000),
    feePercent: num('FEE_PERCENT', 0.35),
    feeFixed: num('FEE_FIXED', 1.0),
    concentrationAlertPercent: num('CONCENTRATION_ALERT_PERCENT', 20),
  },
} as const;

/** Le fournisseur actions est-il reellement exploitable (cle presente) ? */
export function equityProviderUsable(): boolean {
  if (config.quotes.equityProvider === 'finnhub') return Boolean(config.quotes.finnhubKey);
  if (config.quotes.equityProvider === 'alphavantage') {
    return Boolean(config.quotes.alphaVantageKey);
  }
  return false;
}
