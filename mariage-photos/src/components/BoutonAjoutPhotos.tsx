import { useRef, type ChangeEvent } from 'react'

interface Props {
  onFichiers: (fichiers: File[]) => void
}

export default function BoutonAjoutPhotos({ onFichiers }: Props) {
  const inputAppareil = useRef<HTMLInputElement>(null)
  const inputPellicule = useRef<HTMLInputElement>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const fichiers = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'))
    if (fichiers.length > 0) onFichiers(fichiers)
    e.target.value = ''
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputAppareil}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <input ref={inputPellicule} type="file" accept="image/*" multiple className="hidden" onChange={handleChange} />

      {/* L'action principale occupe toute la largeur : c'est celle qu'un
          invité doit trouver sans réfléchir, d'une main, en pleine soirée. */}
      <button
        type="button"
        onClick={() => inputAppareil.current?.click()}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-corail-500 px-6 py-5 text-prune-950 shadow-lg shadow-corail-600/30 transition active:scale-[0.98] active:bg-corail-600"
      >
        <IconeAppareilPhoto />
        <span className="text-xl font-bold">Prendre une photo</span>
      </button>

      <button
        type="button"
        onClick={() => inputPellicule.current?.click()}
        className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-prune-600 bg-prune-850/70 px-6 py-4 text-rosee-300 transition active:scale-[0.98] active:bg-prune-800"
      >
        <IconeGalerie />
        <span className="text-lg font-bold">Choisir dans mes photos</span>
      </button>
    </div>
  )
}

function IconeAppareilPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-7 w-7">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 0 1 2-2h1.5l1-1.5h9l1 1.5H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
      />
      <circle cx="12" cy="13.5" r="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconeGalerie() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.2} stroke="currentColor" className="h-6 w-6">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 16 5-5 4 4 3-3 6 6" />
      <circle cx="8.5" cy="9" r="1.4" />
    </svg>
  )
}
