export interface BudgetExecution {
  ejercicio: number;
  seccion: string;
  seccionDescripcion: string;
  programa: string;
  programaDescripcion: string;
  credIniciales: number;
  credModificaciones: number;
  credDefinitivos: number;
  obligacionesReconocidas: number;
  obligacionesPagadas: number;
  tasaEjecucion: number;
  mes?: number;
}

export interface BudgetSummary {
  ejercicio: number;
  totalCredIniciales: number;
  totalCredDefinitivos: number;
  totalObligacionesReconocidas: number;
  totalObligacionesPagadas: number;
  tasaEjecucionGlobal: number;
  bySeccion: BudgetBySeccion[];
}

export interface BudgetBySeccion {
  seccion: string;
  descripcion: string;
  credDefinitivos: number;
  obligacionesReconocidas: number;
  tasaEjecucion: number;
}

export interface Contract {
  id: string;
  titulo: string;
  organoContratante: string;
  tipo: 'obras' | 'servicios' | 'suministros' | 'otro';
  importe: number;
  estado: 'en_licitacion' | 'adjudicado' | 'resuelto' | 'anulado';
  fechaPublicacion: string;
  fechaAdjudicacion?: string;
  adjudicatario?: string;
  enlace: string;
}

export interface Dataset {
  id: string;
  titulo: string;
  descripcion: string;
  organizacion: string;
  formato: string[];
  ultimaActualizacion: string;
  enlaceDescarga: string;
}

export interface KpiMetric {
  label: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  format: 'currency' | 'percent' | 'number';
  icon?: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    lastUpdated: string;
    source: string;
    cached: boolean;
  };
}

export interface HistoricoSeccion {
  seccion: string;
  descripcion: string;
  datos: Record<number, {
    credDefinitivos: number;
    obligacionesReconocidas: number;
    tasaEjecucion: number;
  }>;
}

export interface HistoricoSummary {
  años: number[];
  secciones: HistoricoSeccion[];
  totales: Record<number, {
    credDefinitivos: number;
    obligacionesReconocidas: number;
    tasaEjecucion: number;
  }>;
}
