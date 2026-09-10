const { z } = require('zod');

/**
 * Tasks validation schemas
 */

// Task status enum
const taskStatusEnum = z.enum(['todo', 'in_progress', 'done']);

// Create task validation
const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().max(500, 'Description too long').optional(),
    status: taskStatusEnum.optional().default('todo'),
    amount: z.number().int('Amount must be an integer').min(0, 'Amount cannot be negative').max(1000000, 'Amount too large').optional().default(0),
    task_date: z.string().datetime().optional().nullable(),
    start_time: z.string().datetime().optional().nullable(),
    end_time: z.string().datetime().optional().nullable(),
  }),
});

// Update task validation (all fields optional)
const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
    description: z.string().max(500, 'Description too long').optional(),
    status: taskStatusEnum.optional(),
    amount: z.number().int('Amount must be an integer').min(0, 'Amount cannot be negative').max(1000000, 'Amount too large').optional(),
    task_date: z.string().datetime().optional().nullable(),
    start_time: z.string().datetime().optional().nullable(),
    end_time: z.string().datetime().optional().nullable(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

// Get task by ID validation
const getTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

// Delete task validation
const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});

// Get all tasks query validation
const getAllTasksSchema = z.object({
  query: z.object({
    // Future: add filters like status, date range, etc.
  }),
});

// Money stats query validation
const moneyStatsSchema = z.object({
  query: z.object({
    period: z.enum(['week', 'month', 'year', 'all']).optional(),
  }),
});

// Status stats query validation
const statusStatsSchema = z.object({
  query: z.object({
    period: z.enum(['week', 'month', 'year', 'all']).optional(),
  }),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  getTaskSchema,
  deleteTaskSchema,
  getAllTasksSchema,
  moneyStatsSchema,
  statusStatsSchema,
};