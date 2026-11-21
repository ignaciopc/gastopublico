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
