/**
 * Integration Tests for Workflow Configuration
 */

import {
  getWorkflowTemplate,
  listWorkflowTemplates,
  validateWorkflowTemplate,
  workflowTemplates,
} from '../../config/workflows';

describe('Workflow Configuration', () => {
  describe('Template Retrieval', () => {
    it('should get workflow template by ID', () => {
      const template = getWorkflowTemplate('session-processing');

      expect(template).toBeDefined();
      expect(template?.id).toBe('session-processing');
      expect(template?.name).toBe('Session Processing');
      expect(template?.steps).toHaveLength(6);
    });

    it('should return undefined for non-existent template', () => {
      const template = getWorkflowTemplate('non-existent');

      expect(template).toBeUndefined();
    });

    it('should list all workflow templates', () => {
      const templates = listWorkflowTemplates();

      expect(templates).toHaveLength(4);
      expect(templates.map((t) => t.id)).toEqual([
        'session-processing',
        'model-training',
        'content-archival',
        'realtime-motion-analysis',
      ]);
    });
  });

  describe('Template Validation', () => {
    it('should validate a valid workflow template', () => {
      const template = workflowTemplates.sessionProcessing;
      const validation = validateWorkflowTemplate(template);

      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should reject template without ID', () => {
      const template = {
        id: '',
        name: 'Test',
        description: 'Test',
        steps: [
          {
            id: 'step1',
            name: 'Step 1',
            type: 'api_call' as const,
            action: 'test',
            parameters: {},
          },
        ],
        triggers: [],
        settings: {
          maxConcurrent: 1,
          priority: 'normal' as const,
          notifyOnCompletion: false,
          notifyOnFailure: false,
        },
      };

      const validation = validateWorkflowTemplate(template);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Template ID is required');
    });

    it('should reject template without steps', () => {
      const template = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        steps: [],
        triggers: [],
        settings: {
          maxConcurrent: 1,
          priority: 'normal' as const,
          notifyOnCompletion: false,
          notifyOnFailure: false,
        },
      };

      const validation = validateWorkflowTemplate(template);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Template must have at least one step');
    });

    it('should reject template with invalid dependencies', () => {
      const template = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        steps: [
          {
            id: 'step1',
            name: 'Step 1',
            type: 'api_call' as const,
            action: 'test',
            parameters: {},
            dependsOn: ['non-existent-step'],
          },
        ],
        triggers: [],
        settings: {
          maxConcurrent: 1,
          priority: 'normal' as const,
          notifyOnCompletion: false,
          notifyOnFailure: false,
        },
      };

      const validation = validateWorkflowTemplate(template);

      expect(validation.valid).toBe(false);
      expect(validation.errors.some((e) => e.includes('non-existent step'))).toBe(true);
    });

    it('should reject template with circular dependencies', () => {
      const template = {
        id: 'test',
        name: 'Test',
        description: 'Test',
        steps: [
          {
            id: 'step1',
            name: 'Step 1',
            type: 'api_call' as const,
            action: 'test',
            parameters: {},
            dependsOn: ['step2'],
          },
          {
            id: 'step2',
            name: 'Step 2',
            type: 'api_call' as const,
            action: 'test',
            parameters: {},
            dependsOn: ['step1'],
          },
        ],
        triggers: [],
        settings: {
          maxConcurrent: 1,
          priority: 'normal' as const,
          notifyOnCompletion: false,
          notifyOnFailure: false,
        },
      };

      const validation = validateWorkflowTemplate(template);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toContain('Workflow has circular dependencies');
    });
  });

  describe('Predefined Templates', () => {
    it('should have valid session processing workflow', () => {
      const template = workflowTemplates.sessionProcessing;

      expect(template.id).toBe('session-processing');
      expect(template.steps).toHaveLength(6);
      expect(template.steps[0].id).toBe('upload-video');
      expect(template.steps[1].dependsOn).toEqual(['upload-video']);
      expect(template.steps[4].dependsOn).toEqual(['3d-analysis', 'dance-recognition']);
    });

    it('should have valid model training workflow', () => {
      const template = workflowTemplates.modelTraining;

      expect(template.id).toBe('model-training');
      expect(template.steps).toHaveLength(4);
      expect(template.settings.maxConcurrent).toBe(1);
      expect(template.settings.priority).toBe('low');
    });

    it('should have valid content archival workflow', () => {
      const template = workflowTemplates.contentArchival;

      expect(template.id).toBe('content-archival');
      expect(template.steps).toHaveLength(4);
      expect(template.triggers).toHaveLength(2);
      expect(template.triggers[0].type).toBe('event');
      expect(template.triggers[1].type).toBe('schedule');
    });

    it('should have valid realtime motion analysis workflow', () => {
      const template = workflowTemplates.realtimeMotionAnalysis;

      expect(template.id).toBe('realtime-motion-analysis');
      expect(template.steps).toHaveLength(3);
      expect(template.settings.priority).toBe('high');
      expect(template.settings.maxConcurrent).toBe(20);
    });
  });

  describe('Workflow Step Configuration', () => {
    it('should have retry policies for critical steps', () => {
      const template = workflowTemplates.sessionProcessing;
      const uploadStep = template.steps.find((s) => s.id === 'upload-video');
      const motionStep = template.steps.find((s) => s.id === 'motion-tracking');

      expect(uploadStep?.retryPolicy).toBeDefined();
      expect(uploadStep?.retryPolicy?.maxRetries).toBe(3);

      expect(motionStep?.retryPolicy).toBeDefined();
      expect(motionStep?.retryPolicy?.maxRetries).toBe(2);
    });

    it('should have appropriate timeouts for different step types', () => {
      const template = workflowTemplates.sessionProcessing;
      const uploadStep = template.steps.find((s) => s.id === 'upload-video');
      const motionStep = template.steps.find((s) => s.id === 'motion-tracking');

      expect(uploadStep?.timeout).toBe(60000); // 1 minute
      expect(motionStep?.timeout).toBe(300000); // 5 minutes
    });

    it('should have correct parameter configurations', () => {
      const template = workflowTemplates.sessionProcessing;
      const motionStep = template.steps.find((s) => s.id === 'motion-tracking');

      expect(motionStep?.parameters).toEqual({
        detectHands: true,
        detectFace: true,
        smoothing: true,
      });
    });
  });
});
