/**
 * seed-real-data.mjs
 * Ejecutar UNA VEZ desde la raíz del repo para poblar Supabase con datos reales.
 *
 *   node scripts/seed-real-data.mjs
 *
 * Requiere Node 18+ (fetch nativo). No necesita instalar nada extra.
 */

import { createClient } from '@supabase/supabase-js';

// ── Credenciales ──────────────────────────────────────────────────────────────
// Configura en .env o pasa como variables de entorno:
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SECRET_KEY=sb_secret_... node scripts/seed-real-data.mjs
const SUPABASE_URL = process.env.SUPABASE_URL ?? 'https://uayqzvazhkowfhairbij.supabase.co';
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;

const IGAE_URLS = {
  2024: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2024.csv',
  2023: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2023.csv',
  2022: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2022.csv',
};
const BDNS_BASE = 'https://www.pap.hacienda.gob.es/bdnstrans/GE/es';
const PLACE_FEED = 'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores.atom';

const db = createClient(SUPABASE_URL, SUPABASE_SECRET, { auth: { persistSession: false } });

// ── Helpers ───────────────────────────────────────────────────────────────────
function log(msg) { console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`); }
function warn(msg) { console.warn(`  ⚠️  ${msg}`); }

async function safeFetch(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'GastoPublico.es/seed-script', Accept: 'application/json,text/plain,*/*' },
    signal: AbortSignal.timeout(20_000),
    ...opts,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`);
  return res;
}

// ── 1. IGAE — Presupuesto ─────────────────────────────────────────────────────
const MINISTERIOS_MAP = {
  '01': 'Casa de S.M. el Rey', '02': 'Cortes Generales', '03': 'Tribunal de Cuentas',
  '04': 'Consejo de Estado', '05': 'Presidencia del Gobierno', '06': 'Min. Asuntos Exteriores',
  '07': 'Min. Justicia', '08': 'Min. Defensa', '09': 'Min. Hacienda', '10': 'Min. Interior',
  '11': 'Min. Transportes', '12': 'Min. Educación', '13': 'Min. Empleo', '14': 'Min. Industria',
  '15': 'Min. Agricultura', '16': 'Min. Sanidad', '17': 'Min. Medio Ambiente',
  '18': 'Min. Cultura', '19': 'Min. Economía', '20': 'Min. Ciencia e Innovación',
  '60': 'Seguridad Social',
};

function parseIgaeCsv(text, ejercicio) {
  const lines = text.split('\n').filter(Boolean);
  if (lines.length < 2) return [];
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';').map(c => c.trim().replace(/"/g, ''));
    if (cols.length < 8) continue;
    const seccion = (cols[0] || '').padStart(2, '0');
    const programa = cols[2] || '';
    const toNum = s => parseFloat((s || '0').replace(/\./g, '').replace(',', '.')) || 0;
    const credIniciales = toNum(cols[4]);
    const credMod = toNum(cols[5]);
    const credDef = credIniciales + credMod;
    const oblig = toNum(cols[6]);
    const pagadas = toNum(cols[7]);
    const tasa = credDef > 0 ? Math.round((oblig / credDef) * 10000) / 100 : 0;
    rows.push({
      ejercicio,
      seccion,
      seccion_desc: MINISTERIOS_MAP[seccion] || `Sección ${seccion}`,
      programa,
      programa_desc: cols[3] || '',
      cred_iniciales: credIniciales,
      cred_modificaciones: credMod,
      cred_definitivos: credDef,
      obligaciones_reconocidas: oblig,
      obligaciones_pagadas: pagadas,
      tasa_ejecucion: tasa,
      synced_at: new Date().toISOString(),
    });
  }
  return rows.filter(r => r.cred_definitivos > 0 || r.obligaciones_reconocidas > 0);
}

