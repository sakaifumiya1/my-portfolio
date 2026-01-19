/**
 * 勤怠記録の型定義
 */
export interface AttendanceRecord {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD形式
  clock_in: string; // ISO 8601形式のタイムスタンプ
  clock_out: string | null;
  break_duration: number; // 分単位
  total_work_hours: number | null; // 時間単位（小数点）
  created_at: string;
  updated_at: string;
}

/**
 * 出勤・退勤の状態
 */
export type AttendanceStatus = 'clocked_out' | 'clocked_in' | 'on_break';

/**
 * 休憩記録
 */
export interface BreakRecord {
  id: string;
  attendance_record_id: string;
  break_start: string;
  break_end: string | null;
  duration: number | null; // 分単位
}

/**
 * 勤怠統計
 */
export interface AttendanceStats {
  totalDays: number;
  totalHours: number;
  averageHours: number;
  currentMonthHours: number;
  currentWeekHours: number;
}

/**
 * エクスポート用のデータ形式
 */
export interface ExportData {
  date: string;
  clockIn: string;
  clockOut: string;
  breakDuration: number;
  workHours: number;
}
