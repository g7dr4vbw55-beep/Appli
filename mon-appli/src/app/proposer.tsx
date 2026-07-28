import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { addDemande } from '@/data/demandes-store';
import { useTheme } from '@/hooks/use-theme';

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

  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [confirmation, setConfirmation] = useState(false);

  const canSubmit = date.trim().length > 0 && heure.trim().length > 0;

  function handleChange(setter: (value: string) => void) {
    return (value: string) => {
      setter(value);
      setConfirmation(false);
    };
  }

  function handleSubmit() {
    if (!canSubmit) return;
    addDemande({ date: date.trim(), heure: heure.trim(), commentaire: commentaire.trim() });
    setDate('');
    setHeure('');
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
          <ThemedText type="subtitle">Proposer un créneau</ThemedText>
          <ThemedText themeColor="textSecondary">
            Envoyez une demande de créneau de livraison. Elle sera ajoutée à la liste des demandes
            en attente.
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.form}>
          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Date souhaitée</ThemedText>
            <TextInput
              value={date}
              onChangeText={handleChange(setDate)}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>

          <ThemedView type="backgroundElement" style={styles.field}>
            <ThemedText type="smallBold">Heure souhaitée</ThemedText>
            <TextInput
              value={heure}
              onChangeText={handleChange(setHeure)}
              placeholder="HH:MM"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
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
  submitButton: {
    borderRadius: Spacing.three,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
