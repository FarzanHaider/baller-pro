// Authentication and User Types
export type PlanStatus = 'INACTIVE' | 'GENERATING' | 'ACTIVE' | 'COMPLETED';
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  profileImage?: string;
  isPremium: boolean;
  onboardingCompleted: boolean;
  isEmailVerified?: boolean;
  createdAt: string;
  planStatus: PlanStatus;
}

export interface OnboardingData {
  gender?: 'male' | 'female' | 'other';
  trainingLevel?: 'beginner' | 'intermediate' | 'advanced';
  goals?: string[];
  injuries?: string[];
  customInjury?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  onboardingData?: OnboardingData;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Backend API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
  code?: string;
  validation?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    isEmailVerified: boolean;
    createdAt: string;
  };
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

