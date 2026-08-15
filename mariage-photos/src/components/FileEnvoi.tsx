import type { ElementFile } from '../lib/useUploadQueue'

interface Props {
  elements: ElementFile[]
  onRelancer: (id: string) => void
  onRetirer: (id: string) => void
}

export default function FileEnvoi({ elements, onRelancer, onRetirer }: Props) {
  if (elements.length === 0) return null

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 pb-4">
      {elements.map((e) => (
        <div
          key={e.id}
          className={[
            'apparition flex items-center gap-3 rounded-2xl border p-2.5',
            e.statut === 'erreur'
              ? 'border-corail-500/70 bg-corail-600/15'
              : 'border-prune-700/70 bg-prune-850/70',
          ].join(' ')}
        >
          <img src={e.previewUrl} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />

          <div className="min-w-0 flex-1">
            {e.statut === 'erreur' ? (
              <>
                <p className="text-sm font-semibold leading-snug text-corail-300">{e.messageErreur}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onRelancer(e.id)}
                    className="rounded-full bg-corail-500 px-4 py-2 text-sm font-bold text-prune-950 active:bg-corail-600"
                  >
                    Réessayer
                  </button>
                  <button
                    type="button"
                    onClick={() => onRetirer(e.id)}
                    className="rounded-full border border-prune-600 px-4 py-2 text-sm font-semibold text-mauve-300"
                  >
                    Annuler
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-mauve-300">
                  {e.statut === 'compression' && 'Préparation…'}
                  {e.statut === 'envoi' && `Envoi… ${e.progression}%`}
                  {e.statut === 'termine' && 'Photo ajoutée à l\'album !'}
                </p>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-prune-950">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-300',
                      e.statut === 'termine' ? 'bg-rosee-400' : 'bg-corail-500',
                    ].join(' ')}
                    style={{ width: `${e.statut === 'termine' ? 100 : e.progression}%` }}
                  />
                </div>
              </>
            )}
          </div>

          {e.statut === 'termine' && (
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0 text-rosee-400">
              <path
                d="m5 13 4 4L19 7"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}
