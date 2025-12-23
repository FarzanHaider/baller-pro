import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS, SIZES } from '../../src/constants/theme';

interface ScreenItem {
  name: string;
  route: string;
  icon: keyof typeof MaterialIcons.glyphMap | keyof typeof Ionicons.glyphMap;
  description: string;
  status?: 'ready' | 'wip' | 'pending';
}

const SCREEN_CATEGORIES = {
  'Main Tabs': [
    { name: 'Home Dashboard', route: '/', icon: 'home', description: 'Main dashboard with stats & quick access', status: 'ready' },
    { name: 'Train', route: '/(tabs)/train', icon: 'fitness-center', description: 'Workout programs & training', status: 'ready' },
    { name: 'Track', route: '/(tabs)/track', icon: 'track-changes', description: 'Journal & mood tracking', status: 'ready' },
    { name: 'Community', route: '/(tabs)/community', icon: 'people', description: 'Social feed, challenges, leaderboard', status: 'ready' },
    { name: 'More', route: '/(tabs)/more', icon: 'more-horiz', description: 'Additional options & settings', status: 'ready' },
  ],
  'Tracking & Habits': [
    { name: 'Habit Tracker', route: '/(tabs)/habit', icon: 'check-circle', description: 'Daily habits & streaks', status: 'ready' },
  ],
  'Community Features': [
    { name: 'Leaderboard', route: '/(tabs)/leaderboard', icon: 'leaderboard', description: 'Rankings & competitions', status: 'ready' },
  ],
  'Nutrition & Health': [
    { name: 'Recipe Library', route: '/(tabs)/recipes', icon: 'restaurant-menu', description: 'Browse healthy recipes', status: 'ready' },
    { name: 'Macro Calculator', route: '/(tabs)/calculator', icon: 'calculate', description: 'Calculate daily macros', status: 'ready' },
    { name: 'Rehab & Prevention', route: '/(tabs)/rehab', icon: 'healing', description: 'Injury protocols & prevention', status: 'ready' },
  ],
  'Merch & Shop': [
    { name: 'Merch Shop', route: '/(tabs)/shop', icon: 'storefront', description: 'Browse products & gear', status: 'ready' },
    { name: 'Product Details', route: '/(tabs)/product_detail', icon: 'inventory', description: 'View product info', status: 'ready' },
    { name: 'My Cart', route: '/(tabs)/cart', icon: 'shopping-cart', description: 'Shopping cart items', status: 'ready' },
    { name: 'Payment Summary', route: '/(tabs)/checkout', icon: 'payment', description: 'Checkout & payment', status: 'ready' },
    { name: 'Order History', route: '/(tabs)/order_history', icon: 'receipt-long', description: 'Past orders & tracking', status: 'ready' },
  ],
  'Account & Settings': [
    { name: 'Settings', route: '/(tabs)/settings', icon: 'settings', description: 'App preferences & account', status: 'ready' },
    { name: 'Notifications', route: '/(tabs)/notifications', icon: 'notifications', description: 'Notification inbox', status: 'ready' },
    { name: 'Wearables & Integrations', route: '/(tabs)/wearables', icon: 'watch', description: 'Connect fitness apps', status: 'ready' },
    { name: 'Subscription', route: '/(tabs)/subscription', icon: 'star', description: 'Subscription plans', status: 'ready' },
    { name: 'Referral Center', route: '/(tabs)/referral', icon: 'card-giftcard', description: 'Invite friends & earn', status: 'ready' },
  ],
  'Auth & Onboarding': [
    { name: 'Login', route: '/auth/login', icon: 'login', description: 'User login screen', status: 'ready' },
    { name: 'Register', route: '/auth/register', icon: 'person-add', description: 'Sign up screen', status: 'ready' },
    { name: '1. About (Gender)', route: '/onboarding/about', icon: 'looks-one', description: 'Gender selection', status: 'ready' },
    { name: '2. Journey (Goals)', route: '/onboarding/journey', icon: 'looks-two', description: 'Define goals & experience', status: 'ready' },
    { name: '3. Training Experience', route: '/onboarding/trainingExperience', icon: 'looks-3', description: 'Training level', status: 'ready' },
    { name: '4. Injuries', route: '/onboarding/injuries', icon: 'looks-4', description: 'Injury tracking', status: 'ready' },
    { name: '5. Main Goal', route: '/onboarding/mainGoal', icon: 'looks-5', description: 'Final goal selection', status: 'ready' },
  ],
};

export default function DebugScreen() {
  const router = useRouter();

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ready':
        return COLORS.success;
      case 'wip':
        return COLORS.info;
      case 'pending':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'ready':
        return 'Ready';
      case 'wip':
        return 'WIP';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const handlePress = (route: string) => {
    try {
      // For tabs routes, use replace to avoid navigation stack issues
      // For routes outside tabs, use push
      if (route.startsWith('/(tabs)/')) {
        router.replace(route as any);
      } else {
        router.push(route as any);
      }
    } catch (error) {
      console.error(`Failed to navigate to ${route}:`, error);
    }
  };

  const totalScreens = Object.values(SCREEN_CATEGORIES).reduce(
    (sum, category) => sum + category.length,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <MaterialIcons name="bug-report" size={32} color={COLORS.primary} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Screen Testing Hub</Text>
            <Text style={styles.subtitle}>{totalScreens} screens available</Text>
          </View>
        </View>
        
        <View style={styles.statusLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
            <Text style={styles.legendText}>Ready</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.info }]} />
            <Text style={styles.legendText}>WIP</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.statusDot, { backgroundColor: COLORS.textSecondary }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.entries(SCREEN_CATEGORIES).map(([category, screens]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{screens.length}</Text>
              </View>
            </View>

            {screens.map((screen) => (
              <TouchableOpacity
                key={screen.route}
                style={styles.screenCard}
                onPress={() => handlePress(screen.route)}
                activeOpacity={0.7}
              >
                <View style={styles.screenIconContainer}>
                  <MaterialIcons
                    name={screen.icon as any}
                    size={24}
                    color={COLORS.primary}
                  />
                </View>

                <View style={styles.screenInfo}>
                  <View style={styles.screenTitleRow}>
                    <Text style={styles.screenName}>{screen.name}</Text>
                    {screen.status && (
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: `${getStatusColor(screen.status)}20` },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: getStatusColor(screen.status) },
                          ]}
                        >
                          {getStatusLabel(screen.status)}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.screenDescription} numberOfLines={1}>
                    {screen.description}
                  </Text>
                  <Text style={styles.screenRoute} numberOfLines={1}>
                    {screen.route}
                  </Text>
                </View>

                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={COLORS.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <MaterialIcons name="info-outline" size={20} color={COLORS.info} />
          <Text style={styles.infoText}>
            Tap any screen to test it visually. Use device back button to return.
          </Text>
        </View>

        <View style={{ height: 80 }} />
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
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.m,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  statusLegend: {
    flexDirection: 'row',
    gap: SPACING.m,
    paddingTop: SPACING.s,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.l,
  },
  categorySection: {
    marginBottom: SPACING.xl,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  screenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginBottom: SPACING.s,
    gap: SPACING.m,
  },
  screenIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenInfo: {
    flex: 1,
  },
  screenTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: 4,
  },
  screenName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
  },
  screenDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  screenRoute: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    opacity: 0.6,
  },
  infoFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.m,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    borderRadius: SIZES.radius,
    marginTop: SPACING.l,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
    lineHeight: 18,
  },
});

