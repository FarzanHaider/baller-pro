import { Habit } from '../types/habit';

export const INITIAL_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Drink Water',
    subtitle: '6/8 glasses',
    icon: 'water-drop',
    type: 'checkbox',
    completed: true,
  },
  {
    id: '2',
    title: 'Read 10 Pages',
    subtitle: 'Keep up the momentum!',
    icon: 'menu-book',
    type: 'checkbox',
    completed: false,
  },
  {
    id: '3',
    title: 'Morning Run',
    subtitle: 'Scheduled 3 times this week',
    icon: 'directions-run',
    type: 'scheduled',
    schedule: {
      days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      activeDaysIndices: [1, 3, 5], // Tue, Thu, Sat
      currentDayIndex: 3, // Thursday
    }
  },
  {
    id: '4',
    title: 'Meditate',
    subtitle: '10 minutes of mindfulness',
    icon: 'self-improvement',
    type: 'checkbox',
    completed: true,
  },
];
