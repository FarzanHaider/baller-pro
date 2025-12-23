import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { LeaderboardUser } from '@/types/leaderboard';
import { LeaderboardTabs } from '@/components/ui/LeaderboardTabs';
import { LeaderboardRow } from '@/components/ui/LeaderboardRow';
import { CurrentUserCard } from '@/components/ui/CurrentUserCard';

// Mock Data based on HTML content
const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: '1', rank: 1, name: 'Mike Vance', reps: 2402, avatarUrl: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', rank: 2, name: 'Samantha Bee', reps: 2388, avatarUrl: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', rank: 3, name: 'David Chen', reps: 2350, avatarUrl: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', rank: 4, name: 'Jessica Jones', reps: 2315, avatarUrl: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', rank: 5, name: 'Chris Evans', reps: 2298, avatarUrl: 'https://i.pravatar.cc/150?u=5' },
  { id: '6', rank: 6, name: 'Laura Croft', reps: 2250, avatarUrl: 'https://i.pravatar.cc/150?u=6' },
  { id: '7', rank: 7, name: 'Ben Parker', reps: 2241, avatarUrl: 'https://i.pravatar.cc/150?u=7' },
];

const CURRENT_USER: LeaderboardUser = {
  id: 'me',
  rank: 28,
  name: 'You',
  reps: 1988,
  avatarUrl: 'https://i.pravatar.cc/150?u=8',
  isCurrentUser: true
};

export default function LeaderboardScreen() {
  const [activeTab, setActiveTab] = useState<'Global' | 'Program'>('Global');
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + SPACING.xs }]}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="chevron-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Leaderboard</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        {/* Tabs */}
        <LeaderboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {/* List */}
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: SPACING.xs },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {MOCK_LEADERBOARD.map((user) => (
            <LeaderboardRow key={user.id} user={user} />
          ))}
          {/* Spacer for sticky footer */}
          <View style={{ height: 100 }} />
        </ScrollView>
        {/* Sticky Footer */}
        <CurrentUserCard user={CURRENT_USER} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.xl,
  },
});
