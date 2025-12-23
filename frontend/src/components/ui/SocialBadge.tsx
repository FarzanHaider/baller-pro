import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, SPACING } from '@/constants/theme';

export default function SocialBadge() {
  return (
    <View style={styles.container}>
      {/* App Logo Placeholder */}
      <View style={styles.box}>
        <MaterialIcons name="fitness-center" size={32} color={COLORS.brandYellow} />
      </View>

      {/* Sync Icon */}
      <MaterialIcons name="sync-alt" size={32} color={COLORS.textSecondary} />

      {/* Google Logo Box */}
      <View style={[styles.box, styles.googleBox]}>
        <Image 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrm5doq0FSakBpOKu-3jhCTFqCiBbJn7NDT9BKZRJHwWEUU-T2koNQG_J7MRreya35ctVdmVrUvAEpJhL85LMSZ7qaQRTj3EY3LJ95om4bXB4u-WB9nhDvXw_QwWssVM1j07Zg4xMU2FN8rk6txyS_7grQrQL0G9TrSg0Y4tWyoxAiZzMcGHIWZiZkp4_l8_dcNoqkOvl-39OFIxMT2Ocry0XtFnw3-vFG-HGrpY98NCdAQV-mM5WNKTlZHH-tzEbLd_L1Xq3Ww6FD' }} 
          style={styles.logoImage} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xl,
    paddingVertical: SPACING.l,
    marginBottom: SPACING.m,
  },
  box: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#18181B', // Darker gray specific to icon bg
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  googleBox: {
    backgroundColor: COLORS.white, // Google logo usually on white
    padding: SPACING.s,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
});

