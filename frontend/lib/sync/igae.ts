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
async function enlacesExcel(diag: string[]): Promise<string[]> {
  try {
    const res = await fetch(IGAE_EXTRACTO_PAGINA, { headers: CABECERAS, signal: AbortSignal.timeout(20_000) });
    diag.push(`página ${res.status}`);
    if (!res.ok) return [];
    const html = await res.text();
    const urls = new Set<string>();
    for (const m of html.matchAll(/href="([^"]+?\.xlsx?)"/gi)) {
      const href = m[1].replace(/&amp;/g, '&');
      urls.add(href.startsWith('http') ? href : new URL(href, IGAE_ORIGEN).toString());
    }
    diag.push(`${urls.size} enlaces .xls`);
    return [...urls];
  } catch (err) {
    diag.push(`página error: ${err instanceof Error ? err.message : String(err)}`);
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

async function descargar(url: string, diag: string[]): Promise<Buffer | null> {
  const nombre = decodeURIComponent(url.split('/').pop() ?? url);
  try {
    const res = await fetch(url, { headers: CABECERAS, signal: AbortSignal.timeout(30_000) });
    if (!res.ok) { diag.push(`${nombre}: ${res.status}`); return null; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.subarray(0, 2).toString() !== 'PK') { diag.push(`${nombre}: no es .xlsx (${res.headers.get('content-type')})`); return null; } // .xlsx = ZIP
    return buf;
  } catch (err) {
    diag.push(`${nombre}: ${err instanceof Error ? err.message : String(err)}`);
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

  const diag: string[] = [];
  const publicados = await enlacesExcel(diag);
  for (const url of candidatos(anio, mes, publicados)) {
    const buf = await descargar(url, diag);
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

  // La IGAE publica el extracto del mes M hacia finales de M+1. A partir de 20 días después
  // del cierre del mes, cada intento sin resultado se registra en sync_log con el detalle
  // de lo probado (estado HTTP de la página y de cada nombre de fichero) para poder
  // distinguir «aún no publicado» de «la descarga falla».
  const cierreMes = Date.UTC(anio, mes, 0);
  if (hoy.getTime() - cierreMes > 20 * 86_400_000) {
    const msg = `Extracto ${mes}/${anio} no disponible · ${diag.join(' · ')}`.slice(0, 1000);
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
