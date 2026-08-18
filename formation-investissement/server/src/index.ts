import express from 'express';
import { config, equityProviderUsable } from './config.js';
import { db, ensureAccount } from './db/index.js';
import { parcoursRouter } from './routes/parcours.js';
import { portefeuilleRouter } from './routes/portefeuille.js';
import { journalRouter } from './routes/journal.js';
import { glossaireRouter, decrypteurRouter } from './routes/glossaire.js';
import { fiscaliteRouter } from './routes/fiscalite.js';

const app = express();
app.use(express.json({ limit: '1mb' }));

// La base est ouverte et migree au demarrage, le compte virtuel garanti.
db();
ensureAccount();

app.get('/api/sante', (_req, res) => {
  res.json({
    ok: true,
    version: '1.0.0',
    modules: {
      parcours: true,
      portefeuille: true,
      journal: true,
      glossaire: true,
      fiscalite: true,
      decrypteur: Boolean(config.anthropic.apiKey),
    },
    cotations: {
      fournisseurActions: config.quotes.equityProvider,
      fournisseurActionsUtilisable: equityProviderUsable(),
      crypto: 'coingecko',
    },
    simulation: config.simulation,
    // Rappel affiche en permanence par le client.
    avertissement:
      "Contenu informatif et pédagogique. Aucune recommandation d'achat ou de vente. Les performances passées ne présagent pas des performances futures et tout capital investi peut être perdu.",
  });
});

app.use('/api/parcours', parcoursRouter);
app.use('/api/portefeuille', portefeuilleRouter);
app.use('/api/journal', journalRouter);
app.use('/api/glossaire', glossaireRouter);
app.use('/api/decrypteur', decrypteurRouter);
app.use('/api/fiscalite', fiscaliteRouter);

app.use((_req, res) => {
  res.status(404).json({ erreur: 'Route inconnue.' });
});

// Gestionnaire d'erreurs : jamais de trace technique renvoyee au client.
app.use(
  (
    erreur: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('Erreur serveur :', erreur);
    res.status(500).json({
      erreur:
        erreur instanceof Error ? erreur.message : "Une erreur inattendue s'est produite.",
    });
  },
);

app.listen(config.port, () => {
  console.log(`API de formation a l'investissement : http://localhost:${config.port}`);
  console.log(`Base SQLite : ${config.databasePath}`);
  if (!config.anthropic.apiKey) {
    console.log(
      "Note : ANTHROPIC_API_KEY absente du .env, le decrypteur d'actualite sera desactive.",
    );
  }
  if (!equityProviderUsable()) {
    console.log(
      `Note : cotations actions/ETF en mode manuel (EQUITY_PROVIDER=${config.quotes.equityProvider}). Les prix se saisissent dans l'application.`,
    );
  }
});
