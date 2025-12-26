import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

export type MoodType = 'Great' | 'Good' | 'Meh' | 'Tired' | 'Stressed';

interface MoodChipProps {
  mood: MoodType;
  icon: keyof typeof MaterialIcons.glyphMap;
  isSelected: boolean;
  onSelect: (mood: MoodType) => void;
}

export const MoodChip: React.FC<MoodChipProps> = ({ mood, icon, isSelected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(mood)}
      style={[
        styles.container,
        isSelected ? styles.selectedContainer : styles.unselectedContainer,
      ]}
      activeOpacity={0.7}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={isSelected ? '#000000' : 'rgba(255, 255, 255, 0.7)'}
      />
      <Text
        style={[
          styles.text,
          { color: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.7)' },
        ]}
      >
        {mood}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: SPACING.s,
    height: 40,
    justifyContent: 'center',
  },
  selectedContainer: {
    backgroundColor: COLORS.gold, // Golden/yellow background when selected
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  unselectedContainer: {
    backgroundColor: '#2C2C2E', // Solid dark background
    borderWidth: 0,
  },
  text: {
    fontFamily: FONTS.medium,
    fontSize: 15,
    marginLeft: SPACING.s,
    lineHeight: 20,
  },
});
