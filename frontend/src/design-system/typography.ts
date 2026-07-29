// Design System - Typography
// Đồng bộ với mobile/lib/core/theme/app_theme.dart (GoogleFonts.inter)

export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'Monospace'],
    display: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  },

  // Font weights
  fontWeight: {
    thin: 100,
    extraLight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    extraBold: 800,
    black: 900,
  },

  // Font sizes (mobile-first, rem-based)
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
    '9xl': '8rem',     // 128px
  },

  // Line heights
  lineHeight: {
    none: 1,
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text styles (semantic, matches mobile text themes)
  styles: {
    // Display / Headlines
    displayLarge: {
      fontSize: '3.75rem',    // 60px
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    displayMedium: {
      fontSize: '2.8125rem',  // 45px
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.015em',
    },
    displaySmall: {
      fontSize: '2.25rem',    // 36px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },

    // Headlines
    headlineLarge: {
      fontSize: '2rem',       // 32px
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '0',
    },
    headlineMedium: {
      fontSize: '1.75rem',    // 28px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0',
    },
    headlineSmall: {
      fontSize: '1.5rem',     // 24px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0',
    },

    // Titles
    titleLarge: {
      fontSize: '1.375rem',   // 22px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0',
    },
    titleMedium: {
      fontSize: '1.125rem',   // 18px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.005em',
    },
    titleSmall: {
      fontSize: '1rem',       // 16px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.01em',
    },

    // Body
    bodyLarge: {
      fontSize: '1.125rem',   // 18px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0',
    },
    bodyMedium: {
      fontSize: '1rem',       // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.005em',
    },
    bodySmall: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },

    // Labels
    labelLarge: {
      fontSize: '1rem',       // 16px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    labelMedium: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    labelSmall: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },

    // Custom semantic styles
    // For stats cards
    statValue: {
      fontSize: '2.25rem',    // 36px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    statLabel: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
      textTransform: 'uppercase' as const,
    },

    // For buttons
    buttonLarge: {
      fontSize: '1rem',       // 16px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    buttonMedium: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    buttonSmall: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
    },

    // For inputs
    inputLabel: {
      fontSize: '0.875rem',   // 14px
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    inputValue: {
      fontSize: '1rem',       // 16px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0',
    },
    inputHelper: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },
    inputError: {
      fontSize: '0.75rem',    // 12px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.01em',
    },

    // For badges/chips
    badge: {
      fontSize: '0.6875rem',  // 11px
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0.02em',
      textTransform: 'capitalize' as const,
    },

    // For code
    code: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: 'JetBrains Mono, Fira Code, Monospace',
    },
    codeSmall: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.6,
      fontFamily: 'JetBrains Mono, Fira Code, Monospace',
    },
  },
} as const;

export type TypographyStyles = typeof typography.styles;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;