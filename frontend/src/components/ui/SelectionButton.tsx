import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface SelectionButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function SelectionButton({ label, selected, onPress }: SelectionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected ? styles.selectedContainer : styles.defaultContainer
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text 
        style={[
          styles.label, 
          selected ? styles.selectedLabel : styles.defaultLabel
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: SPACING.l,
    paddingHorizontal: SPACING.l,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultContainer: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceHighlight,
  },
  selectedContainer: {
    backgroundColor: COLORS.primaryTint,
    borderColor: COLORS.primary,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  defaultLabel: {
    color: COLORS.text,
  },
  selectedLabel: {
    color: COLORS.white,
  },
});

