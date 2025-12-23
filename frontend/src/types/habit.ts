export type HabitType = 'checkbox' | 'scheduled';

export interface Habit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  type: HabitType;
  completed?: boolean;
  schedule?: {
    days: string[]; // e.g. ['M', 'T', 'W', 'T', 'F', 'S', 'S']
    activeDaysIndices: number[]; // Indices of days that are scheduled (0-6)
    currentDayIndex: number; // Index of today (0-6)
  };
}
