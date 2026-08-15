import weddingConfig from '../../wedding.config'

export default function Entete({ prenom }: { prenom: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-violet-800/60 bg-violet-950/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-amber-100 leading-tight">{weddingConfig.eventTitle}</h1>
          <p className="text-sm text-violet-300">Bonjour {prenom}</p>
        </div>
      </div>
    </header>
  )
}
