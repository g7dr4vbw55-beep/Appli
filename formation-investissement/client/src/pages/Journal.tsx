import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import type { DecisionEnAttente, Ecart, TableauDeBord } from '../lib/types';
import { couleurMontant, fDate, fEuros, fPourcent, libelleClasse } from '../lib/format';
import {
  Bouton,
  Carte,
  Chargement,
  Encart,
  Etiquette,
  Jauge,
  MessageErreur,
  Statistique,
  TitreSection,
} from '../components/ui';

const issues = [
  { valeur: 'verifiee', libelle: 'Ma thèse s’est vérifiée' },
  { valeur: 'partiellement', libelle: 'Partiellement vérifiée' },
  { valeur: 'invalidee', libelle: 'Ma thèse a été invalidée' },
  { valeur: 'indeterminee', libelle: 'Impossible de trancher' },
] as const;

const raisons = [
  { valeur: 'these_atteinte', libelle: 'La thèse était atteinte' },
  { valeur: 'invalidation', libelle: 'La condition d’invalidation était atteinte' },
  { valeur: 'rebalancement', libelle: 'Rééquilibrage du portefeuille' },
  { valeur: 'besoin_argent', libelle: 'Besoin de liquidités' },
  { valeur: 'peur', libelle: 'Inquiétude face à la baisse' },
  { valeur: 'euphorie', libelle: 'Euphorie après une hausse' },
  { valeur: 'autre', libelle: 'Autre motif' },
] as const;

