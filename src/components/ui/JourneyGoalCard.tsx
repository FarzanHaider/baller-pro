import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface JourneyGoalCardProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  selected: boolean;
  onPress: () => void;
}

export default function JourneyGoalCard({ label, icon, selected, onPress }: JourneyGoalCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.defaultContainer
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons 
        name={icon} 
        size={32} 
        color={selected ? COLORS.accent : COLORS.textSecondary} 
      />
      <Text 
        style={[
          styles.label, 
          selected ? styles.selectedLabel : styles.defaultLabel
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // vital for responsive grid
    aspectRatio: 1, // Keeps it square
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    borderWidth: 2,
    gap: SPACING.s,
    minHeight: 120, // Minimum touch area safety
  },
  defaultContainer: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceHighlight,
  },
  selectedContainer: {
    backgroundColor: COLORS.accentGold ? `${COLORS.accentGold}33` : COLORS.primaryTint,
    borderColor: COLORS.accent,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  defaultLabel: {
    color: COLORS.text,
  },
  selectedLabel: {
    color: COLORS.white,
  },
});

