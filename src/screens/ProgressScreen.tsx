import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Card, ProgressGraph } from '../components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state';
import { setStats, setProgressData, setAchievements } from '../state/progressSlice';
import { getUserStats, getProgressData, getAchievements } from '../api/analytics';
import type { ProgressDataPoint } from '../components/ProgressGraph';

export const ProgressScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, progressData, achievements, isLoading } = useSelector(
    (state: RootState) => state.progress,
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('week');

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const [statsRes, progressRes, achievementsRes] = await Promise.all([
        getUserStats(),
        getProgressData({ interval: 'day' }),
        getAchievements(),
      ]);

      dispatch(setStats(statsRes.data));
      dispatch(setProgressData(progressRes.data));
      dispatch(setAchievements(achievementsRes.data));
    } catch (error) {
      console.error('Failed to load progress data:', error);
    }
  };

  // Transform progress data for graph
  const graphData: ProgressDataPoint[] = progressData.map((p) => ({
    date: new Date(p.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    value: p.accuracy,
  }));

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your journey</Text>
      </View>

      {/* Stats Overview */}
      <Card style={styles.statsCard}>
        <Text style={styles.cardTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.totalSessions || 0}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.totalSteps || 0}</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.averageAccuracy?.toFixed(1) || 0}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats?.streak || 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </Card>

      {/* Progress Graph */}
      <Card style={styles.graphCard}>
        <View style={styles.graphHeader}>
          <Text style={styles.cardTitle}>Accuracy Over Time</Text>
          <View style={styles.timeframeButtons}>
            <TouchableOpacity
              style={[
                styles.timeframeButton,
                selectedTimeframe === 'week' && styles.timeframeButtonActive,
              ]}
              onPress={() => setSelectedTimeframe('week')}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === 'week' && styles.timeframeTextActive,
                ]}
              >
                Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.timeframeButton,
                selectedTimeframe === 'month' && styles.timeframeButtonActive,
              ]}
              onPress={() => setSelectedTimeframe('month')}
            >
              <Text
                style={[
                  styles.timeframeText,
                  selectedTimeframe === 'month' && styles.timeframeTextActive,
                ]}
              >
                Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ProgressGraph
          data={selectedTimeframe === 'week' ? graphData.slice(-7) : graphData.slice(-30)}
          showLabels={true}
          color={colors.primary}
        />
      </Card>

      {/* Level & Experience */}
      <Card style={styles.levelCard}>
        <Text style={styles.cardTitle}>Level {stats?.level || 1}</Text>
        <View style={styles.experienceBar}>
          <View
            style={[
              styles.experienceFill,
              {
                width: `${stats?.experience ? (stats.experience % 1000) / 10 : 0}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.experienceText}>
          {stats?.experience || 0} / {Math.ceil((stats?.experience || 0) / 1000) * 1000} XP
        </Text>
      </Card>

      {/* Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Achievements</Text>

        {unlockedAchievements.length > 0 && (
          <>
            <Text style={styles.subsectionTitle}>Unlocked</Text>
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={styles.achievementDate}>
                      Unlocked on {new Date(achievement.unlockedAt!).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}

        {lockedAchievements.length > 0 && (
          <>
            <Text style={styles.subsectionTitle}>Locked</Text>
            {lockedAchievements.map((achievement) => (
              <Card key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementIcon, styles.lockedIcon]}>🔒</Text>
                  <View style={styles.achievementInfo}>
                    <Text style={[styles.achievementTitle, styles.lockedText]}>
                      {achievement.title}
                    </Text>
                    <Text style={[styles.achievementDescription, styles.lockedText]}>
                      {achievement.description}
                    </Text>
                    {achievement.progress !== undefined && achievement.target !== undefined && (
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${(achievement.progress / achievement.target) * 100}%`,
                            },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.screenPadding,
    paddingTop: spacing.xl,
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
  statsCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMedium,
  },
  statValue: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  graphCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  graphHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  timeframeButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  timeframeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSmall,
    backgroundColor: colors.surface,
  },
  timeframeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  timeframeTextActive: {
    color: colors.white,
  },
  levelCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  experienceBar: {
    height: 20,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLarge,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  experienceFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  experienceText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  achievementsSection: {
    padding: spacing.screenPadding,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subsectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  achievementCard: {
    marginBottom: spacing.md,
  },
  achievementContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  achievementIcon: {
    fontSize: 40,
  },
  lockedIcon: {
    opacity: 0.5,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  achievementDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  achievementDate: {
    fontSize: typography.fontSize.xs,
    color: colors.textDisabled,
  },
  lockedText: {
    opacity: 0.6,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusSmall,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
});
