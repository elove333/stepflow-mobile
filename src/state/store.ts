/**
 * Redux Store Configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import sessionReducer from './sessionSlice';
import progressReducer from './progressSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    session: sessionReducer,
    progress: progressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['session/startSession', 'session/updateActiveSession'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['session.activeSession.startTime'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