async function syncIgae(ejercicio) {
  log(`IGAE ${ejercicio} — fetchando CSV...`);
  try {
    const res = await safeFetch(IGAE_URLS[ejercicio]);
    // Detectar encoding (suelen ser latin-1 / windows-1252)
    const buffer = await res.arrayBuffer();
    let text;
    try {
      text = new TextDecoder('windows-1252').decode(buffer);
    } catch {
      text = new TextDecoder('utf-8').decode(buffer);
    }
    const rows = parseIgaeCsv(text, ejercicio);
    if (rows.length === 0) { warn(`IGAE ${ejercicio}: CSV parseado sin filas útiles`); return 0; }

    const BATCH = 200;
    let total = 0;
    for (let i = 0; i < rows.length; i += BATCH) {
      const { error } = await db.from('budget_executions').upsert(rows.slice(i, i + BATCH), {
        onConflict: 'ejercicio,seccion,programa', ignoreDuplicates: false,
      });
      if (error) throw new Error(error.message);
      total += Math.min(BATCH, rows.length - i);
    }
    log(`IGAE ${ejercicio} — ✅ ${total} filas upserted`);
    return total;
  } catch (e) {
    warn(`IGAE ${ejercicio} falló: ${e.message}`);
    return 0;
  }
}

// ── 2. BDNS — Subvenciones ────────────────────────────────────────────────────
function normalizeConcesion(raw) {
  return {
    numConvocatoria: String(raw.numConvocatoria ?? raw.idConvocatoria ?? raw.id ?? ''),
    descripcion: String(raw.tituloConvocatoria ?? raw.descripConvocatoria ?? raw.descripcion ?? '').slice(0, 300),
    organoConvocante: String(raw.organoConvocante ?? raw.organo ?? raw.administracion ?? '').slice(0, 200),
    beneficiario: String(raw.nombreBeneficiario ?? raw.beneficiario ?? raw.nombre ?? '').slice(0, 200),
    importe: Number(raw.importeConcedido ?? raw.importe ?? 0),
    fechaConcesion: String(raw.fechaConcesion ?? raw.fecha ?? ''),
    tipoBeneficiario: String(raw.tipoBeneficiario ?? raw.tipo ?? '').slice(0, 100),
  };
}

function parseFecha(s) {
  if (!s) return null;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  return null;
}

const TIPO_COLORS = {
  'Administración Autonómica': 'var(--accent)',
  'Administración Local': 'var(--accent)',
  'Administración General': 'var(--accent)',
  'Empresa pública': '#8a1428',
  'Entidad sin ánimo': '#6b6b66',
  'Empresa privada': '#3a3a35',
  'Persona física': '#1a1a18',
};
function tipoColor(tipo) {
  for (const [k, c] of Object.entries(TIPO_COLORS)) {
    if (tipo.toLowerCase().includes(k.toLowerCase())) return c;
  }
  return 'var(--muted)';
}

