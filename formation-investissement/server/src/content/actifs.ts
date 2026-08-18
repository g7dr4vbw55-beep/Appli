import type { AssetSeed } from './types.js';

/**
 * Actifs de reference proposes dans le portefeuille d'entrainement.
 *
 * Cette liste n'est PAS une selection ni une suggestion d'investissement :
 * ce sont des supports connus, choisis pour couvrir les trois classes d'actifs
 * et permettre de tester le simulateur. L'utilisateur peut en ajouter d'autres.
 *
 * Le champ provider indique d'ou vient la cotation :
 *  - coingecko : API publique CoinGecko (crypto)
 *  - finnhub / alphavantage : fournisseur actions/ETF configure dans .env
 *  - manual : prix saisi a la main dans l'application (mode degrade)
 */
export const actifs: AssetSeed[] = [
  // --- Indices de reference (comparaison de performance) --------------------
  {
    symbol: 'CW8',
    name: 'ETF MSCI World (indice de référence actions monde)',
    assetClass: 'etf',
    provider: 'manual',
    providerRef: 'AMUNDI-MSCI-WORLD',
    isBenchmark: true,
    notes:
      "Utilisé comme indice de référence par défaut. Vérifiez si la série que vous saisissez inclut ou non les dividendes (versions PR, NR ou GR).",
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    assetClass: 'crypto',
    provider: 'coingecko',
    providerRef: 'bitcoin',
    isBenchmark: true,
    notes: 'Indice de référence possible pour la poche crypto.',
  },

  // --- Cryptomonnaies (CoinGecko, API publique sans cle) -------------------
  { symbol: 'ETH', name: 'Ethereum', assetClass: 'crypto', provider: 'coingecko', providerRef: 'ethereum' },
  { symbol: 'SOL', name: 'Solana', assetClass: 'crypto', provider: 'coingecko', providerRef: 'solana' },
  { symbol: 'ADA', name: 'Cardano', assetClass: 'crypto', provider: 'coingecko', providerRef: 'cardano' },
  { symbol: 'XRP', name: 'XRP', assetClass: 'crypto', provider: 'coingecko', providerRef: 'ripple' },
  {
    symbol: 'USDC',
    name: 'USD Coin (stablecoin)',
    assetClass: 'crypto',
    provider: 'coingecko',
    providerRef: 'usd-coin',
    notes: "« Stable » est un nom commercial : la parité dépend des réserves de l'émetteur.",
  },

  // --- ETF (fournisseur configurable, repli manuel) -----------------------
  {
    symbol: 'ESE',
    name: 'ETF S&P 500 (réplication synthétique, éligible PEA)',
    assetClass: 'etf',
    provider: 'manual',
    providerRef: 'BNP-SP500',
    notes: 'Réplication synthétique : introduit un risque de contrepartie.',
  },
  {
    symbol: 'PAEEM',
    name: 'ETF marchés émergents',
    assetClass: 'etf',
    provider: 'manual',
    providerRef: 'AMUNDI-EM',
  },
  {
    symbol: 'AGGH',
    name: 'ETF obligations agrégées monde',
    assetClass: 'etf',
    provider: 'manual',
    providerRef: 'ISHARES-AGG',
  },

  // --- Actions (fournisseur configurable, repli manuel) -------------------
  { symbol: 'AAPL', name: 'Apple Inc.', assetClass: 'action', provider: 'finnhub', providerRef: 'AAPL', currency: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', assetClass: 'action', provider: 'finnhub', providerRef: 'MSFT', currency: 'USD' },
  { symbol: 'MC', name: 'LVMH', assetClass: 'action', provider: 'finnhub', providerRef: 'MC.PA' },
  { symbol: 'AI', name: 'Air Liquide', assetClass: 'action', provider: 'finnhub', providerRef: 'AI.PA' },
  { symbol: 'TTE', name: 'TotalEnergies', assetClass: 'action', provider: 'finnhub', providerRef: 'TTE.PA' },
  { symbol: 'BNP', name: 'BNP Paribas', assetClass: 'action', provider: 'finnhub', providerRef: 'BNP.PA' },
];
