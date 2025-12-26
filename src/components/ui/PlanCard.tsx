import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  billingText: string;
  features: string[];
  isBestValue?: boolean;
  isSelected?: boolean;
  onPress: () => void;
}

export default function PlanCard({
  title, price, period, billingText, features, isBestValue = false, isSelected = false, onPress,
}: PlanCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {isBestValue && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BEST VALUE</Text>
            </View>
          )}
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceSymbol}>$</Text>
          <Text style={styles.price}>{price}</Text>
          <Text style={styles.period}> / {period}</Text>
        </View>
        <Text style={styles.billingText}>{billingText}</Text>
      </View>
      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <MaterialIcons name="check-circle" size={20} color={COLORS.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.xl,
    marginBottom: SPACING.m,
    borderWidth: 1,
  },
  selectedContainer: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4, // Android glow
  },
  unselectedContainer: {
    borderColor: COLORS.border,
  },
  header: {
    marginBottom: SPACING.m,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  badge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: SIZES.radiusFull,
  },
  badgeText: {
    color: COLORS.black,
    fontFamily: FONTS.bold,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: SPACING.xs,
  },
  priceSymbol: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 24,
  },
  price: {
    color: COLORS.text,
    fontFamily: FONTS.black,
    fontSize: 36,
    letterSpacing: -1,
  },
  period: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  billingText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
    marginTop: SPACING.xs,
  },
  features: {
    gap: SPACING.s,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  featureText: {
    color: COLORS.text,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});
