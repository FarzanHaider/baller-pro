import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, SIZES, FONTS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SelectionCardProps {
  title: string;
  description: string;
  iconName: string;
  isSelected: boolean;
  onPress: () => void;
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  footprint: 'footsteps',
  fitness_center: 'barbell',
  weight: 'fitness',
};

export const SelectionCard: React.FC<SelectionCardProps> = ({
  title,
  description,
  iconName,
  isSelected,
  onPress,
}) => {
  const icon = iconMap[iconName] || 'fitness';

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Ionicons
            name={icon}
            size={24}
            color={isSelected ? COLORS.gold : COLORS.textSecondary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, isSelected && styles.titleSelected]}>
            {title}
          </Text>
          <Text style={[styles.description, isSelected && styles.descriptionSelected]}>
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: SPACING.l,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: COLORS.surfaceHighlight,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  titleSelected: {
    color: COLORS.text,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  descriptionSelected: {
    color: COLORS.textSecondary,
  },
});
