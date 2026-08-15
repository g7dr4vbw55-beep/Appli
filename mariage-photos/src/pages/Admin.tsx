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
  type ResultatConnexion,
} from '../lib/adminApi'
import type { Commentaire, PhotoAvecUrl } from '../lib/types'

export default function Admin() {
  const [motDePasse, setMotDePasse] = useState<string | null>(getMotDePasseSession)

  if (!motDePasse) {
    return <EcranConnexion onConnecte={setMotDePasse} />
  }

  return <PanneauAdmin motDePasse={motDePasse} onDeconnexion={() => setMotDePasse(null)} />
}

const MESSAGES_ERREUR: Record<Exclude<ResultatConnexion, 'ok'>, string> = {
  'mot-de-passe-incorrect': 'Mot de passe incorrect.',
  'mot-de-passe-non-configure':
    "Aucun mot de passe n'est défini sur le serveur. Ajoutez la variable ADMIN_PASSWORD dans Vercel (Settings puis Environment Variables), puis relancez un déploiement.",
  'fonctions-absentes':
    "La partie serveur de l'administration n'est pas déployée. Dans Vercel, vérifiez que le \"Root Directory\" du projet est bien mariage-photos, puis relancez un déploiement.",
  'erreur-reseau': 'Impossible de vérifier le mot de passe. Vérifiez votre connexion et réessayez.',
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

    if (resultat === 'ok') {
      setMotDePasseSession(saisie)
      onConnecte(saisie)
      return
    }
    setErreur(MESSAGES_ERREUR[resultat])
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-violet-950 px-6">
      <h1 className="text-2xl font-bold text-amber-100">Administration</h1>
      <p className="mt-1 text-violet-300">{weddingConfig.eventTitle}</p>
      <form onSubmit={handleSubmit} className="mt-8 w-full max-w-sm">
        <input
          type="password"
          autoFocus
          value={saisie}
          onChange={(e) => setSaisie(e.target.value)}
          placeholder="Mot de passe administrateur"
          className="w-full rounded-2xl border-2 border-violet-400/40 bg-violet-950/60 px-5 py-4 text-center text-lg text-amber-50 placeholder-violet-400 outline-none focus:border-amber-300"
        />
        {erreur && <p className="mt-3 text-center text-sm font-medium text-rose-300">{erreur}</p>}
        <button
          type="submit"
          disabled={verification || saisie.length === 0}
          className="mt-6 w-full rounded-2xl bg-amber-400 px-6 py-4 text-lg font-bold text-violet-950 disabled:opacity-40"
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
  const [messageExport, setMessageExport] = useState<string | null>(null)

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
    try {
      await supprimerPhoto(photo.id, motDePasse)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      if (photoOuverte?.id === photo.id) setPhotoOuverte(null)
    } catch {
      alert('La suppression a échoué. Réessayez.')
    }
  }

  async function handleExport() {
    setExportEnCours(true)
    setMessageExport(null)
    try {
      await telechargerArchiveZip(motDePasse)
    } catch {
      setMessageExport(
        "L'archive n'a pas pu être créée (peut-être trop de photos pour un seul export). Réessayez dans un instant.",
      )
    } finally {
      setExportEnCours(false)
    }
  }

  function handleDeconnexion() {
    effacerMotDePasseSession()
    onDeconnexion()
  }

  return (
    <div className="min-h-dvh bg-violet-950 pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-violet-800/60 bg-violet-950/95 px-4 py-3 backdrop-blur">
        <div>
          <h1 className="text-lg font-bold text-amber-100">Administration</h1>
          <p className="text-sm text-violet-300">{photos.length} photo(s) chargée(s)</p>
        </div>
        <button type="button" onClick={handleDeconnexion} className="text-sm text-violet-400 underline">
          Se déconnecter
        </button>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-4">
        <button
          type="button"
          onClick={handleExport}
          disabled={exportEnCours}
          className="w-full rounded-2xl bg-amber-400 px-6 py-4 text-lg font-bold text-violet-950 disabled:opacity-40"
        >
          {exportEnCours ? 'Préparation de l\'archive…' : 'Télécharger toutes les photos (.zip)'}
        </button>
        {messageExport && <p className="mt-2 text-center text-sm text-rose-300">{messageExport}</p>}
      </div>

      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-1 px-1">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square overflow-hidden bg-violet-900">
            <button type="button" onClick={() => setPhotoOuverte(photo)} className="h-full w-full">
              <img src={photo.url} alt="" className="h-full w-full object-cover" />
            </button>
            <button
              type="button"
              onClick={() => void handleSupprimerPhoto(photo)}
              aria-label="Supprimer la photo"
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-sm font-bold text-white"
            >
              ×
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
            className="rounded-xl border border-violet-700 px-5 py-2 text-sm text-amber-100"
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

  useEffect(() => {
    chargerCommentaires(photo.id)
      .then(setCommentaires)
      .finally(() => setChargement(false))
  }, [photo.id])

  async function handleSupprimer(id: string) {
    if (!confirm('Supprimer ce commentaire ?')) return
    try {
      await supprimerCommentaire(id, motDePasse)
      setCommentaires((prev) => prev.filter((c) => c.id !== id))
    } catch {
      alert('La suppression a échoué. Réessayez.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-violet-950">
      <div className="flex items-center justify-between border-b border-violet-800/60 px-4 py-3">
        <p className="font-semibold text-amber-100">Photo de {photo.auteur_prenom}</p>
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-800/70 text-xl text-amber-100"
        >
          ×
        </button>
      </div>
      <img src={photo.url} alt="" className="max-h-[45vh] w-full bg-black object-contain" />
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-violet-400">Commentaires</h2>
        {chargement && <p className="text-sm text-violet-400">Chargement…</p>}
        {!chargement && commentaires.length === 0 && (
          <p className="text-sm text-violet-400">Aucun commentaire sur cette photo.</p>
        )}
        <ul className="flex flex-col gap-2">
          {commentaires.map((c) => (
            <li key={c.id} className="flex items-start justify-between gap-3 rounded-xl bg-violet-900/50 px-3 py-2">
              <div>
                <span className="text-sm font-bold text-amber-200">{c.auteur_prenom}</span>
                <p className="text-base text-violet-100">{c.contenu}</p>
              </div>
              <button
                type="button"
                onClick={() => void handleSupprimer(c.id)}
                className="shrink-0 text-sm font-bold text-rose-300 underline"
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
