import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Accueil from './pages/Accueil'
import Affiche from './pages/Affiche'
import Admin from './pages/Admin'
import weddingConfig from '../wedding.config'

const CHEMIN_ADMIN = import.meta.env.VITE_ADMIN_PATH || 'admin-mariage'

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
      </Routes>
    </BrowserRouter>
  )
}
