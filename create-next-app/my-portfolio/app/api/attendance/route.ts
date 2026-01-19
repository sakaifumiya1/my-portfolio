import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-client';
import { getServerUser } from '@/lib/auth';

/**
 * 認証チェックとユーザーID取得のヘルパー関数
 */
async function getAuthenticatedUserId(request: NextRequest): Promise<string | null> {
  try {
    const user = await getServerUser();
    return user?.id || null;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * GET: 勤怠記録の取得
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST: 出勤記録の作成・更新
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const body = await request.json();
    const { action, breakDuration } = body;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    if (action === 'clock_in') {
      // 今日の記録が既に存在するか確認
      const { data: existing } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (existing) {
        return NextResponse.json(
          { error: '既に出勤記録が存在します' },
          { status: 400 }
        );
      }

      // 新しい出勤記録を作成
      const { data, error } = await supabase
        .from('attendance_records')
        .insert({
          user_id: userId,
          date: today,
          clock_in: now,
          clock_out: null,
          break_duration: 0,
          total_work_hours: null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data });
    } else if (action === 'clock_out') {
      // 今日の記録を取得
      const { data: existing, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: '出勤記録が見つかりません' },
          { status: 404 }
        );
      }

      if (existing.clock_out) {
        return NextResponse.json(
          { error: '既に退勤記録が存在します' },
          { status: 400 }
        );
      }

      // 労働時間を計算
      const clockIn = new Date(existing.clock_in);
      const clockOut = new Date(now);
      const workMinutes =
        (clockOut.getTime() - clockIn.getTime()) / 1000 / 60 -
        (breakDuration || existing.break_duration || 0);
      const workHours = workMinutes / 60;

      // 退勤記録を更新
      const { data, error } = await supabase
        .from('attendance_records')
        .update({
          clock_out: now,
          break_duration: breakDuration || existing.break_duration || 0,
          total_work_hours: Math.max(0, workHours),
          updated_at: now,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data });
    } else if (action === 'update_break') {
      // 休憩時間を更新
      const { data: existing, error: fetchError } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', userId)
        .eq('date', today)
        .single();

      if (fetchError || !existing) {
        return NextResponse.json(
          { error: '出勤記録が見つかりません' },
          { status: 404 }
        );
      }

      const { data, error } = await supabase
        .from('attendance_records')
        .update({
          break_duration: breakDuration || 0,
          updated_at: now,
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ data });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
