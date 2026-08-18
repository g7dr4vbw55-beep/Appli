import type { ReactNode } from 'react';

export function Carte({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-ardoise-200 bg-white p-5 shadow-[0_1px_2px_rgba(34,37,46,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

export function TitreSection({
  titre,
  sousTitre,
  action,
}: {
  titre: string;
  sousTitre?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ardoise-950">{titre}</h1>
        {sousTitre && <p className="mt-1 max-w-3xl text-sm text-ardoise-600">{sousTitre}</p>}
      </div>
      {action}
    </div>
  );
}

type Ton = 'neutre' | 'succes' | 'alerte' | 'danger' | 'info';

const tons: Record<Ton, string> = {
  neutre: 'bg-ardoise-100 text-ardoise-700 border-ardoise-200',
  succes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  alerte: 'bg-amber-50 text-amber-900 border-amber-200',
  danger: 'bg-rose-50 text-rose-800 border-rose-200',
  info: 'bg-sky-50 text-sky-900 border-sky-200',
};

export function Etiquette({
  children,
  ton = 'neutre',
}: {
  children: ReactNode;
  ton?: Ton;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tons[ton]}`}
    >
      {children}
    </span>
  );
}

export function Encart({
  titre,
  children,
  ton = 'info',
}: {
  titre?: string;
  children: ReactNode;
  ton?: Ton;
}) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tons[ton]}`}>
      {titre && <p className="mb-1 font-semibold">{titre}</p>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

export function Bouton({
  children,
  onClick,
  type = 'button',
  variante = 'principal',
  disabled,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variante?: 'principal' | 'secondaire' | 'discret' | 'danger';
  disabled?: boolean;
  className?: string;
}) {
  const styles: Record<string, string> = {
    principal: 'bg-ardoise-900 text-white hover:bg-ardoise-800 disabled:bg-ardoise-300',
    secondaire:
      'border border-ardoise-300 bg-white text-ardoise-800 hover:bg-ardoise-50 disabled:text-ardoise-400',
    discret: 'text-ardoise-600 hover:bg-ardoise-100 disabled:text-ardoise-400',
    danger: 'border border-rose-300 bg-white text-rose-700 hover:bg-rose-50',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${styles[variante]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Jauge({ valeur, total, ton = 'neutre' }: { valeur: number; total: number; ton?: Ton }) {
  const pourcent = total > 0 ? Math.min(100, (valeur / total) * 100) : 0;
  const couleurs: Record<Ton, string> = {
    neutre: 'bg-ardoise-500',
    succes: 'bg-emerald-500',
    alerte: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ardoise-200">
      <div className={`h-full rounded-full ${couleurs[ton]}`} style={{ width: `${pourcent}%` }} />
    </div>
  );
}

export function Chargement({ texte = 'Chargement…' }: { texte?: string }) {
  return <p className="py-10 text-center text-sm text-ardoise-500">{texte}</p>;
}

export function MessageErreur({ message }: { message: string }) {
  return <Encart ton="danger" titre="Une erreur est survenue">{message}</Encart>;
}

export function Statistique({
  libelle,
  valeur,
  detail,
  couleur = 'text-ardoise-950',
}: {
  libelle: string;
  valeur: string;
  detail?: string;
  couleur?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ardoise-500">{libelle}</p>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${couleur}`}>{valeur}</p>
      {detail && <p className="mt-0.5 text-xs text-ardoise-500">{detail}</p>}
    </div>
  );
}
