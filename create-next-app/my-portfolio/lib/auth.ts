import { createClient } from './supabase-client';
import { createServerSupabaseClient } from './supabase-client';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

/**
 * クライアント側: 現在のユーザーを取得
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    user_metadata: user.user_metadata,
  };
}

/**
 * クライアント側: サインアップ
 */
export async function signUp(email: string, password: string, name?: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || '',
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * クライアント側: ログイン
 */
export async function signIn(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * クライアント側: ログアウト
 */
export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * クライアント側: パスワード更新
 */
export async function updatePassword(newPassword: string) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * クライアント側: ユーザー情報更新
 */
export async function updateUserMetadata(updates: { name?: string }) {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: updates,
  });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * サーバー側: 現在のユーザーを取得
 */
export async function getServerUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email || '',
    user_metadata: user.user_metadata,
  };
}
