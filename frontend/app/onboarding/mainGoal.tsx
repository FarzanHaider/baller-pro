import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { GoalCard } from '../../src/components/ui/GoalCard';
import { Button } from '../../src/components/Button';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type GoalType = 'muscle-gain' | 'fat-loss' | 'maintenance';

const GOAL_OPTIONS = [
  {
    id: 'muscle-gain' as GoalType,
    title: 'Muscle Gain',
    description: 'Build lean mass and increase strength.',
    icon: 'fitness_center',
  },
  {
    id: 'fat-loss' as GoalType,
    title: 'Fat Loss',
    description: 'Reduce body fat while preserving muscle.',
    icon: 'local_fire_department',
  },
  {
    id: 'maintenance' as GoalType,
    title: 'Maintenance',
    description: 'Maintain your current physique and fitness level.',
    icon: 'balance',
  },
];

export default function OnboardingStep4() {
  const router = useRouter();
  const { completeOnboarding, updateOnboardingData } = useAuth();
  const { updateStep5, getCompleteData, clearOnboarding } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>('fat-loss');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    // Validation first - if no goal selected, set error and return
    if (!selectedGoal) {
      setError('Please select a goal');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Get onboarding data from context (Steps 1-4) and inject Step 5 from local UI state.
      // This avoids state desync where updateStep5() may not be reflected in getCompleteData() immediately.
      const baseOnboardingData = getCompleteData();
      const allOnboardingData = {
        ...baseOnboardingData,
        step5: { goal: selectedGoal },
      };
      
      // Verify we have all steps before saving
      if (!allOnboardingData.step1 || !allOnboardingData.step2 || !allOnboardingData.step3 || 
          !allOnboardingData.step4 || !allOnboardingData.step5) {
        throw new Error('Missing onboarding data. Please complete all steps.');
      }
      
      // Update onboarding contexts AFTER validation (single source of truth = selectedGoal)
      updateStep5({ goal: selectedGoal });
      await updateOnboardingData({ goals: [selectedGoal] });
      
      // ATOMIC OPERATION: Save ALL onboarding data (Steps 1-5) to Firestore at once
      // This ensures all steps are saved together - if write fails, nothing is saved
      // Navigate immediately after successful write in the same promise chain
      const updatedUser = await completeOnboarding(allOnboardingData);
      
      // Verify state was updated successfully
      if (!updatedUser.onboardingCompleted) {
        throw new Error('Onboarding completion state not updated correctly');
      }
      
      console.log('[OnboardingStep5] onboardingCompleted-state-updated: State updated successfully', {
        uid: updatedUser.id,
        onboardingCompleted: updatedUser.onboardingCompleted
      });
      
      // Clear local onboarding context (data now in Firestore)
      clearOnboarding();
      
      // PRODUCTION-CORRECT ROUTING: Navigate to / (single entry point, same as login)
      // index.tsx will handle redirect to /(tabs) when it mounts
      // Use setTimeout to ensure state has propagated before navigation
      console.log('[OnboardingStep5] onboarding-complete: Onboarding completed successfully', {
        uid: updatedUser.id,
        onboardingCompleted: updatedUser.onboardingCompleted,
        timestamp: new Date().toISOString()
      });
      
      console.log('[OnboardingStep5] onboarding-complete-navigate-root: Navigating to / (index.tsx will handle redirect)', {
        targetRoute: '/',
        uid: updatedUser.id,
        currentRoute: '/onboarding/mainGoal',
        onboardingCompleted: updatedUser.onboardingCompleted,
        timestamp: new Date().toISOString()
      });
      
      // Navigate to root / - index.tsx will detect state and redirect to tabs
      // Use setTimeout to ensure state has propagated before navigation
      setTimeout(() => {
        router.replace('/');
      }, 400);
      
      // Reset loading state
      setIsLoading(false);
    } catch (err: any) {
      // Error handling - don't navigate if write failed
      const errorMessage = err.message || 'Failed to complete onboarding. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      setIsLoading(false);
      // Note: User stays on Step 5 screen, can retry
    }
    // Note: No finally block needed - setIsLoading is handled in both success and error paths
  };

  const handleBack = () => {
    const canGoBack = (router as any).canGoBack?.() ?? false;

    if (canGoBack) {
      router.back();
    } else {
      router.replace('/onboarding/injuries');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 5 of 5</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar currentStep={5} totalSteps={5} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.title}>What's Your Main{'\n'}Goal?</Text>

          <View style={styles.goalsContainer}>
            {GOAL_OPTIONS.map((option) => (
              <GoalCard
                key={option.id}
                id={option.id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                isSelected={selectedGoal === option.id}
                onSelect={(id) => setSelectedGoal(id as GoalType)}
              />
            ))}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isLoading ? 'Completing...' : 'Continue'}
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
          disabled={!selectedGoal || isLoading}
          loading={isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.lg,
  },
  backButton: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  stepText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  progressContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: spacing.xl,
  },
  goalsContainer: {
    gap: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
  },
  continueButton: {
    width: '100%',
    borderRadius: 9999,
    height: 56,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorContainer: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: `${colors.error}20`,
    borderRadius: spacing.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
});

