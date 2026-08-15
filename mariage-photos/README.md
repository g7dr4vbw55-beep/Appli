# Photos de mariage — application de partage

Application web pour que les invités d'un mariage partagent leurs photos de la soirée en scannant un QR code, sans créer de compte ni installer d'application.

Ce README explique **tout, étape par étape**, sans supposer de connaissances techniques préalables. Comptez environ 30 à 45 minutes pour tout mettre en place la première fois.

## Ce dont vous avez besoin avant de commencer

- Une adresse email (pour créer les comptes Supabase et Vercel — les deux ont des offres gratuites, sans carte bancaire).
- Idéalement un compte GitHub, pour déployer facilement sur Vercel (sinon, une méthode alternative sans GitHub est expliquée plus bas).

Rien d'autre n'est requis : vous n'avez pas besoin de savoir programmer pour suivre ce guide.

---

## Étape 1 — Créer le projet Supabase

Supabase héberge la base de données et le stockage des photos.

1. Allez sur [supabase.com](https://supabase.com) et cliquez sur **Start your project**, puis créez un compte (email ou GitHub).
2. Une fois connecté, cliquez sur **New project**.
3. Choisissez une organisation (créez-en une si c'est votre premier projet), puis remplissez :
   - **Name** : par exemple `mariage-photos`
   - **Database Password** : cliquez sur "Generate a password" et **copiez-le dans un endroit sûr** (vous n'en aurez pas besoin pour cette application, mais gardez-le au cas où).
   - **Region** : choisissez la région la plus proche du lieu du mariage (par exemple "West EU (Paris)").
4. Plus bas, une section **Security** propose trois cases à cocher :
   - **Enable Data API** ("Activer l'API de données") : **laissez-la cochée**. C'est elle qui permet à l'application de communiquer avec la base.
   - **Expose new tables automatically** ("Afficher automatiquement les nouvelles tables") : cochez-la ou non, cela n'a pas d'importance — le script SQL de l'étape 3 accorde de toute façon les droits nécessaires lui-même.
   - **Enable automatic RLS** ("Activer le RLS automatique") : **laissez-la décochée**. Le script SQL active déjà la sécurité au niveau des lignes sur nos deux tables, explicitement.
5. Cliquez sur **Create new project** et patientez 1 à 2 minutes que le projet soit prêt.

## Étape 2 — Récupérer les clés du projet

1. Dans votre projet Supabase, allez dans **Project Settings** (icône d'engrenage en bas à gauche) puis **API**.
2. Notez ces trois valeurs, vous en aurez besoin plus tard :
   - **Project URL** (ressemble à `https://xxxxxxxxxxxx.supabase.co`)
   - **anon public** (une longue chaîne de caractères, sous "Project API keys")
   - **service_role** (une autre longue chaîne, plus bas dans la même page — cliquez sur "Reveal" pour l'afficher). **Ne partagez jamais cette clé et ne la mettez jamais dans du code visible du navigateur.**

## Étape 3 — Exécuter le script SQL

1. Toujours dans Supabase, allez dans **SQL Editor** (menu de gauche) puis cliquez sur **New query**.
2. Ouvrez le fichier [`supabase/schema.sql`](./supabase/schema.sql) de ce projet, copiez tout son contenu, et collez-le dans l'éditeur SQL de Supabase.
3. Cliquez sur **Run** (ou Ctrl/Cmd + Entrée). Vous devriez voir un message de succès. Cela crée les tables `photos` et `commentaires`, ainsi que les règles de sécurité (RLS) qui autorisent la lecture et l'ajout par tout le monde, mais **interdisent la suppression et la modification** depuis le navigateur — seule la page d'administration (via une clé secrète côté serveur) peut supprimer.

## Étape 4 — Créer le bucket de stockage

C'est l'endroit où les photos elles-mêmes seront stockées (la base de données ne contient que leurs informations).

1. Dans le menu de gauche, cliquez sur **Storage**.
2. Cliquez sur **New bucket**.
3. Donnez-lui le nom **`photos`** (exactement ce nom, en minuscules — sinon vous devrez adapter la variable `VITE_SUPABASE_BUCKET` plus tard).
4. Activez l'option **Public bucket** (interrupteur "Public bucket" sur ON). C'est nécessaire pour que les photos s'affichent dans la galerie sans configuration supplémentaire.
5. Cliquez sur **Create bucket**.

Les politiques de sécurité du bucket (qui autorisent le dépôt et la lecture publics, mais pas la suppression) ont déjà été créées à l'étape 3 par le script SQL.

---

## Étape 5 — Préparer le code du projet

1. Téléchargez ou clonez ce dépôt sur votre ordinateur.
2. Le projet de l'application se trouve dans le dossier **`mariage-photos/`**. Toutes les commandes ci-dessous s'exécutent **depuis ce dossier**.
3. Copiez le fichier d'exemple des variables d'environnement :

   ```bash
   cd mariage-photos
   cp .env.example .env
   ```

4. Ouvrez le fichier `.env` avec un éditeur de texte et remplissez chaque variable. Voici d'où vient chaque valeur :

   | Variable | Où la trouver |
   |---|---|
   | `VITE_SUPABASE_URL` | Étape 2 — "Project URL" |
   | `VITE_SUPABASE_ANON_KEY` | Étape 2 — "anon public" |
   | `VITE_SUPABASE_BUCKET` | `photos` (laissez tel quel si vous avez suivi l'étape 4) |
   | `VITE_ACCESS_CODE` | Choisissez vous-même un code simple à taper sur mobile (ex : le prénom des mariés) |
   | `VITE_ADMIN_PATH` | Choisissez une chaîne difficile à deviner, ex : `admin-` suivi de lettres/chiffres au hasard |
   | `ADMIN_PASSWORD` | Choisissez un mot de passe robuste pour la page d'administration |
   | `SUPABASE_SERVICE_ROLE_KEY` | Étape 2 — "service_role" (gardez-la secrète, ne la partagez jamais) |

   Aucune de ces valeurs n'est inventée par l'application : c'est à vous de les récupérer et de les coller, en suivant exactement le tableau ci-dessus.

## Étape 6 — Tester en local (optionnel mais recommandé)

Si vous avez [Node.js](https://nodejs.org) installé (version 22.6 ou plus récente) :

```bash
npm install
npm run dev
```

Ouvrez l'adresse affichée (généralement `http://localhost:5173`) dans votre navigateur. Vous devriez voir l'écran de code d'accès. Testez l'ajout d'une photo pour vérifier que tout est bien connecté avant de déployer.

Pour tester la page d'administration en local, ouvrez `http://localhost:5173/<VITE_ADMIN_PATH>` (remplacez par la valeur choisie dans votre `.env`).

---

## Étape 7 — Déployer sur Vercel

### Méthode recommandée : via GitHub

1. Créez un dépôt GitHub et poussez-y ce projet (s'il n'y est pas déjà).
2. Allez sur [vercel.com](https://vercel.com) et créez un compte (le plus simple : "Continue with GitHub").
3. Cliquez sur **Add New...** > **Project**.
4. Choisissez votre dépôt GitHub dans la liste (autorisez l'accès si demandé).
5. Dans l'écran de configuration du projet :
   - **Root Directory** : cliquez sur "Edit" et sélectionnez le dossier **`mariage-photos`** (important : ce dépôt contient aussi un autre projet à la racine, il faut bien pointer vers le sous-dossier).
   - Le **Framework Preset** devrait être détecté automatiquement comme "Vite".
6. Ouvrez la section **Environment Variables** et ajoutez **chacune** des variables listées dans le tableau de l'étape 5 (les mêmes noms, les mêmes valeurs que dans votre `.env`). Ajoutez-les pour les environnements "Production", "Preview" et "Development" (cochez les trois cases si proposé).
7. Cliquez sur **Deploy** et patientez 1 à 2 minutes.
8. Une fois le déploiement terminé, Vercel affiche l'URL de votre site (ex : `https://mariage-photos-xxxx.vercel.app`). C'est l'adresse finale à partager avec vos invités.

### Méthode alternative : sans GitHub, avec la ligne de commande

Depuis le dossier `mariage-photos` :

```bash
npm install -g vercel
vercel login
vercel
```

Suivez les instructions à l'écran (elles vous demanderont de confirmer le dossier du projet). Une fois le déploiement terminé une première fois, ajoutez les variables d'environnement avec :

```bash
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_SUPABASE_BUCKET production
vercel env add VITE_ACCESS_CODE production
vercel env add VITE_ADMIN_PATH production
vercel env add ADMIN_PASSWORD production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
```

(Répétez l'opération pour `preview` si vous testez aussi les URLs de prévisualisation.) Puis relancez un déploiement en production :

```bash
vercel --prod
```

### Récupérer l'URL finale

Elle est affichée à la fin du déploiement, et aussi visible depuis le tableau de bord Vercel (page du projet, en haut). Vous pouvez aussi configurer un nom de domaine personnalisé dans **Project Settings > Domains** si vous en possédez un — sinon l'adresse `.vercel.app` fournie gratuitement fonctionne très bien.

---

## Étape 8 — Générer l'affiche avec le QR code

1. Ouvrez `https://votre-url-vercel.vercel.app/affiche` dans un navigateur.
2. Le QR code affiché pointe **automatiquement** vers l'adresse de votre site (aucune configuration nécessaire).
3. Cliquez sur le bouton **Imprimer**, puis dans la fenêtre d'impression, choisissez le format papier **A5** (ou imprimez en A4 et découpez/pliez en deux).
4. Imprimez une affiche par table (environ 8 à 10 exemplaires pour 75 invités selon le nombre de tables).

---

## Utiliser la page d'administration

Rendez-vous sur `https://votre-url-vercel.vercel.app/<VITE_ADMIN_PATH>` (remplacez par votre valeur choisie à l'étape 5), entrez le mot de passe défini dans `ADMIN_PASSWORD`. Vous pourrez :

- Parcourir toutes les photos et les supprimer individuellement.
- Ouvrir une photo pour voir et supprimer ses commentaires.
- Télécharger une archive `.zip` contenant toutes les photos, via le bouton en haut de la page.

Cette URL n'est pas devinable si vous avez choisi une valeur aléatoire, mais gardez-la privée et ne la partagez qu'avec les personnes de confiance.

---

## Personnaliser l'application

Toute la configuration visible (titre de l'événement, message d'accueil, couleurs de la PWA) se trouve dans un seul fichier : **[`wedding.config.ts`](./wedding.config.ts)**, à la racine du projet. Modifiez-le, puis redéployez (un nouveau `git push` suffit si vous êtes connecté à GitHub — Vercel redéploie automatiquement à chaque push).

Après une modification de `wedding.config.ts`, les icônes et le fichier `manifest.webmanifest` de la PWA sont régénérés automatiquement au moment du `build` (et du `dev`), vous n'avez rien d'autre à faire.

---

## Limites à connaître (offres gratuites)

- **Stockage Supabase** : 1 Go gratuit. Avec des photos compressées à ~500 Ko, cela représente environ 2000 photos — largement suffisant pour 75 invités.
- **Mise en pause du projet Supabase** : sur l'offre gratuite, un projet Supabase se met en pause automatiquement après **7 jours sans activité**. Si vous configurez l'application longtemps avant le 22 août 2026, pensez à ouvrir le site de temps en temps pour le garder actif, ou configurez-le dans la semaine précédant l'événement. Un projet en pause se réactive facilement depuis le tableau de bord Supabase, mais ne serait pas utilisable par vos invités le jour J sans cette réactivation.
- **Fonctions serveur Vercel (export ZIP)** : sur l'offre Hobby gratuite, une fonction serveur a une durée maximale de 60 secondes. Si l'album contient énormément de photos, l'export ZIP pourrait échouer par dépassement de temps ; dans ce cas, réessayez (souvent transitoire) ou supprimez d'abord quelques photos avant de relancer l'export.
- **Aucun mot de passe individuel** : le code d'accès et le prénom ne sont pas des mécanismes de sécurité forts — ils évitent simplement qu'une personne extérieure tombe par hasard sur la galerie. Ne partagez le lien et le code qu'avec vos invités.

---

## Structure du projet

```
mariage-photos/
├── wedding.config.ts       # Configuration unique (titre, couleurs...)
├── .env.example             # Variables d'environnement à copier en .env
├── supabase/schema.sql      # Script SQL à exécuter dans Supabase
├── api/                     # Fonctions serveur Vercel (admin : suppression, export zip)
├── src/
│   ├── pages/                # Accueil (galerie), Admin, Affiche (QR code)
│   ├── components/           # Composants d'interface
│   └── lib/                  # Supabase, compression d'image, file d'envoi
└── scripts/                 # Génération des icônes PWA et du manifeste
```
