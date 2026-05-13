import { getServerSupabase, type BudgetExecutionRow } from '../supabase';
import { fetchIgaeBudget } from '../data/igae';
import type { BudgetExecution } from '../types';

function toRow(r: BudgetExecution): BudgetExecutionRow {
  return {
    ejercicio: r.ejercicio,
    seccion: r.seccion,
    seccion_desc: r.seccionDescripcion,
    programa: r.programa,
    programa_desc: r.programaDescripcion,
    cred_iniciales: r.credIniciales,
    cred_modificaciones: r.credModificaciones,
    cred_definitivos: r.credDefinitivos,
    obligaciones_reconocidas: r.obligacionesReconocidas,
    obligaciones_pagadas: r.obligacionesPagadas,
    tasa_ejecucion: r.tasaEjecucion,
    synced_at: new Date().toISOString(),
  };
}

export async function syncBudgetToSupabase(ejercicio: number): Promise<{
  rows: number;
  error: string | null;
}> {
  const db = getServerSupabase();
  const started = new Date().toISOString();

  try {
    const data = await fetchIgaeBudget(ejercicio);
    if (data.length === 0) return { rows: 0, error: 'No data fetched' };

    const rows = data.map(toRow);

    // Upsert in batches of 500 to avoid payload limits
    const BATCH = 500;
    for (let i = 0; i < rows.length; i += BATCH) {
      const { error } = await db
        .from('budget_executions')
        .upsert(rows.slice(i, i + BATCH), {
          onConflict: 'ejercicio,seccion,programa',
          ignoreDuplicates: false,
        });
      if (error) throw new Error(error.message);
    }

    await db.from('sync_log').insert({
      source: 'IGAE',
      ejercicio,
      rows_synced: rows.length,
      success: true,
      started_at: started,
      finished_at: new Date().toISOString(),
    });

    return { rows: rows.length, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db.from('sync_log').insert({
      source: 'IGAE',
      ejercicio,
      rows_synced: 0,
      success: false,
      error_msg: msg,
      started_at: started,
      finished_at: new Date().toISOString(),
    });
    return { rows: 0, error: msg };
  }
}
