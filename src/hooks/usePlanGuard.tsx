import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { usePlan } from '@/contexts/PlanContext';

/**
 * usePlanGuard - Named export used by specific screens (like PlanScreen)
 */
export const usePlanGuard = (requiredStatus: string) => {
  const { planStatus, isLoading } = usePlan();
  const router = useRouter();

  useEffect(() => {
    // Basic safety check: if we need ACTIVE and we aren't, the global guard usually handles it
    if (!isLoading && planStatus !== requiredStatus && planStatus !== 'ACTIVE') {
      console.log(`[usePlanGuard] Status mismatch: ${planStatus} vs ${requiredStatus}`);
    }
  }, [planStatus, isLoading, requiredStatus]);

  return { isLoading, planStatus };
};

/**
 * useGlobalPlanGuard - Controls the app's main navigation flow
 */
export function useGlobalPlanGuard() {
  const { planStatus, isLoading, hasSeenPendingApproval } = usePlan();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Safety check
    // REMOVED: segments.length === 0 to fix TS2367
    if (isLoading || planStatus === null) {
      return;
    }

    // Access segments safely
    const rootSegment = segments[0];
    const activeLeaf = segments[segments.length - 1]; 

    // Define route groups
    const inAuthGroup = rootSegment === '(auth)' || rootSegment === 'auth';
    const inOnboarding = rootSegment === 'onboarding' || rootSegment === '(onboarding)';
    
    // Do not redirect if user is already in Auth or Onboarding
    if (inAuthGroup || inOnboarding) {
      return;
    }

    // 2. State-based Redirection Logic
    switch (planStatus) {
      case 'GENERATING':
        if (activeLeaf !== 'generating_plan') {
          router.replace('/(tabs)/generating_plan');
        }
        break;

      case 'PENDING_APPROVAL':
        if (!hasSeenPendingApproval && activeLeaf !== 'plan_review') {
          router.replace('/(tabs)/plan_review');
        }
        break;

      case 'NO_PLAN':
        // If they finished auth but have no plan data, send to onboarding
        if (!inOnboarding) {
          router.replace('/onboarding');
        }
        break;

      case 'ACTIVE':
        // Redirect away from utility screens if plan is already active
        if (activeLeaf === 'generating_plan' || activeLeaf === 'plan_review') {
          router.replace('/(tabs)/train');
        }
        break;
        
      default:
        break;
    }
  }, [planStatus, isLoading, segments, hasSeenPendingApproval]);

  return { planStatus, isLoading };
}