import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface AuthInputProps extends TextInputProps {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIconColor?: string;
  isPassword?: boolean;
  onRightIconPress?: () => void;
  rightLabelLink?: string; // For "FORGOT?" link
  onRightLabelPress?: () => void;
}

export default function AuthInput({
  label,
  icon,
  rightIcon,
  rightIconColor = COLORS.textSecondary,
  isPassword = false,
  onRightIconPress,
  rightLabelLink,
  onRightLabelPress,
  style,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(!isPassword);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Label Row */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {rightLabelLink && (
          <TouchableOpacity onPress={onRightLabelPress}>
            <Text style={styles.linkText}>{rightLabelLink}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Input Field */}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.inputWrapperFocused
      ]}>
        <MaterialIcons 
          name={icon} 
          size={20} 
          color={isFocused ? COLORS.primary : COLORS.textSecondary} 
          style={styles.leftIcon}
        />
        
        <TextInput
          style={styles.input}
          placeholderTextColor="rgba(255,255,255,0.5)" // Explicit placeholder color
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {/* Right Icon (Checkmark or Eye) */}
        {(rightIcon || isPassword) && (
          <TouchableOpacity 
            onPress={isPassword ? togglePasswordVisibility : onRightIconPress}
            disabled={!isPassword && !onRightIconPress}
            style={styles.rightIconBtn}
          >
            <MaterialIcons 
              name={isPassword ? (showPassword ? 'visibility' : 'visibility-off') : rightIcon} 
              size={20} 
              color={rightIconColor} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.l,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.m,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: SIZES.radiusFull,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 60,
    paddingHorizontal: SPACING.l,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
  },
  leftIcon: {
    marginRight: SPACING.m,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 16,
    height: '100%',
  },
  rightIconBtn: {
    padding: SPACING.s,
  },
});

