/**
 * Integration Configuration
 * Central configuration for STEPFLOW component integration
 */

export interface IntegrationConfig {
  backend: BackendConfig;
  ai: AIConfig;
  premiere: PremiereConfig;
  sync: SyncConfig;
  realtime: RealtimeConfig;
}

export interface BackendConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  features: {
    workflowManagement: boolean;
    contentArchival: boolean;
    taskRouting: boolean;
  };
}

export interface AIConfig {
  baseUrl: string;
  timeout: number;
  defaultModel: string;
  features: {
    motionTracking: boolean;
    videoAnalysis: boolean;
    poseEstimation: boolean;
    danceRecognition: boolean;
  };
  limits: {
    maxVideoSize: number; // bytes
    maxVideoDuration: number; // seconds
    maxConcurrentJobs: number;
  };
}

export interface PremiereConfig {
  baseUrl: string;
  timeout: number;
  features: {
    motion3D: boolean;
    diarization: boolean;
    translation: boolean;
    datasets: boolean;
    cms: boolean;
  };
  datasets: {
    preferredTypes: string[];
    autoDownload: boolean;
  };
}

export interface SyncConfig {
  enabled: boolean;
  interval: number; // milliseconds
  batchSize: number;
  retryFailedTasks: boolean;
  conflictResolution: 'local' | 'remote' | 'manual';
}

export interface RealtimeConfig {
  enabled: boolean;
  wsUrl: string;
  reconnect: boolean;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

/**
 * Default integration configuration
 */
export const defaultIntegrationConfig: IntegrationConfig = {
  backend: {
    baseUrl: process.env.BACKEND_SERVICE_URL || 'https://backend.stepflow.app',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
    features: {
      workflowManagement: true,
      contentArchival: true,
      taskRouting: true,
    },
  },
  ai: {
    baseUrl: process.env.AI_SERVICE_URL || 'https://ai.stepflow.app',
    timeout: 300000, // 5 minutes for AI processing
    defaultModel: 'pose-estimator-v2',
    features: {
      motionTracking: true,
      videoAnalysis: true,
      poseEstimation: true,
      danceRecognition: true,
    },
    limits: {
      maxVideoSize: 100 * 1024 * 1024, // 100 MB
      maxVideoDuration: 600, // 10 minutes
      maxConcurrentJobs: 5,
    },
  },
  premiere: {
    baseUrl: process.env.PREMIERE_SERVICE_URL || 'https://premiere.stepflow.app',
    timeout: 180000, // 3 minutes
    features: {
      motion3D: true,
      diarization: true,
      translation: true,
      datasets: true,
      cms: true,
    },
    datasets: {
      preferredTypes: ['dance_motion', 'pose_estimation'],
      autoDownload: false,
    },
  },
  sync: {
    enabled: true,
    interval: 60000, // 1 minute
    batchSize: 50,
    retryFailedTasks: true,
    conflictResolution: 'remote',
  },
  realtime: {
    enabled: true,
    wsUrl: process.env.WS_URL || 'wss://api.stepflow.app/ws',
    reconnect: true,
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
  },
};

/**
 * Integration endpoints mapping
 */
export const integrationEndpoints = {
  backend: {
    health: '/backend/health',
    config: '/backend/config',
    tasks: '/backend/tasks',
    archive: '/backend/archive',
    sync: '/backend/sync',
  },
  ai: {
    models: '/ai/models',
    motionTracking: '/ai/motion-tracking',
    videoAnalysis: '/ai/video-analysis',
    poseEstimation: '/ai/pose-estimation',
    danceRecognition: '/ai/dance-recognition',
    jobs: '/ai/jobs',
    upload: '/ai/upload',
    datasets: '/ai/datasets',
    training: '/ai/training',
  },
  premiere: {
    motion3D: '/premiere/motion-3d',
    diarization: '/premiere/diarization',
    translation: '/premiere/translation',
    datasets: '/premiere/datasets',
    cms: '/premiere/cms',
  },
};

/**
 * Feature flags for integration
 */
export const featureFlags = {
  enableAIProcessing: true,
  enablePremiere3DAnalysis: true,
  enableDiarization: true,
  enableTranslation: true,
  enableRealtimeSync: true,
  enableContentArchival: true,
  enableWorkflowManagement: true,
  enableDatasetIntegration: true,
  enableModelTraining: false, // Disabled by default
};

/**
 * Get integration configuration
 */
export function getIntegrationConfig(): IntegrationConfig {
  return { ...defaultIntegrationConfig };
}

/**
 * Update integration configuration
 */
export function updateIntegrationConfig(updates: Partial<IntegrationConfig>): IntegrationConfig {
  return {
    ...defaultIntegrationConfig,
    ...updates,
  };
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof featureFlags): boolean {
  return featureFlags[feature];
}

/**
 * Validate integration configuration
 */
export function validateIntegrationConfig(config: IntegrationConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate URLs
  try {
    new URL(config.backend.baseUrl);
  } catch {
    errors.push('Invalid backend base URL');
  }

  try {
    new URL(config.ai.baseUrl);
  } catch {
    errors.push('Invalid AI service base URL');
  }

  try {
    new URL(config.premiere.baseUrl);
  } catch {
    errors.push('Invalid PREMIERE service base URL');
  }

  // Validate timeouts
  if (config.backend.timeout <= 0) {
    errors.push('Backend timeout must be positive');
  }

  if (config.ai.timeout <= 0) {
    errors.push('AI service timeout must be positive');
  }

  // Validate limits
  if (config.ai.limits.maxVideoSize <= 0) {
    errors.push('Max video size must be positive');
  }

  if (config.ai.limits.maxVideoDuration <= 0) {
    errors.push('Max video duration must be positive');
  }

  if (config.ai.limits.maxConcurrentJobs <= 0) {
    errors.push('Max concurrent jobs must be positive');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
