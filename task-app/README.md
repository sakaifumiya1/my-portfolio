# タスク管理アプリ

SupabaseとNext.jsを使用したタスク管理アプリケーションです。

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript** (必須)
- **Tailwind CSS**
- **Supabase** (認証・データベース)

## 機能

- ✅ ユーザー認証（サインアップ・ログイン・ログアウト）
- ✅ タスクの作成・一覧表示・削除
- ✅ タスクの完了/未完了の切り替え
- ✅ ユーザーごとのデータ管理（Row Level Security）
- ✅ 複数ページの画面遷移

## セットアップ手順

### 1. 必要な環境

- Node.js 18以上
- npm または yarn
- Supabaseアカウント（無料プランでOK）

### 2. 依存関係のインストール

```bash
cd task-app
npm install
```

または

```bash
cd task-app
yarn install
```

### 3. Supabaseの設定

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成（またはログイン）
2. 新しいプロジェクトを作成
3. プロジェクトの「Settings」→「API」ページから以下を取得：
   - Project URL
   - anon/public key

### 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を記入：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. データベースのセットアップ

Supabaseのダッシュボードで以下を実行：

1. 「SQL Editor」を開く
2. `supabase/migrations/001_create_tasks_table.sql` の内容をコピー＆ペースト
3. 「Run」ボタンをクリックして実行

これで `tasks` テーブルとRow Level Securityポリシーが作成されます。

### 6. 開発サーバーの起動

```bash
npm run dev
```

または

```bash
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## ページ構成

- `/` - ルートページ（認証状態に応じてリダイレクト）
- `/auth/login` - ログインページ
- `/auth/signup` - 新規登録ページ
- `/tasks` - タスク一覧ページ
- `/tasks/new` - タスク追加ページ
- `/profile` - プロフィールページ

## プロジェクト構造

```
task-app/
├── app/                    # Next.js App Router
│   ├── auth/              # 認証関連ページ
│   │   ├── login/
│   │   └── signup/
│   ├── tasks/             # タスク関連ページ
│   │   ├── new/
│   │   └── page.tsx
│   ├── profile/           # プロフィールページ
│   ├── layout.tsx         # ルートレイアウト
│   ├── page.tsx           # ルートページ
│   └── globals.css        # グローバルスタイル
├── lib/
│   └── supabase.ts        # Supabaseクライアント設定
├── supabase/
│   └── migrations/        # データベースマイグレーション
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## デプロイ

### Vercelへのデプロイ（推奨）

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubにリポジトリをプッシュ
3. Vercelでプロジェクトをインポート
4. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. デプロイ

### その他のプラットフォーム

Next.jsアプリケーションなので、以下のプラットフォームでもデプロイ可能です：
- Netlify
- AWS Amplify
- Railway
- その他Next.jsをサポートするプラットフォーム

## よくある問題と解決方法

### 環境変数が読み込まれない

- `.env.local` ファイルがプロジェクトルートにあるか確認
- ファイル名が正確か確認（`.env.local`）
- 開発サーバーを再起動

### Supabaseの接続エラー

- Supabaseのプロジェクトがアクティブか確認
- API URLとキーが正しいか確認
- Supabaseのダッシュボードでプロジェクトの状態を確認

### データベースエラー

- `tasks` テーブルが作成されているか確認
- Row Level Securityポリシーが正しく設定されているか確認
- SQL Editorでエラーがないか確認

## ライセンス

このプロジェクトは学習目的で作成されています。

## 参考リンク

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs)
