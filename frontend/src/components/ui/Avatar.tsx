import React, { forwardRef, type HTMLAttributes, useState, useRef } from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'busy' | 'away';
  statusPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-2xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-gray-400',
  busy: 'bg-red-500',
  away: 'bg-amber-500',
};

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
  '2xl': 'w-5 h-5',
};

const statusPositions = {
  'bottom-right': 'bottom-0 right-0',
  'bottom-left': 'bottom-0 left-0',
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
};

const gradientClasses = [
  'bg-gradient-to-br from-violet-500 to-purple-600',
  'bg-gradient-to-br from-indigo-500 to-blue-600',
  'bg-gradient-to-br from-emerald-500 to-teal-600',
  'bg-gradient-to-br from-amber-500 to-orange-600',
  'bg-gradient-to-br from-rose-500 to-pink-600',
  'bg-gradient-to-br from-sky-500 to-blue-600',
  'bg-gradient-to-br from-purple-500 to-violet-600',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getGradientIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % gradientClasses.length;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src,
      alt,
      fallback,
      size = 'md',
      shape = 'circle',
      status,
      statusPosition = 'bottom-right',
      className,
      ...props
    },
    ref
  ) => {
    const [error, setError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const initials = fallback ? getInitials(fallback) : '?';
    const gradientIndex = fallback ? getGradientIndex(fallback) : 0;
    const shapeClass = shapeClasses[shape];

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', className)}
        {...props}
      >
        <div
          className={cn(
            'overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-medium',
            sizeClasses[size],
            shapeClass
          )}
        >
          {src && !error ? (
            <img
              ref={imgRef}
              src={src}
              alt={alt || fallback || 'Avatar'}
              className="w-full h-full object-cover"
              onError={() => setError(true)}
            />
          ) : (
            <div
              className={cn('w-full h-full flex items-center justify-center', gradientClasses[gradientIndex])}
            >
              {initials}
            </div>
          )}
        </div>

        {status && (
          <span
            className={cn(
              'absolute border-2 border-white dark:border-gray-900 rounded-full',
              statusColors[status],
              statusSizes[size],
              statusPositions[statusPosition]
            )}
            aria-label={status}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  overlap?: number;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ children, max = 5, size = 'md', overlap = 8, className, ...props }, ref) => {
    const kids = Array.isArray(children) ? children : [children];
    const visibleChildren = kids.slice(0, max);
    const remainingCount = kids.length - max;

    return (
      <div
        ref={ref}
        className={cn('flex -space-x-2', className)}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div
            key={index}
            className="relative z-[auto]"
            style={{ zIndex: visibleChildren.length - index }}
          >
            {React.isValidElement(child) &&
              React.cloneElement(child as React.ReactElement<any>, { size })}
          </div>
        ))}
        {remainingCount > 0 && (
          <div
            className={cn(
              'flex items-center justify-center font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-white dark:border-gray-900',
              sizeClasses[size],
              shapeClasses.circle
            )}
          >
            +{remainingCount}
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';