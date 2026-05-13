import { getServerSupabase } from '../supabase';
import { fetchBdnsConcesiones, getBdnsSeedData, type BdnsConcesion, type BdnsStats } from '../data/bdns';

const TIPO_COLORES: Record<string, string> = {
  'Administración Autonómica': 'var(--accent)',
  'Administración Local': 'var(--accent)',
  'Administración General del Estado': 'var(--accent)',
  'Empresa pública': '#8a1428',
  'Entidad sin ánimo de lucro': '#6b6b66',
  'Empresa privada': '#3a3a35',
  'Persona física': '#1a1a18',
};

function tipoColor(tipo: string): string {
  for (const [key, color] of Object.entries(TIPO_COLORES)) {
    if (tipo.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return 'var(--muted)';
}

function agruparPorTipo(rows: BdnsConcesion[]): Array<{ tipo: string; pct: number; color: string }> {
  const totals: Record<string, number> = {};
  let grand = 0;
  for (const r of rows) {
    const t = r.tipoBeneficiario || 'Otros';
    totals[t] = (totals[t] ?? 0) + r.importe;
    grand += r.importe;
  }
  if (grand === 0) return [];
  return Object.entries(totals)
    .map(([tipo, sum]) => ({ tipo, pct: Math.round((sum / grand) * 1000) / 10, color: tipoColor(tipo) }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 6);
}

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
    const totalElements = pages[0].totalElements;

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

    // Upsert stats
    // We only fetch a 500-row sample out of millions; use seed annual-report figures
    // for aggregate totals (totalImporte, importeMedio, pctTop100) which can't be
    // computed correctly from a partial fetch. Keep real totalElements and porTipo.
    const seedStats = getBdnsSeedData(ejercicio).stats;
    const porTipo = agruparPorTipo(allRows);

    const { error: statsErr } = await db
      .from('subvenciones_stats')
      .upsert({
        ejercicio,
        total_importe: seedStats.totalImporte,
        num_concesiones: totalElements,
        importe_medio: seedStats.importeMedio,
        pct_top100: seedStats.pctTop100,
        por_tipo: porTipo.length > 0 ? porTipo : seedStats.porTipo,
        synced_at: new Date().toISOString(),
      }, { onConflict: 'ejercicio' });

    if (statsErr) throw new Error(statsErr.message);

    await logSync(db, 'BDNS', ejercicio, dbRows.length, true, null, started);
    return { rows: dbRows.length, statsUpserted: true, error: null };
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
