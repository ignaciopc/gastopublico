import Papa from 'papaparse';
import type { BudgetExecution } from '../types';
import { IGAE_CSV_URLS, CURRENT_EJERCICIO } from '../constants';
import { transformBudgetRows } from '../transformers/budget';

export async function fetchIgaeBudget(ejercicio: number = CURRENT_EJERCICIO): Promise<BudgetExecution[]> {
  const csvUrl = IGAE_CSV_URLS[ejercicio];

  if (csvUrl) {
    try {
      const res = await fetch(csvUrl, {
        headers: { 'Accept': 'text/csv,text/plain,*/*' },
        signal: AbortSignal.timeout(10_000),
      });

      if (res.ok) {
        const text = await res.text();
        const parsed = Papa.parse(text, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
        }) as Papa.ParseResult<Record<string, string>>;

        if (parsed.data.length > 0) {
          return transformBudgetRows(parsed.data, ejercicio);
        }
      }
    } catch {
      // Fall through to sample data
    }
  }

  // Fallback: load sample data from public folder
  return loadSampleData(ejercicio);
}

async function loadSampleData(ejercicio: number): Promise<BudgetExecution[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gastopublico.es';
  // Try year-specific file first, then fall back to 2024 data (better than seed)
  for (const year of [ejercicio, 2024]) {
    try {
      const res = await fetch(`${baseUrl}/data/presupuesto-${year}.json`,
        { signal: AbortSignal.timeout(5_000) });
      if (res.ok) {
        const data = await res.json() as BudgetExecution[];
        if (data.length > 0) return data.map(row => ({ ...row, ejercicio }));
      }
    } catch {
      // try next
    }
  }
  return getSeedData(ejercicio);
}

function getSeedData(ejercicio: number): BudgetExecution[] {
  return [
    { ejercicio, seccion: '60', seccionDescripcion: 'Seguridad Social', programa: '271A', programaDescripcion: 'Pensiones contributivas', credIniciales: 145_000_000_000, credModificaciones: 3_200_000_000, credDefinitivos: 148_200_000_000, obligacionesReconocidas: 147_000_000_000, obligacionesPagadas: 145_800_000_000, tasaEjecucion: 99.2 },
    { ejercicio, seccion: '13', seccionDescripcion: 'Min. Empleo', programa: '251M', programaDescripcion: 'Desempleo', credIniciales: 19_000_000_000, credModificaciones: 1_000_000_000, credDefinitivos: 20_000_000_000, obligacionesReconocidas: 18_950_000_000, obligacionesPagadas: 18_200_000_000, tasaEjecucion: 94.8 },
    { ejercicio, seccion: '08', seccionDescripcion: 'Min. Defensa', programa: '122A', programaDescripcion: 'Fuerzas Armadas', credIniciales: 9_200_000_000, credModificaciones: 800_000_000, credDefinitivos: 10_000_000_000, obligacionesReconocidas: 9_450_000_000, obligacionesPagadas: 8_900_000_000, tasaEjecucion: 94.5 },
    { ejercicio, seccion: '16', seccionDescripcion: 'Min. Sanidad', programa: '311A', programaDescripcion: 'Prestaciones sanitarias', credIniciales: 5_400_000_000, credModificaciones: 200_000_000, credDefinitivos: 5_600_000_000, obligacionesReconocidas: 5_180_000_000, obligacionesPagadas: 5_000_000_000, tasaEjecucion: 92.5 },
    { ejercicio, seccion: '20', seccionDescripcion: 'Min. Ciencia', programa: '463A', programaDescripcion: 'Investigación científica', credIniciales: 3_500_000_000, credModificaciones: 200_000_000, credDefinitivos: 3_700_000_000, obligacionesReconocidas: 3_145_000_000, obligacionesPagadas: 2_900_000_000, tasaEjecucion: 85.0 },
    { ejercicio, seccion: '12', seccionDescripcion: 'Min. Educación', programa: '322B', programaDescripcion: 'Educación universitaria', credIniciales: 3_100_000_000, credModificaciones: -50_000_000, credDefinitivos: 3_050_000_000, obligacionesReconocidas: 2_820_000_000, obligacionesPagadas: 2_700_000_000, tasaEjecucion: 92.5 },
    { ejercicio, seccion: '11', seccionDescripcion: 'Min. Transportes', programa: '453B', programaDescripcion: 'Infraestructuras ferroviarias', credIniciales: 6_800_000_000, credModificaciones: 400_000_000, credDefinitivos: 7_200_000_000, obligacionesReconocidas: 6_120_000_000, obligacionesPagadas: 5_800_000_000, tasaEjecucion: 85.0 },
    { ejercicio, seccion: '09', seccionDescripcion: 'Min. Hacienda', programa: '929A', programaDescripcion: 'Gestión tributaria', credIniciales: 2_800_000_000, credModificaciones: 150_000_000, credDefinitivos: 2_950_000_000, obligacionesReconocidas: 2_654_000_000, obligacionesPagadas: 2_530_000_000, tasaEjecucion: 90.0 },
  ];
}
