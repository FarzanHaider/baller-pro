import { WeeklySummary, Post } from '@/types/community';

export const MOCK_WEEKLY_SUMMARY: WeeklySummary = {
  weekNumber: 35,
  workoutsCompleted: 5,
  avgScore: 88,
  trendPercentage: 5.2,
};

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'Alex Morgan',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    content: 'Just crushed my morning HIIT session! Feeling energized and ready to take on the day. Who else got their workout in? 🔥',
    workoutType: 'HIIT SESSION',
    workoutDetails: {
      duration: '25 mins',
      calories: 350,
    },
    score: 92,
    likes: 128,
    comments: 12,
    shares: 5,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Chris Evans',
      avatar: 'https://i.pravatar.cc/150?img=12',
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    content: 'Nice 5k run to start the day. The weather was perfect!',
    workoutType: '5K RUN',
    workoutDetails: {
      duration: '22:15',
      pace: '4:27 /km',
    },
    score: 85,
    likes: 97,
    comments: 8,
    shares: 2,
    isLiked: true,
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'John D.',
      avatar: 'https://i.pravatar.cc/150?img=33',
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    content: 'Leg day was brutal, but we made it. Pushing for new PRs next week.',
    workoutType: 'STRENGTH TRAINING',
    score: 95,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
    likes: 251,
    comments: 42,
    shares: 15,
    isLiked: false,
  },
  {
    id: '4',
    author: {
      id: 'user4',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3h ago
    content: 'Morning yoga session complete! Starting the day with mindfulness and movement. 🧘‍♀️',
    workoutType: 'YOGA',
    workoutDetails: {
      duration: '45 mins',
      calories: 180,
    },
    score: 88,
    likes: 156,
    comments: 18,
    shares: 7,
    isLiked: false,
  },
  {
    id: '5',
    author: {
      id: 'user5',
      name: 'Mike Peterson',
      avatar: 'https://i.pravatar.cc/150?img=15',
    },
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7h ago
    content: 'New PR on bench press! 💪 All those early morning sessions paying off.',
    workoutType: 'STRENGTH TRAINING',
    workoutDetails: {
      duration: '60 mins',
      calories: 420,
    },
    score: 94,
    likes: 203,
    comments: 24,
    shares: 9,
    isLiked: true,
  },
];

