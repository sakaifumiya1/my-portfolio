'use client';

import { useState } from 'react';
import type { AttendanceRecord, ExportData } from '@/types/attendance';

interface ExportButtonProps {
  records: AttendanceRecord[];
}

export default function ExportButton({ records }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const convertToCSV = (data: ExportData[]): string => {
    const headers = ['日付', '出勤時刻', '退勤時刻', '休憩時間（分）', '労働時間（時間）'];
    const rows = data.map((record) => [
      record.date,
      record.clockIn,
      record.clockOut,
      record.breakDuration.toString(),
      record.workHours.toFixed(2),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    // BOMを追加してExcelで正しく開けるようにする
    return '\uFEFF' + csvContent;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData: ExportData[] = records
        .filter((record) => record.clock_out !== null)
        .map((record) => ({
          date: formatDate(record.date),
          clockIn: formatTime(record.clock_in),
          clockOut: formatTime(record.clock_out!),
          breakDuration: record.break_duration,
          workHours: record.total_work_hours || 0,
        }));

      const csvContent = convertToCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `勤怠記録_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('エクスポートエラー:', error);
      alert('エクスポートに失敗しました');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || records.length === 0}
      className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isExporting ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
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
          エクスポート中...
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          CSVエクスポート
        </>
      )}
    </button>
  );
}
