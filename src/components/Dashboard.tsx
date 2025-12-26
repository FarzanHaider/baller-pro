import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from './ui/StatCard';
import { MenuItem } from './ui/MenuItem';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { Ionicons } from '@expo/vector-icons';

export const Dashboard: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={32} color={colors.textSecondary} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.dashboardTitle}>Dashboard</Text>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Pro Badge */}
          <View style={styles.badge}>
            <Ionicons name="star" size={16} color="#000000" />
            <Text style={styles.badgeText}>Pro • Active</Text>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <StatCard label="Workouts" value="128" />
          <StatCard label="Week Streak" value="12" />
          <StatCard label="Avg Score" value="95" />
        </View>

        {/* Quick Access Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="barbell"
              title="Workouts"
              onPress={() => router.push('/(tabs)/train')}
            />
            <MenuItem
              icon="document-text"
              title="Programs"
              onPress={() => {
                // TODO: Navigate to programs
                console.log('Programs pressed');
              }}
            />
            <MenuItem
              icon="trophy"
              title="Challenges"
              onPress={() => {
                // TODO: Navigate to challenges
                console.log('Challenges pressed');
              }}
            />
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="medical"
              title="Injury Protocols"
              onPress={() => {
                // TODO: Navigate to injury protocols
                console.log('Injury Protocols pressed');
              }}
            />
            <MenuItem
              icon="bag"
              title="Merch Shop"
              onPress={() => {
                // TODO: Navigate to shop
                console.log('Merch Shop pressed');
              }}
            />
          </View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuContainer}>
            <MenuItem
              icon="settings-outline"
              title="Settings"
              iconColor={colors.textSecondary}
              onPress={() => {
                // TODO: Navigate to settings
                console.log('Settings pressed');
              }}
            />
            <MenuItem
              icon="notifications-outline"
              title="Notifications"
              iconColor={colors.textSecondary}
              onPress={() => {
                // TODO: Navigate to notifications
                console.log('Notifications pressed');
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  userName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xl,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: '#000000',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuContainer: {
    backgroundColor: colors.inputBg,
    borderRadius: spacing.md,
    padding: spacing.sm,
  },
});
