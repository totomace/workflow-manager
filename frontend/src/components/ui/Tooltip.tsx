import { forwardRef, useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
}

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrows = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
};

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      content,
      children,
      position = 'top',
      delay = 200,
      className,
      contentClassName,
      disabled = false,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const childRef = useRef<HTMLElement>(null);

    const mergedRef = (node: HTMLElement) => {
      childRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const showTooltip = () => {
      if (disabled) return;
      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    return (
      <div ref={mergedRef} className={cn('relative inline-block', className)}>
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<any>, {
              onMouseEnter: showTooltip,
              onMouseLeave: hideTooltip,
              onFocus: showTooltip,
              onBlur: hideTooltip,
            })
          : (
            <span
              onMouseEnter={showTooltip}
              onMouseLeave={hideTooltip}
              onFocus={showTooltip}
              onBlur={hideTooltip}
            >
              {children}
            </span>
          )}

        {isVisible && (
          <div
            className={cn(
              'absolute z-50 px-3 py-1.5',
              'text-xs font-medium text-white',
              'bg-gray-900 dark:bg-gray-900',
              'rounded-lg shadow-lg',
              'animate-in fade-in-0 zoom-in-95 duration-150 ease-out',
              positions[position],
              contentClassName
            )}
            role="tooltip"
          >
            {content}
            <div
              className={cn(
                'absolute w-0 h-0 border-4 border-transparent',
                arrows[position]
              )}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

interface TooltipTriggerProps {
  children: ReactNode;
  'aria-label'?: string;
}

interface TooltipContentProps {
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
}

// Compound component pattern
export const TooltipProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export function TooltipTrigger({ children, 'aria-label': ariaLabel }: TooltipTriggerProps) {
  return (
    <span
      tabIndex={0}
      role="button"
      aria-label={ariaLabel}
      className="inline-flex"
    >
      {children}
    </span>
  );
}

export function TooltipContent({
  children,
  side = 'top',
  sideOffset = 8,
  align = 'center',
}: TooltipContentProps) {
  return (
    <div
      className={cn(
        'absolute z-50 px-3 py-2',
        'text-sm font-medium text-white',
        'bg-gray-900 dark:bg-gray-900',
        'rounded-lg shadow-lg',
        'whitespace-nowrap',
        'animate-in fade-in-0 zoom-in-95 duration-150 ease-out'
      )}
      style={{
        [side === 'top' || side === 'bottom' ? 'left' : 'top']: '50%',
        [side === 'top' ? 'bottom' : side === 'bottom' ? 'top' : side === 'left' ? 'right' : 'left']:
          `calc(100% + ${sideOffset}px)`,
        transform: side === 'top' || side === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
      }}
      role="tooltip"
    >
      {children}
    </div>
  );
}