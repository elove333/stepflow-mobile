// Jest setup file
// Add global test configuration and mocks here

// Mock React Native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Setup global test environment
global.console = {
  ...console,
  // Suppress console errors/warnings in tests if needed
  // error: jest.fn(),
  // warn: jest.fn(),
};
