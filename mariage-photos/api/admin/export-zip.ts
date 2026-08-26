import type { VercelRequest, VercelResponse } from '@vercel/node'
import { ZipArchive } from 'archiver'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth.js'
import { getSupabaseAdmin, BUCKET_NAME } from '../_lib/supabaseAdmin.js'

export const config = {
  maxDuration: 60,
}

interface LignePhoto {
  id: string
  storage_path: string
  auteur_prenom: string
  created_at: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erreur: 'Méthode non autorisée' })
    return
  }
  if (!verifierMotDePasseAdmin(req, res)) return

  // Toute la préparation se fait AVANT d'écrire le moindre octet de l'archive :
  // une fois les en-têtes envoyés, il n'est plus possible de signaler une
  // erreur autrement qu'en produisant un zip vide, ce qui n'explique rien.
  let photos: LignePhoto[]
  try {
    const admin = getSupabaseAdmin()
    photos = await recupererToutesLesPhotos(admin)
  } catch (err) {
    res.status(500).json({ erreur: messageDeLErreur(err) })
    return
  }

  if (photos.length === 0) {
    res.status(404).json({ erreur: "Il n'y a aucune photo à télécharger pour le moment." })
    return
  }

  const admin = getSupabaseAdmin()
  const fichiers: { nom: string; contenu: Buffer }[] = []
  const echecs: string[] = []
  const nomsUtilises = new Map<string, number>()

  for (const photo of photos) {
    const { data, error } = await admin.storage.from(BUCKET_NAME).download(photo.storage_path)
    if (error || !data) {
      echecs.push(`${photo.storage_path} : ${error?.message ?? 'fichier introuvable'}`)
      continue
    }
    fichiers.push({
      nom: nomFichierUnique(photo, nomsUtilises),
      contenu: Buffer.from(await data.arrayBuffer()),
    })
  }

  // Aucun fichier récupéré : on renvoie la cause plutôt qu'une archive vide.
  if (fichiers.length === 0) {
    res.status(500).json({
      erreur: `Aucune photo n'a pu être récupérée depuis le stockage (${photos.length} attendue(s)). Première cause : ${echecs[0] ?? 'inconnue'}`,
    })
    return
  }

  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', 'attachment; filename="photos-mariage.zip"')

  const archive = new ZipArchive({ zlib: { level: 6 } })
  archive.on('error', () => res.end())
  archive.pipe(res)

  for (const fichier of fichiers) {
    archive.append(fichier.contenu, { name: fichier.nom })
  }

  // Si certaines photos manquent, l'archive le dit au lieu de les omettre en silence.
  if (echecs.length > 0) {
    archive.append(
      `${echecs.length} photo(s) n'ont pas pu être récupérées depuis le stockage :\n\n${echecs.join('\n')}\n`,
      { name: 'PHOTOS-MANQUANTES.txt' },
    )
  }

  await archive.finalize()
}

async function recupererToutesLesPhotos(
  admin: ReturnType<typeof getSupabaseAdmin>,
): Promise<LignePhoto[]> {
  const toutes: LignePhoto[] = []
  const TAILLE_LOT = 1000
  let debut = 0

  while (true) {
    const { data, error } = await admin
      .from('photos')
      .select('id, storage_path, auteur_prenom, created_at')
      .order('created_at', { ascending: true })
      .range(debut, debut + TAILLE_LOT - 1)

    // Une erreur ici était auparavant ignorée, ce qui produisait une archive
    // vide sans le moindre message. On la fait remonter.
    if (error) throw new Error(`Lecture de la liste des photos impossible : ${error.message}`)
    if (!data || data.length === 0) break

    toutes.push(...(data as LignePhoto[]))
    if (data.length < TAILLE_LOT) break
    debut += TAILLE_LOT
  }

  return toutes
}

function messageDeLErreur(err: unknown): string {
  return err instanceof Error ? err.message : "Erreur inconnue pendant la préparation de l'archive."
}

function nomFichierUnique(photo: LignePhoto, nomsUtilises: Map<string, number>): string {
  const date = new Date(photo.created_at).toISOString().slice(0, 10)
  const auteur = photo.auteur_prenom.replace(/[^a-zA-Z0-9-]+/g, '_').slice(0, 30) || 'invite'
  const base = `${date}_${auteur}`

  const compte = nomsUtilises.get(base) ?? 0
  nomsUtilises.set(base, compte + 1)

  return compte === 0 ? `${base}.jpg` : `${base}_${compte}.jpg`
}
