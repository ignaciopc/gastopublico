import { getServerSupabase } from '../supabase';
import { parseExtracto, MESES, type Extracto } from '../igae/extracto';

// Página oficial donde la IGAE enlaza cada mes el «Extracto de ejecución del Presupuesto»
// (PDF + «Cuadros» en Excel).
export const IGAE_EXTRACTO_PAGINA =
  'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/paginas/imextractoejecucion.aspx';
const IGAE_ORIGEN = 'https://www.igae.pap.hacienda.gob.es';
const IGAE_DOCUMENTOS = `${IGAE_ORIGEN}/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents`;

const CABECERAS = { 'User-Agent': 'GastoPublico.es (+https://gastopublico.es/metodologia)' };

// Enlaces del Excel publicados en la página. Si la página no los sirve en el HTML,
// se prueba con el nombre con el que la IGAE publica el fichero
// (p. ej. «EXTRACTO_SEPTIEMBRE_2026_EXCEL.xlsx»).
async function enlacesExcel(): Promise<string[]> {
  try {
    const res = await fetch(IGAE_EXTRACTO_PAGINA, { headers: CABECERAS, signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return [];
    const html = await res.text();
    const urls = new Set<string>();
    for (const m of html.matchAll(/href="([^"]+?\.xlsx?)"/gi)) {
      const href = m[1].replace(/&amp;/g, '&');
      urls.add(href.startsWith('http') ? href : new URL(href, IGAE_ORIGEN).toString());
    }
    return [...urls];
  } catch {
    return [];
  }
}

function candidatos(anio: number, mes: number, publicados: string[]): string[] {
  const nombreMes = MESES[mes - 1];
  const dePagina = publicados.filter(u => {
    const n = decodeURIComponent(u).toUpperCase();
    return n.includes(nombreMes) && n.includes(String(anio));
  });
  const base = [
    `EXTRACTO_${nombreMes}_${anio}_EXCEL.xlsx`,
    `EXTRACTO ${nombreMes} ${anio} EXCEL.xlsx`,
  ].map(n => `${IGAE_DOCUMENTOS}/${encodeURIComponent(n)}`);
  return [...new Set([...dePagina, ...base])];
}

async function descargar(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, { headers: CABECERAS, signal: AbortSignal.timeout(30_000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.subarray(0, 2).toString() === 'PK' ? buf : null; // .xlsx = ZIP
  } catch {
    return null;
  }
}

export async function guardarExtracto(extracto: Extracto, fichero: string) {
  const db = getServerSupabase();
  const filas = extracto.filas.map(f => ({ ...f, fichero, cargado_at: new Date().toISOString() }));
  const { error } = await db.from('igae_ejecucion').upsert(filas, { onConflict: 'ejercicio,mes,nivel,nombre' });
  if (error) throw new Error(error.message);
  return filas.length;
}

// Busca el primer extracto posterior al último cargado. La IGAE publica el de cada mes
// a finales del mes siguiente (calendario de publicaciones), así que lo normal es que no
// haya nada nuevo y no se descargue nada.
export async function syncIgaeExtracto(): Promise<{ cargado: string | null; filas: number; error: string | null }> {
  const db = getServerSupabase();
  const started = new Date().toISOString();

  const { data: ultimo } = await db
    .from('igae_ejecucion')
    .select('ejercicio, mes')
    .eq('nivel', 'total')
    .order('ejercicio', { ascending: false })
    .order('mes', { ascending: false })
    .limit(1)
    .maybeSingle();

  const hoy = new Date();
  let anio = ultimo?.ejercicio ?? hoy.getUTCFullYear();
  let mes = ultimo ? ultimo.mes + 1 : 1;
  if (mes > 12) { mes = 1; anio += 1; }

  // No se busca un mes que aún no ha terminado.
  if (anio > hoy.getUTCFullYear() || (anio === hoy.getUTCFullYear() && mes >= hoy.getUTCMonth() + 1)) {
    return { cargado: null, filas: 0, error: null };
  }

  const publicados = await enlacesExcel();
  for (const url of candidatos(anio, mes, publicados)) {
    const buf = await descargar(url);
    if (!buf) continue;
    try {
      const extracto = parseExtracto(buf);
      if (extracto.ejercicio !== anio || extracto.mes !== mes) {
        throw new Error(`El fichero ${url} es de ${extracto.mes}/${extracto.ejercicio}, se esperaba ${mes}/${anio}`);
      }
      const fichero = decodeURIComponent(url.split('/').pop() ?? url);
      const filas = await guardarExtracto(extracto, fichero);
      await logSync(db, anio, filas, true, null, started);
      return { cargado: fichero, filas, error: null };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await logSync(db, anio, 0, false, msg, started);
      return { cargado: null, filas: 0, error: msg };
    }
  }

  // La IGAE publica el extracto del mes M a finales de M+1. Si han pasado más de 75 días
  // desde el cierre del mes (unos 45 después de la fecha prevista) y no aparece, se
  // registra el fallo en sync_log para detectarlo.
  const cierreMes = Date.UTC(anio, mes, 0);
  if (hoy.getTime() - cierreMes > 75 * 86_400_000) {
    const msg = `No se encontró el extracto ${mes}/${anio} (${publicados.length} enlaces .xls en la página)`;
    await logSync(db, anio, 0, false, msg, started);
    return { cargado: null, filas: 0, error: msg };
  }

  return { cargado: null, filas: 0, error: null };
}

async function logSync(db: ReturnType<typeof getServerSupabase>, ejercicio: number, rows: number, success: boolean, error: string | null, started: string) {
  await db.from('sync_log').insert({
    source: 'IGAE_EXTRACTO',
    ejercicio,
    rows_synced: rows,
    success,
    error_msg: error,
    started_at: started,
    finished_at: new Date().toISOString(),
  });
}
