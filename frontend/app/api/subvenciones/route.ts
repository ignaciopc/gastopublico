import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getBdnsSeedData, fetchBdnsConcesiones } from '@/lib/data/bdns';
import { cacheGet, cacheSet } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_KEY = 'subvenciones-2024';
const EJERCICIO = 2024;

interface SubvencionesPayload {
  stats: {
    label: string;
    value: string;
    delta: string;
    bad: boolean;
  }[];
  top: {
    rank: number;
    beneficiario: string;
    concepto: string;
    organismo: string;
    importe: number;
  }[];
  porTipo: {
    tipo: string;
    pct: number;
    color: string;
  }[];
  meta: {
    lastUpdated: string;
    source: string;
    ejercicio: number;
  };
}

function fmtImporte(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + ' bn€';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M€';
  return n.toLocaleString('es-ES') + ' €';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const tipo = searchParams.get('tipo')?.trim() ?? '';
  const all = searchParams.get('all') === '1';

  // Search mode: query Supabase directly, return up to 100 results
  if (q || tipo || all) {
    try {
      let query = supabase
        .from('subvenciones')
        .select('beneficiario, importe, descripcion, organo_concedente, tipo_beneficiario')
        .eq('ejercicio', EJERCICIO)
        .order('importe', { ascending: false })
        .limit(100);

      if (q) {
        query = query.or(`beneficiario.ilike.%${q}%,descripcion.ilike.%${q}%`);
      }
      if (tipo) {
        query = query.eq('tipo_beneficiario', tipo);
      }

      const { data: rows, error } = await query;
      if (error) throw error;

      const data = (rows ?? []).map((r, i) => ({
        rank: i + 1,
        beneficiario: r.beneficiario,
        concepto: r.descripcion ?? '—',
        organismo: r.organo_concedente ?? '—',
        tipo_beneficiario: r.tipo_beneficiario ?? '—',
        importe: Number(r.importe),
      }));

      return NextResponse.json({ data, source: 'Supabase', total: data.length });
    } catch {
      return NextResponse.json({ data: [], source: 'error', total: 0 }, { status: 500 });
    }
  }

  // 1. Check memory cache
  const cached = cacheGet<SubvencionesPayload>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  // 2. Try Supabase (populated by cron)
  try {
    const [{ data: topRows }, { data: statsRow }] = await Promise.all([
      supabase
        .from('subvenciones')
        .select('beneficiario, importe, descripcion, organo_concedente')
        .eq('ejercicio', EJERCICIO)
        .order('importe', { ascending: false })
        .limit(8),
      supabase
        .from('subvenciones_stats')
        .select('*')
        .eq('ejercicio', EJERCICIO)
        .single(),
    ]);

    if (topRows && topRows.length >= 3 && statsRow) {
      const payload = buildPayload(
        topRows.map((r, i) => ({
          rank: i + 1,
          beneficiario: r.beneficiario,
          concepto: r.descripcion ?? '—',
          organismo: r.organo_concedente ?? '—',
          importe: Number(r.importe),
        })),
        {
          totalImporte: Number(statsRow.total_importe),
          numConcesiones: statsRow.num_concesiones,
          importeMedio: Number(statsRow.importe_medio),
          pctTop100: Number(statsRow.pct_top100),
          porTipo: statsRow.por_tipo ?? [],
        },
        'Supabase / BDNS'
      );
      cacheSet(CACHE_KEY, payload, 6 * 60 * 60 * 1000);
      return NextResponse.json(payload);
    }
  } catch {
    // fall through
  }

  // 3. Try BDNS API directly
  try {
    const page = await fetchBdnsConcesiones(EJERCICIO, 0, 100);
    if (page.content.length > 0) {
      const top8 = page.content.slice(0, 8).map((r, i) => ({
        rank: i + 1,
        beneficiario: r.beneficiario,
        concepto: r.descripcion,
        organismo: r.organoConvocante,
        importe: r.importe,
      }));

      // Rough stats from the total count returned by BDNS
      const totalImporte = page.content.reduce((s, r) => s + r.importe, 0);
      const payload = buildPayload(top8, {
        totalImporte: page.totalElements > 0 ? totalImporte * (page.totalElements / page.content.length) : totalImporte,
        numConcesiones: page.totalElements,
        importeMedio: page.totalElements > 0 ? (totalImporte * (page.totalElements / page.content.length)) / page.totalElements : 0,
        pctTop100: 0,
        porTipo: [],
      }, 'BDNS (directo)');

      cacheSet(CACHE_KEY, payload, 30 * 60 * 1000); // 30min si es directo
      return NextResponse.json(payload);
    }
  } catch {
    // fall through to seed
  }

  // 4. Seed data (fallback garantizado)
  const seed = getBdnsSeedData(EJERCICIO);
  const payload = buildPayload(
    seed.top.map((r, i) => ({
      rank: i + 1,
      beneficiario: r.beneficiario,
      concepto: r.descripcion,
      organismo: r.organoConvocante,
      importe: r.importe,
    })),
    seed.stats,
    'Informe BDNS 2024 (Ministerio de Hacienda)'
  );
  cacheSet(CACHE_KEY, payload, 60 * 60 * 1000);
  return NextResponse.json(payload);
}

function buildPayload(
  top: { rank: number; beneficiario: string; concepto: string; organismo: string; importe: number }[],
  stats: { totalImporte: number; numConcesiones: number; importeMedio: number; pctTop100: number; porTipo: { tipo: string; pct: number; color: string }[] },
  source: string
): SubvencionesPayload {
  const porTipo = stats.porTipo.length > 0
    ? stats.porTipo
    : getBdnsSeedData(EJERCICIO).stats.porTipo;

  return {
    stats: [
      { label: 'Total concedido 2024', value: fmtImporte(stats.totalImporte), delta: '+8,2% vs. 2023', bad: true },
      { label: 'Nº concesiones', value: stats.numConcesiones > 0 ? stats.numConcesiones.toLocaleString('es-ES') : '—', delta: 'todas las AAPP', bad: false },
      { label: 'Importe medio', value: stats.importeMedio > 0 ? fmtImporte(stats.importeMedio) : '—', delta: 'por concesión', bad: false },
      {
        label: 'Top 100 perceptores',
        value: stats.pctTop100 > 0 ? stats.pctTop100.toFixed(1) + '%' : '17,3%',
        delta: 'del total nacional',
        bad: true,
      },
    ],
    top,
    porTipo,
    meta: {
      lastUpdated: new Date().toISOString(),
      source,
      ejercicio: EJERCICIO,
    },
  };
}
