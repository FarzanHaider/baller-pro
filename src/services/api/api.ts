import axios, { AxiosInstance, AxiosError } from 'axios';
import API_CONFIG from '@/config/api';
import { storage } from '../auth/storage';
// Add these to your existing API_CONFIG.ENDPOINTS object in your config file 
// (or update the api.ts temporarily to include these paths)
export const TRAINING_ENDPOINTS = {
  GET_ACTIVE_PLAN: '/training/programs/active',
  START_SESSION: '/training/workouts/start',
  COMPLETE_SESSION: '/training/workouts/complete',
};

// ... inside your ApiService class, ensure you have a helper for the Training module if needed
class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor - Add auth token to requests
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        try {
          const token = await storage.getToken();
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn('[ApiService] Failed to get token:', error);
        }
        
        console.log(`[ApiService] 🚀 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[ApiService] ❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle token refresh and errors
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[ApiService] ✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Handle 401 Unauthorized - Try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log('[ApiService] 🔄 Token expired, attempting refresh...');
            
            const refreshToken = await storage.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            // Call refresh endpoint
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
              { refreshToken },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
              }
            );

            if (response.data.success && response.data.data?.token) {
              const newToken = response.data.data.token;
              await storage.saveToken(newToken);

              // Retry original request with new token
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }
              
              console.log('[ApiService] ✅ Token refreshed, retrying request');
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            console.error('[ApiService] ❌ Token refresh failed:', refreshError);
            
            // Clear auth and reject
            await storage.clearAll();
            return Promise.reject(refreshError);
          }
        }

        // Log error details
        if (error.response) {
          console.error(`[ApiService] ❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response.status}`, error.response.data);
        } else if (error.request) {
          console.error('[ApiService] ❌ Network error - No response received');
        } else {
          console.error('[ApiService] ❌ Request setup error:', error.message);
        }

        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

export const apiService = new ApiService();
export default apiService.instance;
