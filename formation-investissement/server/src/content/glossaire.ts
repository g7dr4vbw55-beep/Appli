import type { GlossarySeed } from './types.js';

/**
 * Glossaire des marches financiers et de la crypto, en langage simple.
 * Chaque terme comporte un exemple concret. Aucune entree ne constitue une
 * recommandation d'achat ou de vente.
 */
export const glossaire: GlossarySeed[] = [
  // ======================= BASES =========================================
  {
    slug: 'interets-composes',
    term: 'Intérêts composés',
    category: 'bases',
    definition:
      "Mécanisme par lequel les gains déjà obtenus produisent eux-mêmes des gains, parce que le rendement s'applique au capital augmenté des gains précédents.",
    example:
      "1 000 € à 6 % rapportent 60 € la première année, puis 63,60 € la deuxième (6 % de 1 060 €), et ainsi de suite. Au bout de 30 ans, le capital atteint environ 5 740 €.",
    related: ['regle-de-72', 'rendement-nominal'],
  },
  {
    slug: 'regle-de-72',
    term: 'Règle de 72',
    category: 'bases',
    definition:
      "Approximation mentale : diviser 72 par le rendement annuel en pourcentage donne le nombre d'années nécessaires pour doubler un capital.",
    example: "À 6 % par an, 72 ÷ 6 = 12 ans environ pour doubler. À 3 %, environ 24 ans.",
    caution: "C'est une approximation arithmétique, pas une prévision de rendement.",
    related: ['interets-composes'],
  },
  {
    slug: 'inflation',
    term: 'Inflation',
    category: 'bases',
    definition:
      "Hausse générale et durable des prix, qui réduit ce qu'un même montant d'argent permet d'acheter. En France, elle est mesurée par l'INSEE.",
    example:
      "Avec 2 % d'inflation, un panier à 100 € coûte 102 € un an plus tard. 10 000 € dormants perdent environ 18 % de pouvoir d'achat en 10 ans.",
    related: ['rendement-reel', 'rendement-nominal'],
  },
  {
    slug: 'rendement-nominal',
    term: 'Rendement nominal',
    category: 'bases',
    definition: "Le rendement affiché d'un placement, avant prise en compte de l'inflation.",
    example: "Un livret annonçant 3 % offre un rendement nominal de 3 %.",
    related: ['rendement-reel'],
  },
  {
    slug: 'rendement-reel',
    term: 'Rendement réel',
    category: 'bases',
    definition:
      "Ce qui reste du rendement après inflation, approximativement le rendement nominal moins l'inflation. C'est le seul chiffre qui mesure l'évolution du pouvoir d'achat.",
    example:
      "3 % de rendement pendant une année à 4,5 % d'inflation donne un rendement réel d'environ −1,5 % : le solde monte, le pouvoir d'achat baisse.",
    related: ['inflation', 'rendement-nominal'],
  },
  {
    slug: 'epargne-de-precaution',
    term: 'Épargne de précaution',
    category: 'bases',
    definition:
      "Somme immédiatement disponible et sans risque de perte, destinée aux imprévus. Sa fonction est d'éviter d'avoir à vendre un placement au mauvais moment.",
    example:
      "Avec 1 500 € de dépenses mensuelles, un repère usuel est de 4 500 à 9 000 € (trois à six mois) sur un support disponible.",
    caution: "Un portefeuille d'actions, un ETF ou une cryptomonnaie ne peuvent pas jouer ce rôle.",
    related: ['liquidite', 'horizon-de-placement'],
  },
  {
    slug: 'horizon-de-placement',
    term: 'Horizon de placement',
    category: 'bases',
    definition:
      "Durée pendant laquelle on peut laisser une somme investie sans en avoir besoin. C'est une date, pas une intention.",
    example: "« Apport immobilier dans 3 ans » est un horizon ; « un jour, si besoin » n'en est pas un.",
    related: ['volatilite', 'epargne-de-precaution'],
  },
  {
    slug: 'liquidite',
    term: 'Liquidité',
    category: 'bases',
    definition:
      "Facilité avec laquelle un actif peut être vendu rapidement sans faire baisser son prix. Un actif peu liquide se vend mal et avec un écart de cours important.",
    example:
      "Un ETF sur indice large s'échange en permanence ; une part de société non cotée peut demander des mois pour trouver un acheteur.",
    related: ['spread', 'carnet-d-ordres'],
  },
  {
    slug: 'capital',
    term: 'Capital',
    category: 'bases',
    definition: "La somme initialement engagée dans un placement, hors gains et hors pertes.",
    example: "Vous investissez 2 000 € : c'est votre capital. La valeur atteint 2 300 €, dont 300 € de gain.",
    related: ['plus-value'],
  },
  {
    slug: 'plus-value',
    term: 'Plus-value',
    category: 'bases',
    definition:
      "Gain réalisé lors de la vente d'un actif, égal au prix de vente moins le prix d'achat, frais compris. Si le résultat est négatif, on parle de moins-value.",
    example: "Achat 1 000 €, vente 1 250 €, 8 € de frais : la plus-value est de 242 €.",
    related: ['pfu', 'capital'],
  },
  {
    slug: 'plus-value-latente',
    term: 'Plus-value latente',
    category: 'bases',
    definition:
      "Gain (ou perte) constaté sur une position encore détenue. Il n'est ni encaissé ni imposé tant que l'actif n'est pas vendu.",
    example: "Une position achetée 500 € et valant 620 € affiche +120 € de plus-value latente.",
    related: ['plus-value'],
  },
  {
    slug: 'frais-courants',
    term: 'Frais courants (TFE)',
    category: 'bases',
    definition:
      "Frais annuels prélevés directement sur l'encours d'un fonds ou d'un ETF, exprimés en pourcentage. Ils sont déduits de la valeur du support, donc invisibles sur un relevé.",
    example:
      "0,20 % de frais courants sur 5 000 € représentent 10 € par an, prélevés en continu sur la valeur du fonds.",
    caution:
      "Sur 30 ans, passer de 0,25 % à 2 % de frais annuels peut amputer le capital final de près de 40 %.",
    related: ['dic-kid', 'frais-de-courtage'],
  },
  {
    slug: 'frais-de-courtage',
    term: 'Frais de courtage',
    category: 'bases',
    definition:
      "Commission prélevée par l'intermédiaire à chaque ordre, en pourcentage, en montant fixe, ou les deux.",
    example: "Un ordre de 300 € facturé 0,5 % avec 1 € de minimum coûte 1,50 €.",
    caution: "Sur de petits versements réguliers, un frais fixe peut représenter un pourcentage énorme.",
    related: ['frais-courants', 'spread'],
  },
  {
    slug: 'droits-de-garde',
    term: 'Droits de garde',
    category: 'bases',
    definition:
      "Frais annuels facturés par certains établissements pour la simple détention de titres sur un compte.",
    example: "0,3 % de droits de garde sur 10 000 € de titres représentent 30 € par an, indépendamment de toute opération.",
    related: ['frais-courants'],
  },
  {
    slug: 'dic-kid',
    term: 'Document d’informations clés (DIC / KID)',
    category: 'bases',
    definition:
      "Document standardisé obligatoire dans l'Union européenne, remis avant souscription, qui présente la nature du produit, son indicateur de risque, ses coûts et ses scénarios de performance.",
    example: "Avant d'acheter un ETF, on y lit ses frais courants et son niveau de risque sur une échelle de 1 à 7.",
    related: ['frais-courants'],
  },
  {
    slug: 'taux-sans-risque',
    term: 'Taux sans risque',
    category: 'bases',
    definition:
      "Rendement de référence obtenu sans prendre de risque de perte en capital, approché par les emprunts d'État de bonne qualité ou les livrets réglementés.",
    example:
      "Si le taux sans risque est de 3 %, une promesse de 25 % « garantis » doit être considérée comme impossible en l'état.",
    related: ['couple-risque-rendement', 'rendement-garanti'],
  },
  {
    slug: 'interets-simples',
    term: 'Intérêts simples',
    category: 'bases',
    definition:
      "Intérêts calculés uniquement sur le capital de départ, sans que les gains précédents ne produisent eux-mêmes de gains.",
    example: "1 000 € à 5 % en intérêts simples rapportent exactement 50 € chaque année, indéfiniment.",
    related: ['interets-composes'],
  },
  {
    slug: 'effet-cliquet',
    term: 'Effet de base (asymétrie des pertes)',
    category: 'bases',
    definition:
      "Une perte exige une hausse proportionnellement plus forte pour être effacée, car la hausse s'applique à un capital réduit.",
    example: "−20 % exige +25 % pour revenir au départ ; −50 % exige +100 % ; −90 % exige +900 %.",
    related: ['perte-maximale', 'risque-de-ruine'],
  },

  // ======================= ACTIONS ET ETF ================================
  {
    slug: 'action',
    term: 'Action',
    category: 'actions-etf',
    definition:
      "Part de propriété d'une entreprise, donnant droit aux bénéfices distribués et au vote en assemblée générale.",
    example: "Détenir 10 actions d'une société qui en compte 1 million, c'est posséder un cent-millième de l'entreprise.",
    caution: "En cas de liquidation, l'actionnaire est remboursé en dernier : la valeur peut tomber à zéro.",
    related: ['dividende', 'obligation'],
  },
  {
    slug: 'obligation',
    term: 'Obligation',
    category: 'actions-etf',
    definition:
      "Titre de dette : en l'achetant, on prête de l'argent à un État ou une entreprise qui s'engage à verser des intérêts puis à rembourser.",
    example: "Une obligation d'État à 10 ans de 1 000 € au taux de 3 % verse 30 € par an puis rembourse 1 000 € à l'échéance.",
    caution: "Le prix d'une obligation baisse quand les taux d'intérêt montent, et l'émetteur peut faire défaut.",
    related: ['action', 'risque-de-credit'],
  },
  {
    slug: 'dividende',
    term: 'Dividende',
    category: 'actions-etf',
    definition:
      "Part du bénéfice qu'une entreprise verse à ses actionnaires. Il n'est jamais garanti et peut être réduit ou supprimé.",
    example: "Une action à 50 € versant 2 € de dividende offre un rendement du dividende de 4 %.",
    related: ['action', 'etf-capitalisant'],
  },
  {
    slug: 'indice',
    term: 'Indice boursier',
    category: 'actions-etf',
    definition:
      "Panier théorique de titres dont la valeur est calculée selon une règle publique. Un indice ne s'achète pas : il sert de référence.",
    example: "Le CAC 40 suit 40 grandes entreprises cotées à Paris, pondérées par leur capitalisation flottante.",
    related: ['etf', 'msci-world', 'indice-pr-nr-gr'],
  },
  {
    slug: 'indice-pr-nr-gr',
    term: 'Indice PR, NR, GR',
    category: 'actions-etf',
    definition:
      "Trois versions de calcul d'un même indice : PR hors dividendes, NR dividendes réinvestis nets de retenue à la source, GR dividendes réinvestis bruts.",
    example:
      "Le CAC 40 cité dans les médias est une version PR : comparer son portefeuille dividendes réinvestis à cet indice flatte artificiellement le portefeuille.",
    related: ['indice', 'indice-de-reference'],
  },
  {
    slug: 'msci-world',
    term: 'MSCI World',
    category: 'actions-etf',
    definition:
      "Indice regroupant plus de 1 300 entreprises de grande et moyenne taille dans une vingtaine de pays développés, pondérées par capitalisation.",
    example:
      "Malgré son nom, les États-Unis y ont représenté ces dernières années environ 70 % du poids total.",
    caution: "Un indice « mondial » n'est pas équitablement réparti entre pays : lisez la composition réelle.",
    related: ['indice', 'diversification'],
  },
  {
    slug: 'etf',
    term: 'ETF (tracker, fonds indiciel coté)',
    category: 'actions-etf',
    definition:
      "Fonds coté en bourse dont l'objectif est de suivre la performance d'un indice. Une seule ligne donne accès à des centaines de titres, avec des frais généralement faibles.",
    example: "Acheter une part d'ETF MSCI World expose à plus de 1 300 entreprises en une seule opération.",
    caution: "Un ETF ne réduit pas le risque de marché : il baisse quand son indice baisse.",
    related: ['indice', 'etf-synthetique', 'ecart-de-suivi'],
  },
  {
    slug: 'etf-physique',
    term: 'ETF à réplication physique',
    category: 'actions-etf',
    definition:
      "ETF qui détient réellement les titres composant l'indice, en totalité ou par échantillonnage représentatif.",
    example: "Un ETF CAC 40 physique détient effectivement les 40 actions dans les proportions de l'indice.",
    related: ['etf', 'etf-synthetique'],
  },
  {
    slug: 'etf-synthetique',
    term: 'ETF à réplication synthétique',
    category: 'actions-etf',
    definition:
      "ETF qui obtient la performance d'un indice via un contrat d'échange (swap) avec une banque, au lieu de détenir les titres.",
    example:
      "C'est le montage qui permet à un ETF suivant le S&P 500 d'être éligible au PEA, dont l'univers est européen.",
    caution: "Introduit un risque de contrepartie : le mécanisme dépend de la solidité de la banque.",
    related: ['etf', 'pea', 'risque-de-contrepartie'],
  },
  {
    slug: 'etf-capitalisant',
    term: 'ETF capitalisant / distribuant',
    category: 'actions-etf',
    definition:
      "Un ETF capitalisant (ACC, C) réinvestit automatiquement les dividendes dans le fonds ; un ETF distribuant (D, DIST) les verse à l'investisseur.",
    example: "Une part capitalisante voit sa valeur augmenter du montant des dividendes réinvestis, sans versement sur le compte.",
    related: ['etf', 'dividende'],
  },
  {
    slug: 'ecart-de-suivi',
    term: 'Écart de suivi (tracking error / difference)',
    category: 'actions-etf',
    definition:
      "Écart entre la performance d'un ETF et celle de l'indice qu'il cherche à répliquer. Aucun ETF ne réplique parfaitement son indice.",
    example: "Un indice à +10,0 % sur l'année et un ETF à +9,7 % présentent un écart de suivi de 0,3 point.",
    related: ['etf', 'frais-courants'],
  },
  {
    slug: 'encours',
    term: 'Encours (actif net) d’un fonds',
    category: 'actions-etf',
    definition: "Montant total géré par un fonds. Un encours très faible expose au risque de fermeture et de liquidation du fonds.",
    example: "Un ETF de 15 millions d'euros d'encours est nettement plus exposé à une fermeture qu'un ETF de 5 milliards.",
    related: ['etf'],
  },
  {
    slug: 'capitalisation-boursiere',
    term: 'Capitalisation boursière',
    category: 'actions-etf',
    definition: "Valeur totale d'une entreprise en bourse : nombre d'actions multiplié par le cours de l'action.",
    example: "10 millions d'actions à 25 € donnent une capitalisation de 250 millions d'euros.",
    related: ['indice', 'flottant'],
  },
  {
    slug: 'flottant',
    term: 'Flottant',
    category: 'actions-etf',
    definition:
      "Part des actions réellement disponibles à l'échange sur le marché, hors participations stables des fondateurs, familles ou États.",
    example: "Une société détenue à 70 % par sa famille fondatrice a un flottant de 30 %.",
    related: ['capitalisation-boursiere', 'liquidite'],
  },
  {
    slug: 'per',
    term: 'PER (price/earnings)',
    category: 'actions-etf',
    definition:
      "Rapport entre le cours d'une action et le bénéfice par action. Il indique combien d'années de bénéfices actuels le marché accepte de payer.",
    example: "Une action à 40 € dont le bénéfice par action est de 2 € affiche un PER de 20.",
    caution: "Un PER n'est comparable qu'entre entreprises de même secteur, et repose sur des bénéfices qui peuvent chuter.",
    related: ['action'],
  },
  {
    slug: 'ordre-au-marche',
    term: 'Ordre au marché',
    category: 'actions-etf',
    definition:
      "Ordre exécuté immédiatement au meilleur prix disponible, sans garantie sur le prix obtenu.",
    example: "Un ordre au marché sur un titre peu liquide peut s'exécuter sensiblement plus haut que le dernier cours affiché.",
    related: ['ordre-a-cours-limite', 'carnet-d-ordres'],
  },
  {
    slug: 'ordre-a-cours-limite',
    term: 'Ordre à cours limité',
    category: 'actions-etf',
    definition:
      "Ordre assorti d'un prix maximal à l'achat ou minimal à la vente. Il protège le prix mais peut ne pas être exécuté.",
    example: "Un ordre d'achat limité à 48 € ne s'exécute pas si le cours reste à 50 €.",
    related: ['ordre-au-marche'],
  },
  {
    slug: 'carnet-d-ordres',
    term: 'Carnet d’ordres',
    category: 'actions-etf',
    definition:
      "Liste des ordres d'achat et de vente en attente sur un actif, avec leurs prix et quantités. Sa profondeur mesure la liquidité.",
    example: "Un carnet où seuls 200 € d'ordres attendent à chaque prix signale un actif très peu liquide.",
    related: ['liquidite', 'spread'],
  },
  {
    slug: 'spread',
    term: 'Spread (écart achat/vente)',
    category: 'actions-etf',
    definition:
      "Différence entre le meilleur prix d'achat et le meilleur prix de vente au même instant. C'est un coût réel, même s'il n'apparaît sur aucune facture.",
    example: "Achat possible à 100,20 € et vente à 99,80 € : le spread de 0,40 € coûte 0,4 % à l'aller-retour.",
    related: ['liquidite', 'frais-de-courtage'],
  },
  {
    slug: 'pea',
    term: 'PEA (plan d’épargne en actions)',
    category: 'fiscalite',
    definition:
      "Enveloppe française réservée aux actions et fonds à dominante européenne, plafonnée à 150 000 € de versements, avec un régime fiscal plus favorable après cinq ans.",
    example: "Un retrait avant 5 ans entraîne en principe la clôture du plan et la perte de l'avantage fiscal.",
    caution:
      "Aucune cryptomonnaie n'est éligible. La réglementation évolue : vérifiez sur service-public.fr.",
    related: ['compte-titres', 'etf-synthetique', 'pfu'],
  },
  {
    slug: 'compte-titres',
    term: 'Compte-titres ordinaire (CTO)',
    category: 'fiscalite',
    definition:
      "Enveloppe sans plafond ni contrainte de durée, donnant accès aux marchés du monde entier, soumise au régime fiscal de droit commun.",
    example: "Une action américaine ou un ETF non européen ne peuvent être détenus qu'en compte-titres, pas en PEA.",
    related: ['pea', 'pfu'],
  },
  {
    slug: 'investissement-programme',
    term: 'Investissement programmé (DCA)',
    category: 'actions-etf',
    definition:
      "Investir un montant fixe à intervalle régulier, indépendamment du niveau du marché, ce qui lisse le prix d'entrée.",
    example: "150 € investis le 5 de chaque mois achètent plus de parts quand le prix est bas et moins quand il est haut.",
    caution: "Cela lisse le prix d'entrée mais ne protège d'aucune perte.",
    related: ['horizon-de-placement', 'fomo'],
  },
  {
    slug: 'indice-de-reference',
    term: 'Indice de référence (benchmark)',
    category: 'actions-etf',
    definition:
      "Indice choisi pour comparer honnêtement la performance d'un portefeuille à celle du marché correspondant.",
    example: "Un portefeuille à +8 % dans une année où son indice de référence a fait +19 % a coûté 11 points de performance.",
    caution: "Vérifiez la version de l'indice (PR, NR ou GR) pour que la comparaison soit valide.",
    related: ['indice-pr-nr-gr', 'indice'],
  },
  {
    slug: 'rebalancement',
    term: 'Rééquilibrage (rebalancement)',
    category: 'actions-etf',
    definition:
      "Opération consistant à revenir aux proportions cibles d'un portefeuille après que les évolutions de marché les ont déformées.",
    example:
      "Une poche passée de 20 % à 32 % du portefeuille après une forte hausse est ramenée à 20 % par une vente partielle.",
    related: ['diversification', 'concentration'],
  },
  {
    slug: 'valeur-liquidative',
    term: 'Valeur liquidative (VL)',
    category: 'actions-etf',
    definition:
      "Valeur d'une part de fonds, calculée en divisant l'actif net du fonds par le nombre de parts. Pour un ETF, le cours de bourse peut s'en écarter légèrement.",
    example: "Un fonds de 50 millions d'euros divisé en 500 000 parts a une valeur liquidative de 100 € par part.",
    related: ['etf', 'encours'],
  },
  {
    slug: 'risque-de-change',
    term: 'Risque de change',
    category: 'risque',
    definition:
      "Risque lié à la variation d'une devise étrangère. Un support libellé en euros mais investi en actifs étrangers reste exposé.",
    example:
      "Un ETF en euros investi en actions américaines perd de la valeur si le dollar baisse face à l'euro, même si les actions montent.",
    caution: "« Libellé en euros » ne signifie pas « couvert contre le risque de change ».",
    related: ['etf', 'couverture-hedged'],
  },
  {
    slug: 'couverture-hedged',
    term: 'Couverture de change (hedged)',
    category: 'risque',
    definition:
      "Mécanisme qui neutralise en grande partie l'effet des variations de devises, moyennant un coût qui réduit la performance.",
    example: "Un ETF « EUR Hedged » cherche à annuler l'effet du dollar pour un investisseur en euros.",
    related: ['risque-de-change'],
  },

  // ======================= CRYPTO ========================================
  {
    slug: 'blockchain',
    term: 'Blockchain',
    category: 'crypto',
    definition:
      "Registre de transactions répliqué sur de nombreux ordinateurs, organisé en blocs chaînés par empreintes cryptographiques, ce qui rend toute falsification détectable.",
    example:
      "Chaque transfert de bitcoin est inscrit dans un bloc contenant l'empreinte du bloc précédent : modifier une transaction ancienne invaliderait toute la suite.",
    caution: "La blockchain garantit l'intégrité du registre, jamais la qualité ou l'honnêteté d'un projet.",
    related: ['preuve-de-travail', 'preuve-d-enjeu', 'irreversibilite'],
  },
  {
    slug: 'irreversibilite',
    term: 'Irréversibilité',
    category: 'crypto',
    definition:
      "Une transaction confirmée sur une blockchain ne peut pas être annulée : ni service client, ni rétrofacturation, ni recours.",
    example: "Un transfert vers une mauvaise adresse est définitivement perdu, contrairement à un virement bancaire parfois rappelable.",
    related: ['blockchain', 'adresse-crypto'],
  },
  {
    slug: 'preuve-de-travail',
    term: 'Preuve de travail (proof of work)',
    category: 'crypto',
    definition:
      "Règle de consensus dans laquelle des mineurs dépensent de la puissance de calcul, donc de l'électricité, pour obtenir le droit d'ajouter un bloc.",
    example: "C'est le mécanisme utilisé par le bitcoin depuis 2009.",
    related: ['minage', 'preuve-d-enjeu'],
  },
  {
    slug: 'preuve-d-enjeu',
    term: 'Preuve d’enjeu (proof of stake)',
    category: 'crypto',
    definition:
      "Règle de consensus dans laquelle des validateurs immobilisent des jetons en garantie pour obtenir le droit de valider des blocs.",
    example: "Ethereum est passé de la preuve de travail à la preuve d'enjeu en septembre 2022.",
    related: ['staking', 'preuve-de-travail'],
  },
  {
    slug: 'minage',
    term: 'Minage',
    category: 'crypto',
    definition:
      "Activité consistant à faire fonctionner des machines de calcul pour valider des blocs et recevoir une récompense en jetons.",
    example: "Un mineur de bitcoin reçoit la récompense de bloc plus les frais des transactions incluses.",
    caution: "Les offres de « minage à rendement garanti » vendues à des particuliers sont un schéma de fraude fréquent.",
    related: ['preuve-de-travail', 'halving'],
  },
  {
    slug: 'halving',
    term: 'Halving',
    category: 'crypto',
    definition:
      "Division par deux de la récompense versée aux mineurs de bitcoin, inscrite dans le protocole et survenant environ tous les quatre ans.",
    example: "L'émission plafonnée à 21 millions d'unités découle de cette réduction programmée.",
    related: ['bitcoin', 'minage'],
  },
  {
    slug: 'bitcoin',
    term: 'Bitcoin',
    category: 'crypto',
    definition:
      "Premier crypto-actif, lancé en 2009, avec une émission plafonnée à 21 millions d'unités. Il n'a ni entreprise, ni dirigeant, ni bilan comptable.",
    example:
      "Faute de bénéfices futurs à actualiser, on ne peut pas le valoriser comme une action : son prix dépend uniquement de ce que d'autres acceptent de payer.",
    caution: "Baisses documentées depuis un sommet : environ −85 % (2013-2015), −83 % (2017-2018), −77 % (2021-2022).",
    related: ['halving', 'volatilite'],
  },
  {
    slug: 'altcoin',
    term: 'Altcoin',
    category: 'crypto',
    definition:
      "Tout crypto-actif autre que le bitcoin, soit plusieurs dizaines de milliers de jetons de nature très variable.",
    example: "On y trouve des projets techniques sérieux, des copies sans intérêt, des jetons humoristiques et des fraudes pures.",
    caution:
      "La majorité des jetons créés depuis 2017 ont perdu la quasi-totalité de leur valeur ou ont été abandonnés.",
    related: ['memecoin', 'biais-du-survivant'],
  },
  {
    slug: 'memecoin',
    term: 'Memecoin',
    category: 'crypto',
    definition:
      "Jeton sans prétention technique, dont le prix repose uniquement sur l'attention et la viralité.",
    example: "Un memecoin peut multiplier sa valeur par vingt en une semaine puis retomber à zéro le mois suivant.",
    related: ['altcoin', 'pump-and-dump'],
  },
  {
    slug: 'stablecoin',
    term: 'Stablecoin',
    category: 'crypto',
    definition:
      "Crypto-actif cherchant à maintenir une parité avec une monnaie officielle, généralement le dollar. Sa solidité dépend entièrement des réserves et de la gouvernance de son émetteur.",
    example: "En mai 2022, le stablecoin algorithmique TerraUSD a perdu sa parité et s'est effondré en quelques jours.",
    caution: "« Stable » est un nom commercial, pas une garantie.",
    related: ['altcoin', 'risque-de-contrepartie'],
  },
  {
    slug: 'smart-contract',
    term: 'Contrat intelligent (smart contract)',
    category: 'crypto',
    definition:
      "Programme exécuté automatiquement par un réseau blockchain lorsque ses conditions sont réunies.",
    example: "Une place d'échange décentralisée est un ensemble de contrats intelligents qui échangent des jetons sans intermédiaire humain.",
    caution: "Des failles dans des contrats intelligents ont provoqué des pertes de plusieurs centaines de millions de dollars.",
    related: ['defi', 'approbation-de-contrat'],
  },
  {
    slug: 'defi',
    term: 'Finance décentralisée (DeFi)',
    category: 'crypto',
    definition:
      "Ensemble d'applications financières fonctionnant par contrats intelligents, sans intermédiaire identifié ni service client.",
    example: "Prêter des jetons contre un rendement variable via un protocole automatisé relève de la DeFi.",
    caution: "Aucune garantie des dépôts, aucun recours en cas de faille, de piratage ou d'erreur de manipulation.",
    related: ['smart-contract', 'rug-pull'],
  },
  {
    slug: 'cex',
    term: 'Plateforme centralisée (CEX)',
    category: 'crypto',
    definition:
      "Entreprise chez qui l'on ouvre un compte pour acheter et détenir des crypto-actifs. Le solde affiché est une écriture dans sa base de données, et elle détient les clés.",
    example:
      "Les faillites de Mt. Gox (2014) et FTX (2022) ont montré que les utilisateurs détenaient une créance sur une société, pas un actif au porteur.",
    caution: "Aucune garantie des dépôts n'existe pour les crypto-actifs.",
    related: ['self-custody', 'cle-privee'],
  },
  {
    slug: 'dex',
    term: 'Plateforme décentralisée (DEX)',
    category: 'crypto',
    definition:
      "Place d'échange fonctionnant par contrats intelligents, où l'utilisateur conserve ses clés et échange directement depuis son portefeuille.",
    example: "Échanger deux jetons via un pool de liquidité automatisé sans créer de compte.",
    caution: "Aucun support, aucune annulation, et exposition aux contrats malveillants.",
    related: ['defi', 'rug-pull'],
  },
  {
    slug: 'self-custody',
    term: 'Garde personnelle (self-custody)',
    category: 'crypto',
    definition:
      "Situation où l'utilisateur détient lui-même les clés privées de ses crypto-actifs, sans intermédiaire.",
    example: "La formule usuelle est : « not your keys, not your coins ».",
    caution: "La garde personnelle ne supprime pas le risque : elle le transfère entièrement sur vous.",
    related: ['cle-privee', 'phrase-de-recuperation', 'cex'],
  },
  {
    slug: 'cle-privee',
    term: 'Clé privée',
    category: 'crypto',
    definition:
      "Secret cryptographique qui autorise les transferts depuis une adresse. Qui la détient contrôle les fonds, sans exception.",
    example: "Un portefeuille matériel conserve la clé privée hors ligne et signe les transactions sans jamais l'exposer.",
    related: ['cle-publique', 'phrase-de-recuperation'],
  },
  {
    slug: 'cle-publique',
    term: 'Clé publique',
    category: 'crypto',
    definition: "Donnée dérivée de la clé privée, dont découle l'adresse de réception. Elle peut être partagée sans risque.",
    example: "On communique son adresse pour recevoir un transfert ; on ne communique jamais la clé privée.",
    related: ['cle-privee', 'adresse-crypto'],
  },
  {
    slug: 'adresse-crypto',
    term: 'Adresse',
    category: 'crypto',
    definition:
      "Identifiant public servant à recevoir des crypto-actifs, comparable à un numéro de compte mais sans nom associé.",
    example: "Une erreur d'un seul caractère dans l'adresse de destination rend les fonds définitivement inaccessibles.",
    caution: "Les adresses ne portent pas de nom, mais l'historique complet est public et permanent.",
    related: ['irreversibilite', 'pseudonymat'],
  },
  {
    slug: 'phrase-de-recuperation',
    term: 'Phrase de récupération (seed phrase)',
    category: 'crypto',
    definition:
      "Suite de 12 ou 24 mots (standard BIP-39) dont toutes les clés privées d'un portefeuille sont dérivées. Elle permet de reconstituer le portefeuille sur n'importe quel appareil.",
    example: "Elle s'écrit à la main sur papier ou métal, en deux copies conservées dans des lieux distincts.",
    caution:
      "Aucun service légitime ne la demande jamais. Perdue, elle rend les fonds définitivement inaccessibles : personne ne peut la régénérer.",
    related: ['cle-privee', 'self-custody', 'faux-support'],
  },
  {
    slug: 'hot-wallet',
    term: 'Portefeuille logiciel (hot wallet)',
    category: 'crypto',
    definition:
      "Application de portefeuille installée sur un appareil connecté à internet : pratique, mais exposée aux logiciels malveillants.",
    example: "Une application mobile permettant de payer rapidement de petits montants.",
    related: ['cold-wallet', 'self-custody'],
  },
  {
    slug: 'cold-wallet',
    term: 'Portefeuille matériel (cold wallet)',
    category: 'crypto',
    definition:
      "Boîtier dédié conservant la clé privée hors ligne et signant les transactions sans l'exposer.",
    example: "Il doit être acheté auprès du fabricant ou d'un revendeur officiel, jamais d'occasion.",
    caution: "Des appareils modifiés ont été revendus avec une phrase de récupération déjà connue de l'escroc.",
    related: ['hot-wallet', 'phrase-de-recuperation'],
  },
  {
    slug: 'staking',
    term: 'Staking',
    category: 'crypto',
    definition:
      "Immobilisation de jetons pour participer à la validation d'une blockchain en preuve d'enjeu, en échange d'une récompense variable.",
    example: "Les jetons peuvent être bloqués pendant une période de retrait, durant laquelle ils restent exposés à la baisse du cours.",
    caution: "Un rendement fixe et élevé présenté comme du staking est un signal de fraude.",
    related: ['preuve-d-enjeu', 'rendement-garanti'],
  },
  {
    slug: 'gas',
    term: 'Frais de réseau (gas)',
    category: 'crypto',
    definition:
      "Coût payé au réseau pour faire exécuter une transaction ou un contrat, variable selon la congestion.",
    example: "Un transfert peut coûter quelques centimes en période calme et plusieurs dizaines d'euros en période de forte activité.",
    related: ['smart-contract', 'blockchain'],
  },
  {
    slug: 'approbation-de-contrat',
    term: 'Approbation de contrat (approval)',
    category: 'crypto',
    definition:
      "Autorisation donnée à un contrat intelligent de déplacer vos jetons. Une approbation illimitée reste active tant qu'elle n'est pas révoquée.",
    example: "Signer une approbation sur un faux site permet à l'escroc de vider le portefeuille plus tard, sans nouvelle action de votre part.",
    caution: "Vérifiez et révoquez régulièrement les approbations accordées.",
    related: ['smart-contract', 'hameconnage'],
  },
  {
    slug: 'pseudonymat',
    term: 'Pseudonymat',
    category: 'crypto',
    definition:
      "Les adresses blockchain ne portent pas de nom, mais toutes les transactions sont publiques et permanentes : ce n'est pas de l'anonymat.",
    example: "L'analyse de chaîne permet régulièrement de relier des adresses à des personnes identifiées.",
    related: ['adresse-crypto', 'blockchain'],
  },
  {
    slug: 'mica',
    term: 'MiCA',
    category: 'crypto',
    definition:
      "Règlement européen encadrant depuis 2024-2025 les prestataires de services sur crypto-actifs et certains émetteurs de jetons.",
    example: "En France, l'AMF tient la liste des prestataires enregistrés ou agréés.",
    caution: "Un enregistrement ne garantit ni la solidité d'un acteur ni la valeur d'un jeton.",
    related: ['cex', 'amf'],
  },
  {
    slug: 'airdrop',
    term: 'Airdrop',
    category: 'crypto',
    definition:
      "Distribution gratuite de jetons à un ensemble d'adresses, généralement pour promouvoir un projet.",
    example: "Un faux airdrop demande de « connecter » son portefeuille et de signer une autorisation, ce qui permet de le vider.",
    caution: "Un airdrop légitime ne demande jamais votre phrase de récupération.",
    related: ['approbation-de-contrat', 'hameconnage'],
  },

  // ======================= RISQUE ET PSYCHOLOGIE =========================
  {
    slug: 'volatilite',
    term: 'Volatilité',
    category: 'risque',
    definition:
      "Mesure de l'amplitude des variations de prix d'un actif, généralement par l'écart-type des rendements. Elle décrit l'inconfort du trajet.",
    example: "Un marché d'actions large présente une volatilité annuelle d'environ 15 % ; le bitcoin a évolué dans un registre de 60 à 80 %.",
    related: ['perte-maximale', 'couple-risque-rendement'],
  },
  {
    slug: 'perte-maximale',
    term: 'Perte maximale (max drawdown)',
    category: 'risque',
    definition:
      "Baisse la plus profonde enregistrée entre un sommet et le point bas suivant. C'est la mesure du risque la plus proche du vécu.",
    example: "Un actif passé de 100 à 45 avant de remonter affiche une perte maximale de 55 %.",
    related: ['volatilite', 'effet-cliquet'],
  },
  {
    slug: 'risque-de-ruine',
    term: 'Risque de ruine',
    category: 'risque',
    definition:
      "Probabilité de perdre une part du capital telle que le retour au point de départ devient hors de portée.",
    example: "Une perte de 90 % exige une hausse de 900 % pour être effacée, ce qui rend le retour très improbable.",
    related: ['effet-cliquet', 'taille-de-position'],
  },
  {
    slug: 'couple-risque-rendement',
    term: 'Couple risque / rendement',
    category: 'risque',
    definition:
      "Relation selon laquelle un rendement espéré plus élevé s'accompagne d'un risque plus élevé, sous l'effet de la concurrence entre investisseurs.",
    example: "Un rendement élevé annoncé comme garanti contient nécessairement un risque caché, un mensonge ou une fraude.",
    related: ['taux-sans-risque', 'rendement-garanti'],
  },
  {
    slug: 'risque-specifique',
    term: 'Risque spécifique',
    category: 'risque',
    definition:
      "Risque propre à un actif donné : fraude, faillite, perte d'un brevet, piratage. Il est réductible par la diversification.",
    example: "La faillite d'une entreprise ruine celui qui ne détient qu'elle, et coûte peu à celui qui en détient trois cents.",
    related: ['risque-de-marche', 'diversification'],
  },
  {
    slug: 'risque-de-marche',
    term: 'Risque de marché (systématique)',
    category: 'risque',
    definition:
      "Risque affectant l'ensemble d'un marché en même temps : récession, crise financière, choc géopolitique. Il n'est pas réductible par la diversification.",
    example: "En mars 2020, la quasi-totalité des marchés d'actions a baissé simultanément.",
    related: ['risque-specifique', 'correlation'],
  },
  {
    slug: 'risque-de-contrepartie',
    term: 'Risque de contrepartie',
    category: 'risque',
    definition:
      "Risque qu'une entité avec laquelle on a conclu un engagement ne puisse pas l'honorer.",
    example: "Un ETF synthétique dépend d'une banque pour la performance de l'indice ; une plateforme crypto dépend de sa propre solvabilité.",
    related: ['etf-synthetique', 'cex'],
  },
  {
    slug: 'risque-de-credit',
    term: 'Risque de crédit',
    category: 'risque',
    definition: "Risque qu'un emprunteur ne rembourse pas sa dette ou ne verse pas les intérêts prévus.",
    example: "Une obligation d'entreprise à haut rendement offre un taux élevé parce que la probabilité de défaut est plus forte.",
    related: ['obligation', 'risque-de-contrepartie'],
  },
  {
    slug: 'correlation',
    term: 'Corrélation',
    category: 'risque',
    definition:
      "Mesure, entre −1 et +1, de la tendance de deux actifs à évoluer dans le même sens. C'est la seule mesure pertinente de la diversification.",
    example: "Dix actions bancaires européennes sont fortement corrélées : elles réagissent presque identiquement à une crise de liquidité.",
    related: ['diversification', 'risque-de-marche'],
  },
  {
    slug: 'diversification',
    term: 'Diversification',
    category: 'risque',
    definition:
      "Répartition d'un portefeuille entre actifs peu corrélés, afin de réduire le risque spécifique. Elle ne réduit jamais le risque de marché.",
    example:
      "Détenir un ETF monde, un ETF S&P 500 et un ETF Nasdaq n'est pas diversifié : les mêmes grandes valeurs américaines s'y retrouvent.",
    caution: "Diversifier réduit l'amplitude des pertes comme celle des gains.",
    related: ['correlation', 'concentration'],
  },
  {
    slug: 'concentration',
    term: 'Concentration',
    category: 'risque',
    definition:
      "Part excessive du portefeuille exposée à un seul actif, secteur ou zone géographique.",
    example:
      "Un actif qui triple passe de 10 % à 25 % du portefeuille sans qu'aucune décision n'ait été prise : la concentration arrive quand tout va bien.",
    caution: "Repère de vigilance usuel : pas plus d'environ 20 % du portefeuille sur une ligne. Ce n'est pas une règle réglementaire.",
    related: ['diversification', 'taille-de-position', 'rebalancement'],
  },
  {
    slug: 'taille-de-position',
    term: 'Taille de position',
    category: 'risque',
    definition:
      "Montant engagé sur un actif donné. C'est le paramètre qui détermine le plus sûrement l'issue, davantage que le choix de l'actif.",
    example: "Taille maximale = risque accepté en euros ÷ baisse envisagée. 400 € de risque avec un scénario de −50 % donnent 800 € maximum.",
    related: ['risque-de-ruine', 'concentration'],
  },
  {
    slug: 'effet-de-levier',
    term: 'Effet de levier',
    category: 'risque',
    definition:
      "Exposition à un montant supérieur à son capital, par emprunt ou produit dérivé, qui multiplie les variations dans les deux sens.",
    example: "Avec un levier de 10, une baisse de 10 % de l'actif efface la totalité du capital engagé.",
    caution:
      "Les études de l'AMF montrent que 75 à 90 % des particuliers perdent de l'argent sur ces instruments. S'endetter pour investir est aussi une forme de levier.",
    related: ['appel-de-marge', 'cfd'],
  },
  {
    slug: 'appel-de-marge',
    term: 'Appel de marge et liquidation forcée',
    category: 'risque',
    definition:
      "Exigence de garantie supplémentaire lorsqu'une position à effet de levier perd de la valeur ; à défaut, la position est fermée automatiquement.",
    example: "La liquidation se déclenche souvent sur une brève mèche de prix : la position est perdue alors que le cours est déjà revenu.",
    related: ['effet-de-levier'],
  },
  {
    slug: 'cfd',
    term: 'CFD (contrat sur différence)',
    category: 'risque',
    definition:
      "Produit dérivé permettant de parier sur la variation d'un actif avec effet de levier, sans le détenir.",
    example: "Les intermédiaires régulés dans l'Union européenne doivent afficher leur pourcentage de clients perdants : lisez-le.",
    caution: "Instrument inadapté à un débutant.",
    related: ['effet-de-levier', 'appel-de-marge'],
  },
  {
    slug: 'biais-de-confirmation',
    term: 'Biais de confirmation',
    category: 'risque',
    definition:
      "Tendance à rechercher et juger crédibles les informations confortant ce que l'on croit déjà, et à écarter les autres. Il concerne tout le monde.",
    example: "Après un achat, on suit les forums favorables à l'actif et l'on attribue les critiques à l'ignorance de leurs auteurs.",
    caution: "Le remède est un protocole écrit avant la décision, pas la bonne volonté.",
    related: ['condition-d-invalidation', 'effet-de-dotation'],
  },
  {
    slug: 'aversion-a-la-perte',
    term: 'Aversion à la perte',
    category: 'risque',
    definition:
      "Une perte est ressentie environ deux fois plus intensément qu'un gain d'ampleur équivalente (Kahneman et Tversky, 1979).",
    example: "Reconnaître une erreur coûte psychologiquement plus cher que de continuer à espérer un retournement.",
    related: ['capitulation', 'biais-de-confirmation'],
  },
  {
    slug: 'effet-de-dotation',
    term: 'Effet de dotation',
    category: 'risque',
    definition: "Le simple fait de posséder un actif augmente la valeur qu'on lui attribue.",
    example: "On ne juge plus le même actif de la même façon avant et après l'avoir acheté.",
    related: ['biais-de-confirmation'],
  },
  {
    slug: 'fomo',
    term: 'FOMO (peur de rater)',
    category: 'risque',
    definition:
      "Impulsion d'achat déclenchée par une forte hausse récente et par le sentiment d'être le seul à ne pas participer.",
    example:
      "Signaux : précipitation, consultation compulsive des cours, taille de position revue à la hausse « parce que c'est évident cette fois ».",
    caution: "Garde-fou simple : 48 heures de délai entre l'envie et l'ordre.",
    related: ['capitulation', 'preuve-sociale'],
  },
  {
    slug: 'capitulation',
    term: 'Capitulation',
    category: 'risque',
    definition:
      "Vente effectuée après une baisse prolongée, motivée par l'épuisement émotionnel plutôt que par la thèse d'investissement.",
    example: "La vente procure un soulagement immédiat, souvent confondu avec une bonne décision.",
    related: ['fomo', 'aversion-a-la-perte'],
  },
  {
    slug: 'preuve-sociale',
    term: 'Preuve sociale',
    category: 'risque',
    definition:
      "Tendance à considérer qu'une chose est valable parce que beaucoup d'autres le font. En investissement, elle opère de façon asymétrique.",
    example: "On entend les gains des autres, presque jamais leurs pertes : personne ne publie sa capitulation.",
    related: ['fomo', 'biais-du-survivant'],
  },
  {
    slug: 'biais-du-survivant',
    term: 'Biais du survivant',
    category: 'risque',
    definition:
      "Erreur consistant à ne juger que sur les cas ayant réussi, les échecs ayant disparu du champ d'observation.",
    example:
      "Les jetons dont on entend parler sont les rares survivants ; les dizaines de milliers de jetons morts n'apparaissent nulle part.",
    related: ['altcoin', 'preuve-sociale'],
  },
  {
    slug: 'condition-d-invalidation',
    term: 'Condition d’invalidation',
    category: 'risque',
    definition:
      "Événement précis, écrit avant l'achat, dont la survenue signifierait que la thèse d'investissement était fausse.",
    example: "« Si le chiffre d'affaires baisse deux trimestres de suite, ma thèse est invalidée. »",
    caution: "Une thèse qu'aucun événement ne pourrait invalider est une croyance, pas une thèse.",
    related: ['these-d-investissement', 'biais-de-confirmation'],
  },
  {
    slug: 'these-d-investissement',
    term: 'Thèse d’investissement',
    category: 'risque',
    definition:
      "Raisonnement écrit expliquant pourquoi on engage de l'argent sur un actif, avec un horizon et une condition d'invalidation.",
    example: "Le journal de décisions exige cette thèse avant tout ordre, afin de pouvoir se relire ensuite.",
    related: ['condition-d-invalidation', 'horizon-de-placement'],
  },
  {
    slug: 'moyenner-a-la-baisse',
    term: 'Moyenner à la baisse',
    category: 'risque',
    definition:
      "Racheter un actif dont le prix a chuté pour abaisser son prix moyen d'achat.",
    example: "Défendable si le renforcement était prévu et chiffré d'avance ; dangereux quand il est improvisé pour soulager une perte latente.",
    related: ['taille-de-position', 'aversion-a-la-perte'],
  },

  // ======================= FISCALITÉ =====================================
  {
    slug: 'pfu',
    term: 'Prélèvement forfaitaire unique (PFU, « flat tax »)',
    category: 'fiscalite',
    definition:
      "Imposition forfaitaire des revenus et plus-values de placements financiers, au taux global de 30 % (12,8 % d'impôt sur le revenu et 17,2 % de prélèvements sociaux).",
    example: "1 000 € de plus-value en compte-titres donnent environ 300 € de prélèvements au titre du PFU.",
    caution:
      "Une option globale pour le barème progressif existe et peut être plus favorable selon la situation. La réglementation évolue : vérifiez sur impots.gouv.fr.",
    related: ['compte-titres', 'plus-value', 'bareme-progressif'],
  },
  {
    slug: 'bareme-progressif',
    term: 'Option pour le barème progressif',
    category: 'fiscalite',
    definition:
      "Possibilité de renoncer au PFU pour soumettre ses revenus de placements au barème progressif de l'impôt sur le revenu. L'option est globale et annuelle.",
    example: "Un foyer non imposable peut y trouver un avantage ; un foyer fortement imposé, généralement non.",
    caution: "L'option s'applique à l'ensemble des revenus concernés de l'année, pas à un placement isolé.",
    related: ['pfu'],
  },
  {
    slug: 'prelevements-sociaux',
    term: 'Prélèvements sociaux',
    category: 'fiscalite',
    definition:
      "Contributions sociales (CSG, CRDS et prélèvement de solidarité) au taux global de 17,2 %, dues sur les revenus du patrimoine.",
    example: "Sur un PEA de plus de cinq ans, les gains restent soumis aux prélèvements sociaux même lorsqu'ils échappent à l'impôt sur le revenu.",
    related: ['pfu', 'pea'],
  },
  {
    slug: 'imposition-actifs-numeriques',
    term: 'Imposition des plus-values sur actifs numériques',
    category: 'fiscalite',
    definition:
      "En France, les plus-values de cession d'actifs numériques réalisées par un particulier à titre occasionnel relèvent d'un régime spécifique, au taux global de 30 %, avec une option possible pour le barème progressif.",
    example:
      "Un échange crypto contre crypto n'est en principe pas imposable ; la cession contre une monnaie officielle ou l'achat d'un bien l'est.",
    caution:
      "Il existe une obligation de déclarer les comptes d'actifs numériques détenus à l'étranger. Les règles évoluent : vérifiez impérativement sur impots.gouv.fr.",
    related: ['pfu', 'plus-value'],
  },
  {
    slug: 'abattement-pea',
    term: 'Régime fiscal du PEA après 5 ans',
    category: 'fiscalite',
    definition:
      "Après cinq ans de détention, les gains retirés d'un PEA sont exonérés d'impôt sur le revenu, mais restent soumis aux prélèvements sociaux.",
    example: "Un retrait effectué la sixième année ne clôture pas le plan et bénéficie de ce régime.",
    caution: "Vérifiez les modalités en vigueur sur service-public.fr avant toute opération.",
    related: ['pea', 'prelevements-sociaux'],
  },
  {
    slug: 'imprime-fiscal-unique',
    term: 'Imprimé fiscal unique (IFU)',
    category: 'fiscalite',
    definition:
      "Document que l'intermédiaire financier adresse chaque année, récapitulant les revenus et plus-values à déclarer.",
    example: "Il facilite la déclaration mais n'exonère pas de vérifier les montants reportés.",
    related: ['pfu'],
  },
  {
    slug: 'report-des-moins-values',
    term: 'Report des moins-values',
    category: 'fiscalite',
    definition:
      "Les moins-values de cession de valeurs mobilières s'imputent sur les plus-values de même nature de l'année, puis sont reportables sur les années suivantes dans la limite prévue par la loi.",
    example: "Une moins-value non utilisée une année peut réduire l'imposition d'une plus-value ultérieure.",
    caution: "Les durées et modalités de report sont fixées par la loi et peuvent changer : vérifiez sur impots.gouv.fr.",
    related: ['plus-value', 'pfu'],
  },

  // ======================= ARNAQUES ======================================
  {
    slug: 'rendement-garanti',
    term: 'Promesse de rendement garanti',
    category: 'arnaques',
    definition:
      "Argument commercial affirmant un rendement élevé sans risque, ce qui est impossible : la concurrence des capitaux professionnels éliminerait immédiatement une telle occasion.",
    example: "Alerte immédiate au-delà de 10 % par an « sans risque », et pour tout rendement exprimé par jour, par semaine ou par mois.",
    related: ['ponzi', 'taux-sans-risque'],
  },
  {
    slug: 'ponzi',
    term: 'Schéma de Ponzi',
    category: 'arnaques',
    definition:
      "Montage sans activité rentable, où les retraits des premiers investisseurs sont payés avec les versements des suivants.",
    example:
      "Marqueurs : régularité anormale des rendements (un actif réel ne rapporte jamais exactement 1,8 % chaque mois) et retraits qui se bloquent progressivement.",
    caution: "L'affaire Madoff a duré des décennies, portait sur environ 65 milliards de dollars et a piégé des professionnels.",
    related: ['systeme-pyramidal', 'rendement-garanti'],
  },
  {
    slug: 'systeme-pyramidal',
    term: 'Système pyramidal',
    category: 'arnaques',
    definition:
      "Montage où la rémunération provient du recrutement de nouveaux participants et non de clients extérieurs. Interdit en France (vente à la boule de neige).",
    example: "Le test : d'où vient l'argent que je gagne — de clients extérieurs, ou de l'entrée de nouveaux participants ?",
    caution: "La croissance exponentielle rend l'épuisement du vivier certain : la majorité perd par construction.",
    related: ['ponzi'],
  },
  {
    slug: 'pump-and-dump',
    term: 'Pump and dump',
    category: 'arnaques',
    definition:
      "Manipulation en quatre temps : accumulation discrète sur un actif peu liquide, promotion coordonnée, hausse auto-entretenue, puis vente massive des organisateurs.",
    example:
      "Signaux : volume quasi nul avant la hausse, plusieurs comptes publiant le même message au même moment, détention très concentrée.",
    caution: "Les pertes constatées sont couramment de 90 à 99 %, sans rétablissement.",
    related: ['memecoin', 'wash-trading', 'rug-pull'],
  },
  {
    slug: 'rug-pull',
    term: 'Rug pull',
    category: 'arnaques',
    definition:
      "Les créateurs d'un projet retirent la liquidité ou activent une fonction cachée du contrat, rendant le jeton invendable instantanément.",
    example: "Un contrat peut contenir une fonction permettant de créer des jetons à volonté ou d'interdire la vente à tous sauf aux créateurs.",
    related: ['pump-and-dump', 'smart-contract'],
  },
  {
    slug: 'wash-trading',
    term: 'Wash trading',
    category: 'arnaques',
    definition:
      "Transactions fictives entre comptes contrôlés par une même personne, destinées à gonfler artificiellement le volume affiché.",
    example: "Un volume élevé donne l'illusion d'un intérêt réel et attire des acheteurs.",
    related: ['pump-and-dump', 'liquidite'],
  },
  {
    slug: 'hameconnage',
    term: 'Hameçonnage (phishing)',
    category: 'arnaques',
    definition:
      "Technique consistant à imiter un site ou un message légitime pour obtenir des identifiants, un code ou une phrase de récupération.",
    example: "Un faux site de portefeuille affiche un champ « restaurez votre portefeuille » où la victime saisit elle-même sa phrase.",
    caution: "Ne jamais cliquer sur un lien reçu : saisir l'adresse soi-même ou utiliser un favori enregistré.",
    related: ['faux-support', 'phrase-de-recuperation'],
  },
  {
    slug: 'faux-support',
    term: 'Faux support technique',
    category: 'arnaques',
    definition:
      "Escroc se présentant comme le service d'assistance d'une application ou d'une banque, qui propose de résoudre un problème et demande un secret.",
    example: "« Communiquez votre phrase de récupération pour que nous vérifiions le solde » : cette demande identifie un escroc, sans exception.",
    related: ['hameconnage', 'phrase-de-recuperation'],
  },
  {
    slug: 'pig-butchering',
    term: 'Pig butchering',
    category: 'arnaques',
    definition:
      "Fraude industrialisée mêlant relation de confiance prolongée et fausse plateforme d'investissement affichant des gains fictifs.",
    example:
      "De petits retraits initiaux fonctionnent pour installer la confiance, puis des « frais » ou une « taxe » sont exigés pour le retrait final.",
    related: ['arnaque-sentimentale', 'arnaque-a-la-recuperation'],
  },
  {
    slug: 'arnaque-sentimentale',
    term: 'Arnaque sentimentale (romance scam)',
    category: 'arnaques',
    definition:
      "Relation nouée en ligne pendant des semaines ou des mois, sans rencontre physique, débouchant sur une proposition d'investissement.",
    example: "La plateforme proposée est contrôlée par l'escroc et affiche des gains qui n'existent pas.",
    related: ['pig-butchering'],
  },
  {
    slug: 'arnaque-a-la-recuperation',
    term: 'Arnaque à la récupération de fonds',
    category: 'arnaques',
    definition:
      "Après une première fraude, une société propose de récupérer les fonds contre une avance de frais. Il s'agit d'une seconde fraude.",
    example: "Les listes de victimes se revendent : c'est souvent le même réseau qui revient.",
    caution: "Aucune démarche légitime de récupération n'exige une avance de frais.",
    related: ['ponzi', 'pig-butchering'],
  },
  {
    slug: 'usurpation-d-identite',
    term: 'Usurpation d’établissement',
    category: 'arnaques',
    definition:
      "Utilisation du nom, du logo et des documents d'une banque ou d'un assureur connu pour crédibiliser une offre frauduleuse.",
    example: "Signal décisif : l'IBAN de destination ne correspond pas à l'établissement annoncé, ou est domicilié dans un pays sans lien avec lui.",
    caution: "Un nom de domaine différant d'une lettre ou d'un tiret est un marqueur classique.",
    related: ['hameconnage', 'liste-noire-amf'],
  },
  {
    slug: 'compte-securise',
    term: 'Le « compte sécurisé »',
    category: 'arnaques',
    definition:
      "Formule employée par un faux conseiller bancaire pour obtenir un virement volontaire de la victime. Ce type de compte n'existe pas.",
    example: "Aucune banque ne demande jamais de déplacer des fonds ni de communiquer un code reçu par SMS.",
    related: ['usurpation-d-identite', 'faux-support'],
  },
  {
    slug: 'liste-noire-amf',
    term: 'Liste noire de l’AMF',
    category: 'arnaques',
    definition:
      "Liste publique des acteurs non autorisés à proposer des placements en France, tenue par l'Autorité des marchés financiers.",
    example: "Sa consultation est gratuite et prend deux minutes, avant tout versement.",
    related: ['amf', 'regafi'],
  },
  {
    slug: 'amf',
    term: 'AMF (Autorité des marchés financiers)',
    category: 'arnaques',
    definition:
      "Autorité publique française chargée de la protection de l'épargne, de l'information des investisseurs et du bon fonctionnement des marchés.",
    example: "Le service Épargne info service répond aux questions des particuliers.",
    related: ['liste-noire-amf', 'mica'],
  },
  {
    slug: 'regafi',
    term: 'Regafi et Orias',
    category: 'arnaques',
    definition:
      "Registres publics français : Regafi pour les établissements financiers agréés, Orias pour les intermédiaires (courtiers, conseillers en investissements financiers).",
    example: "Une entreprise absente de ces registres et proposant des placements en France agit illégalement.",
    related: ['liste-noire-amf', 'amf'],
  },
  {
    slug: 'signaux-d-alerte',
    term: 'Signaux d’alerte (checklist)',
    category: 'arnaques',
    definition:
      "Ensemble d'indices vérifiables signalant une probable fraude : promesse garantie, urgence, contact non sollicité, absence d'auteur identifiable, retraits bloqués.",
    example:
      "Trois questions suffisent souvent : d'où vient l'argent, qui est responsable et où est-il enregistré, pourquoi moi et pourquoi maintenant.",
    related: ['rendement-garanti', 'liste-noire-amf'],
  },
];
