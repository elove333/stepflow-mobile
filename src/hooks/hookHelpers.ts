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
 * @param errorMessage - Default error message if none provided
 * @returns A wrapper function that handles try-catch-dispatch pattern
 * 
 * @example
 * const login = useAsyncAction(
 *   dispatch,
 *   setLoading,
 *   setError,
 *   'Login failed'
 * )(async (credentials: LoginCredentials) => {
 *   const response = await authApi.login(credentials);
 *   dispatch(setAuth({ user: response.data.user, tokens: response.data.tokens }));
 *   return response.data;
 * });
 */
export const useAsyncAction = <TArgs extends any[], TReturn>(
  dispatch: AppDispatch,
  setLoading: ActionCreatorWithPayload<boolean>,
  setError: ActionCreatorWithPayload<string>,
  errorMessage: string = 'Operation failed',
) => {
  return useCallback(
    (asyncFn: (...args: TArgs) => Promise<TReturn>) => {
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
    [dispatch, setLoading, setError, errorMessage],
  );
};
