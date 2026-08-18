import type { LevelSeed } from './types.js';

export const niveau1: LevelSeed = {
  slug: 'fondations',
  title: 'Les fondations',
  subtitle: 'Comprendre le temps, les prix et le coût avant de placer le moindre euro',
  intro:
    "Avant de parler d'actions ou de cryptomonnaies, il faut maîtriser quatre mécanismes qui décident de presque tout : la façon dont un capital grossit avec le temps, la façon dont l'inflation ronge un capital dormant, la réserve de sécurité qui évite d'être forcé de vendre au mauvais moment, et le poids réel des frais. Ce niveau est informatif : il n'indique pas quoi acheter.",
  lessons: [
    {
      slug: 'interets-composes',
      title: 'Les intérêts composés : le seul effet qui travaille pour vous',
      summary:
        "Comment un rendement réinvesti produit lui-même du rendement, et pourquoi la durée compte davantage que le montant de départ.",
      body: `## Le mécanisme

Un intérêt **simple** ne s'applique qu'au capital de départ. Un intérêt **composé** s'applique au capital de départ *plus* les gains déjà accumulés. Cette nuance, minuscule la première année, devient décisive sur vingt ans.

Prenons 1 000 € qui progressent de 5 % par an. La première année, le gain est de 50 €. La deuxième année, les 5 % s'appliquent à 1 050 €, soit 52,50 €. La troisième, à 1 102,50 €. Rien de spectaculaire. Mais au bout de 30 ans, le capital atteint environ 4 322 € : le gain total est de 3 322 €, dont seulement 1 500 € proviennent du capital initial multiplié par le taux. Les 1 822 € restants sont des **gains sur les gains**.

La formule est : capital final = capital initial × (1 + taux)^nombre d'années.

## L'ordre de grandeur à retenir

Une approximation utile est la **règle de 72** : divisez 72 par le rendement annuel en pourcentage, vous obtenez le nombre d'années nécessaires pour doubler le capital. À 3 % par an, il faut environ 24 ans. À 6 %, environ 12 ans. À 9 %, environ 8 ans. Cette règle n'est qu'une approximation, mais elle donne le bon réflexe : doubler le rendement ne divise pas le délai par deux de façon linéaire, et surtout, chaque point de rendement supplémentaire a un effet énorme sur longue période.

## La durée pèse plus que le montant

Deux épargnants placent chacun 200 € par mois à 5 % par an. Le premier commence à 25 ans et arrête à 35 ans : il a versé 24 000 €. Le second commence à 35 ans et verse jusqu'à 65 ans : il a versé 72 000 €. À 65 ans, le premier a environ 76 000 € malgré ses dix ans de versements seulement ; le second environ 167 000 €. Le second a trois fois plus versé pour un peu plus du double. Autrement dit, les euros versés tôt travaillent beaucoup plus longtemps que ceux versés tard.

## L'effet fonctionne aussi à l'envers

Le même mécanisme s'applique aux pertes et aux frais. Une baisse de 50 % exige une hausse de 100 % pour revenir au point de départ. Et 1 % de frais prélevé chaque année ne coûte pas 1 % au total : il coûte 1 % **du capital accumulé, tous les ans**, ce qui sur trente ans peut représenter le quart du résultat final.

## Ce que cela ne garantit pas

Un rendement annuel de 5 % n'est jamais linéaire dans la réalité. Les marchés progressent par à-coups, avec des années fortement négatives. Les calculs ci-dessus sont des illustrations arithmétiques, pas des prévisions : les performances passées ne présagent pas des performances futures.`,
      keyPoints: [
        "Les intérêts composés font travailler les gains déjà acquis, pas seulement le capital de départ.",
        'Règle de 72 : 72 divisé par le rendement annuel donne le nombre approximatif d’années pour doubler.',
        'La durée de placement pèse généralement plus lourd que le montant investi.',
        'Le mécanisme joue aussi contre vous : sur les pertes et sur les frais annuels.',
      ],
      sources: [
        {
          label: 'AMF – Épargne et placements : les bases',
          url: 'https://www.amf-france.org/fr/espace-epargnants',
        },
        {
          label: 'Banque de France – ABC de l’économie',
          url: 'https://abc-economie.banque-france.fr/',
        },
      ],
    },
    {
      slug: 'inflation',
      title: "L'inflation : pourquoi ne rien faire est aussi une décision",
      summary:
        "L'écart entre rendement nominal et rendement réel, et ce que l'inflation fait à un capital laissé sur un compte courant.",
      body: `## Définition

L'inflation est la hausse générale et durable des prix. En France, elle est mesurée par l'INSEE via l'indice des prix à la consommation. Quand l'inflation est de 2 % sur un an, le même panier de biens coûte 2 % plus cher qu'un an plus tôt : votre argent achète moins.

## Rendement nominal et rendement réel

C'est la distinction la plus utile de tout ce niveau.

- Le **rendement nominal** est le chiffre affiché : « ce placement a rapporté 3 % ».
- Le **rendement réel** est ce qui reste après inflation, approximativement le rendement nominal moins l'inflation.

Un livret rémunéré à 3 % pendant une année où l'inflation atteint 5 % vous fait perdre environ 2 % de pouvoir d'achat, même si votre solde a augmenté. Le solde du compte est un mauvais indicateur : ce qui compte est ce que ce solde permet d'acheter.

## L'effet sur un capital dormant

10 000 € laissés sur un compte courant non rémunéré, avec une inflation moyenne de 2 % par an, valent en pouvoir d'achat environ 8 200 € au bout de 10 ans, et environ 5 500 € au bout de 30 ans. Aucune ligne de relevé bancaire ne montrera cette perte : le solde affichera toujours 10 000 €. C'est une perte invisible, et c'est pour cela qu'elle est facile à ignorer.

Conséquence importante : **ne pas placer son argent n'est pas une position neutre**. C'est un choix qui a un coût, exactement comme placer son argent a un risque. Il n'existe pas d'option sans inconvénient.

## Les repères français

En France, l'inflation a évolué dans des registres très différents selon les périodes : proche de 13 % au début des années 1980, autour de 1 à 2 % pendant les années 2010, puis remontée nettement au-dessus de 5 % en 2022 et 2023 avant de refluer. La Banque centrale européenne vise une inflation de 2 % à moyen terme dans la zone euro. Retenez qu'aucun niveau d'inflation n'est acquis pour l'avenir.

## Comment le sujet est traité honnêtement

Certains discours commerciaux utilisent l'inflation comme argument de pression : « votre argent fond, il faut agir maintenant ». C'est un raisonnement partiellement vrai transformé en urgence artificielle. L'inflation agit sur des années, pas sur des heures. Le bon réflexe est de comprendre le rendement réel de chaque placement que vous détenez, puis de décider calmement. Cette leçon est informative et ne recommande aucun produit.`,
      keyPoints: [
        'Rendement réel ≈ rendement nominal − inflation : c’est le seul chiffre qui mesure votre pouvoir d’achat.',
        'Un capital non placé perd du pouvoir d’achat sans que le solde bancaire ne bouge.',
        'Ne rien faire est une décision qui a un coût, comme investir a un risque.',
        'L’urgence invoquée au nom de l’inflation est un signal de vente, pas un argument.',
      ],
      sources: [
        {
          label: 'INSEE – Indice des prix à la consommation',
          url: 'https://www.insee.fr/fr/statistiques/serie/001763852',
        },
        {
          label: 'Banque centrale européenne – Objectif d’inflation',
          url: 'https://www.ecb.europa.eu/mopo/strategy/pricestab/html/index.fr.html',
        },
      ],
    },
    {
      slug: 'epargne-de-precaution',
      title: 'L’épargne de précaution : la condition qui rend tout le reste possible',
      summary:
        "Pourquoi une réserve disponible n'est pas un placement médiocre mais l'outil qui vous évite de vendre au pire moment.",
      body: `## À quoi elle sert exactement

L'épargne de précaution est une somme immédiatement disponible, sans risque de perte en capital, destinée aux imprévus : réparation, remplacement d'un équipement, perte de revenus, dépense de santé. Sa fonction n'est pas de rapporter. Sa fonction est de **vous dispenser de toucher à vos placements au mauvais moment**.

Ce point est mal compris par les débutants. Le principal danger n'est pas la baisse d'un marché : c'est d'être obligé de vendre pendant cette baisse. Un portefeuille qui recule de 30 % et qu'on laisse tranquille peut se rétablir sur plusieurs années. Le même portefeuille vendu à −30 % parce que la chaudière est en panne matérialise définitivement la perte.

## Quel montant

Les repères couramment cités par les organismes d'éducation financière vont de trois à six mois de dépenses courantes, davantage si vos revenus sont irréguliers (indépendant, saisonnier, CDD) ou si vous avez des charges fixes élevées. Le raisonnement se fait sur les **dépenses**, pas sur les revenus : c'est ce qu'il faut sortir chaque mois qui détermine la réserve.

Un calcul simple : additionnez loyer ou crédit, énergie, alimentation, transport, assurances, abonnements, puis multipliez par trois à six.

## Où la placer

Les supports adaptés partagent trois caractéristiques : disponibilité rapide, absence de risque de perte du capital, et absence de frais d'entrée ou de sortie. En France, les livrets réglementés (Livret A, LDDS) remplissent ce rôle : capital garanti, retrait à tout moment, plafonds fixés par la réglementation, taux administré révisé périodiquement. Leur rendement est souvent inférieur à l'inflation, et c'est acceptable : on ne les détient pas pour le rendement mais pour la disponibilité.

Ce qui n'est **pas** une épargne de précaution : un portefeuille d'actions, un ETF, une cryptomonnaie, une assurance-vie en unités de compte, tout support dont la valeur peut baisser précisément le jour où vous avez besoin de l'argent.

## L'ordre logique

L'enchaînement admis par la plupart des sources d'éducation financière est : d'abord traiter les dettes coûteuses (un crédit à la consommation à 15 % coûte plus cher que ce que rapporte un placement moyen), ensuite constituer la réserve de précaution, ensuite seulement envisager des placements de long terme. Les niveaux suivants de ce parcours décrivent la troisième étape, mais ils ne vous invitent pas à la franchir : l'application n'encourage à aucun moment le passage à un investissement réel.`,
      keyPoints: [
        'La réserve de précaution existe pour éviter la vente forcée, pas pour rapporter.',
        'Repère usuel : trois à six mois de dépenses courantes, plus si les revenus sont irréguliers.',
        'Un support est adapté s’il est disponible, sans risque de capital et sans frais de sortie.',
        'Dettes coûteuses, puis réserve, puis éventuellement placements de long terme.',
      ],
      sources: [
        {
          label: 'AMF – Constituer une épargne de précaution',
          url: 'https://www.amf-france.org/fr/espace-epargnants/preparer-mes-projets/epargner',
        },
        {
          label: 'Service-public.fr – Livret A',
          url: 'https://www.service-public.fr/particuliers/vosdroits/F2365',
        },
      ],
    },
    {
      slug: 'impact-des-frais',
      title: 'L’impact réel des frais : le seul paramètre que vous contrôlez',
      summary:
        "Frais d'entrée, frais de gestion annuels, frais de courtage, écart de cours : où ils se cachent et combien ils coûtent sur trente ans.",
      body: `## Les quatre familles de frais

1. **Frais d'entrée ou de souscription** : prélevés une fois, à l'achat. Un frais d'entrée de 3 % signifie que sur 1 000 € versés, 970 € seulement sont investis.
2. **Frais de gestion annuels** : prélevés chaque année sur l'encours, souvent invisibles car déduits directement de la valeur du support. Pour un fonds, on parle de frais courants ou de TFE (total des frais sur encours).
3. **Frais de courtage** : facturés par l'intermédiaire à chaque ordre, en pourcentage, en montant fixe, ou les deux.
4. **Écart entre cours acheteur et vendeur** (le *spread*) : différence entre le prix auquel on peut acheter et celui auquel on peut vendre au même instant. Ce n'est pas une ligne de facture, mais c'est un coût réel, particulièrement élevé sur les actifs peu liquides et sur beaucoup de cryptomonnaies.

## Le chiffre qui compte : les frais annuels

C'est la catégorie la plus sous-estimée, parce qu'un chiffre comme 1,8 % paraît petit.

Prenons 10 000 € placés pendant 30 ans avec un rendement brut de 6 % par an.

- Avec 0,25 % de frais annuels, le capital final est d'environ 53 400 €.
- Avec 1,00 % de frais annuels, il est d'environ 43 200 €.
- Avec 2,00 % de frais annuels, il est d'environ 32 400 €.

L'écart entre 0,25 % et 2 % est de plus de 21 000 €, soit près de 40 % du résultat. Vous n'avez rien fait de différent : même durée, même rendement brut, même montant. Seuls les frais ont changé.

La raison est que les frais s'attaquent à la base sur laquelle les intérêts composés travaillent. Chaque euro prélevé cette année est aussi un euro qui ne produira jamais de rendement les vingt-neuf années suivantes.

## Pourquoi c'est le paramètre décisif

Vous ne contrôlez ni le rendement des marchés, ni l'inflation, ni la fiscalité. Vous contrôlez presque entièrement les frais que vous acceptez de payer. C'est la raison pour laquelle toute source sérieuse d'éducation financière insiste sur ce point avant tout autre.

## Comment les vérifier

Pour un fonds ou un ETF, le **document d'informations clés** (DIC, ou KID) est obligatoire dans l'Union européenne et affiche les coûts. Pour un courtier, la grille tarifaire est publique. Pour un support crypto, additionnez les frais de la plateforme, l'écart de cours et les frais de retrait, qui sont souvent plus élevés que le pourcentage affiché.

Un réflexe simple : avant tout investissement, demandez le coût total sur un an, en euros, pour le montant que vous envisagez. Si personne ne peut vous le chiffrer, c'est déjà une information.`,
      keyPoints: [
        'Quatre familles : entrée, gestion annuelle, courtage, écart de cours.',
        'Sur 30 ans, passer de 0,25 % à 2 % de frais annuels peut amputer le résultat de près de 40 %.',
        'Les frais rongent la base sur laquelle les intérêts composés travaillent.',
        'C’est le seul paramètre que l’investisseur contrôle presque totalement.',
        'Le document d’informations clés (DIC/KID) est obligatoire en Europe et affiche les coûts.',
      ],
      sources: [
        {
          label: 'AMF – Les frais des placements financiers',
          url: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/frais',
        },
        {
          label: 'ESMA – Document d’informations clés (KID/PRIIPs)',
          url: 'https://www.esma.europa.eu/',
        },
      ],
    },
    {
      slug: 'horizon-de-placement',
      title: 'L’horizon de placement : la question à se poser en premier',
      summary:
        "Comment la date d'utilisation de l'argent détermine le niveau de risque supportable, et pourquoi un horizon court exclut les actifs volatils.",
      body: `## Définir l'horizon

L'horizon de placement est la durée pendant laquelle vous pouvez laisser cet argent tranquille sans en avoir besoin. Ce n'est pas une intention vague, c'est une date. « Dans trois ans, apport pour un logement » est un horizon. « Un jour, quand j'en aurai besoin » n'en est pas un.

C'est la première question à trancher, avant même de regarder un produit, parce qu'elle détermine tout le reste.

## Pourquoi la volatilité devient supportable avec le temps

La volatilité mesure l'ampleur des variations. Sur un marché d'actions large, une baisse annuelle de 30 à 50 % s'est déjà produite plusieurs fois au cours du siècle dernier : 2000-2002, 2008, mars 2020. Historiquement, ces marchés se sont ensuite rétablis, mais la durée du rétablissement s'est comptée en années, parfois en plus d'une décennie selon le point d'entrée et l'indice observé.

Cela produit une règle de prudence largement partagée : plus l'argent doit être utilisé tôt, moins il peut être exposé à des actifs volatils. Non pas parce que la baisse serait plus probable à court terme, mais parce qu'à court terme vous n'avez pas le temps d'attendre un rétablissement, et qu'aucun rétablissement n'est garanti.

## Une grille de lecture usuelle

- **Moins de 2 ans** : l'argent doit rester disponible et sans risque de capital. Actions, ETF actions et cryptomonnaies sont inadaptés, quelle que soit la conviction.
- **2 à 5 ans** : horizon intermédiaire, la tolérance à la volatilité reste faible.
- **Plus de 8 à 10 ans** : horizon où une exposition à des actifs volatils devient envisageable pour qui accepte explicitement de voir la valeur reculer fortement en cours de route.

Ces bornes sont des repères de prudence couramment cités, pas des seuils réglementaires, et elles ne constituent pas une recommandation d'allocation.

## Le cas des cryptomonnaies

Elles n'entrent dans aucune de ces cases par simple prolongement. Leur historique est court, leur volatilité a été nettement supérieure à celle des actions, et le risque de perte totale sur un actif donné est réel : de nombreux jetons ont perdu la quasi-totalité de leur valeur sans jamais se rétablir. Le niveau 3 traite ce sujet en détail.

## Le piège classique

Le piège est l'horizon qui se raccourcit tout seul. On investit « pour dix ans », puis un projet apparaît à deux ans, et il faut vendre. C'est exactement la situation que l'épargne de précaution est censée éviter. Écrire son horizon *avant* d'agir, comme le fait le journal de décisions de cette application, sert précisément à pouvoir se relire plus tard et constater l'écart.`,
      keyPoints: [
        'L’horizon est une date, pas une intention : c’est la première question à trancher.',
        'Plus l’échéance est proche, moins l’argent peut être exposé à des actifs volatils.',
        'Des baisses de 30 à 50 % se sont déjà produites sur les grands marchés d’actions.',
        'Les cryptomonnaies ont un historique court et un risque de perte totale par actif.',
        'Écrire son horizon avant d’agir permet de mesurer l’écart plus tard.',
      ],
      sources: [
        {
          label: 'AMF – Définir son horizon de placement et son profil',
          url: 'https://www.amf-france.org/fr/espace-epargnants/preparer-mes-projets',
        },
        {
          label: 'AMF – Risques des crypto-actifs',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/crypto-actifs',
        },
      ],
    },
  ],
  quiz: [
    {
      slug: 'n1-q1',
      prompt:
        'Vous placez 1 000 € à 6 % par an, gains réinvestis. Quelle affirmation décrit correctement l’effet des intérêts composés ?',
      takeaway:
        'Les intérêts composés produisent du rendement sur les gains déjà accumulés : le gain annuel en euros augmente avec le temps.',
      choices: [
        {
          label: 'Le gain en euros est identique chaque année, soit 60 € par an.',
          explanation:
            'Faux : ce serait le cas avec des intérêts simples, où le taux ne s’applique qu’au capital de départ. Ici la base de calcul grossit chaque année.',
        },
        {
          label:
            'Le gain en euros augmente chaque année car le taux s’applique au capital augmenté des gains précédents.',
          correct: true,
          explanation:
            'Exact. Année 1 : 60 €. Année 2 : 6 % de 1 060 €, soit 63,60 €. La base de calcul grossit, donc le gain annuel en euros aussi.',
        },
        {
          label: 'Le capital double tous les six ans puisque le taux est de 6 %.',
          explanation:
            'Faux. La règle de 72 donne 72 ÷ 6 = 12 ans environ pour doubler, pas 6 ans. Confondre le taux et le délai de doublement est une erreur fréquente.',
        },
        {
          label: 'Les intérêts composés garantissent que le capital ne peut pas baisser.',
          explanation:
            'Faux. Les intérêts composés sont un mécanisme arithmétique, pas une garantie. Le même mécanisme amplifie aussi les pertes et les frais.',
        },
      ],
    },
    {
      slug: 'n1-q2',
      prompt:
        'Un placement affiche 3 % de rendement sur l’année. L’inflation a été de 4,5 % sur la même période. Que peut-on dire ?',
      takeaway:
        'Seul le rendement réel, approximativement le rendement nominal moins l’inflation, mesure l’évolution du pouvoir d’achat.',
      choices: [
        {
          label:
            'Le solde a augmenté de 3 % mais le pouvoir d’achat a reculé d’environ 1,5 %.',
          correct: true,
          explanation:
            'Exact. Le rendement nominal est positif, le rendement réel est négatif d’environ 1,5 point. Le solde progresse, ce qu’il permet d’acheter recule.',
        },
        {
          label: 'Le placement a perdu 4,5 % de sa valeur.',
          explanation:
            'Faux : le placement a bien gagné 3 % en valeur nominale. C’est le pouvoir d’achat, et non la valeur du placement, qui s’est dégradé.',
        },
        {
          label: 'L’inflation n’a pas d’effet puisque le rendement est positif.',
          explanation:
            'Faux. Un rendement nominal positif peut parfaitement correspondre à une perte de pouvoir d’achat. C’est précisément l’intérêt de la notion de rendement réel.',
        },
        {
          label: 'Le rendement réel est de 7,5 %.',
          explanation:
            'Faux : l’inflation se retranche du rendement nominal, elle ne s’y ajoute pas. Le rendement réel est ici négatif.',
        },
      ],
    },
    {
      slug: 'n1-q3',
      prompt: 'Quelle est la fonction principale d’une épargne de précaution ?',
      takeaway:
        'La réserve de précaution sert à ne jamais être contraint de vendre un placement au mauvais moment.',
      choices: [
        {
          label: 'Obtenir le meilleur rendement possible sur les sommes disponibles.',
          explanation:
            'Faux. On accepte volontairement un rendement faible, souvent inférieur à l’inflation, en échange d’une disponibilité immédiate et d’un capital garanti.',
        },
        {
          label: 'Éviter d’être contraint de vendre ses placements à un mauvais moment.',
          correct: true,
          explanation:
            'Exact. Le danger principal n’est pas la baisse des marchés mais la vente forcée pendant cette baisse, qui transforme une perte passagère en perte définitive.',
        },
        {
          label: 'Servir d’apport pour investir davantage quand les marchés baissent.',
          explanation:
            'Faux. Une réserve mobilisée pour investir n’est plus une réserve. Elle est réservée aux imprévus, pas aux opportunités.',
        },
        {
          label: 'Diversifier le portefeuille avec un support peu corrélé aux actions.',
          explanation:
            'Faux : ce n’est pas une brique de portefeuille mais un préalable au portefeuille. Sa mesure de succès est la disponibilité, pas la corrélation.',
        },
      ],
    },
    {
      slug: 'n1-q4',
      prompt:
        'Deux supports offrent le même rendement brut de 6 % par an sur 30 ans. L’un prélève 0,25 % de frais annuels, l’autre 2 %. Quel est l’ordre de grandeur de l’écart sur le capital final ?',
      takeaway:
        'Les frais annuels amputent la base sur laquelle les intérêts composés travaillent : leur effet cumulé est très supérieur à leur pourcentage affiché.',
      choices: [
        {
          label: 'Environ 1,75 % d’écart au total, soit quelques centaines d’euros.',
          explanation:
            'Faux. C’est l’erreur classique : additionner l’écart annuel une seule fois. Les frais sont prélevés chaque année sur un capital qui grossit.',
        },
        {
          label: 'Environ 5 % d’écart sur le capital final.',
          explanation:
            'Faux, l’effet est bien plus important. Chaque euro de frais prélevé aujourd’hui est aussi un euro qui ne produira aucun rendement pendant les années restantes.',
        },
        {
          label: 'Près de 40 % d’écart sur le capital final.',
          correct: true,
          explanation:
            'Exact. Sur 10 000 € et 30 ans, on passe d’environ 53 400 € à environ 32 400 €. Même durée, même rendement brut : seuls les frais diffèrent.',
        },
        {
          label: 'Aucun écart significatif : le rendement brut étant identique, le résultat est identique.',
          explanation:
            'Faux. Le rendement brut est identique, mais l’investisseur ne touche que le rendement net. C’est le net qui se compose.',
        },
      ],
    },
    {
      slug: 'n1-q5',
      prompt:
        'Vous aurez besoin de cet argent dans 18 mois pour un apport immobilier. Quelle conclusion est cohérente avec les repères de prudence enseignés ?',
      takeaway:
        'Un horizon court impose la disponibilité et l’absence de risque sur le capital, indépendamment de toute conviction sur un actif.',
      choices: [
        {
          label:
            'Un horizon inférieur à deux ans est incompatible avec des actifs volatils : l’argent doit rester disponible et sans risque de capital.',
          correct: true,
          explanation:
            'Exact. À cette échéance, vous n’avez pas le temps d’attendre un éventuel rétablissement, et aucun rétablissement n’est garanti.',
        },
        {
          label:
            'Comme l’horizon est court, il faut choisir les actifs les plus volatils pour maximiser le gain dans le temps imparti.',
          explanation:
            'Faux, et c’est un raisonnement dangereux. La volatilité augmente autant la probabilité de perte que celle de gain ; elle ne compense pas le manque de temps.',
        },
        {
          label:
            'La durée n’a pas d’importance si l’on est convaincu de la qualité de l’actif choisi.',
          explanation:
            'Faux. La conviction personnelle ne raccourcit pas le délai de rétablissement d’un marché ni ne réduit sa volatilité.',
        },
        {
          label:
            'On peut exposer cette somme aux cryptomonnaies à condition de fixer un seuil de vente.',
          explanation:
            'Faux. Un seuil de vente ne protège pas d’une baisse brutale et ne rend pas un actif très volatil compatible avec une échéance de 18 mois.',
        },
      ],
    },
  ],
};
