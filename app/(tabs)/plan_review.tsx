import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  useWindowDimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import StatusIconPulse from '@/components/ui/StatusIconPulse';
import ReviewBadgeCard from '@/components/ui/ReviewBadgeCard';
import { usePlanGuard } from '@/hooks/usePlanGuard';
import { usePlan } from '@/contexts/PlanContext';

export default function PlanReviewScreen() {
  const { isLoading } = usePlanGuard('PENDING_APPROVAL');
  const { markPendingApprovalSeen, refreshPlanStatus } = usePlan();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { width, height } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? SIZES.containerMaxWidth : '100%';

  // Mark that user has seen this screen
  useEffect(() => {
    markPendingApprovalSeen();
  }, [markPendingApprovalSeen]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshPlanStatus();
    setRefreshing(false);
  };

  // Show loading while checking plan status
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.backgroundDeep} />
      
      {/* Background Glow Effect */}
      <View style={styles.backgroundGlow} />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { minHeight: height }]} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={[styles.container, { width: contentWidth }]}>
          
          {/* Main Visual */}
          <StatusIconPulse />

          {/* Text Content */}
          <View style={styles.textSection}>
            <Text style={styles.title}>
              Coach Review{'\n'}
              <Text style={{ color: COLORS.primary }}>In Progress</Text>
            </Text>
            
            <Text style={styles.description}>
              Your AI-customized plan is ready. Our certified coaching team is currently reviewing it to ensure safety and effectiveness.
            </Text>
          </View>

          {/* Status Card */}
          <ReviewBadgeCard />

          {/* Footer Notification */}
          <View style={styles.footerPill}>
            <View style={styles.footerIcon}>
              <MaterialIcons name="notifications-active" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.footerText}>You'll be notified once approved.</Text>
          </View>

          {/* Back to Home Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.backButtonText}>Back to Home</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDeep,
  },
  backgroundGlow: {
    position: 'absolute',
    top: 0,
    left: '10%',
    width: '80%',
    height: 400,
    backgroundColor: 'rgba(239, 67, 67, 0.08)', // Very subtle primary glow
    borderRadius: 999,
    transform: [{ scaleX: 1.5 }], // Spread it horizontally
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontFamily: FONTS.extraBold,
    textAlign: 'center',
    marginBottom: SPACING.m,
    lineHeight: 38,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SPACING.s,
  },
  footerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.l,
    borderRadius: SIZES.radiusFull,
    marginTop: SPACING.xl,
  },
  footerIcon: {
    marginRight: SPACING.s,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: SPACING.xl,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  backButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

