import { useSyncExternalStore } from 'react';

export type DemandeStatut = 'En attente' | 'Validée' | 'Refusée';

export type Demande = {
  id: string;
  date: string;
  heure: string;
  commentaire: string;
  statut: DemandeStatut;
};

let demandes: Demande[] = [];
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return demandes;
}

export function addDemande(input: { date: string; heure: string; commentaire: string }) {
  demandes = [
    ...demandes,
    {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      date: input.date,
      heure: input.heure,
      commentaire: input.commentaire,
      statut: 'En attente',
    },
  ];
  emit();
}

export function setDemandeStatut(id: string, statut: DemandeStatut) {
  demandes = demandes.map((demande) => (demande.id === id ? { ...demande, statut } : demande));
  emit();
}

export function useDemandesEnAttente() {
  const all = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return all.filter((demande) => demande.statut === 'En attente');
}
