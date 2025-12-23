// App constants
export const APP_NAME = 'BallerPro';
export const APP_VERSION = '1.0.0';

// API Configuration
export const API_BASE_URL = __DEV__
  ? 'http://localhost:5000/api'
  : 'https://api.ballerpro.com/api';

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@ballerpro:auth_token',
  USER_DATA: '@ballerpro:user_data',
  ONBOARDING_COMPLETE: '@ballerpro:onboarding_complete',
} as const;

// Re-export nutrition constants
export * from './nutrition';

