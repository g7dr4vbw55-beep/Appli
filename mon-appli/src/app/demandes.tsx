import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  setDemandeStatut,
  useDemandes,
  validerAvecCreneau,
  type Demande,
} from '@/data/demandes-store';
import { useTheme } from '@/hooks/use-theme';
import { formatDateFr } from '@/lib/dates';

function DemandeCard({ demande }: { demande: Demande }) {
  const theme = useTheme();
  const enAttente = demande.statut === 'En attente';
  const [ajustement, setAjustement] = useState<{ date: string; heure: string } | null>(null);
  const creneauAjuste = demande.dateInitiale !== undefined || demande.heureInitiale !== undefined;

  const creneauValide =
    ajustement !== null && ajustement.date.trim().length > 0 && ajustement.heure.trim().length > 0;

  if (enAttente && ajustement !== null) {
    return (
      <ThemedView type="backgroundElement" style={styles.card}>
        <ThemedText type="smallBold">Ajuster le créneau</ThemedText>

        <ThemedView type="backgroundElement" style={styles.ajustChamps}>
          <ThemedView type="backgroundElement" style={styles.ajustChamp}>
            <ThemedText type="small" themeColor="textSecondary">
              Date
            </ThemedText>
            <TextInput
              value={ajustement.date}
              onChangeText={(date) => setAjustement({ ...ajustement, date })}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={theme.textSecondary}
              style={[styles.ajustInput, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>
          <ThemedView type="backgroundElement" style={styles.ajustChamp}>
            <ThemedText type="small" themeColor="textSecondary">
              Heure
            </ThemedText>
            <TextInput
              value={ajustement.heure}
              onChangeText={(heure) => setAjustement({ ...ajustement, heure })}
              placeholder="HH:MM"
              placeholderTextColor={theme.textSecondary}
              style={[styles.ajustInput, { color: theme.text, borderColor: theme.backgroundSelected }]}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.actionsRow}>
          <Pressable
            onPress={() => {
              validerAvecCreneau(demande.id, {
                date: ajustement.date.trim(),
                heure: ajustement.heure.trim(),
              });
              setAjustement(null);
            }}
            disabled={!creneauValide}
            style={({ pressed }) => [
              styles.actionButton,
              styles.validateButton,
              !creneauValide && styles.disabled,
              pressed && creneauValide && styles.pressed,
            ]}>
            <SymbolView
              tintColor="#15803D"
              name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
              size={14}
            />
            <ThemedText type="smallBold" style={styles.validateText}>
              Valider à ce créneau
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => setAjustement(null)}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Annuler
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    );
  }

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView type="backgroundElement" style={styles.cardHeader}>
        <ThemedText type="smallBold">
          {formatDateFr(demande.date)} · {demande.heure}
        </ThemedText>
        {!enAttente && (
          <StatusBadge
            label={demande.statut}
            tone={demande.statut === 'Validée' ? 'positive' : 'negative'}
          />
        )}
      </ThemedView>

      {creneauAjuste && (
        <ThemedText type="small" themeColor="textSecondary">
          Demandé initialement : {formatDateFr(demande.dateInitiale ?? demande.date)} ·{' '}
          {demande.heureInitiale ?? demande.heure}
        </ThemedText>
      )}

      {(demande.client.length > 0 || demande.chantier.length > 0) && (
        <ThemedText type="default">
          {[demande.client, demande.chantier].filter((v) => v.length > 0).join(' — ')}
        </ThemedText>
      )}

      {demande.pieces.length > 0 && (
        <ThemedView type="backgroundElement" style={styles.piecesListe}>
          {demande.pieces.map((repere) => (
            <ThemedView
              key={repere}
              style={[styles.pieceChip, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="smallBold">{repere}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      )}

      {demande.commentaire.length > 0 && (
        <ThemedText type="small" themeColor="textSecondary">
          {demande.commentaire}
        </ThemedText>
      )}

      <ThemedView type="backgroundElement" style={styles.actionsRow}>
        {enAttente ? (
          <>
            <Pressable
              onPress={() => setDemandeStatut(demande.id, 'Validée')}
              style={({ pressed }) => [
                styles.actionButton,
                styles.validateButton,
                pressed && styles.pressed,
              ]}>
              <SymbolView
                tintColor="#15803D"
                name={{ ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }}
                size={14}
              />
              <ThemedText type="smallBold" style={styles.validateText}>
                Valider
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setAjustement({ date: demande.date, heure: demande.heure })}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}>
              <SymbolView
                tintColor={theme.textSecondary}
                name={{ ios: 'clock.arrow.circlepath', android: 'schedule', web: 'schedule' }}
                size={14}
              />
              <ThemedText type="smallBold" themeColor="textSecondary">
                Ajuster
              </ThemedText>
            </Pressable>

            <Pressable
              onPress={() => setDemandeStatut(demande.id, 'Refusée')}
              style={({ pressed }) => [
                styles.actionButton,
                styles.rejectButton,
                pressed && styles.pressed,
              ]}>
              <SymbolView
                tintColor="#B91C1C"
                name={{ ios: 'xmark.circle', android: 'cancel', web: 'cancel' }}
                size={14}
              />
              <ThemedText type="smallBold" style={styles.rejectText}>
                Refuser
              </ThemedText>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => setDemandeStatut(demande.id, 'En attente')}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.backgroundSelected },
              pressed && styles.pressed,
            ]}>
            <SymbolView
              tintColor={theme.textSecondary}
              name={{ ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' }}
              size={14}
            />
            <ThemedText type="smallBold" themeColor="textSecondary">
              Remettre en attente
            </ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

export default function DemandesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const { enAttente, traitees, chargement } = useDemandes();
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

  return (
    <FlatList
      style={[styles.list, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      data={enAttente}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Demandes</ThemedText>
          <ThemedText themeColor="textSecondary">
            {enAttente.length > 0
              ? `${enAttente.length} demande${enAttente.length > 1 ? 's' : ''} à décider`
              : 'Aucune décision en attente'}
          </ThemedText>
        </ThemedView>
      }
      ListEmptyComponent={
        <ThemedView style={styles.emptyState}>
          <ThemedText themeColor="textSecondary">
            {chargement ? 'Chargement…' : 'Aucune demande en attente.'}
          </ThemedText>
        </ThemedView>
      }
      renderItem={({ item }) => <DemandeCard demande={item} />}
      ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
      ListFooterComponent={
        traitees.length > 0 ? (
          <ThemedView style={styles.historique}>
            <ThemedText type="smallBold" themeColor="textSecondary" style={styles.historiqueTitre}>
              Déjà traitées
            </ThemedText>
            {traitees.map((demande) => (
              <DemandeCard key={demande.id} demande={demande} />
            ))}
          </ThemedView>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
  },
  titleContainer: {
    gap: Spacing.two,
    paddingVertical: Spacing.four,
  },
  emptyState: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },
  separator: {
    height: Spacing.two,
  },
  card: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  historique: {
    gap: Spacing.two,
    paddingTop: Spacing.five,
  },
  historiqueTitre: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  ajustChamps: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  ajustChamp: {
    flex: 1,
    gap: Spacing.one,
  },
  ajustInput: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  disabled: {
    opacity: 0.4,
  },
  piecesListe: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  pieceChip: {
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
    borderRadius: Spacing.two,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.three,
  },
  validateButton: {
    backgroundColor: '#DCFCE7',
  },
  rejectButton: {
    backgroundColor: '#FEE2E2',
  },
  validateText: {
    color: '#15803D',
  },
  rejectText: {
    color: '#B91C1C',
  },
  pressed: {
    opacity: 0.7,
  },
});
