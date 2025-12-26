// Main entry point - handles navigation based on auth state and plan status
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { usePlan } from '../src/contexts/PlanContext';
import { COLORS } from '@/constants/theme';

export default function Index() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { planStatus, isLoading: planLoading, hasSeenPendingApproval } = usePlan();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait for both auth and plan loading to complete
    if (authLoading || planLoading) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    // Auth check
    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace('/auth/login');
      }
      return;
    }

    // User check
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    // Onboarding check
    if (user.onboardingCompleted !== true) {
      if (!inOnboardingGroup) {
        router.replace('/onboarding/about');
      }
      return;
    }

    // Plan status check - wait until planStatus is resolved (not null)
    if (planStatus === null) {
      return; // Still loading plan status
    }

    // Plan status routing
    if (planStatus === 'GENERATING') {
      if (!inTabsGroup || segments[1] !== 'generating_plan') {
        router.replace('/(tabs)/generating_plan');
      }
      return;
    }

    if (planStatus === 'PENDING_APPROVAL') {
      // Only show review screen if not seen before
      if (!hasSeenPendingApproval) {
        if (!inTabsGroup || segments[1] !== 'plan_review') {
          router.replace('/(tabs)/plan_review');
        }
        return;
      }
      // Otherwise fall through to Home
    }

    // Default: ACTIVE or NO_PLAN → Home
    if (inAuthGroup || inOnboardingGroup || !inTabsGroup) {
      // Use setTimeout to ensure state has propagated before navigation
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 100);
    }
  }, [isAuthenticated, user, authLoading, planStatus, planLoading, hasSeenPendingApproval, segments, router]);

  // Show loading spinner while checking auth or plan state
  if (authLoading || planLoading || planStatus === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Return empty view while navigation is happening
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
