import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

const liens = [
  { to: '/', libelle: 'Accueil' },
  { to: '/parcours', libelle: 'Parcours' },
  { to: '/portefeuille', libelle: 'Portefeuille' },
  { to: '/journal', libelle: 'Journal' },
  { to: '/glossaire', libelle: 'Glossaire' },
  { to: '/decrypteur', libelle: 'Décrypteur' },
  { to: '/fiscalite', libelle: 'Fiscalité' },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Avertissement permanent, present sur tous les ecrans. */}
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs leading-relaxed text-amber-900">
        <strong>Contenu informatif et pédagogique — aucun conseil en investissement.</strong>{' '}
        Les performances passées ne présagent pas des performances futures. Tout capital investi
        peut être perdu, en totalité.
      </div>

      <header className="sticky top-0 z-10 border-b border-ardoise-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ardoise-900 text-xs font-bold text-white">
              FI
            </span>
            <span className="text-sm font-semibold tracking-tight text-ardoise-950">
              Formation à l’investissement
            </span>
          </NavLink>
          <nav className="flex flex-wrap items-center gap-1 text-sm">
            {liens.map((lien) => (
              <NavLink
                key={lien.to}
                to={lien.to}
                end={lien.to === '/'}
                className={({ isActive }) =>
                  `rounded-md px-2.5 py-1.5 font-medium transition ${
                    isActive
                      ? 'bg-ardoise-100 text-ardoise-950'
                      : 'text-ardoise-600 hover:bg-ardoise-50 hover:text-ardoise-900'
                  }`
                }
              >
                {lien.libelle}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

      <footer className="border-t border-ardoise-200 bg-white px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-2 text-xs leading-relaxed text-ardoise-500">
          <p>
            Application locale d’apprentissage. Elle ne formule aucune recommandation d’achat ou de
            vente, ne produit aucun signal de marché et ne promet aucun rendement. Le portefeuille
            est entièrement fictif : il sert à s’entraîner, pas à préparer une transaction.
          </p>
          <p>
            Le module fiscal expose des mécanismes généraux du droit français. La réglementation
            évolue : vérifiez systématiquement auprès d’une source officielle
            (impots.gouv.fr, service-public.fr, amf-france.org) et, si nécessaire, auprès d’un
            professionnel habilité.
          </p>
        </div>
      </footer>
    </div>
  );
}
