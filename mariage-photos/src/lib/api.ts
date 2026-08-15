import { supabase, urlPublique } from './supabase'
import type { Commentaire, Photo, PhotoAvecUrl } from './types'

const TAILLE_PAGE = 24

export async function chargerPagePhotos(
  avant?: string,
  defi?: string | null,
): Promise<{ photos: PhotoAvecUrl[]; fini: boolean }> {
  let requete = supabase.from('photos').select('*').order('created_at', { ascending: false }).limit(TAILLE_PAGE)

  if (avant) {
    requete = requete.lt('created_at', avant)
  }
  if (defi) {
    requete = requete.eq('defi', defi)
  }

  const { data, error } = await requete
  if (error) throw error

  const photos = (data as Photo[]).map((p) => ({ ...p, url: urlPublique(p.storage_path) }))
  return { photos, fini: photos.length < TAILLE_PAGE }
}

export async function chargerCommentaires(photoId: string): Promise<Commentaire[]> {
  const { data, error } = await supabase
    .from('commentaires')
    .select('*')
    .eq('photo_id', photoId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Commentaire[]
}

export async function ajouterCommentaire(photoId: string, prenom: string, contenu: string): Promise<Commentaire> {
  const { data, error } = await supabase
    .from('commentaires')
    .insert({ photo_id: photoId, auteur_prenom: prenom, contenu })
    .select()
    .single()
  if (error) throw error
  return data as Commentaire
}
