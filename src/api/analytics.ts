/**
 * Analytics API
 */

import { client, ApiResponse } from './client';

export interface UserStats {
  totalSessions: number;
  totalSteps: number;
  averageAccuracy: number;
  totalDuration: number; // seconds
  streak: number; // consecutive days
  level: number;
  experience: number;
}

export interface ProgressData {
  date: string;
  sessions: number;
  steps: number;
  accuracy: number;
  duration: number;
}

export interface Leaderboard {
  userId: string;
  userName: string;
  avatar?: string;
  score: number;
  rank: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

/**
 * Get user statistics
 */
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  return await client.get<UserStats>('/analytics/stats');
};

/**
 * Get progress data over time
 */
export const getProgressData = async (
  params?: {
    startDate?: string;
    endDate?: string;
    interval?: 'day' | 'week' | 'month';
  }
): Promise<ApiResponse<ProgressData[]>> => {
  return await client.get<ProgressData[]>('/analytics/progress', { params });
};

/**
 * Get leaderboard
 */
export const getLeaderboard = async (
  params?: {
    timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
    limit?: number;
  }
): Promise<ApiResponse<Leaderboard[]>> => {
  return await client.get<Leaderboard[]>('/analytics/leaderboard', { params });
};

/**
 * Get user achievements
 */
export const getAchievements = async (): Promise<ApiResponse<Achievement[]>> => {
  return await client.get<Achievement[]>('/analytics/achievements');
};

/**
 * Track custom event
 */
export const trackEvent = async (
  eventName: string,
  properties?: Record<string, any>
): Promise<ApiResponse<void>> => {
  return await client.post<void>('/analytics/track', {
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Get session insights
 */
export const getSessionInsights = async (
  sessionId: string
): Promise<
  ApiResponse<{
    averageScore: number;
    completionRate: number;
    popularityRank: number;
    userCount: number;
  }>
> => {
  return await client.get(`/analytics/sessions/${sessionId}/insights`);
};
