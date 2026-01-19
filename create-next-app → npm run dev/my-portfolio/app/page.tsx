'use client';

import { useState, useEffect } from 'react';
import ClockButton from './components/ClockButton';
import BreakTimer from './components/BreakTimer';
import StatsCard from './components/StatsCard';
import AttendanceHistory from './components/AttendanceHistory';
import ExportButton from './components/ExportButton';
import ProtectedRoute from './components/ProtectedRoute';
import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance';
import {
  getCurrentAttendanceStatus,
  getAttendanceRecords,
  clockIn,
  clockOut,
  updateBreakDuration,
  calculateStats,
} from '@/lib/attendance';

export default function Home() {
  const [status, setStatus] = useState<AttendanceStatus>('clocked_out');
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);
  const [breakDuration, setBreakDuration] = useState(0);

  // 初期データの読み込み
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusData, recordsData] = await Promise.all([
        getCurrentAttendanceStatus(),
        getAttendanceRecords(),
      ]);

      setStatus(statusData.status);
      setCurrentRecord(statusData.record);
      setRecords(recordsData);
      setBreakDuration(statusData.record?.break_duration || 0);
    } catch (error) {
      console.error('データの読み込みエラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClockIn = async () => {
    try {
      const newRecord = await clockIn();
      setStatus('clocked_in');
      setCurrentRecord(newRecord);
      await loadData();
    } catch (error) {
      console.error('出勤エラー:', error);
      alert(error instanceof Error ? error.message : '出勤に失敗しました');
    }
  };

  const handleClockOut = async () => {
    try {
      const finalBreakDuration = calculateCurrentBreakDuration();
      const updatedRecord = await clockOut(finalBreakDuration);
      setStatus('clocked_out');
      setCurrentRecord(null);
      setIsOnBreak(false);
      setBreakStartTime(null);
      setBreakDuration(0);
      await loadData();
    } catch (error) {
      console.error('退勤エラー:', error);
      alert(error instanceof Error ? error.message : '退勤に失敗しました');
    }
  };

  const handleStartBreak = async () => {
    setIsOnBreak(true);
    setBreakStartTime(new Date());
  };

  const handleEndBreak = async () => {
    if (!breakStartTime) return;

    const breakMinutes = Math.floor(
      (new Date().getTime() - breakStartTime.getTime()) / 1000 / 60
    );
    const newBreakDuration = breakDuration + breakMinutes;

    try {
      await updateBreakDuration(newBreakDuration);
      setBreakDuration(newBreakDuration);
      setIsOnBreak(false);
      setBreakStartTime(null);
      await loadData();
    } catch (error) {
      console.error('休憩終了エラー:', error);
      alert('休憩時間の更新に失敗しました');
    }
  };

  const calculateCurrentBreakDuration = (): number => {
    if (!isOnBreak || !breakStartTime) {
      return breakDuration;
    }
    const currentBreakMinutes = Math.floor(
      (new Date().getTime() - breakStartTime.getTime()) / 1000 / 60
    );
    return breakDuration + currentBreakMinutes;
  };

  const stats = calculateStats(records);

  if (isLoading) {
    return (
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
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* ヘッダー */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              勤怠管理
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              シンプルで使いやすい勤怠記録アプリ
            </p>
          </header>

          {/* メインコンテンツ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* 左カラム: 出勤・退勤と休憩 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
                  出勤・退勤
                </h2>
                <ClockButton
                  status={status}
                  onClockIn={handleClockIn}
                  onClockOut={handleClockOut}
                  isLoading={isLoading}
                />
              </div>

              {status === 'clocked_in' && (
                <BreakTimer
                  breakDuration={breakDuration}
                  isOnBreak={isOnBreak}
                  onStartBreak={handleStartBreak}
                  onEndBreak={handleEndBreak}
                  isLoading={isLoading}
                />
              )}
            </div>

            {/* 右カラム: 統計と履歴 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 統計カード */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    統計
                  </h2>
                  <ExportButton records={records} />
                </div>
                <StatsCard stats={stats} />
              </div>

              {/* 履歴 */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
                <AttendanceHistory records={records} onRefresh={loadData} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
