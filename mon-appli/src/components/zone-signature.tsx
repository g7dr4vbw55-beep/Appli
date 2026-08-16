import { useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { REPERE_SIGNATURE } from '@/lib/signatures';

/**
 * Surface où l'on signe au doigt.
 *
 * Le tracé est enregistré comme un chemin vectoriel ramené à un repère fixe
 * (voir `REPERE_SIGNATURE`), et non comme une image : il pèse quelques
 * centaines de caractères, s'imprime net à n'importe quelle taille, et se
 * glisse tel quel dans le bon de livraison.
 */
export function ZoneSignature({
  trace,
  onChange,
}: {
  trace: string;
  onChange: (trace: string) => void;
}) {
  const theme = useTheme();
  const [taille, setTaille] = useState({ largeur: 0, hauteur: 0 });
  const tailleRef = useRef(taille);
  const traceRef = useRef(trace);
  const [enCours, setEnCours] = useState('');
  const enCoursRef = useRef('');

  traceRef.current = trace;

  function mesurer(evenement: LayoutChangeEvent) {
    const { width, height } = evenement.nativeEvent.layout;
    tailleRef.current = { largeur: width, hauteur: height };
    setTaille({ largeur: width, hauteur: height });
  }

  /** Ramène un point de l'écran dans le repère commun du tracé. */
  function point(x: number, y: number) {
    const { largeur, hauteur } = tailleRef.current;
    if (largeur === 0 || hauteur === 0) return '0 0';
    const rx = Math.round((x / largeur) * REPERE_SIGNATURE.largeur * 10) / 10;
    const ry = Math.round((y / hauteur) * REPERE_SIGNATURE.hauteur * 10) / 10;
    return `${rx} ${ry}`;
  }

  function majEnCours(valeur: string) {
    enCoursRef.current = valeur;
    setEnCours(valeur);
  }

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: ({ nativeEvent }) => {
        majEnCours(`M ${point(nativeEvent.locationX, nativeEvent.locationY)}`);
      },
      onPanResponderMove: ({ nativeEvent }) => {
        majEnCours(
          `${enCoursRef.current} L ${point(nativeEvent.locationX, nativeEvent.locationY)}`
        );
      },
      onPanResponderRelease: () => {
        const termine = enCoursRef.current;
        majEnCours('');
        if (!termine) return;
        onChange(traceRef.current ? `${traceRef.current} ${termine}` : termine);
      },
    })
  ).current;

  const dessin = [trace, enCours].filter((part) => part.length > 0).join(' ');

  return (
    <ThemedView type="backgroundElement" style={styles.bloc}>
      <View
        onLayout={mesurer}
        {...responder.panHandlers}
        style={[styles.surface, { borderColor: theme.backgroundSelected }]}>
        {taille.largeur > 0 && (
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${REPERE_SIGNATURE.largeur} ${REPERE_SIGNATURE.hauteur}`}>
            {dessin.length > 0 && (
              <Path
                d={dessin}
                stroke={theme.text}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            )}
          </Svg>
        )}

        {dessin.length === 0 && (
          <ThemedText type="small" themeColor="textSecondary" style={styles.consigne}>
            Signez ici avec le doigt
          </ThemedText>
        )}
      </View>

      <Pressable
        onPress={() => onChange('')}
        disabled={trace.length === 0}
        style={({ pressed }) => [
          styles.effacer,
          { backgroundColor: theme.backgroundSelected },
          trace.length === 0 && styles.desactive,
          pressed && trace.length > 0 && styles.presse,
        ]}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Effacer
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bloc: {
    gap: Spacing.two,
  },
  surface: {
    height: 150,
    borderWidth: 1,
    borderRadius: Spacing.two,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  consigne: {
    position: 'absolute',
    alignSelf: 'center',
  },
  effacer: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.two,
  },
  desactive: {
    opacity: 0.4,
  },
  presse: {
    opacity: 0.7,
  },
});
