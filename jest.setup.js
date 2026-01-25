// Mock react-native modules
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-sensors
jest.mock('react-native-sensors', () => ({
  setUpdateIntervalForType: jest.fn(),
  accelerometer: {
    subscribe: jest.fn(() => ({
      unsubscribe: jest.fn(),
    })),
  },
  gyroscope: {
    subscribe: jest.fn(() => ({
      unsubscribe: jest.fn(),
    })),
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
