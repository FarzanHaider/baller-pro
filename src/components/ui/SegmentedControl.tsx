import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface SegmentedControlProps {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}

export default function SegmentedControl({ options, selected, onSelect }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.button, isActive && styles.activeButton]}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.xs,
    height: 48,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.radius - 2,
  },
  activeButton: {
    backgroundColor: COLORS.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  activeText: {
    color: COLORS.text,
  },
});
