export interface Photo {
  id: string
  created_at: string
  storage_path: string
  auteur_prenom: string
  largeur: number | null
  hauteur: number | null
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
