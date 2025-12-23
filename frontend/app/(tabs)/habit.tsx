import React, { useState } from 'react';
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

export default function HabitTrackerScreen() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <StreakCard />
        <Text style={styles.todayTitle}>Today's Habits</Text>
        <HabitList habits={habits} onToggle={toggleHabit} />
      </ScrollView>
      <FAB onPress={() => setIsModalOpen(true)} />
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
});
