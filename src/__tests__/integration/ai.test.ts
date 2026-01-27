/**
 * Integration Tests for AI API
 */

import * as AIAPI from '../../api/ai';
import { client } from '../../api/client';

jest.mock('../../api/client', () => ({
  client: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

describe('AI API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AI Models', () => {
    it('should fetch available AI models', async () => {
      const mockModels = [
        {
          id: 'model-1',
          name: 'Pose Estimator v2',
          type: 'pose_estimation' as const,
          version: '2.0',
          status: 'available' as const,
          accuracy: 0.95,
        },
      ];

      (client.get as jest.Mock).mockResolvedValue({
        data: mockModels,
        success: true,
      });

      const result = await AIAPI.getAIModels();

      expect(result.data).toEqual(mockModels);
      expect(client.get).toHaveBeenCalledWith('/ai/models');
    });

    it('should get specific AI model details', async () => {
      const mockModel = {
        id: 'model-1',
        name: 'Pose Estimator v2',
        type: 'pose_estimation' as const,
        version: '2.0',
        status: 'available' as const,
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockModel,
        success: true,
      });

      const result = await AIAPI.getAIModel('model-1');

      expect(result.data).toEqual(mockModel);
      expect(client.get).toHaveBeenCalledWith('/ai/models/model-1');
    });
  });

  describe('Motion Tracking', () => {
    it('should process motion tracking request', async () => {
      const mockJob = {
        id: 'job-123',
        type: 'motion_tracking' as const,
        status: 'queued' as const,
        progress: 0,
        createdAt: '2026-01-27T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockJob,
        success: true,
      });

      const result = await AIAPI.processMotionTracking({
        videoUrl: 'https://cdn.stepflow.app/video.mp4',
        sessionId: 'session-123',
      });

      expect(result.data).toEqual(mockJob);
      expect(client.post).toHaveBeenCalledWith('/ai/motion-tracking', expect.any(Object));
    });

    it('should get motion tracking result', async () => {
      const mockResult = {
        id: 'result-123',
        frames: [],
        summary: {
          totalFrames: 100,
          averageConfidence: 0.92,
          detectedMovements: ['walking', 'jumping'],
          quality: 'high' as const,
        },
        processingTime: 5000,
        createdAt: '2026-01-27T00:00:00Z',
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockResult,
        success: true,
      });

      const result = await AIAPI.getMotionTrackingResult('job-123');

      expect(result.data).toEqual(mockResult);
      expect(client.get).toHaveBeenCalledWith('/ai/motion-tracking/job-123');
    });
  });

  describe('Video Analysis', () => {
    it('should analyze video', async () => {
      const mockJob = {
        id: 'job-456',
        type: 'video_analysis' as const,
        status: 'processing' as const,
        progress: 50,
        createdAt: '2026-01-27T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockJob,
        success: true,
      });

      const result = await AIAPI.analyzeVideo({
        videoUrl: 'https://cdn.stepflow.app/video.mp4',
        analysisType: 'comprehensive',
      });

      expect(result.data).toEqual(mockJob);
      expect(client.post).toHaveBeenCalledWith('/ai/video-analysis', expect.any(Object));
    });

    it('should get video analysis result', async () => {
      const mockResult = {
        id: 'result-456',
        quality: {
          resolution: '1920x1080',
          fps: 30,
          bitrate: 5000,
          duration: 60,
          stability: 0.9,
          lighting: 0.8,
        },
        content: {
          scenes: 3,
          movements: ['dance', 'exercise'],
          complexity: 'medium' as const,
        },
        recommendations: ['Improve lighting', 'Stabilize camera'],
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockResult,
        success: true,
      });

      const result = await AIAPI.getVideoAnalysisResult('job-456');

      expect(result.data).toEqual(mockResult);
      expect(client.get).toHaveBeenCalledWith('/ai/video-analysis/job-456');
    });
  });

  describe('Pose Estimation', () => {
    it('should estimate pose from image', async () => {
      const mockFrame = {
        frameNumber: 0,
        timestamp: 0,
        keypoints: [
          { name: 'nose', x: 0.5, y: 0.3, confidence: 0.95 },
          { name: 'left_shoulder', x: 0.4, y: 0.4, confidence: 0.92 },
        ],
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockFrame,
        success: true,
      });

      const result = await AIAPI.estimatePose({
        imageUrl: 'https://cdn.stepflow.app/frame.jpg',
      });

      expect(result.data).toEqual(mockFrame);
      expect(client.post).toHaveBeenCalledWith('/ai/pose-estimation', expect.any(Object));
    });
  });

  describe('Dance Recognition', () => {
    it('should recognize dance movements', async () => {
      const mockRecognition = {
        danceType: 'hip-hop',
        confidence: 0.88,
        movements: ['wave', 'pop', 'lock'],
        bpm: 120,
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockRecognition,
        success: true,
      });

      const result = await AIAPI.recognizeDance({
        videoUrl: 'https://cdn.stepflow.app/dance.mp4',
      });

      expect(result.data).toEqual(mockRecognition);
      expect(client.post).toHaveBeenCalledWith('/ai/dance-recognition', expect.any(Object));
    });
  });

  describe('Processing Jobs', () => {
    it('should get job status', async () => {
      const mockJob = {
        id: 'job-789',
        type: 'motion_tracking' as const,
        status: 'completed' as const,
        progress: 100,
        result: { success: true },
        createdAt: '2026-01-27T00:00:00Z',
        completedAt: '2026-01-27T00:05:00Z',
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockJob,
        success: true,
      });

      const result = await AIAPI.getJobStatus('job-789');

      expect(result.data).toEqual(mockJob);
      expect(client.get).toHaveBeenCalledWith('/ai/jobs/job-789');
    });

    it('should cancel processing job', async () => {
      (client.post as jest.Mock).mockResolvedValue({
        data: undefined,
        success: true,
      });

      await AIAPI.cancelJob('job-789');

      expect(client.post).toHaveBeenCalledWith('/ai/jobs/job-789/cancel');
    });
  });

  describe('Training', () => {
    it('should get training datasets', async () => {
      const mockDatasets = [
        {
          id: 'dataset-1',
          name: 'Dance Motion Dataset',
          type: 'dance_motion' as const,
          source: 'premiere' as const,
          size: 1024000,
          samplesCount: 1000,
          createdAt: '2026-01-27T00:00:00Z',
        },
      ];

      (client.get as jest.Mock).mockResolvedValue({
        data: mockDatasets,
        success: true,
      });

      const result = await AIAPI.getTrainingDatasets();

      expect(result.data).toEqual(mockDatasets);
      expect(client.get).toHaveBeenCalledWith('/ai/datasets', { params: undefined });
    });

    it('should request model training', async () => {
      const mockResponse = { trainingJobId: 'training-123' };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
        success: true,
      });

      const result = await AIAPI.trainModel({
        modelType: 'pose_estimation',
        datasetId: 'dataset-1',
      });

      expect(result.data.trainingJobId).toBe('training-123');
      expect(client.post).toHaveBeenCalledWith('/ai/training/start', expect.any(Object));
    });

    it('should get training status', async () => {
      const mockStatus = {
        status: 'training',
        progress: 60,
        epochs: 10,
        currentEpoch: 6,
        metrics: { accuracy: 0.87, loss: 0.15 },
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockStatus,
        success: true,
      });

      const result = await AIAPI.getTrainingStatus('training-123');

      expect(result.data).toEqual(mockStatus);
      expect(client.get).toHaveBeenCalledWith('/ai/training/training-123');
    });
  });
});
