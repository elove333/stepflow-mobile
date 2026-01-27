/**
 * STEPFLOW AI Integration
 * Handles AI processing tasks including motion tracking, video analysis, and ML models
 */

import { client, ApiResponse } from './client';

export interface AIModel {
  id: string;
  name: string;
  type: 'pose_estimation' | 'motion_tracking' | 'video_analysis' | 'dance_recognition';
  version: string;
  status: 'available' | 'loading' | 'unavailable';
  accuracy?: number;
  description?: string;
}

export interface MotionTrackingRequest {
  videoUrl?: string;
  videoData?: string; // Base64 encoded
  sessionId?: string;
  modelId?: string;
  options?: {
    fps?: number;
    resolution?: string;
    detectHands?: boolean;
    detectFace?: boolean;
    smoothing?: boolean;
  };
}

export interface MotionTrackingResult {
  id: string;
  sessionId?: string;
  frames: MotionFrame[];
  summary: {
    totalFrames: number;
    averageConfidence: number;
    detectedMovements: string[];
    quality: 'low' | 'medium' | 'high';
  };
  processingTime: number;
  createdAt: string;
}

export interface MotionFrame {
  frameNumber: number;
  timestamp: number;
  keypoints: Array<{
    name: string;
    x: number;
    y: number;
    z?: number;
    confidence: number;
  }>;
  pose?: {
    pitch: number;
    yaw: number;
    roll: number;
  };
}

export interface VideoAnalysisRequest {
  videoUrl?: string;
  videoData?: string;
  sessionId?: string;
  analysisType: 'quality' | 'content' | 'motion' | 'comprehensive';
}

export interface VideoAnalysisResult {
  id: string;
  quality: {
    resolution: string;
    fps: number;
    bitrate: number;
    duration: number;
    stability: number;
    lighting: number;
  };
  content: {
    scenes: number;
    movements: string[];
    complexity: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
}

export interface AIProcessingJob {
  id: string;
  type: 'motion_tracking' | 'video_analysis' | 'pose_estimation' | 'dance_recognition';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  result?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface TrainingDataset {
  id: string;
  name: string;
  type: 'dance_motion' | 'pose_estimation' | 'movement_patterns';
  source: 'premiere' | 'custom' | 'public';
  size: number;
  samplesCount: number;
  createdAt: string;
}

/**
 * Get available AI models
 */
export const getAIModels = async (): Promise<ApiResponse<AIModel[]>> => {
  return await client.get<AIModel[]>('/ai/models');
};

/**
 * Get specific AI model details
 */
export const getAIModel = async (modelId: string): Promise<ApiResponse<AIModel>> => {
  return await client.get<AIModel>(`/ai/models/${modelId}`);
};

/**
 * Process motion tracking
 */
export const processMotionTracking = async (
  request: MotionTrackingRequest,
): Promise<ApiResponse<AIProcessingJob>> => {
  return await client.post<AIProcessingJob>('/ai/motion-tracking', request);
};

/**
 * Get motion tracking result
 */
export const getMotionTrackingResult = async (
  jobId: string,
): Promise<ApiResponse<MotionTrackingResult>> => {
  return await client.get<MotionTrackingResult>(`/ai/motion-tracking/${jobId}`);
};

/**
 * Analyze video
 */
export const analyzeVideo = async (
  request: VideoAnalysisRequest,
): Promise<ApiResponse<AIProcessingJob>> => {
  return await client.post<AIProcessingJob>('/ai/video-analysis', request);
};

/**
 * Get video analysis result
 */
export const getVideoAnalysisResult = async (
  jobId: string,
): Promise<ApiResponse<VideoAnalysisResult>> => {
  return await client.get<VideoAnalysisResult>(`/ai/video-analysis/${jobId}`);
};

/**
 * Estimate pose from image/frame
 */
export const estimatePose = async (data: {
  imageUrl?: string;
  imageData?: string;
  modelId?: string;
}): Promise<ApiResponse<MotionFrame>> => {
  return await client.post<MotionFrame>('/ai/pose-estimation', data);
};

/**
 * Recognize dance movements
 */
export const recognizeDance = async (data: {
  videoUrl?: string;
  videoData?: string;
  motionData?: MotionFrame[];
}): Promise<
  ApiResponse<{
    danceType: string;
    confidence: number;
    movements: string[];
    bpm?: number;
  }>
> => {
  return await client.post('/ai/dance-recognition', data);
};

/**
 * Get processing job status
 */
export const getJobStatus = async (jobId: string): Promise<ApiResponse<AIProcessingJob>> => {
  return await client.get<AIProcessingJob>(`/ai/jobs/${jobId}`);
};

/**
 * Get all processing jobs
 */
export const getProcessingJobs = async (params?: {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<AIProcessingJob[]>> => {
  return await client.get<AIProcessingJob[]>('/ai/jobs', { params });
};

/**
 * Cancel processing job
 */
export const cancelJob = async (jobId: string): Promise<ApiResponse<void>> => {
  return await client.post<void>(`/ai/jobs/${jobId}/cancel`);
};

/**
 * Upload video for processing
 */
export const uploadVideo = async (
  file: File | Blob,
  metadata?: Record<string, any>,
): Promise<ApiResponse<{ videoId: string; url: string }>> => {
  const formData = new FormData();
  formData.append('video', file);
  if (metadata) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  return await client.post<{ videoId: string; url: string }>('/ai/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * Get training datasets
 */
export const getTrainingDatasets = async (params?: {
  type?: string;
  source?: string;
  limit?: number;
}): Promise<ApiResponse<TrainingDataset[]>> => {
  return await client.get<TrainingDataset[]>('/ai/datasets', { params });
};

/**
 * Get dataset details
 */
export const getDataset = async (datasetId: string): Promise<ApiResponse<TrainingDataset>> => {
  return await client.get<TrainingDataset>(`/ai/datasets/${datasetId}`);
};

/**
 * Request model training with dataset
 */
export const trainModel = async (data: {
  modelType: string;
  datasetId: string;
  parameters?: Record<string, any>;
}): Promise<ApiResponse<{ trainingJobId: string }>> => {
  return await client.post<{ trainingJobId: string }>('/ai/training/start', data);
};

/**
 * Get model training status
 */
export const getTrainingStatus = async (
  trainingJobId: string,
): Promise<
  ApiResponse<{
    status: string;
    progress: number;
    epochs?: number;
    currentEpoch?: number;
    metrics?: Record<string, number>;
  }>
> => {
  return await client.get(`/ai/training/${trainingJobId}`);
};
