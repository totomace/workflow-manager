// Design System - Breakpoints
// Mobile-first breakpoints, matching Tailwind defaults with extensions

export const breakpoints = {
  // Mobile first
  xs: '320px',    // Extra small phones
  sm: '640px',    // Small tablets / large phones
  md: '768px',    // Tablets
  lg: '1024px',   // Small laptops
  xl: '1280px',   // Desktops
  '2xl': '1400px', // Large desktops
  '3xl': '1536px', // Extra large desktops
  '4xl': '1920px', // Full HD
} as const;

// Media query helpers
export const mediaQuery = {
  xs: `(min-width: ${breakpoints.xs})`,
  sm: `(min-width: ${breakpoints.sm})`,
  md: `(min-width: ${breakpoints.md})`,
  lg: `(min-width: ${breakpoints.lg})`,
  xl: `(min-width: ${breakpoints.xl})`,
  '2xl': `(min-width: ${breakpoints['2xl']})`,
  '3xl': `(min-width: ${breakpoints['3xl']})`,
  '4xl': `(min-width: ${breakpoints['4xl']})`,

  // Max-width queries
  maxXs: `(max-width: ${Number.parseInt(breakpoints.sm) - 1}px)`,
  maxSm: `(max-width: ${Number.parseInt(breakpoints.md) - 1}px)`,
  maxMd: `(max-width: ${Number.parseInt(breakpoints.lg) - 1}px)`,
  maxLg: `(max-width: ${Number.parseInt(breakpoints.xl) - 1}px)`,
  maxXl: `(max-width: ${Number.parseInt(breakpoints['2xl']) - 1}px)`,

  // Range queries
  smOnly: `(min-width: ${breakpoints.sm}) and (max-width: ${Number.parseInt(breakpoints.md) - 1}px)`,
  mdOnly: `(min-width: ${breakpoints.md}) and (max-width: ${Number.parseInt(breakpoints.lg) - 1}px)`,
  lgOnly: `(min-width: ${breakpoints.lg}) and (max-width: ${Number.parseInt(breakpoints.xl) - 1}px)`,
  xlOnly: `(min-width: ${breakpoints.xl}) and (max-width: ${Number.parseInt(breakpoints['2xl']) - 1}px)`,

  // Hover/pointer capabilities
  hover: '(hover: hover)',
  noHover: '(hover: none)',
  pointer: '(pointer: fine)',
  coarse: '(pointer: coarse)',

  // Dark/light mode
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',

  // Reduced motion
  reduceMotion: '(prefers-reduced-motion: reduce)',
} as const;

// Container max-widths at each breakpoint
export const containerMaxWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  '3xl': '1536px',
  full: '100%',
} as const;

// Grid columns per breakpoint
export const gridColumns = {
  base: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 4,
  '2xl': 5,
} as const;

// Spacing per breakpoint (responsive)
export const responsiveSpacing = {
  // Section padding
  section: {
    base: 'py-12 px-4',
    sm: 'sm:py-16 sm:px-6',
    lg: 'lg:py-20 lg:px-8',
  },
  // Container padding
  container: {
    base: 'px-4',
    sm: 'sm:px-6',
    lg: 'lg:px-8',
  },
  // Card gap
  cardGap: {
    base: 'gap-3',
    sm: 'sm:gap-4',
    lg: 'lg:gap-6',
  },
} as const;

export type BreakpointKey = keyof typeof breakpoints;
export type MediaQueryKey = keyof typeof mediaQuery;