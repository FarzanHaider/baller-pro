import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { WeeklySummary } from '@/types/community';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export default function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const isPositiveTrend = summary.trendPercentage >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Weekly Summary</Text>
      
      <View style={styles.grid}>
        {/* This Week */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>This Week</Text>
          <Text style={styles.cardValue}>#{summary.weekNumber}</Text>
        </View>

        {/* Workouts */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Workouts</Text>
          <Text style={styles.cardValue}>{summary.workoutsCompleted}</Text>
        </View>

        {/* Avg Score */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Avg Score</Text>
          <Text style={styles.cardValue}>{summary.avgScore}</Text>
        </View>

        {/* Trend */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Trend</Text>
          <View style={styles.trendContainer}>
            <MaterialIcons 
              name={isPositiveTrend ? "trending-up" : "trending-down"} 
              size={20} 
              color={isPositiveTrend ? COLORS.success : COLORS.error} 
            />
            <Text style={[
              styles.trendValue, 
              { color: isPositiveTrend ? COLORS.success : COLORS.error }
            ]}>
              {isPositiveTrend ? '+' : ''}{summary.trendPercentage}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    marginBottom: SPACING.l,
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.m,
  },
  card: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: SPACING.m,
  },
  cardLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.s,
  },
  cardValue: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  trendValue: {
    fontSize: 28,
    fontFamily: FONTS.bold,
  },
});

