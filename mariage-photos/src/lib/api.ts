import { supabase, urlPublique } from './supabase'
import type { Commentaire, CommentaireVideo, Photo, PhotoAvecUrl } from './types'

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

export async function chargerCommentairesVideo(videoId: string): Promise<CommentaireVideo[]> {
  const { data, error } = await supabase
    .from('commentaires_video')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(messageErreurCommentairesVideo(error.message))
  return data as CommentaireVideo[]
}

export async function ajouterCommentaireVideo(
  videoId: string,
  prenom: string,
  contenu: string,
): Promise<CommentaireVideo> {
  const { data, error } = await supabase
    .from('commentaires_video')
    .insert({ video_id: videoId, auteur_prenom: prenom, contenu })
    .select()
    .single()
  if (error) throw new Error(messageErreurCommentairesVideo(error.message))
  return data as CommentaireVideo
}

/**
 * Signale explicitement la table manquante plutôt qu'une panne générique :
 * c'est l'oubli le plus probable après l'ajout des vidéos.
 */
function messageErreurCommentairesVideo(message: string): string {
  if (/commentaires_video/i.test(message) && /(relation|table|schema|exist)/i.test(message)) {
    return "Les commentaires des vidéos ne sont pas encore activés : exécutez le fichier supabase/videos-commentaires.sql dans Supabase."
  }
  return message
}

// L'ajout de commentaires sur les photos a été retiré en même temps que
// l'album côté invités. La lecture reste nécessaire à l'administration, qui
// permet toujours de relire et de modérer les commentaires de la soirée.
