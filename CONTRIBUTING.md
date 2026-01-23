# Contributing to STEPFLOW Mobile

Thank you for your interest in contributing to STEPFLOW Mobile! This document provides guidelines and best practices for contributing to this project.

## Table of Contents
- [Definition of Done (DoD)](#definition-of-done-dod)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)

## Definition of Done (DoD)

Before any code can be merged into `main` or `develop`, it **must** meet all the criteria in our Definition of Done:

### 1. Code Implementation
- ✅ Code is fully implemented and functional
- ✅ All TypeScript types are properly defined (no `any` types unless absolutely necessary)
- ✅ Code follows the project's architecture and design patterns
- ✅ No placeholder code or TODOs are left in the codebase
- ✅ No debugging code (e.g., `console.log`) remains in the final code

### 2. Project Structure & Organization
- ✅ Code is organized following the proper folder structure:
  ```
  src/
  ├── screens/          # Screen components (one per route)
  ├── components/       # Reusable UI components
  ├── hooks/           # Custom React hooks
  ├── state/           # State management (Redux, Context, etc.)
  ├── services/        # API calls and external services
  ├── utils/           # Helper functions and utilities
  ├── types/           # TypeScript type definitions
  ├── constants/       # App constants and configurations
  └── navigation/      # Navigation configuration
  ```
- ✅ Files follow naming conventions:
  - Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
  - Hooks: `camelCase.ts` with `use` prefix (e.g., `useAuth.ts`)
  - Utils: `camelCase.ts` (e.g., `formatDate.ts`)
  - Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)
- ✅ Domain logic is properly segregated:
  - Business logic is separated from UI components
  - API calls are in service files, not in components
  - Complex logic is extracted into hooks or utility functions

### 3. Cross-Platform Compatibility
- ✅ App runs without crashes on iOS
- ✅ App runs without crashes on Android
- ✅ UI looks correct on both platforms
- ✅ Platform-specific code uses appropriate conditional logic

### 4. Code Quality & Standards
- ✅ TypeScript type checking passes: `npm run type-check`
- ✅ ESLint passes without errors: `npm run lint`
- ✅ Prettier formatting is applied: `npm run format:check`
- ✅ No TypeScript errors or warnings
- ✅ Code follows React/React Native best practices

### 5. Testing
- ✅ Unit tests are written for:
  - Utility functions
  - Custom hooks
  - Redux actions/reducers
  - Service functions
- ✅ Integration tests verify:
  - Component interactions
  - Data flow between components
  - State management integration
- ✅ E2E tests (when applicable) cover:
  - Critical user flows
  - Main navigation paths
  - Form submissions
- ✅ All tests pass: `npm test`
- ✅ Test coverage is maintained or improved

### 6. Documentation
- ✅ Code is self-documenting with clear naming
- ✅ Complex logic includes comments explaining the "why"
- ✅ README is updated for new features or setup changes
- ✅ API changes are documented
- ✅ JSDoc comments for public functions/components (when appropriate)

### 7. CI/CD
- ✅ All CI checks pass
- ✅ Branch is up to date with the target branch
- ✅ No merge conflicts
- ✅ Build succeeds on CI

### 8. Code Review
- ✅ PR has a clear title and description
- ✅ PR follows the template and includes:
  - What changed
  - Why it changed
  - How it was tested
- ✅ At least one approving review from a team member
- ✅ All review comments are addressed

## Getting Started

