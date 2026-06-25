# STEPFLOW Mobile

## Monorepo scaffolding

The repository now includes placeholder directories for adding separate projects into one shared repository without blending them into one application runtime.

```text
apps/
  botpress/
  socketio-server/
agents/
  sopo-agent-advanced-strategy/
tools/
  codex/
```

- `apps/socketio-server` is reserved for the `socket.io`-based realtime server.
- `apps/botpress` is reserved for the Botpress project.
- `tools/codex` is reserved for the Codex terminal tool.
- `agents/sopo-agent-advanced-strategy` is reserved for the SOPO agent project.

See [docs/MONOREPO.md](docs/MONOREPO.md) for the isolation rules and current scaffold status.

## Project Overview

STEPFLOW-mobile is a React Native application that integrates with STEPFLOW-backend and STEPFLOW-AI to provide a complete rhythm-based movement training experience. The app includes seamless integration with PREMIERE tools for advanced motion analysis, AI processing, and multi-language support.

STEPFLOW Mobile is the front-end application designed to connect with the STEPFLOW ecosystem, which includes STEPFLOW-AI and STEPFLOW-backend. This mobile app serves as the user interface for accessing data processed by the AI system and managed by the backend infrastructure.

## Screenshots
![Home Screen](assets/screenshots/home.png)
![Lesson Screen](assets/screenshots/lesson.png)
![Practice Screen](assets/screenshots/practice.png)

## Integration Architecture

The app is integrated with three main services:

- **STEPFLOW-backend**: Workflow orchestration, task routing, and content archival
- **STEPFLOW-AI**: Motion tracking, video analysis, pose estimation, and model training
- **PREMIERE Tools**: 3D motion analysis, audio diarization, translation services, and Dance Motion Datasets

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for complete integration documentation.

## Key Features
- **Real-time Data Display**: Fetch and display results from STEPFLOW-backend.
- **AI Integration**: View insights derived from STEPFLOW-AI, including motion tracking and emotion analysis.
- **User-Friendly Interface**: Built with a focus on simplicity and usability.

## Project Structure

```
src/
├── api/              # API client and endpoints
│   ├── client.ts     # Base HTTP client with axios
│   ├── auth.ts       # Authentication endpoints
│   ├── sessions.ts   # Session management endpoints
│   ├── analytics.ts  # Analytics and statistics endpoints
│   ├── feedback.ts   # User feedback endpoints
│   ├── backend.ts    # Backend workflow & archival API (NEW)
│   ├── ai.ts         # AI processing & ML models API (NEW)
│   └── premiere.ts   # PREMIERE tools suite API (NEW)
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

### 1. STEPFLOW Integration
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

### 3. User Interface
- Clean, modern design with consistent theming
- Responsive components following Material Design principles
- Real-time feedback during sessions
- Interactive progress visualization

### 4. State Management
- Centralized Redux store with TypeScript
- Separate slices for user, session, and progress
- Optimized for performance with minimal re-renders

### 5. API Integration
- RESTful API client with error handling
- Authentication with JWT tokens
- Session management and progress tracking
- Analytics and feedback submission
- **Backend, AI, and PREMIERE service integration**

### 6. Workflow Management
- Predefined workflow templates for common tasks
- Session processing pipeline (upload → analyze → archive)
- Model training with PREMIERE datasets
- Content archival automation
- Real-time motion analysis

### 7. Screens
- **Home**: Dashboard with quick actions and recommendations
- **Session Picker**: Browse and select workout sessions
- **Live Session**: Real-time session with beat indicator and stats
- **Feedback**: Post-session rating and comments
- **Progress**: Visual progress tracking with graphs and achievements
- **Settings**: User preferences and account management

## Development Workflow

### Prerequisites
- Node.js 16+
- React Native development environment
- iOS: Xcode and CocoaPods
- Android: Android Studio and SDK

### Install Dependencies
```bash
npm install
```

### Start Metro Bundler
```bash
npm start
```

### Run on iOS (macOS only)
```bash
cd ios
pod install
cd ..
npm run ios
```

### Run on Android
Ensure an emulator or device is running:
```bash
npm run android
```

### Build for Production
```bash
npm run build
```

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
  videoFile,
  userId
);

// Monitor progress
const status = integrationOrchestrator.getWorkflowStatus(sessionId);
```

See [docs/INTEGRATION.md](docs/INTEGRATION.md) for complete usage examples.

## Environment Variables

STEPFLOW Mobile connects to the backend hosted on DigitalOcean.

Create a `.env` file (not committed) with:
```env
API_BASE_URL=https://api.stepflow.app
WS_URL=wss://api.stepflow.app/ws
AI_SERVICE_URL=https://ai.stepflow.app
BACKEND_SERVICE_URL=https://backend.stepflow.app
PREMIERE_SERVICE_URL=https://premiere.stepflow.app
APP_ENV=development
```

Example:
```bash
cp .env.example .env
```

⚠️ Do not commit `.env` files.

## Integration with STEPFLOW Ecosystem

STEPFLOW Mobile communicates with the backend API.

- **STEPFLOW-backend**
  - Hosted on DigitalOcean
  - Provides REST/GraphQL APIs used to fetch data
  - Handles auth, user data, lesson content, and AI orchestration
  - Workflow task management and content archival

- **STEPFLOW-AI**
  - Invoked internally by the backend
  - Performs movement analysis and scoring
  - Returns structured feedback
  - Supplies processed AI results which are displayed in the app
  - Motion tracking, video analysis, and model training

- **PREMIERE Tools**
  - 3D motion analysis with skeleton tracking
  - Audio diarization for speaker identification
  - Multi-language translation services
  - Dance Motion Dataset access
  - CMS content management

The mobile app communicates with all services through the integration layer.

## Deployment

### Mobile App Deployment

STEPFLOW Mobile is a native application deployed to app stores:

**Deployment targets:**
- **iOS** → TestFlight / App Store
- **Android** → Google Play Console

### Backend/Realtime Deployment

The backend API and realtime services are deployed via DigitalOcean's workflow. For a quick start, follow these steps:

1. Install serverless support:
   ```bash
   doctl serverless install
   ```

2. Run the socket.io realtime server workspace:
   ```bash
   npm run status --workspace @stepflow/socketio-server
   ```

3. Deploy serverless functions:
   ```bash
   doctl serverless deploy
   ```

**DigitalOcean is used for:**
- Backend API hosting
- Serverless functions
- AI inference services
- Databases and storage

For comprehensive documentation on DigitalOcean's `doctl` CLI, serverless functions management, and detailed deployment workflows, see the [Developer Guide](docs/developer-guide.md).

## Architecture Decisions

### Component Design
- Components are pure and reusable
- No screen-specific logic in components
- Props are fully typed with TypeScript

### Motion Detection
- Modular architecture with separate sensors
- Configurable sensitivity and thresholds
- Real-time processing optimized for 60 FPS

### State Management
- Redux Toolkit for simplified state management
- Normalized state shape to avoid duplication
- Selector functions for derived data

### API Integration
- Centralized API client configuration
- Type-safe API responses
- Automatic error handling and retry logic
- Real-time synchronization via WebSocket

## License
This project is licensed under the [MIT License](LICENSE).
