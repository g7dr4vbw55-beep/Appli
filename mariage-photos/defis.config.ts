/**
 * Liste des défis photo proposés aux invités pendant la soirée.
 *
 * Modifiez librement ce fichier : ajoutez, retirez ou renommez des défis,
 * sans toucher au reste du code.
 *
 *   id       : identifiant court et STABLE, enregistré avec chaque photo.
 *              Ne le changez plus une fois la soirée commencée, sinon les
 *              photos déjà envoyées ne seraient plus rattachées au défi.
 *   intitule : le texte lu par les invités.
 *   ordre    : ordre d'affichage, du plus petit au plus grand.
 */
export interface Defi {
  id: string
  intitule: string
  ordre: number
}

const defis: Defi[] = [
  { id: 'arche', intitule: 'Une photo devant l\'arche fleurie', ordre: 1 },
  { id: 'miroir', intitule: 'Une photo devant le miroir de bienvenue', ordre: 2 },
  { id: 'banniere', intitule: 'Prendre une photo avec la bannière Morgane et Sofiane', ordre: 3 },
  { id: 'punch', intitule: 'Un verre rempli à la fontaine à punch', ordre: 4 },
  { id: 'table', intitule: 'Un selfie avec toute ta table', ordre: 5 },
  { id: 'lunettes', intitule: 'Prendre un selfie avec les lunettes personnalisées M & S', ordre: 6 },
  { id: 'maries-surpris', intitule: 'Les mariés surpris sans qu\'ils te voient', ordre: 7 },
  { id: 'discours', intitule: 'Un témoin en plein discours', ordre: 8 },
  { id: 'jeune-agee', intitule: 'La plus jeune et la plus âgée de la soirée sur la même photo', ordre: 9 },
  { id: 'mr-mrs', intitule: 'Une photo pendant le Mr & Mrs', ordre: 10 },
  { id: 'ouverture-bal', intitule: 'L\'ouverture du bal', ordre: 11 },
  { id: 'rencontre', intitule: 'Deux invités qui ne se connaissaient pas avant aujourd\'hui', ordre: 12 },
  { id: 'dernier-debout', intitule: 'Le dernier debout sur la piste', ordre: 13 },
]

/** Défis triés, tels qu'ils doivent être affichés. */
export const defisTries: Defi[] = [...defis].sort((a, b) => a.ordre - b.ordre)

/** Retrouve l'intitulé d'un défi à partir de son identifiant. */
export function intituleDefi(id: string | null | undefined): string | null {
  if (!id) return null
  return defis.find((d) => d.id === id)?.intitule ?? null
}

export default defis
