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
  { id: 'punch', intitule: 'Un verre rempli à la fontaine à punch', ordre: 3 },
  { id: 'table', intitule: 'Un selfie avec toute ta table', ordre: 4 },
  { id: 'maries-surpris', intitule: 'Les mariés surpris sans qu\'ils te voient', ordre: 5 },
  { id: 'discours', intitule: 'Un témoin en plein discours', ordre: 6 },
  { id: 'jeune-agee', intitule: 'La plus jeune et la plus âgée de la soirée sur la même photo', ordre: 7 },
  { id: 'mr-mrs', intitule: 'Une photo pendant le Mr & Mrs', ordre: 8 },
  { id: 'ouverture-bal', intitule: 'L\'ouverture du bal', ordre: 9 },
  { id: 'rencontre', intitule: 'Deux invités qui ne se connaissaient pas avant aujourd\'hui', ordre: 10 },
  { id: 'dernier-debout', intitule: 'Le dernier debout sur la piste', ordre: 11 },
]

/** Défis triés, tels qu'ils doivent être affichés. */
export const defisTries: Defi[] = [...defis].sort((a, b) => a.ordre - b.ordre)

/** Retrouve l'intitulé d'un défi à partir de son identifiant. */
export function intituleDefi(id: string | null | undefined): string | null {
  if (!id) return null
  return defis.find((d) => d.id === id)?.intitule ?? null
}

export default defis
