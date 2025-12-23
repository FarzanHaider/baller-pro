import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONTS } from '@/constants/theme';
import { RehabListItem } from '@/components/ui/RehabListItem';
import { DisclaimerCard } from '@/components/ui/DisclaimerCard';
import { RehabItem } from '@/types/rehab';

// Mock Data
const REHAB_PROTOCOL: RehabItem[] = [
  {
    id: '1',
    title: 'Phase 1: Acute Management',
    subtitle: 'Goal: Reduce swelling and regain initial mobility.',
    type: 'active',
    iconName: 'run',
    progress: { current: 3, total: 5 }
  },
  {
    id: 'ed1',
    title: 'Understanding Your Injury',
    subtitle: 'Learn about the ACL and the recovery process.',
    type: 'education',
    iconName: 'lightbulb',
  },
  {
    id: '2',
    title: 'Phase 2: Building Strength',
    subtitle: 'Goal: Start rebuilding muscle around the joint.',
    type: 'locked',
    iconName: 'lock',
    metadata: 'Unlock by completing Phase 1.'
  },
  {
    id: '3',
    title: 'Phase 3: Functional Movement',
    subtitle: 'Goal: Improve stability and coordination.',
    type: 'locked',
    iconName: 'lock',
  },
  {
    id: 'ed2',
    title: 'Proper Form is Key',
    subtitle: 'Techniques to prevent re-injury.',
    type: 'education',
    iconName: 'school',
  },
  {
    id: 'hist1',
    title: 'Previous: Ankle Sprain',
    subtitle: 'Completed on May 12, 2024',
    type: 'completed',
    iconName: 'check',
  }
];

export default function RehabScreen() {
  const insets = useSafeAreaInsets();
  
  const handleItemPress = (item: RehabItem) => {
    console.log('Pressed', item.id);
  };
  
  return (
    <SafeAreaView style={styles.mainContainer} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={[styles.header, { paddingTop: SPACING.s + insets.top }]}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Injury Rehab & Prevention</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: SPACING.m },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>ACL Rehab Protocol</Text>
          <Text style={styles.heroSubtitle}>
            Follow these phases to safely recover and regain strength after an ACL injury.
          </Text>
        </View>
        {/* List Items */}
        {REHAB_PROTOCOL.map((item) => (
          <RehabListItem 
            key={item.id} 
            item={item} 
            onPress={() => handleItemPress(item)} 
          />
        ))}
        {/* Footer Disclaimer */}
        <DisclaimerCard />
      </ScrollView>
      {/* Floating Call Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>Consult a Specialist</Text>
          <Ionicons name="call" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.s,
    backgroundColor: COLORS.background,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    marginBottom: SPACING.l,
    marginTop: SPACING.s,
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.m,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.backgroundLight,
  },
  callButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  callButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
});
