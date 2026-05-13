'use client';

const ITEMS = [
  { label: 'DEUDA PÚBLICA', value: '1,64 bn €', delta: '+47.800 M€', bad: true },
  { label: 'PARO EPA', value: '11,2%', delta: '2× media UE', bad: true },
  { label: 'GASTO 2024', value: '583 mM€', delta: '+6,4%', bad: true },
  { label: 'INTERESES DEUDA', value: '39,9 mM€', delta: '+38% en 2a', bad: true },
  { label: 'PENSIONES', value: '181,2 mM€', delta: '+10,9%', bad: true },
  { label: 'RECAUDACIÓN', value: '294,7 mM€', delta: 'RÉCORD', bad: false },
  { label: 'ASESORES', value: '740', delta: '+30% desde 2018', bad: true },
  { label: 'MINISTERIOS', value: '22', delta: 'RÉCORD UE', bad: true },
  { label: 'ALTOS CARGOS', value: '678 M€', delta: '+12,1%', bad: true },
  { label: 'SUBV. PARTIDOS', value: '82,4 M€', delta: '+5,2%', bad: true },
  { label: 'AÑOS SIN PGE', value: '7+', delta: 'RÉCORD DEMOCRACIA', bad: true },
  { label: 'FONDOS UE SIN USAR', value: '128.500 M€', delta: 'PLAZO AGO 2026', bad: true },
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
          <span style={{ fontSize: 11, fontWeight: 700, color: it.bad ? 'var(--bad)' : 'var(--good)' }}>
            ▲ {it.delta}
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
