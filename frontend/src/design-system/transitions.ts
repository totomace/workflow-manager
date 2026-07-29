// Design System - Transitions & Animation
// Matches mobile: duration 150-300ms, easing curves

export const transitions = {
  // Duration (ms)
  duration: {
    instant: '0ms',
    fastest: '50ms',
    faster: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    slowest: '500ms',
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Material Design easing
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    // Custom spring-like
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Property-specific transitions
  property: {
    all: 'all',
    colors: 'color, background-color, border-color, fill, stroke, opacity, box-shadow, text-decoration-color, outline-color',
    opacity: 'opacity',
    transform: 'transform',
    width: 'width',
    height: 'height',
    spacing: 'margin, padding',
    shadow: 'box-shadow',
    radius: 'border-radius',
    filter: 'filter, backdrop-filter',
  },

  // Pre-composed transitions
  presets: {
    // Default: all properties, normal duration, standard easing
    default: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Fast: for hover, focus
    fast: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Slow: for modals, drawers
    slow: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Colors only: for buttons, links
    colors: 'color, background-color, border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Transform only: for scale, translate
    transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Opacity only: for fade in/out
    opacity: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Shadow only: for elevation changes
    shadow: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Scale on press/active
    scale: 'transform 100ms cubic-bezier(0.4, 0, 0.6, 1)',

    // Spring for entrance animations
    spring: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',

    // Slide for drawers, toasts
    slide: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',

    // Modal overlay
    modal: 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Framer Motion variants (for reference)
  motion: {
    // Page transition
    page: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },

    // Card entrance
    card: {
      initial: { opacity: 0, y: 20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
    },

    // List item stagger
    listItem: (index: number) => ({
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.1, duration: 0.2, ease: [0.4, 0, 0.2, 1] },
    }),

    // Modal
    modal: {
      initial: { opacity: 0, scale: 0.95, y: 20 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95, y: 20 },
      transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    },

    // Toast/notification
    toast: {
      initial: { opacity: 0, x: 300 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 300 },
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },

    // Button press
    button: {
      tap: { scale: 0.98 },
      hover: { scale: 1.02 },
      focus: { scale: 1 },
    },
  },
} as const;

export type DurationKey = keyof typeof transitions.duration;
export type EasingKey = keyof typeof transitions.easing;
export type TransitionPreset = keyof typeof transitions.presets;