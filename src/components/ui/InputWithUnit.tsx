import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface InputWithUnitProps extends TextInputProps {
  label: string;
  unit: string;
}

export default function InputWithUnit({ label, unit, style, ...props }: InputWithUnitProps) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(138, 138, 142, 0.5)"
          keyboardType="numeric"
          {...props}
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginBottom: SPACING.s,
  },
  inputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
    textAlign: 'center',
    height: '100%'
  },
  unit: {
    position: 'absolute',
    right: SPACING.m,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});
