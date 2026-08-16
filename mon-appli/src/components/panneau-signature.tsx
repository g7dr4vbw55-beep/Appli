import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ZoneSignature } from '@/components/zone-signature';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { LIBELLES_SIGNATURE, type RoleSignature, type Signature } from '@/lib/signatures';

/** Formulaire de recueil d'une signature : nom, tracé, et réserves à la réception. */
export function PanneauSignature({
  role,
  onValider,
  onAnnuler,
}: {
  role: RoleSignature;
  onValider: (signature: Signature) => void;
  onAnnuler: () => void;
}) {
  const theme = useTheme();
  const libelle = LIBELLES_SIGNATURE[role];
  const [nom, setNom] = useState('');
  const [trace, setTrace] = useState('');
  const [reserves, setReserves] = useState('');

  const complet = nom.trim().length > 0 && trace.length > 0;

  return (
    <ThemedView type="backgroundElement" style={styles.panneau}>
      <ThemedView type="backgroundElement">
        <ThemedText type="smallBold">
          {libelle.rang}. {libelle.titre}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {libelle.quand}
        </ThemedText>
      </ThemedView>

      <ThemedView type="backgroundElement" style={styles.champ}>
        <ThemedText type="small" themeColor="textSecondary">
          Nom du signataire
        </ThemedText>
        <TextInput
          value={nom}
          onChangeText={setNom}
          placeholder="Nom et prénom"
          placeholderTextColor={theme.textSecondary}
          style={[styles.saisie, { color: theme.text, borderColor: theme.backgroundSelected }]}
        />
      </ThemedView>

      {role === 'receptionnaire' && (
        <ThemedView type="backgroundElement" style={styles.champ}>
          <ThemedText type="small" themeColor="textSecondary">
            Réserves (facultatif)
          </ThemedText>
          <TextInput
            value={reserves}
            onChangeText={setReserves}
            placeholder="Pièce manquante, épaufrure, retard…"
            placeholderTextColor={theme.textSecondary}
            multiline
            numberOfLines={3}
            style={[
              styles.saisie,
              styles.zoneTexte,
              { color: theme.text, borderColor: theme.backgroundSelected },
            ]}
          />
        </ThemedView>
      )}

      <ZoneSignature trace={trace} onChange={setTrace} />

      <ThemedView type="backgroundElement" style={styles.actions}>
        <Pressable
          onPress={() =>
            onValider({
              nom: nom.trim(),
              trace,
              signeLe: new Date().toISOString(),
              reserves: reserves.trim().length > 0 ? reserves.trim() : undefined,
            })
          }
          disabled={!complet}
          style={({ pressed }) => [
            styles.bouton,
            styles.valider,
            !complet && styles.desactive,
            pressed && complet && styles.presse,
          ]}>
          <ThemedText type="smallBold" style={styles.texteValider}>
            Enregistrer la signature
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={onAnnuler}
          style={({ pressed }) => [
            styles.bouton,
            { backgroundColor: theme.backgroundSelected },
            pressed && styles.presse,
          ]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Annuler
          </ThemedText>
        </Pressable>
      </ThemedView>

      {!complet && (
        <ThemedText type="small" themeColor="textSecondary">
          Le nom et le tracé sont requis.
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  panneau: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  champ: {
    gap: Spacing.one,
  },
  saisie: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  zoneTexte: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  bouton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
  valider: {
    backgroundColor: '#DCFCE7',
  },
  texteValider: {
    color: '#15803D',
  },
  desactive: {
    opacity: 0.4,
  },
  presse: {
    opacity: 0.7,
  },
});
