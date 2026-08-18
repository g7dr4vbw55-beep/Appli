import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Markdown } from '../components/Markdown';
import { Carte, Chargement, Encart, MessageErreur, TitreSection } from '../components/ui';

interface Section {
  slug: string;
  titre: string;
  resume: string;
  corps: string;
  pointsCles: string[];
  sources: { label: string; url: string }[];
}

interface Reponse {
  avertissement: string;
  sections: Section[];
}

export function Fiscalite() {
  const [donnees, setDonnees] = useState<Reponse | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Reponse>('/fiscalite')
      .then((d) => {
        setDonnees(d);
        setActive(d.sections[0]?.slug ?? null);
      })
      .catch((e) => setErreur(e.message));
  }, []);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!donnees) return <Chargement />;

  const section = donnees.sections.find((s) => s.slug === active) ?? donnees.sections[0];

  return (
    <div className="space-y-6">
      <TitreSection
        titre="Fiscalité française des placements"
        sousTitre="Cette fiche explique les mécanismes applicables en France. Elle ne calcule aucun impôt, ne remplit aucune déclaration, ne recommande aucune enveloppe et ne propose aucune stratégie d’optimisation."
      />

      <Encart ton="alerte" titre="Avertissement">
        {donnees.avertissement}
      </Encart>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <nav className="lg:sticky lg:top-24 lg:self-start">
          <ul className="space-y-1">
            {donnees.sections.map((s, index) => (
              <li key={s.slug}>
                <button
                  type="button"
                  onClick={() => setActive(s.slug)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition ${
                    s.slug === section?.slug
                      ? 'bg-ardoise-900 text-white'
                      : 'text-ardoise-700 hover:bg-ardoise-100'
                  }`}
                >
                  <span className="block text-xs opacity-60">Section {index + 1}</span>
                  <span className="block font-medium leading-snug">{s.titre}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {section && (
          <div className="min-w-0 space-y-5">
            <Carte>
              <h2 className="text-xl font-semibold tracking-tight text-ardoise-950">
                {section.titre}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ardoise-600">{section.resume}</p>
              <div className="mt-4 border-t border-ardoise-100 pt-2">
                <Markdown texte={section.corps} />
              </div>
            </Carte>

            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                À retenir
              </h3>
              <ul className="space-y-2">
                {section.pointsCles.map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ardoise-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ardoise-400" />
                    {point}
                  </li>
                ))}
              </ul>
            </Carte>

            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                Sources officielles — à vérifier avant toute démarche
              </h3>
              <ul className="space-y-1.5 text-sm">
                {section.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-800 underline decoration-sky-300 underline-offset-2 hover:decoration-sky-600"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Carte>
          </div>
        )}
      </div>
    </div>
  );
}
