/**
 * Slice Helpers
 * Common patterns and reducers for Redux slices
 */

import { PayloadAction } from '@reduxjs/toolkit';

/**
 * Interface for state that includes loading and error states
 */
export interface LoadableState {
  isLoading: boolean;
  error: string | null;
}

/**
 * Common reducers for loadable state
 * Provides setLoading, setError, and clearError reducers
 */
export const createLoadableReducers = <T extends LoadableState>() => ({
  setLoading: (state: T, action: PayloadAction<boolean>) => {
    state.isLoading = action.payload;
    if (action.payload) {
      state.error = null;
    }
  },
  setError: (state: T, action: PayloadAction<string>) => {
    state.error = action.payload;
    state.isLoading = false;
  },
  clearError: (state: T) => {
    state.error = null;
  },
});
