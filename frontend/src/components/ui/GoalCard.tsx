import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { SIZES } from '@/constants/theme';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface GoalCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  fitness_center: 'barbell',
  local_fire_department: 'flame',
  balance: 'scale',
};

export const GoalCard: React.FC<GoalCardProps> = ({
  id,
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => {
  const iconName = iconMap[icon] || 'fitness';

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(id)}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
          <Ionicons
            name={iconName}
            size={24}
            color={isSelected ? colors.accent : colors.accent}
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
    padding: spacing.lg,
    borderRadius: SIZES.radiusLg,
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.inputBg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerSelected: {
    backgroundColor: `${colors.accent}33`,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  titleSelected: {
    color: colors.text,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  descriptionSelected: {
    color: colors.textSecondary,
  },
});