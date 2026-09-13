import { motion } from 'framer-motion';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { Select } from '../ui';
import type { StatusStatsSectionProps } from '../../types/dashboard';
import { PERIODS, PANEL, CHART_COLORS } from '../../constants/dashboard';

export function StatusStatsSection({
  statusStats,
  tasks,
  statusPeriod,
  setStatusPeriod,
  darkMode,
}: StatusStatsSectionProps) {
  const stats = [
    { name: 'Cần làm', value: statusStats?.todo || 0, color: CHART_COLORS.todo },
    { name: 'Đang làm', value: statusStats?.in_progress || 0, color: CHART_COLORS.in_progress },
    { name: 'Hoàn thành', value: statusStats?.done || 0, color: CHART_COLORS.done },
  ];

  const completionRate = tasks.length ? Math.round(((statusStats?.done || 0) / tasks.length) * 100) : 0;

  const getDateRangeLabel = (period: StatusStatsSectionProps['statusPeriod']): string => {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let startDate: Date;
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return 'Tất cả thời gian';
    }
    const format = (date: Date) =>
      `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    return `${format(startDate)} – ${format(endDate)}`;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={PANEL}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Tình trạng công việc</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{getDateRangeLabel(statusPeriod)}</p>
        </div>
        <Select
          value={statusPeriod}
          onChange={(nextPeriod: string) => {
            setStatusPeriod(nextPeriod as StatusStatsSectionProps['statusPeriod']);
          }}
          options={PERIODS}
          className="min-w-36"
        />
      </div>
      <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_0.85fr]">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats} cx="50%" cy="50%" innerRadius={66} outerRadius={98} paddingAngle={4} dataKey="value">
                {stats.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-semibold">{completionRate}%</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">hoàn thành</span>
          </div>
        </div>
        <div className="space-y-3">
          {stats.map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-zinc-50 px-3 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="flex items-center gap-2 text-sm">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name}
              </span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}