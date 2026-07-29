// Design System - Spacing
// Based on 4px base unit (Tailwind default), matching mobile spacing scale

export const spacing = {
  // Base unit: 4px
  0: '0',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem',       // 384px
} as const;

// Semantic spacing aliases
export const space = {
  none: spacing[0],
  xs: spacing[1],      // 4px
  sm: spacing[2],      // 8px
  md: spacing[4],      // 16px
  lg: spacing[6],      // 24px
  xl: spacing[8],      // 32px
  '2xl': spacing[12],  // 48px
  '3xl': spacing[16],  // 64px
  '4xl': spacing[24],  // 96px
} as const;

// Component-specific spacing
export const componentSpacing = {
  // Button
  button: {
    sm: { px: spacing[3], py: spacing[1.5] },   // px-3 py-1.5
    md: { px: spacing[4], py: spacing[2] },     // px-4 py-2
    lg: { px: spacing[6], py: spacing[3] },     // px-6 py-3
    xl: { px: spacing[8], py: spacing[4] },     // px-8 py-4
  },

  // Input
  input: {
    sm: { px: spacing[3], py: spacing[2] },     // px-3 py-2
    md: { px: spacing[4], py: spacing[2.5] },   // px-4 py-2.5
    lg: { px: spacing[4], py: spacing[3] },     // px-4 py-3
  },

  // Card
  card: {
    sm: spacing[3],     // p-3
    md: spacing[4],     // p-4
    lg: spacing[6],     // p-6
    xl: spacing[8],     // p-8
  },

  // Container max-widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    '3xl': '1536px',
    full: '100%',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Component-specific radius
  componentRadius: {
    button: '0.75rem',      // 12px - rounded-xl
    input: '0.75rem',       // 12px - rounded-xl
    card: '1rem',           // 16px - rounded-2xl
    badge: '9999px',        // full - rounded-full
    modal: '1.5rem',        // 24px - rounded-3xl
    tooltip: '0.5rem',      // 8px - rounded-lg
    dropdown: '0.75rem',    // 12px - rounded-xl
    avatar: '9999px',       // full
  },
} as const;

export type SpacingScale = keyof typeof spacing;
export type SpaceAlias = keyof typeof space;
export type ComponentSpacing = typeof componentSpacing;