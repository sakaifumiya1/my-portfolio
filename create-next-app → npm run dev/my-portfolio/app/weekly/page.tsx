'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import type { AttendanceRecord } from '@/types/attendance';
import { getAttendanceRecords } from '@/lib/attendance';

export default function WeeklyPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeekStart());

  useEffect(() => {
    loadRecords();
  }, [selectedWeek]);

  function getCurrentWeekStart(): string {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const weekStart = new Date(now.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  }

  function getWeekStart(date: string): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    const weekStart = new Date(d.setDate(diff));
    return weekStart.toISOString().split('T')[0];
  }

  function getWeekEnd(weekStart: string): string {
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end.toISOString().split('T')[0];
  }

  const loadRecords = async () => {
    setLoading(true);
    try {
      const allRecords = await getAttendanceRecords(1000);
      const weekEnd = getWeekEnd(selectedWeek);
      const filtered = allRecords.filter((record) => {
        return record.date >= selectedWeek && record.date <= weekEnd;
      });
      setRecords(filtered);
    } catch (error) {
      console.error('データの読み込みエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
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

  const calculateWeeklyStats = () => {
    const completedRecords = records.filter(
      (r) => r.clock_out !== null && r.total_work_hours !== null
    );
    const totalHours = completedRecords.reduce(
      (sum, r) => sum + (r.total_work_hours || 0),
      0
    );
    const totalDays = completedRecords.length;
    const averageHours = totalDays > 0 ? totalHours / totalDays : 0;
    const totalBreakMinutes = records.reduce(
      (sum, r) => sum + r.break_duration,
      0
    );

    return {
      totalDays,
      totalHours,
      averageHours,
      totalBreakMinutes,
    };
  };

  const stats = calculateWeeklyStats();

  const weekEnd = getWeekEnd(selectedWeek);
  const weekRange = `${selectedWeek} ～ ${weekEnd}`;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="text-center">
            <svg
              className="animate-spin h-12 w-12 mx-auto text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">読み込み中...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const handlePreviousWeek = () => {
    const date = new Date(selectedWeek);
    date.setDate(date.getDate() - 7);
    setSelectedWeek(date.toISOString().split('T')[0]);
  };

  const handleNextWeek = () => {
    const date = new Date(selectedWeek);
    date.setDate(date.getDate() + 7);
    setSelectedWeek(date.toISOString().split('T')[0]);
  };

  const handleCurrentWeek = () => {
    setSelectedWeek(getCurrentWeekStart());
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              週次勤怠状況
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePreviousWeek}
                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                ← 前週
              </button>
              <div className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg text-gray-800 dark:text-gray-200">
                {weekRange}
              </div>
              <button
                onClick={handleNextWeek}
                className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                次週 →
              </button>
              <button
                onClick={handleCurrentWeek}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                今週
              </button>
            </div>
          </header>

          {/* 統計カード */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                出勤日数
              </div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.totalDays}日
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                総労働時間
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatWorkHours(stats.totalHours)}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                平均労働時間
              </div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {formatWorkHours(stats.averageHours)}
              </div>
            </div>
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-6 shadow-md">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                総休憩時間
              </div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatBreakDuration(stats.totalBreakMinutes)}
              </div>
            </div>
          </div>

          {/* 勤務記録一覧 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              勤務記録
            </h2>
            {records.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                この週の勤務記録がありません
              </div>
            ) : (
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:shadow-md transition-shadow"
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
        </div>
      </div>
    </ProtectedRoute>
  );
}
