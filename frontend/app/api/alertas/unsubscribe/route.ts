import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://gastopublico.es';

  if (!token || token.length < 10) {
    return NextResponse.redirect(`${baseUrl}/alertas?status=invalid`);
  }

  let sb;
  try {
    sb = getServerSupabase();
  } catch {
    return NextResponse.redirect(`${baseUrl}/alertas?status=error`);
  }

  // Verify token exists first
  const { data: existing } = await sb
    .from('alert_subscriptions')
    .select('email, activa')
    .eq('token', token)
    .maybeSingle();

  if (!existing) {
    return NextResponse.redirect(`${baseUrl}/alertas?status=not_found`);
  }

  // Already unsubscribed — still show success
  if (!existing.activa) {
    return NextResponse.redirect(`${baseUrl}/alertas?status=unsubscribed`);
  }

  await sb
    .from('alert_subscriptions')
    .update({ activa: false, updated_at: new Date().toISOString() })
    .eq('token', token);

  return NextResponse.redirect(`${baseUrl}/alertas?status=unsubscribed`);
}
