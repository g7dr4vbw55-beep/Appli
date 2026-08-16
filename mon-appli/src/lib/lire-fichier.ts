import { File } from 'expo-file-system';

/**
 * Lit le contenu binaire d'un fichier choisi par l'utilisateur.
 *
 * Version téléphone. Une version navigateur vit dans `lire-fichier.web.ts` :
 * `expo-file-system` n'a pas d'implémentation web, et le navigateur donne de
 * toute façon une adresse que `fetch` sait lire directement.
 */
export async function lireFichierBinaire(uri: string): Promise<ArrayBuffer> {
  return new File(uri).arrayBuffer();
}
