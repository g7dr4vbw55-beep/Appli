/** Aperçu d'un fichier tableur, avant tout rapprochement avec les champs de l'appli. */
export type ApercuTableur = {
  nomFichier: string;
  /** Intitulés lus sur la première ligne remplie. */
  colonnes: string[];
  /** Premières lignes de données, mises en texte pour l'affichage. */
  lignes: string[][];
  /** Nombre de lignes de données, en-tête non comprise. */
  totalLignes: number;
};

/**
 * Met une cellule en texte affichable.
 *
 * Un tableur rend des dates et des nombres, pas seulement du texte : une date
 * arrive comme telle et doit être ramenée au format AAAA-MM-JJ que l'appli
 * emploie déjà, sinon elle s'afficherait dans la langue de l'appareil.
 */
export function celluleEnTexte(valeur: unknown): string {
  if (valeur === null || valeur === undefined) return '';

  if (valeur instanceof Date) {
    if (Number.isNaN(valeur.getTime())) return '';
    const jj = String(valeur.getDate()).padStart(2, '0');
    const mm = String(valeur.getMonth() + 1).padStart(2, '0');
    return `${valeur.getFullYear()}-${mm}-${jj}`;
  }

  if (typeof valeur === 'number') {
    return Number.isFinite(valeur) ? String(valeur) : '';
  }

  if (typeof valeur === 'boolean') return valeur ? 'oui' : 'non';

  return String(valeur).trim();
}

const ligneVide = (ligne: unknown[]) =>
  ligne.every((cellule) => celluleEnTexte(cellule).length === 0);

/** Lignes réellement remplies, les lignes vides d'un export étant sans intérêt. */
export function lignesRemplies(grille: unknown[][]): unknown[][] {
  return grille.filter((ligne) => Array.isArray(ligne) && !ligneVide(ligne));
}

/**
 * Construit l'aperçu d'une grille de cellules.
 *
 * `ligneEnTete` désigne la ligne portant les intitulés, comptée parmi les
 * lignes remplies. Elle ne vaut pas toujours zéro : un planning d'usine
 * commence souvent par un titre (« PLANNING COULAGE 2026 ») qu'il ne faut pas
 * confondre avec les intitulés de colonnes — c'est à l'utilisateur de
 * désigner la bonne ligne, l'appli ne peut que proposer la première.
 *
 * Les colonnes sans intitulé reçoivent un nom de repli (« Colonne 3 ») plutôt
 * que d'être écartées : leur contenu est peut-être justement celui qu'on
 * cherche, et une colonne anonyme reste sélectionnable.
 */
export function construireApercu(
  nomFichier: string,
  grille: unknown[][],
  ligneEnTete = 0,
  maxLignes = 5
): ApercuTableur {
  const remplies = lignesRemplies(grille);

  if (remplies.length === 0 || ligneEnTete >= remplies.length) {
    return { nomFichier, colonnes: [], lignes: [], totalLignes: 0 };
  }

  const enTete = remplies[ligneEnTete];
  const donnees = remplies.slice(ligneEnTete + 1);
  const largeur = remplies.reduce((max, ligne) => Math.max(max, ligne.length), 0);

  const colonnes = Array.from({ length: largeur }, (_, index) => {
    const intitule = celluleEnTexte(enTete[index]);
    return intitule.length > 0 ? intitule : `Colonne ${index + 1}`;
  });

  const lignes = donnees
    .slice(0, maxLignes)
    .map((ligne) =>
      Array.from({ length: largeur }, (_, index) => celluleEnTexte(ligne[index]))
    );

  return { nomFichier, colonnes, lignes, totalLignes: donnees.length };
}
