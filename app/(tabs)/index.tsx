import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar,
  useWindowDimensions,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { usePlan } from '../../src/contexts/PlanContext';
import { COLORS, FONTS, SIZES, SPACING } from '@/constants/theme';
import StatCard from '@/components/ui/StatCard';
import MenuButton from '@/components/ui/MenuButton';
import MenuGroup from '@/components/ui/MenuGroup';

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';
  const router = useRouter();
  
  // Get data from both Contexts
  const { user, logout, refreshUser } = useAuth();
  const { planStatus, planVersion, refreshPlanStatus } = usePlan();
  
  const [lastSeenVersion, setLastSeenVersion] = useState<number | undefined>(planVersion);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 1. REDIRECT LOGIC: If the backend is still generating, send them back to the loader
  useEffect(() => {
    // Check planStatus from either context (user doc or plan state)
    if (user?.planStatus === 'GENERATING' || planStatus === 'GENERATING') {
      router.replace('/(tabs)/generating_plan');
    }
  }, [user?.planStatus, planStatus]);

  // Detect plan version changes
  useEffect(() => {
    if (planVersion && planVersion !== lastSeenVersion && planStatus === 'ACTIVE') {
      setShowUpdateBanner(true);
      const timer = setTimeout(() => {
        setShowUpdateBanner(false);
        setLastSeenVersion(planVersion);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [planVersion, planStatus, lastSeenVersion]);

  const handlePress = (item: string, route?: string) => {
    // Disable navigation to training/tracking if plan is not active
    const isPlanReady = planStatus === 'ACTIVE';
    const isRestrictedRoute = route?.includes('train') || route?.includes('track') || route?.includes('plan');

    if (!isPlanReady && isRestrictedRoute) {
      console.log('Action blocked: Plan not active');
      return;
    }

    if (route) {
      router.push(route as any);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh both user doc and plan data
    await Promise.all([
      refreshUser(),
      refreshPlanStatus()
    ]);
    setRefreshing(false);
  };

  // Determine if features should be grayed out
  const isPlanLocked = planStatus !== 'ACTIVE';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { alignItems: 'center' }]} 
        showsVerticalScrollIndicator={false}
        bounces={true}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
      >
        <View style={{ width: contentWidth, paddingHorizontal: SPACING.l }}>
          
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }} 
                style={styles.avatar} 
              />
            </View>
            <Text style={styles.screenTitle}>Dashboard</Text>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => handlePress('Notifications', '/(tabs)/notifications')}
            >
              <MaterialIcons name="notifications" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* User Headline */}
          <View style={styles.profileSection}>
            <Text style={styles.userName}>{user?.name || user?.email?.split('@')[0] || 'Athlete'}</Text>
            
            <LinearGradient
              colors={user?.isPremium ? [COLORS.goldStart, COLORS.goldEnd] : [COLORS.surface, COLORS.surface]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.proChip}
            >
              <MaterialIcons 
                name={user?.isPremium ? "star" : "person"} 
                size={18} 
                color={user?.isPremium ? COLORS.black : COLORS.textSecondary} 
              />
              <Text style={[styles.proText, { color: user?.isPremium ? COLORS.black : COLORS.textSecondary }]}>
                {user?.isPremium ? 'Pro • Active' : 'Free Member'}
              </Text>
            </LinearGradient>
          </View>

          {/* Plan Status Banners */}
          {(planStatus as string) === 'INACTIVE' || planStatus === 'NO_PLAN' ? (
            <TouchableOpacity 
              style={styles.banner}
              onPress={() => router.push('/onboarding/step1')}
            >
              <MaterialIcons name="bolt" size={20} color={COLORS.primary} />
              <Text style={styles.bannerText}>
                Setup your AI Training Plan to unlock all features.
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ) : null}

          {planStatus === 'PENDING_APPROVAL' && (
            <View style={styles.banner}>
              <MaterialIcons name="hourglass-top" size={20} color={COLORS.gold} />
              <Text style={styles.bannerText}>
                Coach review in progress. We'll notify you soon.
              </Text>
            </View>
          )}

          {showUpdateBanner && (
            <View style={[styles.banner, styles.updateBanner]}>
              <MaterialIcons name="update" size={20} color={COLORS.primary} />
              <Text style={styles.bannerText}>
                Plan updated! Check your new schedule.
              </Text>
            </View>
          )}

          {/* Weekly Summary Card (Visible only when ACTIVE) */}
          {planStatus === 'ACTIVE' ? (
            <View style={styles.weeklySummaryCard}>
              <Text style={styles.weeklySummaryTitle}>Weekly Progress</Text>
              <View style={styles.weeklySummaryStats}>
                <StatCard label="Workouts" value="0/5" />
                <StatCard label="Streak" value="0" />
              </View>
              <TouchableOpacity
                style={styles.viewPlanButton}
                onPress={() => router.push('/(tabs)/plan')}
              >
                <Text style={styles.viewPlanButtonText}>Open Weekly Plan</Text>
                <MaterialIcons name="arrow-forward" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.weeklySummaryCard, { opacity: 0.6 }]}>
              <Text style={styles.weeklySummaryTitle}>Weekly Plan</Text>
              <Text style={[styles.bannerText, { marginBottom: SPACING.m }]}>
                Generate your plan to see your schedule here.
              </Text>
              <View style={styles.viewPlanButton}>
                <MaterialIcons name="lock" size={18} color={COLORS.white} />
                <Text style={styles.viewPlanButtonText}> Plan Locked</Text>
              </View>
            </View>
          )}

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <StatCard label="Total Workouts" value="--" />
            <StatCard label="Week Streak" value="0" />
            <StatCard label="Avg Score" value="--" />
          </View>

          {/* Navigation Groups */}
          <MenuGroup title="Quick Access">
            <MenuButton 
              icon="fitness-center" 
              label="Workouts" 
              onPress={() => handlePress('Workouts', '/(tabs)/train')}
              iconColor={isPlanLocked ? COLORS.textSecondary : undefined}
              disabled={isPlanLocked}
            />
            <MenuButton 
              icon="assignment" 
              label="Programs" 
              onPress={() => handlePress('Programs')}
              iconColor={isPlanLocked ? COLORS.textSecondary : undefined}
              disabled={isPlanLocked}
            />
            <MenuButton 
              icon="emoji-events" 
              label="Challenges" 
              onPress={() => handlePress('Challenges', '/(tabs)/community')} 
            />
          </MenuGroup>

          <MenuGroup title="Features">
            <MenuButton 
              icon="healing" 
              label="Injury Protocols" 
              onPress={() => handlePress('Injury Protocols', '/(tabs)/rehab')} 
            />
            <MenuButton 
              icon="shopping-bag" 
              label="Merch Shop" 
              onPress={() => handlePress('Merch Shop', '/(tabs)/shop')} 
            />
          </MenuGroup>

          <MenuGroup title="Account">
            <MenuButton 
              icon="settings" 
              label="Settings" 
              onPress={() => handlePress('Settings', '/(tabs)/settings')} 
            />
            <View style={styles.divider} />
            <MenuButton 
              icon="logout" 
              label="Logout" 
              iconColor={COLORS.error}
              iconBg="rgba(239, 68, 68, 0.1)"
              onPress={logout} 
            />
          </MenuGroup>
          
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: SPACING.xl, paddingBottom: SPACING.xxl },
  headerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl, paddingVertical: SPACING.m },
  avatarContainer: { width: 48, height: 48, borderRadius: SIZES.radiusFull, overflow: 'hidden', backgroundColor: COLORS.surface },
  avatar: { width: '100%', height: '100%' },
  screenTitle: { color: COLORS.text, fontSize: 18, fontFamily: FONTS.bold },
  notificationButton: { width: 48, height: 48, justifyContent: 'center', alignItems: 'flex-end' },
  profileSection: { marginBottom: SPACING.xxl, paddingHorizontal: SPACING.xs },
  userName: { color: COLORS.text, fontSize: 32, fontFamily: FONTS.bold, marginBottom: SPACING.s },
  proChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: SPACING.l, borderRadius: SIZES.radiusFull, gap: SPACING.xs },
  proText: { fontSize: 14, fontFamily: FONTS.medium },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: SPACING.xxl, gap: SPACING.s },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: SPACING.m },
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: SPACING.m, marginBottom: SPACING.l, width: '100%', gap: SPACING.s, borderWidth: 1, borderColor: COLORS.border },
  bannerText: { flex: 1, color: COLORS.text, fontSize: 14, fontFamily: FONTS.medium, lineHeight: 20 },
  updateBanner: { backgroundColor: COLORS.primaryTint, borderColor: COLORS.primary },
  weeklySummaryCard: { backgroundColor: COLORS.surface, borderRadius: SIZES.radius, padding: SPACING.l, marginBottom: SPACING.l, width: '100%', borderWidth: 1, borderColor: COLORS.border },
  weeklySummaryTitle: { color: COLORS.text, fontSize: 18, fontFamily: FONTS.bold, marginBottom: SPACING.m },
  weeklySummaryStats: { flexDirection: 'row', gap: SPACING.m, marginBottom: SPACING.m },
  viewPlanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: SPACING.m, borderRadius: SIZES.radius, gap: SPACING.s },
  viewPlanButtonText: { color: COLORS.white, fontSize: 16, fontFamily: FONTS.bold },
});