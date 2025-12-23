import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { InjuryChip } from '../../src/components/ui/InjuryChip';
import { Button } from '../../src/components/Button';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { SIZES } from '@/constants/theme';

type InjuryType = 'Knees' | 'Shoulders' | 'Lower Back' | 'Hips' | 'Ankles' | 'Wrists' | 'Neck';

const INJURY_TYPES: InjuryType[] = [
  'Knees',
  'Shoulders',
  'Lower Back',
  'Hips',
  'Ankles',
  'Wrists',
  'Neck',
];

export default function OnboardingStep3() {
  const router = useRouter();
  const { updateStep4 } = useOnboarding();
  const [selectedInjuries, setSelectedInjuries] = useState<Set<InjuryType>>(
    new Set(['Knees', 'Hips'])
  );
  const [otherDetails, setOtherDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInjury = useCallback((injury: InjuryType) => {
    setSelectedInjuries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(injury)) {
        newSet.delete(injury);
      } else {
        newSet.add(injury);
      }
      return newSet;
    });
  }, []);

  const clearAllInjuries = useCallback(() => {
    setSelectedInjuries(new Set());
    setOtherDetails('');
  }, []);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Store Step 4 data locally (not saved to Firebase yet)
      updateStep4({
        injuries: Array.from(selectedInjuries),
        otherDetails: otherDetails.trim(),
      });
      
      router.push('/onboarding/mainGoal');
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
      router.replace('/onboarding/trainingExperience');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 4 of 5</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar currentStep={4} totalSteps={5} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Any Injuries We Should Know About?</Text>
            <Text style={styles.subtitle}>
              This helps us tailor your workout plan to keep you safe and effective.
            </Text>
          </View>

          {/* Injury Chips Grid */}
          <View style={styles.chipsContainer}>
            {INJURY_TYPES.map((injury) => (
              <InjuryChip
                key={injury}
                label={injury}
                selected={selectedInjuries.has(injury)}
                onClick={() => toggleInjury(injury)}
              />
            ))}
          </View>

          {/* Text Area Section */}
          <View style={styles.textAreaSection}>
            <Text style={styles.label}>Other injuries or details</Text>
            <TextInput
              style={styles.textArea}
              value={otherDetails}
              onChangeText={setOtherDetails}
              placeholder="e.g. Left ACL tear, 2 years ago"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          {/* I have no injuries button */}
          <TouchableOpacity
            style={styles.noInjuriesButton}
            onPress={clearAllInjuries}
            activeOpacity={0.8}
          >
            <Text style={styles.noInjuriesText}>I have no injuries</Text>
          </TouchableOpacity>

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
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    lineHeight: 36,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  textAreaSection: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  textArea: {
    width: '100%',
    minHeight: 160,
    padding: spacing.md,
    borderRadius: SIZES.radiusLg,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    color: colors.text,
    fontSize: typography.fontSize.md,
    lineHeight: 26,
  },
  noInjuriesButton: {
    height: 56,
    borderRadius: SIZES.radiusLg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  noInjuriesText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
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