1. **Fork and Clone the Repository**
   ```bash
   git clone https://github.com/elove333/stepflow-mobile.git
   cd stepflow-mobile
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Development Environment**
   - For iOS: Ensure Xcode is installed
   - For Android: Ensure Android Studio and Android SDK are set up
   - Install required pods for iOS: `cd ios && pod install && cd ..`

4. **Run the App**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bug-fix
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow the project structure and naming conventions
   - Add tests as you go

3. **Test Your Changes**
   ```bash
   # Run type checking
   npm run type-check
   
   # Run linting
   npm run lint
   
   # Run formatting check
   npm run format:check
   
   # Fix formatting issues
   npm run format
   
   # Run tests
   npm test
   
   # Run E2E tests (if applicable)
   npm run detox:build
   npm run detox:test
   ```

4. **Commit Your Changes**
   - Use meaningful commit messages
   - Follow commit message guidelines (see below)

5. **Push and Create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Use the PR template
   - Fill out all sections completely
   - Link related issues

## Project Structure

```
stepflow-mobile/
├── src/
│   ├── screens/              # Screen components
│   │   └── HomeScreen.tsx
│   ├── components/           # Reusable components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.ts
│   ├── state/               # State management
│   │   ├── slices/
│   │   └── store.ts
│   ├── services/            # API and external services
│   │   └── api.ts
│   ├── utils/               # Utility functions
│   │   └── formatDate.ts
│   ├── types/               # TypeScript types
│   │   └── User.ts
│   ├── constants/           # Constants
│   │   └── API_ENDPOINTS.ts
│   └── navigation/          # Navigation setup
│       └── RootNavigator.tsx
├── __tests__/               # Test files
├── e2e/                     # E2E tests
├── ios/                     # iOS native code
├── android/                 # Android native code
└── package.json
```

## Coding Standards

### TypeScript
- Always define proper types
- Avoid using `any` - use `unknown` if the type is truly unknown
- Use interfaces for object shapes
- Use type aliases for unions and complex types

### React/React Native
- Use functional components with hooks
- Keep components small and focused (single responsibility)
- Extract complex logic into custom hooks
- Use memo, useCallback, useMemo for optimization (when needed)
- Avoid inline styles - use StyleSheet.create

### Naming Conventions
- **Components**: PascalCase (e.g., `UserProfile`)
- **Functions**: camelCase (e.g., `fetchUserData`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: Match the main export (e.g., `UserProfile.tsx`, `useAuth.ts`)

## Testing Requirements

### Unit Tests
Write unit tests for:
- Utility functions
- Custom hooks (using `@testing-library/react-hooks`)
- Redux actions and reducers
- Service functions
- Pure business logic

**Example:**
```typescript
// __tests__/utils/formatDate.test.ts
import { formatDate } from '../../src/utils/formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('01/15/2024');
  });
});
```

### Integration Tests
Write integration tests for:
- Component interactions
- State management integration
- API integration
- Navigation flows

**Example:**
```typescript
// __tests__/components/UserProfile.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import UserProfile from '../../src/components/UserProfile';

describe('UserProfile', () => {
  it('should update user info on save', async () => {
    const { getByText, getByTestId } = render(<UserProfile />);
    // Test logic here
  });
});
```

### E2E Tests
Write E2E tests for:
- Critical user journeys
- Authentication flows
- Main app features
- Cross-screen interactions

## Pull Request Process

1. **Fill Out the PR Template Completely**
   - Provide a clear description of changes
   - Explain what changed and why
   - List how you tested the changes
   - Add screenshots for UI changes

2. **Example of a Good PR Description**
   ```markdown
   ## Description
   Added user authentication with email and password, including login and signup screens.
   
   ## What Changed and Why?
   - Created LoginScreen and SignupScreen components
   - Added authentication service with API integration
   - Implemented useAuth hook for managing auth state
   - Added form validation using react-hook-form
   
   This change was needed to allow users to securely access the app.
   
   ## How Has This Been Tested?
   - ✅ Unit tests for auth service functions
   - ✅ Integration tests for login/signup forms
   - ✅ E2E tests for full authentication flow
   - ✅ Manual testing on iOS (iPhone 14 Pro simulator)
   - ✅ Manual testing on Android (Pixel 6 emulator)
   ```

3. **Ensure All Checks Pass**
   - TypeScript: ✅
   - ESLint: ✅
   - Prettier: ✅
   - Tests: ✅
   - CI Pipeline: ✅

4. **Request Review**
   - Tag relevant reviewers
   - Respond to feedback promptly
   - Make requested changes

5. **After Approval**
   - Ensure branch is up to date
   - Squash commits if needed
   - Merge using the appropriate strategy

## Commit Message Guidelines

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

**Good commit messages:**
```
feat(auth): add user login functionality

- Implemented login screen with email/password
- Added authentication service
- Created useAuth hook for state management

Closes #123
```

```
fix(navigation): resolve navigation stack overflow

Fixed infinite loop in navigation when user logs out

Fixes #456
```

**Bad commit messages:**
```
updated stuff
fix
changes
wip
```

## Branch Protection Rules

The `main` and `develop` branches are protected:
- ✅ Pull requests required
- ✅ At least 1 approving review required
- ✅ All CI checks must pass
- ✅ Branch must be up to date before merging

## Questions?

If you have questions or need help, please:
1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label

Thank you for contributing to STEPFLOW Mobile! 🚀
