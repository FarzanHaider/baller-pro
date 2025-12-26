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
import { Button } from '../../src/components/Button';
import { useOnboarding } from '../../src/contexts/OnboardingContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { SIZES } from '@/constants/theme';

type Gender = 'male' | 'female' | 'other';

export default function OnboardingStep1() {
  const router = useRouter();
  const { logout } = useAuth();
  const { updateStep1 } = useOnboarding();
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selectedGender) {
      setError('Please select your gender');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Store Step 1 data locally (not saved to Firebase yet)
      updateStep1({ gender: selectedGender });
      
      router.push('/onboarding/journey');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save. Please try again.';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    try {
      // Step 1 is the first onboarding step, so sign out and go back to login
      // This prevents the auth protection from redirecting back to onboarding
      await logout();
      router.replace('/auth/login');
    } catch (err) {
      console.error('[Onboarding Step 1] Logout error:', err);
      // Even if logout fails, try to navigate to login
      router.replace('/auth/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.stepText}>Step 1 of 5</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar currentStep={1} totalSteps={5} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>About You</Text>
            <Text style={styles.subtitle}>Tell us a bit about yourself.</Text>
          </View>

          <View style={styles.optionsContainer}>
            {(['male', 'female', 'other'] as Gender[]).map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.optionButton,
                  selectedGender === gender && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedGender(gender)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedGender === gender && styles.optionTextSelected,
                  ]}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer with Continue Button */}
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
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.normal,
    color: colors.textSecondary,
    lineHeight: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: spacing.md,
  },
  optionButton: {
    height: 64,
    borderRadius: SIZES.radiusLg,
    borderWidth: 2,
    borderColor: colors.inputBg,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.inputBg,
  },
  optionText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  optionTextSelected: {
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
    borderRadius: 9999, // Full rounded
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
