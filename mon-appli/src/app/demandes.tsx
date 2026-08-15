import { SymbolView } from 'expo-symbols';
import { FlatList, Platform, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBadge } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { setDemandeStatut, useDemandes, type Demande } from '@/data/demandes-store';
import { useTheme } from '@/hooks/use-theme';

function DemandeCard({ demande }: { demande: Demande }) {
  const theme = useTheme();
  const enAttente = demande.statut === 'En attente';

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView type="backgroundElement" style={styles.cardHeader}>
        <ThemedText type="smallBold">
          {demande.date} · {demande.heure}
        </ThemedText>
        {!enAttente && (
          <StatusBadge
            label={demande.statut}
            tone={demande.statut === 'Validée' ? 'positive' : 'negative'}
          />
        )}
      </ThemedView>

      {demande.commentaire.length > 0 && (
        <ThemedText type="default" themeColor="textSecondary">
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
    gap: Spacing.two,
    marginTop: Spacing.one,
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
