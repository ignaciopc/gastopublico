import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchIgaeBudget } from '@/lib/data/igae';
import { summarizeBudget } from '@/lib/transformers/budget';
import { cacheGet, cacheSet } from '@/lib/cache';
import { CACHE_TTL, CURRENT_EJERCICIO } from '@/lib/constants';
import type { BudgetExecution } from '@/lib/types';
import type { BudgetSummaryRow } from '@/lib/supabase';

export const runtime = 'nodejs';

function rowToExecution(row: BudgetSummaryRow): BudgetExecution {
  return {
    ejercicio: row.ejercicio,
    seccion: row.seccion,
    seccionDescripcion: row.seccion_desc,
    programa: '',
    programaDescripcion: '',
    credIniciales: Number(row.cred_iniciales),
    credModificaciones: Number(row.cred_modificaciones),
    credDefinitivos: Number(row.cred_definitivos),
    obligacionesReconocidas: Number(row.obligaciones_reconocidas),
    obligacionesPagadas: Number(row.obligaciones_pagadas),
    tasaEjecucion: Number(row.tasa_ejecucion),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ejercicioParam = searchParams.get('ejercicio');
  const ejercicio = ejercicioParam ? parseInt(ejercicioParam, 10) : CURRENT_EJERCICIO;
  const cacheKey = `presupuesto:${ejercicio}`;

  const cached = cacheGet<ReturnType<typeof summarizeBudget>>(cacheKey);
  if (cached) {
    return NextResponse.json({
      data: cached,
      meta: { lastUpdated: new Date().toISOString(), source: 'cache', cached: true },
    });
  }

  // Try Supabase first (persisted, fast)
  const { data: dbRows, error } = await supabase
    .from('budget_summary_by_seccion')
    .select('*')
    .eq('ejercicio', ejercicio)
    .order('obligaciones_reconocidas', { ascending: false });

  let summary: ReturnType<typeof summarizeBudget>;
  let source = 'IGAE';

  if (!error && dbRows && dbRows.length > 0) {
    const executions = (dbRows as BudgetSummaryRow[]).map(rowToExecution);
    summary = summarizeBudget(executions, ejercicio);
    source = 'Supabase';
  } else {
    // Fallback: fetch directly from IGAE
    const rows = await fetchIgaeBudget(ejercicio);
    summary = summarizeBudget(rows, ejercicio);
  }

  cacheSet(cacheKey, summary, CACHE_TTL.PRESUPUESTO);

  return NextResponse.json({
    data: summary,
    meta: { lastUpdated: new Date().toISOString(), source, cached: false },
  });
}
