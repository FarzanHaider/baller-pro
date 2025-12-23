import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { Challenge } from '@/types/community';

interface ChallengeCardProps {
  item: Challenge;
}

export default function ChallengeCard({ item }: ChallengeCardProps) {
  return (
    <View style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.duration}>Duration: {item.duration}</Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 160,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginRight: SPACING.m,
    backgroundColor: COLORS.card,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.m,
  },
  title: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  duration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.s,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
});

