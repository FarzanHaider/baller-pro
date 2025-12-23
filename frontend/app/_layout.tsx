import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../src/contexts/AuthContext';
import { OnboardingProvider } from '../src/contexts/OnboardingContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <OnboardingProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="onboarding" />
            {/* workouts/ directory is auto-discovered by Expo Router */}
          </Stack>
          <StatusBar style="auto" />
        </OnboardingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

