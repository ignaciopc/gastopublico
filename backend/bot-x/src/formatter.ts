import type { ContratoRow, SubvencionRow } from './supabase';

function fmtEUR(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2).replace('.', ',')} MM€`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace('.', ',')} M€`;
  return `${Math.round(n).toLocaleString('es-ES')} €`;
}

export function tweetContrato(c: ContratoRow): string {
  const estado = c.estado === 'adjudicado' ? '✅ ADJUDICADO' : '📋 LICITACIÓN';
  const adjudicatario = c.adjudicatario ? `\n🏢 Adjudicatario: ${c.adjudicatario}` : '';
  const lines = [
    `${estado} — ${fmtEUR(c.importe)}`,
    ``,
    `📌 ${c.titulo.slice(0, 120)}${c.titulo.length > 120 ? '…' : ''}`,
    `🏛️ ${c.organo_contratante.slice(0, 60)}`,
    adjudicatario,
    ``,
    `💰 Tu dinero. Datos oficiales PLACE.`,
    ``,
    c.enlace ?? 'https://gastopublico.es/contratos',
    ``,
    `#GastoPublico #Contratos #Transparencia`,
  ].filter(l => l !== undefined);

  return lines.join('\n').slice(0, 280);
}

export function tweetSubvencion(s: SubvencionRow): string {
  const lines = [
    `💸 SUBVENCIÓN — ${fmtEUR(s.importe)}`,
    ``,
    `📌 ${s.descripcion.slice(0, 100)}${s.descripcion.length > 100 ? '…' : ''}`,
    `🏛️ Convocante: ${s.convocante.slice(0, 60)}`,
    `🏢 Beneficiario: ${s.beneficiario.slice(0, 60)}`,
    ``,
    `💰 Datos oficiales BDNS.`,
    ``,
    s.enlace ?? 'https://gastopublico.es/subvenciones',
    ``,
    `#GastoPublico #Subvenciones #Transparencia`,
  ];

  return lines.join('\n').slice(0, 280);
}
