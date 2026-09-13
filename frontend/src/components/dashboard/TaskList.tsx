import { AnimatePresence } from 'framer-motion';
import { EmptyTasks, SkeletonList } from '../ui';
import { TaskItem } from './TaskItem';
import type { TaskListProps } from '../../types/dashboard';

export function TaskList({
  isLoading,
  filteredTasks,
  onEdit,
  onDelete,
  formRef,
  darkMode,
  formatCurrency,
  formatDate,
}: TaskListProps) {
  return (
    <div className="rounded-[28px] border border-zinc-200/80 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur-xl p-5 sm:p-6 dark:border-white/10 dark:bg-zinc-950/55 dark:shadow-black/30">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Danh sách task ({filteredTasks.length})</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Tìm kiếm, lọc và cập nhật công việc nhanh.</p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonList count={3} hasAvatar hasAction />
      ) : filteredTasks.length === 0 ? (
        <EmptyTasks onCreate={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
      ) : (
        <div className="grid gap-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                darkMode={darkMode}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}