import { createBrowserClient } from '@supabase/ssr';
import { createServerClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.error('Please create .env.local file with:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

/**
 * クライアント側で使用するSupabaseクライアント
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase環境変数が設定されていません。.env.localファイルを作成してNEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを設定してください。'
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * サーバー側で使用するSupabaseクライアント
 */
export async function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Supabase環境変数が設定されていません。.env.localファイルを作成してNEXT_PUBLIC_SUPABASE_URLとNEXT_PUBLIC_SUPABASE_ANON_KEYを設定してください。'
    );
  }
  
  // cookiesはサーバー側でのみ使用可能なので、関数内で動的にインポート
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