export function Journal() {
  const [tableau, setTableau] = useState<TableauDeBord | null>(null);
  const [decisions, setDecisions] = useState<DecisionEnAttente[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [bilanOuvert, setBilanOuvert] = useState<number | null>(null);

  const recharger = useCallback(() => {
    api.get<TableauDeBord>('/journal/tableau-de-bord').then(setTableau).catch((e) => setErreur(e.message));
    api.get<{ decisions: DecisionEnAttente[] }>('/journal/decisions').then((d) => setDecisions(d.decisions));
  }, []);

  useEffect(recharger, [recharger]);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!tableau) return <Chargement />;

  const v = tableau.volumetrie;
  const sansBilan = tableau.ecarts.filter((e) => !e.bilanRedige);

  return (
    <div className="space-y-6">
      <TitreSection
        titre="Journal de décisions et bilan"
        sousTitre="Ce tableau de bord compare ce que vous aviez écrit avant chaque ordre à ce qui s’est réellement passé. Les constats sont descriptifs et factuels : ils ne jugent pas la personne et ne suggèrent aucune action de marché."
        action={
          <Link to="/portefeuille/nouvel-ordre">
            <Bouton variante="secondaire">Nouvelle décision</Bouton>
          </Link>
        }
      />

      <Carte>
        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-6">
          <Statistique libelle="Décisions écrites" valeur={String(v.decisionsEcrites)} detail={`${v.decisionsAnnulees} annulée(s)`} />
          <Statistique libelle="Ordres passés" valeur={String(v.ordresPasses)} />
          <Statistique
            libelle="Positions"
            valeur={`${v.positionsOuvertes} / ${v.positionsCloturees}`}
            detail="ouvertes / clôturées"
          />
          <Statistique
            libelle="Bilans rédigés"
            valeur={`${v.bilansRediges} / ${v.positionsCloturees}`}
          />
          <Statistique
            libelle="Durée moyenne"
            valeur={v.dureeDetentionMoyenneJours !== null ? `${v.dureeDetentionMoyenneJours} j` : '—'}
            detail={
              v.tauxRespectHorizon !== null ? `horizon tenu : ${v.tauxRespectHorizon} %` : undefined
            }
          />
          <Statistique
            libelle="Résultat réalisé"
            valeur={fEuros(v.resultatRealiseTotal)}
            detail={`frais : ${fEuros(v.fraisCumules)}`}
            couleur={couleurMontant(v.resultatRealiseTotal)}
          />
        </div>
      </Carte>

      <Encart ton="neutre">{tableau.avertissement}</Encart>

      {/* Schémas repérés */}
      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Schémas repérés dans vos décisions
        </h2>
        {tableau.schemas.length === 0 ? (
          <p className="py-6 text-center text-sm text-ardoise-500">
            Aucun schéma répétitif n’est détectable pour l’instant. Il en faut plusieurs pour qu’une
            tendance ait un sens : continuez à documenter vos décisions.
          </p>
        ) : (
          <div className="space-y-4">
            {tableau.schemas.map((schema) => (
              <div
                key={schema.code}
                className={`rounded-lg border p-4 ${
                  schema.intensite === 'recurrent'
                    ? 'border-amber-300 bg-amber-50/60'
                    : 'border-ardoise-200'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-ardoise-950">{schema.titre}</h3>
                  <Etiquette ton={schema.intensite === 'recurrent' ? 'alerte' : 'neutre'}>
                    {schema.occurrences} sur {schema.total}
                  </Etiquette>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ardoise-800">{schema.constat}</p>
                <p className="mt-2 text-sm leading-relaxed text-ardoise-600">{schema.rappel}</p>
                {schema.leconSlug && (
                  <Link
                    to={`/parcours/lecon/${schema.leconSlug}`}
                    className="mt-2 inline-block text-xs font-medium text-sky-800 underline decoration-sky-300 underline-offset-2"
                  >
                    Relire la leçon correspondante →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </Carte>

      {/* Bilans à rédiger */}
      {sansBilan.length > 0 && (
        <Carte className="border-sky-300">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Bilans à rédiger ({sansBilan.length})
          </h2>
          <div className="space-y-3">
            {sansBilan.map((ecart) => (
              <div key={ecart.positionId} className="rounded-lg border border-ardoise-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold">{ecart.symbole}</span>{' '}
                    <span className="text-sm text-ardoise-600">
                      clôturée le {fDate(ecart.clotureLe)} · {ecart.dureeDetentionJours} jours ·{' '}
                      <span className={couleurMontant(ecart.resultatRealiseEuros)}>
                        {fEuros(ecart.resultatRealiseEuros)}
                      </span>
                    </span>
                  </div>
                  <Bouton
                    variante="secondaire"
                    onClick={() =>
                      setBilanOuvert(bilanOuvert === ecart.positionId ? null : ecart.positionId)
                    }
                  >
                    {bilanOuvert === ecart.positionId ? 'Fermer' : 'Rédiger le bilan'}
                  </Bouton>
                </div>
                {bilanOuvert === ecart.positionId && (
                  <FormulaireBilan
                    ecart={ecart}
                    onEnregistre={() => {
                      setBilanOuvert(null);
                      recharger();
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </Carte>
      )}

      {/* Écarts prévu / réalisé */}
      <Carte>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Écart entre ce qui était prévu et ce qui s’est passé
        </h2>
        <p className="mb-4 text-sm text-ardoise-600">
          Une ligne par position clôturée. Aucun jugement n’est porté : seuls des faits sont mis en
          regard.
        </p>
        {tableau.ecarts.length === 0 ? (
          <p className="py-6 text-center text-sm text-ardoise-500">Aucune position clôturée.</p>
        ) : (
          <div className="space-y-3">
            {tableau.ecarts.map((ecart) => (
              <div key={ecart.positionId} className="rounded-lg border border-ardoise-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ardoise-950">{ecart.symbole}</span>
                    <Etiquette>{libelleClasse[ecart.classe] ?? ecart.classe}</Etiquette>
                    {ecart.horizonTenu === false && <Etiquette ton="alerte">horizon non tenu</Etiquette>}
                    {ecart.invalidationDeclenchee && ecart.invalidationRespectee === false && (
                      <Etiquette ton="alerte">invalidation non suivie</Etiquette>
                    )}
                    {!ecart.bilanRedige && <Etiquette ton="info">bilan manquant</Etiquette>}
                  </div>
                  <span className={`text-sm font-medium tabular-nums ${couleurMontant(ecart.resultatRealiseEuros)}`}>
                    {fEuros(ecart.resultatRealiseEuros)} ({fPourcent(ecart.resultatRealisePourcent)})
                  </span>
                </div>

                <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-md bg-ardoise-50 p-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                      Prévu
                    </p>
                    <p className="text-xs leading-relaxed text-ardoise-700">{ecart.these}</p>
                    <p className="mt-2 text-xs text-ardoise-600">
                      Horizon : {ecart.horizonPrevuMois} mois · risque accepté :{' '}
                      {fEuros(ecart.risqueAccepteEuros)}
                    </p>
                    <p className="mt-1 text-xs text-ardoise-600">
                      Invalidation : {ecart.conditionInvalidation}
                    </p>
                  </div>
                  <div className="rounded-md bg-ardoise-50 p-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ardoise-500">
                      Réalisé
                    </p>
                    <p className="text-xs text-ardoise-700">
                      Détenue {ecart.dureeDetentionJours} jours, du {fDate(ecart.ouvertLe)} au{' '}
                      {fDate(ecart.clotureLe)}
                    </p>
                    {ecart.respectHorizonPourcent !== null && (
                      <div className="mt-2">
                        <p className="mb-1 text-xs text-ardoise-600">
                          {ecart.respectHorizonPourcent} % de l’horizon annoncé
                        </p>
                        <Jauge
                          valeur={ecart.respectHorizonPourcent}
                          total={100}
                          ton={ecart.horizonTenu ? 'succes' : 'alerte'}
                        />
                      </div>
                    )}
                    {ecart.raisonSortie && (
                      <p className="mt-2 text-xs text-ardoise-600">Motif de sortie : {ecart.raisonSortie}</p>
                    )}
                    {ecart.issueThese && (
                      <p className="mt-1 text-xs text-ardoise-600">
                        Issue déclarée de la thèse : {ecart.issueThese}
                      </p>
                    )}
                  </div>
                </div>

                {ecart.constats.length > 0 && (
                  <ul className="mt-3 space-y-1.5 border-t border-ardoise-100 pt-3">
                    {ecart.constats.map((constat, i) => (
                      <li key={i} className="flex gap-2 text-xs leading-relaxed text-ardoise-700">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ardoise-400" />
                        {constat}
                      </li>
                    ))}
                  </ul>
                )}

                {ecart.lecon && (
                  <p className="mt-3 rounded-md bg-sky-50 px-3 py-2 text-xs leading-relaxed text-sky-900">
                    <span className="font-semibold">Ce que vous en aviez retenu : </span>
                    {ecart.lecon}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Carte>

      {/* Historique complet des décisions */}
      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Toutes les décisions ({decisions.length})
        </h2>
        {decisions.length === 0 ? (
          <p className="py-6 text-center text-sm text-ardoise-500">Aucune décision enregistrée.</p>
        ) : (
          <ul className="divide-y divide-ardoise-100">
            {decisions.map((decision) => (
              <li key={decision.id} className="py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-ardoise-500">{fDate(decision.created_at)}</span>
                  <Etiquette ton={decision.side === 'achat' ? 'info' : 'neutre'}>
                    {decision.side}
                  </Etiquette>
                  <span className="font-medium">{decision.symbol}</span>
                  <Etiquette
                    ton={
                      decision.status === 'executee'
                        ? 'succes'
                        : decision.status === 'annulee'
                          ? 'danger'
                          : 'alerte'
                    }
                  >
                    {decision.status}
                  </Etiquette>
                  <span className="text-xs text-ardoise-500">
                    horizon {decision.horizon_months} mois · risque{' '}
                    {fEuros(decision.risk_accepted_eur)} · conviction {decision.conviction}/5
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-ardoise-700">{decision.thesis}</p>
                <p className="mt-1 text-xs leading-relaxed text-ardoise-500">
                  Invalidation : {decision.invalidation_condition}
                  {decision.emotion && ` · état d’esprit déclaré : ${decision.emotion}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Carte>
    </div>
  );
}

function FormulaireBilan({
  ecart,
  onEnregistre,
}: {
  ecart: Ecart;
  onEnregistre: () => void;
}) {
  const [cequisEstPasse, setCequisEstPasse] = useState('');
  const [issue, setIssue] = useState<(typeof issues)[number]['valeur']>('indeterminee');
  const [declenchee, setDeclenchee] = useState(false);
  const [respectee, setRespectee] = useState(false);
  const [raison, setRaison] = useState<(typeof raisons)[number]['valeur']>('these_atteinte');
  const [emotion, setEmotion] = useState('');
  const [lecon, setLecon] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);

  const enregistrer = async () => {
    setErreur(null);
    try {
      await api.post('/journal/bilans', {
        positionId: ecart.positionId,
        cequisEstPasse,
        issueThese: issue,
        invalidationDeclenchee: declenchee,
        invalidationRespectee: respectee,
        raisonSortie: raison,
        emotion,
        lecon,
      });
      onEnregistre();
    } catch (e) {
      setErreur((e as Error).message);
    }
  };

  return (
    <div className="mt-4 space-y-4 border-t border-ardoise-200 pt-4">
      {erreur && <MessageErreur message={erreur} />}

      <div className="rounded-md bg-ardoise-50 p-3 text-xs leading-relaxed text-ardoise-700">
        <p>
          <span className="font-semibold">Ce que vous aviez écrit : </span>
          {ecart.these}
        </p>
        <p className="mt-1">
          <span className="font-semibold">Condition d’invalidation annoncée : </span>
          {ecart.conditionInvalidation}
        </p>
        <p className="mt-1">
          Horizon annoncé {ecart.horizonPrevuMois} mois, durée réelle {ecart.dureeDetentionJours}{' '}
          jours. Risque accepté {fEuros(ecart.risqueAccepteEuros)}, résultat réalisé{' '}
          {fEuros(ecart.resultatRealiseEuros)}.
        </p>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-ardoise-800">
          Que s’est-il réellement passé ?
        </span>
        <textarea
          value={cequisEstPasse}
          onChange={(e) => setCequisEstPasse(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm leading-relaxed"
          placeholder="Décrivez les faits, pas votre opinion sur vous-même. Minimum 30 caractères."
        />
        <span className="mt-1 block text-xs text-ardoise-400">
          {cequisEstPasse.trim().length} / 30 caractères minimum
        </span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ardoise-800">Issue de la thèse</span>
          <select
            value={issue}
            onChange={(e) => setIssue(e.target.value as typeof issue)}
            className="w-full rounded-md border border-ardoise-300 bg-white px-3 py-2 text-sm"
          >
            {issues.map((i) => (
              <option key={i.valeur} value={i.valeur}>
                {i.libelle}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ardoise-800">Motif de la sortie</span>
          <select
            value={raison}
            onChange={(e) => setRaison(e.target.value as typeof raison)}
            className="w-full rounded-md border border-ardoise-300 bg-white px-3 py-2 text-sm"
          >
            {raisons.map((r) => (
              <option key={r.valeur} value={r.valeur}>
                {r.libelle}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-2 rounded-md border border-ardoise-200 p-3">
        <label className="flex items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={declenchee}
            onChange={(e) => setDeclenchee(e.target.checked)}
            className="mt-0.5"
          />
          <span>La condition d’invalidation que j’avais écrite s’est produite.</span>
        </label>
        <label className="flex items-start gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={respectee}
            onChange={(e) => setRespectee(e.target.checked)}
            className="mt-0.5"
          />
          <span>J’ai agi conformément à ce que j’avais prévu en cas d’invalidation.</span>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ardoise-800">
            État d’esprit à la sortie (facultatif)
          </span>
          <input
            type="text"
            value={emotion}
            onChange={(e) => setEmotion(e.target.value)}
            className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ardoise-800">
            Ce que j’en retiens (facultatif)
          </span>
          <input
            type="text"
            value={lecon}
            onChange={(e) => setLecon(e.target.value)}
            className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <Bouton onClick={enregistrer} disabled={cequisEstPasse.trim().length < 30}>
        Enregistrer le bilan
      </Bouton>
    </div>
  );
}
