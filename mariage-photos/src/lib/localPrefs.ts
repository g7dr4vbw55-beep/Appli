const CLE_PRENOM = 'mariage:prenom'
const CLE_CODE_ACCES = 'mariage:code-acces-valide'
const CLE_DEFIS_ACCOMPLIS = 'mariage:defis-accomplis'

export function getPrenomEnregistre(): string | null {
  return localStorage.getItem(CLE_PRENOM)
}

export function enregistrerPrenom(prenom: string): void {
  localStorage.setItem(CLE_PRENOM, prenom.trim())
}

export function getAccesValide(): boolean {
  return localStorage.getItem(CLE_CODE_ACCES) === 'oui'
}

export function enregistrerAccesValide(): void {
  localStorage.setItem(CLE_CODE_ACCES, 'oui')
}

/**
 * Défis déjà réalisés depuis cet appareil.
 *
 * Stocké localement plutôt que déduit du serveur : sans comptes, deux invités
 * peuvent porter le même prénom, et l'appareil est le seul repère fiable de
 * « ce que j'ai fait, moi ».
 */
export function getDefisAccomplis(): string[] {
  try {
    const brut = localStorage.getItem(CLE_DEFIS_ACCOMPLIS)
    const valeur: unknown = brut ? JSON.parse(brut) : []
    return Array.isArray(valeur) ? valeur.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

export function marquerDefiAccompli(idDefi: string): void {
  const actuels = getDefisAccomplis()
  if (actuels.includes(idDefi)) return
  localStorage.setItem(CLE_DEFIS_ACCOMPLIS, JSON.stringify([...actuels, idDefi]))
}
