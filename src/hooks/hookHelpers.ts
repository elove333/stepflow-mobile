/**
 * Hook Helpers
 * Common patterns for custom hooks
 */

import { useCallback } from 'react';
import { AppDispatch } from '../state';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

/**
 * Creates an async action handler with automatic loading and error management
 * 
 * @param dispatch - Redux dispatch function
 * @param setLoading - Action creator for setting loading state
 * @param setError - Action creator for setting error state
 * @returns A wrapper function that handles try-catch-dispatch pattern
 * 
 * @example
 * const createAsyncAction = useAsyncAction(dispatch, setLoading, setError);
 * const login = useCallback(
 *   createAsyncAction(async (credentials: LoginCredentials) => {
 *     const response = await authApi.login(credentials);
 *     dispatch(setAuth({ user: response.data.user, tokens: response.data.tokens }));
 *     return response.data;
 *   }, 'Login failed'),
 *   [dispatch, createAsyncAction]
 * );
 */
export const useAsyncAction = (
  dispatch: AppDispatch,
  setLoading: ActionCreatorWithPayload<boolean>,
  setError: ActionCreatorWithPayload<string>,
) => {
  return useCallback(
    <TArgs extends any[], TReturn>(
      asyncFn: (...args: TArgs) => Promise<TReturn>,
      errorMessage: string = 'Operation failed',
    ) => {
      return async (...args: TArgs): Promise<TReturn> => {
        try {
          dispatch(setLoading(true));
          const result = await asyncFn(...args);
          return result;
        } catch (error: any) {
          dispatch(setError(error.message || errorMessage));
          throw error;
        }
      };
    },
    [dispatch, setLoading, setError],
  );
};
