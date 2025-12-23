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
import { SelectionCard } from '../../src/components/ui/SelectionCard';
import { Button } from '../../src/components/Button';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export default function OnboardingStep2() {
  const router = useRouter();
  const { updateStep3 } = useOnboarding();
  const [selectedLevel, setSelectedLevel] = useState<ExperienceLevel>('intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Store Step 3 data locally (not saved to Firebase yet)
      updateStep3({
        experienceLevel: selectedLevel,
      });
      
      router.push('/onboarding/injuries');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const canGoBack = (router as any).canGoBack?.() ?? false;

    if (canGoBack) {
      router.back();
    } else {
      router.replace('/onboarding/journey');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 3 of 5</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar currentStep={3} totalSteps={5} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>What's Your Training Experience?</Text>
            <Text style={styles.subtitle}>
              This helps us personalize your workout plan.
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <SelectionCard
              title="Beginner"
              description="Just starting out or returning after a long break."
              iconName="footprint"
              isSelected={selectedLevel === 'beginner'}
              onPress={() => setSelectedLevel('beginner')}
            />
            <SelectionCard
              title="Intermediate"
              description="You've been training consistently for a while."
              iconName="fitness_center"
              isSelected={selectedLevel === 'intermediate'}
              onPress={() => setSelectedLevel('intermediate')}
            />
            <SelectionCard
              title="Advanced"
              description="You're experienced and follow a structured program."
              iconName="weight"
              isSelected={selectedLevel === 'advanced'}
              onPress={() => setSelectedLevel('advanced')}
            />
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
          title={isLoading ? 'Saving...' : 'Continue'}
          onPress={handleContinue}
          variant="primary"
          style={styles.continueButton}
          disabled={isLoading}
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
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  cardsContainer: {
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

