# stepflow-for StepFlow - a rhythm-based movement training app.

## Project Overview

STEPFLOW-mobile is a React Native application that integrates with STEPFLOW-backend and STEPFLOW-AI to provide a complete rhythm-based movement training experience. The app includes seamless integration with PREMIERE tools for advanced motion analysis, AI processing, and multi-language support.

## Integration Architecture

The app is integrated with three main services:

- **STEPFLOW-backend**: Workflow orchestration, task routing, and content archival
- **STEPFLOW-AI**: Motion tracking, video analysis, pose estimation, and model training
- **PREMIERE Tools**: 3D motion analysis, audio diarization, translation services, and Dance Motion Datasets

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for complete integration documentation.

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts     # Base HTTP client with axios
│   ├── auth.ts       # Authentication endpoints
│   ├── sessions.ts   # Session management endpoints
│   ├── analytics.ts  # Analytics and statistics endpoints
│   └── feedback.ts   # User feedback endpoints
│
├── components/       # Reusable UI components
│   ├── Button.tsx           # Customizable button component
│   ├── Card.tsx             # Card container component
│   ├── ProgressGraph.tsx    # Progress visualization graph
│   ├── FeedbackBubble.tsx   # Real-time feedback display
│   └── RhythmIndicator.tsx  # Beat synchronization indicator
│
├── hooks/            # Custom React hooks
│   ├── useAuth.ts    # Authentication state and actions
│   ├── useSession.ts # Session management logic
│   └── useMotion.ts  # Motion detection integration
│
├── motion/           # Motion detection modules
│   ├── PoseDetector.ts    # Body pose detection
│   ├── Accelerometer.ts   # Device accelerometer
│   ├── Gyroscope.ts       # Device gyroscope
│   ├── StepDetector.ts    # Step detection from sensor data
│   └── BeatSync.ts        # Beat synchronization engine
│
├── navigation/       # Navigation configuration
│   ├── AppNavigator.tsx  # Root navigator
│   └── MainNavigator.tsx # Main stack navigator
│
├── screens/          # Application screens
│   ├── HomeScreen.tsx           # Home dashboard
│   ├── SessionPickerScreen.tsx  # Session selection
│   ├── LiveSessionScreen.tsx    # Active session view
│   ├── FeedbackScreen.tsx       # Post-session feedback
│   ├── ProgressScreen.tsx       # Progress tracking
│   └── SettingsScreen.tsx       # User settings
│
├── state/            # Redux state management
│   ├── store.ts         # Redux store configuration
│   ├── userSlice.ts     # User authentication state
│   ├── sessionSlice.ts  # Session state
│   └── progressSlice.ts # Progress tracking state
│
├── theme/            # Design tokens
│   ├── colors.ts     # Color palette
│   ├── spacing.ts    # Spacing values
│   └── typography.ts # Typography tokens
│
├── utils/            # Utility functions
│   ├── validators.ts        # Input validation
│   ├── timingHelpers.ts     # Time and BPM calculations
│   └── movementHelpers.ts   # Motion calculation utilities
│
├── services/         # Integration services (NEW)
│   ├── websocket.ts      # Real-time WebSocket communication
│   └── integration.ts    # Workflow orchestration
│
├── config/           # Configuration modules (NEW)
│   ├── workflows.ts      # Predefined workflow templates
│   └── integration.ts    # Integration settings
│
└── App.tsx           # Main App component
```

## Features

### 1. STEPFLOW Integration (NEW)
- **Backend Integration**: Workflow task management, content archival, data synchronization
- **AI Processing**: Motion tracking, video analysis, pose estimation, dance recognition
- **PREMIERE Tools**: 3D motion analysis, audio diarization, multi-language translation
- **Real-time Sync**: WebSocket-based live updates and notifications
- **Workflow Orchestration**: Automated pipelines for session processing and content management

### 2. Motion Detection
- **Pose Detection**: Real-time body pose tracking using device camera
- **Accelerometer & Gyroscope**: Device motion sensors for movement tracking
- **Step Detection**: Intelligent step detection with configurable thresholds
- **Beat Sync**: Synchronize movements with music tempo (BPM)

### 2. User Interface
- Clean, modern design with consistent theming
- Responsive components following Material Design principles
- Real-time feedback during sessions
- Interactive progress visualization

### 3. State Management
- Centralized Redux store with TypeScript
- Separate slices for user, session, and progress
- Optimized for performance with minimal re-renders

### 4. API Integration
- RESTful API client with error handling
- Authentication with JWT tokens
- Session management and progress tracking
- Analytics and feedback submission
- **Backend, AI, and PREMIERE service integration**

### 5. Workflow Management (NEW)
- Predefined workflow templates for common tasks
- Session processing pipeline (upload → analyze → archive)
- Model training with PREMIERE datasets
- Content archival automation
- Real-time motion analysis

### 6. Screens
- **Home**: Dashboard with quick actions and recommendations
- **Session Picker**: Browse and select workout sessions
- **Live Session**: Real-time session with beat indicator and stats
- **Feedback**: Post-session rating and comments
- **Progress**: Visual progress tracking with graphs and achievements
- **Settings**: User preferences and account management

## Setup and Installation

### Prerequisites
- Node.js 16+
- React Native development environment
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Install Dependencies
```bash
npm install
# or
yarn install
```

### iOS Setup
```bash
cd ios && pod install && cd ..
```

### Run the App

```bash
# iOS
npm run ios

# Android
npm run android

# Start Metro bundler
npm start
```

## Development

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

### Testing
```bash
npm test

# Run integration tests
npm test -- src/__tests__/integration
```

## Integration Usage

### Quick Start with Integration

```typescript
// Import integration services
import { integrationOrchestrator } from './services/integration';
import * as AIAPI from './api/ai';
import * as BackendAPI from './api/backend';

// Process a session with full workflow
const workflow = await integrationOrchestrator.processSession(
  sessionId,
  videoFile
);

// Monitor progress
const status = integrationOrchestrator.getWorkflowStatus(sessionId);
```

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for complete usage examples.

## Architecture Decisions

### Component Design
- Components are pure and reusable
- No screen-specific logic in components
- Props are fully typed with TypeScript

### Motion Detection
- Modular design with fallback methods
- Device capability checking
- Configurable parameters for different devices

### State Management
- Redux Toolkit for simplified Redux
- Normalized state structure
- Async actions with proper error handling

### Navigation
- Stack-based navigation with React Navigation
- Type-safe navigation with TypeScript
- Proper screen lifecycle management

## Configuration

### Environment Variables
Create a `.env` file (not committed) with:
```
API_BASE_URL=https://api.stepflow.app
WS_URL=wss://api.stepflow.app/ws
AI_SERVICE_URL=https://ai.stepflow.app
BACKEND_SERVICE_URL=https://backend.stepflow.app
PREMIERE_SERVICE_URL=https://premiere.stepflow.app
APP_ENV=development
```

### Theme Customization
Edit files in `src/theme/` to customize colors, spacing, and typography.

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Write clean, documented code
4. Test thoroughly before committing

## License

Copyright © 2026 StepFlow

