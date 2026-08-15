import { useEffect, useState, type FormEvent } from 'react'
import { ajouterCommentaire, chargerCommentaires } from '../lib/api'
import type { Commentaire, PhotoAvecUrl } from '../lib/types'

interface Props {
  photo: PhotoAvecUrl
  prenom: string
  onFermer: () => void
}

export default function PhotoPleinEcran({ photo, prenom, onFermer }: Props) {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([])
  const [chargement, setChargement] = useState(true)
  const [texte, setTexte] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  // Empêche la galerie de défiler derrière la vue plein écran.
  useEffect(() => {
    const precedent = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = precedent
    }
  }, [])

  useEffect(() => {
    let annule = false
    setChargement(true)
    chargerCommentaires(photo.id)
      .then((c) => {
        if (!annule) setCommentaires(c)
      })
      .catch(() => {
        if (!annule) setErreur('Impossible de charger les commentaires.')
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })
    return () => {
      annule = true
    }
  }, [photo.id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const contenu = texte.trim()
    if (!contenu || envoi) return
    setEnvoi(true)
    setErreur(null)
    try {
      const nouveau = await ajouterCommentaire(photo.id, prenom, contenu)
      setCommentaires((prev) => [...prev, nouveau])
      setTexte('')
    } catch {
      setErreur("Le commentaire n'a pas pu être envoyé. Vérifiez votre connexion et réessayez.")
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-prune-950">
      <div className="flex items-center justify-between gap-3 border-b border-prune-700/60 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-corail-500 text-base font-bold text-prune-950">
            {photo.auteur_prenom.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold leading-tight text-creme">{photo.auteur_prenom}</p>
            <p className="text-xs text-mauve-500">{formaterDate(photo.created_at)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-prune-800 text-2xl leading-none text-creme active:bg-prune-700"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="flex items-center justify-center bg-black">
          <img
            src={photo.url}
            alt={`Photo ajoutée par ${photo.auteur_prenom}`}
            className="max-h-[62vh] w-full object-contain"
          />
        </div>

        <div className="px-4 py-5">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-mauve-500">
            {commentaires.length > 0 ? `${commentaires.length} commentaire${commentaires.length > 1 ? 's' : ''}` : 'Commentaires'}
          </h2>

          {chargement && <p className="pulsation text-sm text-mauve-400">Chargement…</p>}

          {!chargement && commentaires.length === 0 && (
            <p className="text-base text-mauve-400">Aucun commentaire pour l'instant. Lancez-vous !</p>
          )}

          <ul className="flex flex-col gap-2.5">
            {commentaires.map((c) => (
              <li key={c.id} className="apparition rounded-2xl bg-prune-850/80 px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-bold text-rosee-300">{c.auteur_prenom}</span>
                  <span className="shrink-0 text-xs text-mauve-500">{formaterDate(c.created_at)}</span>
                </div>
                <p className="mt-1 text-base leading-relaxed text-creme">{c.contenu}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-prune-700/60 bg-prune-950 px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {erreur && <p className="mb-2 px-1 text-sm font-semibold text-corail-300">{erreur}</p>}
        <div className="flex items-center gap-2">
          <input
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder="Écrire un commentaire…"
            maxLength={500}
            className="min-w-0 flex-1 rounded-full border-2 border-prune-600 bg-prune-850/80 px-5 py-3.5 text-base text-creme placeholder-mauve-500 outline-none focus:border-corail-400"
          />
          <button
            type="submit"
            disabled={envoi || texte.trim().length === 0}
            aria-label="Envoyer le commentaire"
            className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-corail-500 text-prune-950 transition disabled:opacity-35 active:bg-corail-600"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
              <path d="M2 21V14l15-2-15-2V3l21 9-21 9Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )
}

function formaterDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
