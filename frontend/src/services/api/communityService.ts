import api from './api';
import { Post, WeeklySummary } from '@/types/community';

/**
 * Community API Service
 * 
 * This service handles all community-related API calls.
 * Currently using mock data - update these functions when backend endpoints are ready.
 * 
 * Backend API Endpoints (from API_CONTRACT.md - Phase 4):
 * - GET /api/community/posts - Get community feed
 * - POST /api/community/posts - Create post
 * - GET /api/community/posts/:id - Get post details
 * - POST /api/community/posts/:id/like - Like/unlike post
 * - POST /api/community/posts/:id/comment - Add comment
 * - GET /api/community/users/:id - Get public profile
 * - POST /api/community/follow/:userId - Follow user
 * - DELETE /api/community/follow/:userId - Unfollow user
 */

export interface GetFeedParams {
  page?: number;
  limit?: number;
  filter?: 'following' | 'trending' | 'recent';
}

export interface CreatePostParams {
  content: string;
  workoutType?: string;
  workoutDetails?: {
    duration?: string;
    distance?: string;
    pace?: string;
    calories?: number;
  };
  image?: string;
}

export interface LikePostResponse {
  success: boolean;
  isLiked: boolean;
  likesCount: number;
}

export interface CreateCommentParams {
  content: string;
}

/**
 * Get community feed posts
 */
export const getFeed = async (params?: GetFeedParams): Promise<Post[]> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get('/api/community/posts', { params });
    // return response.data.data.posts;
    
    // Mock implementation
    console.log('getFeed called with params:', params);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error fetching community feed:', error);
    throw error;
  }
};

/**
 * Get user's weekly summary stats
 */
export const getWeeklySummary = async (): Promise<WeeklySummary> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get('/api/community/stats/weekly');
    // return response.data.data.summary;
    
    // Mock implementation
    console.log('getWeeklySummary called');
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error fetching weekly summary:', error);
    throw error;
  }
};

/**
 * Create a new post
 */
export const createPost = async (params: CreatePostParams): Promise<Post> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.post('/api/community/posts', params);
    // return response.data.data.post;
    
    console.log('createPost called with params:', params);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

/**
 * Like or unlike a post
 */
export const toggleLikePost = async (postId: string): Promise<LikePostResponse> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.post(`/api/community/posts/${postId}/like`);
    // return response.data.data;
    
    console.log('toggleLikePost called for post:', postId);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error toggling like on post:', error);
    throw error;
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (
  postId: string, 
  params: CreateCommentParams
): Promise<void> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // await api.post(`/api/community/posts/${postId}/comment`, params);
    
    console.log('addComment called for post:', postId, 'with params:', params);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

/**
 * Get a specific post by ID
 */
export const getPost = async (postId: string): Promise<Post> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get(`/api/community/posts/${postId}`);
    // return response.data.data.post;
    
    console.log('getPost called for post:', postId);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
};

/**
 * Follow a user
 */
export const followUser = async (userId: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // await api.post(`/api/community/follow/${userId}`);
    
    console.log('followUser called for user:', userId);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (userId: string): Promise<void> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // await api.delete(`/api/community/follow/${userId}`);
    
    console.log('unfollowUser called for user:', userId);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

/**
 * Get public user profile
 */
export const getUserProfile = async (userId: string): Promise<any> => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await api.get(`/api/community/users/${userId}`);
    // return response.data.data.user;
    
    console.log('getUserProfile called for user:', userId);
    throw new Error('API endpoint not implemented yet');
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

