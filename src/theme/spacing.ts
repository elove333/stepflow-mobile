/**
 * Spacing tokens for consistent layout
 */
export const spacing = {
  // Base spacing unit (4px)
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Specific use cases
  screenPadding: 16,
  cardPadding: 16,
  sectionGap: 24,
  itemGap: 12,

  // Border radius
  radiusSmall: 4,
  radiusMedium: 8,
  radiusLarge: 16,
  radiusRound: 9999,
} as const;

export type SpacingToken = keyof typeof spacing;
