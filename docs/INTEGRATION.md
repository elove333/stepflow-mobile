# STEPFLOW Integration Documentation

## Overview

This document describes the integration between STEPFLOW-mobile, STEPFLOW-backend, and STEPFLOW-AI, including PREMIERE tools integration for enhanced motion analysis, diarization, and translation capabilities.

## Architecture

```
┌─────────────────────┐
│  STEPFLOW-mobile    │
│  (React Native)     │
└──────────┬──────────┘
           │
           ├─── REST API ───┐
           │                │
           ├─── WebSocket ──┤
           │                │
           v                v
┌─────────────────────┐   ┌─────────────────────┐
│ STEPFLOW-backend    │   │   STEPFLOW-AI       │
│ (Workflow Engine)   │◄──┤ (ML Processing)     │
└──────────┬──────────┘   └─────────────────────┘
           │                         │
           │                         │
           v                         v
┌─────────────────────────────────────────────────┐
│           PREMIERE Tools Suite                  │
│  • 3D Motion Analysis                          │
│  • Audio Diarization                           │
│  • Multi-language Translation                  │
│  • Dance Motion Datasets                       │
│  • CMS & Content Management                    │
└─────────────────────────────────────────────────┘
```

## Integration Components

### 1. API Integration

#### Backend API (`src/api/backend.ts`)
Handles communication with STEPFLOW-backend for:
- Workflow task management
- Content archival
- Data synchronization
- Backend health monitoring

**Key Functions:**
```typescript
import * as BackendAPI from './api/backend';

// Test connectivity
const health = await BackendAPI.testConnection();

// Create workflow task
const task = await BackendAPI.createWorkflowTask({
  type: 'motion_analysis',
  userId: 'user-123',
  data: { sessionId: 'session-456' }
});

// Archive content
await BackendAPI.archiveContent({
  type: 'session',
  sessionId: 'session-456',
  userId: 'user-123',
  url: 'https://cdn.stepflow.app/video.mp4',
  metadata: {}
});
```

#### AI API (`src/api/ai.ts`)
Manages AI processing tasks:
- Motion tracking
- Video analysis
- Pose estimation
- Dance recognition
- Model training

**Key Functions:**
```typescript
import * as AIAPI from './api/ai';

// Upload video for processing
const upload = await AIAPI.uploadVideo(videoFile, {
  sessionId: 'session-456'
});

// Process motion tracking
const job = await AIAPI.processMotionTracking({
  videoUrl: upload.data.url,
  sessionId: 'session-456',
  options: {
    detectHands: true,
    detectFace: true,
    smoothing: true
  }
});

// Get AI models
const models = await AIAPI.getAIModels();

// Train model with dataset
const training = await AIAPI.trainModel({
  modelType: 'pose_estimation',
  datasetId: 'dataset-123'
});
```

#### PREMIERE API (`src/api/premiere.ts`)
Integrates PREMIERE tools:
- 3D motion analysis
- Audio diarization
- Translation services
- Dance Motion Datasets
- CMS content management

**Key Functions:**
```typescript
import * as PremiereAPI from './api/premiere';

// 3D motion analysis
const analysis = await PremiereAPI.analyze3DMotion({
  videoUrl: 'https://cdn.stepflow.app/video.mp4',
  sessionId: 'session-456'
});

// Audio diarization
const diarization = await PremiereAPI.diarizeAudio({
  audioUrl: 'https://cdn.stepflow.app/audio.mp3',
  language: 'en',
  speakerCount: 2
});

// Translation
const translation = await PremiereAPI.translateText({
  text: 'Hello',
  sourceLanguage: 'en',
  targetLanguage: 'es',
  context: 'dance'
});

// Get Dance Motion Datasets
const datasets = await PremiereAPI.getDanceMotionDatasets({
  danceStyle: 'hip-hop',
  difficulty: 'beginner'
});

// CMS content management
const content = await PremiereAPI.createCMSContent({
  type: 'video',
  title: 'Tutorial Video',
  url: 'https://cdn.stepflow.app/tutorial.mp4',
  metadata: {},
  tags: ['tutorial', 'beginner'],
  archived: false
});
```

### 2. Real-time Synchronization

#### WebSocket Service (`src/services/websocket.ts`)
Provides real-time bidirectional communication:

```typescript
import { wsService } from './services/websocket';

// Connect
await wsService.connect(authToken);

// Listen for task completion
wsService.on('task:completed', (message) => {
  console.log('Task completed:', message.payload);
});

// Listen for sync updates
wsService.on('sync:update', (message) => {
  console.log('Sync update:', message.payload);
});

// Send message
wsService.send('motion:update', { data: motionData });

// Disconnect
wsService.disconnect();
```

### 3. Integration Orchestrator

#### Workflow Orchestration (`src/services/integration.ts`)
Manages complex workflows across services:

```typescript
import { integrationOrchestrator } from './services/integration';

// Process session with full workflow
const workflow = await integrationOrchestrator.processSession(
  'session-456',
  videoFile
);

// Monitor workflow progress
const status = integrationOrchestrator.getWorkflowStatus('session-456');
console.log(`Progress: ${status?.currentStep}/${status?.steps.length}`);

// Enable/disable auto-sync
await integrationOrchestrator.setAutoSync(true);

// Get active workflows
const activeWorkflows = integrationOrchestrator.getActiveWorkflows();
```

