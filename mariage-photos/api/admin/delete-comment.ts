import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth.js'
import { getSupabaseAdmin } from '../_lib/supabaseAdmin.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erreur: 'Méthode non autorisée' })
    return
  }
  if (!verifierMotDePasseAdmin(req, res)) return

  const { id, type } = (req.body ?? {}) as { id?: string; type?: string }
  if (!id) {
    res.status(400).json({ erreur: 'Identifiant de commentaire manquant.' })
    return
  }

  // Le type est explicite et restreint : jamais un nom de table venu du
  // client, pour qu'aucune requête ne puisse viser une autre table.
  const table = type === 'video' ? 'commentaires_video' : 'commentaires'

  try {
    const admin = getSupabaseAdmin()
    const { error } = await admin.from(table).delete().eq('id', id)
    if (error) {
      res.status(500).json({ erreur: `Suppression impossible : ${error.message}` })
      return
    }
    res.status(200).json({ ok: true })
  } catch (err) {
    res.status(500).json({ erreur: err instanceof Error ? err.message : 'Erreur inconnue.' })
  }
}
