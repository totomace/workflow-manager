// Dashboard Constants - Shared constants for Dashboard components

export const STATUS_LABELS = {
  todo: 'Cần làm',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
} as const;

export const STATUS_VARIANTS = {
  todo: 'todo',
  in_progress: 'progress',
  done: 'done',
} as const;

export const CHART_COLORS = {
  todo: '#71717A',
  in_progress: '#F59E0B',
  done: '#10B981',
} as const;

export const PERIODS = [
  { value: 'week', label: '7 ngày qua' },
  { value: 'month', label: '30 ngày qua' },
  { value: 'year', label: 'Năm nay' },
  { value: 'all', label: 'Tất cả' },
] as const;

export type PeriodValue = (typeof PERIODS)[number]['value'];

export const INPUT_SURFACE =
  'bg-zinc-950/5 dark:bg-white/5 border-zinc-200/80 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 focus:ring-blue-500 focus:border-blue-500';

export const PANEL =
  'rounded-[28px] border border-zinc-200/80 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/55 dark:shadow-black/30';

export const METRIC_CARDS = [
  { label: 'Tổng task', icon: 'CheckCircle2', accent: 'from-blue-500 to-indigo-500' },
  { label: 'Cần làm', icon: 'Circle', accent: 'from-zinc-500 to-zinc-700' },
  { label: 'Đang làm', icon: 'Clock3', accent: 'from-amber-400 to-orange-500' },
  { label: 'Hoàn thành', icon: 'CheckCircle2', accent: 'from-emerald-400 to-teal-500' },
] as const;

// Form default values
export const TASK_FORM_DEFAULTS = {
  title: '',
  description: '',
  status: 'todo' as const,
  amount: 0,
  task_date: '',
  start_time: '',
  end_time: '',
};

// Task status options for Select
export const TASK_STATUS_OPTIONS = [
  { value: 'todo', label: 'Cần làm' },
  { value: 'in_progress', label: 'Đang làm' },
  { value: 'done', label: 'Hoàn thành' },
] as const;

// Filter status options for Select
export const FILTER_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'todo', label: 'Cần làm' },
  { value: 'in_progress', label: 'Đang làm' },
  { value: 'done', label: 'Hoàn thành' },
] as const;

export type FilterStatusValue = (typeof FILTER_STATUS_OPTIONS)[number]['value'];