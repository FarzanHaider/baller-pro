export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  icon?: string;
  timestamp: number;
}

export interface DailyTarget {
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}
