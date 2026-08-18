import { Router } from 'express';
import { z } from 'zod';
import {
  annulerDecision,
  creerDecision,
  decisionsEnAttente,
  enregistrerBilan,
  historiqueDecisions,
  natureDecision,
} from '../services/journal.js';
import { positionsCloturees } from '../services/portefeuille.js';
import { ecartsPrevuRealise, schemasRepetitifs } from '../services/schemas.js';

export const journalRouter = Router();

const schemaDecision = z.object({
  actifId: z.number().int().positive(),
  side: z.enum(['achat', 'vente']),
  // Une these vide ne permet pas de se relire : le minimum est impose ici.
  these: z.string().trim().min(40, 'Décrivez votre thèse en quelques lignes (40 caractères minimum).'),
  horizon: z.enum(['court', 'moyen', 'long']),
  horizonMois: z.number().int().min(1).max(600),
  risqueAccepteEuros: z.number().min(0),
  conditionInvalidation: z
    .string()
    .trim()
    .min(20, "Formulez précisément ce qui invaliderait votre thèse (20 caractères minimum)."),
  conviction: z.number().int().min(1).max(5),
  emotion: z.string().trim().max(300).optional(),
  quantitePrevue: z.number().positive().optional(),
  prixPrevu: z.number().positive().optional(),
});

journalRouter.post('/decisions', (req, res) => {
  const parse = schemaDecision.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      erreur: 'Le journal de décision est incomplet.',
      details: parse.error.flatten(),
    });
  }
  try {
    res.json(creerDecision(parse.data));
  } catch (e) {
    res.status(400).json({ erreur: (e as Error).message });
  }
});

journalRouter.get('/decisions', (_req, res) => {
  res.json({ decisions: historiqueDecisions() });
});

journalRouter.get('/decisions/en-attente', (_req, res) => {
  res.json({ decisions: decisionsEnAttente() });
});

journalRouter.get('/nature', (req, res) => {
  const actifId = Number(req.query.actifId);
  const side = req.query.side === 'vente' ? 'vente' : 'achat';
  if (!Number.isInteger(actifId) || actifId <= 0) {
    return res.status(400).json({ erreur: 'Actif invalide.' });
  }
  res.json({ nature: natureDecision(actifId, side) });
});

journalRouter.post('/decisions/:id/annuler', (req, res) => {
  const ok = annulerDecision(Number(req.params.id));
  if (!ok) {
    return res
      .status(400)
      .json({ erreur: 'Seule une décision non encore exécutée peut être annulée.' });
  }
  res.json({ ok: true });
});

journalRouter.get('/positions-cloturees', (_req, res) => {
  res.json({ positions: positionsCloturees() });
});

const schemaBilan = z.object({
  positionId: z.number().int().positive(),
  cequisEstPasse: z
    .string()
    .trim()
    .min(30, 'Décrivez ce qui s’est passé en quelques lignes (30 caractères minimum).'),
  issueThese: z.enum(['verifiee', 'partiellement', 'invalidee', 'indeterminee']),
  invalidationDeclenchee: z.boolean(),
  invalidationRespectee: z.boolean(),
  raisonSortie: z.enum([
    'these_atteinte',
    'invalidation',
    'besoin_argent',
    'peur',
    'euphorie',
    'rebalancement',
    'autre',
  ]),
  emotion: z.string().trim().max(300).optional(),
  lecon: z.string().trim().max(2000).optional(),
});

journalRouter.post('/bilans', (req, res) => {
  const parse = schemaBilan.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ erreur: 'Bilan incomplet.', details: parse.error.flatten() });
  }
  try {
    enregistrerBilan(parse.data);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ erreur: (e as Error).message });
  }
});

journalRouter.get('/tableau-de-bord', (_req, res) => {
  const { schemas, volumetrie } = schemasRepetitifs();
  res.json({
    volumetrie,
    schemas,
    ecarts: ecartsPrevuRealise(),
    avertissement:
      'Ces constats sont descriptifs et factuels. Ils comparent ce que vous avez écrit avant chaque ordre à ce qui s’est produit ensuite. Ils ne jugent pas la personne et ne suggèrent aucune action de marché.',
  });
});
