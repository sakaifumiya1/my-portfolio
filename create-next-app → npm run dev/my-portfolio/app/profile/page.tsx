'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../components/AuthProvider';
import { updateUserMetadata, updatePassword } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameSuccess, setNameSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || '');
    }
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess(false);
    setLoading(true);

    try {
      await updateUserMetadata({ name });
      await refreshUser();
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (error) {
      setNameError(
        error instanceof Error ? error.message : '名前の更新に失敗しました'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError('新しいパスワードが一致しません');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : 'パスワードの更新に失敗しました'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              プロフィール
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              アカウント情報の管理
            </p>
          </header>

          {/* ユーザー情報 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              アカウント情報
            </h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  メールアドレス:
                </span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">
                  {user?.email}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  名前:
                </span>
                <span className="ml-2 text-gray-800 dark:text-gray-200">
                  {user?.user_metadata?.name || '未設定'}
                </span>
              </div>
            </div>
          </div>

          {/* 名前変更 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              名前の変更
            </h2>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  表示名
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="山田太郎"
                />
              </div>

              {nameError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {nameError}
                </div>
              )}

              {nameSuccess && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm">
                  名前を更新しました
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '更新中...' : '名前を更新'}
              </button>
            </form>
          </div>

          {/* パスワード変更 */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              パスワードの変更
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  新しいパスワード
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  パスワードは6文字以上で入力してください
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  新しいパスワード（確認）
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              {passwordError && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg text-green-700 dark:text-green-300 text-sm">
                  パスワードを更新しました
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '更新中...' : 'パスワードを更新'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
