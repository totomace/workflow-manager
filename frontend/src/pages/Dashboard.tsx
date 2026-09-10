import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import socket from '../socket';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  taskKeys,
  type Task,
  type MoneyStats,
  type TaskStats,
} from '../hooks/useTasks';
import { useDashboardSocket } from '../hooks/useDashboardSocket';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTaskFilters } from '../hooks/useTaskFilters';
import {
  DashboardHeader,
  MetricCards,
  MoneyStatsCard,
  StatusStatsSection,
  TaskForm,
  TaskSearchFilter,
  TaskList,
  DeleteConfirmModal,
} from '../components/dashboard';
import { STATUS_LABELS, STATUS_VARIANTS, PANEL } from '../constants/dashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLDivElement>(null);

  // React Query hooks
  const { data: tasks = [], isLoading, error: tasksError, refetch: refetchTasks } = useTasks();

  // Mutations with optimistic updates
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Dashboard stats (money + status with periods)
  const {
    moneyStats,
    statusStats,
    moneyPeriod,
    statusPeriod,
    setMoneyPeriod,
    setStatusPeriod,
    getDateRangeLabel,
  } = useDashboardStats();

  // Task filters (search + status filter)
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredTasks,
  } = useTaskFilters(tasks);

  // Socket event handlers
  useDashboardSocket({ moneyPeriod, statusPeriod });

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  // Form state - use ref to track task being edited
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
  };

  const handleFormSubmit = async (data: import('../types/dashboard').TaskFormData) => {
    setIsSubmitting(true);
    try {
      if (editTask) {
        await updateTaskMutation.mutateAsync({ id: editTask.id, ...data });
        toast.success('Đã cập nhật task');
      } else {
        await createTaskMutation.mutateAsync(data);
        toast.success('Đã thêm task mới');
      }
      setEditTask(null);
    } catch (err) {
      const message = err instanceof Error && 'response' in err && err.response?.data?.error
        ? err.response.data.error
        : 'Có lỗi xảy ra';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setEditTask(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTaskId) return;
    try {
      await deleteTaskMutation.mutateAsync(deleteTaskId);
      toast.success('Đã xóa task');
    } catch {
      toast.error('Xóa thất bại');
    } finally {
      setDeleteModalOpen(false);
      setDeleteTaskId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#FAFAFA] text-zinc-950 transition-colors dark:bg-[#09090B] dark:text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-28 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-500/25" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/15" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardHeader
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
        />

        {tasksError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200" role="alert">
            Không thể tải danh sách task
          </div>
        )}

        <section className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <MetricCards tasks={tasks} statusStats={statusStats} darkMode={darkMode} />
          <MoneyStatsCard
            moneyStats={moneyStats}
            moneyPeriod={moneyPeriod}
            setMoneyPeriod={setMoneyPeriod}
            darkMode={darkMode}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <StatusStatsSection
            statusStats={statusStats}
            tasks={tasks}
            statusPeriod={statusPeriod}
            setStatusPeriod={setStatusPeriod}
            darkMode={darkMode}
          />
          <TaskForm
            editId={editTask?.id || null}
            formRef={formRef}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={isSubmitting}
            taskToEdit={editTask}
          />
        </section>

        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          filteredTasks={filteredTasks}
          onEdit={handleEdit}
          onDelete={(id) => {
            setDeleteTaskId(id);
            setDeleteModalOpen(true);
          }}
          formRef={formRef}
          darkMode={darkMode}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
        />

        <DeleteConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          isPending={deleteTaskMutation.isPending}
        />
      </div>
    </main>
  );
};

export default Dashboard;