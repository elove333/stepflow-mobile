/**
 * PREMIERE Tools Integration
 * Integrates PREMIERE's 3D motion analysis, diarization, translation, and CMS tools
 */

import { client, ApiResponse } from './client';

export interface Motion3DAnalysis {
  id: string;
  sessionId?: string;
  points3D: Point3D[];
  skeleton: Skeleton3D;
  metrics: {
    range: { x: number; y: number; z: number };
    velocity: { avg: number; max: number; min: number };
    acceleration: { avg: number; max: number; min: number };
    stability: number;
  };
  timestamp: string;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  confidence: number;
  jointName: string;
}

export interface Skeleton3D {
  joints: Point3D[];
  bones: Array<{
    start: string;
    end: string;
    length: number;
  }>;
  pose: {
    pitch: number;
    yaw: number;
    roll: number;
  };
}

export interface DiarizationRequest {
  audioUrl?: string;
  audioData?: string; // Base64 encoded
  language?: string;
  speakerCount?: number;
}

export interface DiarizationResult {
  id: string;
  segments: Array<{
    start: number;
    end: number;
    speaker: string;
    text?: string;
    confidence: number;
  }>;
  speakers: Array<{
    id: string;
    label: string;
    totalDuration: number;
  }>;
  processingTime: number;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: 'dance' | 'fitness' | 'general';
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  alternatives?: string[];
}

export interface DanceMotionDataset {
  id: string;
  name: string;
  description: string;
  danceStyle: string;
  samplesCount: number;
  duration: number; // seconds
  features: string[];
  metadata: {
    bpmRange: { min: number; max: number };
    difficulty: string;
    recordingQuality: string;
  };
  createdAt: string;
}

export interface CMSContent {
  id: string;
  type: 'video' | 'audio' | 'document' | 'image' | 'motion_data';
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  metadata: Record<string, any>;
  tags: string[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Perform 3D motion analysis
 */
export const analyze3DMotion = async (data: {
  videoUrl?: string;
  videoData?: string;
  motionData?: any;
  sessionId?: string;
}): Promise<ApiResponse<Motion3DAnalysis>> => {
  return await client.post<Motion3DAnalysis>('/premiere/motion-3d', data);
};

/**
 * Get 3D motion analysis result
 */
export const get3DMotionAnalysis = async (
  analysisId: string,
): Promise<ApiResponse<Motion3DAnalysis>> => {
  return await client.get<Motion3DAnalysis>(`/premiere/motion-3d/${analysisId}`);
};

/**
 * Perform audio diarization
 */
export const diarizeAudio = async (
  request: DiarizationRequest,
): Promise<ApiResponse<{ jobId: string }>> => {
  return await client.post<{ jobId: string }>('/premiere/diarization', request);
};

/**
 * Get diarization result
 */
export const getDiarizationResult = async (
  jobId: string,
): Promise<ApiResponse<DiarizationResult>> => {
  return await client.get<DiarizationResult>(`/premiere/diarization/${jobId}`);
};

/**
 * Translate text
 */
export const translateText = async (
  request: TranslationRequest,
): Promise<ApiResponse<TranslationResult>> => {
  return await client.post<TranslationResult>('/premiere/translation', request);
};

/**
 * Batch translate
 */
export const batchTranslate = async (
  requests: TranslationRequest[],
): Promise<ApiResponse<TranslationResult[]>> => {
  return await client.post<TranslationResult[]>('/premiere/translation/batch', { translations: requests });
};

/**
 * Get available languages for translation
 */
export const getAvailableLanguages = async (): Promise<
  ApiResponse<Array<{ code: string; name: string; native: string }>>
> => {
  return await client.get('/premiere/translation/languages');
};

/**
 * Get Dance Motion Datasets from PREMIERE
 */
export const getDanceMotionDatasets = async (params?: {
  danceStyle?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<DanceMotionDataset[]>> => {
  return await client.get<DanceMotionDataset[]>('/premiere/datasets/dance-motion', { params });
};

/**
 * Get specific dance motion dataset
 */
export const getDanceMotionDataset = async (
  datasetId: string,
): Promise<ApiResponse<DanceMotionDataset>> => {
  return await client.get<DanceMotionDataset>(`/premiere/datasets/dance-motion/${datasetId}`);
};

/**
 * Download dataset samples
 */
export const downloadDatasetSamples = async (
  datasetId: string,
  sampleIds?: string[],
): Promise<ApiResponse<{ downloadUrl: string; expiresAt: string }>> => {
  return await client.post<{ downloadUrl: string; expiresAt: string }>(
    `/premiere/datasets/dance-motion/${datasetId}/download`,
    { sampleIds },
  );
};

/**
 * Get CMS content
 */
export const getCMSContent = async (params?: {
  type?: string;
  tags?: string[];
  archived?: boolean;
  limit?: number;
  offset?: number;
}): Promise<ApiResponse<CMSContent[]>> => {
  return await client.get<CMSContent[]>('/premiere/cms/content', { params });
};

/**
 * Get specific CMS content
 */
export const getCMSContentById = async (contentId: string): Promise<ApiResponse<CMSContent>> => {
  return await client.get<CMSContent>(`/premiere/cms/content/${contentId}`);
};

/**
 * Create CMS content
 */
export const createCMSContent = async (
  content: Omit<CMSContent, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<ApiResponse<CMSContent>> => {
  return await client.post<CMSContent>('/premiere/cms/content', content);
};

/**
 * Update CMS content
 */
export const updateCMSContent = async (
  contentId: string,
  updates: Partial<CMSContent>,
): Promise<ApiResponse<CMSContent>> => {
  return await client.patch<CMSContent>(`/premiere/cms/content/${contentId}`, updates);
};

/**
 * Archive CMS content
 */
export const archiveCMSContent = async (contentId: string): Promise<ApiResponse<CMSContent>> => {
  return await client.post<CMSContent>(`/premiere/cms/content/${contentId}/archive`);
};

/**
 * Search CMS content
 */
export const searchCMSContent = async (query: {
  text?: string;
  type?: string;
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiResponse<CMSContent[]>> => {
  return await client.post<CMSContent[]>('/premiere/cms/search', query);
};

/**
 * Get content processing status
 */
export const getContentProcessingStatus = async (
  contentId: string,
): Promise<
  ApiResponse<{
    status: string;
    progress: number;
    stages: Array<{ name: string; status: string; completedAt?: string }>;
  }>
> => {
  return await client.get(`/premiere/cms/content/${contentId}/processing`);
};
