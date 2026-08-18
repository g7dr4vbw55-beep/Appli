export interface Cotation {
  actifId: number;
  symbole: string;
  nom: string;
  classe: string;
  fournisseur: string;
  devise: string;
  prix: number | null;
  prixEuros: number | null;
  source: string;
  horodatage: string | null;
  avertissement: string | null;
}

export interface ActifDisponible {
  id: number;
  symbole: string;
  nom: string;
  classe: 'action' | 'etf' | 'crypto';
  fournisseur: string;
  referenceFournisseur: string;
  devise: string;
  estIndice: boolean;
  notes: string;
  dernierPrixManuel: number | null;
  dernierPrixManuelDate: string | null;
  quantiteDetenue: number;
}

export interface PositionValorisee {
  positionId: number;
  actifId: number;
  symbole: string;
  nom: string;
  classe: 'action' | 'etf' | 'crypto';
  quantite: number;
  prixMoyen: number;
  investi: number;
  prixActuel: number | null;
  sourcePrix: string;
  avertissementPrix: string | null;
  valeur: number | null;
  plusValueLatente: number | null;
  plusValueLatentePourcent: number | null;
  plusValueRealisee: number;
  fraisCumules: number;
  poidsPourcent: number | null;
  ouvertLe: string;
  decisionOuverture: {
    id: number;
    these: string;
    horizon: string;
    horizonMois: number;
    risqueAccepteEuros: number;
    conditionInvalidation: string;
  } | null;
  suiviRisque: {
    risqueAccepteEuros: number;
    perteLatenteEuros: number;
    partDuRisqueConsomme: number | null;
    depasse: boolean;
  } | null;
}

export interface Alerte {
  type: string;
  gravite: 'information' | 'attention';
  message: string;
}

export interface EtatPortefeuille {
  liquidites: number;
  capitalDepart: number;
  valeurInvestie: number;
  valeurTotale: number;
  performanceEuros: number;
  performancePourcent: number;
  plusValueLatente: number;
  plusValueRealisee: number;
  fraisCumules: number;
  positions: PositionValorisee[];
  repartition: { classe: string; libelle: string; valeur: number; pourcent: number }[];
  repartitionAvecLiquidites: { classe: string; libelle: string; valeur: number; pourcent: number }[];
  alertes: Alerte[];
  parametres: { fraisPourcent: number; fraisFixe: number; seuilConcentration: number };
  comparaisonIndice: {
    symbole: string;
    nom: string;
    depuis: string;
    performancePortefeuillePourcent: number;
    performanceIndicePourcent: number | null;
    ecartPoints: number | null;
    avertissement: string;
  } | null;
  historique: { date: string; portefeuille: number; indice: number | null }[];
}

export interface DecisionEnAttente {
  id: number;
  asset_id: number;
  kind: string;
  side: 'achat' | 'vente';
  thesis: string;
  horizon: string;
  horizon_months: number;
  risk_accepted_eur: number;
  invalidation_condition: string;
  conviction: number;
  emotion: string;
  planned_quantity: number;
  planned_price: number;
  status: string;
  created_at: string;
  executed_at: string | null;
  symbol: string;
  name: string;
  asset_class: string;
  nb_ordres?: number;
}

export interface Schema {
  code: string;
  titre: string;
  constat: string;
  occurrences: number;
  total: number;
  rappel: string;
  leconSlug: string | null;
  intensite: 'observe' | 'recurrent';
}

export interface Ecart {
  positionId: number;
  symbole: string;
  nom: string;
  classe: string;
  ouvertLe: string;
  clotureLe: string | null;
  dureeDetentionJours: number;
  horizonPrevuMois: number | null;
  horizonPrevuJours: number | null;
  respectHorizonPourcent: number | null;
  horizonTenu: boolean | null;
  risqueAccepteEuros: number | null;
  resultatRealiseEuros: number;
  resultatRealisePourcent: number | null;
  perteAuDelaDuRisqueAnnonce: boolean | null;
  these: string | null;
  conditionInvalidation: string | null;
  invalidationDeclenchee: boolean | null;
  invalidationRespectee: boolean | null;
  issueThese: string | null;
  raisonSortie: string | null;
  bilanRedige: boolean;
  lecon: string | null;
  constats: string[];
}

export interface TableauDeBord {
  volumetrie: {
    decisionsEcrites: number;
    decisionsExecutees: number;
    decisionsAnnulees: number;
    ordresPasses: number;
    positionsOuvertes: number;
    positionsCloturees: number;
    bilansRediges: number;
    dureeDetentionMoyenneJours: number | null;
    tauxRespectHorizon: number | null;
    resultatRealiseTotal: number;
    fraisCumules: number;
  };
  schemas: Schema[];
  ecarts: Ecart[];
  avertissement: string;
}

export interface Ordre {
  id: number;
  side: 'achat' | 'vente';
  quantity: number;
  unit_price: number;
  fees: number;
  gross: number;
  net: number;
  realized_pnl: number;
  price_source: string;
  executed_at: string;
  symbol: string;
  name: string;
  asset_class: string;
  thesis: string;
  horizon: string;
  kind: string;
}
