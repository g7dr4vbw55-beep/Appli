import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth'
import { getSupabaseAdmin, BUCKET_NAME } from '../_lib/supabaseAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erreur: 'Méthode non autorisée' })
    return
  }
  if (!verifierMotDePasseAdmin(req, res)) return

  const { id } = (req.body ?? {}) as { id?: string }
  if (!id) {
    res.status(400).json({ erreur: 'Identifiant de photo manquant.' })
    return
  }

  try {
    const admin = getSupabaseAdmin()

    const { data: photo, error: erreurLecture } = await admin
      .from('photos')
      .select('storage_path')
      .eq('id', id)
      .single<{ storage_path: string }>()

    if (erreurLecture || !photo) {
      res.status(404).json({ erreur: 'Photo introuvable.' })
      return
    }

    await admin.storage.from(BUCKET_NAME).remove([photo.storage_path])

    const { error: erreurSuppression } = await admin.from('photos').delete().eq('id', id)
    if (erreurSuppression) throw erreurSuppression

    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ erreur: "La suppression de la photo a échoué. Réessayez." })
  }
}
