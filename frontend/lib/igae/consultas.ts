import { supabase } from '../supabase';
import { MESES } from './extracto';

export interface PartidaEjecucion {
  nivel: 'seccion' | 'capitulo' | 'total';
  nombre: string;
  orden: number;
  creditosDefinitivos: number;      // euros
  gastosComprometidos: number;
  obligacionesReconocidas: number;
  pagosRealizados: number;
  obligacionesAnterior: number | null; // mismo periodo del ejercicio anterior
}

export interface EjecucionIgae {
  ejercicio: number;
  mes: number;
  fechaCorte: string;
  etiquetaCorte: string;            // «30 de septiembre de 2026»
  fichero: string;
  total: PartidaEjecucion;
  secciones: PartidaEjecucion[];
  capitulos: PartidaEjecucion[];
  totalesMensuales: { mes: number; obligacionesReconocidas: number }[]; // acumulado del ejercicio
}

interface FilaBd {
  ejercicio: number;
  mes: number;
  nivel: 'seccion' | 'capitulo' | 'total';
  nombre: string;
  orden: number;
  fecha_corte: string;
  creditos_definitivos: number;
  gastos_comprometidos: number;
  obligaciones_reconocidas: number;
  pagos_realizados: number;
  fichero: string;
}

const MILES = 1000;

export function etiquetaFecha(fecha: string): string {
  const [a, m, d] = fecha.split('-').map(Number);
  return `${d} de ${MESES[m - 1].toLowerCase()} de ${a}`;
}

// Último extracto cargado: ejercicio corriente + mismo periodo del anterior.
export async function getUltimaEjecucion(): Promise<EjecucionIgae | null> {
  const { data: ultimo, error: e1 } = await supabase
    .from('igae_ejecucion')
    .select('ejercicio, mes')
    .eq('nivel', 'total')
    .order('ejercicio', { ascending: false })
    .order('mes', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (e1 || !ultimo) return null;

  const { ejercicio, mes } = ultimo as { ejercicio: number; mes: number };

  const [{ data: filas, error: e2 }, { data: mensuales, error: e3 }] = await Promise.all([
    supabase
      .from('igae_ejecucion')
      .select('*')
      .eq('mes', mes)
      .in('ejercicio', [ejercicio, ejercicio - 1]),
    supabase
      .from('igae_ejecucion')
      .select('mes, obligaciones_reconocidas')
      .eq('ejercicio', ejercicio)
      .eq('nivel', 'total')
      .order('mes'),
  ]);
  if (e2 || e3 || !filas) return null;

  const actuales = (filas as FilaBd[]).filter(f => f.ejercicio === ejercicio);
  const anteriores = new Map(
    (filas as FilaBd[]).filter(f => f.ejercicio === ejercicio - 1).map(f => [`${f.nivel}|${f.nombre}`, f]),
  );

  const aPartida = (f: FilaBd): PartidaEjecucion => {
    const ant = anteriores.get(`${f.nivel}|${f.nombre}`);
    return {
      nivel: f.nivel,
      nombre: f.nombre,
      orden: f.orden,
      creditosDefinitivos: f.creditos_definitivos * MILES,
      gastosComprometidos: f.gastos_comprometidos * MILES,
      obligacionesReconocidas: f.obligaciones_reconocidas * MILES,
      pagosRealizados: f.pagos_realizados * MILES,
      obligacionesAnterior: ant ? ant.obligaciones_reconocidas * MILES : null,
    };
  };

  const total = actuales.find(f => f.nivel === 'total');
  if (!total) return null;

  return {
    ejercicio,
    mes,
    fechaCorte: total.fecha_corte,
    etiquetaCorte: etiquetaFecha(total.fecha_corte),
    fichero: total.fichero,
    total: aPartida(total),
    secciones: actuales.filter(f => f.nivel === 'seccion').map(aPartida).sort((a, b) => b.obligacionesReconocidas - a.obligacionesReconocidas),
    capitulos: actuales.filter(f => f.nivel === 'capitulo').map(aPartida).sort((a, b) => a.orden - b.orden),
    totalesMensuales: ((mensuales ?? []) as { mes: number; obligaciones_reconocidas: number }[]).map(r => ({
      mes: r.mes,
      obligacionesReconocidas: r.obligaciones_reconocidas * MILES,
    })),
  };
}
