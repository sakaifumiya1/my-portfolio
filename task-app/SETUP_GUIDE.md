# Supabase設定ガイド

このガイドでは、Supabaseのプロジェクト作成からデータベース設定までの手順を詳しく説明します。

## 1. Supabaseアカウントの作成

1. [https://supabase.com](https://supabase.com) にアクセス
2. 「Start your project」または「Sign up」をクリック
3. GitHubアカウントでサインアップ（推奨）またはメールアドレスで登録

## 2. プロジェクトの作成

1. ダッシュボードで「New Project」をクリック
2. 以下の情報を入力：
   - **Name**: プロジェクト名（例: `task-app`）
   - **Database Password**: データベースのパスワード（安全なパスワードを設定）
   - **Region**: 最寄りのリージョンを選択（例: `Northeast Asia (Tokyo)`）
3. 「Create new project」をクリック
4. プロジェクトの作成が完了するまで待機（1-2分程度）

## 3. APIキーの取得

1. プロジェクトのダッシュボードで「Settings」（歯車アイコン）をクリック
2. 左メニューから「API」を選択
3. 以下の情報をコピー：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` に設定
   - **anon public** キー → `NEXT_PUBLIC_SUPABASE_ANON_KEY` に設定

## 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **重要**: `.env.local` ファイルはGitにコミットしないでください（`.gitignore`に含まれています）

## 5. データベーステーブルの作成

1. Supabaseダッシュボードで「SQL Editor」をクリック
2. 「New query」をクリック
3. 以下のSQLをコピー＆ペースト：

```sql
-- タスクテーブルの作成
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security (RLS) を有効化
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- ポリシー: ユーザーは自分のタスクのみ閲覧可能
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

-- ポリシー: ユーザーは自分のタスクのみ作成可能
CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ポリシー: ユーザーは自分のタスクのみ更新可能
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- ポリシー: ユーザーは自分のタスクのみ削除可能
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- updated_atを自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_atを自動更新するトリガー
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

4. 「Run」ボタンをクリック（または `Ctrl+Enter` / `Cmd+Enter`）
5. 「Success. No rows returned」と表示されれば成功

## 6. 認証設定の確認

1. ダッシュボードで「Authentication」をクリック
2. 「Providers」で「Email」が有効になっているか確認（デフォルトで有効）
3. 必要に応じて「Enable email confirmations」の設定を変更
   - 開発中は無効にしておくと便利です

## 7. 動作確認

1. 開発サーバーを起動：
   ```bash
   npm run dev
   ```

2. ブラウザで [http://localhost:3000](http://localhost:3000) を開く

3. 新規登録ページでアカウントを作成

4. タスクを追加して動作を確認

## トラブルシューティング

### エラー: "relation 'tasks' does not exist"

- SQL Editorでテーブルが正しく作成されているか確認
- 「Table Editor」で `tasks` テーブルが表示されるか確認

### エラー: "new row violates row-level security policy"

- Row Level Securityポリシーが正しく設定されているか確認
- ログインしているユーザーのIDが正しく取得できているか確認

### 認証エラー

- 環境変数が正しく設定されているか確認
- Supabaseのプロジェクトがアクティブか確認
- ブラウザのコンソールでエラーメッセージを確認

## 次のステップ

- [Supabase公式ドキュメント](https://supabase.com/docs) でより詳しい機能を学ぶ
- リアルタイム機能を追加する（Supabase Realtime）
- ストレージ機能を使ってファイルアップロードを実装する
