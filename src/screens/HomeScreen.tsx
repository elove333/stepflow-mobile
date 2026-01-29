import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography, commonScreenStyles } from '../theme';
import { Button, Card } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { getRecommendedSessions, isLoading } = useSession();
  const [recommendedSessions, setRecommendedSessions] = React.useState<any[]>([]);

  useEffect(() => {
    loadRecommended();
  }, []);

  const loadRecommended = async () => {
    try {
      const sessions = await getRecommendedSessions();
      setRecommendedSessions(sessions.slice(0, 3));
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const handleStartSession = () => {
    navigation.navigate('SessionPicker');
  };

  const handleViewProgress = () => {
    navigation.navigate('Progress');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Ready to move?</Text>
      </View>

      <Card style={styles.quickStartCard}>
        <Text style={styles.cardTitle}>Quick Start</Text>
        <Text style={styles.cardDescription}>
          Start a new session and sync your movements to the beat
        </Text>
        <Button
          title="Start Session"
          onPress={handleStartSession}
          variant="primary"
          style={styles.button}
        />
      </Card>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended for You</Text>
          <TouchableOpacity onPress={handleStartSession}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : recommendedSessions.length > 0 ? (
          recommendedSessions.map((session, index) => (
            <Card
              key={index}
              style={styles.sessionCard}
              onPress={() => {
                navigation.navigate('SessionPicker');
              }}
            >
              <Text style={styles.sessionTitle}>{session.title}</Text>
              <Text style={styles.sessionMeta}>
                {session.bpm} BPM • {Math.floor(session.duration / 60)} min • {session.difficulty}
              </Text>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>No recommendations available yet</Text>
        )}
      </View>

      <Card style={styles.progressCard}>
        <Text style={styles.cardTitle}>Your Progress</Text>
        <Text style={styles.cardDescription}>View your stats and achievements</Text>
        <Button
          title="View Progress"
          onPress={handleViewProgress}
          variant="outline"
          style={styles.button}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  ...commonScreenStyles,
  // Override subtitle with larger font for this screen
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.textSecondary,
  },
  greeting: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  quickStartCard: {
    margin: spacing.screenPadding,
  },
  button: {
    marginTop: spacing.sm,
  },
  seeAll: {
    fontSize: typography.fontSize.md,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
  },
  sessionCard: {
    marginBottom: spacing.md,
  },
  sessionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sessionMeta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  progressCard: {
    margin: spacing.screenPadding,
    marginBottom: spacing.xl,
  },
});
