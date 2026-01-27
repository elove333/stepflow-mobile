/**
 * Workflow Configuration
 * Defines and manages workflow templates for different task types
 */

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStepTemplate[];
  triggers: WorkflowTrigger[];
  settings: WorkflowSettings;
}

export interface WorkflowStepTemplate {
  id: string;
  name: string;
  type: 'api_call' | 'ai_processing' | 'data_transform' | 'notification' | 'archive';
  action: string;
  parameters: Record<string, any>;
  retryPolicy?: RetryPolicy;
  timeout?: number; // milliseconds
  dependsOn?: string[]; // step IDs
}

export interface WorkflowTrigger {
  type: 'manual' | 'event' | 'schedule' | 'webhook';
  config: Record<string, any>;
}

export interface WorkflowSettings {
  maxConcurrent: number;
  priority: 'low' | 'normal' | 'high';
  notifyOnCompletion: boolean;
  notifyOnFailure: boolean;
}

export interface RetryPolicy {
  maxRetries: number;
  backoffMultiplier: number;
  initialDelay: number; // milliseconds
}

/**
 * Predefined workflow templates
 */
export const workflowTemplates: Record<string, WorkflowTemplate> = {
  // Session Processing Workflow
  sessionProcessing: {
    id: 'session-processing',
    name: 'Session Processing',
    description: 'Complete workflow for processing a recorded session',
    steps: [
      {
        id: 'upload-video',
        name: 'Upload Video',
        type: 'api_call',
        action: 'ai.uploadVideo',
        parameters: {},
        retryPolicy: {
          maxRetries: 3,
          backoffMultiplier: 2,
          initialDelay: 1000,
        },
        timeout: 60000,
      },
      {
        id: 'motion-tracking',
        name: 'Motion Tracking',
        type: 'ai_processing',
        action: 'ai.processMotionTracking',
        parameters: {
          detectHands: true,
          detectFace: true,
          smoothing: true,
        },
        dependsOn: ['upload-video'],
        retryPolicy: {
          maxRetries: 2,
          backoffMultiplier: 2,
          initialDelay: 2000,
        },
        timeout: 300000,
      },
      {
        id: '3d-analysis',
        name: '3D Motion Analysis',
        type: 'ai_processing',
        action: 'premiere.analyze3DMotion',
        parameters: {},
        dependsOn: ['motion-tracking'],
        timeout: 180000,
      },
      {
        id: 'dance-recognition',
        name: 'Dance Recognition',
        type: 'ai_processing',
        action: 'ai.recognizeDance',
        parameters: {},
        dependsOn: ['motion-tracking'],
        timeout: 120000,
      },
      {
        id: 'archive-content',
        name: 'Archive Content',
        type: 'archive',
        action: 'backend.archiveContent',
        parameters: {
          type: 'session',
        },
        dependsOn: ['3d-analysis', 'dance-recognition'],
        timeout: 30000,
      },
      {
        id: 'notify-completion',
        name: 'Notify Completion',
        type: 'notification',
        action: 'notification.send',
        parameters: {
          type: 'session_complete',
        },
        dependsOn: ['archive-content'],
        timeout: 10000,
      },
    ],
    triggers: [
      {
        type: 'event',
        config: {
          event: 'session:completed',
        },
      },
    ],
    settings: {
      maxConcurrent: 5,
      priority: 'normal',
      notifyOnCompletion: true,
      notifyOnFailure: true,
    },
  },

  // AI Model Training Workflow
  modelTraining: {
    id: 'model-training',
    name: 'AI Model Training',
    description: 'Workflow for training AI models with PREMIERE datasets',
    steps: [
      {
        id: 'fetch-dataset',
        name: 'Fetch Dataset',
        type: 'api_call',
        action: 'premiere.getDanceMotionDataset',
        parameters: {},
        timeout: 30000,
      },
      {
        id: 'download-samples',
        name: 'Download Samples',
        type: 'api_call',
        action: 'premiere.downloadDatasetSamples',
        parameters: {},
        dependsOn: ['fetch-dataset'],
        timeout: 120000,
      },
      {
        id: 'train-model',
        name: 'Train Model',
        type: 'ai_processing',
        action: 'ai.trainModel',
        parameters: {},
        dependsOn: ['download-samples'],
        timeout: 3600000, // 1 hour
      },
      {
        id: 'validate-model',
        name: 'Validate Model',
        type: 'ai_processing',
        action: 'ai.validateModel',
        parameters: {},
        dependsOn: ['train-model'],
        timeout: 600000,
      },
    ],
    triggers: [
      {
        type: 'manual',
        config: {},
      },
    ],
    settings: {
      maxConcurrent: 1,
      priority: 'low',
      notifyOnCompletion: true,
      notifyOnFailure: true,
    },
  },

  // Content Archival Workflow
  contentArchival: {
    id: 'content-archival',
    name: 'Content Archival',
    description: 'Workflow for archiving processed content',
    steps: [
      {
        id: 'validate-content',
        name: 'Validate Content',
        type: 'data_transform',
        action: 'validation.validateContent',
        parameters: {},
        timeout: 10000,
      },
      {
        id: 'create-cms-entry',
        name: 'Create CMS Entry',
        type: 'api_call',
        action: 'premiere.createCMSContent',
        parameters: {},
        dependsOn: ['validate-content'],
        timeout: 30000,
      },
      {
        id: 'archive-to-backend',
        name: 'Archive to Backend',
        type: 'archive',
        action: 'backend.archiveContent',
        parameters: {},
        dependsOn: ['create-cms-entry'],
        timeout: 30000,
      },
      {
        id: 'update-metadata',
        name: 'Update Metadata',
        type: 'api_call',
        action: 'premiere.updateCMSContent',
        parameters: {},
        dependsOn: ['archive-to-backend'],
        timeout: 15000,
      },
    ],
    triggers: [
      {
        type: 'event',
        config: {
          event: 'content:ready_for_archival',
        },
      },
      {
        type: 'schedule',
        config: {
          cron: '0 0 * * *', // Daily at midnight
        },
      },
    ],
    settings: {
      maxConcurrent: 10,
      priority: 'normal',
      notifyOnCompletion: false,
      notifyOnFailure: true,
    },
  },

  // Real-time Motion Analysis Workflow
  realtimeMotionAnalysis: {
    id: 'realtime-motion-analysis',
    name: 'Real-time Motion Analysis',
    description: 'Workflow for real-time motion analysis during live sessions',
    steps: [
      {
        id: 'initialize-stream',
        name: 'Initialize Stream',
        type: 'api_call',
        action: 'streaming.initialize',
        parameters: {},
        timeout: 10000,
      },
      {
        id: 'pose-detection',
        name: 'Pose Detection',
        type: 'ai_processing',
        action: 'ai.estimatePose',
        parameters: {
          realtime: true,
        },
        dependsOn: ['initialize-stream'],
        timeout: 5000,
      },
      {
        id: 'feedback-generation',
        name: 'Generate Feedback',
        type: 'data_transform',
        action: 'feedback.generate',
        parameters: {},
        dependsOn: ['pose-detection'],
        timeout: 1000,
      },
    ],
    triggers: [
      {
        type: 'event',
        config: {
          event: 'session:started',
        },
      },
    ],
    settings: {
      maxConcurrent: 20,
      priority: 'high',
      notifyOnCompletion: false,
      notifyOnFailure: true,
    },
  },
};

