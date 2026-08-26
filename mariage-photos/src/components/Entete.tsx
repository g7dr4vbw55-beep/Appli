import weddingConfig from '../../wedding.config'

interface Props {
  prenom: string
}

export default function Entete({ prenom }: Props) {
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
          {/* Nom court plutôt que titre complet : la barre est étroite, et
              le titre entier y serait tronqué en plein milieu. Il reste
              affiché sur les écrans d'entrée. */}
          <h1 className="truncate text-base font-bold leading-tight text-creme">
            {weddingConfig.shortName}
          </h1>
          <p className="truncate text-sm text-mauve-400">Bonjour {prenom}</p>
        </div>
      </div>
    </header>
  )
}
