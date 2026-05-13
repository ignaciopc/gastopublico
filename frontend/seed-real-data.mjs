/**
 * seed-real-data.mjs — GastoPublico.es
 * Pobla Supabase con datos reales de IGAE, BDNS y PLACE.
 * Ejecutar desde frontend/: node seed-real-data.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL    = process.env.SUPABASE_URL ?? 'https://uayqzvazhkowfhairbij.supabase.co';
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;

// BDNS nueva API (infosubvenciones.es)
const BDNS_API = 'https://www.infosubvenciones.es/bdnstrans/api';

// IGAE — varias URLs posibles (han cambiado la estructura de carpetas)
const IGAE_URLS = {
  2024: [
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents/EjecucionPresupuestariaEstado2024.csv',
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2024.csv',
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents/Liquidacion_Estado_2024.csv',
  ],
  2023: [
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents/EjecucionPresupuestariaEstado2023.csv',
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2023.csv',
  ],
  2022: [
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria/Documents/EjecucionPresupuestariaEstado2022.csv',
    'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2022.csv',
  ],
};

const PLACE_FEED = 'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores.atom';

const db = createClient(SUPABASE_URL, SUPABASE_SECRET, { auth: { persistSession: false } });

function log(msg)  { console.log(`[${new Date().toISOString().slice(11,19)}] ${msg}`); }
function warn(msg) { console.warn(`  ⚠️  ${msg}`); }
function ok(msg)   { console.log(`  ✅ ${msg}`); }

async function tryFetch(urls, opts = {}) {
  const arr = Array.isArray(urls) ? urls : [urls];
  for (const url of arr) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'GastoPublico.es/seed', Accept: '*/*', ...opts.headers },
        signal: AbortSignal.timeout(20_000),
        ...opts,
      });
      if (res.ok) { log(`  → OK: ${url}`); return res; }
      warn(`HTTP ${res.status}: ${url}`);
    } catch (e) {
      warn(`${e.message}: ${url}`);
    }
  }
  return null;
}

// ─────────────────────────────────────────────
// 1. IGAE — Presupuesto
// ─────────────────────────────────────────────
const MINISTERIOS_MAP = {
  '01':'Casa de S.M. el Rey','02':'Cortes Generales','03':'Tribunal de Cuentas',
  '04':'Consejo de Estado','05':'Presidencia del Gobierno','06':'Min. Asuntos Exteriores',
  '07':'Min. Justicia','08':'Min. Defensa','09':'Min. Hacienda','10':'Min. Interior',
  '11':'Min. Transportes','12':'Min. Educación','13':'Min. Empleo','14':'Min. Industria',
  '15':'Min. Agricultura','16':'Min. Sanidad','17':'Min. Medio Ambiente',
  '18':'Min. Cultura','19':'Min. Economía','20':'Min. Ciencia e Innovación',
  '60':'Seguridad Social',
};

function parseIgaeCsv(text, ejercicio) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];
  const sep = lines[0].includes(';') ? ';' : ',';
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g, ''));
    if (cols.length < 7) continue;
    const seccion = (cols[0] || '').replace(/\D/g,'').padStart(2,'0');
    if (!seccion || seccion === '00') continue;
    const toNum = s => parseFloat((s||'0').replace(/\./g,'').replace(',','.')) || 0;
    const credIni = toNum(cols[4]);
    const credMod = toNum(cols[5]);
    const credDef = credIni + credMod;
    const oblig   = toNum(cols[6]);
    const pagadas = toNum(cols[7] ?? '0');
    if (credDef === 0 && oblig === 0) continue;
    rows.push({
      ejercicio,
      seccion,
      seccion_desc: MINISTERIOS_MAP[seccion] || `Sección ${seccion}`,
      programa: cols[2] || '',
      programa_desc: cols[3] || '',
      cred_iniciales: credIni,
      cred_modificaciones: credMod,
      cred_definitivos: credDef,
      obligaciones_reconocidas: oblig,
      obligaciones_pagadas: pagadas,
      tasa_ejecucion: credDef > 0 ? Math.round((oblig/credDef)*10000)/100 : 0,
      synced_at: new Date().toISOString(),
    });
  }
  return rows;
}

async function syncIgae(ejercicio) {
  log(`IGAE ${ejercicio} — buscando CSV...`);
  const res = await tryFetch(IGAE_URLS[ejercicio]);
  if (!res) { warn(`IGAE ${ejercicio}: ninguna URL respondió`); return 0; }

  const buffer = await res.arrayBuffer();
  let text;
  try { text = new TextDecoder('windows-1252').decode(buffer); }
  catch { text = new TextDecoder('utf-8').decode(buffer); }

  const rows = parseIgaeCsv(text, ejercicio);
  if (rows.length === 0) { warn(`IGAE ${ejercicio}: CSV sin filas útiles`); return 0; }

  let total = 0;
  for (let i = 0; i < rows.length; i += 200) {
    const { error } = await db.from('budget_executions')
      .upsert(rows.slice(i, i+200), { onConflict: 'ejercicio,seccion,programa', ignoreDuplicates: false });
    if (error) { warn(`IGAE ${ejercicio} upsert: ${error.message}`); break; }
    total += Math.min(200, rows.length - i);
  }
  ok(`IGAE ${ejercicio}: ${total} filas`);
  return total;
}

