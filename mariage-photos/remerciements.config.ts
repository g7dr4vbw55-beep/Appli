/**
 * Page de remerciements — le mot des mariés à leurs invités.
 *
 * Tout est modifiable ici, sans toucher au code. Réécrivez librement :
 * ce brouillon n'est là que pour vous éviter la page blanche.
 */
const remerciements = {
  /** Grand titre en haut de la page */
  titre: 'Merci du fond du cœur',

  /**
   * Le message, paragraphe par paragraphe.
   *
   * Chaque texte entre guillemets forme un paragraphe séparé à l'écran.
   * Pour en ajouter un, copiez une ligne existante ; pour en retirer un,
   * supprimez la ligne entière (avec la virgule à la fin).
   */
  paragraphes: [
    "Merci d'avoir été là pour ce 22 août 2026. Votre présence a transformé cette journée en un souvenir que nous garderons toute notre vie.",
    'Merci pour vos rires, vos danses, vos mots et vos attentions. Et merci pour chaque photo prise ce soir : grâce à vous, nous allons pouvoir revivre cette soirée encore et encore.',
    'Nous avons hâte de vous retrouver très vite.',
  ],

  /** Signature affichée en bas, en italique */
  signature: 'Sofiane & Morgane',
} as const

export default remerciements
