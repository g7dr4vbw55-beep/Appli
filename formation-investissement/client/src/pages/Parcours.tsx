import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { Bouton, Carte, Chargement, Encart, Etiquette, Jauge, MessageErreur, TitreSection } from '../components/ui';

interface Lecon {
  id: number;
  slug: string;
  titre: string;
  resume: string;
  nombreMots: number;
  lue: boolean;
}

export interface Niveau {
  id: number;
  position: number;
  slug: string;
  titre: string;
  sousTitre: string;
  intro: string;
  seuilReussite: number;
  deverrouille: boolean;
  raisonVerrouillage: string | null;
  meilleurScore: number | null;
  valide: boolean;
  nombreTentatives: number;
  leconsLues: number;
  nombreLecons: number;
  lecons: Lecon[];
}

export function Parcours() {
  const [niveaux, setNiveaux] = useState<Niveau[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ niveaux: Niveau[] }>('/parcours')
      .then((d) => setNiveaux(d.niveaux))
      .catch((e) => setErreur(e.message));
  }, []);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!niveaux) return <Chargement />;

  return (
    <div className="space-y-6">
      <TitreSection
        titre="Parcours de formation"
        sousTitre="Cinq niveaux successifs. Chaque niveau se termine par un quiz de cinq questions ; il faut 80 % de bonnes réponses pour débloquer le suivant. Le contenu est factuel et sourcé ; il ne constitue pas un conseil personnalisé."
      />

      {niveaux.map((niveau) => (
        <Carte key={niveau.slug} className={niveau.deverrouille ? '' : 'opacity-75'}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                  Niveau {niveau.position}
                </span>
                {niveau.valide && <Etiquette ton="succes">Validé · {Math.round(niveau.meilleurScore ?? 0)} %</Etiquette>}
                {!niveau.deverrouille && <Etiquette>Verrouillé</Etiquette>}
                {niveau.deverrouille && !niveau.valide && niveau.nombreTentatives > 0 && (
                  <Etiquette ton="alerte">
                    Meilleur score : {Math.round(niveau.meilleurScore ?? 0)} % · seuil{' '}
                    {niveau.seuilReussite} %
                  </Etiquette>
                )}
              </div>
              <h2 className="mt-1 text-lg font-semibold text-ardoise-950">{niveau.titre}</h2>
              <p className="mt-0.5 text-sm text-ardoise-600">{niveau.sousTitre}</p>
            </div>
            <div className="w-44 shrink-0">
              <p className="mb-1 text-right text-xs text-ardoise-500">
                {niveau.leconsLues} / {niveau.nombreLecons} leçons lues
              </p>
              <Jauge
                valeur={niveau.leconsLues}
                total={niveau.nombreLecons}
                ton={niveau.valide ? 'succes' : 'neutre'}
              />
            </div>
          </div>

          {!niveau.deverrouille ? (
            <div className="mt-4">
              <Encart ton="neutre">{niveau.raisonVerrouillage}</Encart>
            </div>
          ) : (
            <>
              <p className="mt-4 text-sm leading-relaxed text-ardoise-700">{niveau.intro}</p>
              <ul className="mt-4 divide-y divide-ardoise-100 border-t border-ardoise-100">
                {niveau.lecons.map((lecon, index) => (
                  <li key={lecon.slug}>
                    <Link
                      to={`/parcours/lecon/${lecon.slug}`}
                      className="flex items-start gap-3 py-3 transition hover:bg-ardoise-50"
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                          lecon.lue
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-ardoise-100 text-ardoise-600'
                        }`}
                      >
                        {lecon.lue ? '✓' : index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-ardoise-900">
                          {lecon.titre}
                        </span>
                        <span className="mt-0.5 block text-xs leading-relaxed text-ardoise-500">
                          {lecon.resume}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-ardoise-100 pt-4">
                <Link to={`/parcours/${niveau.slug}/quiz`}>
                  <Bouton variante={niveau.valide ? 'secondaire' : 'principal'}>
                    {niveau.valide ? 'Refaire le quiz' : 'Passer le quiz du niveau'}
                  </Bouton>
                </Link>
                <p className="text-xs text-ardoise-500">
                  5 questions · {niveau.seuilReussite} % requis
                  {niveau.nombreTentatives > 0 && ` · ${niveau.nombreTentatives} tentative(s)`}
                </p>
              </div>
            </>
          )}
        </Carte>
      ))}
    </div>
  );
}
