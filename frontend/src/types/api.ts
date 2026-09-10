// Centralized API Type Definitions
// Shared types for API requests, responses, and data models

// ============================================
// User & Authentication Types
// ============================================

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  auth_provider: 'local' | 'google' | 'both';
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: number;
  email: string;
  full_name: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: PublicUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  full_name: string;
  password: string;
}

export interface GoogleLoginData {
  credential: string;
}

export interface SetPasswordData {
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

// ============================================
// Task Types
// ============================================

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  amount: number | null;
  task_date: string | null;
  start_time: string | null;
  end_time: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  amount?: number;
  task_date?: string;
  start_time?: string;
  end_time?: string;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {
  id: number;
}

export interface TaskListResponse {
  tasks: Task[];
}

export interface TaskDetailResponse {
  task: Task;
}

export interface TaskCreateResponse {
  task: Task;
}

export interface TaskUpdateResponse {
  task: Task;
}

export interface TaskDeleteResponse {
  success: boolean;
  message?: string;
}

// ============================================
// Statistics Types
// ============================================

export interface MoneyStats {
  total: number;
}

export interface TaskStats {
  todo: number;
  in_progress: number;
  done: number;
}

export interface MoneyStatsResponse {
  total: number;
}

export interface StatusStatsResponse {
  counts: TaskStats;
}

// ============================================
// Profile Types
// ============================================

export interface ProfileResponse {
  user: PublicUser;
}

export interface UpdateProfileData {
  full_name: string;
}

export interface UpdateProfileResponse {
  user: PublicUser;
}

// ============================================
// Query & Filter Types
// ============================================

export type PeriodValue = 'week' | 'month' | 'year' | 'all';

export interface DateRange {
  start: string;
  end: string;
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  search?: string;
  period?: PeriodValue;
  startDate?: string;
  endDate?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ============================================
// Socket Event Types
// ============================================

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

export interface TokenRefreshedEvent {
  success: boolean;
  error?: string;
}

export interface ServerToClientEvents {
  'task:created': (task: TaskCreatedEvent) => void;
  'task:updated': (task: TaskUpdatedEvent) => void;
  'task:deleted': (data: TaskDeletedEvent) => void;
  'token_refreshed': (data: TokenRefreshedEvent) => void;
}

export interface ClientToServerEvents {
  refresh_token: (token: string) => void;
}

// ============================================
// Error Types
// ============================================

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
    retryAfter?: number;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Error codes
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  INVALID_STATUS = 'INVALID_STATUS',
  INVALID_STATUS_TRANSITION = 'INVALID_STATUS_TRANSITION',
}

// ============================================
// Chart Types
// ============================================

export interface PieChartData {
  name: string;
  value: number;
  color: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

// ============================================
// Form Types (from Zod schemas)
// ============================================

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  amount: number;
  task_date: string;
  start_time: string;
  end_time: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  full_name: string;
  password: string;
}

export interface ProfileFormData {
  full_name: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
}

export interface SetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// UI Component Props Types
// ============================================

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
  value: PeriodValue;
  label: string;
}

// ============================================
// Utility Types
// ============================================

export type WithId<T> = T & { id: number };

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type Nullable<T> = T | null;

export type OptionalNullable<T> = T | null | undefined;

// Type guards
export function isApiErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as Record<string, unknown>).success === false
  );
}

export function isApiSuccessResponse<T>(response: unknown): response is ApiSuccessResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    (response as Record<string, unknown>).success === true
  );
}