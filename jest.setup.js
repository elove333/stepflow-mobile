// jest.setup.js

// Mock react-native-gesture-handler (if available)
try {
  require('react-native-gesture-handler/jestSetup');
} catch (e) {
  // Optional dependency, not required for tests
}

// Mock react-native modules
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-sensors
jest.mock('react-native-sensors', () => ({
  accelerometer: jest.fn(),
  gyroscope: jest.fn(),
  setUpdateIntervalForType: jest.fn(),
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
