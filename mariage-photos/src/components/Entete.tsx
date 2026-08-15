import weddingConfig from '../../wedding.config'

interface Props {
  prenom: string
  onAide: () => void
}

export default function Entete({ prenom, onAide }: Props) {
  return (
    <header className="sticky top-0 z-20 border-b border-prune-700/60 bg-prune-950/85 px-4 py-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <svg viewBox="0 0 32 30" aria-hidden="true" className="h-7 w-7 shrink-0">
          <path
            d="M16 29S1 19.5 1 10.2A8.2 8.2 0 0 1 16 5.6 8.2 8.2 0 0 1 31 10.2C31 19.5 16 29 16 29Z"
            fill="var(--color-corail-500)"
          />
        </svg>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold leading-tight text-creme">
            {weddingConfig.eventTitle}
          </h1>
          <p className="truncate text-sm text-mauve-400">Bonjour {prenom}</p>
        </div>
        <button
          type="button"
          onClick={onAide}
          aria-label="Revoir les règles du jeu"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-prune-600 text-lg font-bold text-mauve-300 active:bg-prune-800"
        >
          ?
        </button>
      </div>
    </header>
  )
}
