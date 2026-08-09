'use client';

// Patrón: la etiqueta de variación lleva el dato de contraste, no un superlativo.
const ITEMS = [
  { label: 'DEUDA PÚBLICA', value: '1,64 bn €', delta: '+47.800 M€ vs 2023' },
  { label: 'PARO EPA', value: '11,2%', delta: 'media UE: 5,9%' },
  { label: 'GASTO 2024', value: '583 mM€', delta: '+6,4% vs 2023' },
  { label: 'INTERESES DEUDA', value: '39,9 mM€', delta: '+38% en 2 años' },
  { label: 'PENSIONES', value: '181,2 mM€', delta: '+10,9% vs 2023' },
  { label: 'RECAUDACIÓN', value: '294,7 mM€', delta: '+8,4% vs 2023' },
  { label: 'PERSONAL EVENTUAL', value: '740', delta: '+30% desde 2018' },
  { label: 'MINISTERIOS', value: '22', delta: 'media UE: 14' },
  { label: 'ALTOS CARGOS', value: '678 M€', delta: '+12,1% vs 2023' },
  { label: 'SUBV. PARTIDOS', value: '82,4 M€', delta: '+5,2% vs 2023' },
  { label: 'PGE PRORROGADOS', value: '3er ejercicio', delta: 'último PGE: 2023' },
  { label: 'FONDOS UE SIN EJECUTAR', value: '128.500 M€', delta: 'plazo ago 2026' },
];

function Track() {
  return (
    <div style={{ display: 'inline-flex', flexShrink: 0 }}>
      {ITEMS.map((it, i) => (
        <span key={i} style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '0 22px',
          borderRight: '1px solid var(--rule)',
          whiteSpace: 'nowrap',
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: 12,
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: 'var(--muted)' }}>
            {it.label}
          </span>
          <span style={{ fontWeight: 600 }}>{it.value}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted-strong)' }}>
            {it.delta}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function EditorialTicker() {
  return (
    <div style={{
      borderTop: '1px solid var(--rule)',
      borderBottom: '1px solid var(--rule)',
      background: 'var(--surface)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 2,
        padding: '0 14px',
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--accent)', color: '#fff',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'pulse 1.6s ease-in-out infinite' }} />
        <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', fontFamily: 'var(--font-mono), ui-monospace, monospace' }}>
          EN DIRECTO
        </span>
      </div>
      <div style={{
        padding: '10px 0 10px 130px',
        display: 'flex',
        animation: 'marquee 60s linear infinite',
        width: 'max-content',
      }}>
        <Track />
        <Track />
      </div>
    </div>
  );
}
