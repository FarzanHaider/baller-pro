/**
 * useProtectedRoute Hook
 * 
 * Purpose: Provides route protection logic to prevent unauthorized access
 * to different parts of the app based on authentication and onboarding status.
 * 
 * Usage:
 * - In auth screens: protect from logged-in users
 * - In onboarding: protect from unauthenticated or completed users
 * - In main app: protect from unauthenticated or incomplete onboarding
 */

import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

type ProtectionType = 'auth' | 'onboarding' | 'app';

export function useProtectedRoute(protectionType: ProtectionType) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  // Allow onboarding preview in development even if user already completed onboarding
  const allowOnboardingPreview = __DEV__;

  useEffect(() => {
    // Don't do anything while auth is still loading
    if (isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    if (protectionType === 'auth') {
      if (isAuthenticated && user) {
        if (user.onboardingCompleted === true) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding/about');
        }
      }
    }

    if (protectionType === 'onboarding') {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (user && user.onboardingCompleted === true && !allowOnboardingPreview) {
        // User has completed onboarding - redirect to main app
        if (segments[0] === 'onboarding') {
          router.replace('/(tabs)');
        }
      }
    }

    if (protectionType === 'app') {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (user && user.onboardingCompleted !== true) {
        // User hasn't completed onboarding - redirect to onboarding
        router.replace('/onboarding/about');
      }
    }
  }, [isAuthenticated, user, isLoading, segments, protectionType, router]);

  return { isLoading, isAuthenticated, user };
}

