import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Badge, Button, Input, Select } from '../ui';
import { taskSchema } from '../../schemas/taskSchema';
import type { TaskFormProps, TaskFormData } from '../../types/dashboard';
import { TASK_STATUS_OPTIONS, INPUT_SURFACE, PANEL } from '../../constants/dashboard';

export function TaskForm({
  editId,
  formRef,
  onSubmit,
  onCancel,
  isSubmitting,
  taskToEdit,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
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

  const [displayAmount, setDisplayAmount] = useState('');

  // Format amount for display (show in thousands with comma separator)
  const formatThousandsForDisplay = (amount: number): string => {
    if (!amount || amount === 0) return '';
    return new Intl.NumberFormat('vi-VN').format(Math.floor(amount / 1000));
  };

  // Populate form when taskToEdit changes
  useEffect(() => {
    if (taskToEdit) {
      setValue('title', taskToEdit.title);
      setValue('description', taskToEdit.description || '');
      setValue('status', taskToEdit.status);
      setValue('amount', taskToEdit.amount || 0);
      setValue('task_date', taskToEdit.task_date ? taskToEdit.task_date.split('T')[0] : '');
      setValue('start_time', taskToEdit.start_time ? taskToEdit.start_time.slice(0, 5) : '');
      setValue('end_time', taskToEdit.end_time ? taskToEdit.end_time.slice(0, 5) : '');
      setDisplayAmount(formatThousandsForDisplay(taskToEdit.amount));
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [taskToEdit, formRef, setValue]);

  // Handle amount input changes
  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\D/g, '');
    const amountVND = rawValue === '' ? 0 : parseInt(rawValue, 10) * 1000;
    setValue('amount', amountVND, { shouldValidate: true });
    setDisplayAmount(rawValue);
  };

  const handleAmountFocus = () => {
    const current = watch('amount');
    setDisplayAmount(current === 0 ? '' : Math.floor(current / 1000).toString());
  };

  const handleAmountBlur = () => {
    const current = watch('amount');
    setDisplayAmount(formatThousandsForDisplay(current));
  };

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={PANEL}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{editId ? 'Chỉnh sửa task' : 'Tạo task mới'}</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Ghi nhận thời gian, trạng thái và thu nhập.</p>
        </div>
        <Badge variant={editId ? 'progress' : 'info'}>
          {editId ? 'Đang sửa' : 'Mới'}
        </Badge>
      </div>
      <form onSubmit={handleSubmit(onSubmit as (data: TaskFormData) => Promise<void>)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Tiêu đề"
            placeholder="Ví dụ: Hoàn thiện landing page"
            error={errors.title?.message}
            className={INPUT_SURFACE}
            {...register('title')}
          />
          <Input
            label="Mô tả"
            placeholder="Ghi chú ngắn"
            error={errors.description?.message}
            className={INPUT_SURFACE}
            {...register('description')}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            label="Ngày làm"
            type="date"
            error={errors.task_date?.message}
            className={INPUT_SURFACE}
            {...register('task_date')}
          />
          <Input
            label="Giờ bắt đầu"
            type="time"
            error={errors.start_time?.message}
            className={INPUT_SURFACE}
            {...register('start_time')}
          />
          <Input
            label="Giờ kết thúc"
            type="time"
            error={errors.end_time?.message}
            className={INPUT_SURFACE}
            {...register('end_time')}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tiền (VNĐ)
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Nhập theo nghìn, ví dụ 500"
              value={displayAmount}
              onChange={handleAmountChange}
              onFocus={handleAmountFocus}
              onBlur={handleAmountBlur}
              className={`w-full rounded-xl border px-4 py-2.5 outline-none transition-all ${INPUT_SURFACE}`}
            />
            {errors.amount && <p className="mt-1.5 text-xs text-red-500">{errors.amount.message}</p>}
          </div>
          <Select
            label="Trạng thái"
            value={watch('status')}
            onChange={(nextStatus: 'todo' | 'in_progress' | 'done') => setValue('status', nextStatus)}
            options={TASK_STATUS_OPTIONS}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" leftIcon={editId ? <Edit3 size={16} /> : <Plus size={16} />} disabled={isSubmitting}>
            {editId ? 'Cập nhật task' : 'Thêm task'}
          </Button>
          {editId && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
              Hủy chỉnh sửa
            </Button>
          )}
        </div>
      </form>
    </motion.div>
  );
}