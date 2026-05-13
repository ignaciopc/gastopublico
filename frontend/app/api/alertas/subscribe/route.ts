import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';
import type { AlertSubscriptionRow } from '@/lib/supabase';

export const runtime = 'nodejs';

const VALID_TIPOS = ['contratos_grandes', 'subvenciones_destacadas', 'resumen_semanal'];

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { email, tipos, umbral_importe } = body as Record<string, unknown>;

  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }

  const tiposArr: string[] = Array.isArray(tipos) && tipos.length > 0
    ? tipos.filter((t): t is string => typeof t === 'string' && VALID_TIPOS.includes(t))
    : ['contratos_grandes'];

  if (tiposArr.length === 0) {
    return NextResponse.json({ error: 'Selecciona al menos un tipo de alerta' }, { status: 400 });
  }

  const umbral = typeof umbral_importe === 'number' && umbral_importe > 0
    ? umbral_importe
    : 1_000_000;

  let supabaseClient;
  try {
    supabaseClient = getServerSupabase();
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 });
  }

  // Check if already subscribed
  const { data: existing } = await supabaseClient
    .from('alert_subscriptions')
    .select('id, activa, email')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (existing) {
    if (existing.activa) {
      return NextResponse.json({ message: 'Ya estás suscrito con este email.' }, { status: 200 });
    }
    // Reactivate
    await supabaseClient
      .from('alert_subscriptions')
      .update({ activa: true, tipos: tiposArr, umbral_importe: umbral, updated_at: new Date().toISOString() })
      .eq('email', email.toLowerCase());

    await sendConfirmationEmail(email, tiposArr);
    return NextResponse.json({ message: 'Suscripción reactivada. Recibirás un email de confirmación.' }, { status: 200 });
  }

  const row: AlertSubscriptionRow = {
    email: email.toLowerCase(),
    tipos: tiposArr,
    umbral_importe: umbral,
    activa: true,
  };

  const { error: insertError } = await supabaseClient
    .from('alert_subscriptions')
    .insert(row);

  if (insertError) {
    console.error('Error inserting subscription:', insertError);
    return NextResponse.json({ error: 'No se pudo guardar la suscripción. Inténtalo de nuevo.' }, { status: 500 });
  }

  await sendConfirmationEmail(email, tiposArr);

  return NextResponse.json({
    message: 'Suscripción registrada. Recibirás un email de confirmación.',
  }, { status: 201 });
}

async function sendConfirmationEmail(email: string, tipos: string[]) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const { Resend } = await import('resend');
  const resend = new Resend(resendKey);

  const tiposLabels: Record<string, string> = {
    contratos_grandes: 'Contratos públicos > 1 M€',
    subvenciones_destacadas: 'Subvenciones destacadas',
    resumen_semanal: 'Resumen semanal de gasto',
  };

  const listaAlertas = tipos.map(t => `• ${tiposLabels[t] ?? t}`).join('\n');

  // Get unsubscribe token
  let unsubToken = '';
  try {
    const sb = getServerSupabase();
    const { data } = await sb.from('alert_subscriptions').select('token').eq('email', email).maybeSingle();
    unsubToken = data?.token ?? '';
  } catch { /* noop */ }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://gastopublico.es';
  const unsubLink = `${baseUrl}/api/alertas/unsubscribe?token=${unsubToken}`;

  await resend.emails.send({
    from: 'GastoPúblico.es <alertas@gastopublico.es>',
    to: email,
    subject: '✅ Suscripción a alertas confirmada — GastoPúblico.es',
    text: [
      `Hola,`,
      ``,
      `Has activado las siguientes alertas en GastoPúblico.es:`,
      listaAlertas,
      ``,
      `Te avisaremos en cuanto haya novedades relevantes.`,
      ``,
      `Para cancelar la suscripción en cualquier momento: ${unsubLink}`,
      ``,
      `— GastoPúblico.es`,
    ].join('\n'),
  }).catch(() => {});
}
