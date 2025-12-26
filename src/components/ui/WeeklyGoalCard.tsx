import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

export default function WeeklyGoalCard() {
  const progress = 0.6; // 60%

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>WEEKLY GOAL</Text>
          <Text style={styles.value}>3/5 Workouts Complete</Text>
        </View>
        
        <View style={styles.streakBadge}>
          <MaterialIcons name="local-fire-department" size={16} color={COLORS.goldAmber} />
          <Text style={styles.streakText}>12 Day Streak</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardDark,
    borderRadius: SIZES.radiusLgPlan,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SPACING.m,
  },
  label: {
    color: COLORS.textSecondaryZinc,
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
    marginBottom: 4,
  },
  value: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.1)', // Gold tint
    paddingHorizontal: SPACING.s,
    paddingVertical: 4,
    borderRadius: SIZES.radiusPlan,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    marginRight: SPACING.s,
  },
  streakText: {
    color: COLORS.goldAmber,
    fontSize: 12,
    fontFamily: FONTS.bold,
    marginLeft: 4,
  },
  track: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: SIZES.radiusFull,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusFull,
  },
});

