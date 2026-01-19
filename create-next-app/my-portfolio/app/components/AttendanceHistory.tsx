'use client';

import { useState } from 'react';
import type { AttendanceRecord } from '@/types/attendance';

interface AttendanceHistoryProps {
  records: AttendanceRecord[];
  onRefresh: () => Promise<void>;
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

export default function AttendanceHistory({
  records,
  onRefresh,
}: AttendanceHistoryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatWorkHours = (hours: number | null): string => {
    if (hours === null) return '-';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes > 0) {
      return `${wholeHours}時間${minutes}分`;
    }
    return `${wholeHours}時間`;
  };

  const formatBreakDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  const filteredRecords = records.slice(0, 30); // 最新30件を表示

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          勤務履歴
        </h2>
        <div className="flex gap-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
            className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-800 dark:text-gray-200"
          >
            <option value="daily">日次</option>
            <option value="weekly">週次</option>
            <option value="monthly">月次</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? '更新中...' : '更新'}
          </button>
        </div>
      </div>

      {filteredRecords.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          勤務記録がありません
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {formatDate(record.date)}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    労働時間
                  </div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatWorkHours(record.total_work_hours)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    出勤
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatTime(record.clock_in)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    退勤
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {record.clock_out ? formatTime(record.clock_out) : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    休憩時間
                  </div>
                  <div className="font-semibold text-gray-800 dark:text-gray-200">
                    {formatBreakDuration(record.break_duration)}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 mb-1">
                    ステータス
                  </div>
                  <div className="font-semibold">
                    {record.clock_out ? (
                      <span className="text-green-600 dark:text-green-400">
                        退勤済み
                      </span>
                    ) : (
                      <span className="text-orange-600 dark:text-orange-400">
                        出勤中
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
