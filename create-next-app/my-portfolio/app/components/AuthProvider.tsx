'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-client';
import type { AuthUser } from '@/lib/auth';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const convertUser = (user: User | null): AuthUser | null => {
    if (!user) return null;
    return {
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata,
    };
  };

  const refreshUser = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(convertUser(user));
  };

  useEffect(() => {
    try {
      const supabase = createClient();

      // 初期ユーザー状態の取得
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(convertUser(user));
        setLoading(false);
      }).catch((error) => {
        console.error('Auth error:', error);
        setLoading(false);
      });

      // 認証状態の変更を監視
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(convertUser(session?.user ?? null));
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    await refreshUser();
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }

    // メール確認が必要な場合の処理
    if (data.user && !data.session) {
      throw new Error('確認メールを送信しました。メールボックスを確認してください。');
    }

    await refreshUser();
  };

  const signOut = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
