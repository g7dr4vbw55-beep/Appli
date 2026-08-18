import { Router } from 'express';
import { z } from 'zod';
import {
  actifsDisponibles,
  calculerFrais,
  definirParametres,
  enregistrerInstantane,
  etatPortefeuille,
  historiqueOrdres,
  parametresActuels,
  passerOrdre,
  reinitialiserPortefeuille,
} from '../services/portefeuille.js';
import {
  actifParId,
  cotations,
  definirTauxManuel,
  enregistrerPrixManuel,
  tousLesActifs,
  tauxUsdVersEur,
} from '../services/cotations.js';

export const portefeuilleRouter = Router();

portefeuilleRouter.get('/', async (_req, res, next) => {
  try {
    res.json(await etatPortefeuille());
  } catch (e) {
    next(e);
  }
});

portefeuilleRouter.get('/actifs', (_req, res) => {
  res.json({ actifs: actifsDisponibles() });
});

portefeuilleRouter.get('/cotations', async (_req, res, next) => {
  try {
    const actifs = tousLesActifs();
    const prix = await cotations(actifs);
    const { taux, source } = await tauxUsdVersEur();
    res.json({
      cotations: actifs.map((actif) => {
        const cotation = prix.get(actif.id);
        return {
          actifId: actif.id,
          symbole: actif.symbol,
          nom: actif.name,
          classe: actif.asset_class,
          fournisseur: actif.provider,
          devise: actif.currency,
          prix: cotation?.prix ?? null,
          prixEuros: cotation?.prixEuros ?? null,
          source: cotation?.source ?? 'indisponible',
          horodatage: cotation?.horodatage ?? null,
          avertissement: cotation?.avertissement ?? null,
        };
      }),
      change: { usdVersEur: taux, source },
    });
  } catch (e) {
    next(e);
  }
});

const schemaPrixManuel = z.object({
  actifId: z.number().int().positive(),
  prix: z.number().positive(),
  date: z.string().optional(),
});

portefeuilleRouter.post('/prix-manuel', (req, res) => {
  const parse = schemaPrixManuel.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ erreur: 'Prix manuel invalide.' });
  const actif = actifParId(parse.data.actifId);
  if (!actif) return res.status(404).json({ erreur: 'Actif inconnu.' });
  enregistrerPrixManuel(parse.data.actifId, parse.data.prix, parse.data.date);
  res.json({ ok: true });
});

const schemaOrdre = z.object({
  decisionId: z.number().int().positive(),
  quantite: z.number().positive(),
  prixUnitaire: z.number().positive().optional(),
});

portefeuilleRouter.post('/ordres', async (req, res, next) => {
  const parse = schemaOrdre.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({
      erreur:
        "Ordre invalide. Un ordre exige l'identifiant d'une décision de journal et une quantité positive.",
      details: parse.error.flatten(),
    });
  }
  try {
    res.json(await passerOrdre(parse.data));
  } catch (e) {
    if (e instanceof Error) return res.status(400).json({ erreur: e.message });
    next(e);
  }
});

portefeuilleRouter.get('/ordres', (_req, res) => {
  res.json({ ordres: historiqueOrdres() });
});

const schemaSimulation = z.object({ montantBrut: z.number().nonnegative() });

portefeuilleRouter.post('/frais', (req, res) => {
  const parse = schemaSimulation.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ erreur: 'Montant invalide.' });
  res.json(calculerFrais(parse.data.montantBrut));
});

portefeuilleRouter.get('/parametres', (_req, res) => {
  res.json(parametresActuels());
});

const schemaParametres = z.object({
  fraisPourcent: z.number().min(0).max(10).optional(),
  fraisFixe: z.number().min(0).max(100).optional(),
  seuilConcentration: z.number().min(1).max(100).optional(),
  symboleIndice: z.string().min(1).max(20).optional(),
  tauxUsdEur: z.number().min(0).max(10).optional(),
});

portefeuilleRouter.patch('/parametres', (req, res) => {
  const parse = schemaParametres.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ erreur: 'Paramètres invalides.' });
  definirParametres(parse.data);
  if (parse.data.tauxUsdEur !== undefined) definirTauxManuel(parse.data.tauxUsdEur);
  res.json(parametresActuels());
});

portefeuilleRouter.post('/instantane', async (_req, res, next) => {
  try {
    await enregistrerInstantane();
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

portefeuilleRouter.post('/reinitialiser', (_req, res) => {
  reinitialiserPortefeuille();
  res.json({ ok: true });
});
