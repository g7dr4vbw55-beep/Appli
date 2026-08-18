import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Markdown } from '../components/Markdown';
import { Bouton, Carte, Chargement, Encart, Etiquette, MessageErreur } from '../components/ui';

interface LeconDetail {
  id: number;
  slug: string;
  titre: string;
  resume: string;
  corps: string;
  pointsCles: string[];
  sources: { label: string; url: string }[];
  nombreMots: number;
  lue: boolean;
  niveau: { slug: string; titre: string; position: number };
}

export function Lecon() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [lecon, setLecon] = useState<LeconDetail | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    setLecon(null);
    setErreur(null);
    api
      .get<LeconDetail>(`/parcours/lecons/${slug}`)
      .then(setLecon)
      .catch((e) => setErreur(e.message));
  }, [slug]);

  const marquerLue = useCallback(async () => {
    if (!lecon) return;
    await api.post(`/parcours/lecons/${lecon.slug}/lue`);
    setLecon({ ...lecon, lue: true });
  }, [lecon]);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!lecon) return <Chargement />;

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/parcours" className="text-sm text-ardoise-500 hover:text-ardoise-800">
          ← Parcours
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Etiquette>
            Niveau {lecon.niveau.position} · {lecon.niveau.titre}
          </Etiquette>
          <Etiquette>{lecon.nombreMots} mots</Etiquette>
          {lecon.lue && <Etiquette ton="succes">Lue</Etiquette>}
        </div>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ardoise-950">
          {lecon.titre}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ardoise-600">{lecon.resume}</p>
      </div>

      <Carte>
        <Markdown texte={lecon.corps} />
      </Carte>

      <Carte>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          À retenir
        </h2>
        <ul className="space-y-2">
          {lecon.pointsCles.map((point, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-ardoise-800">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ardoise-400" />
              {point}
            </li>
          ))}
        </ul>
      </Carte>

      {lecon.sources.length > 0 && (
        <Carte>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Pour vérifier par vous-même
          </h2>
          <ul className="space-y-1.5 text-sm">
            {lecon.sources.map((source) => (
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
      )}

      <Encart ton="neutre">
        Cette leçon est informative. Elle ne constitue ni un conseil en investissement, ni une
        recommandation personnalisée, ni une incitation à acheter ou vendre un actif quelconque.
      </Encart>

      <div className="flex flex-wrap gap-3">
        {!lecon.lue && <Bouton onClick={marquerLue}>Marquer comme lue</Bouton>}
        <Bouton
          variante="secondaire"
          onClick={() => navigate(`/parcours/${lecon.niveau.slug}/quiz`)}
        >
          Aller au quiz du niveau
        </Bouton>
        <Bouton variante="discret" onClick={() => navigate('/parcours')}>
          Retour au parcours
        </Bouton>
      </div>
    </article>
  );
}
