import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  HomeScreen,
  SessionPickerScreen,
  LiveSessionScreen,
  FeedbackScreen,
  ProgressScreen,
  SettingsScreen,
} from '../screens';

export type MainStackParamList = {
  Home: undefined;
  SessionPicker: undefined;
  LiveSession: undefined;
  Feedback: undefined;
  Progress: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<MainStackParamList>();

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'StepFlow' }}
      />
      <Stack.Screen
        name="SessionPicker"
        component={SessionPickerScreen}
        options={{ title: 'Choose Session' }}
      />
      <Stack.Screen
        name="LiveSession"
        component={LiveSessionScreen}
        options={{
          title: 'Live Session',
          headerLeft: () => null, // Prevent back navigation during session
        }}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: 'Feedback',
          headerLeft: () => null, // Prevent back navigation
        }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};
