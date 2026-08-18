export interface Source {
  label: string;
  url: string;
}

export interface LessonSeed {
  slug: string;
  title: string;
  summary: string;
  body: string;
  keyPoints: string[];
  sources: Source[];
}

export interface ChoiceSeed {
  label: string;
  correct?: boolean;
  /** Pourquoi cette reponse est juste, ou pourquoi elle est fausse. */
  explanation: string;
}

export interface QuestionSeed {
  slug: string;
  prompt: string;
  takeaway: string;
  choices: ChoiceSeed[];
}

export interface LevelSeed {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  lessons: LessonSeed[];
  quiz: QuestionSeed[];
}

export interface GlossarySeed {
  slug: string;
  term: string;
  category:
    | 'bases'
    | 'actions-etf'
    | 'crypto'
    | 'risque'
    | 'fiscalite'
    | 'arnaques';
  definition: string;
  example: string;
  caution?: string;
  related?: string[];
}

export interface AssetSeed {
  symbol: string;
  name: string;
  assetClass: 'action' | 'etf' | 'crypto';
  provider: 'coingecko' | 'finnhub' | 'alphavantage' | 'manual';
  providerRef: string;
  currency?: string;
  isBenchmark?: boolean;
  notes?: string;
}
