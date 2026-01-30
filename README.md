{
  "name": "stepflow-mobile",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "scripts": {
    "start": "react-native start",
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "test": "jest",
    "test:ci": "jest --ci",
    "lint": "eslint .",
    "format": "prettier --check .",
    "format:write": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "detox:build:ios": "detox build -c ios.sim.release",
    "detox:test:ios": "detox test -c ios.sim.release",
    "detox:build:android": "detox build -c android.emu.release",
    "detox:test:android": "detox test -c android.emu.release"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.0",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/native-stack": "^6.9.17",
    "react-native-screens": "^3.29.0",
    "react-native-safe-area-context": "^4.7.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@babel/core": "^7.23.0",
    "@babel/runtime": "^7.23.0",
    "@react-native-community/eslint-config": "^3.2.0",
    "@types/jest": "^29.5.5",
    "@types/react": "^18.2.21",
    "@types/react-native": "^0.73.0",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.7.0",
    "detox": "^20.0.0",
    "eslint": "^8.52.0",
    "jest": "^29.7.0",
    "metro-react-native-babel-preset": "^0.76.0",
    "prettier": "^3.1.0",
    "react-test-renderer": "18.2.0",
    "typescript": "^5.3.3"
  },
  "jest": {
    "preset": "react-native",
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
  },
  "detox": {
    "testRunner": "jest",
    "runnerConfig": "e2e/jest.config.js",
    "configurations": {
      "ios.sim.release": {
        "type": "ios.simulator",
        "binaryPath": "ios/build/Build/Products/Release-iphonesimulator/stepflow-mobile.app",
        "build": "xcodebuild -workspace ios/stepflow-mobile.xcworkspace -scheme stepflow-mobile -configuration Release -sdk iphonesimulator -derivedDataPath ios/build"
      },
      "android.emu.release": {
        "type": "android.emulator",
        "binaryPath": "android/app/build/outputs/apk/release/app-release.apk",
        "build": "cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd .."
      }
    }
  }
}
#