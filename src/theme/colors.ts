/**
 * Color tokens for global theming
 */
export const colors = {
  // Primary colors
  primary: '#6200EE',
  primaryLight: '#9D4EDD',
  primaryDark: '#3700B3',

  // Secondary colors
  secondary: '#03DAC6',
  secondaryLight: '#66FFF9',
  secondaryDark: '#00A896',

  // Neutral colors
  background: '#FFFFFF',
  surface: '#F5F5F5',
  card: '#FFFFFF',

  // Text colors
  text: '#000000',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',

  // Status colors
  error: '#B00020',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',

  // Border colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',

  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',

  // Special colors
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = keyof typeof colors;
