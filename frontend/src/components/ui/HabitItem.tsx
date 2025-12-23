import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Habit } from '../../types/habit';

interface HabitItemProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

const HabitItem: React.FC<HabitItemProps> = ({ habit, onToggle }) => {
  const isCheckbox = habit.type === 'checkbox';
  return (
    <View style={[styles.card, isCheckbox && styles.row]}> 
      <View style={styles.titleLeft}>
        <View style={[styles.icon, habit.completed ? styles.iconCompleted : styles.iconDefault]}>
          <MaterialIcons name={habit.icon as any} size={32} color={habit.completed ? '#fff' : colors.primary} />
        </View>
        <View style={styles.textCol}>
          <Text style={[styles.title, isCheckbox && habit.completed ? styles.strike : null]}>{habit.title}</Text>
          <Text style={styles.subtitle}>{habit.subtitle}</Text>
        </View>
      </View>
      {isCheckbox ? (
        <TouchableOpacity style={styles.checkboxBtn} onPress={() => onToggle(habit.id)}>
          <Ionicons name={habit.completed ? 'checkmark-circle' : 'ellipse-outline'} size={32} color={habit.completed ? colors.primary : colors.textSecondary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.scheduleRow}>
          {habit.schedule?.days.map((day, idx) => {
            const isActive = habit.schedule.activeDaysIndices.includes(idx);
            const isToday = habit.schedule.currentDayIndex === idx;
            return (
              <View
                key={day + idx}
                style={[styles.day, isActive && styles.dayActive, isToday && styles.dayToday]}
              >
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: spacing.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDefault: {
    backgroundColor: colors.primary + '22',
  },
  iconCompleted: {
    backgroundColor: colors.primary,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  strike: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  checkboxBtn: {
    marginLeft: spacing.md,
    padding: 4,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  day: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    marginHorizontal: 1,
  },
  dayActive: {
    backgroundColor: colors.primary,
  },
  dayToday: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  dayLabel: {
    color: colors.text,
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default HabitItem;
