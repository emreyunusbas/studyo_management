/**
 * Color palette for PilatesSalon Yönetimi
 * Dark theme colors
 */

export const Colors = {
  // Primary Colors
  primary: '#B8FF3C',        // Neon green (main brand color)
  primaryDark: '#9FE61C',    // Dark green

  // Secondary Colors
  secondary: '#FF8A50',      // Orange (accent color)

  // Background Colors
  background: '#1A1D23',     // Very dark gray (main background)
  backgroundLight: '#252930',// Light gray background
  surface: '#2C3038',        // Card backgrounds
  surfaceLight: '#363A42',   // Light card backgrounds

  // Text Colors
  text: '#FFFFFF',           // Main text
  textSecondary: '#A0A4AB',  // Secondary text
  textTertiary: '#6B7280',   // Tertiary text

  // Border Colors
  border: '#363A42',         // Lines/borders

  // Status Colors
  success: '#4ADE80',        // Success green
  warning: '#FBBF24',        // Warning yellow
  error: '#EF4444',          // Error red
  danger: '#DC2626',         // Danger red
  info: '#3B82F6',           // Info blue

  // Accent Colors
  accent: '#C026D3',         // Accent purple

  // Overlay
  overlay: 'rgba(0,0,0,0.6)', // Modal overlay

  // Additional Colors
  indigo: '#6366F1',         // Indigo for member registration

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorKey = keyof typeof Colors;
