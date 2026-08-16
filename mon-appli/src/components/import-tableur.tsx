import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
// Le paquet n'expose pas de racine : `universal` est la variante qui lit un
// ArrayBuffer, seul format commun au navigateur et au téléphone.
import readXlsxFile, { type Sheet } from 'read-excel-file/universal';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { lireFichierBinaire } from '@/lib/lire-fichier';
import { construireApercu, lignesRemplies, type ApercuTableur } from '@/lib/tableur';

type Feuille = Sheet<number>;

const TYPES_ACCEPTES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

/**
 * Ouvre un fichier tableur et montre ce qu'il contient.
 *
 * Cette étape ne rapproche encore rien des champs de l'appli : elle sert à
 * constater la structure réelle du fichier — quelles colonnes, quelle ligne
 * porte les intitulés — avant de décider quoi en faire.
 */
export function ImportTableur() {
  const theme = useTheme();
  const [feuilles, setFeuilles] = useState<Feuille[] | null>(null);
  const [feuilleActive, setFeuilleActive] = useState(0);
  const [nomFichier, setNomFichier] = useState('');
  const [ligneEnTete, setLigneEnTete] = useState(0);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const grille = feuilles?.[feuilleActive]?.data ?? null;
  const apercu: ApercuTableur | null =
    grille === null ? null : construireApercu(nomFichier, grille, ligneEnTete);
  const candidatesEnTete = grille === null ? [] : lignesRemplies(grille).slice(0, 4);

  async function choisirFichier() {
    setErreur(null);
    const choix = await DocumentPicker.getDocumentAsync({
      type: TYPES_ACCEPTES,
      copyToCacheDirectory: true,
      base64: false,
    });
    if (choix.canceled || !choix.assets?.[0]) return;

    const fichier = choix.assets[0];
    setChargement(true);
    try {
      const binaire = await lireFichierBinaire(fichier.uri);
      const lues = await readXlsxFile(binaire);
      if (lues.length === 0) throw new Error('Classeur sans feuille');
      setFeuilles(lues);
      setFeuilleActive(0);
      setNomFichier(fichier.name);
      setLigneEnTete(0);
    } catch (cause) {
      setFeuilles(null);
      setErreur(
        "Ce fichier n'a pas pu être lu. Vérifiez qu'il s'agit bien d'un classeur Excel (.xlsx) et non d'un fichier protégé par mot de passe."
      );
      console.warn('Lecture du tableur impossible.', cause);
    } finally {
      setChargement(false);
    }
  }

  function changerFeuille(index: number) {
    setFeuilleActive(index);
    // Chaque feuille a sa propre mise en page : la ligne d'en-tête retenue
    // sur l'une n'a aucune raison de valoir pour la suivante.
    setLigneEnTete(0);
  }

  return (
    <ThemedView type="backgroundElement" style={styles.bloc}>
      <ThemedText type="smallBold">Importer PLANNING_COULAGE</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Choisissez votre fichier Excel : l&apos;appli affichera ses colonnes telles
        qu&apos;elles sont, sans rien supposer de leur contenu.
      </ThemedText>

      <Pressable
        onPress={choisirFichier}
        disabled={chargement}
        style={({ pressed }) => [
          styles.bouton,
          { backgroundColor: theme.backgroundSelected },
          chargement && styles.desactive,
          pressed && !chargement && styles.presse,
        ]}>
        <ThemedText type="smallBold">
          {chargement ? 'Lecture en cours…' : 'Choisir un fichier'}
        </ThemedText>
      </Pressable>

      {erreur !== null && (
        <ThemedText type="small" style={styles.erreur}>
          {erreur}
        </ThemedText>
      )}

      {apercu !== null && feuilles !== null && (
        <ThemedView type="backgroundElement" style={styles.apercu}>
          <ThemedText type="smallBold">
            {apercu.nomFichier} — {apercu.totalLignes} ligne
            {apercu.totalLignes > 1 ? 's' : ''} de données
          </ThemedText>

          {feuilles.length > 1 && (
            <ThemedView type="backgroundElement" style={styles.choixEnTete}>
              <ThemedText type="small" themeColor="textSecondary">
                Feuille du classeur
              </ThemedText>
              <ThemedView type="backgroundElement" style={styles.rangees}>
                {feuilles.map((feuille, index) => (
                  <Pressable
                    key={feuille.sheet}
                    onPress={() => changerFeuille(index)}
                    style={({ pressed }) => [
                      styles.onglet,
                      {
                        backgroundColor:
                          index === feuilleActive ? theme.text : theme.backgroundSelected,
                      },
                      pressed && styles.presse,
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: index === feuilleActive ? theme.background : theme.text }}>
                      {feuille.sheet}
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            </ThemedView>
          )}

          {candidatesEnTete.length > 1 && (
            <ThemedView type="backgroundElement" style={styles.choixEnTete}>
              <ThemedText type="small" themeColor="textSecondary">
                Quelle ligne porte les intitulés de colonnes ?
              </ThemedText>
              <ThemedView type="backgroundElement" style={styles.rangees}>
                {candidatesEnTete.map((ligne, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setLigneEnTete(index)}
                    style={({ pressed }) => [
                      styles.rangee,
                      {
                        backgroundColor:
                          index === ligneEnTete ? theme.text : theme.backgroundSelected,
                      },
                      pressed && styles.presse,
                    ]}>
                    <ThemedText
                      type="smallBold"
                      style={{ color: index === ligneEnTete ? theme.background : theme.text }}>
                      {index + 1}
                    </ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            </ThemedView>
          )}

          <ScrollView horizontal showsHorizontalScrollIndicator style={styles.tableau}>
            <ThemedView type="backgroundElement">
              <ThemedView type="backgroundElement" style={styles.ligneTableau}>
                {apercu.colonnes.map((colonne, index) => (
                  <ThemedView
                    key={index}
                    style={[styles.cellule, { backgroundColor: theme.backgroundSelected }]}>
                    <ThemedText type="smallBold" numberOfLines={2}>
                      {colonne}
                    </ThemedText>
                  </ThemedView>
                ))}
              </ThemedView>

              {apercu.lignes.map((ligne, indexLigne) => (
                <ThemedView key={indexLigne} type="backgroundElement" style={styles.ligneTableau}>
                  {ligne.map((cellule, indexCellule) => (
                    <ThemedView key={indexCellule} style={styles.cellule}>
                      <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                        {cellule || '—'}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              ))}
            </ThemedView>
          </ScrollView>

          <ThemedText type="small" themeColor="textSecondary">
            {apercu.colonnes.length} colonne{apercu.colonnes.length > 1 ? 's' : ''} détectée
            {apercu.colonnes.length > 1 ? 's' : ''}. Montrez cet écran pour qu&apos;on décide
            ensemble quelle colonne alimente quel champ.
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bloc: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  bouton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  desactive: {
    opacity: 0.5,
  },
  presse: {
    opacity: 0.7,
  },
  erreur: {
    color: '#B91C1C',
  },
  apercu: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  choixEnTete: {
    gap: Spacing.one,
  },
  rangees: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  onglet: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  rangee: {
    minWidth: 34,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  tableau: {
    maxHeight: 260,
  },
  ligneTableau: {
    flexDirection: 'row',
  },
  cellule: {
    width: 130,
    padding: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#9993',
  },
});
