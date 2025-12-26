import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface MenuButtonProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
  // Specific styling props
  iconColor?: string;
  iconBg?: string;
  disabled?: boolean;
}

export default function MenuButton({ 
  icon, 
  label, 
  onPress,
  iconColor = COLORS.primary,
  iconBg = COLORS.primaryTint,
  disabled = false
}: MenuButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.container, disabled && styles.disabled]} 
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.7}
      disabled={disabled}
    >
      <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
        <MaterialIcons name={icon} size={24} color={iconColor} />
        {disabled && (
          <View style={styles.lockIcon}>
            <MaterialIcons name="lock" size={12} color={COLORS.textSecondary} />
          </View>
        )}
      </View>
      
      <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>
      
      <MaterialIcons name="chevron-right" size={24} color={disabled ? COLORS.textSecondary : COLORS.textSecondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderRadius: SIZES.radius,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.l,
    // Glow effect
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  label: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },
  lockIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 2,
  },
});

