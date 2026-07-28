import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type StatusTone = 'positive' | 'warning' | 'negative';

const toneColors: Record<StatusTone, { background: string; text: string }> = {
  positive: { background: '#DCFCE7', text: '#15803D' },
  warning: { background: '#FEF3C7', text: '#B45309' },
  negative: { background: '#FEE2E2', text: '#B91C1C' },
};

export function StatusBadge({ label, tone }: { label: string; tone: StatusTone }) {
  const colors = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <ThemedText type="smallBold" style={{ color: colors.text }}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Spacing.three,
    alignSelf: 'flex-start',
  },
});
