import { useCallback, useEffect, useState, type FormEvent } from 'react'
import weddingConfig from '../../wedding.config'
import { chargerCommentaires, chargerCommentairesVideo, chargerPagePhotos } from '../lib/api'
import { intituleDefi } from '../../defis.config'
import videos from '../../videos.config'
import {
  effacerMotDePasseSession,
  getMotDePasseSession,
  setMotDePasseSession,
  supprimerCommentaire,
  supprimerPhoto,
  verifierMotDePasse,
  type CodeConnexion,
} from '../lib/adminApi'
import { exporterToutesLesPhotos, type ProgressionExport } from '../lib/exportPhotos'
import type { Commentaire, CommentaireVideo, PhotoAvecUrl } from '../lib/types'

export default function Admin() {
  const [motDePasse, setMotDePasse] = useState<string | null>(getMotDePasseSession)

  if (!motDePasse) {
    return <EcranConnexion onConnecte={setMotDePasse} />
  }

  return <PanneauAdmin motDePasse={motDePasse} onDeconnexion={() => setMotDePasse(null)} />
}

const MESSAGES_ERREUR: Record<Exclude<CodeConnexion, 'ok'>, string> = {
  'mot-de-passe-incorrect': 'Mot de passe incorrect.',
  'mot-de-passe-non-configure':
    "Aucun mot de passe n'est défini sur le serveur. Ajoutez la variable ADMIN_PASSWORD dans Vercel (Settings puis Environment Variables), puis relancez un déploiement.",
  'fonctions-absentes':
    "La partie serveur de l'administration n'est pas déployée. Dans Vercel, vérifiez que le \"Root Directory\" du projet est bien mariage-photos, puis relancez un déploiement.",
  'serveur-en-erreur':
    "Le serveur a renvoyé une erreur. Consultez l'onglet Logs du déploiement dans Vercel pour en voir la cause.",
  'erreur-reseau': 'Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.',
}

function EcranConnexion({ onConnecte }: { onConnecte: (mdp: string) => void }) {
  const [saisie, setSaisie] = useState('')
  const [verification, setVerification] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setVerification(true)
    setErreur(null)
    const resultat = await verifierMotDePasse(saisie)
    setVerification(false)

    if (resultat.code === 'ok') {
      setMotDePasseSession(saisie)
      onConnecte(saisie)
      return
    }
    const message = MESSAGES_ERREUR[resultat.code]
    setErreur(resultat.detail ? `${message} (${resultat.detail})` : message)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-prune-950 px-6">
      <h1 className="text-2xl font-bold text-creme">Administration</h1>
      <p className="mt-1 text-mauve-300">{weddingConfig.eventTitle}</p>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
        <input
          type="password"
          autoFocus
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="Mot de passe administrateur"
          className="w-full rounded-2xl border-2 border-prune-600 bg-prune-950/60 px-5 py-4 text-center text-lg text-creme placeholder-mauve-500 outline-none focus:border-corail-400"
        />
        {erreur && <p className="mt-3 text-center text-sm font-medium text-corail-300">{erreur}</p>}
        <button
          type="submit"
          disabled={verification || saisie.length === 0}
          className="mt-6 w-full rounded-2xl bg-corail-500 px-6 py-4 text-lg font-bold text-prune-950 disabled:opacity-40"
        >
          {verification ? 'Vérification…' : 'Entrer'}
        </button>
      </form>
    </div>
  )
}

