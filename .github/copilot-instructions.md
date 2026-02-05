# StepFlow Mobile - GitHub Copilot Instructions

## Project Overview

StepFlow is a React Native mobile application for rhythm-based movement training. The app provides real-time motion detection, beat synchronization, and progress tracking to help users improve their movement timing and coordination.

## Tech Stack

- **Framework**: React Native
- **Language**: TypeScript (strict mode enabled)
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Testing**: Jest with React Native Testing Library
- **Linting**: ESLint with `@react-native-community` config
- **Formatting**: Prettier
- **Build Tools**: Metro bundler
- **Node Version**: 18+

## Coding Guidelines

### TypeScript

- Use strict TypeScript - all files must be `.ts` or `.tsx` (no `.js` or `.jsx`)
- Enable all strict type checking options
- Always provide explicit types for function parameters and return values
- Use interfaces for component props and Redux state shapes
- Avoid `any` type - use `unknown` or proper typing instead
- Use TypeScript's utility types (`Partial`, `Pick`, `Omit`, etc.) when appropriate

### Code Style

- Use **single quotes** for strings
- Use **2 spaces** for indentation (not tabs)
- Maximum line length: **100 characters**
- Always include **trailing commas** in multi-line structures
- Include **semicolons** at the end of statements
- Use **camelCase** for variables and functions, **PascalCase** for components and types

### React/React Native

- Components must be functional components with TypeScript
- Use React hooks (`useState`, `useEffect`, etc.) - no class components
- Component files should use `.tsx` extension
- Export components as named exports when possible
- Keep components pure and reusable - avoid screen-specific logic in components
- Use `React.FC` type for functional components with explicit prop types
- Prefer destructuring props in component parameters

### State Management

- Use Redux Toolkit for state management (`createSlice`, `configureStore`)
- Organize state into logical slices (e.g., `userSlice`, `sessionSlice`, `progressSlice`)
- Use `createAsyncThunk` for async operations
- Keep Redux state normalized and serializable
- Avoid storing derived data in Redux - use selectors instead
- Use typed hooks (`useAppDispatch`, `useAppSelector`) instead of raw Redux hooks

### Testing

- Write Jest tests for all new components and utilities
- Test files should be colocated with source files or in `__tests__` directories
- Use React Native Testing Library for component testing
- Focus on testing behavior, not implementation details
- Always include error cases and edge cases in tests
- Run `npm test` to execute tests

## Project Structure

```
src/
├── api/              # API client and endpoints (axios-based)
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── motion/           # Motion detection modules (pose, accelerometer, step detection)
├── navigation/       # React Navigation configuration
├── screens/          # Application screens (Home, Session, Feedback, Progress, Settings)
├── state/            # Redux store and slices
├── theme/            # Design tokens (colors, spacing, typography)
├── utils/            # Utility functions (validators, timing, movement helpers)
└── App.tsx           # Root component
```

### Key Conventions

- **API Layer**: All API calls go through `src/api/` modules, using the centralized client
- **Components**: Pure, reusable components in `src/components/` - no screen-specific logic
- **Hooks**: Custom hooks in `src/hooks/` for reusable logic (auth, session, motion)
- **Screens**: Full screen components in `src/screens/` that compose smaller components
- **State**: Redux slices in `src/state/` - one slice per domain (user, session, progress)
- **Theme**: Use theme tokens from `src/theme/` for consistent styling - no hardcoded colors or spacing
- **Path Aliases**: Use `@src/*` imports configured in `tsconfig.json`

## Development Workflow

### Running the App

```bash
npm install                      # Install dependencies
npx react-native start           # Start Metro bundler
npx react-native run-ios         # Run on iOS simulator
npx react-native run-android     # Run on Android emulator
```

### Quality Checks

```bash
# If npm scripts are configured in package.json:
npm run type-check   # TypeScript compilation check
npm run lint         # ESLint check
npm test             # Run Jest tests

# Or use these direct commands:
npx tsc --noEmit     # TypeScript compilation check
npx eslint .         # ESLint check
npm test             # Run Jest tests
```

### Before Committing

1. Run type checking: `npx tsc --noEmit` (or `npm run type-check` if configured)
2. Run linting: `npx eslint .` (or `npm run lint` if configured)
3. Run tests: `npm test`
4. Ensure all checks pass before pushing

## CI/CD

The repository uses GitHub Actions CI (`.github/workflows/ci.yml`) that runs on:
- Pushes to main, develop, and feature branches
- Pull requests
- Workflow dispatches

The CI pipeline runs:
1. TypeScript type checking (`npm run type-check`)
2. ESLint linting (`npm run lint`)
3. Jest tests (`npm test`)

**Note**: The CI workflow expects `type-check` and `lint` scripts in package.json. If these scripts are not configured, add them:
```json
"scripts": {
  "type-check": "tsc --noEmit",
  "lint": "eslint .",
  "test": "jest"
}
```

All checks must pass before merging.

## Best Practices

### Component Design

- Keep components small and focused on a single responsibility
- Use composition over prop drilling
- Prefer function composition for logic reuse
- Document complex components with JSDoc comments

### Motion Detection

- Check device capabilities before using motion sensors
- Provide fallback methods for unsupported features
- Make thresholds and parameters configurable
- Handle sensor permission requests gracefully

### Performance

- Use `React.memo` for expensive components that re-render frequently
- Optimize FlatList with `keyExtractor`, `getItemLayout`, and `removeClippedSubviews`
- Avoid inline function definitions in render methods
- Use `useCallback` and `useMemo` to prevent unnecessary re-renders

### Error Handling

- Always handle async errors with try-catch or `.catch()`
- Provide user-friendly error messages
- Log errors appropriately for debugging
- Handle API errors gracefully with proper status codes

### Security

- Never commit API keys or secrets - use `.env` files (not committed)
- Validate all user inputs
- Sanitize data before displaying
- Use secure storage for sensitive data (authentication tokens)

## Resources

- Main documentation: `README.md`
- Contributing guidelines: `CONTRIBUTING.md`
- Environment setup: `.env.example`
- API documentation: See `src/api/` modules for endpoint details
- Design tokens: `src/theme/` for colors, spacing, and typography

## Branch Naming

Follow the conventions in `CONTRIBUTING.md`:
- `mobile/**/*` - All mobile-related branches
- `qa/**` - QA and testing branches
- Standard prefixes: `feature/`, `bugfix/`, `hotfix/`, `release/`, `experiment/`
