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
    return <SquelettesGrille />
  }

  if (toutesLesPhotos.length === 0) {
    return <GalerieVide />
  }

  return (
    <div className="mx-auto max-w-2xl px-3 pb-10">
      <h2 className="mb-3 px-1 text-sm font-bold uppercase tracking-widest text-mauve-500">
        L'album — {toutesLesPhotos.length} photo{toutesLesPhotos.length > 1 ? 's' : ''}
      </h2>

      {/* Mosaïque : une photo sur sept est mise en avant sur un carré double.
          La taille des tuiles ordinaires fixe la hauteur des rangées, donc la
          grande tuile reste parfaitement carrée et alignée. */}
      <div className="grid grid-flow-dense grid-cols-3 gap-2">
        {toutesLesPhotos.map((photo, index) => {
          const enAvant = index % 7 === 0
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => onPhotoClic(photo)}
              className={[
                'apparition group relative aspect-square overflow-hidden rounded-2xl bg-prune-800',
                enAvant ? 'col-span-2 row-span-2' : '',
              ].join(' ')}
            >
              <img
                src={photo.url}
                alt={`Photo ajoutée par ${photo.auteur_prenom}`}
                loading="lazy"
                className="h-full w-full object-cover transition duration-300 group-active:scale-105"
              />
              {/* Le prénom n'apparaît que sur les grandes tuiles : sur une
                  petite, il deviendrait illisible et salirait la mosaïque. */}
              {enAvant && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-prune-950/85 to-transparent px-3 pb-2 pt-8 text-left text-sm font-semibold text-creme">
                  {photo.auteur_prenom}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div ref={sentinelleRef} className="h-4" />

      {chargement && toutesLesPhotos.length > 0 && (
        <p className="pulsation py-5 text-center text-sm text-mauve-400">Chargement des photos…</p>
      )}

      {fini && toutesLesPhotos.length > 6 && (
        <p className="py-6 text-center text-sm text-mauve-500">Vous avez tout vu !</p>
      )}

      {erreur && (
        <div className="py-5 text-center">
          <p className="text-sm text-corail-300">Impossible de charger plus de photos.</p>
          <button
            type="button"
            onClick={() => void chargerSuite()}
            className="mt-3 rounded-full bg-corail-500 px-5 py-2.5 text-sm font-bold text-prune-950"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  )
}

function SquelettesGrille() {
  return (
    <div className="mx-auto max-w-2xl px-3 pb-10">
      <div className="mb-3 h-4 w-32 rounded-full bg-prune-800 pulsation" />
      <div className="grid grid-flow-dense grid-cols-3 gap-2">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={['pulsation aspect-square rounded-2xl bg-prune-800', i === 0 ? 'col-span-2 row-span-2' : ''].join(
              ' ',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function GalerieVide() {
  return (
    <div className="mx-auto max-w-sm px-6 py-12 text-center">
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mx-auto h-16 w-16 text-prune-600">
        <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth={1.8} />
        <path
          d="m3 16 5-5 4 4 3-3 6 6"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="mt-5 text-lg font-semibold text-creme">L'album est encore vide</p>
      <p className="mt-2 text-base leading-relaxed text-mauve-400">
        Soyez le premier à immortaliser la soirée ! Appuyez sur le bouton tout en haut.
      </p>
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
