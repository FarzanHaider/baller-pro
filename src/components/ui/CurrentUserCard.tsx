import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { LeaderboardUser } from '@/types/leaderboard';

interface CurrentUserCardProps {
  user: LeaderboardUser;
}

export const CurrentUserCard: React.FC<CurrentUserCardProps> = ({ user }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Rank */}
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{user.rank}</Text>
        </View>
        {/* Avatar */}
        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} resizeMode="cover" />
        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>You</Text>
          <Text style={styles.repsText}>{user.reps.toLocaleString()} Reps</Text>
        </View>
        {/* Badge */}
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Top 5%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.m,
    paddingBottom: SPACING.xl, // Extra padding for safe area
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 67, 67, 0.2)',
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 16,
    padding: SPACING.m,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.s,
  },
  rankText: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: SPACING.m,
    backgroundColor: '#333',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: 2,
  },
  repsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.text,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
});