// ─────────────────────────────────────────────
// 2. BDNS — Subvenciones
// ─────────────────────────────────────────────
const TIPO_COLORS = {
  'administraci': 'var(--accent)',
  'empresa p':    '#8a1428',
  'entidad':      '#6b6b66',
  'empresa pr':   '#3a3a35',
  'persona':      '#1a1a18',
};
function tipoColor(tipo = '') {
  const t = tipo.toLowerCase();
  for (const [k,c] of Object.entries(TIPO_COLORS)) if (t.includes(k)) return c;
  return 'var(--muted)';
}
function parseFecha(s = '') {
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0,10);
  return null;
}

function extractRows(json) {
  if (Array.isArray(json?.content)) return { rows: json.content, total: json.totalElements ?? 0 };
  if (Array.isArray(json?.rows))    return { rows: json.rows,    total: json.total ?? json.rows.length };
  if (Array.isArray(json?.data))    return { rows: json.data,    total: json.total ?? json.data.length };
  if (Array.isArray(json))          return { rows: json,         total: json.length };
  return { rows: [], total: 0 };
}

function normRow(r) {
  return {
    numConvocatoria: String(r.numConvocatoria ?? r.idConvocatoria ?? r.id ?? r.codigo ?? ''),
    descripcion:     String(r.tituloConvocatoria ?? r.descripConvocatoria ?? r.descripcion ?? r.titulo ?? '').slice(0,300),
    organoConvocante:String(r.organoConvocante ?? r.organo ?? r.organismo ?? r.administracion ?? '').slice(0,200),
    beneficiario:    String(r.nombreBeneficiario ?? r.beneficiario ?? r.nombre ?? r.razonSocial ?? '').slice(0,200),
    importe:         Number(r.importeConcedido ?? r.importe ?? r.importeTotal ?? 0),
    fechaConcesion:  String(r.fechaConcesion ?? r.fecha ?? ''),
    tipoBeneficiario:String(r.tipoBeneficiario ?? r.tipo ?? r.categoria ?? '').slice(0,100),
  };
}

async function tryBdnsEndpoint(url) {
  const res = await tryFetch(url, { headers: { Accept: 'application/json' } });
  if (!res) return null;
  try {
    const json = await res.json();
    const { rows, total } = extractRows(json);
    return { rows: rows.map(normRow), total };
  } catch (e) {
    warn(`JSON parse: ${e.message}`);
    return null;
  }
}

