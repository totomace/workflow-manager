import { cn } from '../../lib/utils';
import { Button } from './Button';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'illustrated' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
  size = 'md',
  ...props
}: EmptyStateProps) {
  const sizes = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
  };

  const variants = {
    default: 'text-center',
    illustrated: 'text-center',
    minimal: 'text-center',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            'mb-4 flex items-center justify-center text-gray-400 dark:text-gray-500',
            size === 'sm' && 'text-4xl',
            size === 'md' && 'text-6xl',
            size === 'lg' && 'text-8xl'
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <h3
        className={cn(
          'font-semibold text-gray-900 dark:text-white',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl'
        )}
      >
        {title}
      </h3>

      {description && (
        <p
          className={cn(
            'mt-2 text-gray-500 dark:text-gray-400 max-w-sm',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg'
          )}
        >
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'primary'}
              size={size === 'sm' ? 'sm' : 'md'}
              fullWidth={!secondaryAction}
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="ghost"
              size={size === 'sm' ? 'sm' : 'md'}
              fullWidth={!action}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Pre-built empty states for common scenarios
export function EmptyTasks({
  onCreate,
  darkMode = false,
}: {
  onCreate?: () => void;
  darkMode?: boolean;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      }
      title="Chưa có task nào"
      description="Hãy tạo task đầu tiên để bắt đầu quản lý công việc của bạn."
      action={onCreate ? { label: 'Tạo task đầu tiên', onClick: onCreate } : undefined}
      size="lg"
    />
  );
}

export function EmptySearch({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={query ? `Không tìm thấy "${query}"` : 'Không tìm thấy kết quả'}
      description={query
        ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.'
        : 'Hãy thử tìm kiếm với từ khóa khác.'}
      action={onClear ? { label: 'Xóa bộ lọc', onClick: onClear, variant: 'outline' } : undefined}
    />
  );
}

export function EmptyNotifications({
  onViewAll,
}: {
  onViewAll?: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      }
      title="Không có thông báo"
      description="Tất cả thông báo đã được đọc. Bạn sẽ thấy thông báo mới ở đây."
      action={onViewAll ? { label: 'Xem tất cả', onClick: onViewAll, variant: 'outline' } : undefined}
    />
  );
}