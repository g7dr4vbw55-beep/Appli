import { useState, type FormEvent, type ReactNode } from 'react'
import weddingConfig from '../../wedding.config'
import { enregistrerAccesValide, enregistrerPrenom, getAccesValide, getPrenomEnregistre } from '../lib/localPrefs'

const CODE_ACCES_ATTENDU = (import.meta.env.VITE_ACCESS_CODE ?? '').trim()

/**
 * Laisser VITE_ACCESS_CODE vide supprime complètement l'étape du code.
 * L'écran n'est alors même plus affiché : demander un code inexistant, puis
 * accepter n'importe quelle saisie, ne ferait qu'égarer les invités.
 */
const CODE_REQUIS = CODE_ACCES_ATTENDU.length > 0

interface Props {
  children: (prenom: string) => ReactNode
}

export default function PorteAcces({ children }: Props) {
  const [accesValide, setAccesValide] = useState(() => !CODE_REQUIS || getAccesValide())
  const [prenom, setPrenom] = useState(getPrenomEnregistre)

  if (!accesValide) {
    return <EcranCodeAcces onValide={() => setAccesValide(true)} />
  }

  // Le prénom est demandé dans tous les cas, code d'accès ou non : il signe
  // les commentaires des vidéos.
  if (!prenom) {
    return <EcranPrenom onValide={(p) => setPrenom(p)} />
  }

  return <>{children(prenom)}</>
}

function EcranCodeAcces({ onValide }: { onValide: () => void }) {
  const [saisie, setSaisie] = useState('')
  const [erreur, setErreur] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (saisie.trim().toLowerCase() === CODE_ACCES_ATTENDU.toLowerCase()) {
      enregistrerAccesValide()
      onValide()
    } else {
      setErreur(true)
    }
  }

  return (
    <EcranCentre>
      <Coeur />
      <h1 className="mt-6 text-center text-[2rem] font-bold leading-tight text-creme">
        {weddingConfig.eventTitle}
      </h1>
      <p className="mt-4 max-w-xs text-center text-lg leading-relaxed text-mauve-300">
        Entrez le code inscrit <span className="font-semibold text-rosee-300">juste au-dessus du QR code</span>,
        sur la carte de votre table.
      </p>

      <form onSubmit={handleSubmit} className="mt-9 w-full max-w-sm">
        <label htmlFor="code-acces" className="sr-only">
          Code d'accès
        </label>
        <input
          id="code-acces"
          autoFocus
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          // "characters" mettait tout le code en capitales sur mobile, ce qui
          // ne correspond pas à un code écrit en minuscules et inquiète
          // l'invité. Seule la première lettre est capitalisée ; la saisie
          // reste de toute façon comparée sans tenir compte de la casse.
          autoCapitalize="sentences"
          value={saisie}
          onChange={(e) => {
            setSaisie(e.target.value)
            setErreur(false)
          }}
          placeholder="Code d'accès"
          className={champClasses(erreur)}
        />
        {erreur && (
          <p className="mt-3 text-center text-base font-semibold text-corail-300">
            Ce code n'est pas le bon. Il se trouve juste au-dessus du QR code.
          </p>
        )}
        <BoutonPrincipal>Valider</BoutonPrincipal>
      </form>
    </EcranCentre>
  )
}

function EcranPrenom({ onValide }: { onValide: (prenom: string) => void }) {
  const [saisie, setSaisie] = useState('')
  const [erreur, setErreur] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const prenom = saisie.trim()
    if (prenom.length < 2) {
      setErreur(true)
      return
    }
    enregistrerPrenom(prenom)
    onValide(prenom)
  }

  return (
    <EcranCentre>
      <Coeur />
      <h1 className="mt-6 text-center text-[2rem] font-bold leading-tight text-creme">Bienvenue !</h1>
      <p className="mt-4 max-w-xs text-center text-lg leading-relaxed text-mauve-300">
        {weddingConfig.welcomeMessage}
      </p>

      <form onSubmit={handleSubmit} className="mt-9 w-full max-w-sm">
        <label htmlFor="prenom" className="sr-only">
          Votre prénom
        </label>
        <input
          id="prenom"
          autoFocus
          autoComplete="given-name"
          value={saisie}
          onChange={(e) => {
            setSaisie(e.target.value)
            setErreur(false)
          }}
          placeholder="Votre prénom"
          className={champClasses(erreur)}
        />
        {erreur && (
          <p className="mt-3 text-center text-base font-semibold text-corail-300">
            Entrez au moins 2 lettres.
          </p>
        )}
        <BoutonPrincipal>C'est parti</BoutonPrincipal>
        <p className="mt-5 text-center text-sm leading-relaxed text-mauve-500">
          Votre prénom apparaîtra à côté de vos photos et de vos commentaires.
        </p>
      </form>
    </EcranCentre>
  )
}

function champClasses(erreur: boolean): string {
  return [
    'w-full rounded-full border-2 bg-prune-850/80 px-6 py-4 text-center text-xl',
    'text-creme placeholder-mauve-500 outline-none transition-colors',
    erreur ? 'border-corail-500' : 'border-prune-600 focus:border-corail-400',
  ].join(' ')
}

function BoutonPrincipal({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="mt-6 w-full rounded-full bg-corail-500 px-6 py-5 text-xl font-bold text-prune-950 shadow-lg shadow-corail-600/30 transition active:scale-[0.97] active:bg-corail-600"
    >
      {children}
    </button>
  )
}

/** Petit cœur décoratif, dessiné en SVG pour ne rien charger sur le réseau. */
function Coeur() {
  return (
    <svg viewBox="0 0 32 30" aria-hidden="true" className="h-14 w-14 drop-shadow-lg">
      <path
        d="M16 29S1 19.5 1 10.2A8.2 8.2 0 0 1 16 5.6 8.2 8.2 0 0 1 31 10.2C31 19.5 16 29 16 29Z"
        fill="var(--color-corail-500)"
      />
      <path
        d="M16 29S1 19.5 1 10.2A8.2 8.2 0 0 1 16 5.6"
        fill="var(--color-rosee-400)"
      />
    </svg>
  )
}

function EcranCentre({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">{children}</div>
  )
}
