import { useCallback, useEffect, useState, type FormEvent } from 'react'
import weddingConfig from '../../wedding.config'
import { chargerCommentaires, chargerPagePhotos } from '../lib/api'
import {
  effacerMotDePasseSession,
  getMotDePasseSession,
  setMotDePasseSession,
  supprimerCommentaire,
  supprimerPhoto,
  telechargerArchiveZip,
  verifierMotDePasse,
  type CodeConnexion,
} from '../lib/adminApi'
import type { Commentaire, PhotoAvecUrl } from '../lib/types'

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
  const [messageErreur, setMessageErreur] = useState<string | null>(null)

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
    try {
      await telechargerArchiveZip(motDePasse)
    } catch (err) {
      setMessageErreur(err instanceof Error ? err.message : "L'archive n'a pas pu être créée.")
    } finally {
      setExportEnCours(false)
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
          {exportEnCours ? 'Préparation de l\'archive…' : 'Télécharger toutes les photos (.zip)'}
        </button>
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

      {/* Deux zones tactiles distinctes et généreuses : une croix de 28 px
          superposée à la photo était trop petite au doigt, et un appui à côté
          ouvrait la photo au lieu de la supprimer. */}
      <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 px-4 sm:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo.id} className="overflow-hidden rounded-xl bg-prune-800">
            <button
              type="button"
              onClick={() => setPhotoOuverte(photo)}
              className="block aspect-square w-full"
            >
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
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
        <p className="font-semibold text-creme">Photo de {photo.auteur_prenom}</p>
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
