import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../lib/api';
import type { ActifDisponible, EtatPortefeuille, Ordre } from '../lib/types';
import {
  couleurMontant,
  fDate,
  fDateHeure,
  fEuros,
  fPourcent,
  fQuantite,
  libelleClasse,
} from '../lib/format';
import {
  Bouton,
  Carte,
  Chargement,
  Encart,
  Etiquette,
  MessageErreur,
  Statistique,
  TitreSection,
} from '../components/ui';

const couleursClasses: Record<string, string> = {
  action: '#65728f',
  etf: '#505b76',
  crypto: '#b0722c',
  liquidites: '#b0b8c9',
};

export function Portefeuille() {
  const [etat, setEtat] = useState<EtatPortefeuille | null>(null);
  const [ordres, setOrdres] = useState<Ordre[]>([]);
  const [actifs, setActifs] = useState<ActifDisponible[]>([]);
  const [erreur, setErreur] = useState<string | null>(null);
  const [ongletPrix, setOngletPrix] = useState(false);

  const recharger = useCallback(() => {
    api.get<EtatPortefeuille>('/portefeuille').then(setEtat).catch((e) => setErreur(e.message));
    api.get<{ ordres: Ordre[] }>('/portefeuille/ordres').then((d) => setOrdres(d.ordres));
    api.get<{ actifs: ActifDisponible[] }>('/portefeuille/actifs').then((d) => setActifs(d.actifs));
  }, []);

  useEffect(recharger, [recharger]);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!etat) return <Chargement texte="Récupération des cotations…" />;

  const donneesGraphe = etat.historique.map((point) => {
    const premier = etat.historique[0];
    const basePortefeuille = premier?.portefeuille ?? 0;
    const premierIndice = etat.historique.find((p) => p.indice !== null)?.indice ?? null;
    return {
      date: point.date,
      portefeuille:
        basePortefeuille > 0
          ? Number((((point.portefeuille - basePortefeuille) / basePortefeuille) * 100).toFixed(2))
          : 0,
      indice:
        premierIndice && point.indice
          ? Number((((point.indice - premierIndice) / premierIndice) * 100).toFixed(2))
          : null,
    };
  });

  return (
    <div className="space-y-6">
      <TitreSection
        titre="Portefeuille d’entraînement"
        sousTitre="Portefeuille entièrement fictif, alimenté par un capital virtuel. Les frais de transaction sont simulés. Cet écran décrit l’état de vos positions ; il n’indique jamais quoi acheter ni quand vendre."
        action={
          <div className="flex gap-2">
            <Link to="/portefeuille/nouvel-ordre">
              <Bouton>Passer un ordre</Bouton>
            </Link>
            <Link to="/portefeuille/parametres">
              <Bouton variante="secondaire">Paramètres</Bouton>
            </Link>
          </div>
        }
      />

      <Carte>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <Statistique libelle="Valeur totale" valeur={fEuros(etat.valeurTotale)} detail={`Capital de départ : ${fEuros(etat.capitalDepart)}`} />
          <Statistique
            libelle="Performance"
            valeur={fPourcent(etat.performancePourcent)}
            detail={fEuros(etat.performanceEuros)}
            couleur={couleurMontant(etat.performanceEuros)}
          />
          <Statistique libelle="Liquidités" valeur={fEuros(etat.liquidites)} detail="disponibles pour un ordre" />
          <Statistique
            libelle="Plus-value latente"
            valeur={fEuros(etat.plusValueLatente)}
            detail={`Réalisée : ${fEuros(etat.plusValueRealisee)}`}
            couleur={couleurMontant(etat.plusValueLatente)}
          />
          <Statistique
            libelle="Frais simulés cumulés"
            valeur={fEuros(etat.fraisCumules)}
            detail={`${etat.parametres.fraisPourcent} % + ${fEuros(etat.parametres.fraisFixe)} par ordre`}
          />
        </div>
      </Carte>

      {etat.alertes.length > 0 && (
        <div className="space-y-2">
          {etat.alertes.map((alerte, i) => (
            <Encart key={i} ton={alerte.gravite === 'attention' ? 'alerte' : 'info'}>
              {alerte.message}
            </Encart>
          ))}
          <p className="px-1 text-xs text-ardoise-500">
            Ces alertes sont des constats mesurés sur votre portefeuille. Elles ne constituent pas
            une invitation à vendre ni à rééquilibrer.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Carte className="lg:col-span-2">
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Évolution comparée à l’indice de référence
          </h2>
          {etat.comparaisonIndice ? (
            <p className="mb-4 text-xs text-ardoise-500">
              Indice : {etat.comparaisonIndice.symbole} — {etat.comparaisonIndice.nom}. Base 0 % au{' '}
              {fDate(etat.comparaisonIndice.depuis)}.
            </p>
          ) : (
            <p className="mb-4 text-xs text-ardoise-500">Aucun indice de référence configuré.</p>
          )}
          {donneesGraphe.length > 1 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donneesGraphe} margin={{ top: 5, right: 8, bottom: 0, left: -20 }}>
                  <CartesianGrid stroke="#eceef2" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#65728f' }}
                    tickFormatter={(v: string) => fDate(v)}
                    minTickGap={40}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#65728f' }}
                    tickFormatter={(v: number) => `${v} %`}
                  />
                  <Tooltip
                    formatter={(v, nom) => [v === null || v === undefined ? '—' : `${v} %`, String(nom)]}
                    labelFormatter={(v: string) => fDate(v)}
                    contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#d5d9e2' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="portefeuille"
                    name="Portefeuille"
                    stroke="#22252e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="indice"
                    name="Indice de référence"
                    stroke="#8591aa"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-ardoise-500">
              L’historique se construit au fil des ordres. Un relevé est enregistré à chaque
              opération.
            </p>
          )}
          {etat.comparaisonIndice && (
            <div className="mt-4 space-y-2 border-t border-ardoise-100 pt-3">
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  Portefeuille :{' '}
                  <strong className={couleurMontant(etat.comparaisonIndice.performancePortefeuillePourcent)}>
                    {fPourcent(etat.comparaisonIndice.performancePortefeuillePourcent)}
                  </strong>
                </span>
                <span>
                  Indice :{' '}
                  <strong>{fPourcent(etat.comparaisonIndice.performanceIndicePourcent)}</strong>
                </span>
                {etat.comparaisonIndice.ecartPoints !== null && (
                  <span>
                    Écart :{' '}
                    <strong className={couleurMontant(etat.comparaisonIndice.ecartPoints)}>
                      {etat.comparaisonIndice.ecartPoints > 0 ? '+' : ''}
                      {etat.comparaisonIndice.ecartPoints} points
                    </strong>
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-ardoise-500">
                {etat.comparaisonIndice.avertissement}
              </p>
            </div>
          )}
        </Carte>

        <Carte>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Répartition par classe d’actif
          </h2>
          {etat.repartitionAvecLiquidites.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={etat.repartitionAvecLiquidites}
                      dataKey="valeur"
                      nameKey="libelle"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {etat.repartitionAvecLiquidites.map((part) => (
                        <Cell key={part.classe} fill={couleursClasses[part.classe] ?? '#8591aa'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => fEuros(Number(v))}
                      contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: '#d5d9e2' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {etat.repartitionAvecLiquidites.map((part) => (
                  <li key={part.classe} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-sm"
                        style={{ backgroundColor: couleursClasses[part.classe] ?? '#8591aa' }}
                      />
                      {part.libelle}
                    </span>
                    <span className="tabular-nums text-ardoise-600">
                      {fEuros(part.valeur)} · {part.pourcent} %
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="py-10 text-center text-sm text-ardoise-500">Aucune position ouverte.</p>
          )}
        </Carte>
      </div>

      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Positions ouvertes
        </h2>
        {etat.positions.length === 0 ? (
          <p className="py-8 text-center text-sm text-ardoise-500">
            Aucune position. Un ordre nécessite d’abord un journal de décision rempli.
          </p>
        ) : (
          <div className="space-y-3">
            {etat.positions.map((position) => (
              <div key={position.positionId} className="rounded-lg border border-ardoise-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-ardoise-950">{position.symbole}</span>
                      <Etiquette>{libelleClasse[position.classe] ?? position.classe}</Etiquette>
                      {(position.poidsPourcent ?? 0) > etat.parametres.seuilConcentration && (
                        <Etiquette ton="alerte">
                          {position.poidsPourcent} % du portefeuille
                        </Etiquette>
                      )}
                      <Etiquette>source : {position.sourcePrix}</Etiquette>
                    </div>
                    <p className="mt-0.5 text-sm text-ardoise-600">{position.nom}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-right text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-ardoise-500">Quantité</p>
                      <p className="tabular-nums">{fQuantite(position.quantite)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ardoise-500">Prix moyen</p>
                      <p className="tabular-nums">{fEuros(position.prixMoyen)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ardoise-500">Valeur</p>
                      <p className="tabular-nums font-medium">{fEuros(position.valeur)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ardoise-500">Latent</p>
                      <p
                        className={`tabular-nums font-medium ${couleurMontant(position.plusValueLatente ?? 0)}`}
                      >
                        {fEuros(position.plusValueLatente)}
                        <span className="ml-1 text-xs">
                          ({fPourcent(position.plusValueLatentePourcent)})
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {position.avertissementPrix && (
                  <p className="mt-2 text-xs text-amber-800">{position.avertissementPrix}</p>
                )}

                {position.decisionOuverture && (
                  <div className="mt-3 space-y-1.5 border-t border-ardoise-100 pt-3 text-xs leading-relaxed text-ardoise-600">
                    <p>
                      <span className="font-medium text-ardoise-700">Thèse écrite le {fDate(position.ouvertLe)} :</span>{' '}
                      {position.decisionOuverture.these}
                    </p>
                    <p>
                      <span className="font-medium text-ardoise-700">Condition d’invalidation :</span>{' '}
                      {position.decisionOuverture.conditionInvalidation}
                    </p>
                    <p>
                      <span className="font-medium text-ardoise-700">Horizon annoncé :</span>{' '}
                      {position.decisionOuverture.horizonMois} mois ·{' '}
                      <span className="font-medium text-ardoise-700">risque accepté :</span>{' '}
                      {fEuros(position.decisionOuverture.risqueAccepteEuros)}
                    </p>
                    {position.suiviRisque && position.suiviRisque.perteLatenteEuros > 0 && (
                      <p className={position.suiviRisque.depasse ? 'text-rose-700' : ''}>
                        Perte latente actuelle : {fEuros(position.suiviRisque.perteLatenteEuros)} soit{' '}
                        {position.suiviRisque.partDuRisqueConsomme} % du risque que vous aviez inscrit.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Carte>

      <Carte>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ardoise-500">
            Saisie manuelle des prix
          </h2>
          <Bouton variante="discret" onClick={() => setOngletPrix(!ongletPrix)}>
            {ongletPrix ? 'Masquer' : 'Afficher'}
          </Bouton>
        </div>
        {ongletPrix && <SaisiePrix actifs={actifs} onEnregistre={recharger} />}
        {!ongletPrix && (
          <p className="text-sm leading-relaxed text-ardoise-600">
            Mode dégradé : si une API de cotation est indisponible ou non configurée, saisissez ici
            le prix des supports concernés. C’est également la seule source pour les ETF européens,
            qu’aucune API gratuite ne couvre correctement.
          </p>
        )}
      </Carte>

      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Ordres passés ({ordres.length})
        </h2>
        {ordres.length === 0 ? (
          <p className="py-6 text-center text-sm text-ardoise-500">Aucun ordre pour l’instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-ardoise-200 text-left text-xs uppercase tracking-wide text-ardoise-500">
                  <th className="pb-2 pr-3 font-medium">Date</th>
                  <th className="pb-2 pr-3 font-medium">Sens</th>
                  <th className="pb-2 pr-3 font-medium">Actif</th>
                  <th className="pb-2 pr-3 text-right font-medium">Quantité</th>
                  <th className="pb-2 pr-3 text-right font-medium">Prix</th>
                  <th className="pb-2 pr-3 text-right font-medium">Frais</th>
                  <th className="pb-2 pr-3 text-right font-medium">Flux</th>
                  <th className="pb-2 text-right font-medium">Réalisé</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ardoise-100">
                {ordres.map((ordre) => (
                  <tr key={ordre.id}>
                    <td className="py-2 pr-3 text-ardoise-600">{fDateHeure(ordre.executed_at)}</td>
                    <td className="py-2 pr-3">
                      <Etiquette ton={ordre.side === 'achat' ? 'info' : 'neutre'}>
                        {ordre.side}
                      </Etiquette>
                    </td>
                    <td className="py-2 pr-3 font-medium">{ordre.symbol}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{fQuantite(ordre.quantity)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{fEuros(ordre.unit_price)}</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-ardoise-500">
                      {fEuros(ordre.fees)}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">{fEuros(ordre.net)}</td>
                    <td
                      className={`py-2 text-right tabular-nums ${couleurMontant(ordre.realized_pnl)}`}
                    >
                      {ordre.side === 'vente' ? fEuros(ordre.realized_pnl) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Carte>
    </div>
  );
}

function SaisiePrix({
  actifs,
  onEnregistre,
}: {
  actifs: ActifDisponible[];
  onEnregistre: () => void;
}) {
  const [valeurs, setValeurs] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const enregistrer = async (actif: ActifDisponible) => {
    const brut = valeurs[actif.id];
    const prix = Number(brut?.replace(',', '.'));
    if (!Number.isFinite(prix) || prix <= 0) {
      setMessage('Saisissez un prix strictement positif.');
      return;
    }
    await api.post('/portefeuille/prix-manuel', { actifId: actif.id, prix });
    setValeurs({ ...valeurs, [actif.id]: '' });
    setMessage(`Prix enregistré pour ${actif.symbole}.`);
    onEnregistre();
  };

  return (
    <div className="space-y-3">
      {message && <Encart ton="info">{message}</Encart>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] text-sm">
          <thead>
            <tr className="border-b border-ardoise-200 text-left text-xs uppercase tracking-wide text-ardoise-500">
              <th className="pb-2 pr-3 font-medium">Actif</th>
              <th className="pb-2 pr-3 font-medium">Source</th>
              <th className="pb-2 pr-3 font-medium">Dernier prix manuel</th>
              <th className="pb-2 pr-3 font-medium">Nouveau prix (€)</th>
              <th className="pb-2 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ardoise-100">
            {actifs.map((actif) => (
              <tr key={actif.id}>
                <td className="py-2 pr-3">
                  <span className="font-medium">{actif.symbole}</span>{' '}
                  <span className="text-xs text-ardoise-500">{actif.nom}</span>
                </td>
                <td className="py-2 pr-3 text-xs text-ardoise-500">{actif.fournisseur}</td>
                <td className="py-2 pr-3 tabular-nums text-ardoise-600">
                  {actif.dernierPrixManuel !== null ? (
                    <>
                      {fEuros(actif.dernierPrixManuel)}{' '}
                      <span className="text-xs text-ardoise-400">
                        ({fDate(actif.dernierPrixManuelDate)})
                      </span>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="py-2 pr-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={valeurs[actif.id] ?? ''}
                    onChange={(e) => setValeurs({ ...valeurs, [actif.id]: e.target.value })}
                    className="w-28 rounded-md border border-ardoise-300 px-2 py-1 text-sm"
                    placeholder="0,00"
                  />
                </td>
                <td className="py-2">
                  <Bouton variante="secondaire" onClick={() => enregistrer(actif)}>
                    Enregistrer
                  </Bouton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
