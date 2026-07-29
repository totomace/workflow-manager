// Design System - Shadows & Elevation
// Matches mobile elevation: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24

export const shadows = {
  // No shadow
  none: 'none',

  // Subtle - for cards, inputs (mobile: elevation 0-1)
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

  // Card default (mobile: elevation 0 with border)
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

  // Elevated cards (mobile: CardTheme elevation 0 but with shadow)
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Mobile-specific shadows (matching AppTheme)
  card: '0 4px 10px 0 rgb(0 0 0 / 0.02)',  // light mode
  cardDark: '0 4px 10px 0 rgb(0 0 0 / 0.05)',  // dark mode

  // Focus rings (mobile: focusedBorder width 2)
  focus: '0 0 0 2px #7C3AED',
  focusInset: 'inset 0 0 0 2px #7C3AED',

  // Colored shadows for primary actions
  primary: {
    sm: '0 2px 4px 0 rgb(124 58 237 / 0.3)',
    md: '0 4px 12px 0 rgb(124 58 237 / 0.35)',
    lg: '0 8px 24px 0 rgb(124 58 237 / 0.4)',
    xl: '0 12px 32px 0 rgb(124 58 237 / 0.45)',
  },

  // Success shadows
  success: {
    sm: '0 2px 4px 0 rgb(16 185 129 / 0.3)',
    md: '0 4px 12px 0 rgb(16 185 129 / 0.35)',
    lg: '0 8px 24px 0 rgb(16 185 129 / 0.4)',
  },

  // Warning shadows
  warning: {
    sm: '0 2px 4px 0 rgb(245 158 11 / 0.3)',
    md: '0 4px 12px 0 rgb(245 158 11 / 0.35)',
    lg: '0 8px 24px 0 rgb(245 158 11 / 0.4)',
  },

  // Error shadows
  error: {
    sm: '0 2px 4px 0 rgb(239 68 68 / 0.3)',
    md: '0 4px 12px 0 rgb(239 68 68 / 0.35)',
    lg: '0 8px 24px 0 rgb(239 68 68 / 0.4)',
  },

  // Inner shadows (for pressed states)
  inner: {
    sm: 'inset 0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.1)',
    lg: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.15)',
  },

  // Dropdown / Popover / Tooltip
  dropdown: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  popover: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  tooltip: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

  // Modal overlay
  modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  modalOverlay: '0 0 0 9999px rgb(0 0 0 / 0.5)',
} as const;

// Semantic shadow aliases
export const elevation = {
  level0: shadows.none,
  level1: shadows.sm,
  level2: shadows.base,
  level3: shadows.md,
  level4: shadows.lg,
  level5: shadows.xl,
  level6: shadows['2xl'],
} as const;

export type ShadowKey = keyof typeof shadows;
export type ElevationLevel = keyof typeof elevation;