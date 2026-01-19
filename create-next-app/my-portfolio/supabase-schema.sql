-- 勤怠記録テーブル
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  clock_in TIMESTAMPTZ NOT NULL,
  clock_out TIMESTAMPTZ,
  break_duration INTEGER NOT NULL DEFAULT 0,
  total_work_hours NUMERIC(5, 2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_id ON attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_date ON attendance_records(date DESC);
CREATE INDEX IF NOT EXISTS idx_attendance_records_user_date ON attendance_records(user_id, date DESC);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_atトリガー
CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) の設定
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON attendance_records;

-- 認証済みユーザーが自分のデータのみ読み取り可能
CREATE POLICY "Users can view their own attendance records" ON attendance_records
  FOR SELECT
  USING (auth.uid() = user_id);

-- 認証済みユーザーが自分のデータのみ挿入可能
CREATE POLICY "Users can insert their own attendance records" ON attendance_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 認証済みユーザーが自分のデータのみ更新可能
CREATE POLICY "Users can update their own attendance records" ON attendance_records
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 認証済みユーザーが自分のデータのみ削除可能（オプション）
CREATE POLICY "Users can delete their own attendance records" ON attendance_records
  FOR DELETE
  USING (auth.uid() = user_id);
