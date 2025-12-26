export interface Recipe {
  id: string;
  title: string;
  image: string; // URL
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  isFavorite: boolean;
}

export interface FilterOption {
  id: string;
  label: string;
  active: boolean;
}
