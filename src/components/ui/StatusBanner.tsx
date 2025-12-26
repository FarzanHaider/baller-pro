import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

export default function StatusBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trial Ends in 3 Days</Text>
      <Text style={styles.description}>
        Upgrade now to keep unlimited access to all workouts and personalized plans.
      </Text>
      <Text style={styles.subtext}>Your trial is active until October 26, 2024</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    color: COLORS.accent,
    fontFamily: FONTS.bold,
    fontSize: 18,
    marginBottom: SPACING.s,
  },
  description: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: SPACING.s,
  },
  subtext: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 12,
  },
});
