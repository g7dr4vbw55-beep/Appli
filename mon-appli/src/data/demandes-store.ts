import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type DemandeStatut = 'En attente' | 'Validée' | 'Refusée';

/** Une pièce chargée dans le camion, avec son poids en tonnes. */
export type PieceChargee = {
  repere: string;
  /** Poids en tonnes. */
  poids: number;
  /**
   * Pièce que tu as sortie du chargement avant de valider. Elle reste dans
   * la liste pour que le client sache qu'elle n'est pas partie, mais ne
   * compte plus dans le total du camion.
   */
  retiree?: boolean;
};

/** Un camion qui arrive à une date et une heure, chargé de plusieurs pièces. */
export type Demande = {
  id: string;
  client: string;
  chantier: string;
  /** Date et heure d'arrivée du camion. */
  date: string;
  heure: string;
  pieces: PieceChargee[];
  commentaire: string;
  statut: DemandeStatut;
  /** Créneau demandé par le client, conservé dès que tu l'as ajusté. */
  dateInitiale?: string;
  heureInitiale?: string;
  /** Numéro du bon de livraison, attribué à la première édition. */
  numeroBL?: string;
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

const texte = (valeur: unknown) => (typeof valeur === 'string' ? valeur : '');

/**
 * Relit la liste des pièces d'une demande enregistrée.
 *
 * Avant l'ajout du poids, une pièce n'était qu'un repère ("PT118"). Ces
 * pièces sont conservées avec un poids de 0 : le repère reste, et le total
 * du camion signale de lui-même qu'il reste des poids à renseigner.
 */
function normaliserPieces(valeur: unknown): PieceChargee[] {
  if (!Array.isArray(valeur)) return [];
  return valeur.flatMap((piece): PieceChargee[] => {
    if (typeof piece === 'string') return [{ repere: piece, poids: 0 }];
    if (typeof piece !== 'object' || piece === null) return [];
    const p = piece as Record<string, unknown>;
    if (typeof p.repere !== 'string') return [];
    return [
      {
        repere: p.repere,
        poids: typeof p.poids === 'number' && Number.isFinite(p.poids) ? p.poids : 0,
        retiree: p.retiree === true ? true : undefined,
      },
    ];
  });
}

/**
 * Remet une demande enregistrée à la forme attendue par l'appli d'aujourd'hui.
 *
 * Les demandes créées avant l'ajout du client, du chantier et des pièces n'ont
 * pas ces champs : on les complète à vide plutôt que de rejeter la demande,
 * sinon une mise à jour de l'appli effacerait le travail déjà saisi.
 * Renvoie `null` seulement si la demande n'a aucune identité exploitable.
 */
function normaliserDemande(valeur: unknown): Demande | null {
  if (typeof valeur !== 'object' || valeur === null) return null;
  const d = valeur as Record<string, unknown>;
  if (typeof d.id !== 'string') return null;

  const statut = d.statut;
  if (statut !== 'En attente' && statut !== 'Validée' && statut !== 'Refusée') return null;

  return {
    id: d.id,
    client: texte(d.client),
    chantier: texte(d.chantier),
    date: texte(d.date),
    heure: texte(d.heure),
    pieces: normaliserPieces(d.pieces),
    commentaire: texte(d.commentaire),
    statut,
    dateInitiale: typeof d.dateInitiale === 'string' ? d.dateInitiale : undefined,
    heureInitiale: typeof d.heureInitiale === 'string' ? d.heureInitiale : undefined,
    numeroBL: typeof d.numeroBL === 'string' ? d.numeroBL : undefined,
  };
}

async function relireDepuisAppareil() {
  try {
    const brut = await AsyncStorage.getItem(CLE_STOCKAGE);
    const analyse: unknown = brut ? JSON.parse(brut) : [];
    const demandes = Array.isArray(analyse)
      ? analyse.map(normaliserDemande).filter((d): d is Demande => d !== null)
      : [];
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

export function addDemande(input: {
  client: string;
  chantier: string;
  date: string;
  heure: string;
  pieces: PieceChargee[];
  commentaire: string;
}) {
  const demandes = [
    ...etat.demandes,
    {
      id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
      client: input.client,
      chantier: input.chantier,
      date: input.date,
      heure: input.heure,
      pieces: input.pieces,
      commentaire: input.commentaire,
      statut: 'En attente' as const,
    },
  ];
  majEtat({ demandes });
  persister(demandes);
}

/**
 * Cale la demande sur le créneau et le chargement qui t'arrangent, et la
 * valide dans la foulée.
 *
 * Le créneau demandé par le client est mémorisé au premier ajustement
 * seulement, pour qu'un second ajustement ne l'efface pas. Les pièces que tu
 * sors du camion sont marquées comme retirées plutôt que supprimées.
 */
export function validerAvecCreneau(
  id: string,
  ajustement: { date: string; heure: string; pieces: PieceChargee[] }
) {
  const demandes = etat.demandes.map((demande) => {
    if (demande.id !== id) return demande;
    const creneauAjuste =
      ajustement.date !== demande.date || ajustement.heure !== demande.heure;
    return {
      ...demande,
      date: ajustement.date,
      heure: ajustement.heure,
      pieces: ajustement.pieces,
      dateInitiale: demande.dateInitiale ?? (creneauAjuste ? demande.date : undefined),
      heureInitiale: demande.heureInitiale ?? (creneauAjuste ? demande.heure : undefined),
      statut: 'Validée' as const,
    };
  });
  majEtat({ demandes });
  persister(demandes);
}

/**
 * Numéro du prochain bon, de la forme BL-2026-0007.
 *
 * Le compteur est déduit des bons déjà émis au lieu d'être stocké à part :
 * une numérotation qui vit dans les données elles-mêmes ne peut pas se
 * désynchroniser d'elles.
 */
function prochainNumeroBL(demandes: Demande[], annee = new Date().getFullYear()): string {
  const prefixe = `BL-${annee}-`;
  const dernier = demandes
    .map((demande) => demande.numeroBL)
    .filter((numero): numero is string => typeof numero === 'string' && numero.startsWith(prefixe))
    .map((numero) => Number(numero.slice(prefixe.length)))
    .filter((rang) => Number.isFinite(rang))
    .reduce((max, rang) => Math.max(max, rang), 0);

  return `${prefixe}${String(dernier + 1).padStart(4, '0')}`;
}

/**
 * Attribue son numéro de bon de livraison à une demande, et le renvoie.
 *
 * Le numéro n'est donné qu'une fois : rééditer le bon d'un camion déjà
 * parti doit redonner le même document, pas en créer un second.
 */
export function attribuerNumeroBL(id: string): string | null {
  const demande = etat.demandes.find((d) => d.id === id);
  if (!demande) return null;
  if (demande.numeroBL) return demande.numeroBL;

  const numeroBL = prochainNumeroBL(etat.demandes);
  const demandes = etat.demandes.map((d) => (d.id === id ? { ...d, numeroBL } : d));
  majEtat({ demandes });
  persister(demandes);
  return numeroBL;
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
