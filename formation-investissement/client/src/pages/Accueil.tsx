import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Carte, Encart, Etiquette, Jauge, TitreSection } from '../components/ui';

interface Sante {
  modules: Record<string, boolean>;
  cotations: { fournisseurActions: string; fournisseurActionsUtilisable: boolean };
  simulation: { startingCash: number; feePercent: number; feeFixed: number };
}

interface NiveauResume {
  position: number;
  slug: string;
  titre: string;
  deverrouille: boolean;
  valide: boolean;
  leconsLues: number;
  nombreLecons: number;
  meilleurScore: number | null;
}

const modules = [
  {
    to: '/parcours',
    numero: '1',
    titre: 'Parcours de formation',
    texte:
      'Cinq niveaux, des leçons courtes et un quiz par niveau. Le niveau suivant se débloque à 80 % de réussite.',
  },
  {
    to: '/portefeuille',
    numero: '2',
    titre: 'Portefeuille d’entraînement',
    texte:
      'Capital virtuel, ordres simulés avec frais, répartition par classe d’actif et comparaison à un indice de référence.',
  },
  {
    to: '/journal',
    numero: '3',
    titre: 'Journal de décisions',
    texte:
      'Thèse, horizon, risque accepté et condition d’invalidation écrits avant chaque ordre, puis bilan à la clôture.',
  },
  {
    to: '/glossaire',
    numero: '4',
    titre: 'Glossaire et décrypteur',
    texte:
      'Plus de 120 termes expliqués avec un exemple, et un outil pour décortiquer un article ou une publicité.',
  },
];

export function Accueil() {
  const [sante, setSante] = useState<Sante | null>(null);
  const [niveaux, setNiveaux] = useState<NiveauResume[] | null>(null);

  useEffect(() => {
    api.get<Sante>('/sante').then(setSante).catch(() => setSante(null));
    api
      .get<{ niveaux: NiveauResume[] }>('/parcours')
      .then((d) => setNiveaux(d.niveaux))
      .catch(() => setNiveaux(null));
  }, []);

  const leconsLues = niveaux?.reduce((s, n) => s + n.leconsLues, 0) ?? 0;
  const totalLecons = niveaux?.reduce((s, n) => s + n.nombreLecons, 0) ?? 0;
  const niveauxValides = niveaux?.filter((n) => n.valide).length ?? 0;

  return (
    <div className="space-y-8">
      <TitreSection
        titre="Apprendre à investir sans risquer un euro"
        sousTitre="Une application locale pour comprendre les marchés d’actions, les ETF et les cryptomonnaies, s’entraîner sur un portefeuille fictif et mesurer sa progression. Elle n’indique jamais quoi acheter ni quand."
      />

      <Encart ton="alerte" titre="Ce que cette application ne fait pas">
        <ul className="ml-4 list-disc space-y-1">
          <li>Elle ne recommande aucun actif, aucun produit et aucun intermédiaire.</li>
          <li>Elle ne produit aucun signal d’achat ou de vente, ni aucune prévision de prix.</li>
          <li>
            Elle n’encourage pas le passage à un investissement réel. Le portefeuille reste fictif.
          </li>
        </ul>
      </Encart>

      {niveaux && (
        <Carte>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ardoise-500">
              Votre progression
            </h2>
            <div className="flex gap-2">
              <Etiquette ton={niveauxValides > 0 ? 'succes' : 'neutre'}>
                {niveauxValides} / {niveaux.length} niveaux validés
              </Etiquette>
              <Etiquette>
                {leconsLues} / {totalLecons} leçons lues
              </Etiquette>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {niveaux.map((n) => (
              <Link
                key={n.slug}
                to={n.deverrouille ? `/parcours/${n.slug}` : '/parcours'}
                className={`rounded-lg border p-3 transition ${
                  n.valide
                    ? 'border-emerald-200 bg-emerald-50 hover:border-emerald-300'
                    : n.deverrouille
                      ? 'border-ardoise-200 bg-white hover:border-ardoise-300'
                      : 'border-ardoise-200 bg-ardoise-50 opacity-70'
                }`}
              >
                <p className="text-xs font-medium text-ardoise-500">Niveau {n.position}</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-ardoise-900">
                  {n.titre}
                </p>
                <div className="mt-2">
                  <Jauge
                    valeur={n.leconsLues}
                    total={n.nombreLecons}
                    ton={n.valide ? 'succes' : 'neutre'}
                  />
                </div>
                <p className="mt-1.5 text-xs text-ardoise-500">
                  {n.valide
                    ? `Validé (${Math.round(n.meilleurScore ?? 0)} %)`
                    : n.deverrouille
                      ? `${n.leconsLues}/${n.nombreLecons} leçons`
                      : 'Verrouillé'}
                </p>
              </Link>
            ))}
          </div>
        </Carte>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Link key={m.to} to={m.to} className="group">
            <Carte className="h-full transition group-hover:border-ardoise-400">
              <div className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-ardoise-100 text-xs font-bold text-ardoise-700">
                  {m.numero}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-ardoise-950">{m.titre}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ardoise-600">{m.texte}</p>
                </div>
              </div>
            </Carte>
          </Link>
        ))}
      </div>

      {sante && (
        <Carte>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Configuration détectée
          </h2>
          <dl className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-ardoise-500">Capital virtuel de départ</dt>
              <dd className="font-medium">{sante.simulation.startingCash} €</dd>
            </div>
            <div>
              <dt className="text-xs text-ardoise-500">Frais simulés par ordre</dt>
              <dd className="font-medium">
                {sante.simulation.feePercent} % + {sante.simulation.feeFixed} €
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ardoise-500">Cotations actions / ETF</dt>
              <dd className="font-medium">
                {sante.cotations.fournisseurActionsUtilisable
                  ? sante.cotations.fournisseurActions
                  : 'saisie manuelle (mode dégradé)'}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ardoise-500">Cotations crypto</dt>
              <dd className="font-medium">CoinGecko (API publique)</dd>
            </div>
            <div>
              <dt className="text-xs text-ardoise-500">Décrypteur d’actualité</dt>
              <dd className="font-medium">
                {sante.modules.decrypteur ? 'actif' : 'clé API Anthropic absente'}
              </dd>
            </div>
          </dl>
        </Carte>
      )}
    </div>
  );
}
