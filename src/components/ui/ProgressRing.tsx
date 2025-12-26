import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ProgressRingProps {
  radius?: number;
  stroke?: number;
  progress: number; // 0-100
  target: number;
  consumed: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  radius = 140,
  stroke = 16,
  progress,
  target,
  consumed,
}) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const size = (radius + stroke) * 2;
  const center = radius + stroke;

  const remaining = Math.max(0, target - consumed);

  return (
    <View style={styles.container}>
      <View style={[styles.ringContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.inputBg}
            strokeWidth={stroke}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={colors.primary}
            strokeWidth={stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        </Svg>
        <View style={styles.centerContent}>
          <Text style={styles.remainingText}>{remaining}</Text>
          <Text style={styles.remainingLabel}>Kcal Left</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.statText}>Consumed: {consumed}</Text>
        <Text style={styles.statText}>Target: {target}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  ringContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    lineHeight: 40,
  },
  remainingLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  statText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
});
