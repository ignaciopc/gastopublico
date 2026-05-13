import { NextRequest, NextResponse } from 'next/server';
import { syncBudgetToSupabase } from '@/lib/sync/budget';
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
  // Sync current year always; sync previous years on the 1st of each month
  const years = now.getDate() === 1 ? [2022, 2023, 2024] : [2024];

  // Run all syncs in parallel to avoid timeout
  const [budgetResults, contratosResult, subvencionesResult] = await Promise.all([
    Promise.all(years.map(year => syncBudgetToSupabase(year).then(r => [year, r] as const))),
    fetchPlaceContratos()
      .then(contratos => syncContratosToSupabase(contratos))
      .catch(err => ({ rows: 0, error: err instanceof Error ? err.message : String(err) })),
    syncSubvencionesToSupabase(2024),
  ]);

  const results: Record<string, unknown> = {};
  for (const [year, result] of budgetResults) results[year] = result;
  results.contratos = contratosResult;
  results.subvenciones = subvencionesResult;

  cacheInvalidateAll();

  return NextResponse.json({
    ok: true,
    syncedAt: now.toISOString(),
    results,
  });
}
