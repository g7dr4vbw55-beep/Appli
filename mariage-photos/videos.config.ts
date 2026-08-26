/**
 * Les vidéos récapitulatives du mariage.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * OÙ HÉBERGER LES VIDÉOS ?
 *
 * Recommandé : YouTube en mode « Non répertorié ». La vidéo n'apparaît ni
 * dans les recherches ni sur votre chaîne : seules les personnes ayant le
 * lien peuvent la voir. C'est gratuit, sans limite de trafic, et la qualité
 * s'adapte au réseau de chaque invité.
 *
 * À éviter : déposer le fichier vidéo sur Supabase. L'offre gratuite est
 * limitée à 1 Go de stockage et 5 Go de trafic par mois ; une vidéo de
 * 500 Mo regardée par 75 invités représenterait environ 37 Go.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * COMMENT RÉCUPÉRER L'IDENTIFIANT YOUTUBE
 *
 * Dans l'adresse https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * l'identifiant est ce qui suit « v= », ici : dQw4w9WgXcQ
 *
 * Avec un lien court https://youtu.be/dQw4w9WgXcQ
 * l'identifiant est ce qui suit la dernière barre oblique.
 *
 * Pour Vimeo, https://vimeo.com/123456789 donne l'identifiant 123456789.
 */
export interface Video {
  /** Identifiant court et STABLE : il relie la vidéo à ses commentaires. */
  id: string
  titre: string
  /** Courte phrase affichée sous le titre. Laissez vide pour ne rien afficher. */
  description: string
  /** 'youtube' | 'vimeo' | 'fichier' (adresse directe vers un .mp4) */
  plateforme: 'youtube' | 'vimeo' | 'fichier'
  /**
   * Forme de l'image. 'paysage' par défaut, comme une vidéo classique.
   * Mettez 'portrait' pour une vidéo verticale, notamment un Short YouTube :
   * dans un cadre 16:9 elle apparaîtrait minuscule entre deux bandes noires.
   */
  format?: 'paysage' | 'portrait'
  /**
   * Identifiant YouTube ou Vimeo, ou adresse complète du fichier .mp4.
   * Laissez vide tant que la vidéo n'est pas prête : la page affichera
   * « bientôt disponible » au lieu d'un lecteur cassé.
   */
  source: string
}

const videos: Video[] = [
  {
    id: 'recapitulatif',
    titre: 'Le film de la journée',
    description:
      'Le récapitulatif complet du mariage, en photos et en vidéo, du matin jusqu\'au bout de la nuit.',
    plateforme: 'youtube',
    source: '_IFDFZQBWhk',
  },
  {
    id: 'lunettes',
    titre: 'Les lunettes M & S',
    description: 'La compilation de toutes vos photos avec les lunettes personnalisées.',
    plateforme: 'youtube',
    format: 'portrait',
    source: 'CMiu1jGDAKk',
  },
]

export default videos
