import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface CartSummaryProps {
  subtotal: number;
  onCheckout: () => void;
}

export default function CartSummary({ subtotal, onCheckout }: CartSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping & Taxes</Text>
        <Text style={styles.valueSecondary}>Calculated at checkout</Text>
      </View>
      <TouchableOpacity 
        style={styles.checkoutButton} 
        onPress={onCheckout}
        activeOpacity={0.9}
      >
        <Text style={styles.checkoutText}>Proceed to Checkout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.l,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  label: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  value: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  valueSecondary: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  checkoutButton: {
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  checkoutText: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
});
