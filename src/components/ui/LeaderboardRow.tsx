import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { LeaderboardUser } from '@/types/leaderboard';

interface LeaderboardRowProps {
  user: LeaderboardUser;
}

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ user }) => {
  const isTopThree = user.rank <= 3;
  // Determine trophy color
  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 1: return COLORS.gold;
      case 2: return COLORS.silver;
      case 3: return COLORS.bronze;
      default: return 'transparent';
    }
  };
  return (
    <View style={[styles.container, isTopThree ? styles.cardBackground : styles.transparentBackground]}>
      {/* Rank Number */}
      <View style={styles.rankContainer}>
        <Text style={[styles.rankText, !isTopThree && styles.rankTextDim]}>{user.rank}</Text>
      </View>
      {/* Avatar */}
      <Image source={{ uri: user.avatarUrl }} style={styles.avatar} resizeMode="cover" />
      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.nameText} numberOfLines={1}>{user.name}</Text>
        <Text style={styles.repsText}>{user.reps.toLocaleString()} Reps</Text>
      </View>
      {/* Trophy Icon (Only for Top 3) */}
      {isTopThree && (
        <View style={styles.trophyContainer}>
          <Ionicons name="trophy" size={24} color={getTrophyColor(user.rank)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    marginBottom: SPACING.s,
    borderRadius: 16,
  },
  cardBackground: {
    backgroundColor: COLORS.card,
  },
  transparentBackground: {
    backgroundColor: 'transparent',
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
  rankTextDim: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontFamily: FONTS.medium,
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
  trophyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