/**
 * Get workflow template by ID
 */
export function getWorkflowTemplate(id: string): WorkflowTemplate | undefined {
  return workflowTemplates[id];
}

/**
 * List all available workflow templates
 */
export function listWorkflowTemplates(): WorkflowTemplate[] {
  return Object.values(workflowTemplates);
}

/**
 * Validate workflow template
 */
export function validateWorkflowTemplate(template: WorkflowTemplate): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check for required fields
  if (!template.id) errors.push('Template ID is required');
  if (!template.name) errors.push('Template name is required');
  if (!template.steps || template.steps.length === 0) {
    errors.push('Template must have at least one step');
  }

  // Validate step dependencies
  const stepIds = new Set(template.steps.map((s) => s.id));
  for (const step of template.steps) {
    if (step.dependsOn) {
      for (const depId of step.dependsOn) {
        if (!stepIds.has(depId)) {
          errors.push(`Step "${step.id}" depends on non-existent step "${depId}"`);
        }
      }
    }
  }

  // Check for circular dependencies
  if (hasCircularDependencies(template.steps)) {
    errors.push('Workflow has circular dependencies');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check for circular dependencies in workflow steps
 */
function hasCircularDependencies(steps: WorkflowStepTemplate[]): boolean {
  const graph = new Map<string, Set<string>>();
  
  for (const step of steps) {
    graph.set(step.id, new Set(step.dependsOn || []));
  }

  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(stepId: string): boolean {
    visited.add(stepId);
    recursionStack.add(stepId);

    const dependencies = graph.get(stepId) || new Set();
    for (const depId of dependencies) {
      if (!visited.has(depId)) {
        if (hasCycle(depId)) return true;
      } else if (recursionStack.has(depId)) {
        return true;
      }
    }

    recursionStack.delete(stepId);
    return false;
  }

  for (const stepId of graph.keys()) {
    if (!visited.has(stepId)) {
      if (hasCycle(stepId)) return true;
    }
  }

  return false;
}
