import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { SIZES } from '@/constants/theme';
import { typography } from '../../theme/typography';
import { Ionicons } from '@expo/vector-icons';

interface TimerControlProps {
  initialTime?: number; // in seconds
  onTimeUp?: () => void;
}

export const TimerControl: React.FC<TimerControlProps> = ({
  initialTime = 90, // 1:30 default
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsActive(false);
            onTimeUp?.();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeUp]);

  const toggleTimer = useCallback(() => {
    if (timeLeft === 0) {
      setTimeLeft(initialTime);
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  }, [isActive, timeLeft, initialTime]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(initialTime);
  }, [initialTime]);

  return (
    <View style={styles.container}>
      <Text style={styles.timeDisplay}>{formatTime(timeLeft)}</Text>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetTimer}
          activeOpacity={0.8}
        >
          <Ionicons name="reload" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.playButton}
          onPress={toggleTimer}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isActive ? 'pause' : 'play'}
            size={28}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: SIZES.radiusLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  resetButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${colors.text}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
