import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '31%', // 3 cards per row with gaps
    minWidth: 95,
    height: 110, // Fixed height to prevent overlap
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  value: {
    color: COLORS.text,
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
});
