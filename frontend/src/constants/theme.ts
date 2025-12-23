import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  primary: "#EF4343",        // Brand Red
  primaryHover: "#D32F2F",   // Darker red for hover states
  background: "#121212",     // Dark Background
  modalBg: "#000000",        // Pure Black for Modal
  inputBg: "#1C1C1E",        // Dark Grey for Inputs
  surface: "rgba(255, 255, 255, 0.05)", // Glassy for settings list
  surfaceHighlight: "rgba(255, 255, 255, 0.1)",
  text: "#F5F5F7",           // Primary White
  textSecondary: "#A1A1AA",  // Zinc-400
  error: "#FF453A",          // Error Red
  accent: "#FFD700",         // Gold for order numbers
  success: "#22C55E",        // Delivered
  info: "#3B82F6",           // Shipped
  processing: "#EF4343",     // Processing red
  border: "rgba(255,255,255,0.1)",
  shadowRed: "rgba(255, 59, 48, 0.3)",
  // Gradient Colors
  goldStart: "#EAB308",      // Yellow-500
  goldEnd: "#FCD34D",        // Amber-300
  // Brand Colors
  brandYellow: "#F9F506",    // Icon Accent Yellow
  appleHealth: "#FF3B30",
  garmin: "#0EA5E9",         // Sky Blue
  googleFit: "#3B82F6",      // Blue
  whoop: "#EAB308",          // Yellow
  strava: "#EA580C",         // Orange
  gold: "#FFD700",           // Gold accent for mood chips or rewards
  white: "#FFFFFF",          // Added for Merch Shop badges and highlights
  blue: "#3B82F6",
  black: "#000000",
  danger: "#EF4444",         // Red for delete actions
  disabled: "rgba(255, 255, 255, 0.2)",
  accentGold: "#FFD700",     // Gold for notification icons
  primaryTint: "rgba(239, 67, 67, 0.2)", // Red bg for icons
  primaryTintStrong: "rgba(239, 67, 67, 0.3)", // Icon bg
  whiteTint: "rgba(255, 255, 255, 0.1)",
  goldTint: "rgba(255, 215, 0, 0.2)",
  // Progress/Charts
  progressTrack: "rgba(239, 67, 67, 0.1)", // Faint red
  // Leaderboard Ranks
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  // Card Background
  card: "#1C1C1E",
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 12, // Standard medium spacing
  l: 16,
  xl: 24,
  xxl: 32, // Extra extra large spacing
};

export const FONTS = {
  regular: "Lexend-Regular",
  medium: "Lexend-Medium",
  bold: "Lexend-Bold",
};

export const SIZES = {
  radius: 12,
  radiusLg: 24,
  radiusSm: 8,
  radiusXl: 40, // For modal top corners
  radiusFull: 9999,
  iconSize: 24,
  containerMaxWidth: 500, // Max width for tablet view card
};

export const LAYOUT = {
  window: { width, height },
  radius: {
    s: 8,
    m: 16,
    l: 24,
    full: 9999,
  },
};
