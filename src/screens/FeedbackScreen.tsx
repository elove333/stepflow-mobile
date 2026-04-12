import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import { Button, Card } from '../components';
import { submitFeedback, rateSession } from '../api/feedback';
import { useSession } from '../hooks/useSession';

export const FeedbackScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { activeSession } = useSession();
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<
    'bug' | 'feature' | 'improvement' | 'other'
  >('improvement');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingPress = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeSession) {
        await rateSession(activeSession.session.id, rating, comment);
      } else {
        await submitFeedback({
          type: feedbackType,
          title: 'Session Feedback',
          description: comment,
          rating,
        });
      }

      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How was your session?</Text>
        <Text style={styles.subtitle}>
          Your feedback helps us improve your experience
        </Text>
      </View>

      {/* Session Summary */}
      {activeSession && (
        <Card style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Session Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Steps:</Text>
            <Text style={styles.summaryValue}>
              {activeSession.totalSteps}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>On Beat:</Text>
            <Text style={styles.summaryValue}>
              {activeSession.onBeatSteps}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Accuracy:</Text>
            <Text style={styles.summaryValue}>
              {activeSession.totalSteps > 0
                ? Math.round(
                    (activeSession.onBeatSteps / activeSession.totalSteps) * 100
                  )
                : 0}
              %
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Score:</Text>
            <Text style={[styles.summaryValue, styles.scoreValue]}>
              {activeSession.score}
            </Text>
          </View>
        </Card>
      )}

      {/* Rating */}
      <Card style={styles.ratingCard}>
        <Text style={styles.cardTitle}>Rate this session</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((value) => (
            <TouchableOpacity
              key={value}
              onPress={() => handleRatingPress(value)}
              style={styles.starButton}
            >
              <Text style={styles.star}>
                {value <= rating ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Comment */}
      <Card style={styles.commentCard}>
        <Text style={styles.cardTitle}>Additional Comments (Optional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Tell us more about your experience..."
          placeholderTextColor={colors.textDisabled}
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />
      </Card>

      {/* Feedback Type */}
      <Card style={styles.typeCard}>
        <Text style={styles.cardTitle}>Feedback Type</Text>
        <View style={styles.typeContainer}>
          {(['improvement', 'bug', 'feature', 'other'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                feedbackType === type && styles.typeButtonActive,
              ]}
              onPress={() => setFeedbackType(type)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  feedbackType === type && styles.typeButtonTextActive,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Submit Feedback"
          onPress={handleSubmit}
          variant="primary"
          size="large"
          loading={isSubmitting}
          disabled={rating === 0}
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
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
  summaryCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  summaryLabel: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  scoreValue: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
  },
  ratingCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.sm,
  },
  star: {
    fontSize: 40,
  },
  commentCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.radiusMedium,
    padding: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.text,
    minHeight: 100,
  },
  typeCard: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusMedium,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    fontWeight: typography.fontWeight.medium,
  },
  typeButtonTextActive: {
    color: colors.white,
  },
  actions: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  skipButton: {
    alignItems: 'center',
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  skipText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
});
