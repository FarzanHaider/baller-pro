import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps {
  provider: 'apple' | 'google';
  onPress: () => void;
  variant?: 'signin' | 'signup';
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  onPress,
  variant = 'signin',
}) => {
  const isApple = provider === 'apple';
  const isSignUp = variant === 'signup';
  const actionText = isSignUp ? 'Sign up' : 'Sign in';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        !isApple && isSignUp && styles.googleButtonDark,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        {isApple ? (
          <Ionicons name="logo-apple" size={24} color="#000000" />
        ) : (
          <Ionicons
            name="logo-google"
            size={24}
            color={isSignUp ? colors.text : '#000000'}
          />
        )}
        <Text
          style={[
            styles.text,
            !isApple && isSignUp && styles.textWhite,
          ]}
        >
          {actionText} with {isApple ? 'Apple' : 'Google'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonDark: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  text: {
    color: '#000000',
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  textWhite: {
    color: colors.text,
  },
});
