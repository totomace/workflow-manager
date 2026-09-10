import { motion } from 'framer-motion';
import { Calendar, Clock3, Edit3, Trash2 } from 'lucide-react';
import { Badge, Button } from '../ui';
import type { TaskItemProps } from '../../types/dashboard';
import { STATUS_LABELS, STATUS_VARIANTS, CHART_COLORS } from '../../constants/dashboard';

export function TaskItem({
  task,
  onEdit,
  onDelete,
  darkMode,
  formatCurrency,
  formatDate,
}: TaskItemProps) {
  return (
    <motion.article
      key={task.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.2 }}
      className="group rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-4 transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:shadow-lg hover:shadow-blue-500/10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-blue-400/50 dark:hover:bg-white/[0.07]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={STATUS_VARIANTS[task.status]} dot>
              {STATUS_LABELS[task.status]}
            </Badge>
            {task.amount > 0 && (
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(task.amount)}
              </span>
            )}
          </div>
          <h3 className="truncate text-base font-semibold">{task.title}</h3>
          {task.description && <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{task.description}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-500">
            {task.task_date && (
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(task.task_date)}
              </span>
            )}
            {task.start_time && (
              <span className="flex items-center gap-1.5">
                <Clock3 size={13} />
                {task.start_time.slice(0, 5)}
              </span>
            )}
            {task.end_time && <span>→ {task.end_time.slice(0, 5)}</span>}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)} aria-label="Chỉnh sửa task">
            <Edit3 size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)} aria-label="Xóa task">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}