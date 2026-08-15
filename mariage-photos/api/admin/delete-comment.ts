import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth'
import { getSupabaseAdmin } from '../_lib/supabaseAdmin'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erreur: 'Méthode non autorisée' })
    return
  }
  if (!verifierMotDePasseAdmin(req, res)) return

  const { id } = (req.body ?? {}) as { id?: string }
  if (!id) {
    res.status(400).json({ erreur: 'Identifiant de commentaire manquant.' })
    return
  }

  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from('commentaires').delete().eq('id', id)
    if (error) throw error
    res.status(200).json({ ok: true })
  } catch {
    res.status(500).json({ erreur: "La suppression du commentaire a échoué. Réessayez." })
  }
}
