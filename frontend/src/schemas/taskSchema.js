import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống').max(200, 'Tiêu đề quá dài'),
  description: z.string().max(500, 'Mô tả quá dài').optional().or(z.literal('')),
  status: z.enum(['todo', 'in_progress', 'done']),
});