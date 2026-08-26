const CLE_PRENOM = 'mariage:prenom'
const CLE_CODE_ACCES = 'mariage:code-acces-valide'

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
