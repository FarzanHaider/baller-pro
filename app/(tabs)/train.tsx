import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TabSwitcher } from '../../src/components/ui/TabSwitcher';
import { WorkoutCard } from '../../src/components/ui/WorkoutCard';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { typography } from '../../src/theme/typography';
import { Ionicons } from '@expo/vector-icons';
import { usePlan } from '../../src/contexts/PlanContext';
import PlanLockedOverlay from '../../src/components/ui/PlanLockedOverlay';
import { planService } from '../../src/services/api/planService';

type Tab = 'Workouts' | 'Programs';

export default function TrainScreen() {
  const router = useRouter();
  const { planStatus } = usePlan();
  const [activeTab, setActiveTab] = useState<Tab>('Workouts');
  const [planDays, setPlanDays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to get today's day name (MON, TUE, etc.)
  const todayName = useMemo(() => {
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[new Date().getDay()];
  }, []);

  // Fetch the full active plan
 useEffect(() => {
  if (planStatus === 'ACTIVE') {
    setIsLoading(true);
    planService.getFullPlan()
      .then((data) => {
        // Use optional chaining or default values to ensure 'order' exists
        const sortedDays = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setPlanDays(sortedDays);
      })
      .catch((err) => console.error('[TrainScreen] Fetch Error:', err))
      .finally(() => setIsLoading(false));
  }
}, [planStatus]);

  const isLocked = planStatus !== 'ACTIVE';

  const handleStartWorkout = (dayId: string) => {
    // Navigate to the dynamic workout session player
    // We pass the dayId so the next screen knows which exercises to load
    router.push({
      pathname: `/workout-session/${dayId}`,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLocked && (
        <PlanLockedOverlay
          planStatus={planStatus || 'NO_PLAN'}
          message="Your personalized AI plan is being prepared."
          showReviewButton={planStatus === 'PENDING_APPROVAL'}
        />
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Train</Text>
          <Text style={styles.headerSubtitle}>Follow your active AI program</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="stats-chart" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TabSwitcher
          tabs={['Workouts', 'Programs']}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as Tab)}
        />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : activeTab === 'Workouts' ? (
          <>
            {/* TODAY'S FOCUS SECTION */}
            <Text style={styles.sectionTitle}>Today's Session</Text>
            {planDays.filter(d => d.dayName === todayName).map(todayWorkout => (
              <WorkoutCard
                key={todayWorkout.id}
                workout={{
                   ...todayWorkout,
                   category: todayWorkout.dayName === todayName ? 'TODAY' : 'Upcoming'
                }}
                isHighlight={true}
                onStart={() => handleStartWorkout(todayWorkout.id)}
              />
            ))}

            {/* WEEKLY SCHEDULE SECTION */}
            <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Weekly Schedule</Text>
            {planDays.map((day) => (
              <TouchableOpacity 
                key={day.id} 
                style={[
                  styles.dayRow,
                  day.dayName === todayName && styles.activeDayRow
                ]}
                onPress={() => handleStartWorkout(day.id)}
              >
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{day.dayName}</Text>
                </View>
                <View style={styles.dayInfo}>
                  <Text style={styles.dayTitle}>{day.title}</Text>
                  <Text style={styles.daySubtitleText}>{day.subtitle || 'Rest Day'}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
             <Text style={styles.emptyTitle}>Programs coming soon</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeDayRow: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
  },
  dayBadge: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  dayBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  dayInfo: { flex: 1 },
  dayTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  daySubtitleText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  emptyState: { flex: 1, alignItems: 'center', paddingVertical: 100 },
  emptyTitle: { color: colors.textSecondary, fontSize: typography.fontSize.md },
});