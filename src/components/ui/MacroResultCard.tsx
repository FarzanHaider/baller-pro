import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';

interface MacroResultCardProps {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  bmr: number;
}

export default function MacroResultCard({ calories, carbs, protein, fats, bmr }: MacroResultCardProps) {
  const radius = 54;
  const strokeWidth = 12;
  const center = 60;
  const circumference = 2 * Math.PI * radius;

  // Mock calculation for circle segments
  const proteinStroke = circumference * 0.4;
  const carbsStroke = circumference * 0.35;
  const fatsStroke = circumference * 0.25;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Your Daily Goals</Text>
      <Text style={styles.subtitle}>Based on your details for weight maintenance.</Text>
      <View style={styles.contentRow}>
        {/* Donut Chart */}
        <View style={styles.chartContainer}>
          <Svg width={120} height={120} viewBox="0 0 120 120">
            <G rotation="-90" origin="60, 60">
              {/* Background Circle */}
              <Circle cx={center} cy={center} r={radius} stroke="#333" strokeWidth={strokeWidth} fill="none" />
              {/* Carbs (Blue) */}
              <Circle 
                cx={center} cy={center} r={radius} 
                stroke={COLORS.blue} strokeWidth={strokeWidth} 
                strokeDasharray={`${carbsStroke} ${circumference}`} 
                fill="none" 
              />
              {/* Protein (Red) - Rotated by carbs offset */}
              <Circle 
                cx={center} cy={center} r={radius} 
                stroke={COLORS.primary} strokeWidth={strokeWidth} 
                strokeDasharray={`${proteinStroke} ${circumference}`} 
                strokeDashoffset={-carbsStroke}
                fill="none" 
              />
              {/* Fats (Gold) - Rotated by carbs + protein offset */}
              <Circle 
                cx={center} cy={center} r={radius} 
                stroke={COLORS.accent} strokeWidth={strokeWidth} 
                strokeDasharray={`${fatsStroke} ${circumference}`} 
                strokeDashoffset={-(carbsStroke + proteinStroke)}
                fill="none" 
              />
            </G>
          </Svg>
          <View style={styles.chartTextContainer}>
            <Text style={styles.chartNumber}>{calories.toLocaleString()}</Text>
            <Text style={styles.chartLabel}>Calories</Text>
          </View>
        </View>
        {/* Legend */}
        <View style={styles.legendContainer}>
          <LegendItem color={COLORS.blue} label="Carbs" value={`${carbs}g`} />
          <LegendItem color={COLORS.primary} label="Protein" value={`${protein}g`} />
          <LegendItem color={COLORS.accent} label="Fats" value={`${fats}g`} />
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Basal Metabolic Rate (BMR)</Text>
        <Text style={styles.footerValue}>{bmr.toLocaleString()} Calories</Text>
      </View>
    </View>
  );
}

const LegendItem = ({ color, label, value }: { color: string; label: string; value: string }) => (
  <View style={styles.legendItem}>
    <View style={styles.legendLeft}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
    <Text style={styles.legendValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SPACING.l,
    marginTop: SPACING.l,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginBottom: SPACING.l,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.l,
  },
  chartContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartNumber: {
    color: COLORS.text,
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  chartLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  legendContainer: {
    flex: 1,
    gap: SPACING.s,
  },
  legendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    color: COLORS.text,
    fontFamily: FONTS.medium,
    fontSize: 15,
  },
  legendValue: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: SPACING.l,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  footerValue: {
    color: COLORS.accent,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
