import { motion } from 'framer-motion';
import { Banknote } from 'lucide-react';
import { Select } from '../ui';
import type { MoneyStatsCardProps } from '../../types/dashboard';
import { PERIODS, PANEL } from '../../constants/dashboard';

export function MoneyStatsCard({
  moneyStats,
  moneyPeriod,
  setMoneyPeriod,
}: MoneyStatsCardProps) {
  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const getDateRangeLabel = (period: MoneyStatsCardProps['moneyPeriod']): string => {
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
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Thu nhập</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-300">
            {formatCurrency(moneyStats?.total || 0)}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">{getDateRangeLabel(moneyPeriod)}</p>
        </div>
        <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-300">
          <Banknote size={22} />
        </div>
      </div>
      <Select
        value={moneyPeriod}
        onChange={(nextPeriod: string) => {
          setMoneyPeriod(nextPeriod as MoneyStatsCardProps['moneyPeriod']);
        }}
        options={PERIODS}
        className="mt-5"
      />
    </motion.div>
  );
}