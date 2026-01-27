import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { Button, FeedbackBubble, RhythmIndicator } from '../components';
import { useSession } from '../hooks/useSession';
import { useMotion } from '../hooks/useMotion';

export const LiveSessionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const {
    activeSession,
    selectedSession,
    startSession,
    recordStepEvent,
    pause,
    resume,
    completeSession,
    cancelSession,
  } = useSession();
  const [feedback, setFeedback] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);

  const session = activeSession?.session || selectedSession;
  const bpm = session?.bpm || 120;

  const { lastStep, lastBeat, lastSync, initialize, isInitialized, checkSync } = useMotion({
    enableStepDetection: true,
    enableBeatSync: true,
    bpm,
    stepThreshold: 1.5,
  });

  useEffect(() => {
    // Start session if not already active
    if (selectedSession && !activeSession) {
      startSession(selectedSession);
    }
  }, [selectedSession, activeSession]);

  useEffect(() => {
    // Initialize motion detection
    if (activeSession && !isInitialized) {
      initialize().catch((error) => {
        console.error('Failed to initialize motion:', error);
        Alert.alert('Error', 'Failed to initialize motion detection');
      });
    }
  }, [activeSession, isInitialized]);

  useEffect(() => {
    // Handle step detection
    if (lastStep && activeSession && !activeSession.isPaused) {
      const syncResult = checkSync(lastStep.timestamp);
      if (syncResult) {
        recordStepEvent(syncResult.onBeat);

        // Show feedback
        if (syncResult.onBeat) {
          setFeedback({ message: 'Perfect! 🎯', type: 'success' });
        } else if (syncResult.accuracy > 50) {
          setFeedback({ message: 'Good!', type: 'info' });
        } else {
          setFeedback({ message: 'Keep trying!', type: 'warning' });
        }

        // Clear feedback after delay
        const timeoutId = setTimeout(() => setFeedback(null), 1000);
        // Cleanup on next step or unmount
        return () => clearTimeout(timeoutId);
      }
    }
    // No cleanup needed if no feedback was set
    return undefined;
  }, [lastStep]);

  const handlePause = () => {
    if (activeSession?.isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleEnd = async () => {
    Alert.alert('End Session', 'Are you sure you want to end this session?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End',
        style: 'destructive',
        onPress: async () => {
          try {
            await completeSession();
            navigation.navigate('Feedback');
          } catch (error) {
            console.error('Failed to complete session:', error);
            cancelSession();
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Session',
      'Are you sure you want to cancel this session? Your progress will not be saved.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            cancelSession();
            navigation.goBack();
          },
        },
      ],
    );
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No session selected</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} variant="primary" />
      </View>
    );
  }

  const elapsedTime = activeSession ? Math.floor((Date.now() - activeSession.startTime) / 1000) : 0;
  const remainingTime = Math.max(0, session.duration - elapsedTime);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <View style={styles.container}>
      {/* Session Info */}
      <View style={styles.header}>
        <Text style={styles.sessionTitle}>{session.title}</Text>
        <Text style={styles.bpmText}>{bpm} BPM</Text>
      </View>

      {/* Rhythm Indicator */}
      <View style={styles.indicatorContainer}>
        <RhythmIndicator
          bpm={bpm}
          active={activeSession ? !activeSession.isPaused : false}
          size={120}
        />
      </View>

      {/* Stats */}
      {activeSession && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Steps</Text>
            <Text style={styles.statValue}>{activeSession.totalSteps}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>On Beat</Text>
            <Text style={styles.statValue}>{activeSession.onBeatSteps}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Score</Text>
            <Text style={styles.statValue}>{activeSession.score}%</Text>
          </View>
        </View>
      )}

      {/* Timer */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </Text>
      </View>

      {/* Feedback Bubble */}
      {feedback && (
        <View style={styles.feedbackContainer}>
          <FeedbackBubble message={feedback.message} type={feedback.type} visible={true} />
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          title={activeSession?.isPaused ? 'Resume' : 'Pause'}
          onPress={handlePause}
          variant="secondary"
          size="large"
          style={styles.controlButton}
        />
        <Button
          title="End Session"
          onPress={handleEnd}
          variant="primary"
          size="large"
          style={styles.controlButton}
        />
      </View>

      {/* Cancel Button */}
      <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
        <Text style={styles.cancelText}>Cancel Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sessionTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bpmText: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  indicatorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xxl,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: spacing.xl,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  timerContainer: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  timerText: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  feedbackContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
    minHeight: 50,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: 'auto',
    marginBottom: spacing.lg,
  },
  controlButton: {
    flex: 1,
  },
  cancelButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  cancelText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    fontWeight: typography.fontWeight.medium,
  },
  errorText: {
    fontSize: typography.fontSize.lg,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
