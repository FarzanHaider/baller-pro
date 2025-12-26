import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface Option {
  id: string;
  label?: string; // For sizes
  color?: string; // For colors
  disabled?: boolean;
}

interface OptionSelectorProps {
  title: string;
  type: 'color' | 'size';
  options: Option[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function OptionSelector({ 
  title, 
  type, 
  options, 
  selectedId, 
  onSelect 
}: OptionSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.row}>
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          if (type === 'color') {
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={() => onSelect(opt.id)}
                style={[
                  styles.colorCircle,
                  { backgroundColor: opt.color },
                  isSelected && styles.selectedColorRing
                ]}
              />
            );
          }
          // Size Buttons
          return (
            <TouchableOpacity
              key={opt.id}
              disabled={opt.disabled}
              onPress={() => onSelect(opt.id)}
              style={[
                styles.sizeButton,
                isSelected && styles.selectedSizeButton,
                opt.disabled && styles.disabledSizeButton
              ]}
            >
              <Text 
                style={[
                  styles.sizeText,
                  isSelected && styles.selectedSizeText,
                  opt.disabled && styles.disabledSizeText
                ]}
              >
                {opt.label}
              </Text>
              {/* Strikethrough for disabled items */}
              {opt.disabled && <View style={styles.strikethrough} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.l,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.m,
    flexWrap: 'wrap',
  },
  // Color Styles
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColorRing: {
    borderColor: COLORS.surfaceHighlight,
    borderWidth: 3, 
  },
  // Size Styles
  sizeButton: {
    width: 64,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: COLORS.primary,
  },
  disabledSizeButton: {
    backgroundColor: COLORS.surfaceHighlight,
    opacity: 0.5,
  },
  sizeText: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  selectedSizeText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  disabledSizeText: {
    color: COLORS.textSecondary,
  },
  strikethrough: {
    position: 'absolute',
    width: '60%',
    height: 1,
    backgroundColor: COLORS.textSecondary,
    transform: [{ rotate: '-15deg' }],
  },
});
