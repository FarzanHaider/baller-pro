import React from 'react';
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES, SPACING } from '@/constants/theme';

interface ProductCarouselProps {
  images: string[];
}

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75; // Show part of the next image

export default function ProductCarousel({ images }: ProductCarouselProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH + SPACING.m}
      >
        {images.map((img, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={{ uri: img }} style={styles.image} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.l,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    gap: SPACING.m,
  },
  imageContainer: {
    width: ITEM_WIDTH,
    aspectRatio: 1,
    borderRadius: SIZES.radiusLg,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
