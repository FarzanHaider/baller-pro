// Bridge file - redirects to new unified theme
import { COLORS } from '@/constants/theme';

export const colors = {
  // Map old color names to new theme
  primary: COLORS.primary,
  secondary: COLORS.background,
  background: COLORS.background,
  surface: COLORS.surface,
  surfaceLight: COLORS.surfaceHighlight,
  inputBg: COLORS.surface,
  text: COLORS.text,
  textSecondary: COLORS.textSecondary,
  textTertiary: COLORS.textSecondary,
  accent: COLORS.gold,
  accentMuted: COLORS.surface,
  success: COLORS.primary,
  warning: COLORS.gold,
  error: COLORS.primary,
  border: COLORS.border,
  borderLight: COLORS.border,
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

