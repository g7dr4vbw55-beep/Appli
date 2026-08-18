/**
 * Module 3 : journal de decisions.
 *
 * Regle structurante : un ordre ne peut pas etre passe sans une decision
 * enregistree au prealable. La decision porte la these, l'horizon, le risque
 * accepte en euros et la condition d'invalidation. Elle est consommee par
 * l'ordre (statut brouillon -> executee) et ne peut pas etre reutilisee.
 */
import { db, nowIso } from '../db/index.js';
import { actifParId } from './cotations.js';

export type Horizon = 'court' | 'moyen' | 'long';
export type KindDecision = 'ouverture' | 'renforcement' | 'allegement' | 'cloture';

export interface EntreeDecision {
  actifId: number;
  side: 'achat' | 'vente';
  these: string;
  horizon: Horizon;
  horizonMois: number;
  risqueAccepteEuros: number;
  conditionInvalidation: string;
  conviction: number;
  emotion?: string;
  quantitePrevue?: number;
  prixPrevu?: number;
}

export interface LigneDecision {
  id: number;
  asset_id: number;
  kind: KindDecision;
  side: 'achat' | 'vente';
  thesis: string;
  horizon: Horizon;
  horizon_months: number;
  risk_accepted_eur: number;
  invalidation_condition: string;
  conviction: number;
  emotion: string;
  planned_quantity: number;
  planned_price: number;
  status: 'brouillon' | 'executee' | 'annulee';
  created_at: string;
  executed_at: string | null;
}

/** Nature de la decision, deduite de l'etat courant de la position. */
export function natureDecision(actifId: number, side: 'achat' | 'vente'): KindDecision {
  const position = db()
    .prepare("SELECT quantity FROM positions WHERE asset_id = ? AND status = 'ouverte'")
    .get(actifId) as { quantity: number } | undefined;
  if (side === 'achat') return position ? 'renforcement' : 'ouverture';
  return position ? 'allegement' : 'cloture';
}

export function creerDecision(entree: EntreeDecision): { id: number } {
  const actif = actifParId(entree.actifId);
  if (!actif) throw new Error('Actif inconnu.');

  const info = db()
    .prepare(
      `INSERT INTO decisions
         (asset_id, kind, side, thesis, horizon, horizon_months, risk_accepted_eur,
          invalidation_condition, conviction, emotion, planned_quantity, planned_price,
          status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'brouillon', ?)`,
    )
    .run(
      entree.actifId,
      natureDecision(entree.actifId, entree.side),
      entree.side,
      entree.these.trim(),
      entree.horizon,
      entree.horizonMois,
      entree.risqueAccepteEuros,
      entree.conditionInvalidation.trim(),
      entree.conviction,
      entree.emotion?.trim() ?? '',
      entree.quantitePrevue ?? 0,
      entree.prixPrevu ?? 0,
      nowIso(),
    );
  return { id: Number(info.lastInsertRowid) };
}

export function decision(id: number): LigneDecision | null {
  return (
    (db().prepare('SELECT * FROM decisions WHERE id = ?').get(id) as LigneDecision | undefined) ??
    null
  );
}

export function annulerDecision(id: number): boolean {
  const info = db()
    .prepare("UPDATE decisions SET status = 'annulee' WHERE id = ? AND status = 'brouillon'")
    .run(id);
  return info.changes > 0;
}

/** Decisions en attente d'execution : ce sont les seules utilisables pour un ordre. */
export function decisionsEnAttente() {
  return db()
    .prepare(
      `SELECT d.*, a.symbol, a.name, a.asset_class
         FROM decisions d JOIN assets a ON a.id = d.asset_id
        WHERE d.status = 'brouillon'
        ORDER BY d.created_at DESC`,
    )
    .all();
}

export function historiqueDecisions() {
  return db()
    .prepare(
      `SELECT d.*, a.symbol, a.name, a.asset_class,
              (SELECT COUNT(*) FROM orders o WHERE o.decision_id = d.id) AS nb_ordres
         FROM decisions d JOIN assets a ON a.id = d.asset_id
        ORDER BY d.created_at DESC`,
    )
    .all();
}

// --- Bilan de position -----------------------------------------------------

export type Issue = 'verifiee' | 'partiellement' | 'invalidee' | 'indeterminee';
export type RaisonSortie =
  | 'these_atteinte'
  | 'invalidation'
  | 'besoin_argent'
  | 'peur'
  | 'euphorie'
  | 'rebalancement'
  | 'autre';

export interface EntreeBilan {
  positionId: number;
  cequisEstPasse: string;
  issueThese: Issue;
  invalidationDeclenchee: boolean;
  invalidationRespectee: boolean;
  raisonSortie: RaisonSortie;
  emotion?: string;
  lecon?: string;
}

export function enregistrerBilan(entree: EntreeBilan): void {
  const position = db()
    .prepare('SELECT id, status FROM positions WHERE id = ?')
    .get(entree.positionId) as { id: number; status: string } | undefined;
  if (!position) throw new Error('Position inconnue.');
  if (position.status !== 'cloturee') {
    throw new Error("Le bilan ne peut etre saisi qu'apres la cloture de la position.");
  }
  db()
    .prepare(
      `INSERT INTO reviews
         (position_id, what_happened, thesis_outcome, invalidation_triggered,
          invalidation_respected, exit_reason, emotion, lesson, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(position_id) DO UPDATE SET
         what_happened = excluded.what_happened,
         thesis_outcome = excluded.thesis_outcome,
         invalidation_triggered = excluded.invalidation_triggered,
         invalidation_respected = excluded.invalidation_respected,
         exit_reason = excluded.exit_reason,
         emotion = excluded.emotion,
         lesson = excluded.lesson`,
    )
    .run(
      entree.positionId,
      entree.cequisEstPasse.trim(),
      entree.issueThese,
      entree.invalidationDeclenchee ? 1 : 0,
      entree.invalidationRespectee ? 1 : 0,
      entree.raisonSortie,
      entree.emotion?.trim() ?? '',
      entree.lecon?.trim() ?? '',
      nowIso(),
    );
}
