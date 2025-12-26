// Demo data for nutrition tracking

export interface NutritionData {
  dailyTarget: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Meal[];
}

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  icon: string;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const DEMO_NUTRITION_DATA: NutritionData = {
  dailyTarget: {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fats: 70,
  },
  consumed: {
    calories: 1300,
    protein: 80,
    carbs: 120,
    fats: 40,
  },
  meals: [
    {
      id: '1',
      name: 'Breakfast',
      description: 'Scrambled Eggs, Toast',
      calories: 520,
      icon: '☀️',
      macros: {
        protein: 35,
        carbs: 45,
        fats: 18,
      },
    },
    {
      id: '2',
      name: 'Lunch',
      description: 'Chicken Salad',
      calories: 480,
      icon: '🍔',
      macros: {
        protein: 30,
        carbs: 40,
        fats: 15,
      },
    },
    {
      id: '3',
      name: 'Dinner',
      description: 'Salmon and Veggies',
      calories: 300,
      icon: '🍽️',
      macros: {
        protein: 15,
        carbs: 35,
        fats: 7,
      },
    },
  ],
};

// Additional meal options for the "Add Meal" functionality
export const MEAL_OPTIONS = [
  { icon: '☀️', label: 'Breakfast' },
  { icon: '🍔', label: 'Lunch' },
  { icon: '🍽️', label: 'Dinner' },
  { icon: '🍎', label: 'Snack' },
  { icon: '🥤', label: 'Drink' },
];

