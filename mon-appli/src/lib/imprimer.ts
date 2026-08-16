import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Transforme le bon en PDF et propose de l'envoyer ou de l'enregistrer.
 *
 * Version téléphone. Une version navigateur vit dans `imprimer.web.ts` :
 * Expo choisit le bon fichier selon la plateforme, sans condition à écrire.
 */
export async function imprimerDocument(html: string, titre: string): Promise<void> {
  const { uri } = await Print.printToFileAsync({ html });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: titre,
      UTI: 'com.adobe.pdf',
    });
  }
}
