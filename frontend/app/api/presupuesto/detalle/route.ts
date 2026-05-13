import { NextRequest, NextResponse } from 'next/server';
import { fetchIgaeBudget } from '@/lib/data/igae';
import { cacheGet, cacheSet } from '@/lib/cache';
import { CACHE_TTL, CURRENT_EJERCICIO } from '@/lib/constants';
import type { BudgetExecution } from '@/lib/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ejercicioParam = searchParams.get('ejercicio');
  const seccion = searchParams.get('seccion');
  const ejercicio = ejercicioParam ? parseInt(ejercicioParam, 10) : CURRENT_EJERCICIO;
  const cacheKey = `presupuesto:detalle:${ejercicio}`;

  let rows = cacheGet<BudgetExecution[]>(cacheKey);
  if (!rows) {
    rows = await fetchIgaeBudget(ejercicio);
    cacheSet(cacheKey, rows, CACHE_TTL.PRESUPUESTO);
  }

  const filtered = seccion ? rows.filter(r => r.seccion === seccion) : rows;

  return NextResponse.json({
    data: filtered,
    meta: { lastUpdated: new Date().toISOString(), source: 'IGAE', ejercicio },
  });
}
