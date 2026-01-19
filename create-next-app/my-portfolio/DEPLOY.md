# デプロイガイド

このドキュメントでは、勤怠管理アプリをGitHubとVercelにデプロイする手順を説明します。

## 前提条件

- GitHubアカウント
- Vercelアカウント（GitHubアカウントでサインアップ可能）
- Supabaseプロジェクトが作成済みであること

## ステップ1: GitHubリポジトリの作成

### 1.1 GitHubでリポジトリを作成

1. [GitHub](https://github.com)にログイン
2. 右上の「+」アイコンをクリック → 「New repository」を選択
3. リポジトリ情報を入力：
   - **Repository name**: `attendance-app`（任意の名前）
   - **Description**: `シンプルでUI重視の勤怠記録アプリケーション`
   - **Visibility**: Public または Private を選択
   - **Initialize this repository with**: チェックを外す（既存のコードをプッシュするため）
4. 「Create repository」をクリック

### 1.2 ローカルリポジトリを初期化

プロジェクトディレクトリで以下を実行：

```bash
# Gitリポジトリを初期化
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "Initial commit: 勤怠管理アプリ"

# リモートリポジトリを追加（GitHubで作成したリポジトリのURLに置き換える）
git remote add origin https://github.com/your-username/attendance-app.git

# メインブランチにプッシュ
git branch -M main
git push -u origin main
```

**注意**: `your-username`を実際のGitHubユーザー名に、`attendance-app`を実際のリポジトリ名に置き換えてください。

## ステップ2: Vercelへのデプロイ

### 2.1 Vercelアカウントの作成

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」をクリック
3. 「Continue with GitHub」を選択してGitHubアカウントでサインアップ

### 2.2 プロジェクトのインポート

1. Vercelダッシュボードで「Add New...」→「Project」をクリック
2. GitHubリポジトリを選択（`attendance-app`など）
3. 「Import」をクリック

### 2.3 プロジェクト設定

1. **Framework Preset**: Next.js（自動検出されるはず）
2. **Root Directory**: `./`（そのまま）
3. **Build Command**: `npm run build`（自動設定）
4. **Output Directory**: `.next`（自動設定）

### 2.4 環境変数の設定（重要）

「Environment Variables」セクションで以下を追加：

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: SupabaseのProject URL（例: `https://jmhvespkoyywoonepuqe.supabase.co`）

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Supabaseのanon public key（`eyJ...`で始まる長い文字列）

**重要**: 環境変数を設定しないと、デプロイ後にアプリが動作しません。

### 2.5 デプロイ実行

1. 「Deploy」ボタンをクリック
2. デプロイが完了するまで待機（1-2分）
3. デプロイ完了後、URLが表示されます（例: `https://attendance-app.vercel.app`）

## ステップ3: Supabaseの設定（本番環境用）

### 3.1 URL設定

1. Supabaseダッシュボードで「Authentication」→「URL Configuration」を開く
2. 「Site URL」にVercelのデプロイURLを設定（例: `https://attendance-app.vercel.app`）
3. 「Redirect URLs」に以下を追加：
   - `https://attendance-app.vercel.app/**`
   - `https://attendance-app.vercel.app/login`
4. 「Save」をクリック

## ステップ4: 動作確認

1. デプロイされたURLにアクセス（例: `https://attendance-app.vercel.app`）
2. ログインページが表示されることを確認
3. 新規アカウントを作成してログイン
4. 各機能をテスト：
   - 出勤・退勤
   - 休憩時間の記録
   - 週次・月次ページの表示
   - プロフィールの編集

## トラブルシューティング

### デプロイ後にエラーが発生する場合

1. **環境変数の確認**
   - Vercelダッシュボード → プロジェクト → Settings → Environment Variables
   - 環境変数が正しく設定されているか確認

2. **ビルドログの確認**
   - Vercelダッシュボード → プロジェクト → Deployments
   - 最新のデプロイメントをクリックしてログを確認

3. **Supabaseの設定確認**
   - URL Configurationが正しく設定されているか確認
   - RLSポリシーが正しく設定されているか確認

### よくあるエラー

- **"Missing Supabase environment variables"**: 環境変数が設定されていない
- **"認証が必要です"**: Supabaseの認証設定が正しくない
- **"Invalid API key"**: anon keyが間違っている

## 今後の更新

コードを更新した場合：

```bash
# 変更をコミット
git add .
git commit -m "Update: 機能追加など"

# GitHubにプッシュ
git push origin main
```

Vercelは自動的に新しいデプロイを開始します。
