/**
 * Fiche fiscale francaise.
 *
 * Contenu strictement informatif et volontairement limite aux MECANISMES.
 * Aucune optimisation, aucune strategie, aucun conseil personnalise. Chaque
 * section renvoie a la source officielle qui fait foi, et rappelle que la
 * reglementation evolue.
 */

export interface SectionFiscale {
  slug: string;
  titre: string;
  resume: string;
  /** Corps en markdown leger, meme rendu que les lecons. */
  corps: string;
  pointsCles: string[];
  sources: { label: string; url: string }[];
}

export const AVERTISSEMENT_FISCAL =
  "Cette fiche décrit des mécanismes généraux du droit fiscal français à titre informatif. Les taux, plafonds, seuils et conditions évoluent à chaque loi de finances, et votre situation personnelle peut modifier entièrement le résultat. Vérifiez systématiquement l'état du droit en vigueur sur impots.gouv.fr et service-public.fr, et rapprochez-vous d'un professionnel habilité pour toute décision. Cette application ne délivre aucun conseil fiscal personnalisé.";

export const sectionsFiscales: SectionFiscale[] = [
  {
    slug: 'principe-general',
    titre: 'Le principe général : ce qui déclenche l’imposition',
    resume:
      "Quand un gain devient imposable, la différence entre plus-value latente et plus-value réalisée, et le rôle de l'enveloppe.",
    corps: `## Le fait générateur

En matière de valeurs mobilières, l'imposition ne se déclenche pas parce que la valeur d'un placement a augmenté. Elle se déclenche lors d'un **événement précis**, appelé fait générateur : le plus souvent la **cession**, c'est-à-dire la vente, et le **versement d'un revenu** comme un dividende ou un coupon.

D'où une distinction essentielle :

- Une **plus-value latente** est le gain constaté sur une position que vous détenez encore. Elle n'est ni encaissée ni imposée.
- Une **plus-value réalisée** est le gain constaté au moment de la vente. C'est elle qui entre dans le champ de l'impôt.

Le portefeuille d'entraînement de cette application affiche les deux séparément, précisément parce qu'elles ne se comportent pas de la même façon.

## Trois éléments déterminent le traitement

1. **L'enveloppe** dans laquelle le titre est détenu : compte-titres ordinaire, PEA, assurance-vie, plan d'épargne salariale. Chaque enveloppe a ses propres règles.
2. **La nature du revenu** : plus-value de cession, dividende, coupon d'obligation, intérêts.
3. **La nature de l'actif** : valeur mobilière classique, actif numérique, immobilier. Les actifs numériques relèvent d'un régime distinct, décrit plus loin.

## Ce que cette fiche ne fait pas

Elle n'indique pas quelle enveloppe choisir, ne compare pas les régimes pour vous et ne propose aucune stratégie d'optimisation. Elle décrit les mécanismes pour que vous puissiez lire une documentation officielle sans être perdu, poser les bonnes questions et vérifier vous-même.

## Une règle de méthode

La fiscalité ne devrait jamais être la raison principale d'une décision d'investissement. Un placement médiocre reste médiocre après optimisation fiscale, et l'avantage fiscal d'une enveloppe peut être entièrement absorbé par les frais de l'intermédiaire, comme le montrait la leçon du niveau 1 sur l'impact des frais.`,
    pointsCles: [
      "L'imposition se déclenche à la cession ou au versement d'un revenu, pas sur une hausse latente.",
      'Plus-value latente : ni encaissée ni imposée. Plus-value réalisée : dans le champ de l’impôt.',
      'Trois déterminants : l’enveloppe, la nature du revenu, la nature de l’actif.',
      'La fiscalité ne devrait pas être la raison principale d’une décision d’investissement.',
    ],
    sources: [
      {
        label: 'impots.gouv.fr — Revenus de capitaux mobiliers et plus-values',
        url: 'https://www.impots.gouv.fr/particulier/questions/comment-sont-imposees-les-plus-values-de-cession-de-valeurs-mobilieres',
      },
      {
        label: 'service-public.fr — Impôt sur les revenus de placements',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F31237',
      },
    ],
  },
  {
    slug: 'pfu',
    titre: 'Le prélèvement forfaitaire unique (PFU, « flat tax »)',
    resume:
      "Le régime de droit commun des revenus de placements : composition du taux de 30 % et option pour le barème progressif.",
    corps: `## Composition du taux

Le prélèvement forfaitaire unique, souvent appelé « flat tax », s'applique par défaut aux revenus et plus-values de placements financiers perçus par les particuliers. Son taux global est de **30 %**, décomposé en :

- **12,8 %** au titre de l'impôt sur le revenu ;
- **17,2 %** au titre des prélèvements sociaux (CSG, CRDS et prélèvement de solidarité).

Sur 1 000 € de plus-value réalisée en compte-titres ordinaire, cela représente environ 300 € de prélèvements, soit 128 € d'impôt sur le revenu et 172 € de prélèvements sociaux.

## Ce qui est concerné

Le PFU s'applique notamment aux plus-values de cession de valeurs mobilières, aux dividendes, aux intérêts et aux revenus de placements à revenu fixe. Il ne s'applique pas de la même manière à toutes les enveloppes : le PEA et l'assurance-vie ont leurs propres règles, décrites plus loin.

## L'option pour le barème progressif

Il est possible de **renoncer au PFU** et de soumettre ces revenus au barème progressif de l'impôt sur le revenu. Trois caractéristiques importantes :

1. L'option est **globale** : elle s'applique à l'ensemble des revenus concernés de l'année, pas à un placement isolé.
2. Elle est **annuelle** et se formule lors de la déclaration de revenus.
3. Les prélèvements sociaux de 17,2 % restent dus dans les deux cas.

Le barème progressif peut être plus favorable pour un foyer faiblement imposé, et défavorable pour un foyer situé dans une tranche élevée. Certains abattements peuvent également s'appliquer selon la nature du revenu et la date d'acquisition des titres. Le calcul dépend entièrement de votre situation : c'est typiquement le point à faire vérifier.

## Un prélèvement à la source qui n'est pas l'impôt définitif

Pour les dividendes et intérêts, l'établissement payeur prélève généralement un acompte au moment du versement. Cet acompte s'impute ensuite sur l'impôt réellement dû, calculé lors de la déclaration. Le montant prélevé au fil de l'eau n'est donc pas nécessairement le montant final.

## Rappel

Ces taux et modalités sont ceux en vigueur à la date de rédaction de cette fiche. Ils sont modifiables par toute loi de finances. Vérifiez sur impots.gouv.fr avant toute démarche.`,
    pointsCles: [
      'PFU = 30 % au total : 12,8 % d’impôt sur le revenu + 17,2 % de prélèvements sociaux.',
      'Applicable par défaut aux plus-values, dividendes et intérêts des particuliers.',
      'L’option pour le barème progressif est globale et annuelle ; les 17,2 % restent dus.',
      'L’acompte prélevé à la source n’est pas l’impôt définitif.',
    ],
    sources: [
      {
        label: 'impots.gouv.fr — Prélèvement forfaitaire unique',
        url: 'https://www.impots.gouv.fr/particulier/questions/jai-percu-des-revenus-de-capitaux-mobiliers-comment-sont-ils-imposes',
      },
      {
        label: 'service-public.fr — Imposition des revenus de placements financiers',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F31237',
      },
    ],
  },
  {
    slug: 'compte-titres',
    titre: 'Le compte-titres ordinaire (CTO)',
    resume:
      "L'enveloppe la plus large et la plus simple fiscalement : imposition à chaque cession, et mécanisme d'imputation des moins-values.",
    corps: `## Fonctionnement

Le compte-titres ordinaire n'a ni plafond de versement, ni contrainte de durée, ni restriction géographique. Il donne accès aux actions du monde entier, aux obligations, aux ETF sans contrainte d'éligibilité, et selon les courtiers à des produits plus complexes.

Sa contrepartie est fiscale : il ne bénéficie d'aucun régime de faveur. Chaque cession dégageant un gain est imposable au titre de l'année de réalisation, selon le régime de droit commun décrit à la section précédente.

## Le calcul de la plus-value

La plus-value imposable est la différence entre le prix de cession et le prix d'acquisition. En cas d'achats successifs d'un même titre, le prix d'acquisition retenu est en principe le **prix moyen pondéré** d'acquisition, et non le prix du premier lot acheté.

Les frais d'acquisition et de cession supportés viennent en principe en diminution de la plus-value. Le portefeuille d'entraînement de cette application calcule d'ailleurs le prix moyen frais compris, ce qui correspond à cette logique.

## L'imputation des moins-values

Les moins-values de cession de valeurs mobilières s'imputent sur les plus-values **de même nature** réalisées la même année. Si un solde négatif subsiste, il est reportable sur les années suivantes dans la limite de durée fixée par la loi.

Deux conséquences pratiques :

- Une moins-value n'est utile fiscalement que si elle est **réalisée**, donc si la position a été vendue. Une perte latente ne s'impute pas.
- Le report suppose que les moins-values aient été **déclarées** l'année de leur réalisation, même en l'absence de plus-value à compenser. Une moins-value non déclarée est en pratique perdue.

Attention : ce mécanisme ne doit pas devenir une raison de vendre. Vendre une position uniquement pour matérialiser une perte fiscale est une décision de marché déguisée en décision fiscale, et cette application ne suggère aucune opération.

## L'imprimé fiscal unique

Chaque année, votre intermédiaire vous adresse un **imprimé fiscal unique** (IFU) récapitulant les revenus et plus-values à déclarer. Il facilite la déclaration mais ne vous dispense pas de vérifier les montants, notamment si vous détenez des comptes chez plusieurs intermédiaires ou à l'étranger.

## Comptes détenus à l'étranger

La détention d'un compte ouvert hors de France s'accompagne d'obligations déclaratives spécifiques, indépendantes de l'existence d'un gain. Le point est traité dans la section consacrée aux obligations déclaratives.`,
    pointsCles: [
      'Aucun plafond, aucune durée minimale, univers mondial, mais aucun régime de faveur.',
      'Plus-value = prix de cession − prix moyen pondéré d’acquisition, frais déductibles.',
      'Les moins-values s’imputent sur les plus-values de même nature, puis sont reportables.',
      'Une moins-value doit être réalisée ET déclarée pour être utilisable.',
      'L’IFU récapitule les montants, sans dispenser de les vérifier.',
    ],
    sources: [
      {
        label: 'impots.gouv.fr — Plus-values de cession de valeurs mobilières',
        url: 'https://www.impots.gouv.fr/particulier/questions/comment-sont-imposees-les-plus-values-de-cession-de-valeurs-mobilieres',
      },
      {
        label: 'service-public.fr — Compte-titres',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F22381',
      },
    ],
  },
  {
    slug: 'pea',
    titre: 'Le plan d’épargne en actions (PEA)',
    resume:
      "Univers restreint, plafond de versements et contrainte de durée, en échange d'un régime fiscal spécifique après cinq ans.",
    corps: `## Ce que le PEA autorise

Le PEA est réservé aux **actions d'entreprises ayant leur siège dans l'Union européenne ou l'Espace économique européen**, ainsi qu'aux fonds et ETF respectant un quota d'actifs européens. C'est la raison pour laquelle certains ETF à réplication synthétique existent : ils permettent de suivre un indice non européen tout en restant éligibles, au prix d'un risque de contrepartie décrit au niveau 2 du parcours.

Ne sont **pas** éligibles : les crypto-actifs sous quelque forme que ce soit, les obligations en direct, et les actions hors périmètre européen détenues en direct.

## Plafond et unicité

Le PEA classique est plafonné à **150 000 €** de versements, hors gains. Une personne ne peut détenir qu'un seul PEA, et un foyer fiscal deux au maximum. Un PEA-PME existe en parallèle, avec son propre plafond et son propre univers.

Le plafond porte sur les **versements**, pas sur la valeur du plan : un PEA alimenté à hauteur du plafond peut valoir davantage sans que cela pose de difficulté.

## La contrainte de durée

C'est le point central du fonctionnement.

- **Avant 5 ans** : un retrait entraîne en principe la **clôture du plan** et la perte de son antériorité fiscale. Quelques cas de sortie anticipée sont prévus par la loi sans entraîner la clôture.
- **Après 5 ans** : les retraits partiels sont possibles sans clôturer le plan, et les gains retirés sont exonérés d'impôt sur le revenu. Les **prélèvements sociaux de 17,2 % restent dus**.

Point souvent ignoré : l'antériorité se compte depuis la **date d'ouverture du plan**, pas depuis le premier versement significatif. C'est une information factuelle sur le fonctionnement du produit, pas une incitation à en ouvrir un.

## À l'intérieur du plan

Les arbitrages effectués à l'intérieur du PEA — vendre un titre pour en acheter un autre — ne déclenchent pas d'imposition tant que les sommes restent dans le plan. L'imposition intervient au retrait.

## Ce qu'il faut vérifier avant de comparer

Un PEA n'est pas mécaniquement plus avantageux qu'un compte-titres. La comparaison dépend de votre taux d'imposition, de votre horizon, de l'univers d'investissement dont vous avez besoin et — souvent décisif — des **frais du courtier** : droits de garde, frais par ordre, frais de transfert. Ces derniers peuvent absorber l'avantage fiscal, comme le montrait la leçon sur l'impact des frais.

Les plafonds, durées et modalités évoluent : vérifiez sur service-public.fr avant toute opération.`,
    pointsCles: [
      'Univers européen uniquement ; aucun crypto-actif n’est éligible.',
      'Plafond de 150 000 € de versements, un seul PEA par personne.',
      'Retrait avant 5 ans : clôture en principe. Après 5 ans : retraits partiels possibles.',
      'Après 5 ans, exonération d’impôt sur le revenu mais prélèvements sociaux dus.',
      'Les arbitrages internes au plan ne déclenchent pas d’imposition.',
      'L’antériorité court depuis la date d’ouverture, pas depuis le premier versement.',
    ],
    sources: [
      {
        label: 'service-public.fr — Plan d’épargne en actions (PEA)',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F22449',
      },
      {
        label: 'impots.gouv.fr — Fiscalité du PEA',
        url: 'https://www.impots.gouv.fr/particulier/questions/jai-un-pea-comment-sont-imposes-les-gains',
      },
    ],
  },
  {
    slug: 'actifs-numeriques',
    titre: 'L’imposition des plus-values sur actifs numériques',
    resume:
      "Le régime propre aux crypto-actifs : ce qui déclenche l'imposition, ce qui ne la déclenche pas, et les obligations déclaratives.",
    corps: `## Un régime distinct

Les crypto-actifs — désignés dans les textes comme **actifs numériques** — ne relèvent pas du régime des valeurs mobilières. Les plus-values réalisées par un particulier **à titre occasionnel** lors de la cession d'actifs numériques relèvent d'un régime spécifique, dont le taux global est de **30 %** (12,8 % d'impôt sur le revenu et 17,2 % de prélèvements sociaux), avec une **option possible pour le barème progressif** de l'impôt sur le revenu.

## Ce qui déclenche l'imposition, et ce qui ne la déclenche pas

C'est le point le plus mal compris, et il a des conséquences pratiques importantes.

- **Échanger un crypto-actif contre un autre crypto-actif** ne constitue en principe pas un fait générateur d'imposition. Le gain reste en sursis tant qu'il demeure dans l'univers des actifs numériques.
- **Céder un actif numérique contre une monnaie ayant cours légal** (euro, dollar) constitue un fait générateur.
- **Utiliser un actif numérique pour acheter un bien ou un service** constitue également une cession imposable.

Autrement dit, payer un achat en crypto-actifs n'est pas neutre fiscalement, même si aucun euro n'a transité par votre compte bancaire.

## Le mode de calcul

Le calcul de la plus-value imposable des actifs numériques repose sur une formule qui rapporte le prix de cession à la **valeur globale du portefeuille d'actifs numériques** au moment de la cession, en tenant compte du **prix total d'acquisition** de l'ensemble du portefeuille. Ce n'est donc pas un calcul ligne à ligne comme pour les actions.

Conséquence très concrète : il faut tenir un **historique complet et daté de toutes les opérations** — achats, ventes, échanges, frais, transferts entre plateformes et portefeuilles. Reconstituer cet historique a posteriori, sur plusieurs plateformes et plusieurs années, est extrêmement pénible. C'est la raison pratique la plus solide pour documenter ses opérations dès le premier jour.

## Activité habituelle et autres cas

Une activité exercée dans des conditions analogues à celles d'un professionnel, ou certaines activités comme le minage, relèvent de régimes différents de celui des cessions occasionnelles. La frontière dépend des circonstances de fait et se vérifie auprès de l'administration.

## Obligations déclaratives

Deux obligations distinctes de l'imposition elle-même :

1. Les **comptes d'actifs numériques ouverts, détenus, utilisés ou clos à l'étranger** doivent être déclarés, indépendamment de tout gain. Cela concerne un grand nombre de plateformes d'échange internationales. Le défaut de déclaration est sanctionné par une amende.
2. Les cessions imposables de l'année doivent être déclarées, avec le détail des opérations, sur les formulaires prévus.

## Rappel appuyé

Ce domaine est celui où la réglementation a le plus évolué ces dernières années, en France comme au niveau européen avec le règlement MiCA et les obligations de transmission d'informations par les prestataires. Les règles décrites ici peuvent avoir changé depuis la rédaction de cette fiche. **Vérifiez impérativement l'état du droit sur impots.gouv.fr avant toute déclaration**, et faites-vous accompagner si votre situation n'est pas simple.`,
    pointsCles: [
      'Régime distinct de celui des valeurs mobilières ; taux global de 30 % pour les cessions occasionnelles.',
      'Crypto contre crypto : en principe pas de fait générateur. Crypto contre euro ou achat d’un bien : imposable.',
      'Le calcul porte sur la valeur globale du portefeuille, pas ligne à ligne.',
      'Tenir un historique complet et daté de toutes les opérations dès le départ.',
      'Les comptes d’actifs numériques détenus à l’étranger doivent être déclarés, même sans gain.',
      'Domaine à forte évolution réglementaire : vérification obligatoire à la source.',
    ],
    sources: [
      {
        label: 'impots.gouv.fr — Actifs numériques : imposition des plus-values',
        url: 'https://www.impots.gouv.fr/particulier/questions/comment-declarer-mes-actifs-numeriques',
      },
      {
        label: 'service-public.fr — Déclaration des comptes d’actifs numériques à l’étranger',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F34452',
      },
      {
        label: 'AMF — Crypto-actifs et réglementation MiCA',
        url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/crypto-actifs',
      },
    ],
  },
  {
    slug: 'obligations-declaratives',
    titre: 'Obligations déclaratives et points de vigilance',
    resume:
      "Ce qui doit être déclaré indépendamment de tout gain, et les erreurs qui coûtent cher.",
    corps: `## Déclarer n'est pas payer

Plusieurs obligations déclaratives existent **indépendamment de l'existence d'un gain**. Ne pas les respecter expose à des sanctions même lorsque aucun impôt n'était dû.

Les principales pour un particulier investisseur :

- **Comptes ouverts, détenus, utilisés ou clos à l'étranger**, qu'il s'agisse de comptes bancaires, de comptes-titres ou de comptes d'actifs numériques. La déclaration se fait chaque année, compte par compte.
- **Moins-values de l'année**, à déclarer même en l'absence de plus-value à compenser, faute de quoi le report ultérieur est en pratique perdu.
- **Cessions d'actifs numériques**, avec le détail des opérations imposables.

## Les erreurs fréquentes

1. **Croire qu'un courtier étranger déclare pour vous.** Un intermédiaire établi hors de France n'adresse pas d'imprimé fiscal unique à l'administration française. Le calcul et la déclaration vous incombent entièrement.
2. **Oublier les échanges crypto contre crypto dans l'historique.** Même lorsqu'ils ne sont pas imposables, ils modifient le prix total d'acquisition du portefeuille et sont donc nécessaires au calcul ultérieur.
3. **Ne pas conserver les justificatifs.** Relevés, historiques d'ordres, exports de plateformes : une plateforme peut fermer, comme l'ont montré plusieurs faillites, et l'historique disparaît avec elle. Exportez régulièrement.
4. **Confondre l'acompte prélevé et l'impôt définitif** sur les dividendes et intérêts.
5. **Prendre une décision d'investissement pour des raisons fiscales.** Vendre pour matérialiser une moins-value, ou conserver une position uniquement pour atteindre une durée, revient à laisser la fiscalité décider à la place de la thèse d'investissement.

## Où vérifier, et auprès de qui

- **impots.gouv.fr** : source officielle sur les régimes, les taux et les formulaires. La messagerie sécurisée de votre espace particulier permet de poser une question écrite à l'administration.
- **service-public.fr** : présentation des dispositifs et de leurs conditions.
- **Votre centre des finances publiques** pour une question portant sur votre situation.
- **Un professionnel habilité** (expert-comptable, avocat fiscaliste, conseiller en gestion de patrimoine enregistré) pour un accompagnement personnalisé. Vérifiez son enregistrement sur le registre **Orias** avant de vous engager, comme le rappelle le niveau 5 du parcours.

## Ce que cette application ne fera jamais

Elle ne calcule pas votre impôt, ne remplit aucune déclaration, ne recommande aucune enveloppe et ne propose aucune stratégie d'optimisation. Elle vous donne le vocabulaire et les mécanismes pour lire une source officielle et poser une question précise. C'est délibéré : une erreur fiscale se paye, et le seul interlocuteur qui fait foi est l'administration.`,
    pointsCles: [
      'Certaines déclarations sont dues même sans aucun gain, notamment les comptes détenus à l’étranger.',
      'Une moins-value non déclarée l’année de sa réalisation est en pratique perdue.',
      'Un courtier étranger ne déclare pas pour vous : le calcul vous incombe.',
      'Exportez et conservez vos historiques : une plateforme peut disparaître.',
      'Ne laissez pas la fiscalité décider à la place de la thèse d’investissement.',
      'Sources qui font foi : impots.gouv.fr, service-public.fr, et un professionnel habilité.',
    ],
    sources: [
      {
        label: 'impots.gouv.fr — Déclarer ses comptes à l’étranger',
        url: 'https://www.impots.gouv.fr/particulier/questions/comment-declarer-un-compte-bancaire-ouvert-letranger',
      },
      {
        label: 'service-public.fr — Déclaration de revenus',
        url: 'https://www.service-public.fr/particuliers/vosdroits/N247',
      },
      { label: 'Orias — Registre des intermédiaires', url: 'https://www.orias.fr/' },
    ],
  },
];
