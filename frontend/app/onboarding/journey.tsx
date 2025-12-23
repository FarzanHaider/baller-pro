import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, SIZES } from '@/constants/theme';
import { ProgressBar } from '@/components/ui/ProgressBar';
import JourneyGoalCard from '@/components/ui/JourneyGoalCard';
import SelectionButton from '@/components/ui/SelectionButton';
import { GoalOption, ExperienceLevel } from '@/types/onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

// Mock Data
const GOALS: GoalOption[] = [
  { id: 'muscle', label: 'Build Muscle', icon: 'fitness-center' },
  { id: 'fat_loss', label: 'Lose Fat', icon: 'local-fire-department' },
  { id: 'endurance', label: 'Improve Endurance', icon: 'directions-run' },
  { id: 'strength', label: 'Increase Strength', icon: 'accessibility-new' },
];

const LEVELS: ExperienceLevel[] = [
  { id: 'strength_athlete', label: 'Strength Athlete' },
  { id: 'endurance_runner', label: 'Endurance Runner' },
  { id: 'casual', label: 'Casual Gym-goer' },
  { id: 'beginner', label: 'Beginner' },
];

export default function JourneyScreen() {
  const router = useRouter();
  const { updateOnboardingData } = useAuth();
  const { updateStep2 } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<string>('muscle');
  const [selectedLevel, setSelectedLevel] = useState<string>('endurance_runner');
  const [isNavigating, setIsNavigating] = useState(false);
  
  // Responsive check
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const contentWidth = isTablet ? 600 : '100%';

  const handleContinue = async () => {
    if (isNavigating) {
      return;
    }

    try {
      setIsNavigating(true);
      
      // Store Step 2 data locally (not saved to Firebase yet)
      updateStep2({ 
        goal: selectedGoal,
        trainingLevel: selectedLevel
      });
      
      await updateOnboardingData({ 
        goals: [selectedGoal],
        trainingLevel: selectedLevel as any
      });
      
      router.push('/onboarding/trainingExperience');
    } catch (error) {
      console.error('[Journey] Error:', error);
      setIsNavigating(false);
    }
  };

  const handleBack = () => {
    const canGoBack = (router as any).canGoBack?.() ?? false;

    if (canGoBack) {
      router.back();
    } else {
      router.replace('/onboarding/about');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Wrapper to center content on large screens */}
      <View style={[styles.responsiveContainer, { width: contentWidth, alignSelf: 'center' }]}>
        
        {/* Top Bar */}
        <View style={styles.header}>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.stepText}>Step 2 of 5</Text>
          </View>
          <ProgressBar currentStep={2} totalSteps={5} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Intro Text */}
          <Text style={styles.title}>Define Your Journey</Text>
          <Text style={styles.subtitle}>
            This helps us create a plan that's perfect for you.
          </Text>

          {/* Goal Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Main Goal is...</Text>
            <View style={styles.grid}>
              {/* Row 1 */}
              <View style={styles.row}>
                <JourneyGoalCard 
                  {...GOALS[0]} 
                  selected={selectedGoal === GOALS[0].id} 
                  onPress={() => setSelectedGoal(GOALS[0].id)} 
                />
                <JourneyGoalCard 
                  {...GOALS[1]} 
                  selected={selectedGoal === GOALS[1].id} 
                  onPress={() => setSelectedGoal(GOALS[1].id)} 
                />
              </View>
              {/* Row 2 */}
              <View style={styles.row}>
                <JourneyGoalCard 
                  {...GOALS[2]} 
                  selected={selectedGoal === GOALS[2].id} 
                  onPress={() => setSelectedGoal(GOALS[2].id)} 
                />
                <JourneyGoalCard 
                  {...GOALS[3]} 
                  selected={selectedGoal === GOALS[3].id} 
                  onPress={() => setSelectedGoal(GOALS[3].id)} 
                />
              </View>
            </View>
          </View>

          {/* Experience Level Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>I Consider Myself a...</Text>
            <View style={styles.list}>
              {LEVELS.map((level) => (
                <SelectionButton
                  key={level.id}
                  label={level.label}
                  selected={selectedLevel === level.id}
                  onPress={() => setSelectedLevel(level.id)}
                />
              ))}
            </View>
          </View>

        </ScrollView>

        {/* Footer / CTA */}
        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              isNavigating && styles.continueButtonDisabled
            ]} 
            activeOpacity={0.9}
            onPress={handleContinue}
            disabled={isNavigating}
          >
            <Text style={styles.continueText}>
              {isNavigating ? 'Loading...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  responsiveContainer: {
    flex: 1,
    maxWidth: 600, // Constraint for Tablets
    width: '100%',
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.l,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  backText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  stepText: {
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 120, // Extra space ensuring footer doesn't cover content on small screens
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.s,
    marginTop: SPACING.s,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontFamily: FONTS.regular,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: SPACING.m,
  },
  grid: {
    gap: SPACING.m,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.m,
  },
  list: {
    gap: SPACING.m,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: 'transparent', 
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.disabled,
    opacity: 0.6,
  },
  continueText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
});

