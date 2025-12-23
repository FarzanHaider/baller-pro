import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTS } from '@/constants/theme';

interface LeaderboardTabsProps {
  activeTab: 'Global' | 'Program';
  onTabChange: (tab: 'Global' | 'Program') => void;
}

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Global' && styles.activeTab]}
        onPress={() => onTabChange('Global')}
      >
        <Text style={[styles.text, activeTab === 'Global' && styles.activeText]}>Global</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.tab, activeTab === 'Program' && styles.activeTab]}
        onPress={() => onTabChange('Program')}
      >
        <Text style={[styles.text, activeTab === 'Program' && styles.activeText]}>Program</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.tabBackground,
    borderRadius: 999, // Full rounded
    padding: 4,
    height: 48,
    marginHorizontal: SPACING.m,
    marginBottom: SPACING.m,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  activeText: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
  },
});
