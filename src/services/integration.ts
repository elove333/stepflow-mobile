/**
 * Integration Orchestrator
 * Manages workflows between STEPFLOW-mobile, STEPFLOW-backend, and STEPFLOW-AI
 */

import * as BackendAPI from '../api/backend';
import * as AIAPI from '../api/ai';
import * as PremiereAPI from '../api/premiere';
import { wsService } from './websocket';

export interface WorkflowConfig {
  enableAutoSync: boolean;
  enableRealtime: boolean;
  retryFailedTasks: boolean;
  maxRetries: number;
}

export interface SessionWorkflow {
  sessionId: string;
  userId: string;
  steps: WorkflowStep[];
  currentStep: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface WorkflowStep {
  name: string;
  type: 'video_upload' | 'motion_tracking' | 'ai_analysis' | 'archive' | 'notification';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  taskId?: string;
  result?: any;
  error?: string;
}

class IntegrationOrchestrator {
  private config: WorkflowConfig;
  private activeWorkflows: Map<string, SessionWorkflow> = new Map();

  constructor() {
    this.config = {
      enableAutoSync: true,
      enableRealtime: true,
      retryFailedTasks: true,
      maxRetries: 3,
    };

    this.initializeRealtimeListeners();
  }

  /**
   * Initialize real-time event listeners
   */
  private initializeRealtimeListeners(): void {
    // Listen for task completion events
    wsService.on('task:completed', (message) => {
      this.handleTaskCompleted(message.payload);
    });

    // Listen for task failure events
    wsService.on('task:failed', (message) => {
      this.handleTaskFailed(message.payload);
    });

    // Listen for sync events
    wsService.on('sync:update', (message) => {
      this.handleSyncUpdate(message.payload);
    });
  }

  /**
   * Process session with full workflow
   * Includes: video upload -> motion tracking -> AI analysis -> archival
   */
  async processSession(
    sessionId: string,
    videoFile: File | Blob,
    userId: string,
  ): Promise<SessionWorkflow> {
    if (!userId) {
      throw new Error('userId is required for session processing');
    }

    const workflow: SessionWorkflow = {
      sessionId,
      userId,
      steps: [
        { name: 'Upload Video', type: 'video_upload', status: 'pending' },
        { name: 'Motion Tracking', type: 'motion_tracking', status: 'pending' },
        { name: 'AI Analysis', type: 'ai_analysis', status: 'pending' },
        { name: 'Archive Content', type: 'archive', status: 'pending' },
      ],
      currentStep: 0,
      status: 'in_progress',
    };

    this.activeWorkflows.set(sessionId, workflow);

    try {
      // Step 1: Upload video
      workflow.steps[0].status = 'in_progress';
      const uploadResult = await AIAPI.uploadVideo(videoFile, { sessionId });
      workflow.steps[0].status = 'completed';
      workflow.steps[0].result = uploadResult.data;
      workflow.currentStep = 1;

      // Step 2: Motion tracking
      workflow.steps[1].status = 'in_progress';
      const motionJob = await AIAPI.processMotionTracking({
        videoUrl: uploadResult.data.url,
        sessionId,
      });
      workflow.steps[1].taskId = motionJob.data.id;
      
      // Wait for motion tracking to complete
      const motionResult = await this.waitForJobCompletion(motionJob.data.id);
      workflow.steps[1].status = 'completed';
      workflow.steps[1].result = motionResult;
      workflow.currentStep = 2;

      // Step 3: AI Analysis (3D motion + dance recognition)
      workflow.steps[2].status = 'in_progress';
      const [motion3D, danceRecognition] = await Promise.all([
        PremiereAPI.analyze3DMotion({
          videoUrl: uploadResult.data.url,
          sessionId,
        }),
        AIAPI.recognizeDance({
          videoUrl: uploadResult.data.url,
        }),
      ]);
      workflow.steps[2].status = 'completed';
      workflow.steps[2].result = { motion3D: motion3D.data, danceRecognition: danceRecognition.data };
      workflow.currentStep = 3;

      // Step 4: Archive content
      workflow.steps[3].status = 'in_progress';
      await BackendAPI.archiveContent({
        type: 'session',
        sessionId,
        userId: workflow.userId,
        url: uploadResult.data.url,
        metadata: {
          motionTracking: motionResult,
          motion3D: motion3D.data,
          danceRecognition: danceRecognition.data,
        },
      });
      workflow.steps[3].status = 'completed';
      workflow.currentStep = 4;

      workflow.status = 'completed';
      return workflow;
    } catch (error) {
      workflow.status = 'failed';
      workflow.steps[workflow.currentStep].status = 'failed';
      workflow.steps[workflow.currentStep].error = (error as Error).message;
      throw error;
    }
  }

