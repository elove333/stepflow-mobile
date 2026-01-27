/**
 * Feedback API
 */

import { client, ApiResponse } from './client';

export interface Feedback {
  id: string;
  userId: string;
  sessionId?: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  rating?: number; // 1-5
  screenshot?: string;
  deviceInfo?: Record<string, any>;
  createdAt: string;
  status?: 'pending' | 'reviewed' | 'resolved' | 'closed';
}

export interface CreateFeedbackData {
  sessionId?: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  rating?: number;
  screenshot?: string;
  deviceInfo?: Record<string, any>;
}

export interface FeedbackResponse {
  id: string;
  feedbackId: string;
  message: string;
  createdAt: string;
}

/**
 * Submit feedback
 */
export const submitFeedback = async (data: CreateFeedbackData): Promise<ApiResponse<Feedback>> => {
  return await client.post<Feedback>('/feedback', data);
};

/**
 * Get user's feedback history
 */
export const getFeedbackHistory = async (params?: {
  limit?: number;
  offset?: number;
  status?: string;
}): Promise<ApiResponse<Feedback[]>> => {
  return await client.get<Feedback[]>('/feedback', { params });
};

/**
 * Get feedback by ID
 */
export const getFeedback = async (id: string): Promise<ApiResponse<Feedback>> => {
  return await client.get<Feedback>(`/feedback/${id}`);
};

/**
 * Update feedback
 */
export const updateFeedback = async (
  id: string,
  data: Partial<CreateFeedbackData>,
): Promise<ApiResponse<Feedback>> => {
  return await client.patch<Feedback>(`/feedback/${id}`, data);
};

/**
 * Delete feedback
 */
export const deleteFeedback = async (id: string): Promise<ApiResponse<void>> => {
  return await client.delete<void>(`/feedback/${id}`);
};

/**
 * Get feedback responses
 */
export const getFeedbackResponses = async (
  feedbackId: string,
): Promise<ApiResponse<FeedbackResponse[]>> => {
  return await client.get<FeedbackResponse[]>(`/feedback/${feedbackId}/responses`);
};

/**
 * Rate session (quick feedback)
 */
export const rateSession = async (
  sessionId: string,
  rating: number,
  comment?: string,
): Promise<ApiResponse<Feedback>> => {
  return await client.post<Feedback>('/feedback/rate', {
    sessionId,
    rating,
    comment,
    type: 'improvement',
    title: 'Session Rating',
    description: comment || `Rating: ${rating}/5`,
  });
};
