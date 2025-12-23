// Main entry point - handles navigation based on auth state
import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';
import { COLORS } from '@/constants/theme';

export default function Index() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace('/auth/login');
      }
    } else if (user) {
      if (user.onboardingCompleted === true) {
        if (inAuthGroup || inOnboardingGroup || !inTabsGroup) {
          // Use setTimeout to ensure state has propagated before navigation
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 100);
        }
      } else {
        if (!inOnboardingGroup) {
          router.replace('/onboarding/about');
        }
      }
    } else {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, user, isLoading, segments, router]);

  // Show loading spinner while checking auth state
  if (isLoading) {
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