  /**
   * Wait for AI job to complete
   */
  private async waitForJobCompletion(jobId: string, maxWaitTime = 300000): Promise<any> {
    const startTime = Date.now();
    const pollInterval = 2000;

    while (Date.now() - startTime < maxWaitTime) {
      const jobStatus = await AIAPI.getJobStatus(jobId);
      
      if (jobStatus.data.status === 'completed') {
        return jobStatus.data.result;
      }

      if (jobStatus.data.status === 'failed') {
        throw new Error(jobStatus.data.error || 'Job failed');
      }

      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Job timeout');
  }

  /**
   * Create backend workflow task
   */
  async createWorkflowTask(
    type: 'motion_analysis' | 'video_processing' | 'ai_inference' | 'content_archival',
    data: Record<string, any>,
    userId: string,
  ): Promise<BackendAPI.WorkflowTask> {
    if (!userId) {
      throw new Error('userId is required for creating workflow tasks');
    }

    const task = await BackendAPI.createWorkflowTask({
      type,
      userId,
      data,
    });

    return task.data;
  }

  /**
   * Handle task completed event
   */
  private handleTaskCompleted(payload: any): void {
    console.log('Task completed:', payload);
    
    // Update workflow if exists
    const workflow = this.activeWorkflows.get(payload.sessionId);
    if (workflow) {
      const step = workflow.steps.find(s => s.taskId === payload.taskId);
      if (step) {
        step.status = 'completed';
        step.result = payload.result;
      }
    }
  }

  /**
   * Handle task failed event
   */
  private handleTaskFailed(payload: any): void {
    console.error('Task failed:', payload);
    
    // Update workflow and retry if configured
    const workflow = this.activeWorkflows.get(payload.sessionId);
    if (workflow) {
      const step = workflow.steps.find(s => s.taskId === payload.taskId);
      if (step) {
        step.status = 'failed';
        step.error = payload.error;

        if (this.config.retryFailedTasks) {
          this.retryFailedStep(workflow, step);
        }
      }
    }
  }

  /**
   * Handle sync update event
   */
  private handleSyncUpdate(payload: any): void {
    console.log('Sync update:', payload);
  }

  /**
   * Retry failed workflow step
   */
  private async retryFailedStep(workflow: SessionWorkflow, step: WorkflowStep): Promise<void> {
    // Implementation for retrying failed steps
    console.log(`Retrying step: ${step.name}`);
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(sessionId: string): SessionWorkflow | undefined {
    return this.activeWorkflows.get(sessionId);
  }

  /**
   * Sync session data
   */
  async syncSessionData(sessionId: string): Promise<void> {
    const syncTask = await BackendAPI.triggerSync();
    console.log(`Sync triggered: ${syncTask.data.taskId}`);
  }

  /**
   * Enable/disable auto-sync
   */
  async setAutoSync(enabled: boolean): Promise<void> {
    await BackendAPI.setSyncEnabled(enabled);
    this.config.enableAutoSync = enabled;
  }

  /**
   * Update orchestrator configuration
   */
  updateConfig(config: Partial<WorkflowConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get active workflows
   */
  getActiveWorkflows(): SessionWorkflow[] {
    return Array.from(this.activeWorkflows.values());
  }

  /**
   * Clear completed workflows
   */
  clearCompletedWorkflows(): void {
    for (const [sessionId, workflow] of this.activeWorkflows.entries()) {
      if (workflow.status === 'completed') {
        this.activeWorkflows.delete(sessionId);
      }
    }
  }
}

export const integrationOrchestrator = new IntegrationOrchestrator();
