import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ReferralStatus } from '@/types/referral';

interface ReferralTabsProps {
  selectedTab: ReferralStatus;
  counts: Record<ReferralStatus, number>;
  onSelectTab: (tab: ReferralStatus) => void;
}

export default function ReferralTabs({ selectedTab, counts, onSelectTab }: ReferralTabsProps) {
  const tabs: ReferralStatus[] = ['Pending', 'Confirmed', 'Rewarded'];
  return (
    <View style={styles.container}>
      <View style={styles.tabsRow}>
        {tabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => onSelectTab(tab)}
            >
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab} ({counts[tab]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: SPACING.l,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.m,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },
});
