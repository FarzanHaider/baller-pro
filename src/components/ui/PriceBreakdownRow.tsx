import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface PriceBreakdownRowProps {
  label: string;
  value: string;
  isTotal?: boolean;
}

export default function PriceBreakdownRow({ label, value, isTotal = false }: PriceBreakdownRowProps) {
  return (
    <View style={[styles.container, isTotal && styles.totalContainer]}>
      <Text style={[styles.label, isTotal && styles.totalLabel]}>{label}</Text>
      <Text style={[styles.value, isTotal && styles.totalValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
  },
  totalContainer: {
    paddingVertical: SPACING.s,
    marginTop: SPACING.xs,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  value: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  totalLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  totalValue: {
    color: COLORS.gold,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
});
