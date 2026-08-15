export type CreneauStatut = 'Confirmé' | 'En attente' | 'Annulé';

/** Un camion qui arrive sur un chantier, chargé de plusieurs pièces. */
export type CreneauLivraison = {
  id: string;
  client: string;
  chantier: string;
  date: string;
  heure: string;
  /** Repères des pièces chargées : PT118, ESC24, LG09… */
  pieces: string[];
  statut: CreneauStatut;
};

export const creneauxLivraison: CreneauLivraison[] = [
  {
    id: '1',
    client: 'TREE LOGIS',
    chantier: 'Résidence Les Ormes — Vannes',
    date: '2026-07-29',
    heure: '08:00',
    pieces: ['PT118', 'PT119', 'PT120'],
    statut: 'Confirmé',
  },
  {
    id: '2',
    client: 'TREE LOGIS',
    chantier: 'Résidence Les Ormes — Vannes',
    date: '2026-07-29',
    heure: '10:30',
    pieces: ['ESC24', 'ESC25'],
    statut: 'Confirmé',
  },
  {
    id: '3',
    client: 'BATI OUEST',
    chantier: 'Lotissement Kerlann — Auray',
    date: '2026-07-30',
    heure: '07:30',
    pieces: ['LG09', 'LG10', 'LG11', 'LG12'],
    statut: 'En attente',
  },
  {
    id: '4',
    client: 'BATI OUEST',
    chantier: 'Lotissement Kerlann — Auray',
    date: '2026-07-30',
    heure: '14:00',
    pieces: ['PO52', 'PO53'],
    statut: 'Confirmé',
  },
  {
    id: '5',
    client: 'SOGEA BRETAGNE',
    chantier: 'Groupe scolaire — Ploërmel',
    date: '2026-07-31',
    heure: '09:00',
    pieces: ['PT129'],
    statut: 'Annulé',
  },
  {
    id: '6',
    client: 'SOGEA BRETAGNE',
    chantier: 'Groupe scolaire — Ploërmel',
    date: '2026-08-01',
    heure: '13:15',
    pieces: ['MU07', 'MU08', 'MU09'],
    statut: 'En attente',
  },
];
