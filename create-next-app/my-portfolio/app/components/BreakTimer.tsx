'use client';

import { useState, useEffect } from 'react';

interface BreakTimerProps {
  breakDuration: number; // 分単位
  isOnBreak: boolean;
  onStartBreak: () => Promise<void>;
  onEndBreak: () => Promise<void>;
  isLoading?: boolean;
}

export default function BreakTimer({
  breakDuration,
  isOnBreak,
  onStartBreak,
  onEndBreak,
  isLoading = false,
}: BreakTimerProps) {
  const [currentBreakTime, setCurrentBreakTime] = useState(0);
  const [breakStartTime, setBreakStartTime] = useState<Date | null>(null);

  useEffect(() => {
    if (isOnBreak && breakStartTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - breakStartTime.getTime()) / 1000 / 60);
        setCurrentBreakTime(diff);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCurrentBreakTime(0);
      setBreakStartTime(null);
    }
  }, [isOnBreak, breakStartTime]);

  const handleStartBreak = async () => {
    setBreakStartTime(new Date());
    await onStartBreak();
  };

  const handleEndBreak = async () => {
    setBreakStartTime(null);
    await onEndBreak();
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  const totalBreakTime = breakDuration + currentBreakTime;

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        休憩時間
      </h3>
      
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
          {formatTime(totalBreakTime)}
        </div>
        {isOnBreak && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            現在の休憩: {formatTime(currentBreakTime)}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isOnBreak ? (
          <button
            onClick={handleStartBreak}
            disabled={isLoading}
            className="flex-1 py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            休憩開始
          </button>
        ) : (
          <button
            onClick={handleEndBreak}
            disabled={isLoading}
            className="flex-1 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            休憩終了
          </button>
        )}
      </div>
    </div>
  );
}
