'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase, type Task } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function TasksPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 認証状態を確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login')
        return
      }
      setUser(session.user)
      fetchTasks(session.user.id)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth/login')
      } else {
        setUser(session.user)
        fetchTasks(session.user.id)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const fetchTasks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error: any) {
      console.error('タスクの取得に失敗しました:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('このタスクを削除しますか？')) return

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)

      if (error) throw error

      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error: any) {
      alert('タスクの削除に失敗しました: ' + error.message)
    }
  }

  const handleToggleComplete = async (task: Task) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', task.id)

      if (error) throw error

      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      )
    } catch (error: any) {
      alert('タスクの更新に失敗しました: ' + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">タスク管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                プロフィール
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/tasks/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              新しいタスクを追加
            </Link>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">タスクがありません</p>
              <p className="text-gray-400 text-sm mt-2">
                新しいタスクを追加してみましょう
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-white rounded-lg shadow p-6 ${
                    task.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 ${
                          task.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm mb-4">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-400">
                        {new Date(task.created_at).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          task.completed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.completed ? '完了' : '未完了'}
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
