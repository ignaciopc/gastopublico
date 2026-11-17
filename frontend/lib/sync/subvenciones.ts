import { getServerSupabase } from '../supabase';
import { fetchBdnsConcesiones, getBdnsSeedData, type BdnsStats } from '../data/bdns';

export async function syncSubvencionesToSupabase(ejercicio: number): Promise<{
  rows: number;
  statsUpserted: boolean;
  error: string | null;
}> {
  const db = getServerSupabase();
  const started = new Date().toISOString();

  try {
    // Fetch top 500 concesiones por importe (5 páginas de 100)
    const pages = await Promise.all(
      [0, 1, 2, 3, 4].map(p => fetchBdnsConcesiones(ejercicio, p, 100))
    );
    const allRows = pages.flatMap(p => p.content);

    if (allRows.length === 0) {
      await logSync(db, 'BDNS', ejercicio, 0, false, 'No data from BDNS', started);
      return { rows: 0, statsUpserted: false, error: 'No data from BDNS' };
    }

    // Build rows and deduplicate by conflict key before upserting
    // (PostgreSQL throws if the same key appears twice in a single upsert batch)
    const seen = new Set<string>();
    const dbRows = allRows
      .map(r => ({
        ejercicio,
        num_convocatoria: r.numConvocatoria.slice(0, 100),
        descripcion: r.descripcion.slice(0, 300),
        organo_concedente: r.organoConvocante.slice(0, 200),
        beneficiario: r.beneficiario.slice(0, 200),
        importe: r.importe,
        fecha_concesion: parseFecha(r.fechaConcesion),
        tipo_beneficiario: r.tipoBeneficiario.slice(0, 100),
        synced_at: new Date().toISOString(),
      }))
      .filter(r => {
        const key = `${r.ejercicio}|${r.num_convocatoria}|${r.beneficiario}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    const { error: upsertErr } = await db
      .from('subvenciones')
      .upsert(dbRows, { onConflict: 'ejercicio,num_convocatoria,beneficiario', ignoreDuplicates: false });
    if (upsertErr) throw new Error(upsertErr.message);

    // Los agregados se calculan en vivo sobre la tabla `subvenciones` (app/api/subvenciones).
    // Ya no se escriben cifras de un supuesto informe anual en subvenciones_stats.
    await logSync(db, 'BDNS', ejercicio, dbRows.length, true, null, started);
    return { rows: dbRows.length, statsUpserted: false, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await logSync(db, 'BDNS', ejercicio, 0, false, msg, started);
    return { rows: 0, statsUpserted: false, error: msg };
  }
}

function parseFecha(s: string): string | null {
  if (!s) return null;
  // dd/mm/yyyy → yyyy-mm-dd
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  // yyyy-mm-dd passthrough
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return null;
}

async function logSync(db: ReturnType<typeof getServerSupabase>, source: string, ejercicio: number, rows: number, success: boolean, error: string | null, started: string) {
  await db.from('sync_log').insert({
    source,
    ejercicio,
    rows_synced: rows,
    success,
    error_msg: error,
    started_at: started,
    finished_at: new Date().toISOString(),
  });
}

export { getBdnsSeedData };
export type { BdnsStats };
