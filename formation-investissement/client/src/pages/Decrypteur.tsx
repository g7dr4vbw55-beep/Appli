import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { fDateHeure } from '../lib/format';
import {
  Bouton,
  Carte,
  Encart,
  Etiquette,
  MessageErreur,
  TitreSection,
} from '../components/ui';

interface Analyse {
  titre: string;
  natureDuTexte: string;
  auteurIdentifiable: boolean;
  resumeFactuel: string;
  jargon: { terme: string; explication: string }[];
  faitsVerifiables: { affirmation: string; commentVerifier: string }[];
  opinionsEtPromesses: { affirmation: string; pourquoiCeNestPasUnFait: string }[];
  signauxAlerte: {
    signal: string;
    extrait: string;
    explication: string;
    gravite: 'faible' | 'moyenne' | 'elevee';
  }[];
  informationsManquantes: string[];
  questionsAsePoser: string[];
  verificationsOfficielles: string[];
  syntheseNeutre: string;
}

interface EntreeHistorique {
  id: number;
  titre: string;
  contexte: string;
  modele: string;
  date: string;
  longueur: number;
}

const tonsGravite: Record<string, 'alerte' | 'danger' | 'info'> = {
  faible: 'info',
  moyenne: 'alerte',
  elevee: 'danger',
};

