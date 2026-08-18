import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { Carte, Chargement, Encart, Etiquette, MessageErreur, TitreSection } from '../components/ui';

interface Terme {
  slug: string;
  terme: string;
  categorie: string;
  definition: string;
  exemple: string;
  vigilance: string;
  associes: string[];
}

interface Reponse {
  termes: Terme[];
  total: number;
  categories: { code: string; libelle: string; nombre: number }[];
}

const couleursCategories: Record<string, 'neutre' | 'info' | 'alerte' | 'succes' | 'danger'> = {
  bases: 'neutre',
  'actions-etf': 'info',
  crypto: 'alerte',
  risque: 'neutre',
  fiscalite: 'succes',
  arnaques: 'danger',
};

export function Glossaire() {
  const [donnees, setDonnees] = useState<Reponse | null>(null);
  const [recherche, setRecherche] = useState('');
  const [categorie, setCategorie] = useState('toutes');
  const [erreur, setErreur] = useState<string | null>(null);
  const [ouvert, setOuvert] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (recherche.trim()) params.set('q', recherche.trim());
    if (categorie !== 'toutes') params.set('categorie', categorie);
    const suffixe = params.toString() ? `?${params}` : '';
    const minuteur = setTimeout(() => {
      api
        .get<Reponse>(`/glossaire${suffixe}`)
        .then(setDonnees)
        .catch((e) => setErreur(e.message));
    }, 150);
    return () => clearTimeout(minuteur);
  }, [recherche, categorie]);

  const libelles = useMemo(() => {
    const table: Record<string, string> = {};
    for (const c of donnees?.categories ?? []) table[c.code] = c.libelle;
    return table;
  }, [donnees]);

  const parSlug = useMemo(() => {
    const table: Record<string, string> = {};
    for (const t of donnees?.termes ?? []) table[t.slug] = t.terme;
    return table;
  }, [donnees]);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!donnees) return <Chargement />;

  return (
    <div className="space-y-6">
      <TitreSection
        titre="Glossaire"
        sousTitre={`${donnees.total} termes des marchés financiers et de la crypto, expliqués en langage simple avec un exemple concret. Aucune entrée ne constitue une recommandation d’achat ou de vente.`}
      />

      <Carte>
        <div className="space-y-4">
          <input
            type="search"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher un terme, une définition, un exemple…"
            className="w-full rounded-lg border border-ardoise-300 px-4 py-2.5 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCategorie('toutes')}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                categorie === 'toutes'
                  ? 'border-ardoise-800 bg-ardoise-900 text-white'
                  : 'border-ardoise-300 bg-white text-ardoise-700 hover:bg-ardoise-50'
              }`}
            >
              Toutes ({donnees.total})
            </button>
            {donnees.categories.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setCategorie(c.code)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  categorie === c.code
                    ? 'border-ardoise-800 bg-ardoise-900 text-white'
                    : 'border-ardoise-300 bg-white text-ardoise-700 hover:bg-ardoise-50'
                }`}
              >
                {c.libelle} ({c.nombre})
              </button>
            ))}
          </div>
        </div>
      </Carte>

      {donnees.termes.length === 0 ? (
        <Encart ton="neutre">
          Aucun terme ne correspond à cette recherche. Essayez un mot plus court, ou retirez le
          filtre de catégorie.
        </Encart>
      ) : (
        <>
          <p className="px-1 text-sm text-ardoise-500">
            {donnees.termes.length} terme{donnees.termes.length > 1 ? 's' : ''} affiché
            {donnees.termes.length > 1 ? 's' : ''}
          </p>
          <div className="grid gap-3 lg:grid-cols-2">
            {donnees.termes.map((terme) => (
              <Carte
                key={terme.slug}
                className={`transition ${ouvert === terme.slug ? 'border-ardoise-400' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setOuvert(ouvert === terme.slug ? null : terme.slug)}
                  className="w-full text-left"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-ardoise-950">{terme.terme}</h2>
                    <Etiquette ton={couleursCategories[terme.categorie] ?? 'neutre'}>
                      {libelles[terme.categorie] ?? terme.categorie}
                    </Etiquette>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ardoise-700">{terme.definition}</p>
                </button>

                {ouvert === terme.slug && (
                  <div className="mt-3 space-y-3 border-t border-ardoise-100 pt-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                        Exemple concret
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ardoise-700">
                        {terme.exemple}
                      </p>
                    </div>
                    {terme.vigilance && (
                      <Encart ton="alerte">
                        <span className="font-semibold">Point de vigilance : </span>
                        {terme.vigilance}
                      </Encart>
                    )}
                    {terme.associes.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                          Voir aussi
                        </p>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {terme.associes.map((slug) => (
                            <button
                              key={slug}
                              type="button"
                              onClick={() => {
                                setRecherche('');
                                setCategorie('toutes');
                                setOuvert(slug);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="rounded-md bg-ardoise-100 px-2 py-0.5 text-xs text-ardoise-700 hover:bg-ardoise-200"
                            >
                              {parSlug[slug] ?? slug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Carte>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
