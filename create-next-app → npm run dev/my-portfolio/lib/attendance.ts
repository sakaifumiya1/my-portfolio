import type { AttendanceRecord, AttendanceStatus, AttendanceStats } from '@/types/attendance';

/**
 * 現在の出勤状態を取得
 */
export async function getCurrentAttendanceStatus(): Promise<{
  status: AttendanceStatus;
  record: AttendanceRecord | null;
}> {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const response = await fetch(
      `/api/attendance?limit=1&offset=0`,
      { cache: 'no-store' }
    );
    const result = await response.json();
    
    if (!result.data || result.data.length === 0) {
      return { status: 'clocked_out', record: null };
    }

    const todayRecord = result.data.find(
      (r: AttendanceRecord) => r.date === today
    );

    if (!todayRecord) {
      return { status: 'clocked_out', record: null };
    }

    if (todayRecord.clock_out) {
      return { status: 'clocked_out', record: todayRecord };
    }

    // 出勤中だが休憩中かどうかは別途管理が必要
    return { status: 'clocked_in', record: todayRecord };
  } catch (error) {
    console.error('Error fetching attendance status:', error);
    return { status: 'clocked_out', record: null };
  }
}

/**
 * 出勤記録を取得
 */
export async function getAttendanceRecords(
  limit: number = 100,
  offset: number = 0
): Promise<AttendanceRecord[]> {
  try {
    const response = await fetch(
      `/api/attendance?limit=${limit}&offset=${offset}`,
      { cache: 'no-store' }
    );
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return [];
  }
}

/**
 * 出勤
 */
export async function clockIn(): Promise<AttendanceRecord> {
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'clock_in' }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '出勤に失敗しました');
  }

  const result = await response.json();
  return result.data;
}

/**
 * 退勤
 */
export async function clockOut(breakDuration: number = 0): Promise<AttendanceRecord> {
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'clock_out', breakDuration }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '退勤に失敗しました');
  }

  const result = await response.json();
  return result.data;
}

/**
 * 休憩時間を更新
 */
export async function updateBreakDuration(
  breakDuration: number
): Promise<AttendanceRecord> {
  const response = await fetch('/api/attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'update_break', breakDuration }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '休憩時間の更新に失敗しました');
  }

  const result = await response.json();
  return result.data;
}

/**
 * 統計情報を計算
 */
export function calculateStats(records: AttendanceRecord[]): AttendanceStats {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const currentWeekStart = new Date(now);
  currentWeekStart.setDate(now.getDate() - now.getDay());

  const completedRecords = records.filter(
    (r) => r.clock_out !== null && r.total_work_hours !== null
  );

  const totalDays = completedRecords.length;
  const totalHours = completedRecords.reduce(
    (sum, r) => sum + (r.total_work_hours || 0),
    0
  );
  const averageHours = totalDays > 0 ? totalHours / totalDays : 0;

  const currentMonthRecords = completedRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return (
      recordDate.getMonth() === currentMonth &&
      recordDate.getFullYear() === currentYear
    );
  });

  const currentMonthHours = currentMonthRecords.reduce(
    (sum, r) => sum + (r.total_work_hours || 0),
    0
  );

  const currentWeekRecords = completedRecords.filter((r) => {
    const recordDate = new Date(r.date);
    return recordDate >= currentWeekStart;
  });

  const currentWeekHours = currentWeekRecords.reduce(
    (sum, r) => sum + (r.total_work_hours || 0),
    0
  );

  return {
    totalDays,
    totalHours,
    averageHours,
    currentMonthHours,
    currentWeekHours,
  };
}
