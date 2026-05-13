import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { fetchIgaeBudget } from '@/lib/data/igae';
import { summarizeBudget } from '@/lib/transformers/budget';
import { cacheGet, cacheSet } from '@/lib/cache';
import { CACHE_TTL } from '@/lib/constants';
import type { BudgetExecution, HistoricoSummary } from '@/lib/types';
import type { BudgetSummaryRow } from '@/lib/supabase';

export const runtime = 'nodejs';

const AÑOS = [2022, 2023, 2024];

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

export async function GET() {
  const cached = cacheGet<HistoricoSummary>('presupuesto:historico');
  if (cached) {
    return NextResponse.json({
      data: cached,
      meta: { lastUpdated: new Date().toISOString(), source: 'cache', cached: true },
    });
  }

  // Fetch all years in parallel — Supabase first, IGAE fallback
  const summariesByYear = await Promise.all(
    AÑOS.map(async (año) => {
      const { data: dbRows, error } = await supabase
        .from('budget_summary_by_seccion')
        .select('*')
        .eq('ejercicio', año)
        .order('obligaciones_reconocidas', { ascending: false });

      if (!error && dbRows && dbRows.length > 0) {
        return summarizeBudget((dbRows as BudgetSummaryRow[]).map(rowToExecution), año);
      }
      const rows = await fetchIgaeBudget(año);
      return summarizeBudget(rows, año);
    })
  );

  // Build unified structure keyed by section code
  const seccionMap = new Map<string, HistoricoSummary['secciones'][number]>();

  for (const summary of summariesByYear) {
    for (const s of summary.bySeccion) {
      if (!seccionMap.has(s.seccion)) {
        seccionMap.set(s.seccion, {
          seccion: s.seccion,
          descripcion: s.descripcion,
          datos: {},
        });
      }
      seccionMap.get(s.seccion)!.datos[summary.ejercicio] = {
        credDefinitivos: s.credDefinitivos,
        obligacionesReconocidas: s.obligacionesReconocidas,
        tasaEjecucion: s.tasaEjecucion,
      };
    }
  }

  // Sort sections by 2024 spend (most recent year), fallback to 2023 then 2022
  const secciones = Array.from(seccionMap.values()).sort((a, b) => {
    const valA = a.datos[2024]?.obligacionesReconocidas ?? a.datos[2023]?.obligacionesReconocidas ?? 0;
    const valB = b.datos[2024]?.obligacionesReconocidas ?? b.datos[2023]?.obligacionesReconocidas ?? 0;
    return valB - valA;
  });

  const totales: HistoricoSummary['totales'] = {};
  for (const summary of summariesByYear) {
    totales[summary.ejercicio] = {
      credDefinitivos: summary.totalCredDefinitivos,
      obligacionesReconocidas: summary.totalObligacionesReconocidas,
      tasaEjecucion: summary.tasaEjecucionGlobal,
    };
  }

  const result: HistoricoSummary = { años: AÑOS, secciones, totales };
  cacheSet('presupuesto:historico', result, CACHE_TTL.PRESUPUESTO);

  return NextResponse.json({
    data: result,
    meta: { lastUpdated: new Date().toISOString(), source: 'Supabase', cached: false },
  });
}
