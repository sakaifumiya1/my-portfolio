'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || '不明なエラーが発生しました';
      
      if (errorMessage.includes('Supabase環境変数')) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                環境変数が設定されていません
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Supabaseの環境変数が設定されていません。以下の手順で設定してください：
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>プロジェクトルートに <code className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">.env.local</code> ファイルを作成</li>
                <li>以下の内容を記述：
                  <pre className="bg-gray-100 dark:bg-zinc-700 p-4 rounded mt-2 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key_here`}
                  </pre>
                </li>
                <li>Supabaseダッシュボードの「Settings」→「API」から実際の値を取得</li>
                <li>開発サーバーを再起動（<code className="bg-gray-100 dark:bg-zinc-700 px-2 py-1 rounded">npm run dev</code>）</li>
              </ol>
              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>詳細な手順:</strong> プロジェクト内の <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">SETUP.md</code> または <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">README.md</code> を参照してください。
                </p>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              ページを再読み込み
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
