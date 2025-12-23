import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';

interface ReferralCodeCardProps {
  code: string;
  onCopy: () => void;
}

export default function ReferralCodeCard({ code, onCopy }: ReferralCodeCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Invite Code</Text>
      <View style={styles.contentRow}>
        <Text style={styles.code}>{code}</Text>
        <TouchableOpacity style={styles.copyButton} onPress={onCopy} activeOpacity={0.7}>
          <MaterialIcons name="content-copy" size={20} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: SIZES.radiusLg,
    padding: SPACING.l,
    marginBottom: SPACING.xl,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.s,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.mono,
    fontWeight: '600',
    letterSpacing: 1,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
