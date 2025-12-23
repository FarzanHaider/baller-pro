// Debug Tester Screen - Manual navigation to all screens
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface TestRoute {
  title: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  category: string;
}

const TEST_ROUTES: TestRoute[] = [
  // Auth Screens
  { title: 'Login', route: '/auth/login', icon: 'login', category: 'Auth' },
  { title: 'Register', route: '/auth/register', icon: 'person-add', category: 'Auth' },
  
  // Onboarding (Updated - 5 Steps)
  { title: '1. About (Gender)', route: '/onboarding/about', icon: 'looks-one', category: 'Onboarding' },
  { title: '2. Journey (Goals)', route: '/onboarding/journey', icon: 'looks-two', category: 'Onboarding' },
  { title: '3. Training Experience', route: '/onboarding/trainingExperience', icon: 'looks-3', category: 'Onboarding' },
  { title: '4. Injuries', route: '/onboarding/injuries', icon: 'looks-4', category: 'Onboarding' },
  { title: '5. Main Goal', route: '/onboarding/mainGoal', icon: 'looks-5', category: 'Onboarding' },
  
  // Main Tabs
  { title: 'Habit Tracker', route: '/(tabs)/habit', icon: 'check-circle', category: 'Main' },
  { title: 'Train', route: '/(tabs)/train', icon: 'fitness-center', category: 'Main' },
  { title: 'Track/Journal', route: '/(tabs)/track', icon: 'track-changes', category: 'Main' },
  { title: 'Community', route: '/(tabs)/community', icon: 'people', category: 'Main' },
  
  // Features
  { title: 'Leaderboard', route: '/(tabs)/leaderboard', icon: 'leaderboard', category: 'Features' },
  { title: 'Injury Rehab', route: '/(tabs)/rehab', icon: 'healing', category: 'Features' },
  { title: 'Recipe Library', route: '/(tabs)/recipes', icon: 'restaurant', category: 'Features' },
  { title: 'Macro Calculator', route: '/(tabs)/calculator', icon: 'calculate', category: 'Features' },
  
  // Settings & More
  { title: 'Subscription', route: '/(tabs)/subscription', icon: 'star', category: 'Settings' },
  { title: 'Referral Center', route: '/(tabs)/referral', icon: 'card-giftcard', category: 'Settings' },
  { title: 'Wearables', route: '/(tabs)/wearables', icon: 'watch', category: 'Settings' },
  { title: 'Merch Shop', route: '/(tabs)/shop', icon: 'shopping-bag', category: 'Settings' },
  { title: 'My Cart', route: '/(tabs)/cart', icon: 'shopping-cart', category: 'Settings' },
  { title: 'Order History', route: '/(tabs)/order_history', icon: 'history', category: 'Settings' },
  { title: 'Notifications', route: '/(tabs)/notifications', icon: 'notifications', category: 'Settings' },
  { title: 'Settings', route: '/(tabs)/settings', icon: 'settings', category: 'Settings' },
];

export default function DebugTesterScreen() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    console.log('[DebugTester] Navigating to:', route);
    // For tabs routes, use replace to avoid navigation stack issues
    // For routes outside tabs, use push
    if (route.startsWith('/(tabs)/')) {
      router.replace(route as any);
    } else {
      router.push(route as any);
    }
  };

  const groupedRoutes = TEST_ROUTES.reduce((acc, route) => {
    if (!acc[route.category]) {
      acc[route.category] = [];
    }
    acc[route.category].push(route);
    return acc;
  }, {} as Record<string, TestRoute[]>);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="bug-report" size={32} color={COLORS.primary} />
        <Text style={styles.headerTitle}>Debug Tester</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          Tap any screen below to navigate directly. Use this to test individual screens without going through the full flow.
        </Text>

        {Object.entries(groupedRoutes).map(([category, routes]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            {routes.map((route) => (
              <TouchableOpacity
                key={route.route}
                style={styles.routeButton}
                onPress={() => navigateTo(route.route)}
                activeOpacity={0.7}
              >
                <View style={styles.routeIconContainer}>
                  <MaterialIcons name={route.icon} size={24} color={COLORS.primary} />
                </View>
                <View style={styles.routeTextContainer}>
                  <Text style={styles.routeTitle}>{route.title}</Text>
                  <Text style={styles.routePath}>{route.route}</Text>
                </View>
                <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🐛 Debug Mode • {TEST_ROUTES.length} screens available
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.m,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: SPACING.xl * 2,
  },
  description: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.l,
    lineHeight: 20,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.m,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: 12,
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeTitle: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 2,
  },
  routePath: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.l,
  },
  footerText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});

