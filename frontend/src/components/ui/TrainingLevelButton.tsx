import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { SIZES } from '@/constants/theme';
import { typography } from '../../theme/typography';

interface TrainingLevelButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

export const TrainingLevelButton: React.FC<TrainingLevelButtonProps> = ({
  title,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        selected && styles.buttonSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, selected && styles.textSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: SIZES.radiusFull,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    alignItems: 'flex-start',
  },
  buttonSelected: {
    backgroundColor: `${colors.accent}33`, // 20% opacity
    borderWidth: 2,
    borderColor: colors.accent,
  },
  text: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  textSelected: {
    color: colors.text,
  },
});
