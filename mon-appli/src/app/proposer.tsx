import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { addDemande, type PieceChargee } from '@/data/demandes-store';
import { useTheme } from '@/hooks/use-theme';
import { analyserPoids, formatPoids, totalPoids } from '@/lib/poids';

export default function ProposerScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  const [client, setClient] = useState('');
  const [chantier, setChantier] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [pieces, setPieces] = useState<PieceChargee[]>([]);
  const [repereEnCours, setRepereEnCours] = useState('');
  const [poidsEnCours, setPoidsEnCours] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  const canSubmit =
    client.trim().length > 0 &&
    chantier.trim().length > 0 &&
    date.trim().length > 0 &&
    heure.trim().length > 0 &&
    pieces.length > 0;

  function handleChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setConfirmation(false);
    };
  }

  const repereValide =
    repereEnCours.trim().length > 0 &&
    !pieces.some((p) => p.repere === repereEnCours.trim());
  const poidsValide = analyserPoids(poidsEnCours) !== null;
  const pieceAjoutable = repereValide && poidsValide;

  function ajouterPiece() {
    const poids = analyserPoids(poidsEnCours);
    if (!repereValide || poids === null) return;
    setPieces([...pieces, { repere: repereEnCours.trim(), poids }]);
    setRepereEnCours('');
    setPoidsEnCours('');
    setConfirmation(false);
  }

  function retirerPiece(repere: string) {
    setPieces(pieces.filter((p) => p.repere !== repere));
    setConfirmation(false);
  }

  function handleSubmit() {
    if (!canSubmit) return;
    addDemande({
      client: client.trim(),
      chantier: chantier.trim(),
      date: date.trim(),
      heure: heure.trim(),
      pieces,
      commentaire: commentaire.trim(),
    });
    setClient('');
    setChantier('');
    setDate('');
    setHeure('');
    setPieces([]);
    setRepereEnCours('');
    setPoidsEnCours('');
    setCommentaire('');
    setConfirmation(true);
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Proposer un camion</ThemedText>
          <ThemedText themeColor="textSecondary">
            Annoncez un camion et son chargement. La demande sera ajoutée à la liste des demandes
            en attente.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.form}>
          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Client</ThemedText>
            <TextInput
              value={client}
              onChangeText={handleChange(setClient)}
              placeholder="Nom du client"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Chantier</ThemedText>
            <TextInput
              value={chantier}
              onChangeText={handleChange(setChantier)}
              placeholder="Nom ou lieu du chantier"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Date d&apos;arrivée</ThemedText>
            <TextInput
              value={date}
              onChangeText={handleChange(setDate)}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Heure d&apos;arrivée</ThemedText>
            <TextInput
              value={heure}
              onChangeText={handleChange(setHeure)}
              placeholder="HH:MM"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Pièces chargées</ThemedText>
            <ThemedView type="backgroundElement" style={styles.pieceSaisie}>
              <TextInput
                value={repereEnCours}
                onChangeText={setRepereEnCours}
                placeholder="Repère (PT118…)"
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  styles.repereInput,
                  { color: theme.text, borderColor: theme.backgroundSelected },
                ]}
              />
              <TextInput
                value={poidsEnCours}
                onChangeText={setPoidsEnCours}
                onSubmitEditing={ajouterPiece}
                returnKeyType="done"
                keyboardType="decimal-pad"
                placeholder="t"
                placeholderTextColor={theme.textSecondary}
                style={[
                  styles.input,
                  styles.poidsInput,
                  { color: theme.text, borderColor: theme.backgroundSelected },
                ]}
              />
              <Pressable
                onPress={ajouterPiece}
                disabled={!pieceAjoutable}
                style={({ pressed }) => [
                  styles.ajouterPiece,
                  { backgroundColor: theme.backgroundSelected },
                  !pieceAjoutable && styles.disabled,
                  pressed && pieceAjoutable && styles.pressed,
                ]}>
                <ThemedText type="smallBold">Ajouter</ThemedText>
              </Pressable>
            </ThemedView>

            {pieces.length > 0 ? (
              <>
                <ThemedView type="backgroundElement" style={styles.piecesListe}>
                  {pieces.map((piece) => (
                    <Pressable
                      key={piece.repere}
                      onPress={() => retirerPiece(piece.repere)}
                      style={({ pressed }) => [
                        styles.pieceChip,
                        { backgroundColor: theme.backgroundSelected },
                        pressed && styles.pressed,
                      ]}>
                      <ThemedText type="smallBold">
                        {piece.repere} · {formatPoids(piece.poids)}
                      </ThemedText>
                      <ThemedText type="smallBold" themeColor="textSecondary">
                        ✕
                      </ThemedText>
                    </Pressable>
                  ))}
                </ThemedView>
                <ThemedText type="smallBold">
                  Total : {pieces.length} pièce{pieces.length > 1 ? 's' : ''} ·{' '}
                  {formatPoids(totalPoids(pieces))}
                </ThemedText>
              </>
            ) : (
              <ThemedText type="small" themeColor="textSecondary">
                Ajoutez au moins une pièce avec son poids. Touchez une pièce pour la retirer.
              </ThemedText>
            )}
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Commentaire</ThemedText>
            <TextInput
              value={commentaire}
              onChangeText={handleChange(setCommentaire)}
              placeholder="Précisions sur la demande (optionnel)"
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
              style={[
                styles.input,
                styles.textArea,
                { color: theme.text, borderColor: theme.backgroundSelected },
              ]}
            />
          </ThemedView>

          <Pressable
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.submitButton,
              { backgroundColor: canSubmit ? theme.text : theme.backgroundSelected },
              pressed && canSubmit && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.background }}>
              Envoyer la demande
            </ThemedText>
          </Pressable>

          {confirmation && (
            <ThemedText type="small" themeColor="textSecondary">
              Demande envoyée — retrouvez-la dans l&apos;onglet Demandes.
            </ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    width: '100%',
  },
  titleContainer: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  form: {
    gap: Spacing.three,
    marginHorizontal: Spacing.four,
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  field: {
    gap: Spacing.one,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  pieceSaisie: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'stretch',
  },
  repereInput: {
    flex: 1,
  },
  poidsInput: {
    width: 64,
    textAlign: 'center',
  },
  ajouterPiece: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  piecesListe: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  pieceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  disabled: {
    opacity: 0.4,
  },
  submitButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
