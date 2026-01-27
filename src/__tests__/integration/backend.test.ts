/**
 * Integration Tests for Backend API
 */

import * as BackendAPI from '../../api/backend';
import { client } from '../../api/client';

// Mock the API client
jest.mock('../../api/client', () => ({
  client: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

describe('Backend API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Backend Configuration', () => {
    it('should fetch backend configuration', async () => {
      const mockConfig = {
        baseUrl: 'https://backend.stepflow.app',
        wsUrl: 'wss://backend.stepflow.app/ws',
        apiVersion: 'v1',
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockConfig,
        success: true,
      });

      const result = await BackendAPI.getBackendConfig();

      expect(result.data).toEqual(mockConfig);
      expect(client.get).toHaveBeenCalledWith('/backend/config');
    });

    it('should test backend connectivity', async () => {
      (client.get as jest.Mock).mockResolvedValue({
        data: { status: 'healthy' },
        success: true,
      });

      const result = await BackendAPI.testConnection();

      expect(result.data.status).toBe('healthy');
      expect(result.data.latency).toBeGreaterThanOrEqual(0);
      expect(client.get).toHaveBeenCalledWith('/backend/health');
    });
  });

  describe('Workflow Tasks', () => {
    it('should create a workflow task', async () => {
      const mockTask = {
        id: 'task-123',
        type: 'motion_analysis' as const,
        status: 'pending' as const,
        userId: 'user-123',
        data: { sessionId: 'session-123' },
        createdAt: '2026-01-27T00:00:00Z',
        updatedAt: '2026-01-27T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockTask,
        success: true,
      });

      const result = await BackendAPI.createWorkflowTask({
        type: 'motion_analysis',
        userId: 'user-123',
        data: { sessionId: 'session-123' },
      });

      expect(result.data).toEqual(mockTask);
      expect(client.post).toHaveBeenCalledWith('/backend/tasks', {
        type: 'motion_analysis',
        userId: 'user-123',
        data: { sessionId: 'session-123' },
      });
    });

    it('should get task status', async () => {
      const mockTask = {
        id: 'task-123',
        status: 'completed',
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockTask,
        success: true,
      });

      const result = await BackendAPI.getTaskStatus('task-123');

      expect(result.data).toEqual(mockTask);
      expect(client.get).toHaveBeenCalledWith('/backend/tasks/task-123');
    });

    it('should retry a failed task', async () => {
      const mockTask = {
        id: 'task-123',
        status: 'pending',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockTask,
        success: true,
      });

      const result = await BackendAPI.retryTask('task-123');

      expect(result.data.status).toBe('pending');
      expect(client.post).toHaveBeenCalledWith('/backend/tasks/task-123/retry');
    });
  });

  describe('Content Archival', () => {
    it('should archive content', async () => {
      const mockArchive = {
        id: 'archive-123',
        type: 'session' as const,
        sessionId: 'session-123',
        userId: 'user-123',
        url: 'https://cdn.stepflow.app/session-123.mp4',
        metadata: {},
        archived: true,
        archivedAt: '2026-01-27T00:00:00Z',
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockArchive,
        success: true,
      });

      const result = await BackendAPI.archiveContent({
        type: 'session',
        sessionId: 'session-123',
        userId: 'user-123',
        url: 'https://cdn.stepflow.app/session-123.mp4',
        metadata: {},
      });

      expect(result.data.archived).toBe(true);
      expect(client.post).toHaveBeenCalledWith('/backend/archive', expect.any(Object));
    });

    it('should restore archived content', async () => {
      const mockArchive = {
        id: 'archive-123',
        archived: false,
      };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockArchive,
        success: true,
      });

      const result = await BackendAPI.restoreContent('archive-123');

      expect(result.data.archived).toBe(false);
      expect(client.post).toHaveBeenCalledWith('/backend/archive/archive-123/restore');
    });
  });

  describe('Synchronization', () => {
    it('should get sync status', async () => {
      const mockStatus = {
        lastSync: '2026-01-27T00:00:00Z',
        pendingTasks: 5,
        failedTasks: 1,
        syncEnabled: true,
      };

      (client.get as jest.Mock).mockResolvedValue({
        data: mockStatus,
        success: true,
      });

      const result = await BackendAPI.getSyncStatus();

      expect(result.data).toEqual(mockStatus);
      expect(client.get).toHaveBeenCalledWith('/backend/sync/status');
    });

    it('should trigger manual sync', async () => {
      const mockResponse = { taskId: 'sync-task-123' };

      (client.post as jest.Mock).mockResolvedValue({
        data: mockResponse,
        success: true,
      });

      const result = await BackendAPI.triggerSync();

      expect(result.data.taskId).toBe('sync-task-123');
      expect(client.post).toHaveBeenCalledWith('/backend/sync/trigger');
    });

    it('should enable/disable auto-sync', async () => {
      const mockStatus = {
        lastSync: '2026-01-27T00:00:00Z',
        pendingTasks: 0,
        failedTasks: 0,
        syncEnabled: false,
      };

      (client.patch as jest.Mock).mockResolvedValue({
        data: mockStatus,
        success: true,
      });

      const result = await BackendAPI.setSyncEnabled(false);

      expect(result.data.syncEnabled).toBe(false);
      expect(client.patch).toHaveBeenCalledWith('/backend/sync/settings', { enabled: false });
    });
  });
});
