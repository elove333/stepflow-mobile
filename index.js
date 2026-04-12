import { AppRegistry } from "react-native";
import App from "./src/App";
import { name as appName } from "./app.json";
/**
 * StepFlow Mobile App
 * Entry point for the application
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './package.json';

AppRegistry.registerComponent(appName, () => App);
