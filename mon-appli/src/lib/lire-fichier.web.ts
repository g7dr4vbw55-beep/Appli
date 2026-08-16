/**
 * Lit le contenu binaire d'un fichier choisi par l'utilisateur.
 *
 * Sur navigateur, le sélecteur renvoie une adresse temporaire (`blob:` ou
 * `data:`) que `fetch` sait ouvrir directement : rien à installer.
 */
export async function lireFichierBinaire(uri: string): Promise<ArrayBuffer> {
  const reponse = await fetch(uri);
  return reponse.arrayBuffer();
}
