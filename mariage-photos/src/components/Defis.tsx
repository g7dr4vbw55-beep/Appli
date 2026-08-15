import { useRef, type ChangeEvent } from 'react'
import { defisTries, type Defi } from '../../defis.config'
import { getDefisAccomplis } from '../lib/localPrefs'

interface Props {
  /** Nombre de défis marqués accomplis, remonté pour rafraîchir l'affichage après un envoi. */
  versionAccomplis: number
  onFichiers: (fichiers: File[], defi: string) => void
  onVoirPhotos: (defi: Defi) => void
}

export default function Defis({ versionAccomplis, onFichiers, onVoirPhotos }: Props) {
  const inputAppareil = useRef<HTMLInputElement>(null)
  const inputPellicule = useRef<HTMLInputElement>(null)
  // Le défi en attente du choix de fichier, gardé dans une référence et non
  // dans un état : la mise à jour doit être visible immédiatement par le
  // gestionnaire de sélection, sans attendre un nouveau rendu.
  const defiEnCours = useRef<string | null>(null)

  const accomplis = new Set(getDefisAccomplis())
  // versionAccomplis force la relecture du stockage local après chaque envoi.
  void versionAccomplis

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'))
    const defi = defiEnCours.current
    if (fichiers.length > 0 && defi) onFichiers(fichiers, defi)
    e.target.value = ''
    defiEnCours.current = null
  }

  function ouvrirAppareil(defi: Defi) {
    defiEnCours.current = defi.id
    inputAppareil.current?.click()
  }

  function ouvrirPellicule(defi: Defi) {
    defiEnCours.current = defi.id
    inputPellicule.current?.click()
  }

  const nombreAccomplis = defisTries.filter((d) => accomplis.has(d.id)).length

  return (
    <div className="mx-auto max-w-2xl px-4 pb-10">
      <input
        ref={inputAppareil}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <input ref={inputPellicule} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />

      <Compteur accomplis={nombreAccomplis} total={defisTries.length} />

      <ul className="mt-5 flex flex-col gap-2.5">
        {defisTries.map((defi) => {
          const fait = accomplis.has(defi.id)
          return (
            <li
              key={defi.id}
              className={[
                'flex items-stretch gap-2 rounded-2xl border transition-colors',
                fait ? 'border-rosee-400/50 bg-rosee-400/10' : 'border-prune-700/70 bg-prune-850/70',
              ].join(' ')}
            >
              {/* Toucher le défi ouvre directement l'appareil photo : c'est
                  le geste attendu en pleine soirée. */}
              <button
                type="button"
                onClick={() => ouvrirAppareil(defi)}
                className="flex flex-1 items-center gap-3 px-3 py-4 text-left"
              >
                <Pastille fait={fait} />
                <span
                  className={[
                    'text-base font-semibold leading-snug',
                    fait ? 'text-rosee-300' : 'text-creme',
                  ].join(' ')}
                >
                  {defi.intitule}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-1 pr-2">
                <button
                  type="button"
                  onClick={() => ouvrirPellicule(defi)}
                  aria-label={`Choisir une photo existante pour : ${defi.intitule}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-mauve-300 active:bg-prune-800"
                >
                  <IconeGalerie />
                </button>
                {fait && (
                  <button
                    type="button"
                    onClick={() => onVoirPhotos(defi)}
                    aria-label={`Voir les photos du défi : ${defi.intitule}`}
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-rosee-300 active:bg-prune-800"
                  >
                    <IconeOeil />
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-6 text-center text-sm leading-relaxed text-mauve-500">
        Touchez un défi pour prendre la photo, ou l'icône à droite pour en choisir une déjà prise.
        Plusieurs invités peuvent réaliser le même défi.
      </p>
    </div>
  )
}

function Compteur({ accomplis, total }: { accomplis: number; total: number }) {
  const pourcentage = total === 0 ? 0 : Math.round((accomplis / total) * 100)
  return (
    <div className="rounded-2xl border border-prune-700/70 bg-prune-850/70 px-4 py-4">
      <div className="flex items-baseline justify-between">
        <p className="text-lg font-bold text-creme">
          {accomplis} défi{accomplis > 1 ? 's' : ''} sur {total}
        </p>
        {accomplis === total && total > 0 && (
          <span className="text-sm font-bold text-rosee-300">Tout est fait, bravo !</span>
        )}
      </div>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-prune-950">
        <div
          className="h-full rounded-full bg-corail-500 transition-all duration-500"
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  )
}

function Pastille({ fait }: { fait: boolean }) {
  if (fait) {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rosee-400 text-prune-950">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
          <path
            d="m5 13 4 4L19 7"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
  return <span className="h-8 w-8 shrink-0 rounded-full border-2 border-prune-600" />
}

function IconeGalerie() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 16 5-5 4 4 3-3 6 6" />
      <circle cx="8.5" cy="9" r="1.4" />
    </svg>
  )
}

function IconeOeil() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
