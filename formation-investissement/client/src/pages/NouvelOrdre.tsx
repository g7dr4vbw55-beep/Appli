import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import type { ActifDisponible, DecisionEnAttente } from '../lib/types';
import { fDateHeure, fEuros, fQuantite, libelleClasse } from '../lib/format';
import {
  Bouton,
  Carte,
  Encart,
  Etiquette,
  MessageErreur,
  TitreSection,
} from '../components/ui';

interface ResultatOrdre {
  ordreId: number;
  side: string;
  quantite: number;
  prixUnitaire: number;
  sourcePrix: string;
  frais: { pourcentage: number; fixe: number; total: number };
  montantBrut: number;
  fluxNet: number;
  plusValueRealisee: number;
  positionCloturee: boolean;
  liquiditesRestantes: number;
  observations: string[];
}

const horizons = [
  { valeur: 'court', libelle: 'Court terme (moins de 2 ans)', moisParDefaut: 12 },
  { valeur: 'moyen', libelle: 'Moyen terme (2 à 8 ans)', moisParDefaut: 48 },
  { valeur: 'long', libelle: 'Long terme (plus de 8 ans)', moisParDefaut: 120 },
] as const;

export function NouvelOrdre() {
  const navigate = useNavigate();
  const [actifs, setActifs] = useState<ActifDisponible[]>([]);
  const [enAttente, setEnAttente] = useState<DecisionEnAttente[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);

  // Étape 1 : journal de décision (obligatoire)
  const [actifId, setActifId] = useState<number | null>(null);
  const [side, setSide] = useState<'achat' | 'vente'>('achat');
  const [these, setThese] = useState('');
  const [horizon, setHorizon] = useState<'court' | 'moyen' | 'long'>('long');
  const [horizonMois, setHorizonMois] = useState(120);
  const [risque, setRisque] = useState('');
  const [invalidation, setInvalidation] = useState('');
  const [conviction, setConviction] = useState(3);
  const [emotion, setEmotion] = useState('');

  // Étape 2 : exécution
  const [decisionChoisie, setDecisionChoisie] = useState<DecisionEnAttente | null>(null);
  const [quantite, setQuantite] = useState('');
  const [prixManuel, setPrixManuel] = useState('');
  const [resultat, setResultat] = useState<ResultatOrdre | null>(null);
  const [envoi, setEnvoi] = useState(false);

  const recharger = () => {
    api.get<{ actifs: ActifDisponible[] }>('/portefeuille/actifs').then((d) => setActifs(d.actifs));
    api
      .get<{ decisions: DecisionEnAttente[] }>('/journal/decisions/en-attente')
      .then((d) => setEnAttente(d.decisions));
  };

  useEffect(recharger, []);

  const actifSelectionne = useMemo(
    () => actifs.find((a) => a.id === actifId) ?? null,
    [actifs, actifId],
  );

  const risqueNombre = Number(risque.replace(',', '.'));
  const tailleMaxSuggeree =
    Number.isFinite(risqueNombre) && risqueNombre > 0 ? risqueNombre * 2 : null;

  const enregistrerDecision = async () => {
    setErreur(null);
    if (!actifId) {
      setErreur('Sélectionnez un actif.');
      return;
    }
    try {
      await api.post<{ id: number }>('/journal/decisions', {
        actifId,
        side,
        these,
        horizon,
        horizonMois,
        risqueAccepteEuros: Number.isFinite(risqueNombre) ? risqueNombre : 0,
        conditionInvalidation: invalidation,
        conviction,
        emotion,
      });
      setThese('');
      setInvalidation('');
      setRisque('');
      setEmotion('');
      recharger();
    } catch (e) {
      const message = (e as Error).message;
      setErreur(
        message === 'Le journal de décision est incomplet.'
          ? 'Le journal est incomplet : la thèse doit faire au moins 40 caractères et la condition d’invalidation au moins 20 caractères.'
          : message,
      );
    }
  };

  const executer = async () => {
    if (!decisionChoisie) return;
    setErreur(null);
    setEnvoi(true);
    try {
      const corps: Record<string, unknown> = {
        decisionId: decisionChoisie.id,
        quantite: Number(quantite.replace(',', '.')),
      };
      const prix = Number(prixManuel.replace(',', '.'));
      if (Number.isFinite(prix) && prix > 0) corps.prixUnitaire = prix;
      const reponse = await api.post<ResultatOrdre>('/portefeuille/ordres', corps);
      setResultat(reponse);
      setDecisionChoisie(null);
      setQuantite('');
      setPrixManuel('');
      recharger();
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TitreSection
        titre="Passer un ordre"
        sousTitre="Aucun ordre ne peut être exécuté tant que le journal de décision correspondant n’est pas rempli. C’est une contrainte volontaire : elle vous oblige à écrire votre raisonnement avant d’agir, pour pouvoir vous relire ensuite."
      />

      {erreur && <MessageErreur message={erreur} />}

      {resultat && (
        <Carte className="border-emerald-300">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Ordre simulé exécuté
          </h2>
          <div className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-ardoise-500">Quantité et prix</p>
              <p className="font-medium">
                {fQuantite(resultat.quantite)} à {fEuros(resultat.prixUnitaire)}
              </p>
              <p className="text-xs text-ardoise-500">source : {resultat.sourcePrix}</p>
            </div>
            <div>
              <p className="text-xs text-ardoise-500">Frais simulés</p>
              <p className="font-medium">{fEuros(resultat.frais.total)}</p>
              <p className="text-xs text-ardoise-500">
                dont {fEuros(resultat.frais.pourcentage)} proportionnels et {fEuros(resultat.frais.fixe)} fixes
              </p>
            </div>
            <div>
              <p className="text-xs text-ardoise-500">Liquidités restantes</p>
              <p className="font-medium">{fEuros(resultat.liquiditesRestantes)}</p>
              {resultat.side === 'vente' && (
                <p className="text-xs text-ardoise-500">
                  Résultat réalisé : {fEuros(resultat.plusValueRealisee)}
                </p>
              )}
            </div>
          </div>
          {resultat.observations.length > 0 && (
            <ul className="mt-4 space-y-2">
              {resultat.observations.map((observation, i) => (
                <li key={i}>
                  <Encart ton="info">{observation}</Encart>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Bouton onClick={() => navigate('/portefeuille')}>Voir le portefeuille</Bouton>
            {resultat.positionCloturee && (
              <Bouton variante="secondaire" onClick={() => navigate('/journal')}>
                Rédiger le bilan de la position
              </Bouton>
            )}
            <Bouton variante="discret" onClick={() => setResultat(null)}>
              Passer un autre ordre
            </Bouton>
          </div>
        </Carte>
      )}

      {/* Étape 2 : décisions prêtes à être exécutées */}
      {enAttente.length > 0 && (
        <Carte>
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ardoise-900 text-xs font-bold text-white">
              2
            </span>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ardoise-500">
              Exécuter une décision enregistrée
            </h2>
          </div>
          <p className="mb-4 text-sm text-ardoise-600">
            Une décision ne sert qu’une fois. Après exécution, elle est archivée dans le journal.
          </p>
          <div className="space-y-3">
            {enAttente.map((decision) => (
              <div
                key={decision.id}
                className={`rounded-lg border p-4 transition ${
                  decisionChoisie?.id === decision.id
                    ? 'border-ardoise-800 bg-ardoise-50'
                    : 'border-ardoise-200'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Etiquette ton={decision.side === 'achat' ? 'info' : 'neutre'}>
                    {decision.side}
                  </Etiquette>
                  <span className="font-semibold">{decision.symbol}</span>
                  <Etiquette>{libelleClasse[decision.asset_class] ?? decision.asset_class}</Etiquette>
                  <Etiquette>{decision.kind}</Etiquette>
                  <span className="text-xs text-ardoise-500">{fDateHeure(decision.created_at)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ardoise-700">{decision.thesis}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-ardoise-500">
                  Horizon {decision.horizon_months} mois · risque accepté{' '}
                  {fEuros(decision.risk_accepted_eur)} · conviction {decision.conviction}/5
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ardoise-500">
                  Invalidation : {decision.invalidation_condition}
                </p>

                {decisionChoisie?.id === decision.id ? (
                  <div className="mt-4 space-y-3 border-t border-ardoise-200 pt-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Champ label="Quantité">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={quantite}
                          onChange={(e) => setQuantite(e.target.value)}
                          className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
                          placeholder="ex : 0,05"
                        />
                      </Champ>
                      <Champ
                        label="Prix unitaire en € (facultatif)"
                        aide="Laissez vide pour utiliser la cotation. Obligatoire si aucune cotation n’est disponible."
                      >
                        <input
                          type="text"
                          inputMode="decimal"
                          value={prixManuel}
                          onChange={(e) => setPrixManuel(e.target.value)}
                          className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
                          placeholder="cotation automatique"
                        />
                      </Champ>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Bouton onClick={executer} disabled={envoi || !quantite}>
                        {envoi ? 'Exécution…' : 'Exécuter l’ordre simulé'}
                      </Bouton>
                      <Bouton variante="discret" onClick={() => setDecisionChoisie(null)}>
                        Annuler
                      </Bouton>
                      <Bouton
                        variante="danger"
                        onClick={async () => {
                          await api.post(`/journal/decisions/${decision.id}/annuler`);
                          setDecisionChoisie(null);
                          recharger();
                        }}
                      >
                        Renoncer à cette décision
                      </Bouton>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3">
                    <Bouton variante="secondaire" onClick={() => setDecisionChoisie(decision)}>
                      Utiliser cette décision
                    </Bouton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Carte>
      )}

      {/* Étape 1 : journal de décision */}
      <Carte>
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-ardoise-900 text-xs font-bold text-white">
            1
          </span>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Journal de décision
          </h2>
        </div>
        <p className="mb-5 text-sm leading-relaxed text-ardoise-600">
          Quatre éléments sont obligatoires : votre thèse, l’horizon de détention, le montant en
          euros que vous acceptez de perdre sur cette position, et la condition précise qui
          invaliderait votre thèse. Ces éléments seront comparés plus tard à ce qui s’est réellement
          passé.
        </p>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Actif">
              <select
                value={actifId ?? ''}
                onChange={(e) => setActifId(Number(e.target.value) || null)}
                className="w-full rounded-md border border-ardoise-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">— Choisir —</option>
                {(['etf', 'action', 'crypto'] as const).map((classe) => (
                  <optgroup key={classe} label={libelleClasse[classe]}>
                    {actifs
                      .filter((a) => a.classe === classe)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.symbole} — {a.nom}
                          {a.quantiteDetenue > 0 ? ` (détenu : ${fQuantite(a.quantiteDetenue)})` : ''}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </Champ>
            <Champ label="Sens de l’ordre">
              <div className="flex gap-2">
                {(['achat', 'vente'] as const).map((valeur) => (
                  <button
                    key={valeur}
                    type="button"
                    onClick={() => setSide(valeur)}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize transition ${
                      side === valeur
                        ? 'border-ardoise-800 bg-ardoise-900 text-white'
                        : 'border-ardoise-300 bg-white text-ardoise-700 hover:bg-ardoise-50'
                    }`}
                  >
                    {valeur}
                  </button>
                ))}
              </div>
            </Champ>
          </div>

          {actifSelectionne && (
            <Encart ton="neutre">
              <p>
                <strong>{actifSelectionne.symbole}</strong> — cotation via{' '}
                {actifSelectionne.fournisseur}
                {actifSelectionne.dernierPrixManuel !== null &&
                  ` · dernier prix manuel : ${fEuros(actifSelectionne.dernierPrixManuel)}`}
              </p>
              {actifSelectionne.notes && <p className="mt-1">{actifSelectionne.notes}</p>}
            </Encart>
          )}

          <Champ
            label="Votre thèse d’investissement"
            aide="Pourquoi engagez-vous de l’argent ici ? Écrivez-le comme si vous deviez vous l’expliquer dans deux ans. Minimum 40 caractères."
          >
            <textarea
              value={these}
              onChange={(e) => setThese(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm leading-relaxed"
              placeholder="ex : Brique indicielle destinée à rester en place très longtemps, alimentée par versements réguliers…"
            />
            <p className="mt-1 text-xs text-ardoise-400">{these.trim().length} / 40 caractères minimum</p>
          </Champ>

          <div className="grid gap-4 sm:grid-cols-3">
            <Champ label="Horizon de détention">
              <select
                value={horizon}
                onChange={(e) => {
                  const valeur = e.target.value as 'court' | 'moyen' | 'long';
                  setHorizon(valeur);
                  setHorizonMois(
                    horizons.find((h) => h.valeur === valeur)?.moisParDefaut ?? horizonMois,
                  );
                }}
                className="w-full rounded-md border border-ardoise-300 bg-white px-3 py-2 text-sm"
              >
                {horizons.map((h) => (
                  <option key={h.valeur} value={h.valeur}>
                    {h.libelle}
                  </option>
                ))}
              </select>
            </Champ>
            <Champ label="Soit, en mois">
              <input
                type="number"
                min={1}
                max={600}
                value={horizonMois}
                onChange={(e) => setHorizonMois(Number(e.target.value))}
                className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
              />
            </Champ>
            <Champ
              label="Risque accepté en €"
              aide="Le montant dont la perte ne changerait rien à votre situation."
            >
              <input
                type="text"
                inputMode="decimal"
                value={risque}
                onChange={(e) => setRisque(e.target.value)}
                className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
                placeholder="ex : 300"
              />
            </Champ>
          </div>

          {tailleMaxSuggeree !== null && (
            <Encart ton="neutre">
              Rappel de dimensionnement du niveau 4 : taille maximale = risque accepté ÷ baisse
              envisagée. Avec {fEuros(risqueNombre)} de risque accepté, un scénario de baisse de
              50 % correspond à une position d’au plus {fEuros(tailleMaxSuggeree)} ; un scénario de
              −90 % à environ {fEuros(risqueNombre / 0.9)}. Ce calcul est un repère arithmétique,
              pas une consigne d’allocation.
            </Encart>
          )}

          <Champ
            label="Condition d’invalidation"
            aide="Qu’est-ce qui, si cela se produit, vous ferait dire que vous vous êtes trompé ? Minimum 20 caractères."
          >
            <textarea
              value={invalidation}
              onChange={(e) => setInvalidation(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm leading-relaxed"
              placeholder="ex : Si le chiffre d’affaires recule deux trimestres consécutifs."
            />
            <p className="mt-1 text-xs text-ardoise-400">
              {invalidation.trim().length} / 20 caractères minimum
            </p>
          </Champ>

          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label={`Conviction déclarée : ${conviction}/5`}>
              <input
                type="range"
                min={1}
                max={5}
                value={conviction}
                onChange={(e) => setConviction(Number(e.target.value))}
                className="w-full"
              />
            </Champ>
            <Champ label="État d’esprit du moment (facultatif)">
              <input
                type="text"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
                placeholder="ex : calme, pressé, peur de rater…"
              />
            </Champ>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-ardoise-100 pt-4">
            <Bouton
              onClick={enregistrerDecision}
              disabled={!actifId || these.trim().length < 40 || invalidation.trim().length < 20}
            >
              Enregistrer la décision
            </Bouton>
            <p className="text-xs text-ardoise-500">
              L’ordre s’exécute ensuite à l’étape 2, à partir de cette décision.
            </p>
          </div>
        </div>
      </Carte>

      <Encart ton="alerte">
        Ce portefeuille est fictif. L’application ne vous encourage à aucun moment à reproduire ces
        opérations avec de l’argent réel, et ne formule aucune recommandation sur les actifs
        proposés.
      </Encart>
    </div>
  );
}

function Champ({
  label,
  aide,
  children,
}: {
  label: string;
  aide?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ardoise-800">{label}</span>
      {aide && <span className="mb-1.5 block text-xs leading-relaxed text-ardoise-500">{aide}</span>}
      {children}
    </label>
  );
}
