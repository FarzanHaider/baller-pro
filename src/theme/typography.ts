// Bridge file - redirects to new unified theme
import { FONTS } from '@/constants/theme';

export const typography = {
  fontFamily: {
    regular: FONTS.regular,
    medium: FONTS.medium,
    bold: FONTS.bold,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

