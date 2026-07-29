import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, variant = 'default', padding = 'md', hover, ...props }, ref) => {
    const variants = {
      default: `
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-gray-700
        shadow-sm
      `,
      elevated: `
        bg-white dark:bg-gray-800
        border border-gray-100 dark:border-gray-700
        shadow-lg dark:shadow-gray-900/30
      `,
      outlined: `
        bg-transparent
        border-2 border-gray-200 dark:border-gray-700
      `,
      filled: `
        bg-gray-50 dark:bg-gray-900/50
        border border-gray-100 dark:border-gray-800
      `,
      gradient: `
        bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-violet-900/20
        border border-gray-100 dark:border-gray-700
        shadow-sm
      `,
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4 sm:p-5',
      lg: 'p-6',
      xl: 'p-8',
    };

    const hoverStyles = hover
      ? 'transition-all duration-200 hover:border-violet-200 dark:hover:border-violet-600 hover:shadow-md'
      : '';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl',
          variants[variant],
          paddings[padding],
          hoverStyles,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };