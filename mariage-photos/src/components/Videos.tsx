import { useEffect, useState, type FormEvent } from 'react'
import videos, { type Video } from '../../videos.config'
import { ajouterCommentaireVideo, chargerCommentairesVideo } from '../lib/api'
import type { CommentaireVideo } from '../lib/types'

export default function Videos({ prenom }: { prenom: string }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 pb-12 pt-4">
      {videos.map((video) => (
        <BlocVideo key={video.id} video={video} prenom={prenom} />
      ))}
    </div>
  )
}

function BlocVideo({ video, prenom }: { video: Video; prenom: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold leading-tight text-creme">{video.titre}</h2>
      {video.description && (
        <p className="mt-1 text-sm leading-relaxed text-mauve-300">{video.description}</p>
      )}

      <div className="mt-3 overflow-hidden rounded-2xl bg-black">
        <Lecteur video={video} />
      </div>

      <Commentaires video={video} prenom={prenom} />
    </section>
  )
}

function Lecteur({ video }: { video: Video }) {
  if (!video.source.trim()) {
    return (
      <div className="flex aspect-video items-center justify-center bg-prune-850 px-6 text-center">
        <p className="text-sm leading-relaxed text-mauve-400">
          Cette vidéo sera bientôt disponible.
        </p>
      </div>
    )
  }

  if (video.plateforme === 'fichier') {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video src={video.source} controls playsInline preload="metadata" className="aspect-video w-full">
        Votre navigateur ne peut pas lire cette vidéo.
      </video>
    )
  }

  const src =
    video.plateforme === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.source)}?rel=0`
      : `https://player.vimeo.com/video/${encodeURIComponent(video.source)}`

  return (
    <iframe
      src={src}
      title={video.titre}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="aspect-video w-full border-0"
    />
  )
}

function Commentaires({ video, prenom }: { video: Video; prenom: string }) {
  const [commentaires, setCommentaires] = useState<CommentaireVideo[]>([])
  const [chargement, setChargement] = useState(true)
  const [texte, setTexte] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    let annule = false
    setChargement(true)
    chargerCommentairesVideo(video.id)
      .then((c) => {
        if (!annule) setCommentaires(c)
      })
      .catch((err: unknown) => {
        if (!annule) setErreur(err instanceof Error ? err.message : 'Impossible de charger les commentaires.')
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })
    return () => {
      annule = true
    }
  }, [video.id])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const contenu = texte.trim()
    if (!contenu || envoi) return
    setEnvoi(true)
    setErreur(null)
    try {
      const nouveau = await ajouterCommentaireVideo(video.id, prenom, contenu)
      setCommentaires((prev) => [...prev, nouveau])
      setTexte('')
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Le commentaire n'a pas pu être envoyé.")
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="mt-4">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-mauve-500">
        {commentaires.length > 0
          ? `${commentaires.length} commentaire${commentaires.length > 1 ? 's' : ''}`
          : 'Commentaires'}
      </h3>

      {chargement && <p className="pulsation text-sm text-mauve-400">Chargement…</p>}

      {!chargement && commentaires.length === 0 && !erreur && (
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

      {erreur && (
        <p className="mt-3 rounded-xl border border-corail-500/70 bg-corail-600/15 px-3 py-2 text-sm font-semibold text-corail-300">
          {erreur}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2">
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
      </form>
    </div>
  )
}

function formaterDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
