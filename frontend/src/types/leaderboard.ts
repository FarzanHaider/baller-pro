export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  reps: number;
  avatarUrl: string;
  isCurrentUser?: boolean;
}
