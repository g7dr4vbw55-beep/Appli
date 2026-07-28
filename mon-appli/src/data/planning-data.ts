export type CreneauStatut = 'Confirmé' | 'En attente' | 'Annulé';

export type CreneauLivraison = {
  id: string;
  date: string;
  heure: string;
  piece: string;
  statut: CreneauStatut;
};

export const creneauxLivraison: CreneauLivraison[] = [
  { id: '1', date: '2026-07-29', heure: '08:00', piece: 'Poutre PT118', statut: 'Confirmé' },
  { id: '2', date: '2026-07-29', heure: '10:30', piece: 'Escalier ESC24', statut: 'Confirmé' },
  { id: '3', date: '2026-07-30', heure: '07:30', piece: 'Longrine LG09', statut: 'En attente' },
  { id: '4', date: '2026-07-30', heure: '14:00', piece: 'Poteau PO52', statut: 'Confirmé' },
  { id: '5', date: '2026-07-31', heure: '09:00', piece: 'Poutre PT129', statut: 'Annulé' },
  { id: '6', date: '2026-08-01', heure: '13:15', piece: 'Mur préfa MU07', statut: 'En attente' },
];
