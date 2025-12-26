import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  FlatList,
  useWindowDimensions 
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import CircularProgress from '@/components/ui/CircularProgress';
import ChallengeCard from '@/components/ui/ChallengeCard';
import ActiveChallengeCard from '@/components/ui/ActiveChallengeCard';
import ChallengesLeaderboardRow from '@/components/ui/ChallengesLeaderboardRow';
import { Challenge, LeaderboardUser } from '@/types/community';

// Mock Data
const CHALLENGES: Challenge[] = [
  { id: '1', title: '30-Day Mindfulness Streak', duration: '30 days', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_HPVBN9LxPiaMrniEK8xmH62jZ1PIZsI_fZWMldEFquMN7vSWm1m0Z92mNJ8qlsSpIkTwNOdiJep9DufA4dG2KWtHiVK5bP0HgSea6Db18YqK6U0OH0jX2AF6G0-2ZPQUZ3SQgV6gzsoN8WOMj43az2ziQwvZPbvJW5RcOuqljkevcqgjITzXYyvoKM_8oc18YkWDS3IvpMtsRRHdZwbbGvLDY7D683kvKNWLSGR7zUxBM5itA5o423iqNRQ7xgEjhq0n0R_SJFU' },
  { id: '2', title: 'Push-up Power', duration: '30 days', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg5BX2In-rpMh_3dIfnYxvpUnfZuOtB2wfRlWCi97dx4hhr6zpctqUQ-zdsqtcDgeVJfKiixUxtsYYYg5GWbd6jrgiE-Mf8F4u-FLe4C0NHRn22tn0CeYeZXVThbydTqhAALvheBXnNrMtGZEac9IaOB3GlDd9Q3HNgrv95xHqN5FTaZrqWoEcX8MkPv10kqxX-8KpEyohk61JeSpD8uM_D2VWJYj1jcnxhdX2dYO6GK0fEDF2y-7vj1Wfq5wRgaeRbpsPNedeNxg' },
  { id: '3', title: 'Team 5k Run', duration: '7 days', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbEcOkRp2TkxiJvzSLXzm2EUQjvQJdnl8r7AbukJz5ScyxqMMzvqUYg1BnREVH7kRVJy2oJuPLAKwaL8phusoOmkTCwR7Tu6Bkw4B-ue449KxuO4s2C1ZIJlPP1CjQ08EaYZ2n2CdqB21WGwU47jdeXcPyhJMUrao9sLgcWakufAm_zNEzKQSY5tkKElIFw_YfeTzRGIIGeoU7GwL1_roO3NCS3dJw9oUl9Xoy-eIfrLto_DygXDTD3-eVYKunPaLCZjFmzT5xtFA' },
];

const LEADERBOARD: LeaderboardUser[] = [
  { id: '1', rank: 1, name: 'Alex Johnson', steps: 22104, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRM8BqfcEUYEfOs4Zk_hhFUMdwKU9ZEEvxK0eyWLUP1sACrLr20sxs7MClmenJtnKSyZ5ZRvwQuHRqHt6rN7tS_uwduFKztVih-rm-01H1b3xnw5VM4JdetGyfillhj-A4_evgQMUHMg-1E2-Pbngy0E8v74r-_02LO9OQTVqMRU4KSlpnKe-dnCJxcBjJNQUSv1S5RBBUNia-OufVj3zCUwhAB4xlM3NyotRyL6cyWDGb8mFihSEcuaPWFTj8l3clb6jgbVcAzbk' },
  { id: '2', rank: 2, name: 'Maria Garcia', steps: 19876, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTafHexWXxIapV6DFTgKAYhwBA8R8LLvmzj2gntN-wACPDm-h_qPGWqbvlWTpYfF9Ezi0Kiyo7-HnBKfslM9LRngUAR4JvVn6z1Jaqh1lCykKaJa8y7X9nUvZ6fvPFwYQAAU0ErkhV6fa9k_kIH8NYjMoGKTr4lfpJULxIXXpvKr_NQizc58kMKyn-wU7iDL9lquHu_AU74dDAsRuCHpXh0-0gbd0sKGKsfwR6hmGdufYDxwA8nOz2H2reX8SEgYKbipfjibH7xJE' },
  { id: '3', rank: 3, name: 'David Chen', steps: 17450, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCimrbf6tBOd-309TT2V_LdWrQaT5irMG-VFDCnlChzIjrgIUGVXPvter8y3PXcg_TpOk_3xmwUansd6ATAqpIALInXM-kyMv_qMu1DNWlQh9zLe-nVjBe2BjdD3YPL84jHv8Aec5BckwLWpOOuNur_EEaW9rB77ULOkNCF-7dHKFjyWFoy3UyHCAZxm4M3WfytlPxbI9BKUttOg9CsV6X5AtQ0Jsp1EBDG2BTsyx6dRZAbCPbSBD3jtyBbqyiYRJb7MG-9NJy7ZHc' },
];

const CURRENT_USER: LeaderboardUser = { 
  id: 'me', rank: 8, name: 'You', steps: 15240, avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAraurqjz9eDVLldAr3gQe4OE2Nmm8zneW8BiEjwlnD1PXxHfLkDLdZbAAFg185MvRMGCkDVAtuOChA8Yu3FCL3QlCFJRQlBmHQFr1vU2BeWahvgRcvO1VUkNp4n3NsirYBB0e-Nu2VlVntKvXvFE6MSbjQo-pWt3GuEdrk2jXLBON4yjdDwiYiib9aoN8awimYAoK_douTb0Na5EsQZ2sth3EVVTtEOTQB5RYsKnCDrFZL0f0mlDhq7QCoqiwNNx3xGyoj3Mu64Ek', isCurrentUser: true 
};

const TABS = [
  { key: 'feed', label: 'Feed' },
  { key: 'challenges', label: 'Challenges' },
  { key: 'groups', label: 'Groups' },
];

export default function ChallengesScreen() {
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  // Calculate navbar height: header (44) + tabs (44) + padding + safe area
  const navbarHeight = 44 + 44 + SPACING.s + SPACING.m + insets.top;

  const renderNavbar = () => (
    <View style={[styles.navbar, { paddingTop: SPACING.s + insets.top }]}>
      {/* Header Title */}
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerIconButton}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>Community</Text>
        </View>
        <TouchableOpacity style={styles.headerIconButton}>
          <MaterialIcons name="notifications-none" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                tab.key === 'challenges' && styles.tabActive,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                if (tab.key === 'feed') {
                  router.push('/(tabs)/community');
                }
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  tab.key === 'challenges' && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Fixed Navbar */}
      <View style={styles.navbarWrapper}>
        {renderNavbar()}
      </View>

      {/* Scroll Content */}
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: navbarHeight + SPACING.l },
        ]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.responsiveContainer, { width: contentWidth, alignSelf: 'center' }]}>
          
          {/* Progress Section */}
          <Text style={styles.sectionTitle}>Your Weekly Progress</Text>
          <View style={styles.progressCard}>
            <CircularProgress value={15240} label="Steps" />
          </View>

          {/* Discover Challenges (Horizontal Scroll) */}
          <Text style={styles.sectionTitle}>Discover New Challenges</Text>
          <FlatList
            data={CHALLENGES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChallengeCard item={item} />}
            contentContainerStyle={styles.horizontalList}
            scrollEnabled={true}
          />

          {/* Active Challenges */}
          <Text style={styles.sectionTitle}>My Active Challenges</Text>
          <ActiveChallengeCard />

          {/* Leaderboard */}
          <Text style={styles.sectionTitle}>Weekly Step Leaderboard</Text>
          <View style={styles.leaderboardCard}>
            {LEADERBOARD.map((user) => (
              <ChallengesLeaderboardRow key={user.id} user={user} />
            ))}
            
            <View style={styles.leaderboardDivider} />
            
            <ChallengesLeaderboardRow user={CURRENT_USER} />
            
            <TouchableOpacity style={styles.fullLeaderboardBtn}>
              <Text style={styles.fullLeaderboardText}>View Full Leaderboard</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>

      {/* FAB */}
      <View style={[
        styles.fabContainer, 
        isTablet ? { right: (width - SIZES.containerMaxWidth) / 2 + 24 } : { right: 24 }
      ]}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
          <MaterialIcons name="add" size={32} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  navbarWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: COLORS.background,
  },
  navbar: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  tabsContainer: {
    marginHorizontal: -SPACING.m, // Extend to edges
  },
  tabsContent: {
    paddingHorizontal: SPACING.m,
    gap: SPACING.m,
  },
  tab: {
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: SIZES.radiusFull,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  tabTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  responsiveContainer: {
    width: '100%',
    paddingHorizontal: SPACING.l,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
    marginTop: SPACING.m,
  },
  progressCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.l,
    marginBottom: SPACING.l,
    alignItems: 'center',
  },
  horizontalList: {
    paddingBottom: SPACING.m,
  },
  leaderboardCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SPACING.l,
    marginBottom: SPACING.l,
  },
  leaderboardDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: SPACING.s,
    opacity: 0.5,
  },
  fullLeaderboardBtn: {
    backgroundColor: 'rgba(239, 67, 67, 0.1)', // Primary tint
    paddingVertical: SPACING.m,
    borderRadius: SIZES.radiusFull,
    alignItems: 'center',
    marginTop: SPACING.m,
  },
  fullLeaderboardText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

