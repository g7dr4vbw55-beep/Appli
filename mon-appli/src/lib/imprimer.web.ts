/**
 * Ouvre le dialogue d'impression du navigateur sur le document fourni.
 *
 * `expo-print` ne convient pas ici : sur navigateur il ignore le HTML qu'on
 * lui passe et imprime la page affichée — on obtiendrait l'écran de l'appli
 * au lieu du bon de livraison.
 *
 * On glisse donc le document dans un cadre masqué et on imprime celui-ci.
 * Un cadre plutôt qu'une nouvelle fenêtre : les bloqueurs de fenêtres
 * surgissantes laissent passer le premier, pas toujours la seconde.
 */
export async function imprimerDocument(html: string, titre: string): Promise<void> {
  const precedent = document.getElementById('impression-document');
  if (precedent) precedent.remove();

  const cadre = document.createElement('iframe');
  cadre.id = 'impression-document';
  cadre.title = titre;
  cadre.setAttribute(
    'style',
    'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;'
  );
  document.body.appendChild(cadre);

  const fenetre = cadre.contentWindow;
  const doc = cadre.contentDocument ?? fenetre?.document;
  if (!fenetre || !doc) {
    cadre.remove();
    throw new Error("Le navigateur n'a pas laissé préparer le document à imprimer.");
  }

  doc.open();
  doc.write(html);
  doc.close();

  // Le cadre est retiré après l'impression, jamais avant : le supprimer trop
  // tôt annulerait le dialogue que l'on vient d'ouvrir.
  fenetre.addEventListener('afterprint', () => cadre.remove(), { once: true });

  fenetre.focus();
  fenetre.print();
}
