import { Link } from 'react-router-dom';
import { LogOut, Moon, Sparkles, Sun, User } from 'lucide-react';
import { Button } from '../ui';
import type { DashboardHeaderProps } from '../../types/dashboard';

export function DashboardHeader({
  user,
  darkMode,
  toggleDarkMode,
  onLogout,
}: DashboardHeaderProps) {
  return (
    <header className="rounded-[28px] border border-zinc-200/80 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur-xl px-4 py-4 sm:px-6 dark:border-white/10 dark:bg-zinc-950/55 dark:shadow-black/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white shadow-lg shadow-blue-500/20 dark:bg-white dark:text-zinc-950">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">
              TaskFlow
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Bảng điều khiển công việc
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {user?.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="sm" aria-label="Hồ sơ">
              <User size={18} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            leftIcon={<LogOut size={18} />}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}