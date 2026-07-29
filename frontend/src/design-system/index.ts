// Design System - Main Export
// Single entry point for all design tokens

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './border-radius';
export * from './transitions';
export * from './breakpoints';

// Theme configuration object (for programmatic access)
import { colors } from './colors';
import { typography } from './typography';
import { spacing, space, componentSpacing } from './spacing';
import { shadows, elevation } from './shadows';
import { borderRadius, rounded } from './border-radius';
import { transitions } from './transitions';
import { breakpoints, mediaQuery, containerMaxWidth } from './breakpoints';

export const theme = {
  colors,
  typography,
  spacing,
  space,
  componentSpacing,
  shadows,
  elevation,
  borderRadius,
  rounded,
  transitions,
  breakpoints,
  mediaQuery,
  containerMaxWidth,
} as const;

// Type for the complete theme
export type Theme = typeof theme;

// CSS Variables generator (for runtime theming)
export const cssVariables = {
  // Colors
  '--color-primary': colors.primary[600],
  '--color-primary-hover': colors.primary[700],
  '--color-primary-light': colors.primary[100],
  '--color-secondary': colors.secondary[600],
  '--color-success': colors.success.main,
  '--color-warning': colors.warning.main,
  '--color-error': colors.error.main,
  '--color-info': colors.info.main,

  // Status
  '--color-todo': colors.status.todo.main,
  '--color-in-progress': colors.status.in_progress.main,
  '--color-done': colors.status.done.main,

  // Money
  '--color-money': colors.money.main,

  // Neutral
  '--color-bg-primary': colors.neutral[50],
  '--color-bg-secondary': colors.neutral[100],
  '--color-bg-tertiary': colors.neutral[200],
  '--color-surface': colors.neutral[0],
  '--color-surface-hover': colors.neutral[50],
  '--color-border': colors.neutral[200],
  '--color-border-strong': colors.neutral[300],

  // Text
  '--color-text-primary': colors.text.primary.light,
  '--color-text-secondary': colors.text.secondary.light,
  '--color-text-muted': colors.text.muted.light,
  '--color-text-inverse': colors.text.inverse.light,
  '--color-text-link': colors.text.link,

  // Shadows
  '--shadow-xs': shadows.xs,
  '--shadow-sm': shadows.sm,
  '--shadow-base': shadows.base,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg,
  '--shadow-xl': shadows.xl,
  '--shadow-card': shadows.card,

  // Radius
  '--radius-sm': borderRadius.sm,
  '--radius-md': borderRadius.md,
  '--radius-lg': borderRadius.lg,
  '--radius-xl': borderRadius.xl,
  '--radius-2xl': borderRadius['2xl'],
  '--radius-3xl': borderRadius['3xl'],
  '--radius-full': borderRadius.full,

  // Transitions
  '--transition-fast': transitions.presets.fast,
  '--transition-normal': transitions.presets.default,
  '--transition-slow': transitions.presets.slow,
  '--transition-colors': transitions.presets.colors,

  // Breakpoints
  '--bp-xs': breakpoints.xs,
  '--bp-sm': breakpoints.sm,
  '--bp-md': breakpoints.md,
  '--bp-lg': breakpoints.lg,
  '--bp-xl': breakpoints.xl,
  '--bp-2xl': breakpoints['2xl'],
  '--bp-3xl': breakpoints['3xl'],
} as const;

// Dark mode CSS variables
export const darkCssVariables = {
  '--color-bg-primary': colors.neutral[900],
  '--color-bg-secondary': colors.neutral[800],
  '--color-bg-tertiary': colors.neutral[800],
  '--color-surface': colors.neutral[900],
  '--color-surface-hover': colors.neutral[800],
  '--color-border': colors.neutral[700],
  '--color-border-strong': colors.neutral[600],
  '--color-text-primary': colors.text.primary.dark,
  '--color-text-secondary': colors.text.secondary.dark,
  '--color-text-muted': colors.text.muted.dark,
  '--color-text-inverse': colors.text.inverse.dark,
  '--shadow-card': shadows.cardDark,
} as const;

// Utility to generate CSS variables string
export function generateCssVariables(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

// Theme context default value
export const defaultTheme = theme;