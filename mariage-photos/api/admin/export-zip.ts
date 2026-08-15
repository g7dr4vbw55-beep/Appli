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

  const admin = getSupabaseAdmin()
  const photos = await recupererToutesLesPhotos(admin)

  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', 'attachment; filename="photos-mariage.zip"')

  const archive = new ZipArchive({ zlib: { level: 6 } })
  archive.on('error', () => {
    res.end()
  })
  archive.pipe(res)

  const nomsUtilises = new Map<string, number>()

  for (const photo of photos) {
    const { data, error } = await admin.storage.from(BUCKET_NAME).download(photo.storage_path)
    if (error || !data) continue
    const buffer = Buffer.from(await data.arrayBuffer())
    archive.append(buffer, { name: nomFichierUnique(photo, nomsUtilises) })
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

    if (error || !data || data.length === 0) break
    toutes.push(...(data as LignePhoto[]))
    if (data.length < TAILLE_LOT) break
    debut += TAILLE_LOT
  }

  return toutes
}

function nomFichierUnique(photo: LignePhoto, nomsUtilises: Map<string, number>): string {
  const date = new Date(photo.created_at).toISOString().slice(0, 10)
  const auteur = photo.auteur_prenom.replace(/[^a-zA-Z0-9-]+/g, '_').slice(0, 30) || 'invite'
  const base = `${date}_${auteur}`

  const compte = nomsUtilises.get(base) ?? 0
  nomsUtilises.set(base, compte + 1)

  return compte === 0 ? `${base}.jpg` : `${base}_${compte}.jpg`
}
