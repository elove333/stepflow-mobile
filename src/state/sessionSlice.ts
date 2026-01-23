/**
 * Session State Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Session } from '../api/sessions';

export interface ActiveSession {
  session: Session;
  startTime: number;
  currentBeat: number;
  totalSteps: number;
  onBeatSteps: number;
  score: number;
  isPaused: boolean;
}

export interface SessionState {
  sessions: Session[];
  activeSession: ActiveSession | null;
  selectedSession: Session | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  activeSession: null,
  selectedSession: null,
  isLoading: false,
  error: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSessions: (state, action: PayloadAction<Session[]>) => {
      state.sessions = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addSession: (state, action: PayloadAction<Session>) => {
      state.sessions.push(action.payload);
    },
    updateSession: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Session> }>
    ) => {
      const index = state.sessions.findIndex(
        (s) => s.id === action.payload.id
      );
      if (index !== -1) {
        state.sessions[index] = {
          ...state.sessions[index],
          ...action.payload.data,
        };
      }
    },
    removeSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);
    },
    setSelectedSession: (state, action: PayloadAction<Session | null>) => {
      state.selectedSession = action.payload;
    },
    startSession: (state, action: PayloadAction<Session>) => {
      state.activeSession = {
        session: action.payload,
        startTime: Date.now(),
        currentBeat: 0,
        totalSteps: 0,
        onBeatSteps: 0,
        score: 0,
        isPaused: false,
      };
      state.selectedSession = null;
    },
    updateActiveSession: (
      state,
      action: PayloadAction<Partial<Omit<ActiveSession, 'session'>>>
    ) => {
      if (state.activeSession) {
        state.activeSession = {
          ...state.activeSession,
          ...action.payload,
        };
      }
    },
    incrementBeat: (state) => {
      if (state.activeSession) {
        state.activeSession.currentBeat += 1;
      }
    },
    recordStep: (state, action: PayloadAction<{ onBeat: boolean }>) => {
      if (state.activeSession) {
        state.activeSession.totalSteps += 1;
        if (action.payload.onBeat) {
          state.activeSession.onBeatSteps += 1;
        }
        // Calculate accuracy as percentage
        const accuracy =
          state.activeSession.totalSteps > 0
            ? (state.activeSession.onBeatSteps /
                state.activeSession.totalSteps) *
              100
            : 0;
        state.activeSession.score = Math.round(accuracy);
      }
    },
    pauseSession: (state) => {
      if (state.activeSession) {
        state.activeSession.isPaused = true;
      }
    },
    resumeSession: (state) => {
      if (state.activeSession) {
        state.activeSession.isPaused = false;
      }
    },
    endSession: (state) => {
      state.activeSession = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSessions,
  addSession,
  updateSession,
  removeSession,
  setSelectedSession,
  startSession,
  updateActiveSession,
  incrementBeat,
  recordStep,
  pauseSession,
  resumeSession,
  endSession,
  clearError,
} = sessionSlice.actions;

export default sessionSlice.reducer;
