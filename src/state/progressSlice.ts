/**
 * Progress State Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserStats, ProgressData, Achievement } from '../api/analytics';

export interface ProgressState {
  stats: UserStats | null;
  progressData: ProgressData[];
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  stats: null,
  progressData: [],
  achievements: [],
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
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
    setStats: (state, action: PayloadAction<UserStats>) => {
      state.stats = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },
    setProgressData: (state, action: PayloadAction<ProgressData[]>) => {
      state.progressData = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addProgressData: (state, action: PayloadAction<ProgressData>) => {
      const existingIndex = state.progressData.findIndex(
        (p) => p.date === action.payload.date
      );
      if (existingIndex !== -1) {
        state.progressData[existingIndex] = action.payload;
      } else {
        state.progressData.push(action.payload);
      }
    },
    setAchievements: (state, action: PayloadAction<Achievement[]>) => {
      state.achievements = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    unlockAchievement: (state, action: PayloadAction<string>) => {
      const achievement = state.achievements.find(
        (a) => a.id === action.payload
      );
      if (achievement && !achievement.unlockedAt) {
        achievement.unlockedAt = new Date().toISOString();
      }
    },
    updateAchievementProgress: (
      state,
      action: PayloadAction<{ id: string; progress: number }>
    ) => {
      const achievement = state.achievements.find(
        (a) => a.id === action.payload.id
      );
      if (achievement) {
        achievement.progress = action.payload.progress;
      }
    },
    clearProgress: (state) => {
      state.stats = null;
      state.progressData = [];
      state.achievements = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setStats,
  updateStats,
  setProgressData,
  addProgressData,
  setAchievements,
  unlockAchievement,
  updateAchievementProgress,
  clearProgress,
  clearError,
} = progressSlice.actions;

export default progressSlice.reducer;
