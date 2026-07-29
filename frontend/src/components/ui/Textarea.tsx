import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, label, error, helperText, ...props }, ref) => {
    const textareaId = props.id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={cn(
            'w-full px-4 py-3',
            'bg-gray-50 dark:bg-gray-700',
            'border border-gray-200 dark:border-gray-600',
            'rounded-xl',
            'text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:bg-white dark:focus:bg-gray-600',
            'focus:ring-2 focus:ring-violet-500 focus:border-violet-500',
            'outline-none transition-all duration-200',
            'resize-y min-h-[100px]',
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : '',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };