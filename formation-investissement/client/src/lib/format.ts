const euros = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

export function fEuros(valeur: number | null | undefined): string {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) return '—';
  return euros.format(valeur);
}

export function fNombre(valeur: number | null | undefined, decimales = 2): string {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) return '—';
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: decimales }).format(valeur);
}

export function fPourcent(valeur: number | null | undefined, decimales = 2): string {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) return '—';
  const signe = valeur > 0 ? '+' : '';
  return `${signe}${new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: decimales,
    minimumFractionDigits: decimales,
  }).format(valeur)} %`;
}

export function fQuantite(valeur: number | null | undefined): string {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) return '—';
  const decimales = Math.abs(valeur) < 1 ? 6 : Math.abs(valeur) < 100 ? 4 : 2;
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: decimales }).format(valeur);
}

export function fDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function fDateHeure(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function joursDepuis(iso: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));
}

export const libelleClasse: Record<string, string> = {
  action: 'Action',
  etf: 'ETF',
  crypto: 'Cryptomonnaie',
};

export function couleurMontant(valeur: number): string {
  if (valeur > 0.0001) return 'text-emerald-700';
  if (valeur < -0.0001) return 'text-rose-700';
  return 'text-ardoise-600';
}