function PanneauAdmin({ motDePasse, onDeconnexion }: { motDePasse: string; onDeconnexion: () => void }) {
  const [photos, setPhotos] = useState<PhotoAvecUrl[]>([])
  const [chargement, setChargement] = useState(true)
  const [fini, setFini] = useState(false)
  const [photoOuverte, setPhotoOuverte] = useState<PhotoAvecUrl | null>(null)
  const [exportEnCours, setExportEnCours] = useState(false)
  const [progression, setProgression] = useState<ProgressionExport | null>(null)
  const [messageErreur, setMessageErreur] = useState<string | null>(null)
  const [messageSucces, setMessageSucces] = useState<string | null>(null)

  const chargerPlus = useCallback(async () => {
    setChargement(true)
    try {
      const derniere = photos[photos.length - 1]
      const { photos: nouvelles, fini: estFini } = await chargerPagePhotos(derniere?.created_at)
      setPhotos((prev) => [...prev, ...nouvelles])
      setFini(estFini)
    } finally {
      setChargement(false)
    }
  }, [photos])

  useEffect(() => {
    chargerPagePhotos()
      .then(({ photos: premieres, fini: estFini }) => {
        setPhotos(premieres)
        setFini(estFini)
      })
      .finally(() => setChargement(false))
  }, [])

  async function handleSupprimerPhoto(photo: PhotoAvecUrl) {
    if (!confirm(`Supprimer définitivement la photo de ${photo.auteur_prenom} ?`)) return
    setMessageErreur(null)
    try {
      await supprimerPhoto(photo.id, motDePasse)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      if (photoOuverte?.id === photo.id) setPhotoOuverte(null)
    } catch (err) {
      setMessageErreur(err instanceof Error ? err.message : 'La suppression a échoué.')
    }
  }

  async function handleExport() {
    setExportEnCours(true)
    setMessageErreur(null)
    setMessageSucces(null)
    setProgression(null)
    try {
      const resultat = await exporterToutesLesPhotos(setProgression)
      const parties =
        resultat.nombreParties > 1 ? ` en ${resultat.nombreParties} archives` : ''
      const manquantes =
        resultat.echecs.length > 0
          ? ` ${resultat.echecs.length} photo(s) n'ont pas pu être récupérées, la liste est dans le fichier PHOTOS-MANQUANTES.txt de l'archive.`
          : ''
      setMessageSucces(`${resultat.photosExportees} photo(s) téléchargée(s)${parties}.${manquantes}`)
    } catch (err) {
      setMessageErreur(err instanceof Error ? err.message : "L'archive n'a pas pu être créée.")
    } finally {
      setExportEnCours(false)
      setProgression(null)
    }
  }

  function handleDeconnexion() {
    effacerMotDePasseSession()
    onDeconnexion()
  }

  return (
    <div className="min-h-dvh bg-prune-950 pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-prune-700/60 bg-prune-950/95 px-4 py-3 backdrop-blur">
        <div>
          <h1 className="text-lg font-bold text-creme">Administration</h1>
          <p className="text-sm text-mauve-300">{photos.length} photo(s) chargée(s)</p>
        </div>
        <button type="button" onClick={handleDeconnexion} className="text-sm text-mauve-400 underline">
          Se déconnecter
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-4">
        <button
          type="button"
          onClick={handleExport}
          disabled={exportEnCours}
          className="w-full rounded-2xl bg-corail-500 px-6 py-4 text-lg font-bold text-prune-950 disabled:opacity-40"
        >
          {exportEnCours ? 'Téléchargement en cours…' : 'Télécharger toutes les photos (.zip)'}
        </button>

        {progression && <BarreProgression progression={progression} />}

        {messageSucces && (
          <div className="mt-3 rounded-xl border border-rosee-400/50 bg-rosee-400/10 px-4 py-3">
            <p className="text-sm font-semibold text-rosee-300">{messageSucces}</p>
          </div>
        )}

        {exportEnCours && (
          <p className="mt-3 text-center text-sm leading-relaxed text-mauve-400">
            Laissez cet onglet ouvert jusqu'à la fin. Si votre navigateur demande l'autorisation de
            télécharger plusieurs fichiers, acceptez.
          </p>
        )}
      </div>

      {messageErreur && (
        <div className="mx-auto mb-4 max-w-2xl px-4">
          <div className="rounded-xl border border-corail-500/70 bg-corail-600/15 px-4 py-3">
            <p className="text-sm font-semibold text-corail-300">{messageErreur}</p>
            <button
              type="button"
              onClick={() => setMessageErreur(null)}
              className="mt-2 text-sm text-corail-300 underline"
            >
              Masquer
            </button>
          </div>
        </div>
      )}

      {/* Les commentaires des vidéos passent avant la grille des photos : ils
          sont la partie vivante du site, et se trouvaient auparavant sous
          plusieurs centaines de vignettes, donc introuvables. */}
      <CommentairesVideos motDePasse={motDePasse} />

      <div className="mx-auto max-w-2xl px-4 pb-1 pt-8">
        <h2 className="text-sm font-bold uppercase tracking-widest text-mauve-500">
          Photos de la soirée
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-mauve-400">
          Touchez une photo pour lire ses commentaires et les supprimer si besoin.
        </p>
      </div>

      {/* Deux zones tactiles distinctes et généreuses : une croix de 28 px
          superposée à la photo était trop petite au doigt, et un appui à côté
          ouvrait la photo au lieu de la supprimer. */}
      <div className="mx-auto mt-3 grid max-w-2xl grid-cols-2 gap-3 px-4 sm:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-xl bg-prune-800">
            <button
              type="button"
              onClick={() => setPhotoOuverte(photo)}
              className="block aspect-square w-full"
            >
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
            {/* Auteur et défi rappelés sous la vignette : la suppression est
                définitive, autant savoir exactement ce qu'on efface. */}
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-semibold text-creme">{photo.auteur_prenom}</p>
              <p className="truncate text-xs text-rosee-300">
                {intituleDefi(photo.defi) ?? 'Photo libre'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleSupprimerPhoto(photo)}
              className="w-full bg-rose-600 py-3 text-base font-bold text-white active:bg-rose-700"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="px-4 py-4 text-center">
        {!fini && (
          <button
            type="button"
            onClick={() => void chargerPlus()}
            disabled={chargement}
            className="rounded-xl border border-prune-600 px-5 py-2 text-sm text-creme"
          >
            {chargement ? 'Chargement…' : 'Charger plus de photos'}
          </button>
        )}
      </div>

      {photoOuverte && (
        <PanneauCommentaires
          photo={photoOuverte}
          motDePasse={motDePasse}
          onFermer={() => setPhotoOuverte(null)}
        />
      )}
    </div>
  )
}

