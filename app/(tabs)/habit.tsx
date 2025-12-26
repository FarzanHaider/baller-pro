import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import Header from '../../src/components/ui/Header';
import StreakCard from '../../src/components/ui/StreakCard';
import HabitList from '../../src/components/ui/HabitList';
import FAB from '../../src/components/ui/FAB';
import AddHabitModal from '../../src/components/ui/AddHabitModal';
import { Habit } from '../../src/types/habit';
import { INITIAL_HABITS } from '../../src/constants/habits';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { usePlan } from '../../src/contexts/PlanContext';
import PlanLockedOverlay from '../../src/components/ui/PlanLockedOverlay';
import { planService } from '../../src/services/api/planService';
import { COLORS, FONTS, SPACING as THEME_SPACING } from '@/constants/theme';

export default function HabitTrackerScreen() {
  const { planStatus } = usePlan();
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planHabits, setPlanHabits] = useState<Habit[]>([]);
  const [isLoadingHabits, setIsLoadingHabits] = useState(false);

  const isLocked = planStatus !== 'ACTIVE' && planStatus !== null;

  // Fetch plan habits when active
  useEffect(() => {
    if (planStatus === 'ACTIVE') {
      setIsLoadingHabits(true);
      planService.getPlanHabits()
        .then((habits) => {
          setPlanHabits(habits);
          setHabits(habits);
          setIsLoadingHabits(false);
        })
        .catch((error) => {
          console.error('[HabitScreen] Error fetching plan habits:', error);
          setIsLoadingHabits(false);
        });
    } else {
      setPlanHabits([]);
      setHabits(INITIAL_HABITS);
    }
  }, [planStatus]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const addHabit = (newHabit: Habit) => {
    setHabits(prev => [...prev, newHabit]);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.container}>
      {isLocked && (
        <PlanLockedOverlay
          planStatus={planStatus!}
          message="Complete your AI plan to unlock habit tracking"
          showReviewButton={planStatus === 'PENDING_APPROVAL'}
        />
      )}

      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <StreakCard />
        <Text style={styles.todayTitle}>Today's Habits</Text>
        {isLoadingHabits ? (
          <Text style={styles.loadingText}>Loading habits...</Text>
        ) : (
          <>
            <HabitList habits={habits} onToggle={isLocked ? undefined : toggleHabit} />
            {planStatus === 'ACTIVE' && (
              <Text style={styles.microCopy}>
                Habits don't affect your AI plan (v1)
              </Text>
            )}
          </>
        )}
      </ScrollView>
      {!isLocked && (
        <FAB onPress={() => setIsModalOpen(true)} />
      )}
      <AddHabitModal 
        visible={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addHabit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  todayTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  microCopy: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    marginTop: THEME_SPACING.l,
    fontStyle: 'italic',
  },
});
