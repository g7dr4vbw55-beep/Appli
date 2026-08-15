import { useCallback, useState } from 'react'
import { compresserPhoto } from './compressImage'
import { supabase, BUCKET_NAME, urlPublique } from './supabase'
import type { Photo, PhotoAvecUrl } from './types'

export type StatutEnvoi = 'compression' | 'envoi' | 'termine' | 'erreur'

export interface ElementFile {
  id: string
  nomAffiche: string
  previewUrl: string
  statut: StatutEnvoi
  progression: number // 0 à 100
  messageErreur?: string
  fichierOriginal: File
}

export function useUploadQueue(prenom: string, onPhotoEnvoyee: (photo: PhotoAvecUrl) => void) {
  const [elements, setElements] = useState<ElementFile[]>([])

  const majElement = useCallback((id: string, patch: Partial<ElementFile>) => {
    setElements((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)))
  }, [])

  const traiterElement = useCallback(
    async (id: string, fichierOriginal: File) => {
      try {
        majElement(id, { statut: 'compression', progression: 0, messageErreur: undefined })
        const { fichier, largeur, hauteur } = await compresserPhoto(fichierOriginal)

        majElement(id, { statut: 'envoi', progression: 0 })
        const cheminStockage = `${crypto.randomUUID()}.jpg`
        await televerserAvecProgression(fichier, cheminStockage, (pct) => {
          majElement(id, { progression: pct })
        })

        const { data, error } = await supabase
          .from('photos')
          .insert({
            storage_path: cheminStockage,
            auteur_prenom: prenom,
            largeur,
            hauteur,
          })
          .select()
          .single()
        if (error || !data) throw new Error('enregistrement')

        majElement(id, { statut: 'termine', progression: 100 })
        onPhotoEnvoyee({ ...(data as Photo), url: urlPublique(cheminStockage) })
      } catch (err) {
        majElement(id, { statut: 'erreur', messageErreur: messageErreurLisible(err) })
      }
    },
    [majElement, prenom, onPhotoEnvoyee],
  )

  const ajouterFichiers = useCallback(
    (fichiers: File[]) => {
      const nouveaux: ElementFile[] = fichiers.map((f) => ({
        id: crypto.randomUUID(),
        nomAffiche: f.name,
        previewUrl: URL.createObjectURL(f),
        statut: 'compression',
        progression: 0,
        fichierOriginal: f,
      }))
      setElements((prev) => [...nouveaux, ...prev])
      nouveaux.forEach((n) => {
        void traiterElement(n.id, n.fichierOriginal)
      })
    },
    [traiterElement],
  )

  const relancer = useCallback(
    (id: string) => {
      const element = elements.find((e) => e.id === id)
      if (!element) return
      void traiterElement(id, element.fichierOriginal)
    },
    [elements, traiterElement],
  )

  const retirer = useCallback((id: string) => {
    setElements((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const enCours = elements.some((e) => e.statut === 'compression' || e.statut === 'envoi')

  return { elements, ajouterFichiers, relancer, retirer, enCours }
}

function televerserAvecProgression(
  fichier: File,
  cheminStockage: string,
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${cheminStockage}`
    const cle = import.meta.env.VITE_SUPABASE_ANON_KEY
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    // On envoie volontairement la même clé dans "apikey" et dans "Authorization",
    // exactement comme le fait supabase-js. C'est indispensable pour les anciennes
    // clés "anon" (des JWT), et cela reste accepté pour les nouvelles clés
    // "publishable" tant que les deux en-têtes portent la même valeur.
    // Ne dissociez pas ces deux lignes : l'envoi des photos cesserait de
    // fonctionner avec l'un ou l'autre des deux types de clés.
    xhr.setRequestHeader('apikey', cle)
    xhr.setRequestHeader('Authorization', `Bearer ${cle}`)
    xhr.setRequestHeader('Content-Type', fichier.type || 'image/jpeg')
    xhr.setRequestHeader('x-upsert', 'false')
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new Error(xhr.status === 0 ? 'reseau' : `http-${xhr.status}`))
    }
    xhr.onerror = () => reject(new Error('reseau'))
    xhr.ontimeout = () => reject(new Error('reseau'))
    xhr.send(fichier)
  })
}

function messageErreurLisible(err: unknown): string {
  const msg = err instanceof Error ? err.message : ''
  if (msg === 'reseau') return 'Pas de connexion internet stable. Vérifiez votre réseau et réessayez.'
  if (msg.startsWith('http-5')) return 'Le service est momentanément indisponible. Réessayez dans un instant.'
  if (msg === 'enregistrement') return "La photo est envoyée mais n'a pas pu être enregistrée. Réessayez."
  return "Une erreur est survenue pendant l'envoi. Appuyez sur réessayer."
}
