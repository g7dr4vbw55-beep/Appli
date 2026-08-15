import type { VercelRequest, VercelResponse } from '@vercel/node'
import { verifierMotDePasseAdmin } from '../_lib/adminAuth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ erreur: 'Méthode non autorisée' })
    return
  }
  if (!verifierMotDePasseAdmin(req, res)) return
  res.status(200).json({ ok: true })
}
