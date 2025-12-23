import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  StatusBar 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import ReferralCodeCard from '@/components/ui/ReferralCodeCard';
import ReferralTabs from '@/components/ui/ReferralTabs';
import ReferralListItem from '@/components/ui/ReferralListItem';
import { Referral, ReferralStatus } from '@/types/referral';

// Mock Data
const REFERRALS: Referral[] = [
  { id: '1', email: 'j.doe*****@email.com', date: 'Sep 12, 2023', status: 'Pending' },
  { id: '2', email: 'sarah.c*****@email.com', date: 'Aug 21, 2023', status: 'Confirmed' },
  { id: '3', email: 'mike.r*****@email.com', date: 'Aug 15, 2023', status: 'Confirmed' },
  { id: '4', email: 'liam.p*****@email.com', date: 'Jul 30, 2023', status: 'Rewarded' },
  { id: '5', email: 'emma.w*****@email.com', date: 'Jul 28, 2023', status: 'Rewarded' },
  { id: '6', email: 'noah.k*****@email.com', date: 'Jul 15, 2023', status: 'Rewarded' },
  { id: '7', email: 'olivia.b*****@email.com', date: 'Jul 10, 2023', status: 'Rewarded' },
  { id: '8', email: 'james.m*****@email.com', date: 'Jul 01, 2023', status: 'Rewarded' },
];

export default function ReferralScreen() {
  const [selectedTab, setSelectedTab] = useState<ReferralStatus>('Pending');
  // Filter data based on tab
  const filteredData = REFERRALS.filter(item => item.status === selectedTab);
  // Calculate tab counts
  const counts = {
    Pending: REFERRALS.filter(r => r.status === 'Pending').length,
    Confirmed: REFERRALS.filter(r => r.status === 'Confirmed').length,
    Rewarded: REFERRALS.filter(r => r.status === 'Rewarded').length,
  };
  const handleCopy = () => {
    // Implement copy logic here
    console.log("Code copied");
  };
  const handleShare = () => {
    // Implement share logic here
    console.log("Share sheet opened");
  };
  const renderHeader = () => (
    <View style={styles.headerContent}>
      <ReferralCodeCard code="FIT-1A2B3C" onCopy={handleCopy} />
      {/* Share Button */}
      <TouchableOpacity 
        style={styles.shareButton} 
        onPress={handleShare}
        activeOpacity={0.9}
      >
        <MaterialIcons name="share" size={24} color={COLORS.text} />
        <Text style={styles.shareButtonText}>Share Your Link</Text>
      </TouchableOpacity>
      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoIcon}>
          <MaterialIcons name="workspace-premium" size={24} color={COLORS.accent} />
        </View>
        <Text style={styles.promoText}>
          Get 1 Month Free for each friend’s first paid subscription.
        </Text>
      </View>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ReferralTabs 
          selectedTab={selectedTab} 
          counts={counts} 
          onSelectTab={setSelectedTab} 
        />
      </View>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.appBarTitle}>Referral Center</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ReferralListItem item={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No referrals in this category yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  placeholder: {
    width: 40,
  },
  appBarTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  listContent: {
    paddingHorizontal: SPACING.l,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.s,
  },
  headerContent: {
    marginBottom: SPACING.s,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: SIZES.radiusLg,
    marginBottom: SPACING.xl,
    gap: SPACING.s,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  shareButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 67, 67, 0.2)', // Primary with opacity
    borderRadius: SIZES.radius,
    padding: SPACING.m,
    marginBottom: SPACING.xl,
    gap: SPACING.m,
  },
  promoIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 20,
  },
  tabsContainer: {
    marginTop: SPACING.s,
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.regular,
  },
});
