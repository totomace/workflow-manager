import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock3 } from 'lucide-react';
import type { MetricCardsProps } from '../../types/dashboard';

export function MetricCards({ tasks, statusStats }: MetricCardsProps) {
  const metricCards = [
    { label: 'Tổng task', value: tasks.length, icon: CheckCircle2, accent: 'from-blue-500 to-indigo-500' },
    { label: 'Cần làm', value: statusStats?.todo || 0, icon: Circle, accent: 'from-zinc-500 to-zinc-700' },
    { label: 'Đang làm', value: statusStats?.in_progress || 0, icon: Clock3, accent: 'from-amber-400 to-orange-500' },
    { label: 'Hoàn thành', value: statusStats?.done || 0, icon: CheckCircle2, accent: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-[28px] border border-zinc-200/80 bg-white/80 shadow-xl shadow-zinc-200/40 backdrop-blur-xl p-5 dark:border-white/10 dark:bg-zinc-950/55 dark:shadow-black/30"
          >
            <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
              <Icon size={20} />
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{card.value}</p>
          </motion.div>
        );
      })}
    </div>
  );
}