/**
 * Sessions API
 */

import { client, ApiResponse } from './client';

export interface Session {
  id: string;
  title: string;
  description: string;
  bpm: number;
  duration: number; // seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  musicUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionProgress {
  sessionId: string;
  userId: string;
  completedAt: string;
  score: number;
  accuracy: number;
  totalSteps: number;
  onBeatSteps: number;
}

export interface CreateSessionData {
  title: string;
  description: string;
  bpm: number;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Get all available sessions
 */
export const getSessions = async (
  params?: {
    difficulty?: string;
    limit?: number;
    offset?: number;
  }
): Promise<ApiResponse<Session[]>> => {
  return await client.get<Session[]>('/sessions', { params });
};

/**
 * Get session by ID
 */
export const getSession = async (id: string): Promise<ApiResponse<Session>> => {
  return await client.get<Session>(`/sessions/${id}`);
};

/**
 * Create new session
 */
export const createSession = async (
  data: CreateSessionData
): Promise<ApiResponse<Session>> => {
  return await client.post<Session>('/sessions', data);
};

/**
 * Update session
 */
export const updateSession = async (
  id: string,
  data: Partial<CreateSessionData>
): Promise<ApiResponse<Session>> => {
  return await client.patch<Session>(`/sessions/${id}`, data);
};

/**
 * Delete session
 */
export const deleteSession = async (id: string): Promise<ApiResponse<void>> => {
  return await client.delete<void>(`/sessions/${id}`);
};

/**
 * Start a session
 */
export const startSession = async (
  sessionId: string
): Promise<ApiResponse<{ startTime: string }>> => {
  return await client.post<{ startTime: string }>(`/sessions/${sessionId}/start`);
};

/**
 * Complete a session and submit progress
 */
export const completeSession = async (
  sessionId: string,
  progress: Omit<SessionProgress, 'sessionId' | 'userId' | 'completedAt'>
): Promise<ApiResponse<SessionProgress>> => {
  return await client.post<SessionProgress>(
    `/sessions/${sessionId}/complete`,
    progress
  );
};

/**
 * Get user's session history
 */
export const getSessionHistory = async (
  params?: {
    limit?: number;
    offset?: number;
  }
): Promise<ApiResponse<SessionProgress[]>> => {
  return await client.get<SessionProgress[]>('/sessions/history', { params });
};

/**
 * Get recommended sessions based on user's level
 */
export const getRecommendedSessions = async (): Promise<
  ApiResponse<Session[]>
> => {
  return await client.get<Session[]>('/sessions/recommended');
};
