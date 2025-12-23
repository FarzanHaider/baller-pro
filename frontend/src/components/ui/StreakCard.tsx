import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const StreakCard: React.FC = () => (
  <View style={styles.outer}>
    <View style={styles.card}>
      <View style={styles.iconGlow}>
        <Ionicons name="flame" size={46} color={colors.accent} style={styles.animatedPulse}/>
      </View>
      <Text style={styles.streakText}>42</Text>
      <Text style={styles.dayStreak}>Day Streak</Text>
      <Text style={styles.desc}>90% completion this week</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outer: {
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconGlow: {
    marginBottom: spacing.md,
  },
  animatedPulse: {
    // consider animation lib if animating
  },
  streakText: {
    color: colors.accent,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  dayStreak: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  desc: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 2,
  },
});

export default StreakCard;
