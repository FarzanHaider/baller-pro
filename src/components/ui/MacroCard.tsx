import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface MacroCardProps {
  name: string;
  current: number;
  target: number;
}

export default function MacroCard({ name, current, target }: MacroCardProps) {
  const progress = Math.min(current / target, 1); // Cap at 100%
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.macroName}>{name}</Text>
      <Text style={styles.macroValues}>
        {current}g / {target}g
      </Text>
      
      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${percentage}%` }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
    minWidth: 100,
  },
  macroName: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  macroValues: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.s,
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
  },
});
