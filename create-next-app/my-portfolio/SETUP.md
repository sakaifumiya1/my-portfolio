# セットアップガイド

このドキュメントでは、勤怠管理アプリのセットアップ手順を詳しく説明します。

## 前提条件

- Node.js 18以上がインストールされていること
- npmまたはyarnがインストールされていること
- Supabaseアカウント（無料で作成可能）

## ステップ1: 依存関係のインストール

```bash
npm install
```

## ステップ2: Supabaseプロジェクトの作成

### 2.1 アカウント作成とプロジェクト作成

1. [Supabase](https://supabase.com)にアクセス
2. 「Start your project」をクリックしてアカウントを作成（GitHubアカウントでサインアップ可能）
3. 「New Project」をクリック
4. 以下の情報を入力：
   - **Organization**: 組織を選択または作成
   - **Name**: プロジェクト名（例: `attendance-app`）
   - **Database Password**: 強力なパスワードを設定（忘れないように保存）
   - **Region**: 最寄りのリージョンを選択
   - **Pricing Plan**: Freeプランを選択

5. 「Create new project」をクリック（数分かかります）

### 2.2 データベーススキーマの作成

1. Supabaseダッシュボードで、左メニューから「SQL Editor」をクリック
2. 「New query」をクリック
3. プロジェクト内の `supabase-schema.sql` ファイルを開く
4. ファイルの内容をすべてコピー
5. SQL Editorに貼り付け
6. 「Run」ボタンをクリック（または `Cmd+Enter` / `Ctrl+Enter`）
7. 成功メッセージが表示されることを確認

### 2.3 認証設定の有効化

1. 左メニューから「Authentication」→「Providers」をクリック
2. 「Email」プロバイダーを探す
3. 「Enable Email provider」をONにする
4. 「Enable Email Signup」をONにする
5. （開発環境の場合）「Confirm email」をOFFにする（メール確認をスキップ）
6. 「Save」をクリック

### 2.4 API認証情報の取得

1. 左メニューから「Settings」→「API」をクリック
2. 以下の情報をコピー（後で使用します）：
   - **Project URL**: `https://xxxxx.supabase.co` の形式
   - **anon public key**: 長い文字列（`eyJ...` で始まる）

## ステップ3: 環境変数の設定

1. プロジェクトルートに `.env.local` ファイルを作成：

```bash
# macOS/Linuxの場合
touch .env.local

# Windowsの場合
type nul > .env.local
```

2. `.env.local` ファイルを開き、以下を記述：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
```

**重要**: 
- `https://xxxxx.supabase.co` を実際のProject URLに置き換える
- `your_anon_public_key_here` を実際のanon public keyに置き換える
- 引用符（`"`）は不要です

3. ファイルを保存

## ステップ4: 開発サーバーの起動

```bash
npm run dev
```

ターミナルに以下のようなメッセージが表示されます：

```
  ▲ Next.js 16.1.3
  - Local:        http://localhost:3000
```

## ステップ5: 動作確認

### 5.1 ログインページの確認

1. ブラウザで [http://localhost:3000/login](http://localhost:3000/login) を開く
2. 「新規登録」タブまたは「アカウントをお持ちでない方はこちら」をクリック
3. 以下の情報を入力：
   - **名前**: 任意の名前（例: `テストユーザー`）
   - **メールアドレス**: 有効なメールアドレス（例: `test@example.com`）
   - **パスワード**: 6文字以上のパスワード
4. 「新規登録」をクリック
5. ホームページにリダイレクトされることを確認

### 5.2 各ページの確認

- **ホームページ** (`/`): 出勤・退勤機能、統計情報、履歴表示
- **週次ページ** (`/weekly`): 週単位の勤怠状況
- **月次ページ** (`/monthly`): 月単位の勤怠状況
- **プロフィールページ** (`/profile`): 名前変更、パスワード変更

### 5.3 機能テスト

1. **出勤・退勤テスト**:
   - ホームページで「出勤」ボタンをクリック
   - 現在時刻が記録されることを確認
   - 「退勤」ボタンをクリック
   - 労働時間が計算されることを確認

2. **休憩時間テスト**:
   - 出勤後、「休憩開始」をクリック
   - 休憩時間がカウントされることを確認
   - 「休憩終了」をクリック
   - 休憩時間が記録されることを確認

3. **履歴確認**:
   - 週次ページまたは月次ページで記録が表示されることを確認

4. **プロフィール更新**:
   - プロフィールページで名前を変更
   - パスワードを変更（6文字以上）

## トラブルシューティング

### エラー: "Missing Supabase environment variables"

- `.env.local` ファイルが正しく作成されているか確認
- 環境変数の値が正しいか確認
- 開発サーバーを再起動

### エラー: "認証が必要です" または 401エラー

- Supabaseの認証設定が正しく有効化されているか確認
- RLSポリシーが正しく設定されているか確認（SQL Editorで確認）

### データが表示されない

- Supabaseダッシュボードの「Table Editor」で `attendance_records` テーブルにデータが存在するか確認
- RLSポリシーが正しく設定されているか確認

### ログインできない

- メールアドレスとパスワードが正しいか確認
- Supabaseの「Authentication」→「Users」でユーザーが作成されているか確認
- メール確認が有効な場合、メールを確認してアカウントを有効化

## 次のステップ

セットアップが完了したら、以下を試してみてください：

1. 複数のユーザーでテスト（各ユーザーのデータが分離されていることを確認）
2. CSVエクスポート機能のテスト
3. 月次・週次ビューの切り替えテスト
4. ダークモードの切り替え（ブラウザの設定から）

## サポート

問題が発生した場合は、以下を確認してください：

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- プロジェクトのREADME.md
