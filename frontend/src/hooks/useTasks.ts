import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import type {
  Task,
  TaskStats,
  MoneyStats,
  CreateTaskData,
  UpdateTaskData,
  TaskListResponse,
  TaskCreateResponse,
  TaskUpdateResponse,
} from '../types';

// Query Keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: number) => [...taskKeys.details(), id] as const,
  stats: {
    money: (period: string) => ['tasks', 'stats', 'money', period] as const,
    status: (period: string) => ['tasks', 'stats', 'status', period] as const,
  },
};

// Fetch functions
const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data.tasks;
};

const fetchMoneyStats = async (period: string): Promise<MoneyStats> => {
  const response = await api.get(`/tasks/stats/money?period=${period}`);
  return response.data;
};

const fetchStatusStats = async (period: string): Promise<TaskStats> => {
  const response = await api.get(`/tasks/stats/status?period=${period}`);
  return response.data.counts;
};

const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post('/tasks', data);
  return response.data.task;
};

const updateTask = async (data: UpdateTaskData): Promise<Task> => {
  const { id, ...rest } = data;
  const response = await api.put(`/tasks/${id}`, rest);
  return response.data.task;
};

const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// Hooks
export function useTasks() {
  return useQuery({
    queryKey: taskKeys.lists(),
    queryFn: fetchTasks,
  });
}

export function useMoneyStats(period: string = 'month') {
  return useQuery({
    queryKey: taskKeys.stats.money(period),
    queryFn: () => fetchMoneyStats(period),
    enabled: !!period,
  });
}

export function useStatusStats(period: string = 'month') {
  return useQuery({
    queryKey: taskKeys.stats.status(period),
    queryFn: () => fetchStatusStats(period),
    enabled: !!period,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.money('month') });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.status('month') });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.money('month') });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.status('month') });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.money('month') });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.status('month') });
    },
  });
}

// Optimistic update hooks
export function useOptimisticCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

      const optimisticTask: Task = {
        id: Date.now(),
        ...newTask,
        user_id: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Task;

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old ? [optimisticTask, ...old] : [optimisticTask]
      );

      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useOptimisticUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old?.map((task) =>
          task.id === updatedTask.id ? { ...task, ...updatedTask } : task
        )
      );

      return { previousTasks };
    },
    onError: (err, updatedTask, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useOptimisticDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      const previousTasks = queryClient.getQueryData<Task[]>(taskKeys.lists());

      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old?.filter((task) => task.id !== id)
      );

      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(taskKeys.lists(), context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}