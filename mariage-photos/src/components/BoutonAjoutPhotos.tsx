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
    <div className="grid grid-cols-2 gap-3">
      <input
        ref={inputAppareil}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <input
        ref={inputPellicule}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={() => inputAppareil.current?.click()}
        className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-amber-400 py-4 text-violet-950 shadow-lg shadow-amber-900/30 active:scale-[0.98]"
      >
        <IconeAppareilPhoto />
        <span className="text-base font-bold">Prendre une photo</span>
      </button>
      <button
        type="button"
        onClick={() => inputPellicule.current?.click()}
        className="flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-amber-400 bg-violet-900/60 py-4 text-amber-100 active:scale-[0.98]"
      >
        <IconeGalerie />
        <span className="text-base font-bold">Depuis la pellicule</span>
      </button>
    </div>
  )
}

function IconeAppareilPhoto() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
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
    <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 16 5-5 4 4 3-3 6 6" />
      <circle cx="8" cy="9" r="1.5" />
    </svg>
  )
}
