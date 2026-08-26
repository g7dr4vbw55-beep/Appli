export interface Photo {
  id: string
  created_at: string
  storage_path: string
  auteur_prenom: string
  largeur: number | null
  hauteur: number | null
  /** Identifiant du défi photo associé, ou null si la photo a été envoyée hors défi. */
  defi: string | null
}

export interface PhotoAvecUrl extends Photo {
  url: string
}

export interface Commentaire {
  id: string
  created_at: string
  photo_id: string
  auteur_prenom: string
  contenu: string
}

export interface CommentaireVideo {
  id: string
  created_at: string
  video_id: string
  auteur_prenom: string
  contenu: string
}
