import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'avatar';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const baseStyles = `
    bg-gray-200 dark:bg-gray-700
    overflow-hidden
    relative
  `;

  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_1.5s_infinite]',
    none: '',
  };

  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    avatar: 'rounded-full',
  };

  const widthStyle = width ? { width: typeof width === 'number' ? `${width}px` : width } : {};
  const heightStyle = height ? { height: typeof height === 'number' ? `${height}px` : height } : {};

  const skeletonClass = cn(
    baseStyles,
    animations[animation],
    variantStyles[variant],
    className
  );

  return (
    <div
      className={skeletonClass}
      style={{ ...widthStyle, ...heightStyle }}
      {...props}
    >
      {animation === 'wave' && (
        <div
          className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          }}
        />
      )}
    </div>
  );
}

interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  lineHeight?: string;
  spacing?: string;
}

export function SkeletonText({
  className,
  lines = 3,
  lineHeight = 'h-4',
  spacing = 'space-y-2',
  ...props
}: SkeletonTextProps) {
  return (
    <div className={cn(spacing, className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '60%' : '100%'}
          className={lineHeight}
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hasAvatar?: boolean;
  hasAction?: boolean;
  lines?: number;
}

export function SkeletonCard({
  className,
  hasAvatar = true,
  hasAction = false,
  lines = 3,
  ...props
}: SkeletonCardProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 space-y-3', className)} {...props}>
      <div className="flex items-start gap-3">
        {hasAvatar && (
          <Skeleton variant="avatar" width={40} height={40} className="flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton variant="text" width="40%" />
          <Skeleton variant="text" width="80%" />
          {Array.from({ length: Math.max(0, lines - 2) }).map((_, i) => (
            <Skeleton key={i} variant="text" width="100%" />
          ))}
        </div>
        {hasAction && (
          <Skeleton variant="rectangular" width={80} height={32} className="flex-shrink-0" />
        )}
      </div>
    </div>
  );
}

interface SkeletonListProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  hasAvatar?: boolean;
  hasAction?: boolean;
  lines?: number;
}

export function SkeletonList({
  className,
  count = 3,
  hasAvatar = true,
  hasAction = false,
  lines = 3,
  ...props
}: SkeletonListProps) {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} hasAvatar={hasAvatar} hasAction={hasAction} lines={lines} />
      ))}
    </div>
  );
}

interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
  ...props
}: SkeletonTableProps) {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden', className)} {...props}>
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" width={i === 0 ? '80%' : '60%'} className="flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="p-4">
            <div className="flex gap-4">
              {Array.from({ length: columns }).map((_, col) => (
                <Skeleton key={col} variant="text" width={col === 0 ? '80%' : '60%'} className="flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}