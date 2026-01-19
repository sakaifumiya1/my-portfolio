/**
 * Supabaseデータベースの型定義
 * 実際のSupabaseスキーマに合わせて調整してください
 */

export interface Database {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          clock_in: string;
          clock_out: string | null;
          break_duration: number;
          total_work_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          clock_in: string;
          clock_out?: string | null;
          break_duration?: number;
          total_work_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          clock_in?: string;
          clock_out?: string | null;
          break_duration?: number;
          total_work_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
