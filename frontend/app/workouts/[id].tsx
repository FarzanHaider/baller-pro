import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { VideoPlayer } from '../../src/components/ui/VideoPlayer';
import { TimerControl } from '../../src/components/ui/TimerControl';
import { StepInstruction } from '../../src/components/ui/StepInstruction';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { SIZES } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ExerciseStep {
  number: number;
  title: string;
  description: string;
}

const EXERCISE_STEPS: ExerciseStep[] = [
  {
    number: 1,
    title: 'Starting Position',
    description:
      "Stand with your feet shoulder-width apart. Rest the barbell across the top of your back, not on your neck.",
  },
  {
    number: 2,
    title: 'The Descent',
    description:
      "Keeping your chest up and back straight, lower your body by bending your knees and hips as if you're sitting in a chair.",
  },
  {
    number: 3,
    title: 'The Ascent',
    description:
      'Drive through your heels to return to the starting position. Keep your core engaged and back straight throughout the movement.',
  },
];

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [videoCurrentTime, setVideoCurrentTime] = useState(37); // 0:37
  const videoDuration = 75; // 1:15

  const handleSaveProgress = () => {
    // TODO: Save exercise progress
    console.log('Save progress for exercise:', id);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Barbell Squat</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Video Player */}
        <View style={styles.videoSection}>
          <VideoPlayer
            duration={videoDuration}
            currentTime={videoCurrentTime}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>How to do a Barbell Squat</Text>

        {/* Steps */}
        <View style={styles.stepsSection}>
          {EXERCISE_STEPS.map((step) => (
            <StepInstruction
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </View>

        {/* Timer Control */}
        <View style={styles.timerSection}>
          <TimerControl initialTime={90} />
        </View>

        {/* Download Toggle */}
        <View style={styles.downloadSection}>
          <View style={styles.downloadRow}>
            <View style={styles.downloadLeft}>
              <Ionicons
                name="download-outline"
                size={24}
                color={colors.text}
              />
              <Text style={styles.downloadText}>Download for Offline</Text>
            </View>
            <Switch
              value={isDownloaded}
              onValueChange={setIsDownloaded}
              trackColor={{
                false: colors.inputBg,
                true: colors.primary,
              }}
              thumbColor={colors.text}
            />
          </View>
        </View>
      </ScrollView>

      {/* Save Progress Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProgress}
          activeOpacity={0.8}
        >
          <View style={styles.saveButtonContent}>
            <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
            <Text style={styles.saveButtonText}>Save Progress</Text>
          </View>
        </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  headerSpacer: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  videoSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  stepsSection: {
    marginBottom: spacing.xl,
  },
  timerSection: {
    marginBottom: spacing.xl,
  },
  downloadSection: {
    marginBottom: spacing.xl,
  },
  downloadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  downloadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  downloadText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  saveButton: {
    width: '100%',
    height: 56,
    borderRadius: SIZES.radius,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  saveButtonText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
});
