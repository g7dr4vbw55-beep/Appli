import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Accueil } from './pages/Accueil';
import { Parcours } from './pages/Parcours';
import { Lecon } from './pages/Lecon';
import { Quiz } from './pages/Quiz';
import { Portefeuille } from './pages/Portefeuille';
import { NouvelOrdre } from './pages/NouvelOrdre';
import { Parametres } from './pages/Parametres';
import { Journal } from './pages/Journal';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/parcours" element={<Parcours />} />
        <Route path="/parcours/lecon/:slug" element={<Lecon />} />
        <Route path="/parcours/:slug/quiz" element={<Quiz />} />
        <Route path="/portefeuille" element={<Portefeuille />} />
        <Route path="/portefeuille/nouvel-ordre" element={<NouvelOrdre />} />
        <Route path="/portefeuille/parametres" element={<Parametres />} />
        <Route path="/journal" element={<Journal />} />
        <Route
          path="*"
          element={<p className="text-sm text-ardoise-600">Page introuvable.</p>}
        />
      </Routes>
    </Layout>
  );
}
