import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

export default function LoadingProgressBar() {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.statusLabel}>PROCESSING</Text>
        <Text style={styles.percentage}>78%</Text>
      </View>
      
      <View style={styles.track}>
        <View style={[styles.fill, { width: '78%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: SPACING.l,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.s,
  },
  statusLabel: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  percentage: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  track: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
  },
});

