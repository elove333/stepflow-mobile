# GitHub Copilot Instructions for stepflow-mobile

## Project Overview
This is a React Native mobile application for StepFlow - a rhythm-based movement training app that uses motion detection to help users synchronize their movements with music.

## Technology Stack
- **Framework**: React Native 0.72
- **Language**: TypeScript 5.2
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Navigation**: React Navigation v6
- **Testing**: Jest
- **Linting**: ESLint with @typescript-eslint v8
- **Code Formatting**: Prettier

## Code Style and Conventions

### TypeScript
- Use TypeScript for all new code (`.ts`, `.tsx` extensions)
- Enable strict type checking
- Avoid using `any` types
- Define interfaces for all props and complex types
- Use type inference where possible

### React Components
- Use functional components with hooks
- Follow React Native best practices
- Use TypeScript for props typing
- Keep components pure and reusable
- Avoid inline styles (use StyleSheet or theme utilities)

### File Organization
```
src/
├── api/              # API client and endpoints
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── motion/           # Motion detection modules
├── navigation/       # Navigation configuration
├── screens/          # Application screens
├── state/            # Redux state management
├── theme/            # Design tokens (colors, spacing, typography)
├── utils/            # Utility functions
└── App.tsx           # Main App component
```

### Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`, `LiveSessionScreen.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`, `useSession.ts`)
- Utilities: camelCase (e.g., `validators.ts`, `timingHelpers.ts`)
- Constants: UPPER_SNAKE_CASE
- State slices: camelCase with `Slice` suffix (e.g., `userSlice.ts`)

## Development Workflow

### Building and Testing
```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Run linter
npm run lint

# Run tests
npm test

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Before Committing
Always run these checks before committing:
1. `npm run type-check` - Ensure TypeScript compiles without errors
2. `npm run lint` - Fix linting issues (some can be auto-fixed with `--fix`)
3. `npm test` - Run test suite (when tests exist)

## API Integration
- All API calls go through the centralized client in `src/api/client.ts`
- Use axios for HTTP requests
- Handle errors consistently with try-catch blocks
- Support JWT authentication with token refresh logic

## State Management
- Use Redux Toolkit for global state
- Create separate slices for different domains (user, session, progress)
- Use hooks (`useSelector`, `useDispatch`) to interact with the store
- Keep state normalized and avoid deeply nested structures

## Motion Detection
- Support multiple motion detection methods:
  - Device accelerometer and gyroscope
  - Camera-based pose detection (when available)
  - Step detection algorithms
- Handle graceful degradation when sensors are unavailable
- Optimize for performance (motion updates can be frequent)

## Navigation
- Use React Navigation v6 stack navigator
- Type-safe navigation with TypeScript
- Keep navigation configuration in `src/navigation/`
- Properly handle screen lifecycle (focus, blur, unmount)

## Known Linting Issues
The project currently has some linting warnings/errors in existing code:
- Unused variables in some screens
- Missing React Hook dependencies
- Variable shadowing in error handling blocks

When working on new code:
- Avoid introducing similar issues
- If fixing existing code, address linting issues in the same file

## ESLint Configuration
- Using @typescript-eslint v8 (upgraded from v6)
- Deprecated rule `@typescript-eslint/func-call-spacing` is disabled
- Jest environment is enabled for test files
- TypeScript-specific rules override base ESLint rules for `.ts`/`.tsx` files

## Testing Guidelines
- Write tests for critical business logic
- Test custom hooks
- Test API integration functions
- Use Jest as the primary test runner
- Optionally use React Native Testing Library once `@testing-library/react-native` is added to `devDependencies` and configured
- Mock React Native modules appropriately (for example, via a Jest setup file such as `jest.setup.js` if configured)

## Performance Considerations
- Motion detection runs frequently - optimize calculations
- Use React.memo for expensive component renders
- Debounce/throttle rapid user interactions
- Be mindful of animation performance

## Common Pitfalls to Avoid
1. Don't use inline styles - use StyleSheet or theme utilities
2. Don't directly mutate Redux state (use Redux Toolkit's Immer integration)
3. Don't forget to unsubscribe from sensors on unmount
4. Don't block the main thread with heavy computations
5. Don't hardcode API endpoints - use environment variables

## Helpful Resources
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Navigation Documentation](https://reactnavigation.org/)

## When Making Changes
1. Understand the existing code structure first
2. Follow established patterns and conventions
3. Keep changes minimal and focused
4. Test your changes thoroughly
5. Update documentation if needed
6. Run type checking and linting before committing
