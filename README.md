# stepflow-mobile
 --application for StepFlow - a rhythm-based movement training app.

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
└── App.tsx           # Main App component
```

## Features

### 1. Motion Detection
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

### 5. Screens
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
```

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

