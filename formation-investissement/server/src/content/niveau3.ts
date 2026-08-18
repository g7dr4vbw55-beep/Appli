import type { LevelSeed } from './types.js';

export const niveau3: LevelSeed = {
  slug: 'cryptomonnaies',
  title: 'Cryptomonnaies',
  subtitle: 'Comprendre la technologie, les intermédiaires et les risques propres à cette classe d’actifs',
  intro:
    "Les crypto-actifs ne sont ni une version moderne des actions ni une monnaie au sens courant. Ce niveau décrit le fonctionnement technique, la différence décisive entre une plateforme et un portefeuille personnel, le rôle de la phrase de récupération, et l'historique de volatilité de cette classe d'actifs. Rien de ce qui suit n'invite à en acheter.",
  lessons: [
    {
      slug: 'blockchain',
      title: 'La blockchain : à quoi sert vraiment cette technologie',
      summary:
        "Un registre partagé et vérifiable sans autorité centrale : le problème qu'il résout, son coût, et ses limites.",
      body: `## Le problème résolu

Quand vous virez 100 € par votre banque, c'est la banque qui tient le registre : elle débite un compte, crédite l'autre, et vous lui faites confiance pour ne pas dépenser deux fois le même argent. La blockchain répond à une question précise : peut-on tenir un registre de transactions **sans confier ce registre à personne en particulier** ?

## Le mécanisme

Une blockchain est un registre :

- **répliqué** : des milliers d'ordinateurs (les nœuds) en détiennent chacun une copie complète ;
- **chaîné** : les transactions sont regroupées en blocs, et chaque bloc contient une empreinte cryptographique du bloc précédent. Modifier une transaction ancienne invaliderait toutes les empreintes suivantes, ce qui rend la falsification détectable ;
- **soumis à une règle de consensus** : un procédé décide quel bloc est ajouté. Le bitcoin utilise la **preuve de travail** (les mineurs dépensent de la puissance de calcul, donc de l'électricité). Ethereum utilise depuis 2022 la **preuve d'enjeu** (des validateurs immobilisent des jetons en garantie).

## Ce que cela apporte

- Il n'y a pas d'autorité centrale à qui demander l'autorisation.
- L'historique est public et vérifiable par n'importe qui.
- Une transaction confirmée est **irréversible**. Il n'y a pas de service client, pas de rétrofacturation, pas d'annulation.

## Ce que cela coûte

L'irréversibilité est aussi le principal danger pour un particulier. Une erreur d'adresse, un transfert vers un escroc, une clé perdue : les fonds sont définitivement inaccessibles. Aucun recours technique n'existe. C'est le contraire d'un virement bancaire erroné, qui peut souvent être rappelé.

Par ailleurs, les frais de transaction varient selon la congestion du réseau, et la validation prend un temps variable.

## Deux confusions à dissiper

**« Blockchain » ne signifie pas « fiable ».** La blockchain garantit qu'une transaction inscrite a bien été inscrite. Elle ne garantit rien sur la valeur du jeton, l'honnêteté du projet ou la compétence de ses développeurs. Un projet frauduleux peut parfaitement fonctionner sur une blockchain irréprochable.

**Le pseudonymat n'est pas l'anonymat.** Les adresses ne portent pas de nom, mais l'historique complet est public et permanent. L'analyse de chaîne permet régulièrement de relier des adresses à des personnes, ce dont les autorités judiciaires font usage.

## Cadre réglementaire

En Europe, le règlement **MiCA** encadre depuis 2024-2025 les prestataires de services sur crypto-actifs. En France, l'AMF tient un registre des prestataires enregistrés ou agréés. Vérifier qu'un intermédiaire y figure est une précaution élémentaire, mais un enregistrement ne garantit ni la performance ni la solidité d'un acteur, et encore moins la valeur d'un jeton.`,
      keyPoints: [
        'La blockchain est un registre répliqué, chaîné et régi par une règle de consensus, sans autorité centrale.',
        'Preuve de travail (bitcoin) ou preuve d’enjeu (Ethereum depuis 2022).',
        'Une transaction confirmée est irréversible : aucune annulation, aucun recours.',
        '« Sur la blockchain » ne dit rien de la fiabilité d’un projet.',
        'Pseudonymat, pas anonymat : l’historique est public et permanent.',
        'Vérifier l’enregistrement d’un prestataire auprès de l’AMF ne garantit pas sa solidité.',
      ],
      sources: [
        {
          label: 'AMF – Crypto-actifs : registre des prestataires',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde',
        },
        {
          label: 'Banque de France – Crypto-actifs et blockchain',
          url: 'https://abc-economie.banque-france.fr/mot-cle/crypto-actifs',
        },
      ],
    },
    {
      slug: 'bitcoin-altcoins',
      title: 'Bitcoin, Ethereum, altcoins : des objets très différents',
      summary:
        "Ce que chacun prétend être, pourquoi le mot « cryptomonnaie » regroupe des choses incomparables, et le sort statistique des petits jetons.",
      body: `## Bitcoin

Créé en 2009, le bitcoin a une règle d'émission inscrite dans son protocole : 21 millions d'unités au maximum, avec un rythme d'émission divisé par deux environ tous les quatre ans (le *halving*). Il n'a ni entreprise, ni dirigeant, ni bilan comptable, ni chiffre d'affaires.

Cela a une conséquence importante : **on ne peut pas valoriser un bitcoin comme une action**. Il n'y a pas de bénéfices futurs à actualiser. Son prix ne dépend que de ce que d'autres acceptent de payer. C'est un fait descriptif, pas une critique.

## Ethereum

Ethereum introduit les **contrats intelligents** : des programmes exécutés par le réseau. Cela permet de construire des applications, des jetons, des places d'échange automatisées. L'ether sert à payer les frais d'exécution de ces programmes.

Le fonctionnement technique est nettement plus complexe que celui du bitcoin, et cette complexité est en soi une source de risque : des failles dans des contrats intelligents ont provoqué des pertes considérables, dont certaines dépassant plusieurs centaines de millions de dollars.

## Les altcoins

Le mot désigne tout le reste, soit plusieurs dizaines de milliers de jetons. On y trouve des projets techniques sérieux, des copies sans intérêt, des jetons créés pour la plaisanterie, et des fraudes pures.

Deux catégories méritent d'être distinguées :

- Les **stablecoins**, qui cherchent à maintenir une parité avec une monnaie officielle, généralement le dollar. Leur solidité dépend entièrement des réserves et de la gouvernance de leur émetteur. En mai 2022, le stablecoin algorithmique TerraUSD a perdu sa parité et s'est effondré, entraînant la destruction de dizaines de milliards de dollars de valeur en quelques jours. « Stable » est un nom commercial, pas une garantie.
- Les **memecoins**, sans prétention technique, dont le prix repose uniquement sur l'attention. Ils peuvent monter très fortement et retomber aussi vite.

## Le fait statistique le plus important de cette leçon

La grande majorité des jetons créés depuis 2017 ont perdu la quasi-totalité de leur valeur ou ont été abandonnés. Les sites de suivi de marché recensent des dizaines de milliers de jetons « morts », dont le volume d'échange est devenu nul.

Autrement dit, le cas moyen d'un altcoin n'est pas une performance modeste : c'est la disparition. Les histoires que l'on entend sont celles des survivants, ce qui donne une image radicalement fausse de la distribution réelle. Ce biais s'appelle le biais du survivant.

## Ce que cette leçon ne fait pas

Elle ne classe pas ces actifs par qualité et n'en suggère aucun. Les projets nommés le sont comme illustrations documentées de mécanismes techniques ou d'événements historiques.`,
      keyPoints: [
        'Bitcoin : émission plafonnée à 21 millions, aucun bilan ni bénéfice, donc aucune valorisation fondamentale possible.',
        'Ethereum : contrats intelligents, plus grande complexité technique, donc plus de surface de risque.',
        'Stablecoin : la parité dépend de l’émetteur ; TerraUSD s’est effondré en mai 2022.',
        'La majorité des jetons créés depuis 2017 ont perdu presque toute leur valeur ou ont été abandonnés.',
        'Le biais du survivant fait qu’on n’entend parler que des rares réussites.',
      ],
      sources: [
        {
          label: 'AMF – Investir dans les crypto-actifs : les risques',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/crypto-actifs',
        },
        {
          label: 'ESMA – Avertissement aux investisseurs sur les crypto-actifs',
          url: 'https://www.esma.europa.eu/press-news/esma-news',
        },
      ],
    },
    {
      slug: 'plateformes-et-portefeuilles',
      title: 'Plateforme centralisée ou portefeuille personnel : qui détient vos clés',
      summary:
        "La différence entre un solde inscrit chez un intermédiaire et des clés que vous contrôlez, et ce que révèlent les faillites passées.",
      body: `## Deux situations radicalement différentes

**Sur une plateforme centralisée** (dite CEX, *centralized exchange*), vous ouvrez un compte, vous versez des euros, vous voyez un solde en bitcoins. Mais ce solde est une **écriture dans la base de données de l'entreprise**. Les clés cryptographiques correspondantes sont détenues par la plateforme. Vous détenez une créance sur une société, pas un actif au porteur.

**Dans un portefeuille personnel** (*self-custody*), vous détenez la clé privée. Personne ne peut geler, bloquer ou saisir vos fonds, et personne ne peut vous les rendre si vous perdez la clé.

D'où la formule usuelle du milieu : *not your keys, not your coins*.

## Ce que les faillites ont montré

Ce n'est pas une inquiétude théorique.

- **Mt. Gox**, 2014 : la plus grande plateforme de l'époque s'effondre, environ 850 000 bitcoins manquants. Les procédures d'indemnisation se sont étalées sur plus d'une décennie.
- **FTX**, novembre 2022 : deuxième plateforme mondiale, faillite en quelques jours. Les fonds des clients avaient été utilisés à d'autres fins. Des millions d'utilisateurs ont perdu l'accès à leurs avoirs, avec des indemnisations partielles et très tardives.
- **Celsius**, 2022 : service promettant des rendements sur dépôts de crypto-actifs, gel des retraits puis faillite.

Le point commun : les utilisateurs croyaient posséder des crypto-actifs. Ils possédaient une créance sur une entreprise défaillante. Et contrairement aux dépôts bancaires en euros, il n'existe **aucune garantie des dépôts** de type Fonds de garantie des dépôts et de résolution pour les crypto-actifs.

## Les types de portefeuilles personnels

- **Portefeuille logiciel** (*hot wallet*) : application sur téléphone ou ordinateur. Pratique, mais la clé se trouve sur un appareil connecté, donc exposé aux logiciels malveillants.
- **Portefeuille matériel** (*hardware wallet*) : boîtier dédié qui garde la clé hors ligne et signe les transactions. Nettement plus sûr contre le vol à distance, mais il faut acheter l'appareil **auprès du fabricant ou d'un revendeur officiel** : des appareils modifiés ont été vendus d'occasion avec une phrase de récupération déjà connue de l'escroc.
- **Portefeuille papier ou métal** : la phrase de récupération inscrite hors de tout appareil.

## Le risque que la garde personnelle ajoute

Passer en garde personnelle ne supprime pas le risque, il le **déplace vers vous** : perte de la phrase, incendie, décès sans transmission de l'information, erreur de manipulation, hameçonnage. Un débutant qui transfère des fonds vers un portefeuille personnel sans avoir compris la sauvegarde augmente son risque de perte totale. La leçon suivante traite précisément ce point.

Aucune plateforme ni aucun matériel n'est nommé ou recommandé dans cette leçon.`,
      keyPoints: [
        'Sur une plateforme, votre solde est une créance sur une entreprise ; vous ne détenez pas les clés.',
        'Mt. Gox (2014), FTX (2022), Celsius (2022) : les utilisateurs ont perdu l’accès à leurs avoirs.',
        'Il n’existe aucune garantie des dépôts pour les crypto-actifs.',
        'Portefeuille logiciel (connecté), matériel (hors ligne), papier ou métal.',
        'La garde personnelle ne supprime pas le risque : elle le transfère entièrement sur vous.',
      ],
      sources: [
        {
          label: 'AMF – Listes noires et mises en garde',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde',
        },
        {
          label: 'ACPR – Registre des agents financiers (Regafi)',
          url: 'https://www.regafi.fr/',
        },
      ],
    },
    {
      slug: 'phrase-de-recuperation',
      title: 'La phrase de récupération : le seul secret qui compte',
      summary:
        "Ce qu'est une seed phrase, ce qu'elle contrôle, comment elle se perd et comment on se la fait voler.",
      body: `## Ce qu'elle est

Lors de la création d'un portefeuille personnel, l'application affiche une suite de 12 ou 24 mots ordinaires, dans un ordre précis : la **phrase de récupération** (*seed phrase*, ou phrase mnémonique, standard BIP-39).

Ces mots ne sont pas un mot de passe. Ce sont les données à partir desquelles **toutes** vos clés privées sont dérivées mathématiquement. Quiconque connaît la phrase peut reconstituer le portefeuille sur n'importe quel appareil, en quelques minutes, et transférer les fonds. Il n'y a aucun deuxième facteur, aucune vérification d'identité, aucun délai.

Symétriquement, si vous perdez la phrase et l'accès à l'appareil, les fonds sont perdus définitivement. Aucun éditeur, aucun fabricant, aucune autorité ne peut la régénérer. Ce n'est pas une politique commerciale, c'est mathématiquement impossible.

## Les règles de sauvegarde

1. **Écrire les mots à la main, sur papier ou sur plaque métallique**, dans l'ordre exact, en vérifiant l'orthographe.
2. **Ne jamais la photographier, ni la saisir dans un ordinateur**, ni dans un gestionnaire de mots de passe en ligne, ni dans une note de téléphone, ni dans un courriel, ni dans un stockage en nuage. Un appareil connecté peut être compromis.
3. **Conserver au moins deux copies dans des lieux physiques distincts**, à l'abri de l'eau et du feu. La cause de perte la plus banale n'est pas le piratage : c'est le déménagement, le dégât des eaux ou le papier jeté par erreur.
4. **Ne la communiquer à personne. Jamais. Sans exception.**
5. **Prévoir la transmission** : un proche de confiance ou un dispositif successoral doit pouvoir accéder à l'information, sinon les fonds disparaissent avec vous.

## Comment le vol se produit réellement

Presque jamais par la force brute. Toujours par la manipulation :

- Un faux **support technique** vous écrit sur un réseau social ou un salon de discussion, propose de « débloquer » un problème et demande la phrase pour « vérifier ».
- Un site de **hameçonnage** imite l'interface d'un portefeuille connu et affiche un champ « restaurez votre portefeuille » — vous y saisissez vous-même la phrase.
- Une fausse mise à jour d'application demande une « resynchronisation ».
- Une **fausse cagnotte ou airdrop** exige de « connecter » votre portefeuille puis de signer une autorisation illimitée.

La règle qui coupe court à tous ces scénarios : **aucun service légitime, jamais, pour aucune raison, n'a besoin de votre phrase de récupération.** Un support technique qui la demande est un escroc, sans exception et sans nuance possible. Cette phrase est la seule chose à retenir de cette leçon si vous n'en retenez qu'une.

## Vérifier la sauvegarde avant d'y mettre quoi que ce soit

La bonne pratique est de tester la restauration avec un montant négligeable avant d'y transférer une somme qui compte : créer le portefeuille, noter la phrase, réinitialiser l'appareil, restaurer depuis la phrase, constater que le solde réapparaît. Cet exercice révèle immédiatement une phrase mal recopiée.`,
      keyPoints: [
        '12 ou 24 mots (BIP-39) dont toutes vos clés privées sont dérivées.',
        'Qui connaît la phrase contrôle les fonds : aucun deuxième facteur, aucun recours.',
        'Perdue = fonds définitivement inaccessibles, personne ne peut la régénérer.',
        'À écrire à la main, jamais photographiée ni saisie sur un appareil connecté, deux copies en lieux distincts.',
        'Aucun service légitime ne demande jamais la phrase de récupération.',
        'Tester la restauration avec un montant négligeable avant tout transfert significatif.',
      ],
      sources: [
        {
          label: 'ANSSI – Recommandations de sécurité numérique',
          url: 'https://cyber.gouv.fr/',
        },
        {
          label: 'Cybermalveillance.gouv.fr – Hameçonnage',
          url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes/hameconnage-phishing',
        },
      ],
    },
    {
      slug: 'volatilite-et-perte-totale',
      title: 'Volatilité historique et risque de perte totale',
      summary:
        "Les baisses effectivement observées sur le bitcoin, le comportement des altcoins pendant ces phases, et ce que « pas plus que ce que je peux perdre » veut dire en euros.",
      body: `## L'historique des grandes baisses du bitcoin

Ces chiffres sont approximatifs mais leur ordre de grandeur est documenté par les données de marché publiques :

- **2011** : environ −93 % depuis le sommet de juin.
- **2013-2015** : environ −85 % entre le sommet de fin 2013 et le point bas de janvier 2015, soit plus d'un an de baisse.
- **2017-2018** : d'environ 19 000 $ en décembre 2017 à environ 3 200 $ en décembre 2018, soit environ −83 %.
- **Mars 2020** : environ −50 % en deux jours.
- **2021-2022** : d'environ 69 000 $ en novembre 2021 à environ 15 500 $ en novembre 2022, soit environ −77 %.

Deux enseignements. D'abord, des baisses de 70 à 85 % font partie du comportement **normal** de cet actif, pas de son comportement exceptionnel. Ensuite, ces baisses ont duré des mois ou des années. Ce n'est pas une secousse d'une journée qu'on traverse en fermant les yeux.

Le bitcoin est ensuite revenu, plusieurs fois, au-delà de ses sommets antérieurs. Cela s'est produit dans le passé et ne prouve rien sur l'avenir. Les performances passées ne présagent pas des performances futures.

## Les altcoins pendant ces phases

Pendant les baisses générales, la plupart des altcoins ont chuté **davantage** que le bitcoin, souvent de 90 à 99 %, et beaucoup ne sont jamais revenus. Ce point est essentiel car il détruit l'idée d'une diversification interne à la crypto : quand le bitcoin baisse de 70 %, un panier de dix altcoins ne baisse pas de 70 %, il baisse généralement plus.

## Le risque de perte totale

Il ne s'agit pas seulement de volatilité mais de disparition possible, par plusieurs voies :

- **Le projet meurt** : équipe qui abandonne, jeton dont le volume tombe à zéro.
- **La fraude** : le projet était creux depuis le début.
- **L'intermédiaire fait défaut** : voir la leçon précédente.
- **L'erreur de l'utilisateur** : phrase perdue, mauvaise adresse, autorisation signée à un contrat malveillant.
- **Le choc réglementaire** : interdiction ou restriction d'usage sur un marché majeur.

## Ce que signifie « seulement ce que je peux perdre »

Cette phrase est répétée partout et généralement mal comprise. Elle ne veut pas dire « une somme qui me ferait un peu mal ». Elle veut dire : **écrivez un montant en euros, et demandez-vous si sa disparition complète, définitive, sans récupération, changerait quelque chose à votre situation financière ou à votre sommeil.** Si oui, le montant est trop élevé.

C'est un exercice à faire en euros, pas en pourcentage, et par écrit. Le journal de décisions de cette application vous demande explicitement ce montant avant chaque ordre, précisément pour que vous puissiez vous relire ensuite.

Cette leçon décrit des risques. Elle ne recommande ni d'acheter, ni de vendre, ni de s'abstenir : ce choix n'appartient qu'à vous, et l'application ne vous encourage à aucun moment à investir de l'argent réel.`,
      keyPoints: [
        'Baisses documentées du bitcoin : environ −85 % (2013-2015), −83 % (2017-2018), −77 % (2021-2022).',
        'Ces baisses ont duré des mois ou des années, elles ne sont pas des secousses passagères.',
        'Les altcoins ont généralement baissé davantage que le bitcoin et beaucoup ne sont pas revenus.',
        'La perte totale peut venir du projet, de la fraude, de l’intermédiaire, de l’utilisateur ou de la réglementation.',
        '« Ce que je peux perdre » se chiffre en euros et suppose une disparition complète et définitive.',
      ],
      sources: [
        {
          label: 'AMF – Crypto-actifs : un investissement très risqué',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/crypto-actifs',
        },
        {
          label: 'CoinGecko – Données de marché historiques',
          url: 'https://www.coingecko.com/fr/pieces/bitcoin',
        },
      ],
    },
  ],
  quiz: [
    {
      slug: 'n3-q1',
      prompt: 'Que garantit précisément le fait qu’un projet fonctionne « sur la blockchain » ?',
      takeaway:
        'La blockchain garantit l’intégrité et la traçabilité des transactions inscrites, rien sur la qualité ou l’honnêteté d’un projet.',
      choices: [
        {
          label: 'Que le projet est sérieux et audité, puisque la technologie est transparente.',
          explanation:
            'Faux, et c’est l’argument marketing le plus répandu. Un projet frauduleux fonctionne parfaitement sur une blockchain irréprochable.',
        },
        {
          label:
            'Que les transactions inscrites sont vérifiables et difficiles à falsifier, sans rien dire de la valeur du jeton.',
          correct: true,
          explanation:
            'Exact. Le chaînage cryptographique et la réplication protègent l’intégrité du registre. La qualité du projet est une question totalement distincte.',
        },
        {
          label: 'Que les transactions sont anonymes et introuvables.',
          explanation:
            'Faux : elles sont pseudonymes. L’historique est public et permanent, et l’analyse de chaîne permet régulièrement de relier des adresses à des personnes.',
        },
        {
          label: 'Qu’une transaction erronée peut être annulée par les validateurs du réseau.',
          explanation:
            'Faux, c’est l’inverse : une transaction confirmée est irréversible. Il n’y a ni service client, ni rétrofacturation.',
        },
      ],
    },
    {
      slug: 'n3-q2',
      prompt:
        'Vous détenez des bitcoins sur le compte d’une plateforme d’échange centralisée. Que possédez-vous juridiquement ?',
      takeaway:
        'Sur une plateforme, vous détenez une créance sur une entreprise, pas les clés cryptographiques.',
      choices: [
        {
          label: 'Les clés privées correspondant à ces bitcoins, la plateforme n’étant qu’un accès.',
          explanation:
            'Faux : c’est la plateforme qui détient les clés. Votre solde est une écriture dans sa base de données.',
        },
        {
          label: 'Une créance sur l’entreprise, dont l’exécution dépend de sa solvabilité.',
          correct: true,
          explanation:
            'Exact. C’est ce que les faillites de Mt. Gox, FTX et Celsius ont matérialisé : des utilisateurs croyaient détenir des crypto-actifs et détenaient une créance sur une société défaillante.',
        },
        {
          label: 'Des avoirs couverts par la garantie des dépôts jusqu’à 100 000 €.',
          explanation:
            'Faux. La garantie des dépôts bancaires ne s’applique pas aux crypto-actifs. Il n’existe aucun dispositif équivalent.',
        },
        {
          label:
            'Un actif au porteur, la plateforme étant seulement dépositaire réglementé sans risque.',
          explanation:
            'Faux. Même enregistrée auprès de l’AMF, une plateforme reste une entreprise pouvant faire défaut, et l’enregistrement ne garantit pas sa solidité.',
        },
      ],
    },
    {
      slug: 'n3-q3',
      prompt:
        'Le support technique d’une application de portefeuille vous contacte et demande votre phrase de récupération pour résoudre un problème d’affichage. Que faire ?',
      takeaway:
        'Aucun service légitime ne demande jamais la phrase de récupération, quelle que soit la raison invoquée.',
      choices: [
        {
          label:
            'La communiquer, mais uniquement si le message provient du compte officiel vérifié.',
          explanation:
            'Faux. Un compte peut être usurpé ou compromis, et surtout aucun service légitime n’a jamais besoin de cette phrase. La provenance apparente ne change rien.',
        },
        {
          label:
            'Ne jamais la communiquer : aucun service légitime n’en a besoin, cette demande identifie un escroc.',
          correct: true,
          explanation:
            'Exact, sans nuance possible. La phrase permet de reconstituer le portefeuille et de vider les fonds en quelques minutes, sans deuxième facteur ni recours.',
        },
        {
          label: 'Envoyer seulement les 6 premiers mots, ce qui reste insuffisant pour un vol.',
          explanation:
            'Faux et dangereux : une partie de la phrase réduit massivement l’espace de recherche restant. On ne communique aucun mot.',
        },
        {
          label: 'La saisir sur le site officiel indiqué dans le message pour vérification.',
          explanation:
            'Faux : c’est exactement le scénario du hameçonnage. Un faux site imite l’interface officielle et affiche un champ « restaurez votre portefeuille ».',
        },
      ],
    },
    {
      slug: 'n3-q4',
      prompt:
        'Quel est l’ordre de grandeur des plus fortes baisses du bitcoin depuis son sommet, telles qu’observées historiquement ?',
      takeaway:
        'Des baisses de 70 à 85 % étalées sur des mois ou des années font partie du comportement normal de cet actif.',
      choices: [
        {
          label: 'Environ 20 à 30 %, comparable à un marché d’actions.',
          explanation:
            'Faux : c’est l’ordre de grandeur des corrections d’un marché d’actions large, pas celui du bitcoin, dont les baisses observées ont été trois à quatre fois plus profondes.',
        },
        {
          label: 'Environ 70 à 85 %, sur des périodes allant de plusieurs mois à plus d’un an.',
          correct: true,
          explanation:
            'Exact : environ −85 % en 2013-2015, −83 % en 2017-2018, −77 % en 2021-2022. Ces épisodes ont duré, ils n’ont pas été des secousses d’une journée.',
        },
        {
          label: 'Environ 50 % au maximum, la baisse de mars 2020 étant la plus forte.',
          explanation:
            'Faux : mars 2020 fut la plus brutale (environ −50 % en deux jours) mais loin d’être la plus profonde.',
        },
        {
          label:
            'Il n’y a pas eu de baisse durable, l’actif ayant progressé de façon continue.',
          explanation:
            'Faux. Les phases de baisse prolongées sont documentées et l’une d’elles a duré plus d’un an.',
        },
      ],
    },
    {
      slug: 'n3-q5',
      prompt:
        'Un portefeuille contient dix altcoins différents, choisis dans dix secteurs applicatifs distincts. Que peut-on en dire ?',
      takeaway:
        'Les altcoins sont fortement corrélés entre eux et au bitcoin lors des grands mouvements, et amplifient généralement les baisses.',
      choices: [
        {
          label: 'Le portefeuille est bien diversifié : dix jetons, dix cas d’usage.',
          explanation:
            'Faux. La diversification se mesure par la corrélation des comportements, pas par la variété des descriptifs de projet.',
        },
        {
          label:
            'La diversification est faible : ces jetons évoluent largement ensemble et amplifient généralement les baisses du bitcoin.',
          correct: true,
          explanation:
            'Exact. Lors des grandes phases de baisse, la plupart des altcoins ont reculé davantage que le bitcoin, souvent de 90 à 99 %, et beaucoup ne sont jamais revenus.',
        },
        {
          label: 'Le risque de perte totale est éliminé puisqu’il est réparti sur dix lignes.',
          explanation:
            'Faux. Répartir sur dix jetons dont la majorité peut disparaître ne supprime pas le risque de perte totale, il le multiplie par dix occasions.',
        },
        {
          label: 'Détenir des stablecoins parmi ces dix lignes garantirait la stabilité de l’ensemble.',
          explanation:
            'Faux. « Stable » est un nom commercial : la parité dépend des réserves et de la gouvernance de l’émetteur, comme l’a montré l’effondrement de TerraUSD en mai 2022.',
        },
      ],
    },
  ],
};
