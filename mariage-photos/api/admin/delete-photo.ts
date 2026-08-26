import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth.js'
import { getSupabaseAdmin, BUCKET_NAME } from '../_lib/supabaseAdmin.js'

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

    if (erreurLecture) {
      res.status(500).json({ erreur: `Lecture de la photo impossible : ${erreurLecture.message}` })
      return
    }
    if (!photo) {
      res.status(404).json({ erreur: 'Photo introuvable.' })
      return
    }

    // Le fichier est retiré avant la ligne : si la suppression du fichier
    // échoue, la photo reste visible et l'opération peut être relancée,
    // plutôt que de laisser un fichier orphelin dans le stockage.
    const { error: erreurFichier } = await admin.storage.from(BUCKET_NAME).remove([photo.storage_path])
    if (erreurFichier) {
      res.status(500).json({ erreur: `Suppression du fichier impossible : ${erreurFichier.message}` })
      return
    }

    const { error: erreurSuppression } = await admin.from('photos').delete().eq('id', id)
    if (erreurSuppression) {
      res.status(500).json({ erreur: `Suppression impossible : ${erreurSuppression.message}` })
      return
    }

    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ erreur: err instanceof Error ? err.message : 'Erreur inconnue.' })
  }
}
