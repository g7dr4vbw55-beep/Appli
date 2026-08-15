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

export async function verifierMotDePasse(motDePasse: string): Promise<boolean> {
  const reponse = await appelAdmin('/api/admin/login', motDePasse)
  return reponse.ok
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
