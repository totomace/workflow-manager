import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2 font-semibold rounded-xl
      transition-all duration-150 ease-in-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
      active:scale-[0.98]
    `;

    const variants = {
      primary: `
        bg-gradient-to-r from-violet-600 to-indigo-600 text-white
        shadow-md shadow-violet-500/30
        hover:shadow-lg hover:shadow-violet-500/40 hover:scale-[1.02]
        focus-visible:ring-violet-500
      `,
      secondary: `
        bg-indigo-600 text-white
        hover:bg-indigo-700 hover:shadow-md
        focus-visible:ring-indigo-500
      `,
      outline: `
        border-2 border-violet-600 text-violet-600 bg-transparent
        hover:bg-violet-50 dark:hover:bg-violet-900/20
        focus-visible:ring-violet-500
        dark:text-violet-400 dark:border-violet-400
      `,
      ghost: `
        text-violet-600 bg-transparent
        hover:bg-violet-50 dark:hover:bg-violet-900/20
        focus-visible:ring-violet-500
        dark:text-violet-400
      `,
      danger: `
        bg-red-600 text-white
        hover:bg-red-700 hover:shadow-md hover:shadow-red-500/30
        focus-visible:ring-red-500
      `,
      success: `
        bg-emerald-600 text-white
        hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-500/30
        focus-visible:ring-emerald-500
      `,
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
      xl: 'px-8 py-4 text-lg gap-2.5',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], widthStyles, className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span className="truncate">{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';