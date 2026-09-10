// Dashboard Types - Shared TypeScript interfaces for Dashboard components

import type { Task, MoneyStats, TaskStats } from '../hooks/useTasks';

// Re-export for convenience
export type { Task, MoneyStats, TaskStats };

// Dashboard-specific types
export interface MetricCardData {
  label: string;
  value: number;
  icon: React.ComponentType<{ size?: number }>;
  accent: string;
}

export interface StatusStatItem {
  name: string;
  value: number;
  color: string;
}

export interface PeriodOption {
  value: 'week' | 'month' | 'year' | 'all';
  label: string;
}

export type PeriodValue = PeriodOption['value'];

export interface TaskFormData {
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  amount: number;
  task_date: string;
  start_time: string;
  end_time: string;
}

export interface DashboardHeaderProps {
  user: { email?: string } | null;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

export interface MetricCardsProps {
  tasks: Task[];
  statusStats: TaskStats | undefined;
  darkMode: boolean;
}

export interface MoneyStatsCardProps {
  moneyStats: MoneyStats | undefined;
  moneyPeriod: PeriodValue;
  setMoneyPeriod: (period: PeriodValue) => void;
  darkMode: boolean;
}

export interface StatusStatsSectionProps {
  statusStats: TaskStats | undefined;
  tasks: Task[];
  statusPeriod: PeriodValue;
  setStatusPeriod: (period: PeriodValue) => void;
  darkMode: boolean;
}

export interface TaskFormProps {
  editId: number | null;
  formRef: React.RefObject<HTMLDivElement>;
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
  defaultValues?: Partial<TaskFormData>;
  taskToEdit?: Task | null;
}

export interface TaskSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | 'todo' | 'in_progress' | 'done';
  setFilterStatus: (status: 'all' | 'todo' | 'in_progress' | 'done') => void;
  formRef: React.RefObject<HTMLDivElement>;
  darkMode: boolean;
}

export interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  darkMode: boolean;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
}

export interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  filteredTasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  formRef: React.RefObject<HTMLDivElement>;
  darkMode: boolean;
  formatCurrency: (value: number) => string;
  formatDate: (dateString: string) => string;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

// Socket event types (matching socket.ts)
export interface TaskCreatedEvent {
  id: number;
  title: string;
  description: string | null;
  status: string;
  amount: number | null;
  task_date: string | null;
  start_time: string | null;
  end_time: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TaskUpdatedEvent extends TaskCreatedEvent {}

export interface TaskDeletedEvent {
  id: number;
}

// Chart data types
export interface PieChartData {
  name: string;
  value: number;
  color: string;
}