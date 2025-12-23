import { Stack } from 'expo-router';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

/**
 * Onboarding Stack Layout
 * 
 * Purpose: Container for onboarding screens (about, journey, experience, etc.)
 * 
 * Protection: Ensures only authenticated users who haven't completed onboarding can access.
 * If user is not authenticated -> redirect to login
 * If user already completed onboarding -> redirect to main app
 */
export default function OnboardingLayout() {
  // Guard this stack - only authenticated users who need onboarding
  const { isLoading } = useProtectedRoute('onboarding');

  // Show loading while checking authentication status
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="about" />
      <Stack.Screen name="journey" />
      <Stack.Screen name="trainingExperience" />
      <Stack.Screen name="injuries" />
      <Stack.Screen name="mainGoal" />
    </Stack>
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

