import { NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';
import { createClient } from '@supabase/supabase-js';

const CONTRATO_UMBRAL = Number(process.env.CONTRATO_UMBRAL ?? 1_000_000);
const SUBVENCION_UMBRAL = Number(process.env.SUBVENCION_UMBRAL ?? 500_000);

function fmtEUR(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace('.', ',')} MM€`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace('.', ',')} M€`;
  return `${Math.round(n).toLocaleString('es-ES')} €`;
}

function tweetContrato(c: Record<string, unknown>): string {
  const estado = c.estado === 'adjudicado' ? '✅ ADJUDICADO' : '📋 LICITACIÓN';
  const adjudicatario = c.adjudicatario ? `\n🏢 Adjudicatario: ${c.adjudicatario}` : '';
  return [
    `${estado} — ${fmtEUR(c.importe as number)}`,
    ``,
    `📌 ${(c.titulo as string).slice(0, 120)}${(c.titulo as string).length > 120 ? '…' : ''}`,
    `🏛️ ${(c.organo_contratante as string).slice(0, 60)}`,
    adjudicatario,
    ``,
    `💰 Tu dinero. Datos oficiales PLACE.`,
    ``,
    (c.enlace as string) ?? 'https://gastopublico.es/contratos',
    ``,
    `#GastoPublico #Contratos #Transparencia`,
  ].filter(l => l !== undefined).join('\n').slice(0, 280);
}

function tweetSubvencion(s: Record<string, unknown>): string {
  return [
    `💸 SUBVENCIÓN — ${fmtEUR(s.importe as number)}`,
    ``,
    `📌 ${(s.descripcion as string).slice(0, 100)}${(s.descripcion as string).length > 100 ? '…' : ''}`,
    `🏛️ Convocante: ${(s.convocante as string).slice(0, 60)}`,
    `🏢 Beneficiario: ${(s.beneficiario as string).slice(0, 60)}`,
    ``,
    `💰 Datos oficiales BDNS.`,
    ``,
    (s.enlace as string) ?? 'https://gastopublico.es/subvenciones',
    ``,
    `#GastoPublico #Subvenciones #Transparencia`,
  ].join('\n').slice(0, 280);
}

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const xKeys = [
    process.env.X_API_KEY,
    process.env.X_API_SECRET,
    process.env.X_ACCESS_TOKEN,
    process.env.X_ACCESS_TOKEN_SECRET,
  ];
  if (xKeys.some(k => !k)) {
    return NextResponse.json({ skipped: true, reason: 'X API keys not configured' });
  }

  const twitter = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_TOKEN_SECRET!,
  });

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  );

  let contratos = 0;
  let subvenciones = 0;

  const { data: cRows } = await supabase
    .from('contratos')
    .select('*')
    .gte('importe', CONTRATO_UMBRAL)
    .is('tweeted_at', null)
    .order('fecha_publicacion', { ascending: false })
    .limit(5);

  for (const row of cRows ?? []) {
    try {
      await twitter.v2.tweet(tweetContrato(row));
      await supabase.from('contratos').update({ tweeted_at: new Date().toISOString() }).eq('id', row.id);
      contratos++;
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error('Error tweet contrato', row.id, e);
    }
  }

  const { data: sRows } = await supabase
    .from('subvenciones')
    .select('*')
    .gte('importe', SUBVENCION_UMBRAL)
    .is('tweeted_at', null)
    .order('fecha_concesion', { ascending: false })
    .limit(3);

  for (const row of sRows ?? []) {
    try {
      await twitter.v2.tweet(tweetSubvencion(row));
      await supabase.from('subvenciones').update({ tweeted_at: new Date().toISOString() }).eq('id', row.id);
      subvenciones++;
      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.error('Error tweet subvencion', row.id, e);
    }
  }

  return NextResponse.json({ ok: true, contratos, subvenciones });
}