async function syncBdns(ejercicio) {
  log(`BDNS ${ejercicio} — fetchando top 500 por importe (5 páginas)...`);
  try {
    const pages = await Promise.all(
      [0, 1, 2, 3, 4].map(p =>
        safeFetch(`${BDNS_BASE}/concesiones.json?anio=${ejercicio}&page=${p}&pageSize=100&orden=importe&dir=desc`)
          .then(r => r.json())
          .catch(() => ({ content: [], totalElements: 0, totalPages: 0 }))
      )
    );

    const firstPage = pages[0];
    const totalElements = firstPage.totalElements ?? 0;
    const allRows = pages.flatMap(p => (p.content ?? []).map(normalizeConcesion));

    if (allRows.length === 0) {
      warn(`BDNS ${ejercicio}: ninguna fila recibida`);
      return 0;
    }
    log(`BDNS ${ejercicio} — ${allRows.length} concesiones recibidas (total en BD: ${totalElements.toLocaleString('es-ES')})`);

    // Upsert concesiones
    const dbRows = allRows.map(r => ({
      ejercicio,
      num_convocatoria: r.numConvocatoria,
      descripcion: r.descripcion,
      organo_concedente: r.organoConvocante,
      beneficiario: r.beneficiario,
      importe: r.importe,
      fecha_concesion: parseFecha(r.fechaConcesion),
      tipo_beneficiario: r.tipoBeneficiario,
      synced_at: new Date().toISOString(),
    }));

    const { error } = await db.from('subvenciones').upsert(dbRows, {
      onConflict: 'ejercicio,num_convocatoria,beneficiario', ignoreDuplicates: false,
    });
    if (error) throw new Error(error.message);

    // Calcular y upsert stats
    const totalImporte = allRows.reduce((s, r) => s + r.importe, 0);
    const importeMedio = totalElements > 0 ? totalImporte / totalElements : 0;
    const top100Total = allRows.slice(0, 100).reduce((s, r) => s + r.importe, 0);
    const pctTop100 = totalImporte > 0 ? Math.round((top100Total / totalImporte) * 1000) / 10 : 0;

    // Distribución por tipo
    const tipeTotals = {};
    let grand = 0;
    for (const r of allRows) {
      const t = r.tipoBeneficiario || 'Otros';
      tipeTotals[t] = (tipeTotals[t] ?? 0) + r.importe;
      grand += r.importe;
    }
    const porTipo = Object.entries(tipeTotals)
      .map(([tipo, sum]) => ({ tipo, pct: Math.round((sum / grand) * 1000) / 10, color: tipoColor(tipo) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6);

    await db.from('subvenciones_stats').upsert({
      ejercicio,
      total_importe: totalImporte,
      num_concesiones: totalElements,
      importe_medio: importeMedio,
      pct_top100: pctTop100,
      por_tipo: porTipo,
      synced_at: new Date().toISOString(),
    }, { onConflict: 'ejercicio' });

    log(`BDNS ${ejercicio} — ✅ ${allRows.length} filas + stats upserted`);
    return allRows.length;
  } catch (e) {
    warn(`BDNS ${ejercicio} falló: ${e.message}`);
    return 0;
  }
}

// ── 3. PLACE — Contratos ──────────────────────────────────────────────────────
function parseAtomContratos(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);
  const rows = [];
  let n = 0;
  for (const entry of entries) {
    const get = (tag, alt = '') => {
      const m = entry.match(new RegExp(`<(?:[^:]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[^:]+:)?${tag}>`));
      return m ? m[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() : alt;
    };
    const title = get('title');
    const link = entry.match(/href="([^"]+)"/)?.[1] ?? '';
    const published = get('published') || get('updated') || new Date().toISOString();
    const summary = get('summary');
    const importe = parseFloat(summary.match(/[\d.,]+/)?.[0]?.replace(/\./g, '').replace(',', '.') ?? '0') || 0;
    const tipo = title.toLowerCase().includes('obra') ? 'obras'
      : title.toLowerCase().includes('servicio') ? 'servicios'
      : title.toLowerCase().includes('suministro') ? 'suministros' : 'otro';
    const id = link.split('/').pop() || `place-${++n}`;
    rows.push({
      id,
      titulo: title.slice(0, 500),
      organo_contratante: get('author') || get('name') || 'Administración Pública',
      tipo,
      importe,
      estado: 'en_licitacion',
      fecha_publicacion: published,
      enlace: link,
      synced_at: new Date().toISOString(),
    });
  }
  return rows;
}

async function syncPlace() {
  log(`PLACE — fetchando feed Atom...`);
  try {
    const res = await safeFetch(PLACE_FEED, { headers: { Accept: 'application/atom+xml,application/xml,*/*' } });
    const text = await res.text();
    const rows = parseAtomContratos(text);
    if (rows.length === 0) { warn('PLACE: sin contratos parseados'); return 0; }
    const { error } = await db.from('contratos').upsert(rows, { onConflict: 'id', ignoreDuplicates: false });
    if (error) throw new Error(error.message);
    log(`PLACE — ✅ ${rows.length} contratos upserted`);
    return rows.length;
  } catch (e) {
    warn(`PLACE falló: ${e.message}`);
    return 0;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 GastoPublico.es — Seed de datos reales\n');

  // IGAE: 3 ejercicios en paralelo
  const [i22, i23, i24] = await Promise.all([
    syncIgae(2022), syncIgae(2023), syncIgae(2024),
  ]);

  // BDNS: ejercicio actual
  const bdns = await syncBdns(2024);

  // PLACE: contratos en tiempo real
  const place = await syncPlace();

  console.log('\n─────────────────────────────────');
  console.log('✅ Resumen:');
  console.log(`   IGAE 2022: ${i22} filas`);
  console.log(`   IGAE 2023: ${i23} filas`);
  console.log(`   IGAE 2024: ${i24} filas`);
  console.log(`   BDNS 2024: ${bdns} concesiones`);
  console.log(`   PLACE:     ${place} contratos`);
  console.log('─────────────────────────────────\n');

  if ([i22, i23, i24, bdns, place].every(n => n === 0)) {
    console.error('❌ Todo falló. Comprueba tu conexión a internet.');
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
