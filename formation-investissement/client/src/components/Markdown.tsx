/**
 * Rendu d'un markdown volontairement limite (titres, listes, gras, italique).
 * Le contenu provient de la base locale, pas d'une saisie utilisateur ni du
 * reseau : il n'y a donc pas d'injection de HTML arbitraire ici.
 */
import type { ReactNode } from 'react';

function inline(texte: string, cle: string): ReactNode[] {
  const morceaux: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let dernier = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(texte)) !== null) {
    if (match.index > dernier) morceaux.push(texte.slice(dernier, match.index));
    const brut = match[0];
    if (brut.startsWith('**')) {
      morceaux.push(<strong key={`${cle}-g${i}`}>{brut.slice(2, -2)}</strong>);
    } else {
      morceaux.push(<em key={`${cle}-i${i}`}>{brut.slice(1, -1)}</em>);
    }
    dernier = match.index + brut.length;
    i += 1;
  }
  if (dernier < texte.length) morceaux.push(texte.slice(dernier));
  return morceaux;
}

export function Markdown({ texte }: { texte: string }) {
  const lignes = texte.split('\n');
  const blocs: ReactNode[] = [];
  let listePuces: string[] = [];
  let listeNumeros: string[] = [];

  const viderPuces = () => {
    if (listePuces.length > 0) {
      blocs.push(
        <ul key={`ul-${blocs.length}`}>
          {listePuces.map((l, i) => (
            <li key={i}>{inline(l, `ul${blocs.length}-${i}`)}</li>
          ))}
        </ul>,
      );
      listePuces = [];
    }
  };
  const viderNumeros = () => {
    if (listeNumeros.length > 0) {
      blocs.push(
        <ol key={`ol-${blocs.length}`}>
          {listeNumeros.map((l, i) => (
            <li key={i}>{inline(l, `ol${blocs.length}-${i}`)}</li>
          ))}
        </ol>,
      );
      listeNumeros = [];
    }
  };

  for (const ligne of lignes) {
    const t = ligne.trim();
    if (t === '') {
      viderPuces();
      viderNumeros();
      continue;
    }
    if (t.startsWith('### ')) {
      viderPuces();
      viderNumeros();
      blocs.push(<h3 key={`h3-${blocs.length}`}>{inline(t.slice(4), `h3${blocs.length}`)}</h3>);
      continue;
    }
    if (t.startsWith('## ')) {
      viderPuces();
      viderNumeros();
      blocs.push(<h2 key={`h2-${blocs.length}`}>{inline(t.slice(3), `h2${blocs.length}`)}</h2>);
      continue;
    }
    if (/^[-*] /.test(t)) {
      viderNumeros();
      listePuces.push(t.slice(2));
      continue;
    }
    if (/^\d+\.\s/.test(t)) {
      viderPuces();
      listeNumeros.push(t.replace(/^\d+\.\s/, ''));
      continue;
    }
    viderPuces();
    viderNumeros();
    blocs.push(<p key={`p-${blocs.length}`}>{inline(t, `p${blocs.length}`)}</p>);
  }
  viderPuces();
  viderNumeros();

  return <div className="contenu-lecon">{blocs}</div>;
}
