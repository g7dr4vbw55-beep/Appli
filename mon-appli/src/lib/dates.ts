const JOURS = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
] as const;

const MOIS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
] as const;

/**
 * Met une date technique (2026-08-20) au format lisible « jeudi 20 août 26 ».
 *
 * Les noms de jours et de mois sont écrits en dur plutôt que déduits de la
 * langue de l'appareil : l'usine travaille en français, et cela garantit le
 * même rendu sur iOS, Android et le web.
 *
 * Une valeur qu'on ne sait pas lire est renvoyée telle quelle, pour qu'une
 * saisie approximative reste visible à l'écran au lieu de disparaître.
 */
export function formatDateFr(valeur: string): string {
  const decoupe = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeur.trim());
  if (!decoupe) return valeur;

  const [, annee, mois, jour] = decoupe;
  const date = new Date(Number(annee), Number(mois) - 1, Number(jour));
  if (Number.isNaN(date.getTime())) return valeur;

  // Une date impossible (2026-02-31) est silencieusement décalée par le
  // calendrier : on la rejette plutôt que d'afficher un jour faux.
  if (date.getMonth() !== Number(mois) - 1 || date.getDate() !== Number(jour)) {
    return valeur;
  }

  return `${JOURS[date.getDay()]} ${jour} ${MOIS[date.getMonth()]} ${annee.slice(2)}`;
}
