import { Router } from 'express';
import { z } from 'zod';
import {
  corrigerQuiz,
  etatParcours,
  historiqueTentatives,
  lecon,
  marquerLeconLue,
  quiz,
} from '../services/parcours.js';

export const parcoursRouter = Router();

parcoursRouter.get('/', (_req, res) => {
  res.json({ niveaux: etatParcours() });
});

parcoursRouter.get('/tentatives', (_req, res) => {
  res.json({ tentatives: historiqueTentatives() });
});

parcoursRouter.get('/lecons/:slug', (req, res) => {
  const resultat = lecon(req.params.slug);
  if (!resultat) return res.status(404).json({ erreur: 'Leçon introuvable.' });
  if (resultat.verrouille) return res.status(403).json({ erreur: resultat.message });
  res.json(resultat);
});

parcoursRouter.post('/lecons/:slug/lue', (req, res) => {
  const ok = marquerLeconLue(req.params.slug);
  if (!ok) return res.status(404).json({ erreur: 'Leçon introuvable.' });
  res.json({ ok: true });
});

parcoursRouter.get('/:slug/quiz', (req, res) => {
  const resultat = quiz(req.params.slug);
  if (!resultat) return res.status(404).json({ erreur: 'Niveau introuvable.' });
  if (resultat.verrouille) return res.status(403).json({ erreur: resultat.message });
  res.json(resultat);
});

const schemaReponses = z.object({
  reponses: z
    .array(
      z.object({
        questionId: z.number().int().positive(),
        choiceId: z.number().int().positive().nullable(),
      }),
    )
    .min(1),
});

parcoursRouter.post('/:slug/quiz', (req, res) => {
  const parse = schemaReponses.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ erreur: 'Réponses invalides.', details: parse.error.flatten() });
  }
  const resultat = corrigerQuiz(req.params.slug, parse.data.reponses);
  if (!resultat) return res.status(404).json({ erreur: 'Niveau introuvable.' });
  if (resultat.verrouille) return res.status(403).json({ erreur: resultat.message });
  res.json(resultat);
});
