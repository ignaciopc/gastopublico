import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cacheGet, cacheSet } from '@/lib/cache';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_KEY = 'subvenciones-sincronizadas';
const PAGE = 1000;

export interface SubvencionesPayload {
  disponible: boolean;
  stats: { label: string; value: string; note: string }[];
  top: {
    rank: number;
    beneficiario: string;
    concepto: string;
    organismo: string;
    fecha: string | null;
    importe: number;
  }[];
  porNivel: { nivel: string; pct: number; importe: number; n: number }[];
  meta: {
    source: string;
    concesiones: number;
    fechaMin: string | null;
    fechaMax: string | null;
    ultimaSincronizacion: string | null;
  };
}

function fmtImporte(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' M€';
  return n.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' €';
}

function fmtFecha(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

function emptyPayload(): SubvencionesPayload {
  return {
    disponible: false,
    stats: [],
    top: [],
    porNivel: [],
    meta: { source: 'BDNS', concesiones: 0, fechaMin: null, fechaMax: null, ultimaSincronizacion: null },
  };
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
        .select('beneficiario, importe, descripcion, organo_concedente, tipo_beneficiario, fecha_concesion')
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
        fecha: r.fecha_concesion ?? null,
        importe: Number(r.importe),
      }));

      return NextResponse.json({ data, source: 'Supabase', total: data.length });
    } catch {
      return NextResponse.json({ data: [], source: 'error', total: 0 }, { status: 500 });
    }
  }

  const cached = cacheGet<SubvencionesPayload>(CACHE_KEY);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  // Aggregates are computed over the rows synced from BDNS into Supabase.
  // They describe only that subset, never the national total.
  try {
    const { count, error: countErr } = await supabase
      .from('subvenciones')
      .select('id', { count: 'exact', head: true });
    if (countErr || !count) throw countErr ?? new Error('sin filas');

    const offsets: number[] = [];
    for (let o = 0; o < count; o += PAGE) offsets.push(o);

    const rows: { importe: number; fecha_concesion: string | null; tipo_beneficiario: string | null; synced_at: string | null }[] = [];
    for (let i = 0; i < offsets.length; i += 8) {
      const pages = await Promise.all(
        offsets.slice(i, i + 8).map(o =>
          supabase
            .from('subvenciones')
            .select('importe, fecha_concesion, tipo_beneficiario, synced_at')
            .order('id', { ascending: true })
            .range(o, o + PAGE - 1)
        )
      );
      for (const p of pages) {
        if (p.error) throw p.error;
        rows.push(...(p.data ?? []));
      }
    }
    // If PostgREST capped any page, the sums would be incomplete: show nothing rather than a wrong figure.
    if (rows.length !== count) throw new Error(`filas leídas ${rows.length} ≠ ${count}`);

    let total = 0;
    let fechaMin: string | null = null;
    let fechaMax: string | null = null;
    let lastSync: string | null = null;
    const niveles = new Map<string, { importe: number; n: number }>();
    for (const r of rows) {
      const imp = Number(r.importe);
      total += imp;
      if (r.fecha_concesion) {
        if (!fechaMin || r.fecha_concesion < fechaMin) fechaMin = r.fecha_concesion;
        if (!fechaMax || r.fecha_concesion > fechaMax) fechaMax = r.fecha_concesion;
      }
      if (r.synced_at && (!lastSync || r.synced_at > lastSync)) lastSync = r.synced_at;
      const nivel = r.tipo_beneficiario || 'Sin dato';
      const acc = niveles.get(nivel) ?? { importe: 0, n: 0 };
      acc.importe += imp;
      acc.n += 1;
      niveles.set(nivel, acc);
    }

    const { data: topRows, error: topErr } = await supabase
      .from('subvenciones')
      .select('beneficiario, importe, descripcion, organo_concedente, fecha_concesion')
      .order('importe', { ascending: false })
      .limit(8);
    if (topErr) throw topErr;

    const payload: SubvencionesPayload = {
      disponible: true,
      stats: [
        { label: 'Concesiones sincronizadas', value: count.toLocaleString('es-ES'), note: 'filas en nuestra copia de la BDNS' },
        { label: 'Importe de esas concesiones', value: fmtImporte(total), note: `suma de las ${count.toLocaleString('es-ES')} concesiones` },
        // media = suma de importes / nº de concesiones sincronizadas
        { label: 'Importe medio', value: fmtImporte(total / count), note: 'suma ÷ nº de concesiones sincronizadas' },
        { label: 'Fechas de concesión', value: `${fmtFecha(fechaMin)} – ${fmtFecha(fechaMax)}`, note: 'rango de las concesiones sincronizadas' },
      ],
      top: (topRows ?? []).map((r, i) => ({
        rank: i + 1,
        beneficiario: r.beneficiario,
        concepto: r.descripcion ?? '—',
        organismo: r.organo_concedente ?? '—',
        fecha: r.fecha_concesion ?? null,
        importe: Number(r.importe),
      })),
      // pct = importe del nivel / importe total de las concesiones sincronizadas × 100
      porNivel: Array.from(niveles.entries())
        .map(([nivel, v]) => ({ nivel, importe: v.importe, n: v.n, pct: Math.round((v.importe / total) * 1000) / 10 }))
        .sort((a, b) => b.importe - a.importe),
      meta: {
        source: 'BDNS (copia sincronizada en Supabase)',
        concesiones: count,
        fechaMin,
        fechaMax,
        ultimaSincronizacion: lastSync,
      },
    };

    cacheSet(CACHE_KEY, payload, 6 * 60 * 60 * 1000);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(emptyPayload());
  }
}
