export type PlanStatus = 'NO_PLAN' | 'GENERATING' | 'PENDING_APPROVAL' | 'ACTIVE';

export interface PlanStatusResponse {
  planStatus: PlanStatus;
  planVersion?: number;
  updatedAt?: string;
}

export interface PlanDay {
  id: string;
  dayName: string; // e.g. "MON"
  dayNumber: string; // e.g. "23"
  order: number;
  status: 'completed' | 'active' | 'future' | 'rest';
  title: string;
  subtitle?: string; // e.g. "Hypertrophy Focus" or "55 min"
  duration?: string;
  tags?: string[]; // e.g. ["High Carb Day"]
  meta?: {
    label: string; // e.g. "WORKOUT" or "CARDIO"
    color?: string;
  };
}
