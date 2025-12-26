// API Configuration
// Central configuration for API base URLs and endpoints

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isDevelopment = __DEV__;

/**
 * Get the appropriate API base URL based on environment and platform
 * 
 * For Expo Go on physical devices:
 * - Cannot use 'localhost' (refers to the phone itself)
 * - Must use computer's local IP address
 * - Computer and phone must be on same WiFi network
 * 
 * The Expo manifest provides the debuggerHost which contains your local IP
 */
function getApiUrl(): string {
  if (!isDevelopment) {
    // Production - use your production API URL
    return 'https://api.ballerpro.com/api';
  }

  // Development - detect the right URL for your setup
  
  // For web, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }

  // For mobile (iOS/Android with Expo Go)
  // Get the local IP from Expo's debuggerHost
  const debuggerHost = Constants.expoConfig?.hostUri;
  
  if (debuggerHost) {
    // Extract IP address (format is usually "192.168.x.x:8081")
    const host = debuggerHost.split(':')[0];
    const apiUrl = `http://${host}:5000/api`;
    console.log('[API Config] 📱 Mobile detected - Using local IP:', apiUrl);
    return apiUrl;
  }

  // Fallback: Manual IP address (REPLACE WITH YOUR COMPUTER'S IP IF NEEDED)
  // To find your IP:
  // - Windows: Open CMD and type 'ipconfig', look for IPv4 Address
  // - Mac: System Preferences > Network, or type 'ifconfig' in terminal
  // - Usually starts with 192.168.x.x or 10.0.x.x
  const MANUAL_IP = '192.168.1.100'; // ⚠️ REPLACE THIS WITH YOUR ACTUAL IP
  console.warn('[API Config] ⚠️ Using manual IP address:', MANUAL_IP);
  console.warn('[API Config] ⚠️ If API calls fail, update MANUAL_IP in frontend/src/config/api.ts');
  return `http://${MANUAL_IP}:5000/api`;
}

export const API_CONFIG = {
  // Base URL for API - automatically detects correct URL for your setup
  BASE_URL: getApiUrl(),
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
    },
    // User
    USER: {
      PROFILE: '/user/me',
      UPDATE_PROFILE: '/user/profile',
      CHANGE_PASSWORD: '/user/change-password',
    },
    // Onboarding
    ONBOARDING: {
      SAVE: '/user/onboarding',
      GET: '/user/onboarding',
    },
    // Plans
    PLANS: {
      STATUS: '/plans/status',
    },
  },
} as const;

export default API_CONFIG;

