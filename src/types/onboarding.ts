// Onboarding Types

export interface GoalOption {
  id: string;
  label: string;
  icon: keyof typeof import('@expo/vector-icons').MaterialIcons['glyphMap'];
}

export interface ExperienceLevel {
  id: string;
  label: string;
}

