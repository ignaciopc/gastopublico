export const IGAE_BASE_URL =
  'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Paginas/';

// IGAE publishes monthly budget execution CSVs. These are the direct download URLs.
// Format: Estado - Ejecución mensual acumulada
export const IGAE_CSV_URLS: Record<number, string> = {
  2024: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2024.csv',
  2023: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2023.csv',
  2022: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2022.csv',
};

export const DATOS_GOB_API = 'https://datos.gob.es/apidata';

// Plataforma de Contratación del Estado - Atom feed
export const CONTRATACION_ATOM_FEED =
  'https://contrataciondelestado.es/sindicacion/sindicacion_1044/PlataformasAgregadasSinMenores.atom';

// Cache TTLs in milliseconds
export const CACHE_TTL = {
  PRESUPUESTO: 60 * 60 * 1000,      // 1 hour - IGAE updates monthly
  CONTRATOS: 30 * 60 * 1000,        // 30 minutes - contracts update more often
  DATASETS: 6 * 60 * 60 * 1000,     // 6 hours
} as const;

export const CURRENT_EJERCICIO = 2024;

export const MINISTERIOS_MAP: Record<string, string> = {
  '01': 'Casa de S.M. el Rey',
  '02': 'Cortes Generales',
  '03': 'Tribunal de Cuentas',
  '04': 'Consejo de Estado',
  '05': 'Presidencia del Gobierno',
  '06': 'Ministerio de Asuntos Exteriores',
  '07': 'Ministerio de Justicia',
  '08': 'Ministerio de Defensa',
  '09': 'Ministerio de Hacienda',
  '10': 'Ministerio del Interior',
  '11': 'Ministerio de Transportes',
  '12': 'Ministerio de Educación',
  '13': 'Ministerio de Empleo',
  '14': 'Ministerio de Industria',
  '15': 'Ministerio de Agricultura',
  '16': 'Ministerio de Sanidad',
  '17': 'Ministerio de Medio Ambiente',
  '18': 'Ministerio de Cultura',
  '19': 'Ministerio de Economía',
  '20': 'Ministerio de Ciencia e Innovación',
  '60': 'Seguridad Social',
};
