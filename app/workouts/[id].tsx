import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// UI Components
import { VideoPlayer } from '../../src/components/ui/VideoPlayer';
import { TimerControl } from '../../src/components/ui/TimerControl';
import { StepInstruction } from '../../src/components/ui/StepInstruction';

// Theme & Stores
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { SIZES } from '@/constants/theme';
import { planService } from '../../src/services/api/planService';
import { useWorkoutStore } from '../../src/store/useWorkoutStore'; // Import the store
import { getExerciseContent } from '../../src/utils/contentResolver'; // Module 5 mapping

export default function ExerciseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Global Store State (Module 4)
  const { startWorkout, activeDayId } = useWorkoutStore();

  // Local Component State
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloaded, setIsDownloaded] = useState(false);

  // Initialize session if not already active
  useEffect(() => {
    if (id && !activeDayId) {
      startWorkout(id);
    }
  }, [id, activeDayId]);

  // Fetch AI generated details
  useEffect(() => {
    if (id) {
      fetchExerciseDetails();
    }
  }, [id]);

  const fetchExerciseDetails = async () => {
    try {
      setLoading(true);
      const data = await planService.getExerciseDetails(id);
      setExercise(data);
    } catch (error) {
      console.error("Failed to load exercise details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Technique Guide...</Text>
      </View>
    );
  }

  // Module 5: Resolve content (Video/Thumb) based on exercise name
  const content = getExerciseContent(exercise?.name || "");
  
  // Split instructions into steps
  const steps = exercise?.instructions 
    ? exercise.instructions.split('.').filter((s: string) => s.trim().length > 0)
    : ["No specific instructions provided."];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{exercise?.name || 'Exercise Detail'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.videoSection}>
  <VideoPlayer
    videoUrl={content.video}  // <-- Changed from 'url' to 'videoUrl'
    duration={exercise?.videoDuration || 60}
    currentTime={0}
  />
</View>

        <Text style={styles.title}>How to do {exercise?.name}</Text>

        <View style={styles.stepsSection}>
          {steps.map((stepText: string, index: number) => (
            <StepInstruction
              key={index}
              number={index + 1}
              title={index === 0 ? "Starting Position" : `Step ${index + 1}`}
              description={stepText.trim() + "."}
            />
          ))}
        </View>

        <View style={styles.timerSection}>
          <Text style={styles.sectionLabel}>Target Rest Time</Text>
          <TimerControl initialTime={exercise?.restSeconds || 90} />
        </View>

        <View style={styles.downloadSection}>
          <View style={styles.downloadRow}>
            <View style={styles.downloadLeft}>
              <Ionicons name="download-outline" size={24} color={colors.text} />
              <Text style={styles.downloadText}>Available Offline</Text>
            </View>
            <Switch
              value={isDownloaded}
              onValueChange={setIsDownloaded}
              trackColor={{ false: colors.inputBg, true: colors.primary }}
              thumbColor={colors.text}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <View style={styles.saveButtonContent}>
            <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
            <Text style={styles.saveButtonText}>Back to Workout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  loadingText: { marginTop: spacing.md, color: colors.textSecondary, fontFamily: typography.fontFamily.medium },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
  headerTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text },
  headerSpacer: { width: 24 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  videoSection: { marginBottom: spacing.xl, borderRadius: SIZES.radius, overflow: 'hidden', backgroundColor: colors.surface, height: 200 },
  title: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.text, marginBottom: spacing.xl },
  stepsSection: { marginBottom: spacing.xl },
  sectionLabel: { color: colors.textSecondary, fontSize: typography.fontSize.sm, marginBottom: spacing.sm, textTransform: 'uppercase', letterSpacing: 1 },
  timerSection: { marginBottom: spacing.xl },
  downloadSection: { marginBottom: spacing.xl, padding: spacing.md, backgroundColor: colors.surface, borderRadius: SIZES.radius },
  downloadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  downloadLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  downloadText: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: colors.text },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, backgroundColor: colors.background, borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { width: '100%', height: 56, borderRadius: SIZES.radius, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  saveButtonContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  saveButtonText: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.text },
});