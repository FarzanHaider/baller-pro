import { create } from 'zustand';

interface WorkoutState {
  activeDayId: string | null;
  completedSets: Record<string, boolean>; // key: "exerciseId-setIndex"
  startTime: number | null;
  startWorkout: (dayId: string) => void;
  toggleSet: (exerciseId: string, setIndex: number) => void;
  finishWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set) => ({
  activeDayId: null,
  completedSets: {},
  startTime: null,

  startWorkout: (dayId: string) => 
    set({ 
      activeDayId: dayId, 
      completedSets: {}, 
      startTime: Date.now() 
    }),

  toggleSet: (exerciseId: string, setIndex: number) => 
    set((state) => {
      const key = `${exerciseId}-${setIndex}`;
      return {
        completedSets: { 
          ...state.completedSets, 
          [key]: !state.completedSets[key] 
        }
      };
    }),

  finishWorkout: () => 
    set({ 
      activeDayId: null, 
      completedSets: {}, 
      startTime: null 
    }),
}));