// Authentication Service
// Handles API calls for authentication (login, register, logout, refresh)

import { User, LoginCredentials, RegisterCredentials, ApiResponse, AuthResponse, RefreshTokenResponse } from '@/types/auth';
import { storage } from './storage';
import apiClient from '../api/api';
import API_CONFIG from '@/config/api';

export const authService = {
  /**
   * Register new user
   */
  async register(credentials: RegisterCredentials): Promise<User> {
    try {
      
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.REGISTER,
        {
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Registration failed');
      }

      const { user: backendUser, token, refreshToken } = response.data.data;

      // Transform backend user to app user format
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: backendUser.name,
        avatar: backendUser.avatar,
        isEmailVerified: backendUser.isEmailVerified,
        isPremium: false,
        onboardingCompleted: false, // New users need onboarding
        createdAt: backendUser.createdAt,
      };

      // Save tokens and user data
      await storage.saveToken(token);
      await storage.saveRefreshToken(refreshToken);
      await storage.saveUser(user);

      return user;
    } catch (error: any) {
      console.error('[AuthService] ❌ Registration error:', error);
      
      // Handle API error responses
      if (error.response?.data) {
        const apiError = error.response.data as ApiResponse;
        
        // Check for validation errors
        if (apiError.errors && apiError.errors.length > 0) {
          const errorMessages = apiError.errors
            .map(err => err.message)
            .join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(apiError.message || 'Registration failed');
      }
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  },

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      
      const response = await apiClient.post<ApiResponse<AuthResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        {
          email: credentials.email,
          password: credentials.password,
        }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Login failed');
      }

      const { user: backendUser, token, refreshToken } = response.data.data;

      // Transform backend user to app user format
      // Handle onboardingCompleted: backend might return boolean, string, or number
      let onboardingCompleted = false;
      const onboardingValue = backendUser.onboardingCompleted;
      
      if (
        onboardingValue === true ||
        onboardingValue === 'true' ||
        onboardingValue === 1 ||
        onboardingValue === '1' ||
        String(onboardingValue).toLowerCase() === 'true'
      ) {
        onboardingCompleted = true;
      }

      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: backendUser.name,
        avatar: backendUser.avatar,
        isEmailVerified: backendUser.isEmailVerified,
        isPremium: false, // TODO: Get from backend when implemented
        onboardingCompleted,
        createdAt: backendUser.createdAt,
      };

      // Save tokens and user data
      await storage.saveToken(token);
      await storage.saveRefreshToken(refreshToken);
      await storage.saveUser(user);
      return user;
    } catch (error: any) {
      console.error('[AuthService] ❌ Login error:', error);
      
      // Handle API error responses
      if (error.response?.data) {
        const apiError = error.response.data as ApiResponse;
        
        // Check for validation errors
        if (apiError.errors && apiError.errors.length > 0) {
          const errorMessages = apiError.errors
            .map(err => err.message)
            .join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(apiError.message || 'Login failed');
      }
      
      // Handle network errors
      if (error.message === 'Network Error') {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      
      // Try to call logout endpoint (best effort - don't fail if it errors)
      try {
        await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
      } catch (error) {
        console.warn('[AuthService] Logout endpoint failed (continuing anyway):', error);
      }
      
      // Clear local data regardless of API call result
      await storage.clearAll();
      
    } catch (error) {
      console.error('[AuthService] ❌ Logout error:', error);
      // Clear storage even if logout fails
      await storage.clearAll();
    }
  },

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<string> {
    try {
      
      const refreshToken = await storage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );

      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'Token refresh failed');
      }

      const { token } = response.data.data;
      await storage.saveToken(token);

      return token;
    } catch (error: any) {
      console.error('[AuthService] ❌ Token refresh error:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    const user = await storage.getUser();
    const token = await storage.getToken();

    if (!user || !token) {
      return null;
    }

    return user;
  },

  /**
   * Get access token
   */
  async getToken(): Promise<string | null> {
    return await storage.getToken();
  },

  /**
   * Clear authentication data
   */
  async clearAuth(): Promise<void> {
    await storage.clearAll();
  },

  /**
   * Update user data (e.g., after onboarding)
   */
  async updateUser(updates: Partial<User>): Promise<User> {
    const currentUser = await storage.getUser();
    
    if (!currentUser) {
      throw new Error('No authenticated user');
    }

    const updatedUser: User = {
      ...currentUser,
      ...updates,
    };

    // Update storage
    await storage.saveUser(updatedUser);

    return updatedUser;
  },

  /**
   * Complete onboarding
   */
  async completeOnboarding(): Promise<User> {
    return this.updateUser({ onboardingCompleted: true });
  },
};
