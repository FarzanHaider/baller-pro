import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '@/constants/theme';

export const DisclaimerCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Disclaimer</Text>
      <Text style={styles.text}>
        This program is not a substitute for professional medical advice. Consult a doctor or physical therapist before starting any new exercise routine, especially after an injury.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryLowOpacity,
    borderRadius: 16,
    padding: SPACING.m,
    alignItems: 'center',
    marginTop: SPACING.s,
    marginBottom: 100,
  },
  iconContainer: {
    marginBottom: SPACING.s,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 18,
  },
});
