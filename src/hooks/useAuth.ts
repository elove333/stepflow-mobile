/**
 * Authentication Hook
 */

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../state';
import { setLoading, setError, setAuth, updateUser, clearAuth } from '../state/userSlice';
import * as authApi from '../api/auth';
import { LoginCredentials, RegisterData, User } from '../api/auth';
import { useAsyncAction } from './hookHelpers';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, tokens, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.user,
  );

  const createAsyncAction = useAsyncAction(dispatch, setLoading, setError);

  /**
   * Login user
   */
  const login = useCallback(
    createAsyncAction(async (credentials: LoginCredentials) => {
      const response = await authApi.login(credentials);
      dispatch(
        setAuth({
          user: response.data.user,
          tokens: response.data.tokens,
        }),
      );
      return response.data;
    }, 'Login failed'),
    [dispatch, createAsyncAction],
  );

  /**
   * Register new user
   */
  const register = useCallback(
    createAsyncAction(async (data: RegisterData) => {
      const response = await authApi.register(data);
      dispatch(
        setAuth({
          user: response.data.user,
          tokens: response.data.tokens,
        }),
      );
      return response.data;
    }, 'Registration failed'),
    [dispatch, createAsyncAction],
  );

  /**
   * Logout user
   */
  const logout = useCallback(
    createAsyncAction(async () => {
      await authApi.logout();
      dispatch(clearAuth());
    }, 'Logout failed'),
    [dispatch, createAsyncAction],
  );

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    createAsyncAction(async (data: Partial<User>) => {
      const response = await authApi.updateProfile(data);
      dispatch(updateUser(response.data));
      return response.data;
    }, 'Profile update failed'),
    [dispatch, createAsyncAction],
  );

  /**
   * Change password
   */
  const changePassword = useCallback(
    createAsyncAction(async (currentPassword: string, newPassword: string) => {
      await authApi.changePassword(currentPassword, newPassword);
      dispatch(setLoading(false));
    }, 'Password change failed'),
    [dispatch, createAsyncAction],
  );

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(
    createAsyncAction(async (email: string) => {
      await authApi.requestPasswordReset(email);
      dispatch(setLoading(false));
    }, 'Password reset request failed'),
    [dispatch, createAsyncAction],
  );

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
  };
};
