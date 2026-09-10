import { Filter, Search } from 'lucide-react';
import { Input, Select } from '../ui';
import type { TaskSearchFilterProps } from '../../types/dashboard';
import { FILTER_STATUS_OPTIONS } from '../../constants/dashboard';

export function TaskSearchFilter({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  formRef,
  darkMode,
}: TaskSearchFilterProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="Tìm kiếm task..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition-all sm:w-64 bg-zinc-950/5 dark:bg-white/5 border-zinc-200/80 dark:border-white/10 dark:text-white dark:placeholder:text-zinc-500 focus:ring-blue-500 focus:border-blue-500`}
        />
      </div>
      <div className="relative">
        <Filter size={16} className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-zinc-400" />
        <Select
          value={filterStatus}
          onChange={(nextStatus: 'all' | 'todo' | 'in_progress' | 'done') => setFilterStatus(nextStatus)}
          options={FILTER_STATUS_OPTIONS}
          className="pl-10"
        />
      </div>
    </div>
  );
}