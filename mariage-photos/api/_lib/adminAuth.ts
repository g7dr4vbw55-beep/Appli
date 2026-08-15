import { timingSafeEqual } from 'node:crypto'
import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Vérifie le mot de passe admin envoyé dans l'en-tête x-admin-password.
 * Renvoie true si l'accès est autorisé ; sinon répond 401/500 et renvoie false.
 */
export function verifierMotDePasseAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const motDePasseAttendu = process.env.ADMIN_PASSWORD
  if (!motDePasseAttendu) {
    res.status(500).json({ erreur: "Le mot de passe admin n'est pas configuré sur le serveur." })
    return false
  }

  const motDePasseRecu = req.headers['x-admin-password']
  const valeurRecue = Array.isArray(motDePasseRecu) ? motDePasseRecu[0] : motDePasseRecu

  if (!valeurRecue || !comparaisonSecurisee(valeurRecue, motDePasseAttendu)) {
    res.status(401).json({ erreur: 'Mot de passe incorrect.' })
    return false
  }

  return true
}

function comparaisonSecurisee(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}
