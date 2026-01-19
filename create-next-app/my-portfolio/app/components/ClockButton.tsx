'use client';

import { useState } from 'react';
import type { AttendanceStatus } from '@/types/attendance';

interface ClockButtonProps {
  status: AttendanceStatus;
  onClockIn: () => Promise<void>;
  onClockOut: () => Promise<void>;
  isLoading?: boolean;
}

export default function ClockButton({
  status,
  onClockIn,
  onClockOut,
  isLoading = false,
}: ClockButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    setIsProcessing(true);
    try {
      if (status === 'clocked_out') {
        await onClockIn();
      } else {
        await onClockOut();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = isLoading || isProcessing;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        relative w-full max-w-md mx-auto py-8 px-12 rounded-2xl
        text-2xl font-bold text-white
        transition-all duration-300 ease-in-out
        transform hover:scale-105 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        shadow-lg hover:shadow-xl
        ${
          status === 'clocked_out'
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
        }
      `}
    >
      {isProcessing || isLoading ? (
        <span className="flex items-center justify-center gap-3">
          <svg
            className="animate-spin h-6 w-6"
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
          処理中...
        </span>
      ) : status === 'clocked_out' ? (
        '出勤'
      ) : (
        '退勤'
      )}
    </button>
  );
}
