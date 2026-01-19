'use client';

import type { AttendanceStats } from '@/types/attendance';

interface StatsCardProps {
  stats: AttendanceStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const formatHours = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes > 0) {
      return `${wholeHours}時間${minutes}分`;
    }
    return `${wholeHours}時間`;
  };

  const statItems = [
    {
      label: '総労働日数',
      value: `${stats.totalDays}日`,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: '総労働時間',
      value: formatHours(stats.totalHours),
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: '平均労働時間',
      value: formatHours(stats.averageHours),
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      label: '今週の労働時間',
      value: formatHours(stats.currentWeekHours),
      color: 'text-orange-600 dark:text-orange-400',
    },
    {
      label: '今月の労働時間',
      value: formatHours(stats.currentMonthHours),
      color: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {statItems.map((item, index) => (
        <div
          key={index}
          className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {item.label}
          </div>
          <div className={`text-2xl font-bold ${item.color}`}>
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
