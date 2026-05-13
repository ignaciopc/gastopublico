import type { BudgetExecution, BudgetSummary, BudgetBySeccion } from '../types';

// Maps possible CSV column names from IGAE to our canonical fields.
// The actual column names depend on the specific CSV format published by IGAE.
const COL_MAP: Record<string, string[]> = {
  ejercicio: ['Ejercicio', 'ejercicio', 'AÑO', 'Año'],
  seccion: ['Sección', 'SECCION', 'Seccion', 'seccion', 'SEC'],
  seccionDescripcion: ['Denominación Sección', 'Descripcion Seccion', 'DESC_SECCION'],
  programa: ['Programa', 'PROGRAMA', 'programa', 'COD_PROG'],
  programaDescripcion: ['Denominación Programa', 'Descripcion Programa', 'DESC_PROG'],
  credIniciales: ['Créditos Iniciales', 'Creditos Iniciales', 'CRED_INICIALES', 'C. Iniciales'],
  credModificaciones: ['Modificaciones', 'MODIFICACIONES', 'modificaciones'],
  credDefinitivos: ['Créditos Definitivos', 'Creditos Definitivos', 'CRED_DEFINITIVOS', 'C. Definitivos'],
  obligacionesReconocidas: ['Obligaciones Reconocidas Netas', 'Obligaciones Reconocidas', 'OBL_RECONO', 'Oblig. Reconocidas'],
  obligacionesPagadas: ['Pagos Realizados', 'Pagos', 'PAGOS', 'pagos'],
};

function findColumn(row: Record<string, string>, candidates: string[]): string | undefined {
  return candidates.find(c => c in row);
}

function parseNum(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // Handle Spanish number format: "1.234.567,89"
    const cleaned = val.replace(/\./g, '').replace(',', '.').replace(/[^0-9.-]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export function transformBudgetRows(
  rows: Record<string, unknown>[],
  ejercicio: number
): BudgetExecution[] {
  return rows
    .map(row => {
      const r = row as Record<string, string>;
      const seccionCol = findColumn(r, COL_MAP.seccion);
      const seccion = seccionCol ? String(r[seccionCol]).trim() : '';

      const seccionDescCol = findColumn(r, COL_MAP.seccionDescripcion);
      const seccionDescripcion = seccionDescCol ? String(r[seccionDescCol]).trim() : seccion;

      const programaCol = findColumn(r, COL_MAP.programa);
      const programa = programaCol ? String(r[programaCol]).trim() : '';

      const programaDescCol = findColumn(r, COL_MAP.programaDescripcion);
      const programaDescripcion = programaDescCol ? String(r[programaDescCol]).trim() : programa;

      const credIniciales = parseNum(r[findColumn(r, COL_MAP.credIniciales) ?? '']);
      const credModificaciones = parseNum(r[findColumn(r, COL_MAP.credModificaciones) ?? '']);
      const credDefinitivos = parseNum(r[findColumn(r, COL_MAP.credDefinitivos) ?? '']) || credIniciales + credModificaciones;
      const obligacionesReconocidas = parseNum(r[findColumn(r, COL_MAP.obligacionesReconocidas) ?? '']);
      const obligacionesPagadas = parseNum(r[findColumn(r, COL_MAP.obligacionesPagadas) ?? '']);
      const tasaEjecucion = credDefinitivos > 0 ? (obligacionesReconocidas / credDefinitivos) * 100 : 0;

      return {
        ejercicio,
        seccion,
        seccionDescripcion,
        programa,
        programaDescripcion,
        credIniciales,
        credModificaciones,
        credDefinitivos,
        obligacionesReconocidas,
        obligacionesPagadas,
        tasaEjecucion,
      } satisfies BudgetExecution;
    })
    .filter(r => r.seccion !== '' && r.credDefinitivos > 0);
}

export function summarizeBudget(rows: BudgetExecution[], ejercicio: number): BudgetSummary {
  const totalCredIniciales = rows.reduce((s, r) => s + r.credIniciales, 0);
  const totalCredDefinitivos = rows.reduce((s, r) => s + r.credDefinitivos, 0);
  const totalObligaciones = rows.reduce((s, r) => s + r.obligacionesReconocidas, 0);
  const totalPagados = rows.reduce((s, r) => s + r.obligacionesPagadas, 0);

  // Group by seccion
  const seccionMap = new Map<string, BudgetBySeccion>();
  for (const row of rows) {
    const existing = seccionMap.get(row.seccion);
    if (existing) {
      existing.credDefinitivos += row.credDefinitivos;
      existing.obligacionesReconocidas += row.obligacionesReconocidas;
    } else {
      seccionMap.set(row.seccion, {
        seccion: row.seccion,
        descripcion: row.seccionDescripcion,
        credDefinitivos: row.credDefinitivos,
        obligacionesReconocidas: row.obligacionesReconocidas,
        tasaEjecucion: 0,
      });
    }
  }

  const bySeccion: BudgetBySeccion[] = Array.from(seccionMap.values())
    .map(s => ({
      ...s,
      tasaEjecucion: s.credDefinitivos > 0 ? (s.obligacionesReconocidas / s.credDefinitivos) * 100 : 0,
    }))
    .sort((a, b) => b.obligacionesReconocidas - a.obligacionesReconocidas);

  return {
    ejercicio,
    totalCredIniciales,
    totalCredDefinitivos,
    totalObligacionesReconocidas: totalObligaciones,
    totalObligacionesPagadas: totalPagados,
    tasaEjecucionGlobal: totalCredDefinitivos > 0 ? (totalObligaciones / totalCredDefinitivos) * 100 : 0,
    bySeccion,
  };
}
