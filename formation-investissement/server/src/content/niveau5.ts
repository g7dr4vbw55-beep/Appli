import type { LevelSeed } from './types.js';

export const niveau5: LevelSeed = {
  slug: 'arnaques-pieges',
  title: 'Arnaques et pièges',
  subtitle: 'Reconnaître les mécanismes de fraude et les signaux d’alerte concrets',
  intro:
    "Les fraudes financières ne visent pas les naïfs : elles visent les gens pressés, isolés ou flattés. Elles reposent sur un petit nombre de mécanismes réutilisés depuis un siècle, avec un habillage modernisé. Ce niveau décrit ces mécanismes, puis fournit une liste de signaux d'alerte vérifiables et les réflexes de vérification officiels en France.",
  lessons: [
    {
      slug: 'rendement-garanti',
      title: 'La promesse de rendement garanti : l’impossibilité arithmétique',
      summary:
        "Pourquoi un rendement élevé et garanti ne peut pas exister, et les habillages sous lesquels cette promesse se présente.",
      body: `## Le raisonnement qui suffit

Un rendement élevé et garanti ne peut pas exister durablement, pour une raison de concurrence. Si un tel placement existait, les investisseurs professionnels, les fonds de pension et les banques y placeraient des milliards en quelques heures. L'afflux ferait monter son prix, donc baisser son rendement futur, jusqu'à l'aligner sur les taux sans risque.

Vous n'avez donc pas besoin d'expertise financière pour trancher : si l'occasion était réelle, elle ne serait pas disponible pour vous par message privé.

## Le repère de comparaison

Le taux « sans risque » de référence est le rendement des emprunts d'État de bonne qualité, ou celui des livrets réglementés. Toute promesse **très supérieure** à ce repère, tout en se présentant comme garantie, contient nécessairement l'un des trois éléments suivants : un risque caché, un mensonge, ou une fraude.

En pratique, les seuils qui doivent alerter immédiatement : plus de 10 % par an « sans risque », ou tout rendement exprimé en pourcentage **par mois**, **par semaine** ou **par jour**. Un rendement mensuel de 5 % correspond à environ 80 % par an, un niveau qu'aucune institution au monde ne délivre de façon régulière.

## Les habillages fréquents

- **Le robot de trading ou l'algorithme d'intelligence artificielle** : « notre IA génère 3 % par mois ». Aucune vérification n'est possible, l'historique est fourni par le vendeur lui-même.
- **Le minage ou le *staking* à rendement fixe élevé** : les rendements réels de validation sont variables et modestes ; un taux fixe élevé sur des crypto-actifs signale que l'argent des nouveaux paye les anciens.
- **L'investissement dans des biens concrets** (containers, places de parking, énergie verte, cheptel, grands crus, diamants) avec loyer garanti et revente assurée. L'actif tangible rassure et détourne l'attention du fait que la garantie repose sur la seule solvabilité de l'intermédiaire.
- **Le faux produit d'une marque connue** : usurpation du nom d'une banque ou d'un assureur réputé, avec documents et site imités.
- **Le placement « réservé »** : accès privilégié, quota limité, cercle fermé. La rareté est fabriquée pour empêcher la réflexion.

## Le schéma de Ponzi

C'est le mécanisme sous-jacent de la plupart de ces montages. Il n'existe aucune activité rentable : les retraits des premiers investisseurs sont payés avec les versements des suivants. Tant que les entrées dépassent les sorties, tout fonctionne, les relevés sont beaux et les premiers clients témoignent sincèrement de leur satisfaction — ce qui en fait les meilleurs recruteurs.

L'effondrement est inévitable et instantané. Deux caractéristiques permettent de reconnaître le schéma avant la fin : la **régularité anormale** des rendements affichés (un vrai actif ne rapporte jamais exactement 1,8 % chaque mois), et la **difficulté croissante à retirer** son argent, d'abord justifiée par des motifs techniques, puis par des frais ou une fiscalité à régler d'avance.

L'affaire Madoff, révélée en 2008, a duré des décennies, portait sur environ 65 milliards de dollars et comptait parmi ses victimes des banques et des fonds professionnels. Ce n'est donc pas une question de niveau de compétence.

## Le réflexe de vérification

En France, avant tout versement : vérifier que le prestataire figure sur le registre **Regafi** (établissements financiers) ou **Orias** (intermédiaires), et vérifier qu'il n'est pas sur la **liste noire de l'AMF**. Ces consultations sont gratuites, publiques et prennent deux minutes. Une entreprise absente des registres et proposant des placements en France agit illégalement.`,
      keyPoints: [
        'Un rendement élevé et garanti ne peut pas exister : la concurrence l’éliminerait immédiatement.',
        'Alerte immédiate : plus de 10 % par an « sans risque », ou tout rendement exprimé par mois, semaine ou jour.',
        'Le schéma de Ponzi paye les anciens avec l’argent des nouveaux : régularité anormale et retraits qui se bloquent.',
        'Madoff : environ 65 milliards de dollars, des décennies, des victimes professionnelles.',
        'Vérifier Regafi, Orias et la liste noire de l’AMF avant tout versement.',
      ],
      sources: [
        {
          label: 'AMF – Listes noires et mises en garde',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde',
        },
        {
          label: 'Regafi – Registre des agents financiers',
          url: 'https://www.regafi.fr/',
        },
        { label: 'Orias – Registre des intermédiaires', url: 'https://www.orias.fr/' },
      ],
    },
    {
      slug: 'faux-conseillers',
      title: 'Les faux conseillers : usurpation, hameçonnage et arnaque sentimentale',
      summary:
        "Comment un inconnu obtient votre confiance, les scénarios les plus fréquents en France, et le protocole de vérification.",
      body: `## Le point commun

Toutes ces fraudes reposent sur une **relation**, pas sur un produit. L'escroc investit du temps pour obtenir votre confiance, puis la promesse financière n'est plus qu'un prétexte que vous acceptez sans examen.

## Les scénarios les plus documentés en France

**L'usurpation d'identité d'un établissement.** Faux courriel, faux site, faux conseiller d'une banque ou d'un assureur connu. Les documents sont soignés, les numéros de téléphone renvoient vers l'escroc. Signal décisif : le **numéro d'IBAN de destination** ne correspond pas à l'établissement annoncé, ou est domicilié dans un pays sans lien avec lui.

**L'appel du faux conseiller bancaire** (« fraude au président » version particulier). Quelqu'un vous appelle en se présentant comme le service anti-fraude de votre banque, connaît votre nom et vos dernières opérations — souvent obtenus par une fuite de données — et vous demande de valider une opération, de communiquer un code reçu par SMS, ou de transférer vos fonds vers un « compte sécurisé ». Aucune banque ne demande jamais de valider une opération par téléphone ni de déplacer des fonds. **Un compte sécurisé n'existe pas.**

**L'arnaque sentimentale** (*romance scam*). Relation nouée en ligne pendant des semaines ou des mois, jamais de rencontre physique, puis proposition d'investissement « pour construire l'avenir ensemble », souvent en crypto-actifs sur une plateforme contrôlée par l'escroc.

**Le *pig butchering*.** Variante industrialisée : la victime est mise en confiance progressivement, l'interface montre des gains fictifs, de petits retraits initiaux fonctionnent pour installer la confiance, puis les montants augmentent. Au moment du retrait final, des « frais » ou une « taxe » sont exigés — c'est la dernière ponction, jamais la dernière.

**Le faux support technique crypto.** Vu au niveau 3 : on demande la phrase de récupération. Aucun service légitime ne le fait jamais.

**L'arnaque à la récupération.** Après une première fraude, une nouvelle personne vous contacte en promettant de récupérer vos fonds contre une avance. C'est le même réseau qui revient. Les listes de victimes se revendent.

## Les signaux qui ne trompent pas

- Contact non sollicité, par message privé, réseau social, WhatsApp, Telegram ou téléphone.
- Refus d'un échange en agence physique ou en visioconférence non filtrée.
- Insistance sur la confidentialité : « n'en parlez pas à votre conseiller, il voudra vous en dissuader ». Cette phrase est un aveu.
- Demande d'installation d'un logiciel de prise en main à distance.
- Escalade progressive des montants.
- Un premier retrait qui fonctionne, suivi d'une demande de frais pour le suivant.

## Le protocole

1. Ne jamais rappeler le numéro fourni : utiliser celui qui figure au dos de votre carte bancaire ou sur votre contrat.
2. Ne communiquer aucun code reçu par SMS, à personne.
3. Vérifier le prestataire sur Regafi, Orias et la liste noire de l'AMF.
4. Prendre 48 heures et en parler à une personne extérieure. L'isolement est la condition de réussite de ces fraudes : le simple fait d'en parler à quelqu'un les fait échouer dans la majorité des cas.
5. En cas de versement déjà effectué : contacter immédiatement la banque pour tenter un rappel de fonds, déposer plainte, et signaler sur les plateformes officielles.`,
      keyPoints: [
        'Ces fraudes reposent sur une relation de confiance, pas sur un produit.',
        'Aucune banque ne demande de valider une opération par téléphone ni de transférer vers un « compte sécurisé ».',
        'Ne jamais communiquer un code reçu par SMS, à personne.',
        '« N’en parlez à personne » est un aveu, pas une précaution.',
        'Un premier retrait réussi suivi d’une demande de frais est le schéma classique du pig butchering.',
        'L’arnaque à la récupération de fonds est menée par le même réseau.',
      ],
      sources: [
        {
          label: 'Cybermalveillance.gouv.fr – Arnaques et escroqueries',
          url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes',
        },
        {
          label: 'AMF – Épargne info service',
          url: 'https://www.amf-france.org/fr/espace-epargnants/etre-accompagne/amf-epargne-info-service',
        },
        {
          label: 'Signal Conso / Perceval – Signalement de fraude',
          url: 'https://www.service-public.fr/particuliers/vosdroits/R46526',
        },
      ],
    },
    {
      slug: 'pump-and-dump',
      title: 'Pump and dump et manipulation de cours',
      summary:
        "Comment un cours est gonflé artificiellement puis lâché, où cela se produit, et comment reconnaître qu'on est le client final.",
      body: `## Le mécanisme en quatre temps

1. **Accumulation.** Les organisateurs achètent discrètement un actif peu liquide — petite capitalisation boursière, jeton crypto récent, memecoin — à bas prix. Sur un actif peu échangé, quelques milliers d'euros suffisent à constituer une position importante.
2. **Promotion.** Une campagne coordonnée démarre : groupes Telegram ou Discord, comptes influents rémunérés sans mention de leur rémunération, faux articles de presse, faux partenariats annoncés. Le vocabulaire est standardisé : « prochain x100 », « avant l'annonce », « ne ratez pas le train ».
3. **Le *pump*.** Les acheteurs attirés par la hausse font monter le cours, ce qui attire d'autres acheteurs. La hausse est sa propre publicité.
4. **Le *dump*.** Les organisateurs vendent leur position dans la liquidité créée par les nouveaux entrants. Le cours s'effondre en minutes. Les derniers arrivés détiennent un actif sans acheteur.

Le résultat n'est pas une perte de 30 %. Sur les jetons concernés, les pertes constatées sont couramment de 90 à 99 %, sans rétablissement.

## Pourquoi c'est fréquent en crypto

La manipulation de cours est un **délit** sur les marchés d'actions réglementés, surveillé par l'AMF en France et l'ESMA en Europe, avec obligation de déclarer les transactions suspectes. Sur les marchés de crypto-actifs, la surveillance est plus récente et hétérogène : MiCA introduit des obligations en Europe, mais de nombreuses plateformes opèrent hors de ce cadre. Le coût d'organisation d'un *pump and dump* y est faible, et les poursuites rares.

## Les variantes à connaître

- **Le *rug pull*.** Les développeurs d'un projet retirent la liquidité de la place d'échange décentralisée, rendant le jeton invendable instantanément. Ou bien le contrat contient une fonction cachée permettant de créer des jetons à volonté, ou d'interdire la vente à tous sauf à eux.
- **Le *wash trading*.** Des transactions fictives entre comptes contrôlés par la même personne gonflent le volume affiché, pour donner l'illusion d'un intérêt réel.
- **L'*insider* déguisé en analyste.** Une personne détenant déjà l'actif publie une « analyse » enthousiaste sans mentionner sa position. Sa recommandation est un ordre de vente à votre intention.

## Les signaux concrets

- Actif inconnu, apparu récemment, dont le volume d'échange était quasi nul avant la hausse.
- Hausse de plusieurs centaines de pour cent en quelques jours sans information vérifiable.
- Promotion simultanée par plusieurs comptes, avec un vocabulaire et un calendrier identiques.
- Aucune mention de rémunération dans les publications. En France, la loi impose aux influenceurs de mentionner clairement une communication commerciale ; l'absence de mention est une infraction, pas une omission.
- Détention très concentrée : quelques adresses détiennent l'essentiel de l'offre — c'est vérifiable publiquement sur un explorateur de blockchain.
- Compte à rebours, phase de prévente, bonus pour les premiers.

## La question à se poser

Si l'information est diffusée publiquement à des milliers de personnes, ceux qui la diffusent ont déjà acheté. Vous n'êtes pas en train de recevoir une opportunité : vous êtes en train de fournir la liquidité de sortie. C'est la définition même d'être le client final.`,
      keyPoints: [
        'Quatre temps : accumulation discrète, promotion coordonnée, hausse auto-entretenue, vente massive.',
        'Les pertes constatées sont couramment de 90 à 99 %, sans rétablissement.',
        'Variantes : rug pull (retrait de liquidité), wash trading (volume fictif), faux analyste déjà positionné.',
        'Signaux : volume nul avant la hausse, promotion simultanée, détention très concentrée, compte à rebours.',
        'Si l’information est publique et massive, ceux qui la diffusent ont déjà acheté.',
      ],
      sources: [
        {
          label: 'AMF – Abus de marché et manipulation de cours',
          url: 'https://www.amf-france.org/fr/actualites-publications/publications/rapports-etudes-et-analyses',
        },
        {
          label: 'DGCCRF – Influenceurs et obligations de transparence',
          url: 'https://www.economie.gouv.fr/dgccrf',
        },
      ],
    },
    {
      slug: 'systemes-pyramidaux',
      title: 'Systèmes pyramidaux et vente multiniveau financière',
      summary:
        "La différence entre Ponzi et pyramide, le test du recrutement, et le cadre légal français.",
      body: `## Pyramide et Ponzi : la nuance utile

- Dans un **schéma de Ponzi**, un organisateur central collecte les fonds et paye les anciens avec l'argent des nouveaux. Les participants ne recrutent pas nécessairement.
- Dans un **système pyramidal**, la rémunération vient explicitement du **recrutement** : chaque participant gagne sur les versements des personnes qu'il fait entrer, et sur celles que ces personnes font entrer à leur tour.

Les deux partagent la même arithmétique fatale : la rémunération ne provient d'aucune activité économique, seulement de l'argent des entrants. Le nombre de participants nécessaires croît de façon exponentielle. Avec six niveaux à cinq recrues chacun, il faut déjà plus de 15 000 personnes. L'épuisement du vivier est mathématiquement certain, et la grande majorité des participants — ceux des derniers niveaux, qui sont toujours la majorité — perd par construction.

## En France, c'est illégal

Le code de la consommation interdit la vente à la boule de neige et les systèmes de rémunération fondés sur l'espoir de gains liés au recrutement (articles L. 121-15 et suivants). Il ne s'agit pas d'une zone grise : c'est une pratique commerciale interdite, sanctionnée pénalement.

Les organisateurs le savent, d'où l'habillage : formation, coaching, licence logicielle, abonnement à des « signaux de trading », club d'investissement privé, mandat de gestion.

## Le test qui tranche

Une seule question suffit : **d'où vient l'argent que je gagne ?**

- Il vient de la vente d'un produit ou d'un service à des clients qui ne sont pas des participants → activité commerciale, éventuellement médiocre, mais légitime.
- Il vient de l'entrée de nouveaux participants → système pyramidal, illégal, et perdant pour la majorité.

Un test complémentaire : que se passe-t-il si personne ne recrute plus, mais que tout le monde continue à utiliser le produit ? Si les revenus s'effondrent, le produit n'était qu'un prétexte.

## Les marqueurs

- Droit d'entrée, achat de pack ou de formation obligatoire pour participer.
- Rémunération présentée sous forme de niveaux, paliers, rangs, « lignées », arbre de filleuls.
- Aucun client final identifiable en dehors des participants.
- Discours sur la liberté financière, captures d'écran de gains, photos de voitures et de voyages.
- Pression sur l'entourage proche : la famille et les amis constituent le premier vivier, ce qui rend le coût social de l'échec considérable.
- Explication de l'échec par le manque de motivation ou d'état d'esprit, jamais par la structure. C'est le mécanisme qui empêche les participants de comprendre ce qui leur arrive.

## Le cas de la formation au trading

Une variante répandue : les revenus proviennent presque exclusivement de la vente de formations et d'abonnements, pas des marchés. Vérifiez si le vendeur publie des performances réelles auditées par un tiers indépendant — les captures d'écran de comptes de démonstration ne prouvent rien, un compte de démonstration peut afficher n'importe quel résultat. Vérifiez aussi s'il est enregistré comme conseiller en investissements financiers auprès de l'Orias : donner des recommandations personnalisées sans ce statut est illégal en France.`,
      keyPoints: [
        'Ponzi : un organisateur central. Pyramide : la rémunération vient du recrutement.',
        'La croissance exponentielle rend l’épuisement du vivier mathématiquement certain ; la majorité perd par construction.',
        'Interdit en France par le code de la consommation (vente à la boule de neige).',
        'Le test : d’où vient l’argent que je gagne — de clients extérieurs, ou de nouveaux participants ?',
        'Marqueurs : droit d’entrée, paliers de rémunération, aucun client final, pression sur l’entourage.',
        'Formation au trading : exiger des performances auditées par un tiers et vérifier l’enregistrement Orias.',
      ],
      sources: [
        {
          label: 'Code de la consommation – Vente à la boule de neige (art. L. 121-15)',
          url: 'https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565/LEGISCTA000032222573/',
        },
        {
          label: 'DGCCRF – Vente multiniveau et systèmes pyramidaux',
          url: 'https://www.economie.gouv.fr/dgccrf/Publications/Vie-pratique/Fiches-pratiques',
        },
      ],
    },
    {
      slug: 'signaux-d-alerte',
      title: 'La liste de vérification : signaux d’alerte et réflexes',
      summary:
        "Une grille de contrôle utilisable telle quelle avant tout versement, et les recours en cas de fraude subie.",
      body: `## Signaux liés à la promesse

- Rendement garanti, fixe, ou « sans risque ».
- Rendement exprimé par jour, par semaine ou par mois.
- Plus de 10 % par an présenté comme sans risque.
- Régularité anormale des performances passées, sans mois négatif.
- Aucune mention du risque de perte en capital.

## Signaux liés à la pression

- Contact non sollicité (message privé, appel, réseau social, messagerie).
- Urgence : quota limité, prévente qui ferme, compte à rebours.
- « N'en parlez pas à votre banquier ni à votre famille. »
- Escalade des montants, après un premier versement modeste.
- Insistance à installer un logiciel de prise en main à distance.

## Signaux liés à l'identité et à la traçabilité

- Aucun auteur identifiable, ou identité invérifiable.
- Société immatriculée à l'étranger, adresse introuvable, mentions légales absentes.
- Absence des registres officiels : **Regafi**, **Orias**, liste des prestataires de services sur crypto-actifs de l'AMF.
- Présence sur la **liste noire de l'AMF**.
- Nom très proche d'un établissement connu (une lettre, un tiret, une extension de domaine différente).
- IBAN de destination dans un pays sans lien avec l'entité annoncée, ou compte au nom d'un particulier.
- Demande de paiement en crypto-actifs, en cartes prépayées ou par virement vers un compte personnel.

## Signaux liés au produit

- Vous ne pouvez pas expliquer en trois phrases d'où vient le rendement.
- Aucun document réglementaire fourni (document d'informations clés, prospectus, conditions générales).
- Rémunération liée au recrutement d'autres participants.
- Retraits bloqués, ou frais et taxes à payer d'avance pour retirer.
- Interface d'application montrant des gains, mais impossibilité de retirer réellement.

## Les trois questions qui suffisent le plus souvent

1. **D'où vient l'argent ?** Si vous ne pouvez pas répondre précisément, ne versez rien.
2. **Qui est responsable, et où est-il enregistré ?** Un nom, une société, un pays, un numéro d'enregistrement vérifiable.
3. **Pourquoi moi, et pourquoi maintenant ?** Une opportunité réelle n'a pas besoin de vous démarcher, et n'expire pas ce soir.

## Si vous avez déjà versé

1. Contactez immédiatement votre banque pour tenter un rappel de fonds — les premières heures comptent.
2. Faites opposition si des données de carte ont été communiquées.
3. Déposez plainte auprès de la police ou de la gendarmerie ; conservez toutes les preuves (captures, courriels, relevés, identifiants des interlocuteurs).
4. Signalez à l'AMF via Épargne info service, et sur les plateformes officielles de signalement (Cybermalveillance.gouv.fr, Signal Conso).
5. **Refusez toute proposition de récupération de fonds contre paiement.** Il s'agit systématiquement d'une seconde fraude, conduite par le même réseau.

Aucune honte n'est justifiée : ces fraudes sont conçues par des organisations professionnelles et touchent tous les niveaux de compétence, y compris des banques et des fonds d'investissement. Le signalement est utile, y compris lorsque la récupération est improbable.`,
      keyPoints: [
        'Promesse : garanti, fixe, rendement par jour ou par mois, régularité anormale, aucun risque mentionné.',
        'Pression : contact non sollicité, urgence, secret imposé, escalade des montants.',
        'Identité : absence des registres Regafi/Orias/AMF, IBAN incohérent, paiement en crypto ou vers un compte personnel.',
        'Trois questions : d’où vient l’argent, qui est responsable et où est-il enregistré, pourquoi moi et pourquoi maintenant.',
        'Après une fraude : banque immédiatement, plainte, signalement, et refus absolu de toute offre de récupération payante.',
      ],
      sources: [
        {
          label: 'AMF – Liste noire et mises en garde',
          url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde',
        },
        {
          label: 'Cybermalveillance.gouv.fr – Fiches réflexes',
          url: 'https://www.cybermalveillance.gouv.fr/tous-nos-contenus/fiches-reflexes',
        },
        {
          label: 'AMF – Épargne info service (0 800 02 90 30)',
          url: 'https://www.amf-france.org/fr/espace-epargnants/etre-accompagne/amf-epargne-info-service',
        },
      ],
    },
  ],
  quiz: [
    {
      slug: 'n5-q1',
      prompt:
        'Une plateforme affiche un rendement de 2 % par mois, versé sans interruption depuis 18 mois, présenté comme sans risque. Quelle lecture est correcte ?',
      takeaway:
        'Un rendement élevé, fixe et régulier n’a aucune source économique possible : c’est le marqueur du schéma de Ponzi.',
      choices: [
        {
          label:
            'L’historique de 18 mois sans incident constitue une preuve de fiabilité.',
          explanation:
            'Faux, et c’est exactement ce qui rend le schéma efficace : tant que les entrées dépassent les sorties, tout fonctionne. Madoff a tenu des décennies.',
        },
        {
          label:
            'Environ 27 % par an garantis avec une régularité parfaite : aucune source économique ne produit cela, le schéma de Ponzi est le mécanisme le plus probable.',
          correct: true,
          explanation:
            'Exact. Deux marqueurs sont réunis : un niveau incompatible avec le taux sans risque, et une régularité anormale — un actif réel ne rapporte jamais exactement le même pourcentage chaque mois.',
        },
        {
          label:
            'C’est plausible si la plateforme pratique le staking, qui offre des rendements fixes élevés.',
          explanation:
            'Faux. Les rendements de validation sont variables et modestes. Un taux fixe élevé sur des crypto-actifs signale que l’argent des nouveaux paye les anciens.',
        },
        {
          label:
            'Le risque est acceptable à condition de n’y placer qu’une petite somme et de retirer régulièrement.',
          explanation:
            'Faux. Le dimensionnement ne s’applique pas à une fraude : il n’y a pas de rendement espéré à pondérer, seulement une perte différée. De plus, participer alimente le montage.',
        },
      ],
    },
    {
      slug: 'n5-q2',
      prompt:
        'Une personne se présentant comme le service anti-fraude de votre banque vous appelle, connaît vos dernières opérations et vous demande de valider un code reçu par SMS pour bloquer une opération suspecte. Que faire ?',
      takeaway:
        'Aucune banque ne demande jamais de communiquer un code SMS ni de transférer des fonds vers un « compte sécurisé ».',
      choices: [
        {
          label:
            'Communiquer le code, puisque l’interlocuteur connaît des informations que seule la banque peut détenir.',
          explanation:
            'Faux. Ces informations proviennent le plus souvent d’une fuite de données. Le code SMS sert précisément à valider l’opération frauduleuse que vous croyez bloquer.',
        },
        {
          label:
            'Raccrocher, ne transmettre aucun code, et rappeler la banque au numéro figurant au dos de la carte bancaire.',
          correct: true,
          explanation:
            'Exact. Ne jamais rappeler le numéro fourni par l’interlocuteur, ne jamais communiquer un code reçu par SMS à qui que ce soit, et vérifier par un canal indépendant.',
        },
        {
          label:
            'Transférer les fonds vers le compte sécurisé proposé, le temps de la vérification.',
          explanation:
            'Faux : un « compte sécurisé » n’existe pas. C’est la formule employée pour obtenir un virement volontaire, beaucoup plus difficile à contester ensuite.',
        },
        {
          label:
            'Accepter d’installer le logiciel de prise en main à distance proposé par le conseiller.',
          explanation:
            'Faux. C’est un signal d’alerte majeur : ce logiciel donne à l’escroc le contrôle de votre appareil et l’accès à votre banque en ligne.',
        },
      ],
    },
    {
      slug: 'n5-q3',
      prompt:
        'Un jeton inconnu, dont le volume d’échange était quasi nul, monte de 400 % en trois jours pendant que plusieurs comptes influents publient simultanément le même message enthousiaste. Que décrit cette situation ?',
      takeaway:
        'Une promotion coordonnée sur un actif peu liquide décrit un pump and dump : les nouveaux entrants fournissent la liquidité de sortie.',
      choices: [
        {
          label:
            'Une découverte de valeur légitime : le marché prend conscience du potentiel du projet.',
          explanation:
            'Faux. Une revalorisation légitime s’appuie sur une information vérifiable. Ici l’information est une campagne de promotion, et la hausse est sa propre publicité.',
        },
        {
          label:
            'Un pump and dump : la promotion coordonnée crée la liquidité dans laquelle les organisateurs vendront.',
          correct: true,
          explanation:
            'Exact. Les quatre temps sont visibles : accumulation sur un actif illiquide, promotion coordonnée, hausse auto-entretenue, puis vente. Les pertes constatées sont couramment de 90 à 99 %.',
        },
        {
          label:
            'Un wash trading, puisque le volume d’échange a augmenté fortement.',
          explanation:
            'Partiellement pertinent mais inexact : le wash trading désigne des transactions fictives destinées à gonfler le volume affiché. Il peut accompagner un pump and dump sans le décrire.',
        },
        {
          label:
            'Une opportunité à saisir avec une petite position, le risque étant limité au montant investi.',
          explanation:
            'Faux. Sur ce type d’actif, la perte attendue est de l’ordre de la totalité de la position, et acheter pendant la phase de promotion consiste à fournir la sortie des organisateurs.',
        },
      ],
    },
    {
      slug: 'n5-q4',
      prompt:
        'Un programme propose une formation payante à l’investissement et rémunère ses participants sur les inscriptions de nouveaux membres et de leurs filleuls. Comment le qualifier ?',
      takeaway:
        'Quand la rémunération provient du recrutement et non de clients extérieurs, il s’agit d’un système pyramidal, interdit en France.',
      choices: [
        {
          label:
            'Un programme d’affiliation classique, légal dès lors que la formation existe réellement.',
          explanation:
            'Faux. L’existence du produit ne suffit pas : elle sert précisément d’habillage. Le critère est l’origine de la rémunération, pas la réalité du support de formation.',
        },
        {
          label:
            'Un système pyramidal : la rémunération provient de l’entrée de nouveaux participants, ce qui est interdit en France.',
          correct: true,
          explanation:
            'Exact. Le code de la consommation interdit la vente à la boule de neige et les rémunérations fondées sur l’espoir de gains liés au recrutement. La majorité des participants perd par construction.',
        },
        {
          label:
            'Un schéma de Ponzi, puisque les premiers entrants sont payés par les suivants.',
          explanation:
            'Presque : les deux partagent la même arithmétique, mais dans un Ponzi un organisateur central collecte les fonds sans que les participants recrutent. Ici le recrutement est la source explicite de rémunération.',
        },
        {
          label:
            'Une activité légitime si le programme est enregistré comme organisme de formation.',
          explanation:
            'Faux. Un enregistrement d’organisme de formation ne légalise pas une structure de rémunération pyramidale, qui reste une pratique commerciale interdite.',
        },
      ],
    },
    {
      slug: 'n5-q5',
      prompt:
        'Vous constatez avoir été victime d’une fraude. Trois jours plus tard, une société vous contacte et propose de récupérer vos fonds contre une avance de frais de dossier. Que faire ?',
      takeaway:
        'L’arnaque à la récupération de fonds est une seconde fraude menée par le même réseau : les listes de victimes se revendent.',
      choices: [
        {
          label:
            'Accepter si les frais sont faibles au regard du montant à récupérer.',
          explanation:
            'Faux. Le faible montant demandé est le levier de la manipulation : il rend l’acceptation facile. Aucune récupération ne suivra, et de nouvelles demandes arriveront.',
        },
        {
          label:
            'Refuser : il s’agit d’une seconde fraude, et signaler cette nouvelle sollicitation aux autorités.',
          correct: true,
          explanation:
            'Exact. C’est un schéma systématique, souvent conduit par le même réseau à partir des listes de victimes. Les démarches légitimes passent par la banque, la plainte et les signalements officiels, jamais par une avance de frais.',
        },
        {
          label:
            'Vérifier la société sur son site internet, et accepter si les mentions légales sont présentes.',
          explanation:
            'Faux. Des mentions légales sont triviales à fabriquer. La vérification utile passe par les registres officiels (Regafi, Orias) et la liste noire de l’AMF, mais le schéma lui-même suffit à écarter la proposition.',
        },
        {
          label:
            'Ne rien faire et ne rien signaler, la récupération étant de toute façon improbable.',
          explanation:
            'Faux : le signalement reste utile, y compris quand la récupération est improbable, car il alimente les mises en garde publiques et les enquêtes en cours.',
        },
      ],
    },
  ],
};
