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
      // Fall through: no data
    }
  }

  // Sin fallback: los ficheros public/data/presupuesto-{2022,2023,2024}.json y el antiguo
  // getSeedData() contenían cifras que no coinciden con los PGE publicados (códigos de
  // sección y programa erróneos; auditoría de datos nov. 2026). Si no hay datos
  // oficiales, se devuelve [] y la UI muestra «datos no disponibles».
  return [];
}
