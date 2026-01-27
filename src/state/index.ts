export { store } from './store';
export type { RootState, AppDispatch } from './store';

// User slice exports
export {
  setLoading as setUserLoading,
  setError as setUserError,
  setUser,
  setTokens,
  setAuth,
  updateUser,
  clearAuth,
  clearError as clearUserError,
} from './userSlice';
export type { UserState } from './userSlice';

// Session slice exports
export {
  setLoading as setSessionLoading,
  setError as setSessionError,
  setSessions,
  addSession,
  updateSession as updateSessionState,
  removeSession,
  setSelectedSession,
  startSession as startSessionState,
  updateActiveSession,
  incrementBeat,
  recordStep,
  pauseSession,
  resumeSession,
  endSession,
  clearError as clearSessionError,
} from './sessionSlice';
export type { SessionState, ActiveSession } from './sessionSlice';

// Progress slice exports
export {
  setLoading as setProgressLoading,
  setError as setProgressError,
  setStats,
  updateStats,
  setProgressData,
  addProgressData,
  setAchievements,
  unlockAchievement,
  updateAchievementProgress,
  clearProgress,
  clearError as clearProgressError,
} from './progressSlice';
export type { ProgressState } from './progressSlice';
