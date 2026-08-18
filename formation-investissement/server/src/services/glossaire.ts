import { db } from '../db/index.js';

export interface TermeGlossaire {
  slug: string;
  terme: string;
  categorie: string;
  definition: string;
  exemple: string;
  vigilance: string;
  associes: string[];
}

const libellesCategories: Record<string, string> = {
  bases: 'Bases',
  'actions-etf': 'Actions et ETF',
  crypto: 'Cryptomonnaies',
  risque: 'Risque et psychologie',
  fiscalite: 'Fiscalité',
  arnaques: 'Arnaques',
};

interface LigneTerme {
  slug: string;
  term: string;
  category: string;
  definition: string;
  example: string;
  caution: string;
  related: string;
}

function convertir(ligne: LigneTerme): TermeGlossaire {
  return {
    slug: ligne.slug,
    terme: ligne.term,
    categorie: ligne.category,
    definition: ligne.definition,
    exemple: ligne.example,
    vigilance: ligne.caution,
    associes: JSON.parse(ligne.related) as string[],
  };
}

export function chercher(requete?: string, categorie?: string) {
  const database = db();
  let sql = 'SELECT * FROM glossary_terms';
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (requete && requete.trim()) {
    conditions.push('(term LIKE ? OR definition LIKE ? OR example LIKE ? OR slug LIKE ?)');
    const motif = `%${requete.trim()}%`;
    params.push(motif, motif, motif, motif);
  }
  if (categorie && categorie !== 'toutes') {
    conditions.push('category = ?');
    params.push(categorie);
  }
  if (conditions.length > 0) sql += ` WHERE ${conditions.join(' AND ')}`;
  sql += ' ORDER BY term COLLATE NOCASE';

  const lignes = database.prepare(sql).all(...(params as [])) as LigneTerme[];

  const compteurs = database
    .prepare('SELECT category, COUNT(*) AS n FROM glossary_terms GROUP BY category')
    .all() as { category: string; n: number }[];

  return {
    termes: lignes.map(convertir),
    total: (database.prepare('SELECT COUNT(*) AS n FROM glossary_terms').get() as { n: number }).n,
    categories: compteurs.map((c) => ({
      code: c.category,
      libelle: libellesCategories[c.category] ?? c.category,
      nombre: c.n,
    })),
  };
}

export function terme(slug: string): TermeGlossaire | null {
  const ligne = db().prepare('SELECT * FROM glossary_terms WHERE slug = ?').get(slug) as
    | LigneTerme
    | undefined;
  return ligne ? convertir(ligne) : null;
}
