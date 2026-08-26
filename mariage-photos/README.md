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

1. Dans votre projet Supabase, allez dans **Project Settings** (icône d'engrenage en bas à gauche) puis **API Keys**.
2. Notez ces trois valeurs, vous en aurez besoin plus tard :

   | À copier dans Supabase | Ressemble à | Variable correspondante |
   |---|---|---|
   | **Project URL** (onglet "Data API" ou "General") | `https://xxxxxxxxxxxx.supabase.co` | `VITE_SUPABASE_URL` |
   | **Publishable key** | `sb_publishable_...` | `VITE_SUPABASE_ANON_KEY` |
   | **Secret key (default)** | `sb_secret_...` | `SUPABASE_SERVICE_ROLE_KEY` |

   La clé secrète donne un accès total à votre base : **ne la partagez jamais et ne la collez jamais dans une variable commençant par `VITE_`**, sinon elle deviendrait visible par tous les visiteurs du site.

   **Si vous voyez aussi des clés marquées "LEGACY"** (nommées "anonymous API key" et "service API key") : ce sont les anciennes clés, en cours de retrait chez Supabase. Ignorez-les et utilisez bien les deux du tableau ci-dessus.

   Les noms de nos variables (`..._ANON_KEY`, `..._SERVICE_ROLE_KEY`) reprennent l'ancienne terminologie de Supabase, mais ce sont bien les nouvelles clés qu'il faut y coller. L'application fonctionne avec les deux générations de clés.

## Étape 3 — Exécuter le script SQL

1. Toujours dans Supabase, allez dans **SQL Editor** (menu de gauche) puis cliquez sur **New query**.

   *Vous ne trouvez pas le menu ?* Sur téléphone, le menu latéral est replié. Ouvrez la recherche (icône loupe) et tapez `SQL` : le raccourci apparaît. L'icône **☰** déplie le menu complet.

2. Ouvrez le fichier [`supabase/schema.sql`](./supabase/schema.sql) de ce projet, copiez tout son contenu, et collez-le dans l'éditeur SQL de Supabase.
3. Cliquez sur **Run** (ou Ctrl/Cmd + Entrée). Vous devriez voir un message de succès.

Ce script fait tout d'un coup :

- il crée les tables `photos` et `commentaires` ;
- il crée le **bucket de stockage `photos`**, en public, avec une limite de 10 Mo par fichier — vous n'avez donc rien à créer à la main dans la section Storage ;
- il met en place les règles de sécurité (RLS) qui autorisent la lecture et l'ajout par tout le monde, mais **interdisent la suppression et la modification** depuis le navigateur. Seule la page d'administration, via une clé secrète qui ne quitte jamais le serveur, peut supprimer.

Le script peut être relancé sans risque : s'il est exécuté deux fois, il ne recrée pas ce qui existe déjà.

## Étape 4 — Vérifier le bucket de stockage

Cette étape est une simple vérification : le bucket a normalement été créé par le script.

1. Allez dans **Storage** (via la recherche en tapant `storage` si le menu est replié).
2. Vous devriez voir un bucket nommé **`photos`**, marqué **Public**.

Si vous ne le voyez pas, créez-le à la main avec **New bucket** : nom `photos` en minuscules, et l'interrupteur **Public bucket** activé.

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

## Étape 6 — Tester en local (optionnel — ordinateur uniquement)

**Depuis un téléphone, sautez cette étape et passez directement à l'étape 7.** Elle démarre un serveur sur votre propre machine, à l'adresse `http://localhost:5173` : cette adresse ne désigne que l'appareil sur lequel le serveur tourne. Sur un téléphone, elle n'ouvrira jamais rien — c'est normal, ce n'est pas une panne.

Si vous avez [Node.js](https://nodejs.org) installé (version 22.6 ou plus récente) :

```bash
npm install
npm run dev
```

Ouvrez l'adresse affichée (généralement `http://localhost:5173`) dans votre navigateur. Vous devriez voir l'écran de code d'accès. Testez l'ajout d'une photo pour vérifier que tout est bien connecté avant de déployer.

Pour tester la page d'administration en local, ouvrez `http://localhost:5173/<VITE_ADMIN_PATH>` (remplacez par la valeur choisie dans votre `.env`).

---

## Étape 7 — Déployer sur Vercel

### Méthode recommandée : via GitHub (faisable depuis un téléphone)

**Avant tout : vérifiez la branche par défaut de votre dépôt.** Vercel déploie la branche par défaut du dépôt. Si celle-ci contient un autre projet que l'application du mariage, le déploiement échouera ou publiera le mauvais site.

Sur GitHub, ouvrez votre dépôt > **Settings** > **Branches** > **Default branch**, et sélectionnez la branche qui contient le dossier `mariage-photos/` (par exemple `claude/wedding-photo-sharing-app-azgzy8`). Vous pouvez aussi laisser la branche par défaut telle quelle et, après l'import, changer **Settings > Git > Production Branch** côté Vercel : le résultat est le même.

1. Allez sur [vercel.com](https://vercel.com) et créez un compte (le plus simple : "Continue with GitHub").
2. Cliquez sur **Add New...** > **Project**.
3. Choisissez votre dépôt GitHub dans la liste (autorisez l'accès si demandé).
4. Dans l'écran de configuration du projet :
   - **Root Directory** : cliquez sur "Edit" et sélectionnez le dossier **`mariage-photos`** (important : ce dépôt contient aussi un autre projet à la racine, il faut bien pointer vers le sous-dossier).
   - Le **Framework Preset** devrait être détecté automatiquement comme "Vite".
5. Ouvrez la section **Environment Variables** et ajoutez **chacune** des variables listées dans le tableau de l'étape 5 (les mêmes noms, les mêmes valeurs). Ajoutez-les pour les environnements "Production", "Preview" et "Development" (cochez les trois cases si proposé).

   Si vous avez sauté l'étape 6, c'est ici que vous saisissez vos valeurs pour la première fois : vous n'avez pas besoin d'avoir créé de fichier `.env` sur un ordinateur.

6. Cliquez sur **Deploy** et patientez 1 à 2 minutes.
7. Une fois le déploiement terminé, Vercel affiche l'URL de votre site (ex : `https://mariage-photos-xxxx.vercel.app`). C'est l'adresse finale à partager avec vos invités.
8. Ouvrez cette URL et vérifiez que l'écran de code d'accès s'affiche, puis envoyez une photo de test. C'est votre vrai test de bout en bout, celui qui remplace l'étape 6.

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
2. Vérifiez l'**adresse affichée dans le champ** en haut de la page : c'est elle qui sera encodée dans le QR code. Elle est pré-remplie avec l'adresse courante, et vous pouvez la remplacer.

   **Utilisez l'adresse de production**, celle sans code au milieu (`appli-soso18.vercel.app`), et **jamais une adresse de déploiement** (`appli-m6mtp8i9w-soso18.vercel.app`). Vous trouverez la bonne dans Vercel, rubrique **Domains** de votre projet. Les adresses de déploiement changent à chaque mise à jour et sont protégées par une connexion Vercel : vos invités tomberaient sur un écran de login. La page vous avertit si elle en détecte une.
3. Cliquez sur le bouton **Imprimer**, puis dans la fenêtre d'impression, choisissez le format papier **A5** (ou imprimez en A4 et découpez/pliez en deux).
4. Imprimez une affiche par table (environ 8 à 10 exemplaires pour 75 invités selon le nombre de tables).

### Test indispensable avant d'imprimer

Scannez le QR code avec **un téléphone qui n'est pas connecté à votre compte Vercel** (celui d'un proche, ou le vôtre en navigation privée). Vous devez voir l'écran « Entrez le code affiché sur votre table ».

Si vous voyez au contraire une page Vercel demandant de se connecter, la protection des déploiements est active sur votre site. Corrigez-la ainsi :

1. Vercel > votre projet > **Settings** > **Deployment Protection**.
2. Passez **Vercel Authentication** sur **Disabled** (ou sur *Standard Protection*, qui laisse la production accessible et ne protège que les déploiements de test).
3. Enregistrez, puis refaites le test avec un téléphone non connecté.

C'est le point le plus important à valider avant le jour J : tant que cette protection s'applique à la production, aucun invité ne peut ouvrir le site, quelle que soit la qualité du reste.

---

## Utiliser la page d'administration

Rendez-vous sur `https://votre-url-vercel.vercel.app/<VITE_ADMIN_PATH>` (remplacez par votre valeur choisie à l'étape 5), entrez le mot de passe défini dans `ADMIN_PASSWORD`. Vous pourrez :

- Parcourir toutes les photos et les supprimer individuellement.
- Ouvrir une photo pour voir et supprimer ses commentaires.
- Télécharger une archive `.zip` contenant toutes les photos, via le bouton en haut de la page.

Cette URL n'est pas devinable si vous avez choisi une valeur aléatoire, mais gardez-la privée et ne la partagez qu'avec les personnes de confiance.

### Mot de passe administrateur oublié

Il n'y a rien à récupérer : le mot de passe n'est stocké nulle part, il est simplement comparé à la variable `ADMIN_PASSWORD`. Il suffit d'en définir un nouveau.

1. Vercel > votre projet > **Settings** > **Environment Variables**.
2. En face de `ADMIN_PASSWORD`, cliquez sur **Edit**, saisissez le nouveau mot de passe, enregistrez.
3. Onglet **Deployments** > ouvrez le déploiement le plus récent > menu **⋯** > **Redeploy**. Cette étape est indispensable : sans nouveau déploiement, Vercel continue d'utiliser l'ancienne valeur.

Les photos, les commentaires et le code d'accès des invités ne sont pas affectés.

### Que faire si la connexion à l'administration échoue

L'écran de connexion indique la cause précise :

| Message | Ce qu'il faut faire |
|---|---|
| « Mot de passe incorrect. » | Le mot de passe ne correspond pas. Suivez la procédure ci-dessus pour en définir un nouveau. |
| « Aucun mot de passe n'est défini sur le serveur… » | La variable `ADMIN_PASSWORD` manque dans Vercel. Ajoutez-la, puis relancez un déploiement. |
| « La partie serveur de l'administration n'est pas déployée… » | Le **Root Directory** du projet Vercel ne pointe pas sur `mariage-photos`. Corrigez-le dans Settings > General, puis relancez un déploiement. |
| « permission denied for table photos » (ou `commentaires`) | Le rôle `service_role` n'a pas les droits sur vos tables. Exécutez [`supabase/correctif-droits-admin.sql`](./supabase/correctif-droits-admin.sql) dans le SQL Editor de Supabase. Effet immédiat, aucun redéploiement nécessaire. |
| « Invalid API key » | La variable `SUPABASE_SERVICE_ROLE_KEY` dans Vercel ne correspond plus à votre clé Supabase (typiquement après une rotation de clé). Recopiez la clé secrète actuelle, puis relancez un déploiement. |

### Si une clé ou un mot de passe a été exposé par erreur

Si une valeur secrète s'est retrouvée dans un fichier publié (par exemple `.env.example`, qui est suivi par git), la supprimer ne suffit pas : l'historique du dépôt la conserve. Il faut la remplacer.

- **Clé secrète Supabase** : dans Supabase > **API Keys**, utilisez **Rotate** sur la secret key. L'ancienne cesse immédiatement de fonctionner. Reportez la nouvelle valeur dans Vercel, puis relancez un déploiement.
- **Mot de passe administrateur** : suivez la procédure « Mot de passe administrateur oublié » ci-dessus.
- La clé *publishable* n'a pas besoin d'être changée : elle est conçue pour être visible dans le navigateur.

---

## Personnaliser l'application

Toute la configuration visible (titre de l'événement, message d'accueil, couleurs de la PWA) se trouve dans un seul fichier : **[`wedding.config.ts`](./wedding.config.ts)**, à la racine du projet. Modifiez-le, puis redéployez (un nouveau `git push` suffit si vous êtes connecté à GitHub — Vercel redéploie automatiquement à chaque push).

Après une modification de `wedding.config.ts`, les icônes et le fichier `manifest.webmanifest` de la PWA sont régénérés automatiquement au moment du `build` (et du `dev`), vous n'avez rien d'autre à faire.

### Les vidéos récapitulatives

L'onglet **Vidéos** affiche deux vidéos de la journée, chacune avec son propre fil de commentaires. Tout se règle dans **[`videos.config.ts`](./videos.config.ts)** à la racine : titre, description, plateforme et identifiant de la vidéo.

**Avant la première utilisation**, exécutez une fois [`supabase/videos-commentaires.sql`](./supabase/videos-commentaires.sql) dans le SQL Editor de Supabase. Ce script crée uniquement une nouvelle table : il ne touche ni aux photos, ni aux commentaires existants, ni au stockage.

**Où héberger les vidéos ?** Sur YouTube, en mode **Non répertorié** : la vidéo n'apparaît ni dans les recherches ni sur votre chaîne, seules les personnes ayant le lien peuvent la voir. C'est gratuit, sans limite de trafic, et la qualité s'adapte au réseau de chaque invité.

**N'hébergez pas les vidéos sur Supabase.** L'offre gratuite est limitée à 1 Go de stockage et 5 Go de trafic par mois. Une vidéo de 500 Mo regardée par 75 invités représente environ 37 Go : le site cesserait de fonctionner après une dizaine de visionnages.

Pour récupérer l'identifiant à coller dans `source` :

| Adresse de la vidéo | Identifiant |
|---|---|
| `https://www.youtube.com/watch?v=dQw4w9WgXcQ` | `dQw4w9WgXcQ` |
| `https://youtu.be/dQw4w9WgXcQ` | `dQw4w9WgXcQ` |
| `https://vimeo.com/123456789` | `123456789` |

Tant que `source` est vide, la page affiche « Cette vidéo sera bientôt disponible » au lieu d'un lecteur cassé : vous pouvez donc publier la page avant d'avoir fini le montage.

Si vous hébergez le fichier ailleurs (site personnel, service de stockage), mettez `plateforme: 'fichier'` et l'adresse complète du `.mp4` dans `source`.

Les commentaires des vidéos se modèrent dans la page d'administration, en bas, sous la grille des photos.

### Les défis photo

L'onglet **Défis** propose aux invités une liste de photos à réaliser pendant la soirée. La liste se modifie dans **[`defis.config.ts`](./defis.config.ts)**, à la racine du projet : un identifiant, un intitulé et un ordre d'affichage par défi.

```ts
{ id: 'arche', intitule: 'Une photo devant l\'arche fleurie', ordre: 2 },
```

Ajoutez, retirez ou renommez librement les intitulés. **Un seul point de vigilance : ne changez plus un `id` une fois la soirée commencée.** C'est lui qui est enregistré avec chaque photo ; le modifier détacherait les photos déjà envoyées de leur défi.

Comment cela fonctionne pour l'invité :

- toucher un défi ouvre directement l'appareil photo ; l'icône à droite permet de choisir une photo déjà prise ;
- la photo envoyée est automatiquement rattachée au défi, et celui-ci se coche avec un compteur du type « 4 défis sur 12 » ;
- plusieurs invités peuvent réaliser le même défi, et un invité peut le refaire autant de fois qu'il veut ;
- dans l'album, une liste déroulante permet de n'afficher que les photos d'un défi donné ;
- les photos envoyées hors défi restent possibles et fonctionnent comme avant.

Les défis accomplis sont mémorisés **sur l'appareil de l'invité** (comme le prénom), et non par compte : sans inscription, deux invités peuvent porter le même prénom, l'appareil est donc le seul repère fiable.

**Si vous avez créé votre base Supabase avant l'ajout de cette fonctionnalité**, exécutez une fois [`supabase/correctif-defis-photo.sql`](./supabase/correctif-defis-photo.sql) dans le SQL Editor de Supabase. Sans cela, l'envoi depuis un défi échoue avec un message qui vous le rappellera. Les photos déjà envoyées ne sont pas modifiées.

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
