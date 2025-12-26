import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import StatusBanner from '@/components/ui/StatusBanner';
import PlanCard from '@/components/ui/PlanCard';

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={styles.iconButton} />
      </View>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <StatusBanner />
        {/* Plans */}
        <View style={styles.plansContainer}>
          <PlanCard
            title="Yearly"
            price="5.83"
            period="month"
            billingText="Billed annually at $69.99"
            features={[
              "Save 40% compared to monthly",
              "Unlimited Workouts",
              "Personalized Plans",
              "Ad-Free Experience"
            ]}
            isBestValue={true}
            isSelected={selectedPlan === 'yearly'}
            onPress={() => setSelectedPlan('yearly')}
          />
          <PlanCard
            title="Monthly"
            price="9.99"
            period="month"
            billingText="Billed monthly, cancel anytime"
            features={[
              "Unlimited Workouts",
              "Personalized Plans",
              "Ad-Free Experience"
            ]}
            isSelected={selectedPlan === 'monthly'}
            onPress={() => setSelectedPlan('monthly')}
          />
        </View>
      </ScrollView>
      {/* Footer / Fixed Bottom */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaText}>Upgrade Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>
        <Text style={styles.legalText}>
          By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and <Text style={styles.link}>Privacy Policy</Text>. 
          Your subscription will auto-renew until canceled. You can manage your subscription in your device settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    paddingBottom: 120, // Space for footer
  },
  plansContainer: {
    gap: SPACING.m,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    padding: SPACING.l,
    paddingBottom: SPACING.xl, // Safe area bottom padding
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ctaButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radiusSm,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: SPACING.m,
  },
  ctaText: {
    color: COLORS.text,
    fontFamily: FONTS.bold,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: SPACING.s,
    marginBottom: SPACING.s,
  },
  restoreText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.bold,
    fontSize: 14,
  },
  legalText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontFamily: FONTS.regular,
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.6,
  },
  link: {
    textDecorationLine: 'underline',
  },
});
