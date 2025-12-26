import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import { LeaderboardUser } from '@/types/community';

interface LeaderboardRowProps {
  user: LeaderboardUser;
}

export default function ChallengesLeaderboardRow({ user }: LeaderboardRowProps) {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return COLORS.gold;
      case 2: return COLORS.silver;
      case 3: return COLORS.bronze;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <View style={[styles.container, user.isCurrentUser && styles.currentUserContainer]}>
      <View style={styles.rankContainer}>
        <Text style={[styles.rank, { color: getRankColor(user.rank) }]}>{user.rank}</Text>
        {user.rank === 1 && (
          <MaterialIcons 
            name="workspace-premium" 
            size={14} 
            color={COLORS.gold} 
            style={styles.crownIcon} 
          />
        )}
      </View>

      <Image source={{ uri: user.avatar }} style={styles.avatar} />

      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.steps}>{user.steps.toLocaleString()} steps</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
  },
  currentUserContainer: {
    backgroundColor: 'rgba(239, 67, 67, 0.1)', // Primary tint
    paddingHorizontal: SPACING.m,
    marginHorizontal: -SPACING.m, // Extend to edges of parent padding
    borderRadius: SIZES.radius,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: SPACING.s,
  },
  rank: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  crownIcon: {
    position: 'absolute',
    top: -6,
    right: -4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.m,
  },
  info: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  steps: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
});

