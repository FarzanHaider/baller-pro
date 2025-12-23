import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';

/**
 * Onboarding index screen
 * Redirects to the first onboarding step to avoid "Page not found"
 * when navigating to /onboarding without a specific child route.
 */
export default function OnboardingIndex() {
  const router = useRouter();

  useEffect(() => {
    // Always send users to the first step
    router.replace('/onboarding/about');
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

