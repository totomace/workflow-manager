// useTaskForm - Form state, validation, edit/reset logic for Dashboard
// Extracted from Dashboard.tsx to separate form logic

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema } from '../schemas/taskSchema';
import type { Task, TaskFormData } from '../types/dashboard';

interface UseTaskFormReturn {
  register: ReturnType<typeof useForm<TaskFormData>['register']>;
  handleSubmit: ReturnType<typeof useForm<TaskFormData>['handleSubmit']>;
  reset: ReturnType<typeof useForm<TaskFormData>['reset']>;
  setValue: ReturnType<typeof useForm<TaskFormData>['setValue']>;
  watch: ReturnType<typeof useForm<TaskFormData>['watch']>;
  errors: ReturnType<typeof useForm<TaskFormData>['formState']>['errors'];
  editId: number | null;
  setEditId: (id: number | null) => void;
  displayAmount: string;
  setDisplayAmount: (amount: string) => void;
  amountFocused: boolean;
  setAmountFocused: (focused: boolean) => void;
  formRef: React.RefObject<HTMLDivElement>;
  formatThousandsForDisplay: (amount: number) => string;
  parseThousandsInput: (input: string) => number;
  resetTaskForm: () => void;
  populateFormForEdit: (task: Task) => void;
}

export function useTaskForm(): UseTaskFormReturn {
  const [editId, setEditId] = useState<number | null>(null);
  const [displayAmount, setDisplayAmount] = useState('');
  const [amountFocused, setAmountFocused] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'todo',
      amount: 0,
      task_date: '',
      start_time: '',
      end_time: '',
    },
  });

  // Format amount for display (show in thousands with comma separator)
  const formatThousandsForDisplay = (amount: number): string => {
    if (!amount || amount === 0) return '';
    return new Intl.NumberFormat('vi-VN').format(Math.floor(amount / 1000));
  };

  // Parse thousands input back to actual VND amount
  const parseThousandsInput = (input: string): number => {
    const rawValue = input.replace(/\D/g, '');
    if (!rawValue) return 0;
    return parseInt(rawValue, 10) * 1000;
  };

  const resetTaskForm = () => {
    reset({
      title: '',
      description: '',
      status: 'todo',
      amount: 0,
      task_date: '',
      start_time: '',
      end_time: '',
    });
    setDisplayAmount('');
    setEditId(null);
  };

  const populateFormForEdit = (task: Task) => {
    setEditId(task.id);
    setValue('title', task.title);
    setValue('description', task.description || '');
    setValue('status', task.status);
    setValue('amount', task.amount || 0);
    setValue('task_date', task.task_date ? task.task_date.split('T')[0] : '');
    setValue('start_time', task.start_time ? task.start_time.slice(0, 5) : '');
    setValue('end_time', task.end_time ? task.end_time.slice(0, 5) : '');
    setDisplayAmount(formatThousandsForDisplay(task.amount));
    setAmountFocused(false);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    errors,
    editId,
    setEditId,
    displayAmount,
    setDisplayAmount,
    amountFocused,
    setAmountFocused,
    formRef,
    formatThousandsForDisplay,
    parseThousandsInput,
    resetTaskForm,
    populateFormForEdit,
  };
}