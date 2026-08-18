import { Router } from 'express';
import { AVERTISSEMENT_FISCAL, sectionsFiscales } from '../content/fiscalite.js';

export const fiscaliteRouter = Router();

fiscaliteRouter.get('/', (_req, res) => {
  res.json({
    avertissement: AVERTISSEMENT_FISCAL,
    sections: sectionsFiscales,
  });
});

fiscaliteRouter.get('/:slug', (req, res) => {
  const section = sectionsFiscales.find((s) => s.slug === req.params.slug);
  if (!section) return res.status(404).json({ erreur: 'Section introuvable.' });
  res.json({ avertissement: AVERTISSEMENT_FISCAL, section });
});
