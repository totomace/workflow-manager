// Design System - Border Radius
// Matches mobile: 4, 8, 12, 16, 20, 24, 28, 32, full

export const borderRadius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px - rounded-sm
  md: '0.375rem',   // 6px - rounded-md
  lg: '0.5rem',     // 8px - rounded-lg
  xl: '0.75rem',    // 12px - rounded-xl (buttons, inputs)
  '2xl': '1rem',    // 16px - rounded-2xl (cards)
  '3xl': '1.5rem',  // 24px - rounded-3xl (modals)
  '4xl': '2rem',    // 32px
  full: '9999px',   // rounded-full (badges, avatars)

  // Component-specific
  button: '0.75rem',      // xl - rounded-xl
  input: '0.75rem',       // xl - rounded-xl
  card: '1rem',           // 2xl - rounded-2xl
  badge: '9999px',        // full
  modal: '1.5rem',        // 3xl - rounded-3xl
  tooltip: '0.5rem',      // lg - rounded-lg
  dropdown: '0.75rem',    // xl - rounded-xl
  avatar: '9999px',       // full
  progress: '9999px',     // full
  tab: '0.5rem',          // lg
  chip: '9999px',         // full
} as const;

// Shorthand for Tailwind
export const rounded = {
  none: borderRadius.none,
  sm: borderRadius.sm,
  md: borderRadius.md,
  lg: borderRadius.lg,
  xl: borderRadius.xl,
  '2xl': borderRadius['2xl'],
  '3xl': borderRadius['3xl'],
  full: borderRadius.full,
} as const;

export type BorderRadiusKey = keyof typeof borderRadius;
export type RoundedKey = keyof typeof rounded;