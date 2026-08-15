const CLE_SESSION = 'mariage:admin-mdp'

export function getMotDePasseSession(): string | null {
  return sessionStorage.getItem(CLE_SESSION)
}

export function setMotDePasseSession(mdp: string): void {
  sessionStorage.setItem(CLE_SESSION, mdp)
}

export function effacerMotDePasseSession(): void {
  sessionStorage.removeItem(CLE_SESSION)
}

async function appelAdmin(chemin: string, motDePasse: string, corps?: object): Promise<Response> {
  return fetch(chemin, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-password': motDePasse,
    },
    body: JSON.stringify(corps ?? {}),
  })
}

/**
 * Distingue les causes d'échec de connexion. Sans cela, une variable
 * ADMIN_PASSWORD absente ou des fonctions serveur non déployées
 * s'affichaient toutes les deux comme "mot de passe incorrect", ce qui
 * envoyait chercher le problème au mauvais endroit.
 */
export type CodeConnexion =
  | 'ok'
  | 'mot-de-passe-incorrect'
  | 'mot-de-passe-non-configure'
  | 'fonctions-absentes'
  | 'serveur-en-erreur'
  | 'erreur-reseau'

export interface ResultatConnexion {
  code: CodeConnexion
  /** Code HTTP et message renvoyés par le serveur, pour diagnostiquer un cas imprévu. */
  detail?: string
}

export async function verifierMotDePasse(motDePasse: string): Promise<ResultatConnexion> {
  let reponse: Response
  try {
    reponse = await appelAdmin('/api/admin/login', motDePasse)
  } catch {
    return { code: 'erreur-reseau' }
  }

  // Le corps ne peut être lu qu'une fois : on le récupère en texte, puis on
  // tente de l'interpréter comme du JSON.
  const texte = await reponse.text().catch(() => '')
  let messageServeur = ''
  let corps: { ok?: boolean; erreur?: string } | null = null
  try {
    corps = JSON.parse(texte) as { ok?: boolean; erreur?: string }
    messageServeur = corps.erreur ?? ''
  } catch {
    corps = null
  }

  if (reponse.ok) {
    // Une réponse 200 ne suffit pas : en développement local, une adresse
    // /api inconnue renvoie la page HTML de l'application avec un code 200.
    // On exige donc la réponse JSON que seule la vraie fonction produit.
    return corps?.ok === true ? { code: 'ok' } : { code: 'fonctions-absentes' }
  }
  if (reponse.status === 401) return { code: 'mot-de-passe-incorrect' }
  // Vercel renvoie une page HTML 404 quand la fonction serveur n'existe pas,
  // typiquement si le "Root Directory" du projet ne pointe pas sur mariage-photos.
  if (reponse.status === 404) return { code: 'fonctions-absentes' }
  if (messageServeur.includes('pas configuré')) return { code: 'mot-de-passe-non-configure' }

  return {
    code: 'serveur-en-erreur',
    detail: `code ${reponse.status}${messageServeur ? ` — ${messageServeur}` : ''}`,
  }
}

export async function supprimerPhoto(id: string, motDePasse: string): Promise<void> {
  const reponse = await appelAdmin('/api/admin/delete-photo', motDePasse, { id })
  if (!reponse.ok) throw new Error('Échec de la suppression de la photo.')
}

export async function supprimerCommentaire(id: string, motDePasse: string): Promise<void> {
  const reponse = await appelAdmin('/api/admin/delete-comment', motDePasse, { id })
  if (!reponse.ok) throw new Error('Échec de la suppression du commentaire.')
}

export async function telechargerArchiveZip(motDePasse: string): Promise<void> {
  const reponse = await appelAdmin('/api/admin/export-zip', motDePasse)
  if (!reponse.ok) throw new Error("Échec de la création de l'archive.")

  const blob = await reponse.blob()
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = 'photos-mariage.zip'
  document.body.appendChild(lien)
  lien.click()
  lien.remove()
  URL.revokeObjectURL(url)
}
