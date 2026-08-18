/**
 * Verification hors ligne du module 4 : contenu du prompt systeme et
 * construction du format de sortie structuree. Aucun appel reseau.
 * Usage : npx tsx src/verif-decrypteur.mts
 */
import { PROMPT_SYSTEME, decrypteurDisponible, SCHEMA_SORTIE } from './services/decrypteur.js';

console.log('Prompt systeme :', PROMPT_SYSTEME.length, 'caracteres');
const interdictions = [
  "Ne recommande JAMAIS d'acheter",
  'Ne formule JAMAIS de prévision',
  'Ne donne JAMAIS de conseil personnalisé',
  "tu n'as pas accès aux cours actuels",
  'Écris en français',
];
for (const i of interdictions) {
  console.log(PROMPT_SYSTEME.includes(i) ? '  [OK]     ' : '  [MANQUE] ', i);
}
console.log('Decrypteur disponible sans cle :', decrypteurDisponible());

const proprietes = Object.keys(
  (SCHEMA_SORTIE as { properties: Record<string, unknown> }).properties,
);
const requis = (SCHEMA_SORTIE as { required: string[] }).required;
console.log('Champs du schema de sortie :', proprietes.length);
console.log('Tous requis :', proprietes.every((c) => requis.includes(c)) ? 'oui' : 'NON');
console.log('Serialisable en JSON :', JSON.stringify(SCHEMA_SORTIE).length, 'octets');
console.log('Champs :', proprietes.join(', '));
