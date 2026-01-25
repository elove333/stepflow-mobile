/**
 * Session Hook
 */

import { useCallback } from 'react';
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

export const useSession = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sessions, activeSession, selectedSession, isLoading, error } =
    useSelector((state: RootState) => state.session);

  /**
   * Load available sessions
   */
  const loadSessions = useCallback(
    async (params?: { difficulty?: string }) => {
      try {
        dispatch(setLoading(true));
        const response = await sessionsApi.getSessions(params);
        dispatch(setSessions(response.data));
        return response.data;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to load sessions'));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Get session by ID
   */
  const getSession = useCallback(
    async (id: string) => {
      try {
        dispatch(setLoading(true));
        const response = await sessionsApi.getSession(id);
        return response.data;
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to load session'));
        throw err;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Select a session
   */
  const selectSession = useCallback(
    (session: Session | null) => {
      dispatch(setSelectedSession(session));
    },
    [dispatch]
  );

  /**
   * Start a session
   */
  const startSession = useCallback(
    async (session: Session) => {
      try {
        await sessionsApi.startSession(session.id);
        dispatch(startSessionAction(session));
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to start session'));
        throw err;
      }
    },
    [dispatch]
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
    [dispatch, activeSession]
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
  const completeSession = useCallback(async () => {
    if (!activeSession) {
      throw new Error('No active session');
    }

    try {
      const progress: Omit<
        SessionProgress,
        'sessionId' | 'userId' | 'completedAt'
      > = {
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
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to complete session'));
      throw err;
    }
  }, [dispatch, activeSession]);

  /**
   * Cancel active session
   */
  const cancelSession = useCallback(() => {
    dispatch(endSession());
  }, [dispatch]);

  /**
   * Get recommended sessions
   */
  const getRecommendedSessions = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await sessionsApi.getRecommendedSessions();
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to load recommendations'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

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
