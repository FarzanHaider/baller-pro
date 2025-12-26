import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

export default function ReviewBadgeCard() {
  return (
    <View style={styles.container}>
      {/* Gold Accent Line */}
      <View style={styles.accentLine} />

      <View style={styles.content}>
        {/* Icon Box */}
        <View style={styles.iconBox}>
          <MaterialIcons name="verified-user" size={28} color={COLORS.gold} />
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Certified Coach</Text>
          <Text style={styles.subtitle}>VERIFICATION PENDING</Text>
        </View>

        {/* Lock Icon */}
        <MaterialIcons name="lock" size={24} color="rgba(255,255,255,0.2)" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  accentLine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: COLORS.gold,
    zIndex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    paddingLeft: SPACING.l + 4, // Space for accent line
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surfaceIcon,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.l,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold, // SemiBold appearance
  },
  subtitle: {
    color: 'rgba(255, 215, 0, 0.8)', // Gold with opacity
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});

