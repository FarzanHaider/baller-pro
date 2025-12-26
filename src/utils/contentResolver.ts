const EXERCISE_LIBRARY: Record<string, { video: any, thumb: string }> = {
  "barbell squat": {
    video: require('../assets/squat.mp4'),
    thumb: 'https://images.com/squat-thumb.jpg'
  },
  "pushups": {
    video: { uri: 'https://vimeo.com/standard-pushup-link' },
    thumb: 'https://images.com/pushup-thumb.jpg'
  },
  // Default fallback for AI names not in our library
  "default": {
    video: { uri: 'https://your-cdn.com/default-exercise.mp4' },
    thumb: 'https://your-cdn.com/default-thumb.jpg'
  }
};

export const getExerciseContent = (name: string) => {
  const key = name.toLowerCase();
  return EXERCISE_LIBRARY[key] || EXERCISE_LIBRARY["default"];
};