/** Modération des commentaires laissés sous les vidéos récapitulatives. */
function CommentairesVideos({ motDePasse }: { motDePasse: string }) {
  const [parVideo, setParVideo] = useState<Record<string, CommentaireVideo[]>>({})
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState<string | null>(null)

  useEffect(() => {
    let annule = false
    Promise.all(
      videos.map(async (v) => [v.id, await chargerCommentairesVideo(v.id)] as const),
    )
      .then((entrees) => {
        if (!annule) setParVideo(Object.fromEntries(entrees))
      })
      .catch((err: unknown) => {
        if (!annule) setErreur(err instanceof Error ? err.message : 'Chargement impossible.')
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })
    return () => {
      annule = true
    }
  }, [])

  async function handleSupprimer(videoId: string, id: string) {
    if (!confirm('Supprimer ce commentaire ?')) return
    setErreur(null)
    try {
      await supprimerCommentaire(id, motDePasse, 'video')
      setParVideo((prev) => ({ ...prev, [videoId]: prev[videoId].filter((c) => c.id !== id) }))
    } catch (err) {
      setErreur(err instanceof Error ? err.message : 'La suppression a échoué.')
    }
  }

  const total = Object.values(parVideo).reduce((n, liste) => n + liste.length, 0)

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8">
      <h2 className="text-sm font-bold uppercase tracking-widest text-mauve-500">
        Commentaires des vidéos {!chargement && `(${total})`}
      </h2>

      {chargement && <p className="pulsation mt-3 text-sm text-mauve-400">Chargement…</p>}

      {erreur && (
        <p className="mt-3 rounded-xl border border-corail-500/70 bg-corail-600/15 px-3 py-2 text-sm font-semibold text-corail-300">
          {erreur}
        </p>
      )}

      {!chargement && !erreur && total === 0 && (
        <p className="mt-3 text-sm text-mauve-400">Aucun commentaire sur les vidéos.</p>
      )}

      {videos.map((video) => {
        const liste = parVideo[video.id] ?? []
        if (liste.length === 0) return null
        return (
          <div key={video.id} className="mt-4">
            <p className="mb-2 text-sm font-bold text-rosee-300">{video.titre}</p>
            <ul className="flex flex-col gap-2">
              {liste.map((c) => (
                <li
                  key={c.id}
                  className="flex items-start justify-between gap-3 rounded-xl bg-prune-850/80 px-3 py-2"
                >
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-creme">{c.auteur_prenom}</span>
                    <p className="text-base text-mauve-300">{c.contenu}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSupprimer(video.id, c.id)}
                    className="shrink-0 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white active:bg-rose-700"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

function BarreProgression({ progression }: { progression: ProgressionExport }) {
  const { phase, total, traitees, partie, nombreParties } = progression
  const pourcentage = total === 0 ? 0 : Math.round((traitees / total) * 100)

  const libelle =
    phase === 'liste'
      ? 'Recherche des photos…'
      : phase === 'compression'
        ? `Préparation de l'archive ${partie} sur ${nombreParties}…`
        : phase === 'termine'
          ? 'Terminé !'
          : `${traitees} photo(s) sur ${total}${nombreParties > 1 ? ` — archive ${partie} sur ${nombreParties}` : ''}`

  return (
    <div className="mt-3 rounded-xl border border-prune-700/70 bg-prune-850/70 px-4 py-3">
      <p className="text-sm font-semibold text-creme">{libelle}</p>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-prune-950">
        <div
          className="h-full rounded-full bg-corail-500 transition-all duration-200"
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  )
}

function PanneauCommentaires({
  photo,
  motDePasse,
  onFermer,
}: {
  photo: PhotoAvecUrl
  motDePasse: string
  onFermer: () => void
}) {
  const [commentaires, setCommentaires] = useState<Commentaire[]>([])
  const [chargement, setChargement] = useState(true)
  const [messageErreur, setMessageErreur] = useState<string | null>(null)

  useEffect(() => {
    chargerCommentaires(photo.id)
      .then(setCommentaires)
      .finally(() => setChargement(false))
  }, [photo.id])

  async function handleSupprimer(id: string) {
    if (!confirm('Supprimer ce commentaire ?')) return
    setMessageErreur(null)
    try {
      await supprimerCommentaire(id, motDePasse)
      setCommentaires((prev) => prev.filter((c) => c.id !== id))
    } catch (err) {
      setMessageErreur(err instanceof Error ? err.message : 'La suppression a échoué.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-prune-950">
      <div className="flex items-center justify-between border-b border-prune-700/60 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-creme">Photo de {photo.auteur_prenom}</p>
          {photo.defi && (
            <p className="truncate text-xs text-rosee-300">{intituleDefi(photo.defi) ?? photo.defi}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-prune-800 text-xl text-creme"
        >
          ×
        </button>
      </div>
      <img src={photo.url} alt="" className="max-h-[45vh] w-full bg-black object-contain" />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-mauve-400">Commentaires</h2>
        {messageErreur && (
          <p className="mb-3 rounded-xl border border-corail-500/70 bg-corail-600/15 px-3 py-2 text-sm font-semibold text-corail-300">
            {messageErreur}
          </p>
        )}
        {chargement && <p className="text-sm text-mauve-400">Chargement…</p>}
        {!chargement && commentaires.length === 0 && (
          <p className="text-sm text-mauve-400">Aucun commentaire sur cette photo.</p>
        )}
        <ul className="flex flex-col gap-2">
          {commentaires.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl bg-prune-850/80 px-3 py-2">
              <div>
                <span className="text-sm font-bold text-rosee-300">{c.auteur_prenom}</span>
                <p className="text-base text-creme">{c.contenu}</p>
              </div>
              <button
                type="button"
                onClick={() => void handleSupprimer(c.id)}
                className="shrink-0 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white active:bg-rose-700"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
