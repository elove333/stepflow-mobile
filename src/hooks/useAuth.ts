/**
 * Authentication Hook
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../state';
import { setLoading, setError, setAuth, updateUser, clearAuth } from '../state/userSlice';
import * as authApi from '../api/auth';
import { LoginCredentials, RegisterData, User } from '../api/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, tokens, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.user,
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
          }),
        );
        return response.data;
      } catch (err: any) {
        // Using 'err' instead of 'error' to avoid variable shadowing
        dispatch(setError(err.message || 'Login failed'));
        throw err;
      }
    },
    [dispatch],
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
          }),
        );
        return response.data;
      } catch (err: any) {
        // Using 'err' instead of 'error' to avoid variable shadowing
        dispatch(setError(err.message || 'Registration failed'));
        throw err;
      }
    },
    [dispatch],
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      await authApi.logout();
      dispatch(clearAuth());
    } catch (err: any) {
      // Using 'err' instead of 'error' to avoid variable shadowing
      dispatch(setError(err.message || 'Logout failed'));
      throw err;
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
      } catch (err: any) {
        // Using 'err' instead of 'error' to avoid variable shadowing
        dispatch(setError(err.message || 'Profile update failed'));
        throw err;
      }
    },
    [dispatch],
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
      } catch (err: any) {
        // Using 'err' instead of 'error' to avoid variable shadowing
        dispatch(setError(err.message || 'Password change failed'));
        throw err;
      }
    },
    [dispatch],
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
      } catch (err: any) {
        // Using 'err' instead of 'error' to avoid variable shadowing
        dispatch(setError(err.message || 'Password reset request failed'));
        throw err;
      }
    },
    [dispatch],
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
