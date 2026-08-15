import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth.js'
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js'

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
    if (error) {
      res.status(500).json({ erreur: `Suppression impossible : ${error.message}` })
      return
    }
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ erreur: err instanceof Error ? err.message : 'Erreur inconnue.' })
  }
}
