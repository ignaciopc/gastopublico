import { NextResponse } from 'next/server';
import { getUltimaEjecucion } from '@/lib/igae/consultas';
import { IGAE_EXTRACTO_PAGINA } from '@/lib/sync/igae';

export const revalidate = 3600;

// Último extracto de ejecución del Presupuesto del Estado cargado desde la IGAE.
// Importes en euros (la IGAE los publica en miles de euros).
export async function GET() {
  const datos = await getUltimaEjecucion();
  if (!datos) {
    return NextResponse.json({ error: 'Datos de ejecución presupuestaria no disponibles.' }, { status: 503 });
  }
  return NextResponse.json({
    fuente: 'IGAE · Extracto de ejecución del Presupuesto. Administración General del Estado',
    fuenteUrl: IGAE_EXTRACTO_PAGINA,
    unidad: 'euros',
    ...datos,
  });
}
