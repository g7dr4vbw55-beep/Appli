import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { Bouton, Carte, Chargement, Encart, MessageErreur, TitreSection } from '../components/ui';

interface Parametres {
  fraisPourcent: number;
  fraisFixe: number;
  seuilConcentration: number;
  capitalDepart: number;
  symboleIndice: string | null;
  indicesDisponibles: { symbole: string; nom: string }[];
}

export function Parametres() {
  const navigate = useNavigate();
  const [parametres, setParametres] = useState<Parametres | null>(null);
  const [fraisPourcent, setFraisPourcent] = useState('');
  const [fraisFixe, setFraisFixe] = useState('');
  const [seuil, setSeuil] = useState('');
  const [indice, setIndice] = useState('');
  const [taux, setTaux] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    api
      .get<Parametres>('/portefeuille/parametres')
      .then((p) => {
        setParametres(p);
        setFraisPourcent(String(p.fraisPourcent));
        setFraisFixe(String(p.fraisFixe));
        setSeuil(String(p.seuilConcentration));
        setIndice(p.symboleIndice ?? '');
      })
      .catch((e) => setErreur(e.message));
  }, []);

  if (erreur) return <MessageErreur message={erreur} />;
  if (!parametres) return <Chargement />;

  const enregistrer = async () => {
    setMessage(null);
    setErreur(null);
    const corps: Record<string, unknown> = {
      fraisPourcent: Number(fraisPourcent.replace(',', '.')),
      fraisFixe: Number(fraisFixe.replace(',', '.')),
      seuilConcentration: Number(seuil.replace(',', '.')),
    };
    if (indice) corps.symboleIndice = indice;
    const tauxNombre = Number(taux.replace(',', '.'));
    if (Number.isFinite(tauxNombre) && tauxNombre > 0) corps.tauxUsdEur = tauxNombre;
    try {
      const maj = await api.patch<Parametres>('/portefeuille/parametres', corps);
      setParametres(maj);
      setMessage('Paramètres enregistrés.');
    } catch (e) {
      setErreur((e as Error).message);
    }
  };

  const reinitialiser = async () => {
    await api.post('/portefeuille/reinitialiser');
    navigate('/portefeuille');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <TitreSection
        titre="Paramètres de simulation"
        sousTitre="Ces réglages n’affectent que le portefeuille d’entraînement. Ils sont enregistrés localement dans la base SQLite."
      />

      {message && <Encart ton="succes">{message}</Encart>}

      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Frais de transaction simulés
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-ardoise-600">
          Les frais réels varient fortement d’un intermédiaire à l’autre. Reprendre la grille
          tarifaire de votre courtier permet de mesurer leur poids réel sur de petits ordres.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ardoise-800">
              Part proportionnelle (%)
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={fraisPourcent}
              onChange={(e) => setFraisPourcent(e.target.value)}
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ardoise-800">
              Part fixe par ordre (€)
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={fraisFixe}
              onChange={(e) => setFraisFixe(e.target.value)}
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </Carte>

      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Alerte de concentration
        </h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ardoise-800">
            Seuil d’alerte par position (% du portefeuille)
          </span>
          <span className="mb-1.5 block text-xs leading-relaxed text-ardoise-500">
            Repère de vigilance couramment enseigné : 20 %. Ce n’est pas une règle réglementaire, et
            l’alerte n’est pas une invitation à vendre.
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={seuil}
            onChange={(e) => setSeuil(e.target.value)}
            className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
          />
        </label>
      </Carte>

      <Carte>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Indice de référence et change
        </h2>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ardoise-800">
              Support servant d’indice de référence
            </span>
            <select
              value={indice}
              onChange={(e) => setIndice(e.target.value)}
              className="w-full rounded-md border border-ardoise-300 bg-white px-3 py-2 text-sm"
            >
              {parametres.indicesDisponibles.map((a) => (
                <option key={a.symbole} value={a.symbole}>
                  {a.symbole} — {a.nom}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ardoise-800">
              Taux EUR/USD manuel (facultatif)
            </span>
            <span className="mb-1.5 block text-xs leading-relaxed text-ardoise-500">
              Par défaut, le taux est déduit du prix du bitcoin coté simultanément en euros et en
              dollars par CoinGecko. Une valeur saisie ici est prioritaire.
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={taux}
              onChange={(e) => setTaux(e.target.value)}
              placeholder="ex : 0,92"
              className="w-full rounded-md border border-ardoise-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
      </Carte>

      <div className="flex flex-wrap gap-3">
        <Bouton onClick={enregistrer}>Enregistrer les paramètres</Bouton>
        <Bouton variante="discret" onClick={() => navigate('/portefeuille')}>
          Retour au portefeuille
        </Bouton>
      </div>

      <Carte className="border-rose-200">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ardoise-500">
          Remise à zéro du portefeuille
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-ardoise-600">
          Supprime toutes les positions, tous les ordres, toutes les décisions et tous les bilans, et
          restaure le capital virtuel de départ ({parametres.capitalDepart} €). La progression du
          parcours de formation et le glossaire ne sont pas touchés. Cette action est irréversible.
        </p>
        {confirmation ? (
          <div className="flex flex-wrap gap-3">
            <Bouton variante="danger" onClick={reinitialiser}>
              Confirmer la remise à zéro
            </Bouton>
            <Bouton variante="discret" onClick={() => setConfirmation(false)}>
              Annuler
            </Bouton>
          </div>
        ) : (
          <Bouton variante="danger" onClick={() => setConfirmation(true)}>
            Remettre le portefeuille à zéro
          </Bouton>
        )}
      </Carte>
    </div>
  );
}
