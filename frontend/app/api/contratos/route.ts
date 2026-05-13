import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { syncContratosToSupabase } from '@/lib/sync/contratos';
import { fetchPlaceContratos } from '@/lib/data/place';
import { cacheGet, cacheSet } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';
import type { Contract } from '@/lib/types';
import type { ContratoRow } from '@/lib/supabase';

export const runtime = 'nodejs';

function rowToContract(row: ContratoRow): Contract {
  return {
    id: row.id,
    titulo: row.titulo,
    organoContratante: row.organo_contratante,
    tipo: row.tipo,
    importe: Number(row.importe),
    estado: row.estado,
    fechaPublicacion: row.fecha_publicacion,
    fechaAdjudicacion: row.fecha_adjudicacion ?? undefined,
    adjudicatario: row.adjudicatario ?? undefined,
    enlace: row.enlace,
  };
}

export async function GET() {
  const cached = cacheGet<Contract[]>('contratos');
  if (cached && cached.length > 0) {
    return NextResponse.json({
      data: cached,
      meta: { lastUpdated: new Date().toISOString(), source: 'cache', cached: true },
    });
  }

  // Try Supabase first
  const { data: dbRows, error: dbError } = await supabase
    .from('contratos')
    .select('*')
    .order('fecha_publicacion', { ascending: false })
    .limit(50);

  if (!dbError && dbRows && dbRows.length > 0) {
    const contracts = (dbRows as ContratoRow[]).map(rowToContract);
    cacheSet('contratos', contracts, CACHE_TTL.CONTRATOS);
    return NextResponse.json({
      data: contracts,
      meta: { lastUpdated: new Date().toISOString(), source: 'Supabase', cached: false },
    });
  }

  // Fallback: fetch from PLACE Atom feed and persist to Supabase
  try {
    const contracts = await fetchPlaceContratos();

    // Persist to Supabase asynchronously (don't block response)
    syncContratosToSupabase(contracts).catch(() => {});

    cacheSet('contratos', contracts, CACHE_TTL.CONTRATOS);

    return NextResponse.json({
      data: contracts,
      meta: { lastUpdated: new Date().toISOString(), source: 'PLACE', cached: false },
    });
  } catch {
    return NextResponse.json({
      data: [],
      meta: { lastUpdated: new Date().toISOString(), source: 'PLACE', cached: false, error: 'Feed no disponible' },
    }, { status: 200 });
  }
}
