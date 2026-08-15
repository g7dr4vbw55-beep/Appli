import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useEffect } from 'react'
import Accueil from './pages/Accueil'
import Affiche from './pages/Affiche'
import Admin from './pages/Admin'
import weddingConfig from '../wedding.config'

/**
 * Chemin de la page d'administration.
 *
 * Les barres obliques éventuellement saisies dans la variable sont retirées :
 * une valeur du type "/admin-xxx" produisait sinon une route "//admin-xxx",
 * introuvable, et donc une page blanche.
 */
const CHEMIN_ADMIN = (import.meta.env.VITE_ADMIN_PATH || 'admin-mariage').replace(/^\/+|\/+$/g, '')

export default function App() {
  useEffect(() => {
    document.title = weddingConfig.eventTitle
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/affiche" element={<Affiche />} />
        <Route path={`/${CHEMIN_ADMIN}`} element={<Admin />} />
        {/* Sans cette route, toute adresse inconnue affichait une page
            entièrement blanche, sans le moindre indice. */}
        <Route path="*" element={<PageIntrouvable />} />
      </Routes>
    </BrowserRouter>
  )
}

function PageIntrouvable() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12 text-center">
      <svg viewBox="0 0 32 30" aria-hidden="true" className="h-12 w-12 opacity-60">
        <path
          d="M16 29S1 19.5 1 10.2A8.2 8.2 0 0 1 16 5.6 8.2 8.2 0 0 1 31 10.2C31 19.5 16 29 16 29Z"
          fill="var(--color-corail-500)"
        />
      </svg>

      <h1 className="mt-6 text-2xl font-bold text-creme">Cette page n'existe pas</h1>
      <p className="mt-3 max-w-xs text-base leading-relaxed text-mauve-300">
        L'adresse saisie ne correspond à aucune page. Vérifiez le lien, ou revenez à l'album.
      </p>

      <Link
        to="/"
        className="mt-8 rounded-full bg-corail-500 px-8 py-4 text-lg font-bold text-prune-950 active:bg-corail-600"
      >
        Retour à l'album
      </Link>

      {/* Indication destinée aux mariés, sans dévoiler l'adresse elle-même. */}
      <p className="mt-10 max-w-xs text-sm leading-relaxed text-mauve-500">
        Vous cherchez la page d'administration ? Son adresse est la valeur de la variable
        <span className="font-semibold"> VITE_ADMIN_PATH</span> dans Vercel. Après l'avoir modifiée, il faut
        relancer un déploiement pour qu'elle prenne effet.
      </p>
    </div>
  )
}
