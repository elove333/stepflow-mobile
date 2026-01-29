/**
 * Common Screen Styles
 * Shared styles used across multiple screens
 */

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

/**
 * Common styles that are reused across multiple screens
 * Use these to maintain consistency and reduce duplication
 */
export const commonScreenStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Header styles
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

  // Section styles
  section: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  // Card styles
  card: {
    margin: spacing.screenPadding,
  },

  cardMarginTop0: {
    margin: spacing.screenPadding,
    marginTop: 0,
  },

  cardTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },

  cardDescription: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  // State text styles
  loadingText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },

  errorText: {
    fontSize: typography.fontSize.md,
    color: colors.error,
    textAlign: 'center',
    padding: spacing.lg,
  },

  noDataText: {
    fontSize: typography.fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
});
