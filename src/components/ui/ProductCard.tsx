import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { Product } from '@/types/merch';

interface ProductCardProps {
  item: Product;
  onPress: (item: Product) => void;
}

export default function ProductCard({ item, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      activeOpacity={0.8}
      onPress={() => onPress(item)}
    >
      <View style={[
        styles.imageContainer, 
        item.isAccent && styles.accentBorder
      ]}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image} 
          resizeMode="cover" 
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.price, item.isAccent && styles.accentPrice]}>
          ${item.price.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: SPACING.l,
    maxWidth: '48%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginBottom: SPACING.s,
  },
  accentBorder: {
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    paddingHorizontal: SPACING.xs,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: 4,
  },
  price: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  accentPrice: {
    color: COLORS.accent,
    fontFamily: FONTS.medium,
  },
});
