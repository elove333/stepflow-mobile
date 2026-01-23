/**
 * Authentication Hook
 */

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../state';
import {
  setLoading,
  setError,
  setAuth,
  updateUser,
  clearAuth,
} from '../state/userSlice';
import * as authApi from '../api/auth';
import { LoginCredentials, RegisterData, User } from '../api/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, tokens, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.user
  );

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        dispatch(setLoading(true));
        const response = await authApi.login(credentials);
        dispatch(
          setAuth({
            user: response.data.user,
            tokens: response.data.tokens,
          })
        );
        return response.data;
      } catch (error: any) {
        dispatch(setError(error.message || 'Login failed'));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterData) => {
      try {
        dispatch(setLoading(true));
        const response = await authApi.register(data);
        dispatch(
          setAuth({
            user: response.data.user,
            tokens: response.data.tokens,
          })
        );
        return response.data;
      } catch (error: any) {
        dispatch(setError(error.message || 'Registration failed'));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await authApi.logout();
      dispatch(clearAuth());
    } catch (error: any) {
      dispatch(setError(error.message || 'Logout failed'));
      throw error;
    }
  }, [dispatch]);

  /**
   * Update user profile
   */
  const updateProfile = useCallback(
    async (data: Partial<User>) => {
      try {
        dispatch(setLoading(true));
        const response = await authApi.updateProfile(data);
        dispatch(updateUser(response.data));
        return response.data;
      } catch (error: any) {
        dispatch(setError(error.message || 'Profile update failed'));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Change password
   */
  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      try {
        dispatch(setLoading(true));
        await authApi.changePassword(currentPassword, newPassword);
        dispatch(setLoading(false));
      } catch (error: any) {
        dispatch(setError(error.message || 'Password change failed'));
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Request password reset
   */
  const requestPasswordReset = useCallback(
    async (email: string) => {
      try {
        dispatch(setLoading(true));
        await authApi.requestPasswordReset(email);
        dispatch(setLoading(false));
      } catch (error: any) {
        dispatch(setError(error.message || 'Password reset request failed'));
        throw error;
      }
    },
    [dispatch]
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
