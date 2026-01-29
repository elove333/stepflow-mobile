/**
 * User State Slice
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthTokens } from '../api/auth';
import { LoadableState, createLoadableReducers } from './sliceHelpers';

export interface UserState extends LoadableState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    ...createLoadableReducers<UserState>(),
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
    },
    setAuth: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setUser,
  setTokens,
  setAuth,
  updateUser,
  clearAuth,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
