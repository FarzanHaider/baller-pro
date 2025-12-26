import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { PlanStatus } from '@/types/plan';

interface PlanLockedOverlayProps {
  planStatus: PlanStatus;
  message: string;
  showReviewButton?: boolean;
}

export default function PlanLockedOverlay({ 
  planStatus, 
  message, 
  showReviewButton = false 
}: PlanLockedOverlayProps) {
  const router = useRouter();

  return (
    <View style={styles.overlay}>
      <View style={styles.content}>
        <MaterialIcons name="lock" size={64} color={COLORS.textSecondary} />
        <Text style={styles.message}>{message}</Text>
        
        {planStatus === 'PENDING_APPROVAL' && showReviewButton && (
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() => router.push('/(tabs)/plan_review')}
            activeOpacity={0.8}
          >
            <Text style={styles.reviewButtonText}>View Status</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    maxWidth: 300,
  },
  message: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginTop: SPACING.l,
    lineHeight: 24,
  },
  reviewButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    borderRadius: SIZES.radius,
    minWidth: 150,
    alignItems: 'center',
  },
  reviewButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

