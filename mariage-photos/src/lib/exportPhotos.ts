import JSZip from 'jszip'
import { supabase, urlPublique } from './supabase'
import { intituleDefi } from '../../defis.config'
import type { Photo } from './types'

/**
 * Export des photos effectué par le navigateur, et non par le serveur.
 *
 * L'ancienne version passait par une fonction Vercel, limitée à 60 secondes :
 * au-delà de quelques dizaines de photos elle expirait en erreur 504. Ici,
 * le navigateur télécharge les images depuis le stockage public et fabrique
 * l'archive lui-même : aucune limite de durée, et une progression visible.
 *
 * Aucune donnée n'est modifiée ni supprimée : tout est en lecture seule.
 */

/** Nombre de photos par archive, pour éviter de saturer la mémoire du navigateur. */
const PHOTOS_PAR_ARCHIVE = 150

/** Téléchargements simultanés. Au-delà, un réseau domestique sature sans gain. */
const TELECHARGEMENTS_SIMULTANES = 6

export type PhaseExport = 'liste' | 'telechargement' | 'compression' | 'termine'

export interface ProgressionExport {
  phase: PhaseExport
  total: number
  traitees: number
  partie: number
  nombreParties: number
}

export interface ResultatExport {
  nombreParties: number
  photosExportees: number
  echecs: string[]
}

export async function exporterToutesLesPhotos(
  onProgress: (progression: ProgressionExport) => void,
): Promise<ResultatExport> {
  onProgress({ phase: 'liste', total: 0, traitees: 0, partie: 0, nombreParties: 0 })

  const photos = await listerToutesLesPhotos()
  if (photos.length === 0) {
    throw new Error("Il n'y a aucune photo à télécharger pour le moment.")
  }

  const parties = decouperEnParties(photos, PHOTOS_PAR_ARCHIVE)
  const echecs: string[] = []
  const nomsUtilises = new Map<string, number>()
  let traitees = 0
  let photosExportees = 0

  for (const [index, part] of parties.entries()) {
    const zip = new JSZip()

    await pourChaqueAvecLimite(part, TELECHARGEMENTS_SIMULTANES, async (photo) => {
      try {
        const reponse = await fetch(urlPublique(photo.storage_path))
        if (!reponse.ok) throw new Error(`code ${reponse.status}`)
        zip.file(nomFichier(photo, nomsUtilises), await reponse.blob())
        photosExportees += 1
      } catch (err) {
        echecs.push(`${photo.storage_path} (${err instanceof Error ? err.message : 'erreur'})`)
      } finally {
        traitees += 1
        onProgress({
          phase: 'telechargement',
          total: photos.length,
          traitees,
          partie: index + 1,
          nombreParties: parties.length,
        })
      }
    })

    if (echecs.length > 0) {
      zip.file('PHOTOS-MANQUANTES.txt', `Photos non récupérées :\n\n${echecs.join('\n')}\n`)
    }

    onProgress({
      phase: 'compression',
      total: photos.length,
      traitees,
      partie: index + 1,
      nombreParties: parties.length,
    })

    // Les JPEG sont déjà compressés : les recompresser coûterait beaucoup de
    // temps processeur pour un gain de taille quasi nul.
    const archive = await zip.generateAsync({ type: 'blob', compression: 'STORE' })
    telecharger(archive, nomArchive(index + 1, parties.length))
  }

  onProgress({
    phase: 'termine',
    total: photos.length,
    traitees,
    partie: parties.length,
    nombreParties: parties.length,
  })

  return { nombreParties: parties.length, photosExportees, echecs }
}

/** Lit la table par pages : une requête ne renvoie jamais tout d'un coup. */
async function listerToutesLesPhotos(): Promise<Photo[]> {
  const TAILLE_LOT = 1000
  const toutes: Photo[] = []
  let debut = 0

  for (;;) {
    const { data, error } = await supabase
      .from('photos')
      .select('id, created_at, storage_path, auteur_prenom, largeur, hauteur, defi')
      .order('created_at', { ascending: true })
      .range(debut, debut + TAILLE_LOT - 1)

    if (error) throw new Error(`Lecture de la liste des photos impossible : ${error.message}`)
    if (!data || data.length === 0) break

    toutes.push(...(data as Photo[]))
    if (data.length < TAILLE_LOT) break
    debut += TAILLE_LOT
  }

  return toutes
}

function decouperEnParties<T>(elements: T[], taille: number): T[][] {
  const parties: T[][] = []
  for (let i = 0; i < elements.length; i += taille) {
    parties.push(elements.slice(i, i + taille))
  }
  return parties
}

/** Exécute le traitement sur tous les éléments, sans dépasser `limite` en parallèle. */
async function pourChaqueAvecLimite<T>(
  elements: T[],
  limite: number,
  traiter: (element: T) => Promise<void>,
): Promise<void> {
  let prochain = 0
  const ouvriers = Array.from({ length: Math.min(limite, elements.length) }, async () => {
    for (;;) {
      const index = prochain++
      if (index >= elements.length) return
      await traiter(elements[index])
    }
  })
  await Promise.all(ouvriers)
}

function nomFichier(photo: Photo, nomsUtilises: Map<string, number>): string {
  const date = new Date(photo.created_at).toISOString().slice(0, 10)
  const auteur = nettoyer(photo.auteur_prenom) || 'invite'
  const defi = photo.defi ? `_${nettoyer(intituleDefi(photo.defi) ?? photo.defi).slice(0, 30)}` : ''
  const base = `${date}_${auteur}${defi}`

  const compte = nomsUtilises.get(base) ?? 0
  nomsUtilises.set(base, compte + 1)
  return compte === 0 ? `${base}.jpg` : `${base}_${compte + 1}.jpg`
}

function nettoyer(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40)
}

function nomArchive(partie: number, total: number): string {
  if (total === 1) return 'photos-mariage.zip'
  return `photos-mariage-${partie}-sur-${total}.zip`
}

function telecharger(blob: Blob, nom: string): void {
  const url = URL.createObjectURL(blob)
  const lien = document.createElement('a')
  lien.href = url
  lien.download = nom
  document.body.appendChild(lien)
  lien.click()
  lien.remove()
  // Laisse au navigateur le temps de démarrer le téléchargement avant de
  // libérer l'URL : la révoquer trop tôt annule l'enregistrement.
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
