import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { Card } from '../components';
import { useSession } from '../hooks/useSession';
import { Session } from '../api/sessions';

export const SessionPickerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { sessions, loadSessions, selectSession, isLoading, error } = useSession();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSession = (session: Session) => {
    selectSession(session);
    navigation.navigate('LiveSession');
  };

  const filteredSessions =
    selectedDifficulty === 'all'
      ? sessions
      : sessions.filter((s) => s.difficulty === selectedDifficulty);

  const difficultyOptions = ['all', 'beginner', 'intermediate', 'advanced'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Session</Text>
        <Text style={styles.subtitle}>Select a session that matches your level</Text>
      </View>

      {/* Difficulty filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {difficultyOptions.map((difficulty) => (
          <TouchableOpacity
            key={difficulty}
            style={[
              styles.filterButton,
              selectedDifficulty === difficulty && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedDifficulty(difficulty)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedDifficulty === difficulty && styles.filterButtonTextActive,
              ]}
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Session list */}
      <ScrollView style={styles.sessionList}>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading sessions...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : filteredSessions.length === 0 ? (
          <Text style={styles.noDataText}>No sessions available</Text>
        ) : (
          filteredSessions.map((session) => (
            <Card
              key={session.id}
              style={styles.sessionCard}
              onPress={() => handleSelectSession(session)}
            >
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>{session.title}</Text>
                <View style={[styles.difficultyBadge, styles[`difficulty_${session.difficulty}`]]}>
                  <Text style={styles.difficultyText}>{session.difficulty.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.sessionDescription}>{session.description}</Text>
              <View style={styles.sessionMeta}>
                <Text style={styles.metaText}>🎵 {session.bpm} BPM</Text>
                <Text style={styles.metaText}>⏱️ {Math.floor(session.duration / 60)} min</Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.screenPadding,
    paddingTop: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  filterContainer: {
    maxHeight: 50,
  },
  filterContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.md,
  },
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusLarge,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: colors.white,
  },
  sessionList: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  sessionCard: {
    marginBottom: spacing.md,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  sessionTitle: {
    flex: 1,
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSmall,
  },
  difficulty_beginner: {
    backgroundColor: colors.success,
  },
  difficulty_intermediate: {
    backgroundColor: colors.warning,
  },
  difficulty_advanced: {
    backgroundColor: colors.error,
  },
  difficultyText: {
    fontSize: typography.fontSize.xs,
    color: colors.white,
    fontWeight: typography.fontWeight.bold,
  },
  sessionDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  sessionMeta: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
    padding: spacing.xl,
  },
  noDataText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.xl,
  },
});
