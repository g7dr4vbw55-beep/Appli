/**
 * Lit un poids saisi au clavier et le rend en tonnes.
 *
 * La virgule et le point sont acceptés : sur un clavier de téléphone
 * français la touche décimale produit une virgule, alors que le calcul
 * a besoin d'un point.
 *
 * Renvoie `null` si la saisie n'est pas un poids exploitable, pour que
 * l'appli puisse refuser d'enregistrer plutôt que retenir zéro.
 */
export function analyserPoids(saisie: string): number | null {
  const normalise = saisie.trim().replace(',', '.');
  if (normalise.length === 0) return null;
  if (!/^\d+(\.\d+)?$/.test(normalise)) return null;

  const valeur = Number(normalise);
  if (!Number.isFinite(valeur) || valeur <= 0) return null;
  return valeur;
}

/**
 * Met un poids en tonnes à la forme lue dans l'usine : « 3,5 t », « 12 t ».
 *
 * Les décimales inutiles sont retirées (3 et non 3,00) et la virgule
 * remplace le point, comme dans l'écriture française.
 */
export function formatPoids(tonnes: number): string {
  if (!Number.isFinite(tonnes)) return '—';
  const arrondi = Math.round(tonnes * 100) / 100;
  return `${String(arrondi).replace('.', ',')} t`;
}

type Chargeable = { poids: number; retiree?: boolean };

/**
 * Pièces effectivement emportées : celles que tu as retirées du chargement
 * restent dans la liste pour mémoire, mais ne partent pas avec le camion.
 */
export function piecesRetenues<T extends Chargeable>(pieces: T[]): T[] {
  return pieces.filter((piece) => !piece.retiree);
}

/** Poids total réellement chargé, en tonnes. */
export function totalPoids(pieces: Chargeable[]): number {
  // Les centièmes sont recalés après la somme : additionner des décimaux
  // laisse sinon apparaître des résultats du type 10,299999999999999.
  const somme = piecesRetenues(pieces).reduce((total, piece) => total + piece.poids, 0);
  return Math.round(somme * 100) / 100;
}
