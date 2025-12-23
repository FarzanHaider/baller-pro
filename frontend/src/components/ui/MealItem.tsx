import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface MealItemProps {
  icon: string;
  mealName: string;
  description: string;
  calories: number;
  onPress?: () => void;
}

export default function MealItem({ 
  icon, 
  mealName, 
  description, 
  calories,
  onPress 
}: MealItemProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.7}
      onPress={onPress}
    >
      {/* Icon Circle */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Meal Info */}
      <View style={styles.mealInfo}>
        <Text style={styles.mealName}>{mealName}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Calories */}
      <Text style={styles.calories}>{calories} kcal</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.m,
  },
  icon: {
    fontSize: 24,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  calories: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
});
