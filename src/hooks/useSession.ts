/**
 * Session Hook
 */

import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../state';
import {
  setLoading,
  setError,
  setSessions,
  setSelectedSession,
  startSession as startSessionAction,
  endSession,
  recordStep,
  pauseSession,
  resumeSession,
} from '../state/sessionSlice';
import * as sessionsApi from '../api/sessions';
import { Session, SessionProgress } from '../api/sessions';
import { useAsyncAction } from './hookHelpers';

export const useSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, activeSession, selectedSession, isLoading, error } = useSelector(
    (state: RootState) => state.session,
  );

  const createAsyncAction = useAsyncAction(dispatch, setLoading, setError);

  /**
   * Load available sessions
   */
  const loadSessions = useCallback(
    createAsyncAction(async (params?: { difficulty?: string }) => {
      const response = await sessionsApi.getSessions(params);
      dispatch(setSessions(response.data));
      return response.data;
    }, 'Failed to load sessions'),
    [dispatch, createAsyncAction],
  );

  /**
   * Get session by ID
   */
  const getSession = useCallback(
    createAsyncAction(async (id: string) => {
      const response = await sessionsApi.getSession(id);
      dispatch(setLoading(false));
      return response.data;
    }, 'Failed to load session'),
    [dispatch, createAsyncAction],
  );

  /**
   * Select a session
   */
  const selectSession = useCallback(
    (session: Session | null) => {
      dispatch(setSelectedSession(session));
    },
    [dispatch],
  );

  /**
   * Start a session
   */
  const startSession = useCallback(
    createAsyncAction(async (session: Session) => {
      await sessionsApi.startSession(session.id);
      dispatch(startSessionAction(session));
    }, 'Failed to start session'),
    [dispatch, createAsyncAction],
  );

  /**
   * Record a step during active session
   */
  const recordStepEvent = useCallback(
    (onBeat: boolean) => {
      if (activeSession && !activeSession.isPaused) {
        dispatch(recordStep({ onBeat }));
      }
    },
    [dispatch, activeSession],
  );

  /**
   * Pause active session
   */
  const pause = useCallback(() => {
    dispatch(pauseSession());
  }, [dispatch]);

  /**
   * Resume paused session
   */
  const resume = useCallback(() => {
    dispatch(resumeSession());
  }, [dispatch]);

  /**
   * Complete and end session
   */
  const completeSession = useCallback(
    createAsyncAction(async () => {
      if (!activeSession) {
        throw new Error('No active session');
      }

      const progress: Omit<SessionProgress, 'sessionId' | 'userId' | 'completedAt'> = {
        score: activeSession.score,
        accuracy:
          activeSession.totalSteps > 0
            ? (activeSession.onBeatSteps / activeSession.totalSteps) * 100
            : 0,
        totalSteps: activeSession.totalSteps,
        onBeatSteps: activeSession.onBeatSteps,
      };

      await sessionsApi.completeSession(activeSession.session.id, progress);
      dispatch(endSession());
      return progress;
    }, 'Failed to complete session'),
    [dispatch, activeSession, createAsyncAction],
  );

  /**
   * Cancel active session
   */
  const cancelSession = useCallback(() => {
    dispatch(endSession());
  }, [dispatch]);

  /**
   * Get recommended sessions
   */
  const getRecommendedSessions = useCallback(
    createAsyncAction(async () => {
      const response = await sessionsApi.getRecommendedSessions();
      dispatch(setLoading(false));
      return response.data;
    }, 'Failed to load recommendations'),
    [dispatch, createAsyncAction],
  );

  return {
    sessions,
    activeSession,
    selectedSession,
    isLoading,
    error,
    loadSessions,
    getSession,
    selectSession,
    startSession,
    recordStepEvent,
    pause,
    resume,
    completeSession,
    cancelSession,
    getRecommendedSessions,
  };
};
