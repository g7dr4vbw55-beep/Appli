import type { Demande } from '@/data/demandes-store';
import { formatDateFr } from '@/lib/dates';
import { formatPoids, piecesRetenues, totalPoids } from '@/lib/poids';
import {
  formatHorodatage,
  LIBELLES_SIGNATURE,
  ORDRE_SIGNATURES,
  REPERE_SIGNATURE,
} from '@/lib/signatures';

/** En-tête imprimé sur le bon. À remplacer par les mentions légales réelles. */
export const EMETTEUR = {
  raisonSociale: 'PREFA OUEST',
  site: 'Usine de La Vraie-Croix',
};

const echapper = (valeur: string) =>
  valeur
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * Met le bon de livraison en page pour l'impression ou le PDF.
 *
 * Seules les pièces réellement emportées figurent au bon : une pièce que tu
 * as retirée du camion n'a pas à apparaître sur le document qui accompagne
 * la marchandise.
 */
export function htmlBonLivraison(demande: Demande, numero: string, emisLe = new Date()): string {
  const pieces = piecesRetenues(demande.pieces);
  const dateEmission = `${String(emisLe.getDate()).padStart(2, '0')}/${String(
    emisLe.getMonth() + 1
  ).padStart(2, '0')}/${emisLe.getFullYear()}`;

  const signatures = demande.signatures ?? {};
  const reserves = signatures.receptionnaire?.reserves;

  const cadresSignature = ORDRE_SIGNATURES.map((role) => {
    const libelle = LIBELLES_SIGNATURE[role];
    const signature = signatures[role];

    // Un cadre signé porte le tracé et son horodatage ; un cadre vide garde
    // sa place pour être signé à la main sur le bon imprimé.
    const contenu = signature
      ? `<div class="trace">
           <svg viewBox="0 0 ${REPERE_SIGNATURE.largeur} ${REPERE_SIGNATURE.hauteur}"
                preserveAspectRatio="xMidYMid meet">
             <path d="${echapper(signature.trace)}" fill="none" stroke="#111"
                   stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
           </svg>
         </div>
         <div class="ligne">${echapper(signature.nom)}<br />${echapper(
           formatHorodatage(signature.signeLe)
         )}</div>`
      : `<div class="espace"></div>
         <div class="ligne">Nom, date et signature</div>`;

    return `
    <div class="signature">
      <span class="rang">${libelle.rang}</span>
      <h2>${echapper(libelle.titre)}</h2>
      <div class="quand">${echapper(libelle.quand)}</div>
      ${contenu}
    </div>`;
  }).join('');

  const lignes = pieces
    .map(
      (piece, index) => `
        <tr>
          <td class="rang">${index + 1}</td>
          <td class="repere">${echapper(piece.repere)}</td>
          <td class="poids">${echapper(formatPoids(piece.poids))}</td>
        </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<style>
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;
    color: #111;
    font-size: 11pt;
    line-height: 1.45;
    margin: 0;
  }
  .entete { display: flex; justify-content: space-between; align-items: flex-start;
            border-bottom: 2px solid #111; padding-bottom: 10px; }
  .emetteur .nom { font-size: 17pt; font-weight: 700; letter-spacing: 0.5px; }
  .emetteur .site { color: #444; font-size: 10pt; }
  .reference { text-align: right; }
  .reference .titre { font-size: 13pt; font-weight: 700; text-transform: uppercase; }
  .reference .numero { font-size: 15pt; font-weight: 700; font-family: ui-monospace, monospace; }
  .reference .emis { color: #444; font-size: 10pt; }

  .blocs { display: flex; gap: 12px; margin-top: 16px; }
  .bloc { flex: 1; border: 1px solid #bbb; padding: 10px 12px; }
  .bloc h2 { margin: 0 0 6px; font-size: 8.5pt; text-transform: uppercase;
             letter-spacing: 1px; color: #555; font-weight: 700; }
  .bloc .valeur { font-size: 12pt; font-weight: 600; }
  .bloc .detail { color: #333; }

  table { width: 100%; border-collapse: collapse; margin-top: 18px; }
  caption { text-align: left; font-size: 8.5pt; text-transform: uppercase;
            letter-spacing: 1px; color: #555; font-weight: 700; padding-bottom: 6px; }
  th, td { border: 1px solid #bbb; padding: 6px 9px; }
  th { background: #f1f1f1; text-align: left; font-size: 9pt;
       text-transform: uppercase; letter-spacing: 0.5px; }
  td.rang { width: 34px; text-align: center; color: #666; }
  td.repere { font-weight: 600; font-family: ui-monospace, monospace; }
  td.poids, th.poids { text-align: right; width: 90px;
                       font-variant-numeric: tabular-nums; }
  tfoot td { font-weight: 700; background: #f1f1f1; }

  .commentaire { margin-top: 14px; border: 1px solid #bbb; padding: 10px 12px; }
  .commentaire h2 { margin: 0 0 4px; font-size: 8.5pt; text-transform: uppercase;
                    letter-spacing: 1px; color: #555; font-weight: 700; }

  .signatures { display: flex; gap: 10px; margin-top: 22px; }
  .signature { flex: 1; border: 1px solid #bbb; padding: 9px 11px 8px;
               display: flex; flex-direction: column; }
  .signature .rang { display: inline-block; width: 15px; height: 15px; line-height: 15px;
                     text-align: center; background: #111; color: #fff; border-radius: 50%;
                     font-size: 8pt; font-weight: 700; margin-bottom: 5px; }
  .signature h2 { margin: 0 0 2px; font-size: 8.5pt; text-transform: uppercase;
                  letter-spacing: 0.8px; color: #333; font-weight: 700; }
  .signature .quand { color: #666; font-size: 8.5pt; }
  /* Zone laissée libre pour signer : c'est elle qui donne sa hauteur au cadre. */
  .signature .espace { flex: 1; min-height: 46px; }
  .signature .trace { flex: 1; min-height: 46px; display: flex; align-items: center; }
  .signature .trace svg { width: 100%; height: 46px; }
  .signature .ligne { border-top: 1px dotted #888; padding-top: 3px;
                      color: #666; font-size: 8pt; line-height: 1.3; }

  .reserves { margin-top: 12px; border: 1.5px solid #B45309; padding: 9px 12px; }
  .reserves h2 { margin: 0 0 3px; font-size: 8.5pt; text-transform: uppercase;
                 letter-spacing: 1px; color: #B45309; font-weight: 700; }

  .pied { margin-top: 16px; border-top: 1px solid #ddd; padding-top: 7px;
          color: #666; font-size: 8.5pt; }
</style>
</head>
<body>
  <div class="entete">
    <div class="emetteur">
      <div class="nom">${echapper(EMETTEUR.raisonSociale)}</div>
      <div class="site">${echapper(EMETTEUR.site)}</div>
    </div>
    <div class="reference">
      <div class="titre">Bon de livraison</div>
      <div class="numero">${echapper(numero)}</div>
      <div class="emis">Émis le ${dateEmission}</div>
    </div>
  </div>

  <div class="blocs">
    <div class="bloc">
      <h2>Client</h2>
      <div class="valeur">${echapper(demande.client || '—')}</div>
      <div class="detail">${echapper(demande.chantier || '—')}</div>
    </div>
    <div class="bloc">
      <h2>Arrivée prévue</h2>
      <div class="valeur">${echapper(formatDateFr(demande.date))}</div>
      <div class="detail">à ${echapper(demande.heure || '—')}</div>
    </div>
  </div>

  <table>
    <caption>Détail du chargement</caption>
    <thead>
      <tr><th class="rang"></th><th>Repère</th><th class="poids">Poids</th></tr>
    </thead>
    <tbody>${lignes}</tbody>
    <tfoot>
      <tr>
        <td colspan="2">${pieces.length} pièce${pieces.length > 1 ? 's' : ''}</td>
        <td class="poids">${echapper(formatPoids(totalPoids(demande.pieces)))}</td>
      </tr>
    </tfoot>
  </table>

  ${
    demande.commentaire
      ? `<div class="commentaire"><h2>Observations</h2><div>${echapper(
          demande.commentaire
        )}</div></div>`
      : ''
  }

  <div class="signatures">${cadresSignature}</div>

  ${
    reserves
      ? `<div class="reserves"><h2>Réserves émises à la réception</h2><div>${echapper(
          reserves
        )}</div></div>`
      : ''
  }

  <div class="pied">
    Les réserves éventuelles doivent être portées sur le présent bon au moment de la réception.
  </div>
</body>
</html>`;
}
