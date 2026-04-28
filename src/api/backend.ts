/**
 * STEPFLOW Backend API Integration
 * Handles communication with STEPFLOW-backend for data synchronization
 */

import { client, ApiResponse } from './client';

export interface BackendConfig {
  baseUrl: string;
  wsUrl: string;
  apiVersion: string;
}

export interface WorkflowTask {
  id: string;
  type: 'motion_analysis' | 'video_processing' | 'ai_inference' | 'content_archival';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sessionId?: string;
  userId: string;
  data: Record<string, any>;
  result?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ContentArchive {
  id: string;
  type: 'session' | 'video' | 'motion_data' | 'analysis_result';
  sessionId?: string;
  userId: string;
  url: string;
  metadata: Record<string, any>;
  archived: boolean;
  archivedAt?: string;
}

export interface SyncStatus {
  lastSync: string;
  pendingTasks: number;
  failedTasks: number;
  syncEnabled: boolean;
}

/**
 * Get backend configuration
 */
export const getBackendConfig = async (): Promise<ApiResponse<BackendConfig>> => {
  return await client.get<BackendConfig>('/backend/config');
};

/**
 * Test backend connectivity
 */
export const testConnection = async (): Promise<ApiResponse<{ status: string; latency: number }>> => {
  const startTime = Date.now();
  const response = await client.get<{ status: string }>('/backend/health');
  const latency = Date.now() - startTime;
  return {
    data: { ...response.data, latency },
    success: response.success,
  };
};

/**
 * Create workflow task
 */
export const createWorkflowTask = async (
  task: Omit<WorkflowTask, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
): Promise<ApiResponse<WorkflowTask>> => {
  return await client.post<WorkflowTask>('/backend/tasks', task);
};

/**
 * Get workflow task status
 */
export const getTaskStatus = async (taskId: string): Promise<ApiResponse<WorkflowTask>> => {
  return await client.get<WorkflowTask>(`/backend/tasks/${taskId}`);
};

/**
 * Get all tasks for user
 */
export const getUserTasks = async (params?: {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<WorkflowTask[]>> => {
  return await client.get<WorkflowTask[]>('/backend/tasks', { params });
};

/**
 * Cancel workflow task
 */
export const cancelTask = async (taskId: string): Promise<ApiResponse<void>> => {
  return await client.post<void>(`/backend/tasks/${taskId}/cancel`);
};

/**
 * Retry failed task
 */
export const retryTask = async (taskId: string): Promise<ApiResponse<WorkflowTask>> => {
  return await client.post<WorkflowTask>(`/backend/tasks/${taskId}/retry`);
};

/**
 * Archive content
 */
export const archiveContent = async (
  content: Omit<ContentArchive, 'id' | 'archived' | 'archivedAt'>,
): Promise<ApiResponse<ContentArchive>> => {
  return await client.post<ContentArchive>('/backend/archive', content);
};

/**
 * Get archived content
 */
export const getArchivedContent = async (params?: {
  type?: string;
  sessionId?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<ContentArchive[]>> => {
  return await client.get<ContentArchive[]>('/backend/archive', { params });
};

/**
 * Restore archived content
 */
export const restoreContent = async (archiveId: string): Promise<ApiResponse<ContentArchive>> => {
  return await client.post<ContentArchive>(`/backend/archive/${archiveId}/restore`);
};

/**
 * Get sync status
 */
export const getSyncStatus = async (): Promise<ApiResponse<SyncStatus>> => {
  return await client.get<SyncStatus>('/backend/sync/status');
};

/**
 * Trigger manual sync
 */
export const triggerSync = async (): Promise<ApiResponse<{ taskId: string }>> => {
  return await client.post<{ taskId: string }>('/backend/sync/trigger');
};

/**
 * Enable/disable auto-sync
 */
export const setSyncEnabled = async (enabled: boolean): Promise<ApiResponse<SyncStatus>> => {
  return await client.patch<SyncStatus>('/backend/sync/settings', { enabled });
};
