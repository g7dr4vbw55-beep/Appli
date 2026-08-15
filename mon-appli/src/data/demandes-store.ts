import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type DemandeStatut = 'En attente' | 'Validée' | 'Refusée';

export type Demande = {
  id: string;
  date: string;
  heure: string;
  commentaire: string;
  statut: DemandeStatut;
  /** Créneau demandé par le client, conservé dès que tu l'as ajusté. */
  dateInitiale?: string;
  heureInitiale?: string;
};

type EtatDemandes = {
  demandes: Demande[];
  /** Vrai tant que les demandes enregistrées sur l'appareil n'ont pas été relues. */
  chargement: boolean;
};

const CLE_STOCKAGE = 'mon-appli.demandes.v1';

let etat: EtatDemandes = { demandes: [], chargement: true };
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return etat;
}

function majEtat(patch: Partial<EtatDemandes>) {
  etat = { ...etat, ...patch };
  emit();
}

async function persister(demandes: Demande[]) {
  try {
    await AsyncStorage.setItem(CLE_STOCKAGE, JSON.stringify(demandes));
  } catch (error) {
    console.warn('Enregistrement des demandes impossible.', error);
  }
}

function estDemande(valeur: unknown): valeur is Demande {
  const d = valeur as Demande;
  return (
    typeof d === 'object' &&
    d !== null &&
    typeof d.id === 'string' &&
    typeof d.date === 'string' &&
    typeof d.heure === 'string' &&
    typeof d.commentaire === 'string' &&
    (d.statut === 'En attente' || d.statut === 'Validée' || d.statut === 'Refusée') &&
    (d.dateInitiale === undefined || typeof d.dateInitiale === 'string') &&
    (d.heureInitiale === undefined || typeof d.heureInitiale === 'string')
  );
}

async function relireDepuisAppareil() {
  try {
    const brut = await AsyncStorage.getItem(CLE_STOCKAGE);
    const analyse: unknown = brut ? JSON.parse(brut) : [];
    const demandes = Array.isArray(analyse) ? analyse.filter(estDemande) : [];
    majEtat({ demandes, chargement: false });
  } catch (error) {
    console.warn('Lecture des demandes enregistrées impossible.', error);
    majEtat({ chargement: false });
  }
}

// Le rendu web se prépare d'abord sur un serveur, où le stockage de l'appareil
// n'existe pas. On ne relit donc qu'une fois arrivé sur un vrai appareil
// (téléphone ou navigateur), où `window` est disponible.
if (typeof window !== 'undefined') {
  relireDepuisAppareil();
}

export function addDemande(input: { date: string; heure: string; commentaire: string }) {
  const demandes = [
    ...etat.demandes,
    {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      date: input.date,
      heure: input.heure,
      commentaire: input.commentaire,
      statut: 'En attente' as const,
    },
  ];
  majEtat({ demandes });
  persister(demandes);
}

/**
 * Cale la demande sur le créneau qui t'arrange et la valide dans la foulée.
 * Le créneau demandé par le client est mémorisé au premier ajustement
 * seulement, pour qu'un second ajustement ne l'efface pas.
 */
export function validerAvecCreneau(id: string, creneau: { date: string; heure: string }) {
  const demandes = etat.demandes.map((demande) => {
    if (demande.id !== id) return demande;
    const ajuste = creneau.date !== demande.date || creneau.heure !== demande.heure;
    return {
      ...demande,
      date: creneau.date,
      heure: creneau.heure,
      dateInitiale: demande.dateInitiale ?? (ajuste ? demande.date : undefined),
      heureInitiale: demande.heureInitiale ?? (ajuste ? demande.heure : undefined),
      statut: 'Validée' as const,
    };
  });
  majEtat({ demandes });
  persister(demandes);
}

export function setDemandeStatut(id: string, statut: DemandeStatut) {
  const demandes = etat.demandes.map((demande) =>
    demande.id === id ? { ...demande, statut } : demande
  );
  majEtat({ demandes });
  persister(demandes);
}

export function useDemandes() {
  const { demandes, chargement } = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    enAttente: demandes.filter((demande) => demande.statut === 'En attente'),
    // Les plus récemment reçues en premier : l'historique se lit de haut en bas.
    traitees: demandes.filter((demande) => demande.statut !== 'En attente').reverse(),
    chargement,
  };
}
