import type { ElementFile } from '../lib/useUploadQueue'

interface Props {
  elements: ElementFile[]
  onRelancer: (id: string) => void
  onRetirer: (id: string) => void
}

export default function FileEnvoi({ elements, onRelancer, onRetirer }: Props) {
  if (elements.length === 0) return null

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 pb-2">
      {elements.map((e) => (
        <div
          key={e.id}
          className="flex items-center gap-3 rounded-xl border border-violet-800/60 bg-violet-900/50 p-2"
        >
          <img src={e.previewUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            {e.statut === 'erreur' ? (
              <>
                <p className="text-sm font-semibold text-rose-300">{e.messageErreur}</p>
                <div className="mt-1 flex gap-3">
                  <button
                    type="button"
                    onClick={() => onRelancer(e.id)}
                    className="text-sm font-bold text-amber-300 underline underline-offset-2"
                  >
                    Réessayer
                  </button>
                  <button
                    type="button"
                    onClick={() => onRetirer(e.id)}
                    className="text-sm text-violet-400 underline underline-offset-2"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="truncate text-sm text-violet-200">
                  {e.statut === 'compression' && 'Préparation de la photo…'}
                  {e.statut === 'envoi' && 'Envoi en cours…'}
                  {e.statut === 'termine' && 'Photo envoyée !'}
                </p>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-violet-950">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${e.statut === 'termine' ? 100 : e.progression}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
