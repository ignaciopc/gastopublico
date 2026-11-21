import { NextRequest, NextResponse } from 'next/server';
import { syncIgaeExtracto } from '@/lib/sync/igae';
import { syncContratosToSupabase } from '@/lib/sync/contratos';
import { syncSubvencionesToSupabase } from '@/lib/sync/subvenciones';
import { fetchPlaceContratos } from '@/lib/data/place';
import { cacheInvalidateAll } from '@/lib/cache';

export const runtime = 'nodejs';
export const maxDuration = 300;

// Called by Vercel Cron. Authorization via CRON_SECRET injected by Vercel.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();

  // Run all syncs in parallel to avoid timeout
  const [igaeResult, contratosResult, subvencionesResult] = await Promise.all([
    syncIgaeExtracto().catch(err => ({ cargado: null, filas: 0, error: err instanceof Error ? err.message : String(err) })),
    fetchPlaceContratos()
      .then(contratos => syncContratosToSupabase(contratos))
      .catch(err => ({ rows: 0, error: err instanceof Error ? err.message : String(err) })),
    syncSubvencionesToSupabase(2024),
  ]);

  const results: Record<string, unknown> = {};
  results.igae = igaeResult;
  results.contratos = contratosResult;
  results.subvenciones = subvencionesResult;

  cacheInvalidateAll();

  return NextResponse.json({
    ok: true,
    syncedAt: now.toISOString(),
    results,
  });
}
