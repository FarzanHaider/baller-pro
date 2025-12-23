import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

interface CalorieRingProps {
  consumed: number;
  target: number;
}

export default function CalorieRing({ consumed, target }: CalorieRingProps) {
  const remaining = Math.max(0, target - consumed);
  const progress = Math.min(consumed / target, 1); // Cap at 100%
  
  const size = 280;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        {/* SVG Circle Progress */}
        <Svg width={size} height={size} style={styles.svg}>
          {/* Background Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.surfaceHighlight}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress Circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={progressOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
        </Svg>

        {/* Center Content */}
        <View style={styles.centerContent}>
          <Text style={styles.caloriesNumber}>{remaining}</Text>
          <Text style={styles.caloriesLabel}>Kcal Left</Text>
        </View>
      </View>

      {/* Bottom Labels */}
      <View style={styles.labelsContainer}>
        <Text style={styles.consumedLabel}>
          Consumed: <Text style={styles.consumedValue}>{consumed}</Text>
        </Text>
        <Text style={styles.targetLabel}>
          Target: <Text style={styles.targetValue}>{target}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: SPACING.l,
  },
  ringContainer: {
    position: 'relative',
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  caloriesNumber: {
    fontSize: 72,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    lineHeight: 80,
  },
  caloriesLabel: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    marginTop: SPACING.m,
  },
  consumedLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  consumedValue: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  targetLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  targetValue: {
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
});

