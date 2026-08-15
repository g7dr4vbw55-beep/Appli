import type { PieceChargee } from '@/data/demandes-store';

export type CreneauStatut = 'Confirmé' | 'En attente' | 'Annulé';

/** Un camion qui arrive sur un chantier, chargé de plusieurs pièces. */
export type CreneauLivraison = {
  id: string;
  client: string;
  chantier: string;
  date: string;
  heure: string;
  pieces: PieceChargee[];
  statut: CreneauStatut;
};

export const creneauxLivraison: CreneauLivraison[] = [
  {
    id: '1',
    client: 'TREE LOGIS',
    chantier: 'Résidence Les Ormes — Vannes',
    date: '2026-07-29',
    heure: '08:00',
    pieces: [
      { repere: 'PT118', poids: 3.5 },
      { repere: 'PT119', poids: 3.5 },
      { repere: 'PT120', poids: 3.4 },
    ],
    statut: 'Confirmé',
  },
  {
    id: '2',
    client: 'TREE LOGIS',
    chantier: 'Résidence Les Ormes — Vannes',
    date: '2026-07-29',
    heure: '10:30',
    pieces: [
      { repere: 'ESC24', poids: 2.2 },
      { repere: 'ESC25', poids: 2.2 },
    ],
    statut: 'Confirmé',
  },
  {
    id: '3',
    client: 'BATI OUEST',
    chantier: 'Lotissement Kerlann — Auray',
    date: '2026-07-30',
    heure: '07:30',
    pieces: [
      { repere: 'LG09', poids: 1.8 },
      { repere: 'LG10', poids: 1.8 },
      { repere: 'LG11', poids: 1.75 },
      { repere: 'LG12', poids: 1.8 },
    ],
    statut: 'En attente',
  },
  {
    id: '4',
    client: 'BATI OUEST',
    chantier: 'Lotissement Kerlann — Auray',
    date: '2026-07-30',
    heure: '14:00',
    pieces: [
      { repere: 'PO52', poids: 2.4 },
      { repere: 'PO53', poids: 2.4 },
    ],
    statut: 'Confirmé',
  },
  {
    id: '5',
    client: 'SOGEA BRETAGNE',
    chantier: 'Groupe scolaire — Ploërmel',
    date: '2026-07-31',
    heure: '09:00',
    pieces: [
      { repere: 'PT129', poids: 4.2 },
    ],
    statut: 'Annulé',
  },
  {
    id: '6',
    client: 'SOGEA BRETAGNE',
    chantier: 'Groupe scolaire — Ploërmel',
    date: '2026-08-01',
    heure: '13:15',
    pieces: [
      { repere: 'MU07', poids: 4.1 },
      { repere: 'MU08', poids: 4.1 },
      { repere: 'MU09', poids: 3.9 },
    ],
    statut: 'En attente',
  },
];
