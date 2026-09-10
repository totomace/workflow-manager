// useTaskFilters - Search term, filter status, filtered tasks memo
// Extracted from Dashboard.tsx to separate filter logic

import { useMemo, useState } from 'react';
import type { Task } from '../types/dashboard';

interface UseTaskFiltersReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: 'all' | 'todo' | 'in_progress' | 'done';
  setFilterStatus: (status: 'all' | 'todo' | 'in_progress' | 'done') => void;
  filteredTasks: Task[];
}

export function useTaskFilters(tasks: Task[]): UseTaskFiltersReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'done'>('all');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [tasks, searchTerm, filterStatus]);

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredTasks,
  };
}