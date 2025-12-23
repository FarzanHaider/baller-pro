import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface QuantityCounterProps {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityCounter({ value, onIncrease, onDecrease }: QuantityCounterProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Quantity</Text>
      <View style={styles.counterWrapper}>
        <TouchableOpacity style={styles.button} onPress={onDecrease}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity style={styles.button} onPress={onIncrease}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    marginBottom: SPACING.xl,
  },
  label: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  counterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceHighlight,
    borderRadius: SIZES.radius,
    padding: 4,
  },
  button: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 24,
    fontFamily: FONTS.medium,
  },
  value: {
    width: 30,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
});
