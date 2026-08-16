/**
 * Repère commun de tous les tracés de signature.
 *
 * Les points captés sur l'écran y sont ramenés à l'enregistrement : un
 * tracé signé sur un petit téléphone et un autre sur une tablette vivent
 * ainsi dans le même repère, et s'impriment à l'identique.
 */
export const REPERE_SIGNATURE = { largeur: 300, hauteur: 120 } as const;

export type RoleSignature = 'expediteur' | 'chauffeur' | 'receptionnaire';

/** Ordre dans lequel les signatures doivent être recueillies. */
export const ORDRE_SIGNATURES: RoleSignature[] = ['expediteur', 'chauffeur', 'receptionnaire'];

export const LIBELLES_SIGNATURE: Record<
  RoleSignature,
  { titre: string; quand: string; rang: number }
> = {
  expediteur: { titre: 'PREFA OUEST', quand: 'Au chargement — pièces conformes et complètes', rang: 1 },
  chauffeur: { titre: 'Le chauffeur', quand: 'Au départ — chargement pris en charge', rang: 2 },
  receptionnaire: { titre: 'Le réceptionnaire', quand: "À l'arrivée — conforme à la réception", rang: 3 },
};

export type Signature = {
  nom: string;
  /** Chemin SVG du tracé, dans le repère `REPERE_SIGNATURE`. */
  trace: string;
  /** Date et heure de la signature, au format ISO. */
  signeLe: string;
  /** Réserves émises à la réception. */
  reserves?: string;
};

export type Signatures = Partial<Record<RoleSignature, Signature>>;

/**
 * Rôle qui doit signer maintenant, ou `null` si le bon est complet.
 *
 * L'ordre est strict : personne ne prend en charge un chargement que
 * l'usine n'a pas encore certifié.
 */
export function prochainSignataire(signatures: Signatures): RoleSignature | null {
  return ORDRE_SIGNATURES.find((role) => !signatures[role]) ?? null;
}

/** Date et heure d'une signature, sous la forme « 16/08/2026 à 07:45 ». */
export function formatHorodatage(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const jj = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mn = String(date.getMinutes()).padStart(2, '0');
  return `${jj}/${mm}/${date.getFullYear()} à ${hh}:${mn}`;
}
