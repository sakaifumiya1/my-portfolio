'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';

type AuthMode = 'signin' | 'signup';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        router.push('/');
        router.refresh();
      } else {
        await signUp(email, password, name);
        // サインアップ成功時は自動的にログインされる場合と、メール確認が必要な場合がある
        // 少し待ってからユーザー状態を確認
        await new Promise(resolve => setTimeout(resolve, 1000));
        // ユーザーがログイン済みの場合はリダイレクト
        if (user) {
          router.push('/');
          router.refresh();
        }
        // メール確認が必要な場合はエラーメッセージが表示される
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました';
      setError(errorMessage);
      // メール確認メッセージの場合は成功として扱う
      if (errorMessage.includes('確認メール')) {
        setTimeout(() => {
          setError('');
          setMode('signin');
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
          {mode === 'signin' ? 'ログイン' : '新規登録'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                名前
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="山田太郎"
                required={mode === 'signup'}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              パスワード
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
              minLength={6}
            />
            {mode === 'signup' && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                パスワードは6文字以上で入力してください
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? '処理中...'
              : mode === 'signin'
                ? 'ログイン'
                : '新規登録'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {mode === 'signin'
              ? 'アカウントをお持ちでない方はこちら'
              : '既にアカウントをお持ちの方はこちら'}
          </button>
        </div>
      </div>
    </div>
  );
}
