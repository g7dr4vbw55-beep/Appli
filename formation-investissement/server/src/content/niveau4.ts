import type { LevelSeed } from './types.js';

export const niveau4: LevelSeed = {
  slug: 'risque-psychologie',
  title: 'Risque et psychologie',
  subtitle: 'Le couple risque/rendement, le dimensionnement, et les mécanismes qui font perdre de l’argent aux investisseurs disciplinés',
  intro:
    "La plupart des pertes évitables ne viennent pas d'une mauvaise analyse mais d'une réaction émotionnelle mal identifiée. Ce niveau donne d'abord les deux outils quantitatifs de base — le couple risque/rendement et la taille de position — puis décrit les trois mécanismes psychologiques les plus coûteux. Rien ici n'est un jugement moral : ces réactions sont universelles.",
  lessons: [
    {
      slug: 'risque-rendement',
      title: 'Le couple risque/rendement : ce que le mot risque signifie',
      summary:
        "Volatilité, perte maximale, risque de ruine : trois mesures distinctes, et pourquoi un rendement élevé promis sans risque est une contradiction.",
      body: `## La relation de base

Sur des marchés qui fonctionnent normalement, un rendement espéré plus élevé s'accompagne d'un risque plus élevé. Ce n'est pas une loi physique, c'est une conséquence de la concurrence : si un placement offrait un rendement élevé sans risque, les capitaux s'y précipiteraient jusqu'à faire monter son prix et donc baisser son rendement futur.

D'où la conclusion la plus utile de tout ce parcours : **« rendement élevé » et « sans risque » ne peuvent pas coexister durablement**. Quand les deux sont affirmés ensemble, l'une des deux affirmations est fausse, ou le risque a été déplacé quelque part où vous ne le voyez pas. Le niveau 5 est consacré à ces cas.

## Trois mesures très différentes du mot « risque »

Le mot est employé pour désigner des choses distinctes, et les confondre conduit à de mauvaises décisions.

1. **La volatilité** : l'amplitude des variations, mesurée par l'écart-type des rendements. Elle décrit l'inconfort du trajet. Une volatilité annuelle de 15 % est typique d'un marché d'actions large ; 60 à 80 % est un ordre de grandeur observé sur le bitcoin.

2. **La perte maximale** (*max drawdown*) : la baisse la plus profonde entre un sommet et le point bas suivant. C'est la mesure la plus parlante, parce que c'est celle qu'on vit. Un actif dont la volatilité est « seulement » de 20 % peut avoir connu une perte maximale de 55 %.

3. **Le risque de ruine** : la probabilité de perdre une part du capital qui rend le retour au point de départ impossible ou hors de portée. C'est la seule mesure qui compte vraiment, et c'est celle dont on parle le moins.

Ce troisième point mérite une insistance. Une perte de 20 % exige une hausse de 25 % pour être effacée. Une perte de 50 % exige +100 %. Une perte de 90 % exige +900 %. L'asymétrie est brutale : **les grandes pertes sont mathématiquement beaucoup plus difficiles à rattraper que les grands gains ne sont faciles à conserver.** C'est pourquoi éviter la perte catastrophique passe avant la recherche du rendement maximal.

## Le rendement espéré n'est pas le rendement obtenu

Un rendement moyen historique de 7 % ne signifie pas 7 % chaque année. Il signifie une distribution : quelques années très fortes, beaucoup de moyennes, plusieurs franchement négatives. La moyenne n'a jamais été l'expérience de personne.

Il faut aussi distinguer le rendement **du marché** et le rendement **de l'investisseur**. Les études sur les flux de fonds montrent régulièrement que les investisseurs particuliers obtiennent en moyenne moins que les fonds qu'ils détiennent, parce qu'ils entrent après les hausses et sortent après les baisses. L'écart n'est pas dû aux produits mais au calendrier des décisions.

## Un réflexe concret

Avant tout engagement, posez la question dans le bon sens. Non pas « combien cela peut-il rapporter ? », mais : **« si cette position perd 50 %, que se passe-t-il pour moi concrètement ? »** Si la réponse est inacceptable, la position est trop grosse, quelle que soit la qualité de l'analyse.`,
      keyPoints: [
        '« Rendement élevé » et « sans risque » ne coexistent pas durablement.',
        'Trois mesures distinctes : volatilité, perte maximale, risque de ruine.',
        'Asymétrie : −50 % exige +100 %, −90 % exige +900 % pour revenir au point de départ.',
        'Le rendement moyen n’est l’expérience de personne : c’est une distribution.',
        'Le rendement de l’investisseur est souvent inférieur à celui de son fonds, à cause du calendrier des décisions.',
      ],
      sources: [
        {
          label: 'AMF – Comprendre le couple rendement/risque',
          url: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/notions-cles',
        },
      ],
    },
    {
      slug: 'taille-de-position',
      title: 'La taille de position : le seul paramètre qui décide de votre survie',
      summary:
        "Comment convertir un risque accepté en euros en une taille de position, et pourquoi la concentration tue plus sûrement qu'une mauvaise analyse.",
      body: `## Le renversement de perspective

Le débutant se demande : « quel actif acheter ? ». La question qui détermine réellement le résultat est : « **combien** en acheter ? ».

Deux personnes peuvent acheter exactement le même actif au même moment. L'une y met 3 % de son portefeuille, l'autre 60 %. Si l'actif perd 80 %, la première perd 2,4 % de son patrimoine — désagréable, sans conséquence. La seconde perd 48 % et met plusieurs années à revenir à son point de départ, si elle y revient. Même analyse, même actif, même timing : issues incomparables.

## La méthode, en trois nombres

1. **Le risque accepté, en euros.** Pas en pourcentage, pas « un peu » : un montant écrit. Par exemple : « je suis prêt à perdre 300 € sur cette position ».
2. **La baisse envisagée pour cet actif.** Pour une action isolée ou un crypto-actif, un scénario de −50 % est un minimum de prudence ; sur un altcoin, −90 % est un scénario réaliste, pas pessimiste.
3. **La taille maximale de la position** = risque accepté ÷ baisse envisagée.

Exemple : 300 € de perte acceptée, scénario de baisse de 50 % → position maximale de 600 €. Avec un scénario de −90 % → position maximale d'environ 333 €.

Ce calcul est délibérément conservateur, et c'est son intérêt : il place la limite avant la décision, pas après.

## Le seuil de concentration

Le repère couramment enseigné est qu'aucune position individuelle ne devrait dépasser environ 20 % du portefeuille, et qu'une classe d'actifs très volatile devrait rester une part minoritaire de l'ensemble. Cette application affiche une alerte visuelle au-delà de 20 % sur une ligne.

Il faut être clair sur ce que cette alerte est et n'est pas : c'est un **repère de vigilance** issu de la pédagogie financière courante, pas une règle réglementaire, et l'affichage de l'alerte ne constitue pas une invitation à vendre. Elle signale seulement qu'un événement propre à un seul actif pourrait affecter fortement l'ensemble de votre portefeuille.

## Deux erreurs de dimensionnement fréquentes

**Le renforcement à la baisse non planifié** (*moyenner à la baisse*). Une position perd 30 %, on rachète pour « faire baisser le prix moyen ». Cela augmente mécaniquement l'exposition à un actif dont la thèse se comporte moins bien que prévu. Le renforcement peut être défendable s'il était **prévu à l'avance et chiffré** ; il est dangereux quand il est improvisé pour soulager l'inconfort d'une perte latente.

**La position qui grossit toute seule.** Un actif qui triple passe de 10 % à 25 % du portefeuille sans qu'aucune décision n'ait été prise. Le portefeuille s'est concentré par inertie. C'est le cas le plus fréquent de dépassement du seuil d'alerte, et le plus difficile à voir, parce qu'il arrive quand tout va bien.

## Le lien avec le journal

C'est pour cette raison que le journal de décisions de cette application exige un montant de risque accepté en euros **avant** chaque ordre. Ce nombre écrit avant l'action est ce qui permet, plus tard, de constater factuellement si la taille était cohérente avec l'intention annoncée.`,
      keyPoints: [
        '« Combien » compte davantage que « quoi » : la taille de position décide du résultat.',
        'Taille maximale = risque accepté en euros ÷ baisse envisagée en pourcentage.',
        'Repère de vigilance : pas plus d’environ 20 % du portefeuille sur une ligne.',
        'Le renforcement à la baisse improvisé augmente l’exposition à une thèse qui se comporte mal.',
        'Une position qui performe grossit toute seule : la concentration arrive quand tout va bien.',
      ],
      sources: [
        {
          label: 'AMF – Diversifier et dimensionner ses placements',
          url: 'https://www.amf-france.org/fr/espace-epargnants/preparer-mes-projets/diversifier-ses-placements',
        },
      ],
    },
    {
      slug: 'effet-de-levier',
      title: 'L’effet de levier : pourquoi un débutant n’y touche pas',
      summary:
        "Comment le levier transforme une baisse ordinaire en perte totale, ce que disent les statistiques publiques de l'AMF, et les produits concernés.",
      body: `## Le mécanisme

L'effet de levier consiste à s'exposer à un montant supérieur à son capital, par emprunt ou par un produit dérivé. Avec un levier de 5, 1 000 € de capital contrôlent 5 000 € d'exposition.

Le levier multiplie les variations **dans les deux sens**, mais l'asymétrie est totale : les gains sont plafonnés par ce que fait le marché, tandis que les pertes sont plafonnées par la disparition de votre capital, qui survient beaucoup plus tôt qu'on ne l'imagine.

## Le calcul qui suffit à trancher

Avec un levier de 5, une baisse de **20 %** de l'actif efface 100 % du capital engagé. Avec un levier de 10, il suffit de **10 %**. Avec un levier de 20, **5 %**.

Or 5 % de variation quotidienne est banal sur un crypto-actif, et 10 % arrive plusieurs fois par an. Autrement dit, avec un levier élevé, la perte totale de la position ne relève pas du scénario défavorable : c'est le déroulement le plus probable, à échéance de quelques jours.

S'ajoutent trois aggravations :

- **L'appel de marge et la liquidation forcée** : quand la garantie devient insuffisante, la position est fermée automatiquement, au pire moment, sans que vous décidiez. La liquidation se déclenche souvent sur une mèche de prix brève qui se referme immédiatement après — la position est perdue, le prix est revenu, et vous n'êtes plus dedans.
- **Le coût de portage** : intérêts, frais de financement, frais overnight, qui rongent la position même quand le prix ne bouge pas.
- **La possibilité de devoir plus que sa mise** sur certains produits et hors du cadre européen protecteur.

## Ce que disent les chiffres publics

L'AMF a publié des études sur les résultats réels des particuliers français sur les instruments à effet de levier (CFD, forex). Le constat, stable d'une étude à l'autre, est que **une large majorité de clients perd de l'argent** — de l'ordre de 75 à 90 % selon les périodes et les catégories de produits — et que la perte moyenne par client est substantielle. Les intermédiaires régulés dans l'Union européenne sont d'ailleurs tenus d'afficher leur propre pourcentage de clients perdants : lisez-le, il est publié sur leurs sites.

Ce ne sont pas des débutants isolés qui perdent : c'est la population des clients, dans son ensemble.

## Les produits concernés

CFD, contrats à terme, options vendues, produits *turbo*, marge sur plateformes crypto, contrats perpétuels, ETF à levier quotidien (qui souffrent en plus d'une dérive de performance en marché agité), et le crédit contracté pour investir — s'endetter pour acheter des actifs volatils est une forme de levier, même sans produit dérivé.

## La position de ce parcours

Pour un débutant, le levier n'est pas un outil à utiliser avec prudence : c'est un outil à ne pas utiliser. Il ne corrige aucune faiblesse d'analyse et transforme une erreur ordinaire, qui aurait coûté quelques pourcents, en perte totale. Cette application ne propose d'ailleurs aucun levier dans son portefeuille d'entraînement, et ce n'est pas un oubli.`,
      keyPoints: [
        'Levier 5 : une baisse de 20 % efface le capital. Levier 10 : 10 %. Levier 20 : 5 %.',
        'Liquidation forcée automatique, souvent sur une mèche de prix brève.',
        'Coût de portage : la position se dégrade même si le prix ne bouge pas.',
        'Les études de l’AMF montrent que 75 à 90 % des particuliers perdent sur ces instruments.',
        'S’endetter pour investir est aussi une forme de levier.',
      ],
      sources: [
        {
          label: 'AMF – Étude des résultats des investisseurs particuliers sur le forex et les CFD',
          url: 'https://www.amf-france.org/fr/actualites-publications/publications/rapports-etudes-et-analyses',
        },
        {
          label: 'AMF – Les produits à effet de levier',
          url: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/produits-effet-de-levier',
        },
      ],
    },
    {
      slug: 'biais-de-confirmation',
      title: 'Le biais de confirmation : chercher à avoir raison plutôt qu’à savoir',
      summary:
        "Comment on filtre l'information sans s'en apercevoir, et le protocole écrit qui rend le biais visible.",
      body: `## Le mécanisme

Le biais de confirmation est la tendance à rechercher, retenir et juger crédibles les informations qui confortent ce que l'on croit déjà, et à écarter ou minorer les autres. Ce n'est pas de la malhonnêteté : c'est un fonctionnement normal de l'attention humaine, qui s'applique à tout le monde, y compris aux professionnels.

## À quoi il ressemble en pratique

Vous avez acheté un actif. Sans décision consciente :

- vous suivez les comptes et les forums favorables à cet actif, et vous quittez ceux qui le critiquent ;
- une critique argumentée est attribuée à l'ignorance ou à la mauvaise foi de son auteur ;
- une information favorable est acceptée sans vérification, une information défavorable est soumise à un examen sévère ;
- vous relisez votre thèse en vous souvenant surtout des éléments qui se sont réalisés.

Les chambres d'écho aggravent le phénomène : un groupe de discussion consacré à un actif est structurellement composé de personnes qui le détiennent, donc qui ont un intérêt à ce qu'il monte. L'information qui y circule est sélectionnée avant même de vous parvenir.

## L'aggravation propre à l'investissement

Deux biais voisins verrouillent l'ensemble :

- **L'aversion à la perte** : une perte est ressentie environ deux fois plus intensément qu'un gain d'ampleur équivalente (travaux de Kahneman et Tversky sur la théorie des perspectives). Reconnaître une erreur coûte donc psychologiquement plus cher que de continuer à espérer.
- **L'effet de dotation** : le simple fait de posséder un actif augmente la valeur qu'on lui attribue. On ne juge plus le même actif de la même façon avant et après l'avoir acheté.

Conséquence : après l'achat, votre lecture de l'information n'est plus neutre. Elle est structurellement orientée par le fait de détenir.

## Le seul remède qui fonctionne : écrire avant

Un biais ne se corrige pas par la bonne volonté, parce qu'on ne le ressent pas de l'intérieur. Il se corrige par un **protocole écrit**, décidé avant que l'émotion n'entre en jeu.

Trois pratiques efficaces :

1. **Formuler la condition d'invalidation** au moment de l'achat : « qu'est-ce qui, si cela se produit, me ferait dire que je me suis trompé ? ». Une thèse qu'aucun événement ne pourrait invalider n'est pas une thèse, c'est une croyance.
2. **Chercher activement l'argument contraire** : lire le meilleur texte argumenté *contre* la position, pas le plus faible. Si vous ne savez pas formuler l'argument adverse, vous ne connaissez pas encore le sujet.
3. **Se relire** : comparer ce qu'on avait écrit avant à ce qui s'est passé. C'est exactement la fonction du journal de décisions et du tableau de bord de cette application.

L'objectif n'est pas de devenir infaillible. Il est de rendre les erreurs **visibles**, donc corrigibles. Le bilan produit par cette application est descriptif et factuel : il compare des faits à des intentions écrites, il ne porte aucun jugement sur vous.`,
      keyPoints: [
        'Le biais de confirmation filtre l’information en faveur de ce que l’on croit déjà — chez tout le monde.',
        'Une perte est ressentie environ deux fois plus fort qu’un gain équivalent (aversion à la perte).',
        'L’effet de dotation modifie votre jugement dès que vous détenez l’actif.',
        'Une thèse qu’aucun événement ne pourrait invalider est une croyance, pas une thèse.',
        'Le remède est un protocole écrit avant la décision, pas la bonne volonté.',
      ],
      sources: [
        {
          label: 'AMF – Les biais comportementaux de l’épargnant',
          url: 'https://www.amf-france.org/fr/actualites-publications/publications/rapports-etudes-et-analyses',
        },
        {
          label: 'Kahneman & Tversky – Prospect Theory (1979)',
          url: 'https://www.jstor.org/stable/1914185',
        },
      ],
    },
    {
      slug: 'fomo-et-capitulation',
      title: 'FOMO et capitulation : les deux moments où l’on perd le plus',
      summary:
        "Pourquoi on achète les sommets et vend les creux, comment reconnaître l'état émotionnel en cours, et les garde-fous qui fonctionnent.",
      body: `## Le cycle observable

Les deux erreurs les plus coûteuses de l'investisseur particulier ne sont pas des erreurs d'analyse. Ce sont deux réactions symétriques, à deux moments précis.

**La FOMO** (*fear of missing out*, la peur de rater) survient après une forte hausse. Le prix a beaucoup monté, les médias en parlent, une connaissance annonce ses gains, les réseaux sociaux sont saturés du sujet. La peur n'est pas celle de perdre de l'argent : c'est celle d'être le seul à ne pas participer. On achète alors sans thèse, sans dimensionnement, avec le sentiment d'être en retard.

**La capitulation** survient après une forte baisse. La position est en perte importante depuis des semaines, chaque nouvelle est mauvaise, on ne supporte plus de regarder le portefeuille. On vend pour arrêter la douleur, souvent près du point bas, et on se promet de ne plus jamais y toucher.

L'enchaînement des deux produit le pire résultat possible : acheter haut, vendre bas. Et il se répète, parce que le mécanisme est émotionnel et non intellectuel.

## Pourquoi cela fonctionne si bien contre nous

- La hausse récente est le plus puissant argument de vente qui existe : elle constitue une preuve apparente, alors qu'elle décrit seulement le passé.
- L'attention médiatique est **retardée** : un actif fait la couverture des journaux après avoir monté, jamais avant.
- La preuve sociale opère de façon asymétrique : on entend les gains, presque jamais les pertes. Personne ne publie sa capitulation.
- En baisse, le cerveau traite la perte latente comme une menace continue. La vente procure un soulagement immédiat, qui est confondu avec une bonne décision.

## Reconnaître son propre état

Quelques signaux fiables, à connaître à l'avance :

- Vous vous sentez **pressé** — la précipitation est un symptôme, pas une information sur le marché.
- Vous consultez les cours plusieurs fois par heure.
- Vous cherchez surtout à savoir ce que font les autres.
- Vous envisagez d'augmenter fortement la taille prévue « parce que c'est évident cette fois ».
- Vous ne parvenez pas à formuler ce qui vous ferait changer d'avis.

Trois de ces signaux réunis décrivent un état émotionnel, pas une opportunité.

## Les garde-fous qui marchent

1. **Le délai de réflexion imposé** : 48 heures entre l'envie et l'ordre. Une thèse solide survit à 48 heures ; une FOMO, presque jamais.
2. **L'automatisation** : un investissement programmé décidé à froid ne se laisse ni exciter ni effrayer.
3. **La décision écrite avant l'action** : ce que fait le journal de cette application, en exigeant thèse, horizon, risque accepté et condition d'invalidation avant tout ordre. Écrire ralentit, et le ralentissement est le remède.
4. **Réduire la fréquence de consultation** : regarder son portefeuille chaque heure augmente le nombre d'occasions de réagir, jamais la qualité des décisions.

Ces réactions sont universelles et n'ont rien à voir avec l'intelligence ou la discipline personnelle. Le but n'est pas de ne plus les ressentir — c'est impossible — mais de ne plus agir pendant qu'on les ressent.`,
      keyPoints: [
        'FOMO après une hausse, capitulation après une baisse : acheter haut, vendre bas.',
        'L’attention médiatique arrive après la hausse, jamais avant.',
        'On entend les gains des autres, presque jamais leurs pertes.',
        'Signaux d’alerte : précipitation, consultation compulsive, taille revue à la hausse, incapacité à formuler ce qui invaliderait la thèse.',
        'Garde-fous : délai de 48 h, automatisation, décision écrite avant l’action, moins de consultations.',
      ],
      sources: [
        {
          label: 'AMF – Les biais comportementaux de l’épargnant',
          url: 'https://www.amf-france.org/fr/actualites-publications/publications/rapports-etudes-et-analyses',
        },
      ],
    },
  ],
  quiz: [
    {
      slug: 'n4-q1',
      prompt:
        'Une position a perdu 50 %. Quelle hausse est nécessaire pour revenir au capital de départ ?',
      takeaway:
        'L’asymétrie des pertes rend les baisses profondes très difficiles à rattraper : c’est le fondement du dimensionnement prudent.',
      choices: [
        {
          label: '50 %, symétriquement.',
          explanation:
            'Faux. C’est l’erreur d’intuition la plus courante. 100 € qui perdent 50 % valent 50 € ; +50 % sur 50 € donne 75 €, pas 100 €.',
        },
        {
          label: '100 %, car la hausse s’applique à un capital réduit.',
          correct: true,
          explanation:
            'Exact. Il faut doubler les 50 € restants. Cette asymétrie s’aggrave avec la profondeur de la perte : −90 % exige +900 %.',
        },
        {
          label: '75 %, en moyenne géométrique.',
          explanation:
            'Faux : le calcul est simplement 100 ÷ 50 − 1 = 100 %. Aucune moyenne n’intervient ici.',
        },
        {
          label: 'Cela dépend de la volatilité de l’actif.',
          explanation:
            'Faux. C’est de l’arithmétique pure, indépendante de l’actif. La volatilité influence la probabilité d’y parvenir, pas le pourcentage requis.',
        },
      ],
    },
    {
      slug: 'n4-q2',
      prompt:
        'Vous acceptez de perdre au maximum 400 € sur une position, et vous retenez un scénario de baisse de 50 % pour cet actif. Quelle taille de position maximale en découle ?',
      takeaway:
        'Taille maximale = risque accepté en euros ÷ baisse envisagée. La limite se fixe avant la décision.',
      choices: [
        {
          label: '200 €, soit la moitié du risque accepté.',
          explanation:
            'Faux : vous divisez au lieu de multiplier. Une position de 200 € qui baisse de 50 % ne perd que 100 €, ce qui n’utilise pas le risque accepté.',
        },
        {
          label: '800 €, car une baisse de 50 % sur 800 € représente 400 € de perte.',
          correct: true,
          explanation:
            'Exact : 400 ÷ 0,50 = 800 €. Avec un scénario plus sévère de −90 %, la même limite donnerait environ 444 €.',
        },
        {
          label: '400 €, égal au risque accepté.',
          explanation:
            'Faux : cela reviendrait à supposer une baisse de 100 %. C’est prudent, mais ce n’est pas le scénario retenu dans l’énoncé.',
        },
        {
          label: '2 000 €, en visant un rendement qui compense le risque.',
          explanation:
            'Faux, et dangereux : le rendement espéré n’entre pas dans un calcul de dimensionnement. Une position de 2 000 € perdrait 1 000 € dans le scénario retenu, soit 2,5 fois le risque accepté.',
        },
      ],
    },
    {
      slug: 'n4-q3',
      prompt:
        'Avec un effet de levier de 10, quelle variation défavorable de l’actif suffit à effacer la totalité du capital engagé ?',
      takeaway:
        'Le levier rapproche la perte totale d’une variation ordinaire de marché : c’est pourquoi un débutant ne l’utilise pas.',
      choices: [
        {
          label: '10 %.',
          correct: true,
          explanation:
            'Exact : 100 ÷ 10 = 10 %. Or une variation de 10 % survient plusieurs fois par an sur un crypto-actif, et la liquidation forcée intervient même avant, dès que la garantie devient insuffisante.',
        },
        {
          label: '50 %, le levier ne faisant que doubler l’exposition.',
          explanation:
            'Faux : un levier de 10 multiplie l’exposition par dix, pas par deux. 50 % de baisse aurait effacé cinq fois le capital.',
        },
        {
          label: '100 %, comme sans levier.',
          explanation:
            'Faux : sans levier, il faut effectivement −100 % pour tout perdre. C’est précisément ce que le levier change.',
        },
        {
          label: 'Aucune : le mécanisme d’appel de marge protège le capital.',
          explanation:
            'Faux. L’appel de marge ne protège pas le capital, il déclenche la fermeture forcée de la position, souvent au pire moment et sur une mèche de prix brève.',
        },
      ],
    },
    {
      slug: 'n4-q4',
      prompt:
        'Vous détenez un actif. Vous suivez trois forums enthousiastes à son sujet et jugez peu crédibles les analyses critiques. Comment nomme-t-on ce mécanisme et quel remède est efficace ?',
      takeaway:
        'Un biais ne se corrige pas par la volonté mais par un protocole écrit avant la décision, notamment une condition d’invalidation.',
      choices: [
        {
          label:
            'De la prudence : il est normal d’écarter les sources peu fiables une fois le sujet maîtrisé.',
          explanation:
            'Faux. Juger la fiabilité d’une source en fonction de sa conclusion est précisément la définition du biais, pas une preuve de maîtrise.',
        },
        {
          label:
            'Le biais de confirmation ; le remède est d’écrire à l’avance la condition qui invaliderait la thèse.',
          correct: true,
          explanation:
            'Exact. Le biais ne se ressent pas de l’intérieur, donc la bonne volonté n’y change rien. Une thèse qu’aucun événement ne pourrait invalider est une croyance.',
        },
        {
          label:
            'L’aversion à la perte ; le remède est de vendre dès que la position devient négative.',
          explanation:
            'Faux sur les deux points. L’aversion à la perte est un biais voisin mais distinct, et vendre par réflexe dès qu’une position est négative décrit la capitulation.',
        },
        {
          label:
            'L’effet de dotation ; le remède est d’augmenter la position pour montrer sa conviction.',
          explanation:
            'Faux. L’effet de dotation est bien un biais aggravant, mais renforcer une position pour prouver sa conviction est exactement le comportement que le biais produit.',
        },
      ],
    },
    {
      slug: 'n4-q5',
      prompt:
        'Un actif a doublé en trois semaines, tous les médias en parlent, un collègue affiche ses gains et vous voulez y placer une somme supérieure à ce que vous aviez prévu. Quelle lecture est correcte ?',
      takeaway:
        'La précipitation est un symptôme émotionnel, pas une information sur le marché. Un délai de réflexion est le garde-fou le plus simple.',
      choices: [
        {
          label:
            'La hausse récente et l’attention médiatique confirment la solidité du mouvement : il faut agir vite.',
          explanation:
            'Faux. L’attention médiatique est retardée : un actif fait la couverture des journaux après avoir monté. La hausse passée n’est pas une information sur la hausse future.',
        },
        {
          label:
            'Il s’agit d’un état de FOMO ; un délai de réflexion de 48 heures et le maintien de la taille prévue sont les garde-fous appropriés.',
          correct: true,
          explanation:
            'Exact. Les signaux sont réunis : précipitation, preuve sociale, taille revue à la hausse. Une thèse solide survit à 48 heures ; une FOMO presque jamais.',
        },
        {
          label:
            'Il faut acheter une petite ligne immédiatement pour ne pas rater le mouvement, puis analyser.',
          explanation:
            'Faux. Agir d’abord et analyser ensuite installe l’effet de dotation : votre jugement sur l’actif ne sera plus neutre une fois la position ouverte.',
        },
        {
          label:
            'C’est de la capitulation inversée, un phénomène sans conséquence sur la performance.',
          explanation:
            'Faux. La capitulation désigne la vente après une baisse. Et l’enchaînement FOMO puis capitulation est justement le principal destructeur de performance chez les particuliers.',
        },
      ],
    },
  ],
};
