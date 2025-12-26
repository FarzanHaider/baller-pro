import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Habit } from '../../types/habit';
import HabitItem from './HabitItem';
import { spacing } from '../../theme/spacing';

interface HabitListProps {
  habits: Habit[];
  onToggle?: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onToggle }) => {
  return (
    <View style={styles.list}>
      {habits.map((habit) => (
        <HabitItem key={habit.id} habit={habit} onToggle={onToggle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flexDirection: 'column',
    gap: spacing.md,
  },
});

export default HabitList;
