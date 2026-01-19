# 勤怠管理アプリ

シンプルでUI重視の勤怠記録アプリケーションです。Next.js、TypeScript、Supabase、Tailwind CSSで構築されています。

## 機能

- ✅ ユーザー認証（サインアップ・ログイン・ログアウト）
- ✅ 出勤・退勤の記録
- ✅ 休憩時間の記録
- ✅ 勤務履歴の表示（日次・週次・月次）
- ✅ 統計情報の表示（総労働時間、平均労働時間など）
- ✅ CSV形式でのエクスポート
- ✅ プロフィール管理（名前変更、パスワード変更）
- ✅ ダークモード対応
- ✅ レスポンシブデザイン

## 技術スタック

- **フロントエンド**: Next.js 16.1.3 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **UI**: カスタムコンポーネント

## クイックスタート

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd my-portfolio
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseのセットアップ

1. **Supabaseプロジェクトの作成**
   - [Supabase](https://supabase.com)でアカウントを作成
   - 新しいプロジェクトを作成（プロジェクト名、データベースパスワードを設定）

2. **データベーススキーマの作成**
   - プロジェクトの「SQL Editor」を開く
   - `supabase-schema.sql` の内容をコピーして実行
   - テーブルとRLSポリシーが作成されます

3. **認証設定の有効化**
   - プロジェクトの「Authentication」→「Providers」を開く
   - 「Email」プロバイダーを有効化
   - 「Enable Email Signup」をONにする
   - （オプション）メール確認を無効化する場合は「Confirm email」をOFFにする

4. **API認証情報の取得**
   - プロジェクトの「Settings」→「API」を開く
   - 以下の情報をコピー：
     - **Project URL** (`https://xxxxx.supabase.co`)
     - **anon public key** (長い文字列)

### 4. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下を設定します：

```bash
# .env.local.exampleをコピー
cp .env.local.example .env.local

# ファイルを編集してSupabaseの認証情報を設定
# または、エディタで直接作成
```

`.env.local` ファイルの内容：

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here
```

**重要**: `.env.local` ファイルは `.gitignore` に含まれているため、Gitにコミットされません。

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

開発サーバーが起動すると、ターミナルに以下のようなメッセージが表示されます：

```
  ▲ Next.js 16.1.3
  - Local:        http://localhost:3000
```

### 6. 動作確認

1. **ログインページ**: [http://localhost:3000/login](http://localhost:3000/login)
   - 新規アカウントを作成（サインアップ）
   - または既存アカウントでログイン

2. **ホームページ**: [http://localhost:3000](http://localhost:3000)
   - 出勤・退勤の記録
   - 休憩時間の記録
   - 統計情報の確認

3. **週次ページ**: [http://localhost:3000/weekly](http://localhost:3000/weekly)
   - 週単位の勤怠状況を確認

4. **月次ページ**: [http://localhost:3000/monthly](http://localhost:3000/monthly)
   - 月単位の勤怠状況を確認

5. **プロフィールページ**: [http://localhost:3000/profile](http://localhost:3000/profile)
   - 名前の変更
   - パスワードの変更

## プロジェクト構造

```
my-portfolio/
├── app/
│   ├── components/              # UIコンポーネント
│   │   ├── ClockButton.tsx      # 出勤・退勤ボタン
│   │   ├── BreakTimer.tsx       # 休憩タイマー
│   │   ├── StatsCard.tsx        # 統計カード
│   │   ├── AttendanceHistory.tsx # 履歴表示
│   │   ├── ExportButton.tsx     # エクスポートボタン
│   │   ├── AuthForm.tsx         # 認証フォーム
│   │   ├── AuthProvider.tsx     # 認証プロバイダー
│   │   ├── ProtectedRoute.tsx   # 保護されたルート
│   │   ├── Navigation.tsx       # ナビゲーション
│   │   └── LayoutWrapper.tsx   # レイアウトラッパー
│   ├── api/
│   │   └── attendance/
│   │       └── route.ts         # API Routes（認証対応）
│   ├── login/
│   │   └── page.tsx            # ログインページ
│   ├── weekly/
│   │   └── page.tsx            # 週次ページ
│   ├── monthly/
│   │   └── page.tsx            # 月次ページ
│   ├── profile/
│   │   └── page.tsx            # プロフィールページ
│   ├── layout.tsx              # ルートレイアウト
│   ├── page.tsx                # メインページ（ホーム）
│   └── globals.css             # グローバルスタイル
├── lib/
│   ├── supabase.ts             # Supabaseクライアント（旧）
│   ├── supabase-client.ts      # Supabaseクライアント（SSR対応）
│   ├── auth.ts                 # 認証関連のユーティリティ関数
│   └── attendance.ts           # 勤怠関連のユーティリティ関数
├── types/
│   ├── attendance.ts           # 勤怠データの型定義
│   └── database.ts             # データベースの型定義
└── supabase-schema.sql         # Supabaseテーブル定義（RLS含む）
```

## ビルド

```bash
npm run build
npm start
```

## GitHubリポジトリの作成とプッシュ

### 1. GitHubでリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `attendance-app`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

### 2. ローカルリポジトリを初期化してプッシュ

```bash
# Gitリポジトリを初期化（まだの場合）
git init

# ファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: 勤怠管理アプリ"

# リモートリポジトリを追加（GitHubで作成したリポジトリのURLに置き換える）
git remote add origin https://github.com/your-username/attendance-app.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

## デプロイ

### Vercelへのデプロイ（推奨）

#### 方法1: Vercelダッシュボードからデプロイ

1. [Vercel](https://vercel.com)にログイン（GitHubアカウントでサインアップ可能）
2. 「Add New...」→「Project」をクリック
3. GitHubリポジトリをインポート
4. プロジェクト設定：
   - **Framework Preset**: Next.js（自動検出）
   - **Root Directory**: `./`（そのまま）
5. **環境変数の設定**（重要）：
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseのProject URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseのanon public key
6. 「Deploy」をクリック
7. デプロイ完了後、URLが表示されます（例: `https://your-app.vercel.app`）

#### 方法2: Vercel CLIを使用

```bash
# Vercel CLIでログイン
npx vercel login

# プロジェクトをデプロイ
npm run deploy

# または
npx vercel --prod
```

デプロイ時に環境変数の設定を求められるので、Supabaseの認証情報を入力してください。

### デプロイ後の確認事項

1. **環境変数の確認**: Vercelダッシュボードで環境変数が正しく設定されているか確認
2. **Supabaseの設定**: 本番環境のURLをSupabaseの「Authentication」→「URL Configuration」に追加
3. **動作確認**: デプロイされたURLにアクセスして動作確認

## トラブルシューティング

### よくある問題

1. **環境変数エラー**
   - `.env.local`ファイルが正しく作成されているか確認
   - 開発サーバーを再起動

2. **認証エラー**
   - SupabaseでEmail認証が有効化されているか確認
   - 「Confirm email」をOFFにする（開発環境の場合）

3. **データベースエラー**
   - SQLスキーマが正常に実行されたか確認
   - RLSポリシーが正しく設定されているか確認

## ライセンス

MIT
