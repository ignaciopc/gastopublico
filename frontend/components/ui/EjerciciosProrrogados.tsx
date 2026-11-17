// Último PGE aprobado por las Cortes: ejercicio 2023 — Ley 31/2022, de 23 de diciembre (BOE-A-2022-22128).
// 2024, 2025 y 2026 se rigen por prórroga automática (art. 134.4 CE); para 2026 lo recoge el
// preámbulo del Real Decreto-ley 16/2025, de 23 de diciembre (BOE-A-2025-26458).
// Lista fija y verificada a mano: no se extrapola con la fecha actual. Revisar si se aprueba un PGE.
export const ULTIMO_EJERCICIO_APROBADO = 2023;
export const EJERCICIOS_PRORROGADOS = [2024, 2025, 2026];
export const FECHA_VERIFICACION_PRORROGA = '17/11/2026';

export default function EjerciciosProrrogados({ style }: { style?: React.CSSProperties }) {
  return <span style={style}>{EJERCICIOS_PRORROGADOS.length}</span>;
}
