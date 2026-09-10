// useDashboardStats - Money/status stats with period management
// Extracted from Dashboard.tsx to separate stats logic

import { useState, useCallback } from 'react';
import { useMoneyStats, useStatusStats } from './useTasks';
import type { MoneyStats, TaskStats, PeriodValue } from '../types/dashboard';
import { PERIODS } from '../constants/dashboard';

interface UseDashboardStatsReturn {
  moneyStats: MoneyStats | undefined;
  statusStats: TaskStats | undefined;
  moneyPeriod: PeriodValue;
  statusPeriod: PeriodValue;
  setMoneyPeriod: (period: PeriodValue) => void;
  setStatusPeriod: (period: PeriodValue) => void;
  getDateRangeLabel: (period: PeriodValue) => string;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const [moneyPeriod, setMoneyPeriod] = useState<PeriodValue>('month');
  const [statusPeriod, setStatusPeriod] = useState<PeriodValue>('month');

  const { data: moneyStats, refetch: refetchMoneyStats } = useMoneyStats(moneyPeriod);
  const { data: statusStats, refetch: refetchStatusStats } = useStatusStats(statusPeriod);

  // Refetch when period changes
  const handleMoneyPeriodChange = useCallback((period: PeriodValue) => {
    setMoneyPeriod(period);
    refetchMoneyStats();
  }, [refetchMoneyStats]);

  const handleStatusPeriodChange = useCallback((period: PeriodValue) => {
    setStatusPeriod(period);
    refetchStatusStats();
  }, [refetchStatusStats]);

  const getDateRangeLabel = useCallback((period: PeriodValue): string => {
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
  }, []);

  return {
    moneyStats,
    statusStats,
    moneyPeriod,
    statusPeriod,
    setMoneyPeriod: handleMoneyPeriodChange,
    setStatusPeriod: handleStatusPeriodChange,
    getDateRangeLabel,
  };
}