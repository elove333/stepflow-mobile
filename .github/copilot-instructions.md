# Copilot Instructions for StepFlow Mobile

## Project Overview

StepFlow Mobile is a React Native application for rhythm-based movement training. It serves as the mobile frontend for the StepFlow ecosystem, integrating with:
- **stepflow-backend**: REST/GraphQL API hosted on DigitalOcean (handles auth, user data, lesson content)
- **stepflow-AI**: Movement analysis and scoring service (invoked by backend, not directly by mobile app)

This is a **mobile-only** application deployed to iOS (TestFlight/App Store) and Android (Google Play), NOT to web servers.

## Technology Stack

- **Framework**: React Native with TypeScript
- **State Management**: Redux with Redux Toolkit (@reduxjs/toolkit)
- **Navigation**: React Navigation
- **Styling**: React Native StyleSheet with theme system
- **UI Safety**: react-native-safe-area-context
- **Motion Detection**: Custom motion detection hooks and modules (PoseDetector, Accelerometer, Gyroscope, StepDetector, BeatSync)

## Build & Development

### Install Dependencies
```bash
npm install
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

### Start Metro Bundler
```bash
npm start
```

### Linting and Code Quality
```bash
npm run lint        # Run ESLint
```

### Testing
```bash
npm test            # Run Jest tests
npm run test:watch  # Run tests in watch mode
```

## Coding Standards

### TypeScript
- **Strict mode enabled**: All TypeScript strict compiler options are enforced
- **No `any` types**: Always use explicit types or proper generics
- **No `allowJs`**: JavaScript files are not allowed in this project
- **Path aliases**: Use `@src/*` instead of relative imports from src (e.g., `import { Button } from '@src/components'`)

### React & React Native
- **Functional components only**: Use React hooks, not class components
- **TypeScript for all components**: Use `React.FC` or explicit type annotations
- **Safe area handling**: Always wrap screens with SafeAreaProvider/SafeAreaView
- **Platform-specific code**: Use `Platform.select()` or `.ios.ts`/`.android.ts` files when needed

### Code Style (enforced by Prettier & ESLint)
- **Single quotes** for strings
- **Semicolons** required
- **2 spaces** for indentation
- **100 character** line width limit
- **Trailing commas** in multi-line structures
- **camelCase** for variables, functions, and file names (except components)
- **PascalCase** for component files and class names

### File Organization
```
src/
├── api/           # API client and endpoint definitions
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks (e.g., useMotion)
├── motion/        # Motion detection modules (PoseDetector, Accelerometer, etc.)
├── navigation/    # Navigation configuration and navigators
├── screens/       # Screen components
├── state/         # Redux store, slices, and selectors
├── theme/         # Colors, typography, spacing constants
├── utils/         # Helper functions and utilities
└── App.tsx        # Root application component
```

### Component Structure
- Each component should export a default component and any related types
- Keep component files focused and under 300 lines
- Extract complex logic into custom hooks
- Use theme values from `src/theme` instead of hardcoded values

### State Management
- Use Redux Toolkit for global state
- Create slices in `src/state/`
- Use typed hooks: `useAppDispatch` and `useAppSelector`
- Keep local state in components when it doesn't need to be shared

## Environment & Configuration

### Environment Variables
- Create `.env` file based on `.env.example` (never commit `.env`)
- Environment variables should be prefixed appropriately for React Native
- API base URL points to backend hosted on DigitalOcean

### Configuration Files
- **babel.config.js**: Metro preset + react-native-reanimated plugin
- **metro.config.js**: Metro bundler configuration
- **jest.config.js**: Test configuration with ts-jest
- **tsconfig.json**: TypeScript strict mode with path aliases

## Important Rules

### DO
- Follow the existing code structure and patterns
- Use TypeScript for all new files
- Write tests for new features and bug fixes
- Use theme values for colors, spacing, and typography
- Handle errors gracefully with proper error boundaries
- Test on both iOS and Android platforms
- Use SafeAreaView for screen components
- Follow branch naming conventions from CONTRIBUTING.md (`mobile/*`, `qa/*`)

### DO NOT
- Modify files in `/node_modules`, `/ios`, `/android`, `/dist` directories
- Use `any` type in TypeScript
- Create JavaScript files (`.js`, `.jsx`) - use TypeScript only
- Commit `.env` files or secrets
- Communicate directly with stepflow-AI (always go through backend)
- Add dependencies without checking for security vulnerabilities
- Remove or modify working test files
- Use class components - use functional components with hooks

## Motion Detection Features

This app includes custom motion detection capabilities:
- **PoseDetector**: Camera-based pose detection
- **Accelerometer**: Device motion sensing
- **Gyroscope**: Device rotation sensing
- **StepDetector**: Step counting and rhythm detection
- **BeatSync**: Music beat synchronization

Use the `useMotion` hook to access these features with proper configuration.

## Testing Strategy

- Unit tests for utilities and helpers
- Component tests using React Native Testing Library
- Integration tests for complex flows
- Tests located in `__tests__/` directory
- Test files follow pattern: `*.test.ts` or `*.spec.ts`

## Assets

Assets are organized in the `/assets` directory:
- **audio/**: Sound effects and music (mp3, wav, m4a)
- **animations/**: Lottie animations (json) and video animations
- Follow naming conventions: lowercase with hyphens (e.g., `button-click.mp3`)
- Keep files optimized (audio < 1MB for effects, animations < 100KB for Lottie)

## Integration Notes

- The mobile app **only** communicates with the backend API
- Authentication, user data, and lesson content come from the backend
- Movement analysis is performed by backend (which calls stepflow-AI internally)
- Real-time feedback flows through the backend, not directly from AI service

## Common Tasks

### Adding a New Screen
1. Create component in `src/screens/`
2. Add to `src/navigation/` configuration
3. Update types in navigation types file
4. Add tests in `__tests__/`

### Adding a New Component
1. Create in `src/components/` with TypeScript
2. Export from `src/components/index.ts`
3. Use theme values from `src/theme/`
4. Add Storybook story if applicable

### Adding an API Endpoint
1. Add to appropriate file in `src/api/`
2. Use the API client from `src/api/client.ts`
3. Handle errors appropriately
4. Add TypeScript types for request/response

### Adding State
1. Create a slice in `src/state/`
2. Add to store configuration
3. Export typed selectors and actions
4. Use `useAppSelector` and `useAppDispatch` in components
