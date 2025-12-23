import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SPACING, SIZES, FONTS } from '@/constants/theme';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  item: Recipe;
}

export default function RecipeCard({ item }: RecipeCardProps) {
  if (!item) {
    return <View style={styles.container} />;
  }

  const title = item.title ? String(item.title) : '';
  const calories = item.calories ?? 0;
  const protein = item.protein ?? 0;
  const carbs = item.carbs ?? 0;
  const fat = item.fat ?? 0;
  const statsText = `${calories} kcal · P:${protein} C:${carbs} F:${fat}`;

  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, { backgroundColor: COLORS.surface }]} />
        )}
        <View style={styles.favoriteBadge}>
          <MaterialIcons 
            name="star" 
            size={20} 
            color={item.isFavorite ? COLORS.accent : COLORS.text} 
          />
        </View>
      </View>
      {/* Info Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.stats}>
          {statsText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.l,
    maxWidth: '48%', // Ensures 2 columns fit with gap
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 3 / 4,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.s,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    // gap: 4, // Using marginBottom instead for better compatibility
  },
  title: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  stats: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
});
