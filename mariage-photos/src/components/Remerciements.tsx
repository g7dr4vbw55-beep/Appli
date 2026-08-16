import remerciements from '../../remerciements.config'

/**
 * Page de remerciements : le mot des mariés, en lecture seule.
 *
 * Aucune donnée n'est chargée : la page s'affiche instantanément, même sans
 * réseau, contrairement à l'album et aux défis.
 */
export default function Remerciements() {
  return (
    <div className="mx-auto max-w-xl px-6 pb-16 pt-6">
      <div className="rounded-3xl border border-prune-700/70 bg-prune-850/60 px-6 py-9 text-center">
        <Coeurs />

        <h2 className="mt-5 text-2xl font-bold leading-tight text-creme">{remerciements.titre}</h2>

        <div className="mt-6 flex flex-col gap-5">
          {remerciements.paragraphes.map((paragraphe) => (
            <p key={paragraphe} className="text-base leading-relaxed text-mauve-300">
              {paragraphe}
            </p>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-prune-700" />
          <span className="text-rosee-300">♥</span>
          <span className="h-px flex-1 bg-prune-700" />
        </div>

        <p className="mt-6 font-serif text-2xl italic text-rosee-300">{remerciements.signature}</p>
      </div>
    </div>
  )
}

/** Trois cœurs décoratifs, dessinés en SVG pour ne rien charger sur le réseau. */
function Coeurs() {
  return (
    <div className="flex items-end justify-center gap-2" aria-hidden="true">
      <Coeur taille="h-6 w-6" couleur="var(--color-rosee-400)" />
      <Coeur taille="h-10 w-10" couleur="var(--color-corail-500)" />
      <Coeur taille="h-6 w-6" couleur="var(--color-rosee-400)" />
    </div>
  )
}

function Coeur({ taille, couleur }: { taille: string; couleur: string }) {
  return (
    <svg viewBox="0 0 32 30" className={taille}>
      <path
        d="M16 29S1 19.5 1 10.2A8.2 8.2 0 0 1 16 5.6 8.2 8.2 0 0 1 31 10.2C31 19.5 16 29 16 29Z"
        fill={couleur}
      />
    </svg>
  )
}
