import { Router } from 'express';
import { z } from 'zod';
import { chercher, terme } from '../services/glossaire.js';
import {
  analyser,
  analyseParId,
  decrypteurDisponible,
  enregistrerAnalyse,
  historiqueAnalyses,
  supprimerAnalyse,
} from '../services/decrypteur.js';

export const glossaireRouter = Router();

glossaireRouter.get('/', (req, res) => {
  const requete = typeof req.query.q === 'string' ? req.query.q : undefined;
  const categorie = typeof req.query.categorie === 'string' ? req.query.categorie : undefined;
  res.json(chercher(requete, categorie));
});

glossaireRouter.get('/terme/:slug', (req, res) => {
  const resultat = terme(req.params.slug);
  if (!resultat) return res.status(404).json({ erreur: 'Terme introuvable.' });
  res.json(resultat);
});

export const decrypteurRouter = Router();

decrypteurRouter.get('/etat', (_req, res) => {
  res.json({
    disponible: decrypteurDisponible(),
    message: decrypteurDisponible()
      ? null
      : "Le décrypteur nécessite une clé ANTHROPIC_API_KEY dans le fichier .env, à la racine du projet. Tous les autres modules fonctionnent sans cette clé.",
  });
});

const schemaAnalyse = z.object({
  texte: z
    .string()
    .trim()
    .min(80, 'Le texte à décrypter doit faire au moins 80 caractères.')
    .max(40000, 'Le texte est trop long : 40 000 caractères au maximum.'),
  contexte: z.string().trim().max(300).optional(),
});

decrypteurRouter.post('/analyser', async (req, res) => {
  const parse = schemaAnalyse.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      erreur: parse.error.issues[0]?.message ?? 'Texte invalide.',
    });
  }
  try {
    const { analyse, modele } = await analyser(parse.data.texte, parse.data.contexte);
    const id = enregistrerAnalyse(
      analyse.titre,
      parse.data.texte,
      parse.data.contexte ?? '',
      analyse,
      modele,
    );
    res.json({ id, analyse, modele });
  } catch (e) {
    res.status(400).json({ erreur: (e as Error).message });
  }
});

decrypteurRouter.get('/historique', (_req, res) => {
  res.json({ analyses: historiqueAnalyses() });
});

decrypteurRouter.get('/analyses/:id', (req, res) => {
  const resultat = analyseParId(Number(req.params.id));
  if (!resultat) return res.status(404).json({ erreur: 'Analyse introuvable.' });
  res.json(resultat);
});

decrypteurRouter.delete('/analyses/:id', (req, res) => {
  const ok = supprimerAnalyse(Number(req.params.id));
  if (!ok) return res.status(404).json({ erreur: 'Analyse introuvable.' });
  res.json({ ok: true });
});
