import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS, FONTS } from '@/constants/theme';

interface CircularProgressProps {
  value: number;
  label: string;
  color?: string;
}

export default function CircularProgress({ value, label, color = COLORS.primary }: CircularProgressProps) {
  const size = 160;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Mock calculation: assuming goal is 20k for demo visualization matching screenshot ~75%
  const progress = 0.75; 
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <View style={styles.container}>
      <View style={{ width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
        <Svg width={size} height={size}>
          {/* Track */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.progressTrack}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Indicator */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.value}>{value.toLocaleString()}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  value: {
    color: COLORS.text,
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});

