export interface Workout {
  id: string;
  title: string;
  category: string;
  duration: number; // in minutes
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  location: string;
  image?: string;
  tags?: string[];
}

export const CATEGORIES = ['All', 'Strength', 'Speed', 'Power', 'Endurance', 'Flexibility'];

export const WORKOUTS: Workout[] = [
  {
    id: '1',
    title: 'Full Body Strength',
    category: 'Strength',
    duration: 60,
    difficulty: 'Intermediate',
    location: 'Gym',
    tags: ['NEW'],
  },
  {
    id: '2',
    title: 'Track Sprint Session',
    category: 'Speed',
    duration: 45,
    difficulty: 'Advanced',
    location: 'Field',
  },
  {
    id: '3',
    title: 'Dynamic Core Burnout',
    category: 'Strength',
    duration: 30,
    difficulty: 'Beginner',
    location: 'Gym',
    tags: ['POPULAR'],
  },
  {
    id: '4',
    title: 'Upper Body Power',
    category: 'Power',
    duration: 50,
    difficulty: 'Intermediate',
    location: 'Gym',
  },
  {
    id: '5',
    title: 'Endurance Run',
    category: 'Endurance',
    duration: 45,
    difficulty: 'Intermediate',
    location: 'Field',
  },
  {
    id: '6',
    title: 'Flexibility Flow',
    category: 'Flexibility',
    duration: 25,
    difficulty: 'Beginner',
    location: 'Home',
  },
];
