import { defisTries } from '../../defis.config'

interface Props {
  onFermer: () => void
}

/**
 * Présentation du jeu des défis, affichée à chaque ouverture de la page.
 *
 * Volontairement non mémorisée : les invités arrivent à des moments
 * différents, se passent le téléphone et rouvrent l'application plusieurs
 * fois dans la soirée. Mieux vaut réexpliquer une fois de trop que laisser
 * quelqu'un passer à côté du jeu.
 */
export default function PresentationJeu({ onFermer }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-prune-950/80 backdrop-blur-sm sm:items-center">
      <div className="apparition max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t-2 border-corail-500/40 bg-prune-900 px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-7 sm:rounded-3xl sm:border-2">
        <div className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-corail-500 text-3xl">
            📸
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight text-creme">Le jeu des défis photo</h2>
          <p className="mt-2 text-base leading-relaxed text-mauve-300">
            {defisTries.length} photos à réaliser pendant la soirée. À vous de jouer !
          </p>
        </div>

        <ol className="mt-7 flex flex-col gap-5">
          <Etape numero={1} titre="Ouvrez l'onglet Défis">
            Vous y trouverez la liste des {defisTries.length} photos à réaliser, du selfie de table à l'ouverture
            du bal.
          </Etape>
          <Etape numero={2} titre="Touchez un défi">
            L'appareil photo s'ouvre aussitôt. Prenez la photo : elle est rattachée toute seule au bon défi.
          </Etape>
          <Etape numero={3} titre="Cochez, et recommencez">
            Chaque défi réussi se coche, avec votre score en haut de la page. Essayez de tous les faire !
          </Etape>
        </ol>

        <div className="mt-6 rounded-2xl bg-prune-850/80 px-4 py-3">
          <p className="text-sm leading-relaxed text-mauve-300">
            Plusieurs invités peuvent réaliser le même défi, et vous pouvez en refaire un autant de fois que
            vous voulez. Vous pouvez aussi envoyer des photos libres, sans défi, depuis l'onglet Album.
          </p>
        </div>

        <button
          type="button"
          onClick={onFermer}
          autoFocus
          className="mt-6 w-full rounded-full bg-corail-500 px-6 py-5 text-xl font-bold text-prune-950 shadow-lg shadow-corail-600/30 transition active:scale-[0.97] active:bg-corail-600"
        >
          C'est parti !
        </button>
      </div>
    </div>
  )
}

function Etape({
  numero,
  titre,
  children,
}: {
  numero: number
  titre: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rosee-400 text-base font-bold text-prune-950">
        {numero}
      </span>
      <div className="min-w-0">
        <p className="text-base font-bold text-creme">{titre}</p>
        <p className="mt-1 text-sm leading-relaxed text-mauve-300">{children}</p>
      </div>
    </li>
  )
}
