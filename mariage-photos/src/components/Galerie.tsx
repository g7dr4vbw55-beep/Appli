import { useCallback, useEffect, useRef, useState } from 'react'
import { chargerPagePhotos } from '../lib/api'
import type { PhotoAvecUrl } from '../lib/types'

interface Props {
  photosAjoutees: PhotoAvecUrl[]
  onPhotoClic: (photo: PhotoAvecUrl) => void
}

export default function Galerie({ photosAjoutees, onPhotoClic }: Props) {
  const [photos, setPhotos] = useState<PhotoAvecUrl[]>([])
  const [chargement, setChargement] = useState(true)
  const [fini, setFini] = useState(false)
  const [erreur, setErreur] = useState(false)
  const sentinelleRef = useRef<HTMLDivElement>(null)

  const chargerSuite = useCallback(async () => {
    setChargement(true)
    setErreur(false)
    try {
      const dernierePhoto = photos[photos.length - 1]
      const { photos: nouvelles, fini: estFini } = await chargerPagePhotos(dernierePhoto?.created_at)
      setPhotos((prev) => dedupliquer([...prev, ...nouvelles]))
      setFini(estFini)
    } catch {
      setErreur(true)
    } finally {
      setChargement(false)
    }
  }, [photos])

  // Chargement initial de la galerie
  useEffect(() => {
    let annule = false
    setChargement(true)
    setErreur(false)
    chargerPagePhotos()
      .then(({ photos: premieres, fini: estFini }) => {
        if (annule) return
        setPhotos(premieres)
        setFini(estFini)
      })
      .catch(() => {
        if (!annule) setErreur(true)
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })
    return () => {
      annule = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const sentinelle = sentinelleRef.current
    if (!sentinelle || fini) return
    const observateur = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !chargement) {
          void chargerSuite()
        }
      },
      { rootMargin: '400px' },
    )
    observateur.observe(sentinelle)
    return () => observateur.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fini, chargement, chargerSuite])

  const toutesLesPhotos = dedupliquer([...photosAjoutees, ...photos])

  if (chargement && toutesLesPhotos.length === 0) {
    return <p className="px-4 py-10 text-center text-violet-400">Chargement des photos…</p>
  }

  if (toutesLesPhotos.length === 0) {
    return (
      <p className="px-4 py-10 text-center text-violet-400">
        Aucune photo pour l'instant. Soyez le premier à en ajouter une !
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-1 pb-8">
      <div className="grid grid-cols-3 gap-1">
        {toutesLesPhotos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => onPhotoClic(photo)}
            className="aspect-square overflow-hidden bg-violet-900"
          >
            <img
              src={photo.url}
              alt={`Photo ajoutée par ${photo.auteur_prenom}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
      <div ref={sentinelleRef} className="h-4" />
      {chargement && toutesLesPhotos.length > 0 && (
        <p className="py-4 text-center text-sm text-violet-400">Chargement…</p>
      )}
      {erreur && (
        <div className="py-4 text-center">
          <p className="text-sm text-rose-300">Impossible de charger plus de photos.</p>
          <button
            type="button"
            onClick={() => void chargerSuite()}
            className="mt-2 text-sm font-bold text-amber-300 underline"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  )
}

function dedupliquer(photos: PhotoAvecUrl[]): PhotoAvecUrl[] {
  const vues = new Set<string>()
  return photos.filter((p) => {
    if (vues.has(p.id)) return false
    vues.add(p.id)
    return true
  })
}
