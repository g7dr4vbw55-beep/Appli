import { FlatList, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StatusBadge, type StatusTone } from '@/components/status-badge';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { creneauxLivraison, type CreneauLivraison, type CreneauStatut } from '@/data/planning-data';
import { useTheme } from '@/hooks/use-theme';
import { formatDateFr } from '@/lib/dates';

const statutTone: Record<CreneauStatut, StatusTone> = {
  Confirmé: 'positive',
  'En attente': 'warning',
  Annulé: 'negative',
};

function CreneauCard({ creneau }: { creneau: CreneauLivraison }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <ThemedView type="backgroundElement" style={styles.cardHeader}>
        <ThemedText type="smallBold">
          {formatDateFr(creneau.date)} · {creneau.heure}
        </ThemedText>
        <StatusBadge label={creneau.statut} tone={statutTone[creneau.statut]} />
      </ThemedView>
      <ThemedText type="default">{creneau.piece}</ThemedText>
    </ThemedView>
  );
}

export default function PlanningScreen() {
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

  return (
    <FlatList
      style={[styles.list, { backgroundColor: theme.background }]}
      contentInset={insets}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}
      data={creneauxLivraison}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">Planning</ThemedText>
          <ThemedText themeColor="textSecondary">Créneaux de livraison à venir</ThemedText>
        </ThemedView>
      }
      renderItem={({ item }) => <CreneauCard creneau={item} />}
      ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
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
  },
});
