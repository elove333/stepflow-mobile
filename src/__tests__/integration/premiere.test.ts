/**
 * Integration Tests for PREMIERE API
 */

import * as PremiereAPI from '../../api/premiere';
import { client } from '../../api/client';

jest.mock('../../api/client', () => ({
  client: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('PREMIERE API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('3D Motion Analysis', () => {
    it('should perform 3D motion analysis', async () => {
      const mockAnalysis = {
        id: 'analysis-123',
        sessionId: 'session-123',
        points3D: [],
        skeleton: {
          joints: [],
          bones: [],
          pose: { pitch: 0, yaw: 0, roll: 0 },
        },
        metrics: {
          range: { x: 1.5, y: 2.0, z: 1.0 },
          velocity: { avg: 1.2, max: 3.5, min: 0.1 },
          acceleration: { avg: 0.5, max: 2.0, min: 0.0 },
          stability: 0.85,
        },
        timestamp: '2026-01-27T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockAnalysis,
        success: true,
      });

      const result = await PremiereAPI.analyze3DMotion({
        videoUrl: 'https://cdn.stepflow.app/video.mp4',
        sessionId: 'session-123',
      });

      expect(result.data).toEqual(mockAnalysis);
      expect(client.post).toHaveBeenCalledWith('/premiere/motion-3d', expect.any(Object));
    });

    it('should get 3D motion analysis result', async () => {
      const mockAnalysis = {
        id: 'analysis-123',
        points3D: [],
        skeleton: {
          joints: [],
          bones: [],
          pose: { pitch: 0, yaw: 0, roll: 0 },
        },
        metrics: {
          range: { x: 1.5, y: 2.0, z: 1.0 },
          velocity: { avg: 1.2, max: 3.5, min: 0.1 },
          acceleration: { avg: 0.5, max: 2.0, min: 0.0 },
          stability: 0.85,
        },
        timestamp: '2026-01-27T00:00:00Z',
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockAnalysis,
        success: true,
      });

      const result = await PremiereAPI.get3DMotionAnalysis('analysis-123');

      expect(result.data).toEqual(mockAnalysis);
      expect(client.get).toHaveBeenCalledWith('/premiere/motion-3d/analysis-123');
    });
  });

  describe('Audio Diarization', () => {
    it('should perform audio diarization', async () => {
      const mockResponse = { jobId: 'diarization-123' };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
        success: true,
      });

      const result = await PremiereAPI.diarizeAudio({
        audioUrl: 'https://cdn.stepflow.app/audio.mp3',
        language: 'en',
        speakerCount: 2,
      });

      expect(result.data.jobId).toBe('diarization-123');
      expect(client.post).toHaveBeenCalledWith('/premiere/diarization', expect.any(Object));
    });

    it('should get diarization result', async () => {
      const mockResult = {
        id: 'diarization-123',
        segments: [
          { start: 0, end: 5, speaker: 'speaker_1', text: 'Hello', confidence: 0.95 },
          { start: 5, end: 10, speaker: 'speaker_2', text: 'Hi there', confidence: 0.93 },
        ],
        speakers: [
          { id: 'speaker_1', label: 'Speaker 1', totalDuration: 5 },
          { id: 'speaker_2', label: 'Speaker 2', totalDuration: 5 },
        ],
        processingTime: 2000,
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockResult,
        success: true,
      });

      const result = await PremiereAPI.getDiarizationResult('diarization-123');

      expect(result.data).toEqual(mockResult);
      expect(client.get).toHaveBeenCalledWith('/premiere/diarization/diarization-123');
    });
  });

  describe('Translation', () => {
    it('should translate text', async () => {
      const mockTranslation = {
        originalText: 'Hello',
        translatedText: 'Hola',
        sourceLanguage: 'en',
        targetLanguage: 'es',
        confidence: 0.98,
        alternatives: ['¡Hola!', 'Buenos días'],
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockTranslation,
        success: true,
      });

      const result = await PremiereAPI.translateText({
        text: 'Hello',
        sourceLanguage: 'en',
        targetLanguage: 'es',
      });

      expect(result.data).toEqual(mockTranslation);
      expect(client.post).toHaveBeenCalledWith('/premiere/translation', expect.any(Object));
    });

    it('should batch translate texts', async () => {
      const mockTranslations = [
        {
          originalText: 'Hello',
          translatedText: 'Hola',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          confidence: 0.98,
        },
        {
          originalText: 'Goodbye',
          translatedText: 'Adiós',
          sourceLanguage: 'en',
          targetLanguage: 'es',
          confidence: 0.97,
        },
      ];

      (client.post as jest.Mock).mockResolvedValue({
        data: mockTranslations,
        success: true,
      });

      const result = await PremiereAPI.batchTranslate([
        { text: 'Hello', sourceLanguage: 'en', targetLanguage: 'es' },
        { text: 'Goodbye', sourceLanguage: 'en', targetLanguage: 'es' },
      ]);

      expect(result.data).toEqual(mockTranslations);
      expect(client.post).toHaveBeenCalledWith('/premiere/translation/batch', expect.any(Object));
    });

    it('should get available languages', async () => {
      const mockLanguages = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'fr', name: 'French', native: 'Français' },
      ];

      (client.get as jest.Mock).mockResolvedValue({
        data: mockLanguages,
        success: true,
      });

      const result = await PremiereAPI.getAvailableLanguages();

      expect(result.data).toEqual(mockLanguages);
      expect(client.get).toHaveBeenCalledWith('/premiere/translation/languages');
    });
  });

  describe('Dance Motion Datasets', () => {
    it('should get dance motion datasets', async () => {
      const mockDatasets = [
        {
          id: 'dataset-1',
          name: 'Hip Hop Basics',
          description: 'Basic hip hop movements',
          danceStyle: 'hip-hop',
          samplesCount: 500,
          duration: 3600,
          features: ['wave', 'pop', 'lock'],
          metadata: {
            bpmRange: { min: 80, max: 140 },
            difficulty: 'beginner',
            recordingQuality: 'high',
          },
          createdAt: '2026-01-27T00:00:00Z',
        },
      ];

      (client.get as jest.Mock).mockResolvedValue({
        data: mockDatasets,
        success: true,
      });

      const result = await PremiereAPI.getDanceMotionDatasets({
        danceStyle: 'hip-hop',
        difficulty: 'beginner',
      });

      expect(result.data).toEqual(mockDatasets);
      expect(client.get).toHaveBeenCalledWith('/premiere/datasets/dance-motion', {
        params: { danceStyle: 'hip-hop', difficulty: 'beginner' },
      });
    });

    it('should get specific dance motion dataset', async () => {
      const mockDataset = {
        id: 'dataset-1',
        name: 'Hip Hop Basics',
        description: 'Basic hip hop movements',
        danceStyle: 'hip-hop',
        samplesCount: 500,
        duration: 3600,
        features: ['wave', 'pop', 'lock'],
        metadata: {
          bpmRange: { min: 80, max: 140 },
          difficulty: 'beginner',
          recordingQuality: 'high',
        },
        createdAt: '2026-01-27T00:00:00Z',
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockDataset,
        success: true,
      });

      const result = await PremiereAPI.getDanceMotionDataset('dataset-1');

      expect(result.data).toEqual(mockDataset);
      expect(client.get).toHaveBeenCalledWith('/premiere/datasets/dance-motion/dataset-1');
    });

    it('should download dataset samples', async () => {
      const mockDownload = {
        downloadUrl: 'https://cdn.stepflow.app/dataset-1/samples.zip',
        expiresAt: '2026-01-28T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockDownload,
        success: true,
      });

      const result = await PremiereAPI.downloadDatasetSamples('dataset-1', ['sample-1', 'sample-2']);

      expect(result.data).toEqual(mockDownload);
      expect(client.post).toHaveBeenCalledWith(
        '/premiere/datasets/dance-motion/dataset-1/download',
        { sampleIds: ['sample-1', 'sample-2'] },
      );
    });
  });

  describe('CMS Content', () => {
    it('should get CMS content', async () => {
      const mockContent = [
        {
          id: 'content-1',
          type: 'video' as const,
          title: 'Tutorial Video',
          url: 'https://cdn.stepflow.app/tutorial.mp4',
          metadata: {},
          tags: ['tutorial', 'beginner'],
          archived: false,
          createdAt: '2026-01-27T00:00:00Z',
          updatedAt: '2026-01-27T00:00:00Z',
        },
      ];

      (client.get as jest.Mock).mockResolvedValue({
        data: mockContent,
        success: true,
      });

      const result = await PremiereAPI.getCMSContent({ type: 'video' });

      expect(result.data).toEqual(mockContent);
      expect(client.get).toHaveBeenCalledWith('/premiere/cms/content', {
        params: { type: 'video' },
      });
    });

    it('should create CMS content', async () => {
      const mockContent = {
        id: 'content-2',
        type: 'video' as const,
        title: 'New Tutorial',
        url: 'https://cdn.stepflow.app/new-tutorial.mp4',
        metadata: {},
        tags: ['tutorial'],
        archived: false,
        createdAt: '2026-01-27T00:00:00Z',
        updatedAt: '2026-01-27T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockContent,
        success: true,
      });

      const result = await PremiereAPI.createCMSContent({
        type: 'video',
        title: 'New Tutorial',
        url: 'https://cdn.stepflow.app/new-tutorial.mp4',
        metadata: {},
        tags: ['tutorial'],
        archived: false,
      });

      expect(result.data).toEqual(mockContent);
      expect(client.post).toHaveBeenCalledWith('/premiere/cms/content', expect.any(Object));
    });

    it('should archive CMS content', async () => {
      const mockContent = {
        id: 'content-1',
        archived: true,
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockContent,
        success: true,
      });

      const result = await PremiereAPI.archiveCMSContent('content-1');

      expect(result.data.archived).toBe(true);
      expect(client.post).toHaveBeenCalledWith('/premiere/cms/content/content-1/archive');
    });

    it('should search CMS content', async () => {
      const mockContent = [
        {
          id: 'content-1',
          type: 'video' as const,
          title: 'Tutorial Video',
          url: 'https://cdn.stepflow.app/tutorial.mp4',
          metadata: {},
          tags: ['tutorial'],
          archived: false,
          createdAt: '2026-01-27T00:00:00Z',
          updatedAt: '2026-01-27T00:00:00Z',
        },
      ];

      (client.post as jest.Mock).mockResolvedValue({
        data: mockContent,
        success: true,
      });

      const result = await PremiereAPI.searchCMSContent({
        text: 'tutorial',
        type: 'video',
        tags: ['beginner'],
      });

      expect(result.data).toEqual(mockContent);
      expect(client.post).toHaveBeenCalledWith('/premiere/cms/search', expect.any(Object));
    });
  });
});
