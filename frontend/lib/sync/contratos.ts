import { getServerSupabase, type ContratoRow } from '../supabase';
import type { Contract } from '../types';

function toRow(c: Contract): ContratoRow {
  return {
    id: c.id,
    titulo: c.titulo,
    organo_contratante: c.organoContratante,
    tipo: c.tipo,
    importe: c.importe,
    estado: c.estado,
    fecha_publicacion: c.fechaPublicacion,
    fecha_adjudicacion: c.fechaAdjudicacion ?? null,
    adjudicatario: c.adjudicatario ?? null,
    enlace: c.enlace,
    synced_at: new Date().toISOString(),
  };
}

export async function syncContratosToSupabase(contratos: Contract[]): Promise<{
  rows: number;
  error: string | null;
}> {
  const db = getServerSupabase();
  const started = new Date().toISOString();

  try {
    if (contratos.length === 0) return { rows: 0, error: null };

    const rows = contratos.map(toRow);
    const { error } = await db
      .from('contratos')
      .upsert(rows, { onConflict: 'id', ignoreDuplicates: false });

    if (error) throw new Error(error.message);

    await db.from('sync_log').insert({
      source: 'PLACE',
      rows_synced: rows.length,
      success: true,
      started_at: started,
      finished_at: new Date().toISOString(),
    });

    return { rows: rows.length, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await db.from('sync_log').insert({
      source: 'PLACE',
      rows_synced: 0,
      success: false,
      error_msg: msg,
      started_at: started,
      finished_at: new Date().toISOString(),
    });
    return { rows: 0, error: msg };
  }
}
