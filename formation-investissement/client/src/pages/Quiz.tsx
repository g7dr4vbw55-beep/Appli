import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Bouton, Carte, Chargement, Encart, Etiquette, MessageErreur, TitreSection } from '../components/ui';

interface Proposition {
  id: number;
  libelle: string;
}

interface Question {
  id: number;
  slug: string;
  enonce: string;
  propositions: Proposition[];
}

interface QuizData {
  niveau: { slug: string; titre: string; seuilReussite: number };
  questions: Question[];
}

interface PropositionCorrigee {
  id: number;
  libelle: string;
  correcte: boolean;
  explication: string;
  choisie: boolean;
}

interface DetailCorrection {
  questionId: number;
  enonce: string;
  aRetenir: string;
  correct: boolean;
  propositions: PropositionCorrigee[];
}

interface Resultat {
  score: number;
  justes: number;
  total: number;
  seuilReussite: number;
  reussi: boolean;
  niveauSuivant: { slug: string; titre: string } | null;
  details: DetailCorrection[];
}

export function Quiz() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [choix, setChoix] = useState<Record<number, number>>({});
  const [resultat, setResultat] = useState<Resultat | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    setQuiz(null);
    setResultat(null);
    setChoix({});
    api
      .get<QuizData>(`/parcours/${slug}/quiz`)
      .then(setQuiz)
      .catch((e) => setErreur(e.message));
  }, [slug]);

  const envoyer = async () => {
    if (!quiz) return;
    setEnvoi(true);
    try {
      const reponse = await api.post<Resultat>(`/parcours/${slug}/quiz`, {
        reponses: quiz.questions.map((q) => ({
          questionId: q.id,
          choiceId: choix[q.id] ?? null,
        })),
      });
      setResultat(reponse);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  };

  const recommencer = () => {
    setResultat(null);
    setChoix({});
    window.scrollTo({ top: 0 });
  };

  if (erreur) {
    return (
      <div className="space-y-4">
        <MessageErreur message={erreur} />
        <Link to="/parcours">
          <Bouton variante="secondaire">Retour au parcours</Bouton>
        </Link>
      </div>
    );
  }
  if (!quiz) return <Chargement />;

  const toutesRepondues = quiz.questions.every((q) => choix[q.id] !== undefined);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <TitreSection
        titre={`Quiz — ${quiz.niveau.titre}`}
        sousTitre={`${quiz.questions.length} questions à choix multiple. ${quiz.niveau.seuilReussite} % de bonnes réponses sont nécessaires pour débloquer le niveau suivant. Chaque réponse est expliquée, juste ou fausse.`}
      />

      {resultat && (
        <Carte className={resultat.reussi ? 'border-emerald-300' : 'border-amber-300'}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                Résultat
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-ardoise-950">
                {Math.round(resultat.score)} %
              </p>
              <p className="mt-0.5 text-sm text-ardoise-600">
                {resultat.justes} bonne(s) réponse(s) sur {resultat.total} · seuil{' '}
                {resultat.seuilReussite} %
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {resultat.reussi ? (
                <Etiquette ton="succes">Niveau validé</Etiquette>
              ) : (
                <Etiquette ton="alerte">Seuil non atteint</Etiquette>
              )}
            </div>
          </div>

          <div className="mt-4">
            {resultat.reussi ? (
              <Encart ton="succes">
                {resultat.niveauSuivant
                  ? `Le niveau « ${resultat.niveauSuivant.titre} » est débloqué.`
                  : 'Vous avez terminé le dernier niveau du parcours.'}
              </Encart>
            ) : (
              <Encart ton="alerte">
                Relisez les leçons concernées, puis repassez le quiz. Les explications ci-dessous
                indiquent pourquoi chaque proposition est juste ou fausse.
              </Encart>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Bouton variante="secondaire" onClick={recommencer}>
              Repasser le quiz
            </Bouton>
            {resultat.niveauSuivant && (
              <Bouton onClick={() => navigate('/parcours')}>Voir le parcours</Bouton>
            )}
            <Bouton variante="discret" onClick={() => navigate('/parcours')}>
              Retour au parcours
            </Bouton>
          </div>
        </Carte>
      )}

      {quiz.questions.map((question, index) => {
        const correction = resultat?.details.find((d) => d.questionId === question.id);
        return (
          <Carte key={question.id}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ardoise-100 text-xs font-bold text-ardoise-700">
                {index + 1}
              </span>
              <p className="text-sm font-medium leading-relaxed text-ardoise-950">
                {question.enonce}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {(correction?.propositions ?? question.propositions).map((proposition) => {
                const corrigee = correction
                  ? (proposition as PropositionCorrigee)
                  : null;
                const selectionnee = choix[question.id] === proposition.id;
                let styles = 'border-ardoise-200 bg-white hover:border-ardoise-400';
                if (correction && corrigee) {
                  if (corrigee.correcte) styles = 'border-emerald-300 bg-emerald-50';
                  else if (corrigee.choisie) styles = 'border-rose-300 bg-rose-50';
                  else styles = 'border-ardoise-200 bg-ardoise-50';
                } else if (selectionnee) {
                  styles = 'border-ardoise-800 bg-ardoise-50';
                }

                return (
                  <div key={proposition.id}>
                    <button
                      type="button"
                      disabled={Boolean(resultat)}
                      onClick={() => setChoix({ ...choix, [question.id]: proposition.id })}
                      className={`w-full rounded-lg border px-3.5 py-2.5 text-left text-sm transition disabled:cursor-default ${styles}`}
                    >
                      <span className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                            corrigee?.correcte
                              ? 'border-emerald-500 bg-emerald-500 text-white'
                              : corrigee?.choisie
                                ? 'border-rose-500 bg-rose-500 text-white'
                                : selectionnee
                                  ? 'border-ardoise-800 bg-ardoise-800 text-white'
                                  : 'border-ardoise-300'
                          }`}
                        >
                          {corrigee?.correcte ? '✓' : corrigee?.choisie ? '✕' : ''}
                        </span>
                        <span className="text-ardoise-900">{proposition.libelle}</span>
                      </span>
                    </button>
                    {corrigee && (
                      <p
                        className={`mt-1 pl-3.5 pr-2 text-xs leading-relaxed ${
                          corrigee.correcte ? 'text-emerald-800' : 'text-ardoise-600'
                        }`}
                      >
                        {corrigee.explication}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {correction && (
              <div className="mt-4 rounded-lg bg-ardoise-50 px-3.5 py-2.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                  À retenir
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ardoise-800">
                  {correction.aRetenir}
                </p>
              </div>
            )}
          </Carte>
        );
      })}

      {!resultat && (
        <div className="flex flex-wrap items-center gap-3">
          <Bouton onClick={envoyer} disabled={!toutesRepondues || envoi}>
            {envoi ? 'Correction…' : 'Valider mes réponses'}
          </Bouton>
          {!toutesRepondues && (
            <p className="text-xs text-ardoise-500">
              Répondez aux {quiz.questions.length} questions pour valider.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
