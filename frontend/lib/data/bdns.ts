// BDNS — Base de Datos Nacional de Subvenciones
// REST API: https://www.pap.hacienda.gob.es/bdnstrans/api/

export interface BdnsConcesion {
  numConvocatoria: string;
  descripcion: string;
  organoConvocante: string;
  beneficiario: string;
  importe: number;
  fechaConcesion: string;
  tipoBeneficiario: string;
}

export interface BdnsPage {
  content: BdnsConcesion[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface BdnsStats {
  totalImporte: number;
  numConcesiones: number;
  importeMedio: number;
  pctTop100: number;
  porTipo: Array<{ tipo: string; pct: number; color: string }>;
}

// Correct REST API base (discovered from Angular bundle)
const BDNS_API = 'https://www.pap.hacienda.gob.es/bdnstrans/api';

// nivel1 is the level of the GRANTING administration, not the beneficiary type.
// 'ESTATAL' never matches (BDNS uses another code), so State bodies end up in 'Otros'.
function nivelToTipo(nivel1: string): string {
  const n = (nivel1 || '').toUpperCase();
  if (n === 'ESTATAL') return 'Administración General del Estado';
  if (n.includes('AUTON')) return 'Administración Autonómica';
  if (n === 'LOCAL') return 'Administración Local';
  return 'Otros';
}

// Strip NIF/CIF prefix from beneficiario names like "P4600250G MANCOMUNIDAD..."
function cleanBeneficiario(raw: string): string {
  return raw.replace(/^[A-Z0-9]{8,10}\s+/, '').trim();
}

function normalizeConcesion(raw: Record<string, unknown>): BdnsConcesion {
  return {
    numConvocatoria: String(raw.numeroConvocatoria ?? raw.codConcesion ?? raw.id ?? ''),
    descripcion: String(raw.convocatoria ?? raw.descripcionCooficial ?? raw.instrumento ?? ''),
    organoConvocante: String(raw.nivel3 ?? raw.nivel2 ?? raw.nivel1 ?? ''),
    beneficiario: cleanBeneficiario(String(raw.beneficiario ?? '')),
    importe: Number(raw.importe ?? 0),
    fechaConcesion: String(raw.fechaConcesion ?? ''),
    tipoBeneficiario: nivelToTipo(String(raw.nivel1 ?? '')),
  };
}

// The rows synced with anio=2024 have fecha_concesion between 2026-04-30 and 2026-11-13,
// so `anio` does not filter by year of concession: treat results as "latest concessions".
export async function fetchBdnsConcesiones(
  anio: number,
  page = 0,
  pageSize = 100
): Promise<BdnsPage> {
  const url =
    `${BDNS_API}/concesiones/busqueda` +
    `?anio=${anio}&page=${page}&pageSize=${pageSize}`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'GastoPublico.es/1.0 (transparencia fiscal)',
    },
    signal: AbortSignal.timeout(12_000),
    next: { revalidate: 21600 }, // 6h en Next.js
  });

  if (!res.ok) throw new Error(`BDNS HTTP ${res.status}`);

  const json = (await res.json()) as {
    content?: Record<string, unknown>[];
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
  };

  const content = (json.content ?? []).map(normalizeConcesion);

  // Sort by importe descending (API doesn't support server-side sort by importe)
  content.sort((a, b) => b.importe - a.importe);

  return {
    content,
    totalElements: json.totalElements ?? 0,
    totalPages: json.totalPages ?? 0,
    number: json.number ?? 0,
    size: json.size ?? pageSize,
  };
}

// Antes devolvía un «top» y unas estadísticas atribuidas a un «informe anual BDNS 2024»
// que no se ha localizado (la Memoria IGAE 2024 no contiene esas cifras). Se mantiene la firma porque lib/sync/subvenciones.ts
// la importa; ahora no aporta cifras: los agregados se calculan en /api/subvenciones
// sobre las concesiones realmente sincronizadas.
/** @deprecated No contiene datos. */
export function getBdnsSeedData(anio: number): {
  top: BdnsConcesion[];
  stats: BdnsStats;
} {
  void anio;
  return {
    top: [],
    stats: { totalImporte: 0, numConcesiones: 0, importeMedio: 0, pctTop100: 0, porTipo: [] },
  };
}