export function Decrypteur() {
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [messageIndisponible, setMessageIndisponible] = useState<string | null>(null);
  const [texte, setTexte] = useState('');
  const [contexte, setContexte] = useState('');
  const [analyse, setAnalyse] = useState<Analyse | null>(null);
  const [modele, setModele] = useState('');
  const [historique, setHistorique] = useState<EntreeHistorique[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [encours, setEncours] = useState(false);

  const chargerHistorique = () => {
    api
      .get<{ analyses: EntreeHistorique[] }>('/decrypteur/historique')
      .then((d) => setHistorique(d.analyses))
      .catch(() => setHistorique([]));
  };

  useEffect(() => {
    api
      .get<{ disponible: boolean; message: string | null }>('/decrypteur/etat')
      .then((d) => {
        setDisponible(d.disponible);
        setMessageIndisponible(d.message);
      })
      .catch(() => setDisponible(false));
    chargerHistorique();
  }, []);

  const analyser = async () => {
    setErreur(null);
    setEncours(true);
    setAnalyse(null);
    try {
      const reponse = await api.post<{ analyse: Analyse; modele: string }>(
        '/decrypteur/analyser',
        { texte, contexte: contexte || undefined },
      );
      setAnalyse(reponse.analyse);
      setModele(reponse.modele);
      chargerHistorique();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEncours(false);
    }
  };

  const ouvrirAnalyse = async (id: number) => {
    const detail = await api.get<{ analyse: Analyse; texte: string; contexte: string; modele: string }>(
      `/decrypteur/analyses/${id}`,
    );
    setAnalyse(detail.analyse);
    setTexte(detail.texte);
    setContexte(detail.contexte);
    setModele(detail.modele);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TitreSection
        titre="Décrypteur d’actualité"
        sousTitre="Collez un article, une publication, un message ou une publicité. L’outil explique le jargon, résume ce qui est réellement affirmé, sépare les faits vérifiables des opinions et relève les signaux d’alerte présents dans le texte."
      />

      <Encart ton="alerte">
        Cet outil ne dit jamais s’il faut acheter, vendre ou conserver quoi que ce soit, et ne
        produit aucune prévision de prix. Il décrit des procédés d’écriture et des éléments
        vérifiables. Le texte que vous collez est envoyé à l’API Anthropic pour être analysé ; il
        est également conservé dans votre base locale.
      </Encart>

      {disponible === false && (
        <Encart ton="info" titre="Décrypteur indisponible">
          {messageIndisponible}
          <p className="mt-2">
            Ajoutez la ligne <code className="rounded bg-white/60 px-1">ANTHROPIC_API_KEY=…</code>{' '}
            dans le fichier <code className="rounded bg-white/60 px-1">.env</code> à la racine du
            projet, puis relancez <code className="rounded bg-white/60 px-1">npm run dev</code>.
          </p>
        </Encart>
      )}

      {erreur && <MessageErreur message={erreur} />}

      {analyse && (
        <div className="space-y-4">
          <Carte>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ardoise-950">{analyse.titre}</h2>
                <p className="mt-1 text-sm text-ardoise-600">{analyse.natureDuTexte}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Etiquette ton={analyse.auteurIdentifiable ? 'succes' : 'alerte'}>
                  {analyse.auteurIdentifiable ? 'auteur identifiable' : 'auteur non identifiable'}
                </Etiquette>
                <Etiquette
                  ton={
                    analyse.signauxAlerte.length === 0
                      ? 'succes'
                      : analyse.signauxAlerte.some((s) => s.gravite === 'elevee')
                        ? 'danger'
                        : 'alerte'
                  }
                >
                  {analyse.signauxAlerte.length} signal
                  {analyse.signauxAlerte.length > 1 ? 'ux' : ''} d’alerte
                </Etiquette>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-ardoise-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                Ce que le texte affirme réellement
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ardoise-800">
                {analyse.resumeFactuel}
              </p>
            </div>
          </Carte>

          {analyse.signauxAlerte.length > 0 && (
            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                Signaux d’alerte relevés
              </h3>
              <div className="space-y-3">
                {analyse.signauxAlerte.map((signal, i) => (
                  <div key={i}>
                    <Encart ton={tonsGravite[signal.gravite] ?? 'alerte'}>
                      <p className="font-semibold">
                        {signal.signal}{' '}
                        <span className="font-normal opacity-75">— gravité {signal.gravite}</span>
                      </p>
                      {signal.extrait && (
                        <p className="mt-1.5 border-l-2 border-current/30 pl-3 italic opacity-90">
                          « {signal.extrait} »
                        </p>
                      )}
                      <p className="mt-1.5">{signal.explication}</p>
                    </Encart>
                  </div>
                ))}
              </div>
            </Carte>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                Faits vérifiables ({analyse.faitsVerifiables.length})
              </h3>
              {analyse.faitsVerifiables.length === 0 ? (
                <p className="text-sm text-ardoise-500">
                  Aucun élément présenté comme un fait vérifiable n’a été relevé.
                </p>
              ) : (
                <ul className="space-y-3">
                  {analyse.faitsVerifiables.map((fait, i) => (
                    <li key={i} className="text-sm">
                      <p className="leading-relaxed text-ardoise-800">{fait.affirmation}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ardoise-500">
                        Vérification : {fait.commentVerifier}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Carte>

            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                Opinions et promesses ({analyse.opinionsEtPromesses.length})
              </h3>
              {analyse.opinionsEtPromesses.length === 0 ? (
                <p className="text-sm text-ardoise-500">Aucune opinion présentée comme un fait.</p>
              ) : (
                <ul className="space-y-3">
                  {analyse.opinionsEtPromesses.map((opinion, i) => (
                    <li key={i} className="text-sm">
                      <p className="leading-relaxed text-ardoise-800">{opinion.affirmation}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ardoise-500">
                        {opinion.pourquoiCeNestPasUnFait}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Carte>
          </div>

          {analyse.jargon.length > 0 && (
            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                Jargon employé
              </h3>
              <dl className="grid gap-3 sm:grid-cols-2">
                {analyse.jargon.map((entree, i) => (
                  <div key={i} className="rounded-lg bg-ardoise-50 px-3 py-2.5">
                    <dt className="text-sm font-semibold text-ardoise-900">{entree.terme}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ardoise-700">
                      {entree.explication}
                    </dd>
                  </div>
                ))}
              </dl>
            </Carte>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {analyse.informationsManquantes.length > 0 && (
              <Carte>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                  Ce qui manque dans le texte
                </h3>
                <ul className="space-y-1.5">
                  {analyse.informationsManquantes.map((info, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-ardoise-700">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ardoise-400" />
                      {info}
                    </li>
                  ))}
                </ul>
              </Carte>
            )}

            {analyse.questionsAsePoser.length > 0 && (
              <Carte>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                  Questions à se poser
                </h3>
                <ul className="space-y-1.5">
                  {analyse.questionsAsePoser.map((question, i) => (
                    <li key={i} className="flex gap-2 text-sm leading-relaxed text-ardoise-700">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ardoise-400" />
                      {question}
                    </li>
                  ))}
                </ul>
              </Carte>
            )}
          </div>

          {analyse.verificationsOfficielles.length > 0 && (
            <Carte>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
                Vérifications auprès de sources officielles
              </h3>
              <ul className="space-y-1.5">
                {analyse.verificationsOfficielles.map((verif, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-relaxed text-ardoise-700">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ardoise-400" />
                    {verif}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-3 border-t border-ardoise-100 pt-3 text-xs">
                {[
                  { nom: 'Liste noire AMF', url: 'https://www.amf-france.org/fr/espace-epargnants/proteger-son-epargne/listes-noires-et-mises-en-garde' },
                  { nom: 'Regafi', url: 'https://www.regafi.fr/' },
                  { nom: 'Orias', url: 'https://www.orias.fr/' },
                  { nom: 'Cybermalveillance', url: 'https://www.cybermalveillance.gouv.fr/' },
                ].map((lien) => (
                  <a
                    key={lien.url}
                    href={lien.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-800 underline decoration-sky-300 underline-offset-2"
                  >
                    {lien.nom}
                  </a>
                ))}
              </div>
            </Carte>
          )}

          <Carte>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
              Synthèse descriptive
            </h3>
            <p className="text-sm leading-relaxed text-ardoise-800">{analyse.syntheseNeutre}</p>
            <p className="mt-3 border-t border-ardoise-100 pt-3 text-xs text-ardoise-500">
              Analyse produite par le modèle {modele}. Elle décrit le texte fourni et ne constitue ni
              un conseil, ni une vérification des faits, ni une garantie. Recoupez toujours avec les
              sources officielles.
            </p>
          </Carte>
        </div>
      )}

      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Texte à décrypter
        </h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ardoise-800">
              Provenance du texte (facultatif)
            </span>
            <input
              type="text"
              value={contexte}
              onChange={(e) => setContexte(e.target.value)}
              placeholder="ex : message reçu sur Telegram, publicité vue sur un réseau social, article de presse…"
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ardoise-800">Contenu</span>
            <textarea
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              rows={10}
              placeholder="Collez ici l’article, la publication, le courriel ou la publicité à analyser…"
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm leading-relaxed"
            />
            <span className="mt-1 block text-xs text-ardoise-400">
              {texte.trim().length} caractères — 80 minimum, 40 000 maximum
            </span>
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <Bouton
              onClick={analyser}
              disabled={encours || disponible !== true || texte.trim().length < 80}
            >
              {encours ? 'Analyse en cours…' : 'Décrypter ce texte'}
            </Bouton>
            {texte && (
              <Bouton variante="discret" onClick={() => { setTexte(''); setAnalyse(null); }}>
                Effacer
              </Bouton>
            )}
          </div>
        </div>
      </Carte>

      {historique.length > 0 && (
        <Carte>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Analyses précédentes ({historique.length})
          </h2>
          <ul className="divide-y divide-ardoise-100">
            {historique.map((entree) => (
              <li key={entree.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => ouvrirAnalyse(entree.id)}
                    className="text-left text-sm font-medium text-ardoise-900 hover:underline"
                  >
                    {entree.titre}
                  </button>
                  <p className="text-xs text-ardoise-500">
                    {fDateHeure(entree.date)} · {entree.longueur} caractères
                    {entree.contexte && ` · ${entree.contexte}`}
                  </p>
                </div>
                <Bouton
                  variante="discret"
                  onClick={async () => {
                    await api.delete(`/decrypteur/analyses/${entree.id}`);
                    chargerHistorique();
                  }}
                >
                  Supprimer
                </Bouton>
              </li>
            ))}
          </ul>
        </Carte>
      )}
    </div>
  );
}
