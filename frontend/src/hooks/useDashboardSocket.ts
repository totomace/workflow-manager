// useDashboardSocket - Socket event handlers for Dashboard
// Extracted from Dashboard.tsx to separate socket logic

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socket from '../socket';
import { taskKeys } from './useTasks';
import type { Task, TaskCreatedEvent, TaskUpdatedEvent, TaskDeletedEvent } from '../types/dashboard';
import toast from 'react-hot-toast';

interface UseDashboardSocketProps {
  moneyPeriod: string;
  statusPeriod: string;
}

export function useDashboardSocket({ moneyPeriod, statusPeriod }: UseDashboardSocketProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleTaskCreated = (newTask: TaskCreatedEvent) => {
      // Optimistically update the cache
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) => (old ? [newTask as Task, ...old] : [newTask as Task]));
      // Invalidate stats queries to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.money(moneyPeriod) });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.status(statusPeriod) });
      toast.success('Có task mới được tạo');
    };

    const handleTaskUpdated = (updatedTask: TaskUpdatedEvent) => {
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? (updatedTask as Task) : task))
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.money(moneyPeriod) });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.status(statusPeriod) });
    };

    const handleTaskDeleted = ({ id }: TaskDeletedEvent) => {
      queryClient.setQueryData<Task[]>(taskKeys.lists(), (old) =>
        old?.filter((task) => task.id !== Number(id))
      );
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.money(moneyPeriod) });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats.status(statusPeriod) });
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, [queryClient, moneyPeriod, statusPeriod]);
}