import apiClient from './api';
import { PlanStatusResponse, PlanDay } from '@/types/plan';

/**
 * Plan Service
 * Handles all plan-related API calls
 */
export const planService = {
  /**
   * Fetch current plan status
   * GET /api/plans/status
   */
  async getPlanStatus(): Promise<PlanStatusResponse> {
    try {
      const response = await apiClient.get<{ success: boolean; data: PlanStatusResponse }>('/training/programs/active');
      
      if (!response.data.success || !response.data.data) {
        throw new Error('Invalid response format');
      }
      
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        const notFoundError = new Error('Plan not found') as any;
        notFoundError.status = 404;
        throw notFoundError;
      }
      throw error;
    }
  },

  /**
   * Fetch the complete weekly schedule (Used by the Plan Screen)
   * GET /api/plans/full-plan
   */
 // frontend/src/services/api/planService.ts
async getFullPlan(): Promise<PlanDay[]> {
  const response = await apiClient.get('/training/programs/full-plan'); // Updated path
  return response.data.data;
},

  /**
   * Fetch AI-generated workouts for current week
   */
  async getPlanWorkouts(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/plans/workouts');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch plan workouts');
    }
    return response.data.data;
  },

  /**
   * Fetch AI-generated nutrition targets
   */
  async getPlanNutritionTargets(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/plans/nutrition-targets');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch nutrition targets');
    }
    return response.data.data;
  },

  /**
   * Fetch AI-suggested habits
   */
  async getPlanHabits(): Promise<any[]> {
    const response = await apiClient.get<{ success: boolean; data: any[] }>('/plans/habits');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch plan habits');
    }
    return response.data.data;
  },

  /**
   * Fetch weekly summary stats for the Dashboard
   */
  async getWeeklySummary(): Promise<any> {
    const response = await apiClient.get<{ success: boolean; data: any }>('/plans/weekly-summary');
    if (!response.data.success || !response.data.data) {
      throw new Error('Failed to fetch weekly summary');
    }
    return response.data.data;
  },


// Inside your planService object
async getExerciseDetails(exerciseId: string): Promise<any> {
  // Replace with your actual endpoint
  const response = await apiClient.get(`/plans/exercises/${exerciseId}`);
  return response.data;
},
};