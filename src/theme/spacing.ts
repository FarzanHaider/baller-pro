// Bridge file - redirects to new unified theme
import { SPACING } from '@/constants/theme';

export const spacing = {
  xs: SPACING.xs,    // 4
  sm: SPACING.s,     // 8
  md: SPACING.m,     // 12
  lg: SPACING.l,     // 16
  xl: SPACING.xl,    // 24
  xxl: SPACING.xxl,  // 32
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