async function syncBdns(ejercicio) {
  log(`BDNS ${ejercicio} — probando endpoints...`);

  const endpoints = [
    `${BDNS_API}/concesiones/busqueda?ejercicio=${ejercicio}&pageSize=100&page=0&orden=importe&dir=desc`,
    `${BDNS_API}/grandesbeneficiarios?ejercicio=${ejercicio}`,
    `${BDNS_API}/concesiones?ejercicio=${ejercicio}&pageSize=100&page=0`,
    `https://www.infosubvenciones.es/bdnstrans/GE/es/concesiones.json?anio=${ejercicio}&page=0&pageSize=100&orden=importe&dir=desc`,
    `https://www.pap.hacienda.gob.es/bdnstrans/GE/es/concesiones.json?anio=${ejercicio}&page=0&pageSize=100&orden=importe&dir=desc`,
  ];

  let allRows = [], totalElements = 0;

  for (const ep of endpoints) {
    const result = await tryBdnsEndpoint(ep);
    if (result && result.rows.length > 0) {
      allRows = result.rows;
      totalElements = result.total;
      // Páginas adicionales si caben
      if (ep.includes('page=0') && result.total > 100) {
        const extras = await Promise.allSettled([1,2,3,4].map(p =>
          tryBdnsEndpoint(ep.replace('page=0', `page=${p}`))
        ));
        for (const r of extras) {
          if (r.status === 'fulfilled' && r.value?.rows.length) allRows.push(...r.value.rows);
        }
      }
      break;
    }
  }

  if (allRows.length === 0) { warn(`BDNS ${ejercicio}: todos los endpoints fallaron`); return 0; }
  log(`BDNS ${ejercicio} — ${allRows.length} filas obtenidas`);

  // Deduplicar
  const seen = new Set();
  let n = 0;
  const unique = allRows.filter(r => {
    const key = `${r.numConvocatoria}|${r.beneficiario}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const dbRows = unique.map(r => ({
    ejercicio,
    num_convocatoria: r.numConvocatoria || `auto-${++n}`,
    descripcion: r.descripcion,
    organo_concedente: r.organoConvocante,
    beneficiario: r.beneficiario,
    importe: r.importe,
    fecha_concesion: parseFecha(r.fechaConcesion),
    tipo_beneficiario: r.tipoBeneficiario,
    synced_at: new Date().toISOString(),
  }));

  const { error } = await db.from('subvenciones')
    .upsert(dbRows, { onConflict: 'ejercicio,num_convocatoria,beneficiario', ignoreDuplicates: false });
  if (error) { warn(`BDNS upsert: ${error.message}`); return 0; }

  // Stats
  const totalImporte = allRows.reduce((s,r) => s + r.importe, 0);
  const top100 = allRows.slice(0,100).reduce((s,r) => s + r.importe, 0);
  const tipeTotals = {};
  let grand = 0;
  for (const r of allRows) {
    const t = r.tipoBeneficiario || 'Otros';
    tipeTotals[t] = (tipeTotals[t] ?? 0) + r.importe;
    grand += r.importe;
  }
  const porTipo = Object.entries(tipeTotals)
    .map(([tipo, sum]) => ({ tipo, pct: Math.round((sum/grand)*1000)/10, color: tipoColor(tipo) }))
    .sort((a,b) => b.pct - a.pct).slice(0,6);

  await db.from('subvenciones_stats').upsert({
    ejercicio,
    total_importe: totalImporte,
    num_concesiones: totalElements || allRows.length,
    importe_medio: totalElements > 0 ? totalImporte/totalElements : 0,
    pct_top100: totalImporte > 0 ? Math.round((top100/totalImporte)*1000)/10 : 0,
    por_tipo: porTipo,
    synced_at: new Date().toISOString(),
  }, { onConflict: 'ejercicio' });

  ok(`BDNS ${ejercicio}: ${dbRows.length} concesiones + stats`);
  return dbRows.length;
}

// ─────────────────────────────────────────────
// 3. PLACE — Contratos
// ─────────────────────────────────────────────
function parseAtomContratos(xml) {
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]);
  const seen = new Set();
  const rows = [];
  let n = 0;
  for (const entry of entries) {
    const get = tag => {
      const m = entry.match(new RegExp(`<(?:[^:>]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[^:>]+:)?${tag}>`));
      return m ? m[1].replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim() : '';
    };
    const link = entry.match(/href="([^"]+)"/)?.[1] ?? '';
    const rawId = link.split('/').filter(Boolean).pop() || `place-${++n}`;
    let id = rawId;
    if (seen.has(id)) id = `${rawId}-${++n}`;
    seen.add(id);

    const title = get('title') || 'Contrato sin título';
    const published = get('published') || get('updated') || new Date().toISOString();
    const summary = get('summary');
    const importe = parseFloat(summary.match(/[\d.,]+/)?.[0]?.replace(/\./g,'').replace(',','.') ?? '0') || 0;
    const tipo = title.toLowerCase().includes('obra') ? 'obras'
      : title.toLowerCase().includes('servicio') ? 'servicios'
      : title.toLowerCase().includes('suministro') ? 'suministros' : 'otro';

    rows.push({
      id,
      titulo: title.slice(0,500),
      organo_contratante: get('name') || get('author') || 'Administración Pública',
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
  const res = await tryFetch(PLACE_FEED, { headers: { Accept: 'application/atom+xml,*/*' } });
  if (!res) { warn('PLACE: sin respuesta'); return 0; }

  const text = await res.text();
  const rows = parseAtomContratos(text);
  if (rows.length === 0) { warn('PLACE: sin contratos parseados'); return 0; }

  // Lotes pequeños para evitar el error "conflict affects row twice"
  let total = 0;
  for (let i = 0; i < rows.length; i += 25) {
    const { error } = await db.from('contratos')
      .upsert(rows.slice(i, i+25), { onConflict: 'id', ignoreDuplicates: true });
    if (error) warn(`PLACE lote ${i}: ${error.message}`);
    else total += Math.min(25, rows.length - i);
  }
  ok(`PLACE: ${total} contratos`);
  return total;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
async function main() {
  console.log('\n🚀 GastoPublico.es — Seed de datos reales\n');

  const [i22, i23, i24] = await Promise.all([
    syncIgae(2022), syncIgae(2023), syncIgae(2024),
  ]);
  const bdns  = await syncBdns(2024);
  const place = await syncPlace();

  console.log('\n─────────────────────────────────');
  console.log('Resumen final:');
  console.log(`   IGAE 2022:  ${i22} filas`);
  console.log(`   IGAE 2023:  ${i23} filas`);
  console.log(`   IGAE 2024:  ${i24} filas`);
  console.log(`   BDNS 2024:  ${bdns} concesiones`);
  console.log(`   PLACE:      ${place} contratos`);
  console.log('─────────────────────────────────\n');
}

main().catch(e => { console.error(e); process.exit(1); });
