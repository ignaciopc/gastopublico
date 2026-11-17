// UNVERIFIED URLs: no public IGAE page links to these CSVs and the daily sync has never
// loaded data from them (sync_log shows the old 8-row seed being written instead).
// IGAE publishes monthly execution as PDFs under Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria.
export const IGAE_CSV_URLS: Record<number, string> = {
  2025: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2025.csv',
  2024: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2024.csv',
  2023: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2023.csv',
  2022: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2022.csv',
};

export const DATOS_GOB_API = 'https://datos.gob.es/apidata';

// PLACSP feed of tenders published through AGGREGATION (regional/other platforms), excluding
// contratos menores. It is NOT the feed of State-sector contracting profiles (sindicacion_643).
export const CONTRATACION_ATOM_FEED =
  'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores.atom';

// Cache TTLs in milliseconds
export const CACHE_TTL = {
  PRESUPUESTO: 60 * 60 * 1000,      // 1 hour - IGAE updates monthly
  CONTRATOS: 30 * 60 * 1000,        // 30 minutes - contracts update more often
  DATASETS: 6 * 60 * 60 * 1000,     // 6 hours
} as const;

export const CURRENT_EJERCICIO = 2025;
