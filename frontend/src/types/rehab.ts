export type RehabPhaseStatus = 'active' | 'locked' | 'education' | 'completed';

export interface RehabItem {
  id: string;
  title: string;
  subtitle: string;
  type: RehabPhaseStatus;
  iconName: string; // Ionicons name
  progress?: {
    current: number;
    total: number;
  };
  metadata?: string; // For "Completed on..." or "Unlock by..."
}
