// Design System - Colors
// Đồng bộ với mobile/lib/core/theme/app_colors.dart
// Dựa trên ui-ux-pro-max-skill SaaS/Productivity template

export const colors = {
  // Brand / Primary - Violet/Indigo gradient (Mobile: primary = #7C3AED)
  primary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',
    600: '#7C3AED',  // Main primary
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
    950: '#2E1065',
  },

  // Secondary - Indigo (Mobile: secondary = #4F46E5)
  secondary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',  // Main secondary
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },

  // Semantic colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    main: '#10B981',  // Mobile: success = #10B981
    dark: '#059669',  // Mobile: moneyDark = #34D399
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',  // Mobile: warning = #F59E0B
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
    main: '#F59E0B',
    dark: '#F97316',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',  // Mobile: error = #EF4444
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    main: '#EF4444',
    dark: '#DC2626',
  },

  info: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',  // Mobile: blurSky = #BAE6FD
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9',  // Mobile: info = #0EA5E9
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',  // Mobile: blurSkyDark = #075985
    900: '#0C4A6E',
    main: '#0EA5E9',
  },

  // Status colors (for tasks)
  status: {
    todo: {
      main: '#9CA3AF',      // Mobile: todo = #9CA3AF
      light: '#F3F4F6',     // Mobile: todoBg = #F3F4F6
      dark: '#374151',      // Mobile: todoBgDark = #374151
      text: '#6B7280',
    },
    in_progress: {
      main: '#F59E0B',      // Mobile: inProgress = #F59E0B
      light: '#FEF3C7',     // Mobile: inProgressBg = #FEF3C7
      dark: '#451A03',      // Mobile: inProgressBgDark = #451A03
      text: '#B45309',
    },
    done: {
      main: '#10B981',      // Mobile: done = #10B981
      light: '#D1FAE5',     // Mobile: doneBg = #D1FAE5
      dark: '#064E3B',      // Mobile: doneBgDark = #064E3B
      text: '#047857',
    },
  },

  // Money/Income colors
  money: {
    main: '#10B981',        // Mobile: money = #10B981
    dark: '#34D399',        // Mobile: moneyDark = #34D399
    light: '#D1FAE5',
    gradient: ['#34D399', '#059669'],  // Mobile: moneyGradient
  },

  // Neutral / Grayscale
  neutral: {
    0: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',         // Mobile: divider = #E5E7EB
    300: '#D1D5DB',
    400: '#9CA3AF',         // Mobile: textMuted = #9CA3AF
    500: '#6B7280',         // Mobile: textSecondary = #6B7280
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',         // Mobile: darkCard = #1F2937
    900: '#111827',         // Mobile: darkBg = #111827, textPrimary = #111827
    950: '#030712',
  },

  // Background gradients (Mobile: lightBgStart, lightBgMid, lightBgEnd)
  background: {
    light: {
      start: '#F0F9FF',     // Mobile: lightBgStart
      mid: '#FFFFFF',       // Mobile: lightBgMid
      end: '#F5F3FF',       // Mobile: lightBgEnd
      gradient: ['#F0F9FF', '#FFFFFF', '#F5F3FF'],
    },
    dark: {
      start: '#111827',     // Mobile: darkBgStart
      mid: '#1F2937',       // Mobile: darkBgMid
      end: '#111827',       // Mobile: darkBgEnd
      gradient: ['#111827', '#1F2937', '#111827'],
    },
  },

  // Blur/Glassmorphism overlays
  blur: {
    violet: {
      light: '#DDD6FE',     // Mobile: blurViolet
      dark: '#4C1D95',      // Mobile: blurVioletDark
    },
    sky: {
      light: '#BAE6FD',     // Mobile: blurSky
      dark: '#075985',      // Mobile: blurSkyDark
    },
  },

  // Card backgrounds
  card: {
    light: '#FFFFFF',       // Mobile: lightCard
    dark: '#1F2937',        // Mobile: darkCard
    border: {
      light: '#E5E7EB',     // Mobile: lightCardBorder
      dark: '#374151',      // Mobile: darkCardBorder
    },
    subtle: {
      light: '#F3F4F6',     // Mobile: subtleBorder
      dark: '#303949',      // Mobile: subtleBorderDark
    },
  },

  // Input fields
  input: {
    fill: {
      light: '#F9FAFB',     // Mobile: inputFill
      dark: '#374151',      // Mobile: inputFillDark
    },
    border: {
      light: '#E5E7EB',     // Mobile: inputBorder
      dark: '#4B5563',      // Mobile: inputBorderDark
    },
    focusBorder: '#7C3AED', // Mobile: inputFocusBorder
  },

  // Text colors
  text: {
    primary: {
      light: '#111827',     // Mobile: textPrimary
      dark: '#F9FAFB',      // Mobile: textLight
    },
    secondary: {
      light: '#6B7280',     // Mobile: textSecondary
      dark: '#9CA3AF',      // Mobile: textDarkSecondary
    },
    muted: {
      light: '#9CA3AF',     // Mobile: textMuted
      dark: '#9CA3AF',
    },
    inverse: {
      light: '#FFFFFF',
      dark: '#111827',
    },
    link: '#7C3AED',
    linkHover: '#6D28D9',
  },

  // Gradients (Mobile: various gradients)
  gradients: {
    primary: ['#7C3AED', '#4F46E5'],              // Mobile: primaryGradient
    softPrimary: ['#EDE9FE', '#E0E7FF'],          // Mobile: softPrimaryGradient
    avatar: ['#8B5CF6', '#4F46E5'],               // Mobile: avatarGradient
    todo: ['#9CA3AF', '#6B7280'],                 // Mobile: todoGradient
    inProgress: ['#FBBF24', '#F97316'],           // Mobile: inProgressGradient
    done: ['#34D399', '#10B981'],                 // Mobile: doneGradient
    money: ['#34D399', '#059669'],                // Mobile: moneyGradient
    total: ['#8B5CF6', '#7C3AED'],                // Mobile: totalGradient
    surface: ['#FFFFFF', '#F8FAFC'],              // Mobile: surfaceGradient
  },
} as const;

// Type exports for TypeScript
export type ColorScale = typeof colors.primary;
export type SemanticColor = typeof colors.success;
export type StatusColor = typeof colors.status.todo;
export type Gradient = typeof colors.gradients.primary;