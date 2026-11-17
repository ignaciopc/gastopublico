import { NextResponse } from 'next/server';

// Las filas de budget_executions no proceden de la IGAE: eran datos de ejemplo que no
// coinciden con los PGE publicados (ver lib/data/igae.ts). Hasta cargar la ejecución
// oficial, el endpoint no sirve cifras. La implementación anterior está en el historial git.
export async function GET() {
  return NextResponse.json(
    { error: 'Datos de ejecución presupuestaria no disponibles: pendientes de carga desde la IGAE.' },
    { status: 503 },
  );
}
