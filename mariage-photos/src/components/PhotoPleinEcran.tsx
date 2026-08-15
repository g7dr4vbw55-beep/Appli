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

  useEffect(() => {
    let annule = false
    setChargement(true)
    chargerCommentaires(photo.id)
      .then((c) => {
        if (!annule) setCommentaires(c)
      })
      .catch(() => {
        if (!annule) setErreur("Impossible de charger les commentaires.")
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
    <div className="fixed inset-0 z-50 flex flex-col bg-violet-950">
      <div className="flex items-center justify-between border-b border-violet-800/60 px-4 py-3">
        <p className="text-base font-semibold text-amber-100">Photo de {photo.auteur_prenom}</p>
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-800/70 text-xl text-amber-100"
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center bg-black">
          <img src={photo.url} alt={`Photo ajoutée par ${photo.auteur_prenom}`} className="max-h-[65vh] w-full object-contain" />
        </div>

        <div className="px-4 py-4">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-violet-400">Commentaires</h2>

          {chargement && <p className="text-sm text-violet-400">Chargement des commentaires…</p>}

          {!chargement && commentaires.length === 0 && (
            <p className="text-sm text-violet-400">Aucun commentaire. Soyez le premier à réagir !</p>
          )}

          <ul className="flex flex-col gap-3">
            {commentaires.map((c) => (
              <li key={c.id} className="rounded-xl bg-violet-900/50 px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-bold text-amber-200">{c.auteur_prenom}</span>
                  <span className="text-xs text-violet-400">{formaterDate(c.created_at)}</span>
                </div>
                <p className="mt-0.5 text-base text-violet-100">{c.contenu}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="border-t border-violet-800/60 bg-violet-950 px-3 py-3">
        {erreur && <p className="mb-2 text-sm font-medium text-rose-300">{erreur}</p>}
        <div className="flex gap-2">
          <input
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder="Écrire un commentaire…"
            maxLength={500}
            className="min-w-0 flex-1 rounded-full border-2 border-violet-700 bg-violet-900/60 px-4 py-3 text-base text-amber-50 placeholder-violet-400 outline-none focus:border-amber-300"
          />
          <button
            type="submit"
            disabled={envoi || texte.trim().length === 0}
            className="shrink-0 rounded-full bg-amber-400 px-5 py-3 font-bold text-violet-950 disabled:opacity-40"
          >
            Envoyer
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
