import { useState, type FormEvent, type ReactNode } from 'react'
import weddingConfig from '../../wedding.config'
import { enregistrerAccesValide, enregistrerPrenom, getAccesValide, getPrenomEnregistre } from '../lib/localPrefs'

const CODE_ACCES_ATTENDU = import.meta.env.VITE_ACCESS_CODE

interface Props {
  children: (prenom: string) => ReactNode
}

export default function PorteAcces({ children }: Props) {
  const [accesValide, setAccesValide] = useState(getAccesValide)
  const [prenom, setPrenom] = useState(getPrenomEnregistre)

  if (!accesValide) {
    return <EcranCodeAcces onValide={() => setAccesValide(true)} />
  }

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
    if (!CODE_ACCES_ATTENDU) {
      // Aucun code n'a été configuré côté serveur : on n'imagine pas de valeur, on laisse passer
      enregistrerAccesValide()
      onValide()
      return
    }
    if (saisie.trim().toLowerCase() === CODE_ACCES_ATTENDU.trim().toLowerCase()) {
      enregistrerAccesValide()
      onValide()
    } else {
      setErreur(true)
    }
  }

  return (
    <EcranCentre>
      <h1 className="text-3xl font-bold text-center text-amber-100">{weddingConfig.eventTitle}</h1>
      <p className="mt-3 text-center text-lg text-violet-200">Entrez le code affiché sur votre table pour accéder aux photos.</p>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
        <label htmlFor="code-acces" className="sr-only">
          Code d'accès
        </label>
        <input
          id="code-acces"
          autoFocus
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          value={saisie}
          onChange={(e) => {
            setSaisie(e.target.value)
            setErreur(false)
          }}
          placeholder="Code d'accès"
          className="w-full rounded-2xl border-2 border-violet-400/40 bg-violet-950/60 px-5 py-4 text-center text-2xl tracking-widest text-amber-50 placeholder-violet-400 outline-none focus:border-amber-300"
        />
        {erreur && (
          <p className="mt-3 text-center text-base font-medium text-rose-300">
            Ce code n'est pas correct. Vérifiez sur la carte posée sur votre table.
          </p>
        )}
        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-amber-400 px-6 py-4 text-xl font-bold text-violet-950 shadow-lg shadow-amber-900/30 active:scale-[0.98]"
        >
          Valider
        </button>
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
      <h1 className="text-3xl font-bold text-center text-amber-100">Bienvenue !</h1>
      <p className="mt-3 text-center text-lg text-violet-200">{weddingConfig.welcomeMessage}</p>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
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
          className="w-full rounded-2xl border-2 border-violet-400/40 bg-violet-950/60 px-5 py-4 text-center text-2xl text-amber-50 placeholder-violet-400 outline-none focus:border-amber-300"
        />
        {erreur && <p className="mt-3 text-center text-base font-medium text-rose-300">Entrez au moins 2 lettres.</p>}
        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-amber-400 px-6 py-4 text-xl font-bold text-violet-950 shadow-lg shadow-amber-900/30 active:scale-[0.98]"
        >
          C'est parti
        </button>
        <p className="mt-4 text-center text-sm text-violet-400">
          Votre prénom sera affiché à côté de vos photos et commentaires.
        </p>
      </form>
    </EcranCentre>
  )
}

function EcranCentre({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-violet-950 px-6 py-12">{children}</div>
  )
}
