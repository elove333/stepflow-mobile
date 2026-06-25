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

## Project Overview Sopo bot
call legal plays in real time sopo

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

###
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

##

## Development Workflow

### Prerequisites
- Node.js 16+
- React Native development environment
- iOS: Xcode and CocoaPods


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



This project is licensed under the [MIT License](LICENSE).
