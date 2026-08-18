# Formation à l’investissement

Application web **locale**, en français, destinée à **un seul utilisateur débutant complet**.
Elle enseigne les mécanismes des marchés d’actions, des ETF et des cryptomonnaies, fait
pratiquer sur un portefeuille **entièrement fictif**, et mesure la progression.

> **Ce que cette application ne fait jamais.**
> Elle ne recommande aucun actif, aucun produit et aucun intermédiaire. Elle ne produit
> aucun signal d’achat ou de vente, ni aucune prévision de prix. Elle ne promet aucun
> rendement. Elle n’encourage à aucun moment le passage à un investissement réel.
> Les performances passées ne présagent pas des performances futures, et tout capital
> investi peut être perdu, en totalité.

---

## Sommaire

- [Installation](#installation)
- [Configuration des clés d’API](#configuration-des-clés-dapi)
- [Lancement](#lancement)
- [Les quatre modules](#les-quatre-modules)
- [Commandes disponibles](#commandes-disponibles)
- [Architecture](#architecture)
- [Choix techniques structurants](#choix-techniques-structurants)
- [Vie privée et données](#vie-privée-et-données)
- [Dépannage](#dépannage)

---

## Installation

**Prérequis :** Node.js 20 ou plus récent (`node -v` pour vérifier).

```bash
cd formation-investissement
npm install
```

Une seule commande suffit : le projet utilise les *espaces de travail* npm, `npm install`
à la racine installe les dépendances du serveur **et** du client.

> `better-sqlite3` est un module natif : son installation compile ou télécharge un binaire.
> Si elle échoue, voyez la section [Dépannage](#dépannage).

Puis chargez le contenu pédagogique et le jeu de démonstration :

```bash
cp .env.example .env
npm run seed:demo
```

La commande affiche un récapitulatif de vérification :

```
Niveaux           : 5
Lecons            : 26
Questions de quiz : 25
Propositions      : 100
Termes glossaire  : 121
Actifs            : 16

Aucune anomalie detectee.
```

---

## Configuration des clés d’API

Toutes les clés sont lues depuis le fichier `.env` **à la racine du projet**. Aucune clé
n’est écrite en dur dans le code, et `.env` n’est jamais versionné. Le fichier
`.env.example` fourni documente chaque variable.

**Aucune clé n’est nécessaire pour démarrer.** Les modules 1, 2 et 3 fonctionnent
intégralement sans aucune clé, et le jeu de démonstration fonctionne hors ligne.

| Variable | Nécessaire pour | Où l’obtenir |
|---|---|---|
| `ANTHROPIC_API_KEY` | Le décrypteur d’actualité (module 4) uniquement | [console.anthropic.com](https://console.anthropic.com) |
| `ANTHROPIC_MODEL` | Modèle utilisé par le décrypteur | valeur par défaut : `claude-sonnet-4-6` |
| `EQUITY_PROVIDER` | Cotations actions et ETF : `finnhub`, `alphavantage` ou `manual` | valeur par défaut : `manual` |
| `FINNHUB_API_KEY` | Si `EQUITY_PROVIDER=finnhub` | [finnhub.io/register](https://finnhub.io/register) — offre gratuite |
| `ALPHAVANTAGE_API_KEY` | Si `EQUITY_PROVIDER=alphavantage` | [alphavantage.co](https://www.alphavantage.co/support/#api-key) — offre gratuite |
| `COINGECKO_API_KEY` | Facultatif : CoinGecko fonctionne sans clé | [coingecko.com](https://www.coingecko.com/fr/api) |

Les paramètres de simulation (`STARTING_CASH`, `FEE_PERCENT`, `FEE_FIXED`,
`CONCENTRATION_ALERT_PERCENT`) sont également dans `.env`, et modifiables ensuite depuis
l’écran **Portefeuille → Paramètres**.

Après toute modification de `.env`, relancez `npm run dev`.

---

## Lancement

```bash
npm run dev
```

Une seule commande démarre les deux processus :

- **client** : http://localhost:5173 ← c’est l’adresse à ouvrir
- **API** : http://localhost:3001

Le client transmet les appels `/api` au serveur via le proxy de Vite : il n’y a qu’une
seule origine, et aucune configuration CORS.

---

## Les quatre modules

### Module 1 — Parcours de formation

**5 niveaux, 26 leçons, 25 quiz.** Chaque leçon fait 300 à 500 mots et cite des sources
officielles (AMF, INSEE, Banque de France, service-public.fr, impots.gouv.fr).

| Niveau | Sujet | Leçons |
|---|---|---|
| 1 | Les fondations | intérêts composés, inflation, épargne de précaution, impact des frais, horizon de placement |
| 2 | Actions et ETF | action, indice, ETF, diversification, PEA et compte-titres, investissement programmé |
| 3 | Cryptomonnaies | blockchain, bitcoin et altcoins, plateformes et portefeuilles, phrase de récupération, volatilité et perte totale |
| 4 | Risque et psychologie | couple risque/rendement, taille de position, effet de levier, biais de confirmation, FOMO et capitulation |
| 5 | Arnaques et pièges | rendement garanti, faux conseillers, pump and dump, systèmes pyramidaux, signaux d’alerte |

Chaque niveau se termine par un **quiz de 5 questions à choix multiple**. Chaque
proposition — la bonne comme les mauvaises — est accompagnée de son explication.
**Le niveau suivant ne se débloque qu’à partir de 80 % de bonnes réponses.**

### Module 2 — Portefeuille fictif d’entraînement

Capital virtuel de **10 000 €**. Ordres d’achat et de vente sur actions, ETF et
cryptomonnaies, avec **frais de transaction simulés paramétrables** (part proportionnelle
plus part fixe).

**Cotations :**

- **Crypto** : API publique CoinGecko, sans clé nécessaire.
- **Actions et ETF** : fournisseur configurable (Finnhub ou Alpha Vantage, clé gratuite).
- **Mode dégradé** : si une API est indisponible ou non configurée, l’application bascule
  automatiquement sur les **prix saisis à la main** (écran Portefeuille → *Saisie manuelle
  des prix*), en affichant clairement l’origine de chaque prix. C’est également la seule
  source pour les ETF européens, qu’aucune API gratuite ne couvre correctement.

**Affichage :** performance du portefeuille, répartition par classe d’actif, comparaison à
un indice de référence que vous choisissez, et **alertes visuelles** quand une position
dépasse 20 % du portefeuille ou quand la diversification est insuffisante.

> **Aucun ordre ne peut être passé tant que le journal de décision correspondant n’est pas
> rempli.** C’est une contrainte volontaire du module 3.

### Module 3 — Journal de décisions et bilan d’erreurs

**Avant chaque ordre**, quatre éléments sont obligatoires :

1. la **thèse d’investissement** (40 caractères minimum) ;
2. l’**horizon de détention**, en mois ;
3. le **risque accepté en euros** sur cette position ;
4. la **condition précise qui invaliderait la thèse** (20 caractères minimum).

**À la clôture d’une position**, l’application demande un bilan et calcule l’écart entre ce
qui était prévu et ce qui s’est passé : durée réelle contre horizon annoncé, résultat
réalisé contre risque accepté, condition d’invalidation atteinte ou non, et respectée ou
non.

Le tableau de bord agrège les décisions passées et fait ressortir les **schémas
répétitifs** :

- sorties en perte peu après l’ouverture (capitulation) ;
- horizon de détention nettement plus court que prévu ;
- condition d’invalidation atteinte sans action ;
- renforcements effectués sous le prix moyen déjà payé ;
- positions gagnantes conservées moins longtemps que les perdantes (effet de disposition) ;
- positions clôturées sans bilan ;
- poids des frais simulés sur l’ensemble des ordres.

Chaque constat renvoie vers la leçon correspondante du parcours. **Le bilan est descriptif
et factuel : il ne juge pas la personne.**

### Module 4 — Glossaire et décrypteur d’actualité

**Glossaire de 121 termes** consultable et recherchable, réparti en six catégories, chacun
avec une définition en langage simple, un **exemple concret**, un éventuel point de
vigilance et des renvois vers les termes associés.

**Décrypteur** : collez un article, une publication, un message ou une publicité. L’outil
renvoie :

- l’explication du **jargon** employé ;
- un **résumé** de ce qui est réellement affirmé ;
- la séparation entre **faits vérifiables** et **opinions ou promesses** ;
- la liste des **signaux d’alerte détectés** (promesse de rendement, pression à l’urgence,
  absence d’auteur identifiable…), avec l’extrait correspondant et un niveau de gravité ;
- les informations manquantes, des questions de vérification et les registres officiels à
  consulter.

Ce module s’appuie sur l’API Anthropic, **appelée depuis le back-end** : la clé ne transite
jamais par le navigateur. Le prompt système interdit explicitement toute recommandation
d’achat ou de vente et toute prédiction de prix, et impose une réponse structurée en
français. Le format de la réponse est en outre **contraint côté API par un schéma JSON**,
puis **revalidé côté serveur**.

### Fiche fiscale

Une section distincte expose les **mécanismes** du droit fiscal français : fait générateur,
prélèvement forfaitaire unique, compte-titres ordinaire, PEA, imposition des plus-values
sur actifs numériques, obligations déclaratives. Elle ne calcule aucun impôt, ne remplit
aucune déclaration et ne propose aucune stratégie d’optimisation. Chaque section renvoie à
la source officielle qui fait foi et rappelle que la réglementation évolue.

---

## Commandes disponibles

| Commande | Effet |
|---|---|
| `npm run dev` | Démarre le client et l’API ensemble |
| `npm run seed` | (Re)charge le contenu pédagogique, **sans toucher** à vos données |
| `npm run seed:demo` | Charge le contenu **et** le jeu de démonstration (écrase vos données) |
| `npm run reset` | Remise à zéro complète, puis contenu et démonstration |
| `npm run typecheck` | Vérifie les types du serveur et du client |
| `npm run verif` | Typecheck + vérification hors ligne du module 4 |
| `npm run build` | Compile le client pour la production |
| `npm run start` | Démarre l’API seule |

### Jeu de démonstration

`npm run seed:demo` crée un historique fictif complet, **fonctionnant entièrement hors
ligne** (les prix sont insérés en base, aucun appel réseau n’est nécessaire) :

- 120 jours d’historique de valorisation et 18 relevés hebdomadaires ;
- 15 ordres, 3 positions ouvertes, 5 positions clôturées, 4 bilans rédigés ;
- une progression pédagogique : niveaux 1 et 2 validés, niveau 3 échoué puis réussi ;
- un scénario conçu pour **déclencher les six schémas répétitifs** du module 3 et les
  alertes de concentration du module 2.

Tous les chiffres et toutes les thèses de ce jeu sont **inventés**. Aucun n’est une
cotation réelle, aucun n’est une recommandation.

---

## Architecture

```
formation-investissement/
├── package.json              espaces de travail npm, scripts communs
├── .env.example              toutes les variables documentées
├── server/
│   └── src/
│       ├── config.ts         lecture du .env
│       ├── db/
│       │   ├── schema.sql    schéma SQLite (rejouable sans risque)
│       │   ├── seed.ts       chargement du contenu + vérification d’intégrité
│       │   └── demo.ts       jeu de démonstration hors ligne
│       ├── content/          contenu pédagogique versionné en TypeScript
│       │   ├── niveau1.ts … niveau5.ts
│       │   ├── glossaire.ts  121 termes
│       │   ├── fiscalite.ts  fiche fiscale française
│       │   └── actifs.ts     actifs proposés au simulateur
│       ├── services/
│       │   ├── parcours.ts     progression, quiz, déverrouillage
│       │   ├── cotations.ts    CoinGecko, fournisseur actions, mode manuel
│       │   ├── portefeuille.ts valorisation, ordres, alertes, indice
│       │   ├── journal.ts      décisions et bilans
│       │   ├── schemas.ts      écarts prévu/réalisé, schémas répétitifs
│       │   ├── glossaire.ts    recherche
│       │   └── decrypteur.ts   prompt système et appel API
│       └── routes/           une route par module
└── client/
    └── src/
        ├── components/       mise en page, composants d’interface, rendu markdown
        ├── lib/              client HTTP, formatage français, types partagés
        └── pages/            un écran par module
```

---

## Choix techniques structurants

Ces décisions ont été prises explicitement, et non par défaut.

1. **Espaces de travail npm** plutôt que deux projets séparés : un seul `npm install`, un
   seul `npm run dev`, une seule version de chaque dépendance partagée.

2. **Le contenu pédagogique est du code TypeScript versionné**, chargé dans SQLite de façon
   *idempotente*. La base contient l’état de l’utilisateur (progression, ordres, journal) ;
   le contenu peut être corrigé et rechargé avec `npm run seed` **sans perdre aucune donnée
   personnelle**. Le seed effectue en outre une vérification d’intégrité (nombre de leçons
   par niveau, exactement une bonne réponse par question, longueur des leçons, taille du
   glossaire) et signale toute anomalie.

3. **Proxy Vite vers l’API** : le client et l’API partagent la même origine en
   développement, ce qui évite toute configuration CORS.

4. **Trois sources de prix, avec repli explicite.** Chaque cotation transporte sa source et,
   le cas échéant, un avertissement lisible. Une API indisponible ne bloque jamais
   l’application : elle bascule sur le prix manuel et le dit.

5. **Le taux EUR/USD est déduit du prix du bitcoin coté simultanément en euros et en
   dollars par CoinGecko**, plutôt que d’ajouter un troisième fournisseur d’API. Ce taux est
   approché ; il peut être remplacé par une valeur saisie à la main dans les paramètres, qui
   devient alors prioritaire.

6. **Le journal est un prérequis technique de l’ordre**, pas une suggestion : l’API refuse
   tout ordre sans identifiant de décision valide et non encore consommée. Une décision ne
   sert qu’une fois.

7. **Les positions sont modélisées explicitement** (ouverture, renforcement, clôture) plutôt
   que recalculées à partir des ordres. C’est ce qui permet au module 3 de comparer une
   intention écrite à une durée de détention réelle.

8. **Le décrypteur n’utilise pas le helper Zod du SDK Anthropic**, qui exige Zod v4 alors
   que le reste du serveur valide ses entrées avec Zod 3. Le schéma JSON est écrit
   explicitement, et la réponse du modèle est **revalidée localement** avec Zod après
   réception : double barrière.

---

## Vie privée et données

- Tout est stocké **localement**, dans un unique fichier SQLite (`server/data/formation.db`
  par défaut). Ce fichier n’est pas versionné.
- Aucune authentification, aucun compte, aucun envoi de données personnelles.
- Trois appels sortants seulement, et uniquement quand ils sont nécessaires :
  **CoinGecko** (cotations crypto), le **fournisseur actions** que vous avez configuré, et
  l’**API Anthropic** lorsque vous utilisez le décrypteur.
- Le texte que vous collez dans le décrypteur **est envoyé à l’API Anthropic** pour être
  analysé, et conservé dans votre base locale. L’écran le rappelle. Vous pouvez supprimer
  chaque analyse depuis l’historique.
- En mode `EQUITY_PROVIDER=manual` et sans clé Anthropic, seule CoinGecko est appelée.
  Avec le jeu de démonstration, l’application fonctionne **entièrement hors ligne**.

---

## Dépannage

**`npm install` échoue sur `better-sqlite3`.**
C’est un module natif. Sous Linux, installez les outils de compilation
(`build-essential`, `python3`) ; sous macOS, les *Command Line Tools* (`xcode-select
--install`). Puis relancez `npm install`.

**Le port 3001 ou 5173 est déjà utilisé.**
Changez `PORT` dans `.env` pour l’API. Pour le client, modifiez `server.port` dans
`client/vite.config.ts` (pensez à ajuster la cible du proxy si vous changez le port de
l’API).

**Les prix des cryptomonnaies n’apparaissent pas.**
L’offre publique de CoinGecko applique une limite de débit ; les cotations sont mises en
cache deux minutes. Si l’API reste injoignable, l’application le signale sur chaque ligne
concernée et bascule sur les prix manuels. Vous pouvez saisir un prix depuis
**Portefeuille → Saisie manuelle des prix**.

**Les actions et ETF affichent « prix indisponible ».**
C’est le comportement attendu tant que `EQUITY_PROVIDER` vaut `manual` ou que la clé du
fournisseur est absente. Saisissez les prix à la main, ou renseignez une clé gratuite.

**Le décrypteur indique qu’il est indisponible.**
Ajoutez `ANTHROPIC_API_KEY=…` dans `.env` à la racine, puis relancez `npm run dev`.
Vous pouvez vérifier la configuration du module sans consommer de crédit avec
`npm run verif:decrypteur`.

**Je veux repartir de zéro.**
`npm run reset` remet tout à zéro et recharge le contenu et la démonstration.
Pour ne remettre à zéro que le portefeuille en conservant la progression pédagogique,
utilisez **Portefeuille → Paramètres → Remettre le portefeuille à zéro**.

---

## Avertissement final

Cette application est un **outil d’apprentissage**. Elle ne constitue ni un conseil en
investissement, ni une recommandation personnalisée, ni une incitation à investir. Le
portefeuille est fictif et le reste : passer à un investissement réel est une décision qui
n’appartient qu’à vous, et pour laquelle cette application ne fournit délibérément aucune
assistance. Pour toute question portant sur votre situation, adressez-vous à un
professionnel habilité, dont vous aurez vérifié l’enregistrement sur
[orias.fr](https://www.orias.fr/), et consultez les mises en garde publiées par l’AMF sur
[amf-france.org](https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde).
