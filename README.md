# StepFlow /**
 ""* File: app/page.tsx**
 """"* Purpose: STEPFLOW - purpose - a practice tool designed to help people actually learn and remember choreography faster, with every feature like camera, effects, AI, and music working to improve practice quality, feedback, and progression.""""
 (pose tracking + timing/energy scoring).
 *
 * Copyright (c) 2026 Emerald Hardee (STEPFLOW)
 * SPDX-License-Identifier: MIT
 */


## Project Overview

StepFlow Mobile is built with React Native and TypeScript, featuring:
- Real-time motion tracking via accelerometer, gyroscope, and pose detection
- Beat synchronization engine for music tempo matching
- Gamified workout sessions with instant feedback
- Progress tracking and analytics
- RESTful API integration with JWT authentication

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
- Node.js 16+ and npm
- React Native development environment
- **iOS**: Xcode 14+ and CocoaPods
- **Android**: Android Studio and SDK (API level 31+)

### Install Dependencies
```bash
npm install
```

### iOS Setup
```bash
cd ios && pod install && cd ..
```

### Environment Configuration
Create a `.env` file in the project root (use `.env.example` as a template):
```bash
API_BASE_URL=https://api.stepflow.app
SENTRY_DSN=your_sentry_dsn_here
APP_ENV=development
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

# Watch mode
npm test -- --watch
```

### Code Formatting
```bash
npx prettier --write .
```

## Native Module Notes

### iOS Considerations
- Camera permissions required for pose detection
- Motion & Fitness permissions for accelerometer/gyroscope
- Background modes for music playback during sessions
- Minimum deployment target: iOS 13.0

### Android Considerations
- Camera permissions in AndroidManifest.xml
- Motion sensors permissions
- Foreground service for active sessions
- Minimum SDK version: 23 (Android 6.0)

### Native Dependencies
The following native modules require additional setup:
- `react-native-reanimated` - Gesture handling and animations
- `react-native-sensors` - Accelerometer and gyroscope access
- `react-native-screens` - Native navigation optimization

Refer to each library's documentation for platform-specific configuration.

## Configuration

### Environment Variables
Create a `.env` file (not committed to version control):
```
API_BASE_URL=https://api.stepflow.app
SENTRY_DSN=
APP_ENV=development
```

### Theme Customization
Edit files in `src/theme/` to customize:
- **colors.ts**: Brand colors, semantic colors (primary, secondary, error, etc.)
- **spacing.ts**: Padding, margins, border radius values
- **typography.ts**: Font families, sizes, weights, line heights

### TypeScript Configuration
The project uses strict TypeScript settings for enhanced type safety. Path aliases are configured for cleaner imports:
```typescript
import { Button } from '@src/components';
import { bpmToMs } from '@src/utils/timingHelpers';
```

## Contributing

We welcome contributions! Please follow these guidelines:

1. **Code Style**: Follow existing patterns and use TypeScript
2. **Testing**: Write tests for new features and bug fixes
3. **Commits**: Use conventional commit messages (e.g., `feat:`, `fix:`, `docs:`)
4. **PR Process**:
   - Create a feature branch from `develop`
   - Write clear PR descriptions
   - Ensure CI passes (lint, type-check, tests)
   - Request review from maintainers

### Development Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run lint
npx tsc --noEmit
npm test

# Commit using conventional commits
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/your-feature-name
```

## Architecture Decisions

### Component Design
- Components are pure and reusable
- No screen-specific logic in components
- Props are fully typed with TypeScript interfaces
- Conditional rendering over dynamic component types where possible

### Motion Detection
- Modular design with fallback methods
- Device capability checking before feature use
- Configurable parameters for different devices
- Mock implementations for testing

### State Management
- Redux Toolkit for simplified Redux patterns
- Normalized state structure for efficient updates
- Async thunks with proper error handling
- Loading states managed consistently in finally blocks

### Navigation
- Stack-based navigation with React Navigation
- Type-safe navigation with TypeScript
- Proper screen lifecycle management
- Deep linking support for notifications

## Troubleshooting

### Common Issues

**Metro bundler cache issues:**
```bash
npm start -- --reset-cache
```

**iOS build failures:**
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

**Android build failures:**
```bash
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

**Type errors after dependency updates:**
```bash
rm -rf node_modules
npm install
```

## License

Copyright © 2026 StepFlow. All rights reserved.

## Support

For questions or issues:
- GitHub Issues: [elove333/stepflow-mobile](https://github.com/elove333/stepflow-mobile/issues)
- Email: support@stepflow.app
