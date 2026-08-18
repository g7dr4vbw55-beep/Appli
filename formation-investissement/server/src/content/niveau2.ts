import type { LevelSeed } from './types.js';

export const niveau2: LevelSeed = {
  slug: 'actions-etf',
  title: 'Actions et ETF',
  subtitle: 'Ce que vous détenez réellement, et les enveloppes françaises pour le détenir',
  intro:
    "Une action, un indice et un ETF sont trois choses différentes que le langage courant confond souvent. Ce niveau décrit ce que chacun représente, ce que la diversification réduit et ce qu'elle ne réduit pas, puis les deux enveloppes principales en France. Aucun produit n'est recommandé ici : les exemples cités le sont à titre d'illustration.",
  lessons: [
    {
      slug: 'qu-est-ce-qu-une-action',
      title: 'Ce qu’est une action, concrètement',
      summary:
        "Une part de propriété dans une entreprise : ce qu'elle donne comme droits, d'où vient sa valeur, et ce qui peut la faire tomber à zéro.",
      body: `## Une part de propriété

Une action est une fraction du capital d'une entreprise. Détenir une action de Danone, c'est posséder une part minuscule de Danone, avec deux droits principaux : un droit sur les bénéfices distribués (le **dividende**, quand il y en a) et un droit de vote en assemblée générale, proportionnel au nombre d'actions.

Vous n'achetez pas un prix, vous achetez une part d'entreprise. C'est le point de départ de tout raisonnement honnête sur les actions.

## D'où vient la valeur

Le prix d'une action résulte de la confrontation entre acheteurs et vendeurs sur un marché. Ce que les acheteurs évaluent, c'est essentiellement la capacité de l'entreprise à générer des bénéfices futurs. Deux conséquences suivent.

Premièrement, le prix reflète des **anticipations**, pas la situation présente. Une entreprise qui publie de bons résultats peut voir son cours baisser si le marché espérait mieux. C'est déroutant au début et parfaitement logique ensuite.

Deuxièmement, il n'existe pas de valeur « vraie » consultable quelque part. Il existe des méthodes d'évaluation, qui reposent toutes sur des hypothèses discutables sur l'avenir.

## Les deux sources de performance

- Le **dividende** : une partie du bénéfice versée aux actionnaires. Certaines entreprises en versent régulièrement, d'autres jamais, préférant réinvestir. Un dividende n'est jamais garanti et peut être supprimé.
- La **plus-value** : l'écart entre le prix de vente et le prix d'achat, positif ou négatif.

## Le risque spécifique : zéro est atteignable

Une action peut perdre toute sa valeur. Si l'entreprise est liquidée, les actionnaires sont remboursés **en dernier**, après l'État, les salariés, les banques et les autres créanciers. En pratique, il ne reste généralement rien.

Ce n'est pas théorique. Des entreprises de grande taille et réputées solides ont vu leur action ramenée à quasiment rien : Enron en 2001, Lehman Brothers en 2008, Wirecard en 2020. À chaque fois, des investisseurs particuliers détenaient ces titres en pensant qu'une grande entreprise cotée ne pouvait pas disparaître.

## Ce que cela implique pour un débutant

Détenir une seule action, ou trois, expose à ce risque de disparition sans aucun amortissement. C'est ce risque précis, appelé **risque spécifique** ou risque idiosyncratique, que la diversification permet de réduire. La leçon sur la diversification y revient.

Cette leçon est informative. Les entreprises citées le sont comme exemples historiques documentés et ne constituent ni une appréciation de leur situation actuelle ni une suggestion d'achat ou de vente.`,
      keyPoints: [
        'Une action est une part de propriété d’entreprise, avec droit au dividende et droit de vote.',
        'Le prix reflète des anticipations de bénéfices futurs, pas la situation présente.',
        'Deux sources de performance : dividende (jamais garanti) et plus-value (positive ou négative).',
        'En cas de liquidation, l’actionnaire est remboursé en dernier : la valeur peut tomber à zéro.',
        'Détenir peu de titres expose au risque spécifique sans amortissement.',
      ],
      sources: [
        {
          label: 'AMF – Les actions',
          url: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/actions',
        },
      ],
    },
    {
      slug: 'indices-boursiers',
      title: 'Ce qu’est un indice, et ce qu’il ne mesure pas',
      summary:
        "Un panier de référence calculé selon des règles : composition, pondération, et le piège des indices hors dividendes.",
      body: `## Un thermomètre, pas un produit

Un indice boursier est un **panier théorique** de titres dont on calcule la valeur selon une règle publique. Ce n'est pas un produit : on ne peut pas acheter un indice. On peut acheter un produit qui cherche à le répliquer, ce qui est le sujet de la leçon suivante.

Quelques repères :

- **CAC 40** : 40 grandes entreprises cotées à Paris, pondérées par leur capitalisation flottante.
- **S&P 500** : environ 500 grandes entreprises américaines.
- **MSCI World** : plus de 1 300 entreprises de grande et moyenne taille dans une vingtaine de pays développés.
- **MSCI ACWI** : ajoute les pays émergents au périmètre précédent.

## La pondération change tout

La plupart des grands indices sont pondérés par la **capitalisation boursière** : plus une entreprise est grosse, plus elle pèse. Conséquence peu intuitive : un indice « mondial » n'est pas réparti équitablement entre pays. Dans le MSCI World, les États-Unis ont représenté ces dernières années environ 70 % du poids total, et les dix premières lignes ont pu peser plus de 20 % de l'indice à elles seules.

Croire qu'on est diversifié parce qu'un indice s'appelle « World » est une erreur classique. Il faut regarder la composition réelle, publiée par le fournisseur d'indice.

## Le piège du calcul : NR, GR, PR

Le même indice existe en plusieurs versions et les écarts se cumulent sur longue période :

- **PR** (*price return*) : hors dividendes. Le CAC 40 cité dans les médias est cette version.
- **NR** (*net return*) : dividendes réinvestis nets de retenue à la source.
- **GR** (*gross return*) : dividendes réinvestis bruts.

L'écart n'est pas anecdotique. Sur les grands marchés d'actions, les dividendes ont contribué en moyenne à un ou deux points de rendement annuel. Sur vingt ans, comparer un portefeuille dividendes réinvestis à un indice hors dividendes fausse complètement le jugement — dans un sens flatteur pour le portefeuille. Le module portefeuille de cette application compare toujours à un indice de référence que vous choisissez explicitement, et vous devez savoir laquelle de ces versions vous utilisez.

## À quoi sert un indice pour un particulier

À une seule chose utile : disposer d'un **point de comparaison honnête**. Si votre portefeuille a fait +8 % sur l'année et que le marché de référence a fait +19 %, votre +8 % change de sens. Cette comparaison ne dit rien sur l'avenir et ne constitue pas un objectif à atteindre ; elle vous informe simplement sur ce que vos décisions ont apporté ou coûté par rapport au fait de ne rien décider.`,
      keyPoints: [
        'Un indice est un panier théorique calculé selon des règles publiques, pas un produit achetable.',
        'La pondération par capitalisation concentre les grands indices : États-Unis ≈ 70 % du MSCI World ces dernières années.',
        'Versions PR (hors dividendes), NR et GR (dividendes réinvestis) : l’écart est majeur sur longue période.',
        'L’usage utile d’un indice est de fournir un point de comparaison honnête, pas un objectif.',
      ],
      sources: [
        {
          label: 'MSCI – Méthodologie des indices',
          url: 'https://www.msci.com/index-methodology',
        },
        {
          label: 'Euronext – Indice CAC 40',
          url: 'https://live.euronext.com/fr/product/indices/FR0003500008-XPAR',
        },
      ],
    },
    {
      slug: 'etf',
      title: 'L’ETF : le véhicule qui réplique un indice',
      summary:
        "Fonds coté en bourse : réplication physique ou synthétique, capitalisant ou distribuant, tracking error, et les points de vigilance concrets.",
      body: `## Définition

Un ETF (*exchange-traded fund*), ou fonds indiciel coté, est un fonds d'investissement dont les parts s'échangent en bourse comme une action, et dont l'objectif est de suivre la performance d'un indice. En France, on parle aussi de tracker.

Deux caractéristiques expliquent son succès auprès des particuliers : les frais annuels sont généralement très inférieurs à ceux d'un fonds géré activement, et une seule ligne donne accès à des centaines de titres.

## Réplication physique ou synthétique

- **Physique** : le fonds détient réellement les titres de l'indice, en totalité ou par échantillonnage.
- **Synthétique** : le fonds détient un panier de titres et conclut un contrat d'échange (*swap*) avec une banque qui lui garantit la performance de l'indice. Cela introduit un **risque de contrepartie** : si la banque fait défaut, le mécanisme est mis en difficulté. Ce risque est encadré par la réglementation européenne mais il existe.

La réplication synthétique a un usage pratique en France : elle permet de proposer des ETF éligibles au PEA suivant des indices non européens, ce qu'une réplication physique ne permettrait pas.

## Capitalisant ou distribuant

- **Capitalisant** (*accumulating*, souvent noté ACC ou C) : les dividendes sont réinvestis automatiquement dans le fonds.
- **Distribuant** (*distributing*, D ou DIST) : les dividendes vous sont versés.

Ce choix a des conséquences fiscales et pratiques, traitées dans la fiche fiscale de l'application.

## Les points à vérifier avant tout

1. **Les frais courants annuels** (TFE) : le premier critère, pour les raisons vues au niveau 1.
2. **L'encours du fonds** : un fonds très petit peut être fermé et liquidé par son émetteur.
3. **L'écart de suivi** (*tracking error* et *tracking difference*) : de combien le fonds a-t-il dévié de son indice ? Un ETF ne réplique jamais parfaitement.
4. **La liquidité et l'écart de cours** : passer un ordre sur un ETF peu échangé coûte plus cher que le pourcentage de frais affiché.
5. **La devise** : un ETF libellé en euros qui détient des actions américaines vous expose au dollar. « Libellé en euros » ne veut pas dire « couvert contre le risque de change ».
6. **L'indice réellement suivi** : deux ETF au nom voisin peuvent suivre des indices différents.

## Ce qu'un ETF ne fait pas

Il ne réduit pas le **risque de marché**. Un ETF actions monde baisse quand les marchés d'actions mondiaux baissent, et il a reculé de plus de 30 % lors de certains épisodes passés. La diversification interne d'un ETF supprime le risque de faillite d'une entreprise particulière ; elle ne protège d'aucune baisse générale.

Aucun ETF n'est nommé ni suggéré ici : la description ci-dessus est un cadre de lecture, pas une sélection.`,
      keyPoints: [
        'Un ETF est un fonds coté cherchant à répliquer un indice, avec des frais annuels généralement faibles.',
        'Réplication synthétique = risque de contrepartie, mais permet des ETF non européens éligibles au PEA.',
        'Capitalisant (dividendes réinvestis) ou distribuant (dividendes versés).',
        'À vérifier : frais courants, encours, écart de suivi, liquidité, devise, indice réellement suivi.',
        'Un ETF ne réduit jamais le risque de marché : il baisse quand son marché baisse.',
      ],
      sources: [
        {
          label: 'AMF – Les ETF (trackers)',
          url: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/fonds-dinvestissement/etf-trackers',
        },
      ],
    },
    {
      slug: 'diversification',
      title: 'La diversification : ce qu’elle réduit et ce qu’elle ne réduit pas',
      summary:
        "Risque spécifique contre risque de marché, corrélation, et les fausses diversifications les plus fréquentes.",
      body: `## Deux risques bien distincts

- Le **risque spécifique** est propre à un actif : fraude comptable, perte d'un brevet, faillite, piratage d'une plateforme. Il est **réductible** par la diversification.
- Le **risque de marché** (ou systématique) affecte tout le marché en même temps : récession, crise financière, choc géopolitique. Il n'est **pas réductible** par la diversification.

Toute la portée de la diversification tient dans cette distinction. Elle vous protège de la disparition d'une entreprise. Elle ne vous protège pas d'un marché baissier.

## La corrélation, seule mesure qui compte

Diversifier n'est pas accumuler des lignes, c'est détenir des actifs qui ne réagissent pas de la même façon aux mêmes événements. La corrélation mesure cette relation, entre −1 (mouvements inverses) et +1 (mouvements identiques).

Détenir dix actions bancaires européennes n'est pas diversifié : elles réagissent presque toutes de la même manière à une hausse des taux ou à une crise de liquidité. Détenir un ETF monde plus un ETF S&P 500 plus un ETF Nasdaq n'est pas non plus très diversifié : les mêmes grandes entreprises américaines se retrouvent dans les trois, à des poids différents.

## Les axes de diversification

Par **classe d'actifs** (actions, obligations, immobilier, liquidités, crypto), par **zone géographique**, par **secteur**, par **taille d'entreprise**, et par **moment d'entrée** — c'est l'objet de la leçon sur l'investissement programmé.

## Les fausses diversifications courantes

1. **Le doublon d'ETF** décrit plus haut : trois lignes, une seule exposition réelle.
2. **La diversification par nombre de lignes** : quinze actions du même secteur restent une seule paire.
3. **L'oubli du reste de son patrimoine** : si votre employeur est aussi votre principale ligne d'actions, une difficulté de l'entreprise touche simultanément votre salaire et votre épargne. C'est une concentration extrême, souvent invisible.
4. **La diversification crypto** : détenir dix jetons différents diversifie peu, car la plupart évoluent avec le bitcoin lors des grands mouvements, souvent en amplifiant les baisses.

## Ce que dit la limite de concentration

Cette application affiche une alerte visuelle quand une position dépasse 20 % du portefeuille, et quand le nombre de lignes ou de classes d'actifs est insuffisant. Ce seuil est un repère de vigilance couramment utilisé en éducation financière, pas une règle réglementaire ni une consigne d'allocation. L'alerte vous informe qu'un événement propre à un seul actif pourrait affecter fortement l'ensemble ; elle ne vous dit pas de vendre.

Enfin, il faut être lucide : diversifier réduit l'amplitude des variations, donc aussi celle des gains. Un portefeuille diversifié ne sera jamais celui qui a le mieux performé sur un an. Il évite en revanche d'être celui qui a tout perdu.`,
      keyPoints: [
        'La diversification réduit le risque spécifique, jamais le risque de marché.',
        'Ce qui compte est la corrélation entre actifs, pas le nombre de lignes.',
        'Faux amis fréquents : doublons d’ETF, même secteur, actions de son employeur, multiplication de jetons crypto.',
        'Le seuil d’alerte de 20 % par position est un repère de vigilance, pas une règle.',
        'Diversifier réduit l’amplitude des pertes comme celle des gains.',
      ],
      sources: [
        {
          label: 'AMF – Diversifier ses placements',
          url: 'https://www.amf-france.org/fr/espace-epargnants/preparer-mes-projets/diversifier-ses-placements',
        },
      ],
    },
    {
      slug: 'pea-compte-titres',
      title: 'PEA et compte-titres : deux enveloppes, deux logiques',
      summary:
        "Ce que chaque enveloppe autorise, ses plafonds et ses contraintes de durée, en renvoyant aux sources officielles pour la fiscalité.",
      body: `## Une enveloppe n'est pas un placement

Le PEA et le compte-titres ordinaire (CTO) sont des **contenants**. Ils ne rapportent rien par eux-mêmes : ce sont les titres qu'on y place qui évoluent. Choisir une enveloppe consiste à choisir un ensemble de règles : ce qu'on peut y mettre, ce qu'on peut en sortir et quand, et sous quel régime fiscal.

## Le PEA (plan d'épargne en actions)

- **Univers d'investissement restreint** : actions d'entreprises ayant leur siège dans l'Union européenne ou l'Espace économique européen, et fonds ou ETF respectant un quota d'actifs européens. C'est pour cette raison que des ETF à réplication synthétique existent : ils permettent de suivre un indice mondial ou américain tout en restant éligibles.
- **Plafond de versements** : 150 000 € pour un PEA classique (un seul par personne, deux maximum par foyer fiscal). Un PEA-PME existe en parallèle avec son propre plafond.
- **Durée** : c'est le point clé. Un retrait avant 5 ans entraîne en principe la clôture du plan et fait perdre l'avantage fiscal. Après 5 ans, les retraits partiels sont possibles sans clôture.
- **Pas de cryptomonnaies**, pas d'obligations en direct, pas d'actions hors périmètre européen en direct.

## Le compte-titres ordinaire

- **Univers très large** : actions du monde entier, obligations, ETF sans contrainte géographique, produits dérivés selon le courtier.
- **Aucun plafond de versement, aucune contrainte de durée** : les fonds sont disponibles à tout moment.
- **Régime fiscal de droit commun** sur les revenus et plus-values, décrit dans la fiche fiscale de l'application.

## Comment on les compare honnêtement

Le PEA offre un cadre fiscal plus favorable sur les actions européennes après cinq ans, au prix d'un univers restreint et d'une contrainte de durée. Le CTO offre la liberté totale sans avantage fiscal particulier. Beaucoup d'investisseurs français détiennent les deux, pour des usages différents.

Deux avertissements nécessaires :

1. **La fiscalité évolue.** Les plafonds, taux et conditions cités ici l'étaient à la date de rédaction de ce contenu. Avant toute décision, vérifiez sur impots.gouv.fr ou service-public.fr, qui sont les sources faisant foi.
2. **Les frais du courtier comptent au moins autant que l'enveloppe.** Un PEA chez un établissement facturant des droits de garde et 1,5 % par ordre peut coûter plus cher que l'avantage fiscal ne rapporte. Comparez les grilles tarifaires.

## Un point souvent ignoré

L'antériorité fiscale du PEA se compte depuis la **date d'ouverture**, pas depuis le premier versement significatif. Ouvrir un PEA et y laisser une somme modeste fait donc courir le compteur des cinq ans. C'est une information factuelle sur le fonctionnement du produit, pas une incitation à ouvrir un plan.`,
      keyPoints: [
        'PEA et CTO sont des enveloppes : elles ne rapportent rien, elles encadrent.',
        'PEA : univers européen, plafond 150 000 €, retrait avant 5 ans = clôture en principe, pas de crypto.',
        'CTO : univers mondial, aucun plafond, aucune contrainte de durée, fiscalité de droit commun.',
        'La réglementation évolue : vérifier sur impots.gouv.fr et service-public.fr.',
        'Les frais du courtier peuvent annuler l’avantage d’une enveloppe.',
      ],
      sources: [
        {
          label: 'Service-public.fr – Plan d’épargne en actions (PEA)',
          url: 'https://www.service-public.fr/particuliers/vosdroits/F22449',
        },
        {
          label: 'impots.gouv.fr – Revenus et plus-values de valeurs mobilières',
          url: 'https://www.impots.gouv.fr/particulier/questions/comment-sont-imposees-les-plus-values-de-cession-de-valeurs-mobilieres',
        },
      ],
    },
    {
      slug: 'investissement-programme',
      title: 'L’investissement programmé : ce qu’il fait vraiment',
      summary:
        "Versements réguliers, lissage du prix d'entrée, et distinction claire entre bénéfice comportemental et bénéfice de performance.",
      body: `## Le principe

L'investissement programmé (aussi appelé DCA, *dollar cost averaging*) consiste à investir un montant fixe à intervalle régulier, par exemple 150 € le 5 de chaque mois, indépendamment du niveau du marché.

Mécaniquement, un montant fixe achète davantage de parts quand le prix est bas et moins quand il est haut. Le prix moyen payé se rapproche de la moyenne des prix sur la période plutôt que de dépendre d'une seule date.

## Le vrai bénéfice est comportemental

Il faut être précis, car ce point est souvent mal présenté.

Les études comparant investissement immédiat d'une somme disponible et étalement de cette somme montrent que, sur des marchés historiquement haussiers à long terme, l'investissement immédiat a en moyenne donné un meilleur résultat, simplement parce que l'argent est exposé plus longtemps. L'étalement d'un capital existant réduit le risque de mal tomber, au prix d'un rendement moyen espéré inférieur.

L'investissement programmé sur un **flux de revenus** est une situation différente : vous investissez au fur et à mesure ce que vous gagnez, il n'y a pas de capital en attente. C'est le cas de la plupart des particuliers.

Le bénéfice principal, dans les deux cas, est comportemental :

- Il supprime la décision « est-ce le bon moment ? », qui paralyse et qui pousse à acheter après les hausses et à s'abstenir après les baisses.
- Il rend l'effort d'épargne prévisible et automatisable.
- Il réduit le regret, donc la probabilité d'abandonner le plan.

Un plan médiocre suivi pendant vingt ans donne généralement un meilleur résultat qu'un plan optimal abandonné au bout de huit mois.

## Ce que cela ne fait pas

L'investissement programmé **ne protège pas d'une perte**. Si le marché est plus bas dans dix ans qu'aujourd'hui, un investissement programmé sera en perte. Il lisse le prix d'entrée, il ne garantit rien. Toute présentation du DCA comme une méthode « sans risque » est trompeuse.

Il faut aussi surveiller les **frais fixes**. Verser 50 € par mois chez un courtier qui facture 5 € par ordre représente 10 % de frais d'entrée, ce qui détruit l'intérêt de l'opération. Regroupez les versements ou choisissez un intermédiaire adapté aux petits montants.

## Le lien avec la suite du parcours

L'automatisation est aussi une protection contre les biais étudiés au niveau 4. Une décision prise une fois, à froid, et exécutée automatiquement, est très difficile à saboter sous le coup de la panique ou de l'euphorie. C'est précisément pourquoi le journal de décisions de cette application vous demande d'écrire vos intentions **avant** de passer un ordre.`,
      keyPoints: [
        'Investir un montant fixe à intervalle régulier lisse le prix d’entrée.',
        'Sur un capital disponible, l’investissement immédiat a historiquement mieux performé en moyenne ; l’étalement réduit le risque de mal tomber.',
        'Le bénéfice principal est comportemental : il supprime la question du bon moment.',
        'Le DCA ne protège pas d’une perte et ne garantit rien.',
        'Attention aux frais fixes sur de petits versements réguliers.',
      ],
      sources: [
        {
          label: 'AMF – Investir régulièrement',
          url: 'https://www.amf-france.org/fr/espace-epargnants/preparer-mes-projets/epargner',
        },
      ],
    },
  ],
  quiz: [
    {
      slug: 'n2-q1',
      prompt: 'Quelle affirmation décrit correctement ce que vous détenez avec une action ?',
      takeaway:
        'Une action est une part de propriété d’entreprise ; en cas de liquidation, l’actionnaire passe après tous les créanciers.',
      choices: [
        {
          label:
            'Une part de propriété de l’entreprise, avec droit sur les bénéfices distribués et droit de vote.',
          correct: true,
          explanation:
            'Exact. Ce sont les deux droits principaux attachés à une action ordinaire, proportionnels au nombre de titres détenus.',
        },
        {
          label: 'Une créance sur l’entreprise, remboursée à échéance avec un intérêt.',
          explanation:
            'Faux : c’est la description d’une obligation. L’obligataire est un créancier, l’actionnaire un propriétaire, et ils ne sont pas remboursés au même rang.',
        },
        {
          label: 'Un droit à recevoir un dividende garanti chaque année.',
          explanation:
            'Faux. Le dividende dépend des bénéfices et de la décision de l’entreprise : il peut être réduit ou supprimé, et beaucoup d’entreprises n’en versent aucun.',
        },
        {
          label: 'Une garantie de récupérer sa mise si l’entreprise est liquidée.',
          explanation:
            'Faux, et c’est l’inverse : l’actionnaire est remboursé en dernier, après l’État, les salariés et les créanciers. Il ne reste généralement rien.',
        },
      ],
    },
    {
      slug: 'n2-q2',
      prompt:
        'Vous comparez la performance de votre portefeuille, dividendes réinvestis, à celle du CAC 40 tel que cité dans les médias. Quel biais introduisez-vous ?',
      takeaway:
        'Le CAC 40 médiatique est une version hors dividendes (PR) : le comparer à un portefeuille dividendes réinvestis flatte artificiellement le portefeuille.',
      choices: [
        {
          label:
            'Aucun biais : un indice mesure le marché, la comparaison est directe.',
          explanation:
            'Faux. Le même indice existe en plusieurs versions de calcul, et l’écart entre elles se cumule année après année.',
        },
        {
          label:
            'Vous comparez à une version hors dividendes, ce qui avantage artificiellement votre portefeuille.',
          correct: true,
          explanation:
            'Exact. Le CAC 40 usuel est un indice PR (price return). Les dividendes ayant contribué à un ou deux points de rendement annuel, l’écart devient important sur longue période.',
        },
        {
          label:
            'Vous désavantagez votre portefeuille, car un indice inclut toujours les dividendes bruts.',
          explanation:
            'Faux : c’est la version GR qui inclut les dividendes bruts, et ce n’est pas celle qui est citée par défaut dans les médias pour le CAC 40.',
        },
        {
          label: 'Le biais vient uniquement des frais, pas du mode de calcul de l’indice.',
          explanation:
            'Faux. Les frais constituent un autre biais, réel, mais la question porte sur le traitement des dividendes dans l’indice, qui est un biais distinct et souvent plus grand.',
        },
      ],
    },
    {
      slug: 'n2-q3',
      prompt:
        'Un ETF à réplication synthétique suivant le S&P 500 est éligible au PEA. Quelle est la contrepartie de ce montage ?',
      takeaway:
        'La réplication synthétique introduit un risque de contrepartie ; c’est ce qui permet d’accéder à des indices non européens dans un PEA.',
      choices: [
        {
          label: 'Il n’y a aucune contrepartie : le rendement est garanti par la banque.',
          explanation:
            'Faux. Le contrat d’échange porte sur la performance de l’indice, y compris négative, et « garanti par une banque » suppose que cette banque ne fasse pas défaut.',
        },
        {
          label:
            'Un risque de contrepartie : la performance est assurée par un contrat d’échange avec un établissement financier.',
          correct: true,
          explanation:
            'Exact. Le fonds ne détient pas les actions de l’indice mais un panier plus un swap. Le risque est encadré par la réglementation européenne, il n’est pas nul.',
        },
        {
          label: 'Les frais courants sont nécessairement supérieurs à ceux d’un ETF physique.',
          explanation:
            'Faux : ce n’est pas une règle. Les frais dépendent de chaque fonds et doivent être lus dans le document d’informations clés.',
        },
        {
          label: 'L’ETF ne peut pas verser de dividendes.',
          explanation:
            'Faux. Le caractère capitalisant ou distribuant est indépendant du mode de réplication.',
        },
      ],
    },
    {
      slug: 'n2-q4',
      prompt:
        'Un portefeuille contient un ETF MSCI World, un ETF S&P 500 et un ETF Nasdaq 100. Que peut-on dire de sa diversification ?',
      takeaway:
        'La diversification se mesure par la corrélation des expositions réelles, pas par le nombre de lignes.',
      choices: [
        {
          label: 'Il est bien diversifié : trois ETF différents suivant trois indices différents.',
          explanation:
            'Faux. Trois lignes ne font pas trois expositions. Les mêmes grandes entreprises américaines se retrouvent dans les trois indices, à des poids différents.',
        },
        {
          label:
            'La diversification est faible : les trois indices partagent largement les mêmes grandes valeurs américaines.',
          correct: true,
          explanation:
            'Exact. Les États-Unis ont représenté ces dernières années environ 70 % du MSCI World, et les premières lignes du S&P 500 et du Nasdaq 100 sont en grande partie communes.',
        },
        {
          label: 'Le risque de marché est éliminé grâce au nombre de titres sous-jacents.',
          explanation:
            'Faux. Le risque de marché n’est jamais éliminé par la diversification, quel que soit le nombre de titres. Seul le risque spécifique l’est.',
        },
        {
          label: 'Le portefeuille est diversifié géographiquement puisque l’un des indices est mondial.',
          explanation:
            'Faux. Le nom d’un indice ne dit rien de sa répartition réelle. Il faut lire la composition publiée par le fournisseur d’indice.',
        },
      ],
    },
    {
      slug: 'n2-q5',
      prompt:
        'Un PEA a été ouvert il y a trois ans. Quelle affirmation est exacte sur son fonctionnement ?',
      takeaway:
        'Le PEA restreint l’univers d’investissement et impose une contrainte de durée ; les règles évoluent et doivent être vérifiées à la source.',
      choices: [
        {
          label:
            'On peut y détenir des cryptomonnaies à condition de passer par un ETF adossé au bitcoin.',
          explanation:
            'Faux. Les crypto-actifs ne sont pas éligibles au PEA, sous aucune forme d’enveloppe indicielle.',
        },
        {
          label:
            'Un retrait aujourd’hui entraîne en principe la clôture du plan et la perte de son antériorité fiscale.',
          correct: true,
          explanation:
            'Exact : avant cinq ans, le retrait provoque en principe la clôture. Après cinq ans, des retraits partiels sont possibles sans clôturer. Vérifiez toujours les modalités en vigueur sur service-public.fr.',
        },
        {
          label: 'Le plafond de versement est illimité, seule la fiscalité change.',
          explanation:
            'Faux : le PEA classique est plafonné à 150 000 € de versements. C’est le compte-titres ordinaire qui n’a pas de plafond.',
        },
        {
          label: 'L’antériorité fiscale se compte à partir du premier versement significatif.',
          explanation:
            'Faux. Elle se compte depuis la date d’ouverture du plan, indépendamment des montants versés ensuite.',
        },
      ],
    },
  ],
};