### 4. Workflow Configuration

#### Workflow Templates (`src/config/workflows.ts`)
Predefined workflow templates for common tasks:

```typescript
import { 
  getWorkflowTemplate, 
  listWorkflowTemplates,
  validateWorkflowTemplate
} from './config/workflows';

// Get session processing workflow
const template = getWorkflowTemplate('session-processing');

// List all workflows
const allTemplates = listWorkflowTemplates();

// Validate custom workflow
const validation = validateWorkflowTemplate(customTemplate);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

**Available Workflows:**
- `session-processing` - Complete session processing pipeline
- `model-training` - AI model training with PREMIERE datasets
- `content-archival` - Content archival workflow
- `realtime-motion-analysis` - Real-time motion analysis

### 5. Configuration

#### Integration Config (`src/config/integration.ts`)
Central configuration management:

```typescript
import { 
  getIntegrationConfig, 
  updateIntegrationConfig,
  isFeatureEnabled 
} from './config/integration';

// Get current config
const config = getIntegrationConfig();

// Update config
const newConfig = updateIntegrationConfig({
  backend: {
    ...config.backend,
    timeout: 60000
  }
});

// Check feature flags
if (isFeatureEnabled('enableAIProcessing')) {
  // AI processing is enabled
}
```

## Environment Configuration

Create a `.env` file with the following variables:

```env
API_BASE_URL=https://api.stepflow.app
WS_URL=wss://api.stepflow.app/ws
AI_SERVICE_URL=https://ai.stepflow.app
BACKEND_SERVICE_URL=https://backend.stepflow.app
PREMIERE_SERVICE_URL=https://premiere.stepflow.app
APP_ENV=production
```

## Usage Examples

### Complete Session Processing

```typescript
import { integrationOrchestrator } from './services/integration';
import * as AIAPI from './api/ai';
import * as BackendAPI from './api/backend';

// 1. Upload and process session
const workflow = await integrationOrchestrator.processSession(
  sessionId,
  videoFile
);

// 2. Monitor progress
wsService.on('task:completed', async (message) => {
  if (message.payload.sessionId === sessionId) {
    // Get final results
    const results = await BackendAPI.getArchivedContent({
      sessionId
    });
    
    console.log('Session processing complete:', results);
  }
});
```

### Real-time Motion Analysis

```typescript
import * as AIAPI from './api/ai';
import { wsService } from './services/websocket';

// Connect to WebSocket
await wsService.connect(authToken);

// Start real-time pose estimation
wsService.on('frame:captured', async (message) => {
  const pose = await AIAPI.estimatePose({
    imageData: message.payload.frameData
  });
  
  // Send feedback to user
  wsService.send('feedback:pose', pose.data);
});
```

### Training with PREMIERE Datasets

```typescript
import * as AIAPI from './api/ai';
import * as PremiereAPI from './api/premiere';

// Get available datasets
const datasets = await PremiereAPI.getDanceMotionDatasets({
  danceStyle: 'hip-hop'
});

// Select dataset
const datasetId = datasets.data[0].id;

// Download samples
const download = await PremiereAPI.downloadDatasetSamples(datasetId);

// Train model
const training = await AIAPI.trainModel({
  modelType: 'dance_recognition',
  datasetId,
  parameters: {
    epochs: 100,
    batchSize: 32
  }
});

// Monitor training progress
const checkProgress = setInterval(async () => {
  const status = await AIAPI.getTrainingStatus(training.data.trainingJobId);
  console.log(`Training progress: ${status.data.progress}%`);
  
  if (status.data.status === 'completed') {
    clearInterval(checkProgress);
    console.log('Training complete!');
  }
}, 5000);
```

## Testing

Run integration tests:

```bash
npm test -- src/__tests__/integration
```

Test files:
- `src/__tests__/integration/backend.test.ts` - Backend API tests
- `src/__tests__/integration/ai.test.ts` - AI API tests
- `src/__tests__/integration/premiere.test.ts` - PREMIERE API tests

## Troubleshooting

### Connection Issues

```typescript
import * as BackendAPI from './api/backend';

// Test backend connectivity
try {
  const health = await BackendAPI.testConnection();
  console.log('Backend status:', health.data.status);
  console.log('Latency:', health.data.latency, 'ms');
} catch (error) {
  console.error('Backend connection failed:', error);
}
```

### WebSocket Reconnection

```typescript
import { wsService } from './services/websocket';

// Update reconnection settings
wsService.updateConfig({
  reconnect: true,
  reconnectInterval: 3000,
  maxReconnectAttempts: 5
});
```

### Task Retry

```typescript
import * as BackendAPI from './api/backend';

// Retry failed task
const retriedTask = await BackendAPI.retryTask('task-123');
```

## API Reference

For detailed API documentation, refer to the TypeScript interfaces in:
- `src/api/backend.ts`
- `src/api/ai.ts`
- `src/api/premiere.ts`
- `src/services/websocket.ts`
- `src/services/integration.ts`

## Support

For issues or questions, please refer to the main STEPFLOW documentation or contact the development team.
