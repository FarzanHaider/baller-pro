import { Stack } from 'expo-router';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

/**
 * Auth Stack Layout
 * 
 * Purpose: Container for authentication screens (login, register)
 * 
 * Protection: Prevents logged-in users from accessing auth screens.
 * If user is already authenticated, they'll be redirected to either:
 * - Onboarding (if not completed)
 * - Main app (if onboarding completed)
 */
export default function AuthLayout() {
  // Guard this stack - only non-authenticated users should see auth screens
  const { isLoading } = useProtectedRoute('auth');

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
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="link_account" />
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

