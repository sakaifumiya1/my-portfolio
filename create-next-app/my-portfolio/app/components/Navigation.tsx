'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

export default function Navigation() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              ホーム
            </Link>
            <Link
              href="/weekly"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/weekly')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              週次
            </Link>
            <Link
              href="/monthly"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/monthly')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              月次
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              プロフィール
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {user.user_metadata?.name || user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
