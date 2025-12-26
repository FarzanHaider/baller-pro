import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface StatusItem {
  id: string;
  label: string;
  status: 'done' | 'active' | 'pending';
}

const STEPS: StatusItem[] = [
  { id: '1', label: 'Evaluating recovery metrics', status: 'done' },
  { id: '2', label: 'Optimizing workout volume', status: 'active' },
  { id: '3', label: 'Scheduling rest days', status: 'pending' },
];

export default function GenerationStatusList() {
  return (
    <View style={styles.container}>
      {STEPS.map((step) => (
        <View key={step.id} style={[styles.row, step.status === 'pending' && styles.rowPending]}>
          {/* Icon Logic */}
          <View style={styles.iconContainer}>
            {step.status === 'done' && (
              <MaterialIcons name="check-circle" size={20} color={COLORS.gold} />
            )}
            {step.status === 'active' && (
              <ActivityIndicator size="small" color={COLORS.primary} />
            )}
            {step.status === 'pending' && (
              <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.textSecondary} />
            )}
          </View>

          {/* Label */}
          <Text style={[
            styles.label,
            step.status === 'done' && styles.labelDone,
            step.status === 'active' && styles.labelActive
          ]}>
            {step.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.l,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  rowPending: {
    opacity: 0.5,
    marginBottom: 0, // Last item
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  labelDone: {
    color: 'rgba(255,255,255,0.8)',
  },
  labelActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
});

