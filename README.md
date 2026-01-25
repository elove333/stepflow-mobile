# STEPFLOW Mobile — React Native, Swift, and Kotlin

A cross-platform mobile application built with React Native, Swift, and Kotlin.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- React Native development environment set up
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

```bash
# Clone the repository
git clone https://github.com/elove333/stepflow-mobile.git
cd stepflow-mobile

# Install dependencies
npm install

# iOS setup
cd ios && pod install && cd ..

# Run the app
npm run ios    # For iOS
npm run android # For Android
```

## 📋 Development Workflow

This project follows a strict **Definition of Done** (DoD) to ensure code quality and consistency.

### Before You Start
1. Read the <a>Contributing Guidelines</a>
2. Familiarize yourself with the <a>DoD requirements</a>
3. Review the <a>Branch Protection Rules</a>

### Development Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the project structure

3. **Validate your code locally**
   ```bash
   npm run type-check    # TypeScript validation
   npm run lint          # ESLint checks
   npm run format:check  # Prettier formatting
   npm test             # Run tests
   ```

4. **Create a Pull Request** using the provided template

5. **Pass all CI checks** and get at least 1 approval

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run ios` | Run the app on iOS simulator |
| `npm run android` | Run the app on Android emulator |
| `npm start` | Start Metro bundler |
| `npm test` | Run unit and integration tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code with ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting without changes |
| `npm run type-check` | Validate TypeScript types |
| `npm run detox:build` | Build E2E tests |
| `npm run detox:test` | Run E2E tests |

## 🏗️ Project Structure

```
stepflow-mobile/
├── src/
│   ├── screens/          # Screen components
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── state/           # State management
│   ├── services/        # API services
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── constants/       # App constants
│   └── navigation/      # Navigation setup
├── __tests__/           # Test files
├── ios/                 # iOS native code
├── android/             # Android native code
└── e2e/                # E2E tests
```

## ✅ Definition of Done

All code contributions must meet the following criteria:

- ✅ Code is fully implemented and functional
- ✅ TypeScript types are properly defined
- ✅ Code follows project structure and naming conventions
- ✅ App runs without crashes on iOS and Android
- ✅ All tests pass (unit, integration, E2E)
- ✅ Code passes TypeScript, ESLint, and Prettier checks
- ✅ Documentation is updated
- ✅ PR has been reviewed and approved
- ✅ All CI checks pass

See <a>CONTRIBUTING.md</a> for complete details.

## 🔄 CI/CD Pipeline

Our GitHub Actions workflow automatically:
- ✅ Runs TypeScript type checking
- ✅ Lints code with ESLint
- ✅ Checks code formatting with Prettier
- ✅ Runs unit and integration tests
- ✅ Runs E2E tests
- ✅ Validates PR titles and descriptions
- ✅ Checks commit message quality
- ✅ Runs regression tests after merge

## 📚 Documentation

- <a>Contributing Guidelines</a> - How to contribute
- <a>Branch Protection</a> - Branch protection setup
- <a>Implementation Summary</a> - DoD integration details
- <a>Requirements Verification</a> - Implementation verification

## 🤝 Contributing

We welcome contributions! Please read our <a>Contributing Guidelines</a> before submitting a pull request.

### Quick Contribution Checklist
- [ ] Fork the repository
- [ ] Create a feature branch
- [ ] Make your changes
- [ ] Run all quality checks locally
- [ ] Create a PR using the template
- [ ] Ensure all CI checks pass
- [ ] Get at least 1 approval

## 📝 License

[License information to be added]

## 🙋 Support

For questions or issues, please create an issue in the GitHub repository.

---

**Built with ❤️ by the STEPFLOW Team**
