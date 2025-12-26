import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface SettingsRowProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  iconColor?: string;
  isLast?: boolean;
  onPress: () => void;
}

export default function SettingsRow({ 
  icon,
  label,
  iconColor = COLORS.text,
  isLast = false,
  onPress
}: SettingsRowProps) {
  return (
    <View>
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={0.7}
        onPress={onPress}
      >
        <View style={styles.leftContent}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={icon} size={24} color={iconColor} />
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.chevronContainer}>
          <MaterialIcons name="chevron-right" size={24} color="rgba(245, 245, 245, 0.6)" />
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.separator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.l,
    minHeight: 56,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.l,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  chevronContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: SPACING.l + 40 + SPACING.l,
    marginRight: SPACING.l,
  },
});
