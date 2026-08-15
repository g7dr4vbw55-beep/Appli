import type { ReactNode } from 'react'
import { defisTries } from '../../defis.config'
import weddingConfig from '../../wedding.config'

export type ChoixPresentation = 'album' | 'defis'

interface Props {
  onChoisir: (choix: ChoixPresentation) => void
}

/**
 * Écran d'accueil du jeu, affiché à chaque ouverture de la page.
 *
 * Deux propositions séparées plutôt qu'une seule explication : beaucoup
 * d'invités veulent simplement envoyer leurs photos, et une présentation
 * centrée sur les défis leur laisserait croire que le jeu est obligatoire.
 * Chaque bouton mène directement à l'onglet correspondant.
 */
export default function Presentation({ onChoisir }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-prune-950/85 backdrop-blur-sm sm:items-center">
      {/* Mise en page volontairement compacte : les deux boutons sont la seule
          façon de fermer cet écran, ils doivent donc tenir ensemble sur les
          plus petits téléphones, sans obliger à faire défiler. */}
      <div className="apparition max-h-[96dvh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t-2 border-corail-500/40 bg-prune-900 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:rounded-3xl sm:border-2">
        <div className="text-center">
          <h2 className="text-lg font-bold leading-snug text-creme">{weddingConfig.eventTitle}</h2>
          <p className="mt-1 text-base text-mauve-300">Deux façons de participer !</p>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          <Carte
            emoji="📷"
            couleur="corail"
            titre="Je partage mes photos"
            bouton="Aller à l'album"
            onChoisir={() => onChoisir('album')}
          >
            Prenez vos photos et envoyez-les. Elles rejoignent l'album commun, que tout le monde peut voir et
            commenter.
          </Carte>

          <Carte
            emoji="🎯"
            couleur="rosee"
            titre="Je joue aux défis"
            bouton="Voir les défis"
            onChoisir={() => onChoisir('defis')}
          >
            {defisTries.length} photos rigolotes à réaliser. Touchez un défi, prenez la photo : elle se coche
            toute seule.
          </Carte>
        </div>

        <p className="mt-3.5 text-center text-sm text-mauve-500">
          Vous pourrez changer d'onglet à tout moment.
        </p>
      </div>
    </div>
  )
}

function Carte({
  emoji,
  couleur,
  titre,
  bouton,
  onChoisir,
  children,
}: {
  emoji: string
  couleur: 'corail' | 'rosee'
  titre: string
  bouton: string
  onChoisir: () => void
  children: ReactNode
}) {
  const estCorail = couleur === 'corail'
  return (
    <section
      className={[
        'rounded-3xl border-2 p-3.5',
        estCorail ? 'border-corail-500/50 bg-corail-500/10' : 'border-rosee-400/50 bg-rosee-400/10',
      ].join(' ')}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={[
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl',
            estCorail ? 'bg-corail-500' : 'bg-rosee-400',
          ].join(' ')}
        >
          {emoji}
        </span>
        <h3 className="text-lg font-bold leading-tight text-creme">{titre}</h3>
      </div>

      <p className="mt-2.5 text-sm leading-snug text-mauve-300">{children}</p>

      <button
        type="button"
        onClick={onChoisir}
        className={[
          'mt-3 w-full rounded-full px-6 py-3.5 text-lg font-bold text-prune-950 transition active:scale-[0.97]',
          estCorail ? 'bg-corail-500 active:bg-corail-600' : 'bg-rosee-400 active:bg-rosee-300',
        ].join(' ')}
      >
        {bouton}
      </button>
    </section>
  )
}
