'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';

const IRPF_TRAMOS = [
  [12450, 0.19], [20200, 0.24], [35200, 0.30],
  [60000, 0.37], [300000, 0.45], [Infinity, 0.47],
] as [number, number][];

const AJUSTE_CCAA: Record<string, number> = {
  'Madrid': -0.04, 'Cataluña': 0.03, 'Andalucía': -0.02,
  'C. Valenciana': 0.02, 'P. Vasco': -0.06, 'Galicia': 0.01,
};

const DESTINOS = [
  { nombre: 'Pensiones', pct: 34.6, color: 'var(--accent)' },
  { nombre: 'Pago de la deuda e intereses', pct: 12.4, color: '#a31a30' },
  { nombre: 'Sanidad (transferencia CCAA)', pct: 9.8, color: '#7d1525' },
  { nombre: 'Desempleo y prestaciones', pct: 7.6, color: '#5a1019' },
  { nombre: 'Educación (transf. CCAA)', pct: 6.4, color: '#4a4a45' },
  { nombre: 'Defensa y seguridad', pct: 5.9, color: '#3a3a35' },
  { nombre: 'Infraestructuras y transportes', pct: 4.2, color: '#2a2a25' },
  { nombre: 'Administración y altos cargos', pct: 3.8, color: '#1f1f1d' },
  { nombre: 'Subvenciones empresas y ONG', pct: 3.1, color: '#7a6b1c' },
  { nombre: 'RTVE y entes públicos', pct: 0.9, color: '#6b1c5e' },
  { nombre: 'Casa Real y Cortes', pct: 0.4, color: '#5a1c4a' },
  { nombre: 'Otros gastos', pct: 10.9, color: '#888880' },
];

function calcImpuestos(salario: number, hijos: number, comunidad: string) {
  const baseSS = Math.min(salario, 53946);
  const ss = baseSS * 0.0645;
  const baseImponible = salario - ss;
  let irpf = 0;
  let prev = 0;
  let restante = baseImponible;
  for (const [tope, tipo] of IRPF_TRAMOS) {
    const ancho = Math.min(restante, tope - prev);
    if (ancho <= 0) break;
    irpf += ancho * tipo;
    restante -= ancho;
    prev = tope;
  }
  const minimo = 5550 + (hijos > 0 ? 2400 : 0) + (hijos > 1 ? 2700 : 0) + (hijos > 2 ? 4000 : 0);
  irpf = Math.max(0, irpf - minimo * 0.19);
  irpf = irpf * (1 + (AJUSTE_CCAA[comunidad] ?? 0));
  const totalImpuestos = ss + irpf;
  const neto = salario - totalImpuestos;
  const tipoEfectivo = (totalImpuestos / salario) * 100;
  const diasPorImpuestos = Math.round(365 * (totalImpuestos / salario));
  const liberacion = new Date(new Date().getFullYear(), 0, 1);
  liberacion.setDate(liberacion.getDate() + diasPorImpuestos);
  const ivaEstimado = neto * 0.78 * 0.135;
  const otrosIndirectos = salario * 0.028;
  const totalReal = totalImpuestos + ivaEstimado + otrosIndirectos;
  const tipoEfectivoReal = (totalReal / salario) * 100;
  return { ss, irpf, neto, totalImpuestos, tipoEfectivo, netoMensual: neto / 14, diasPorImpuestos, liberacion, ivaEstimado, otrosIndirectos, totalReal, tipoEfectivoReal };
}

function fmt(n: number) { return Math.round(n).toLocaleString('es-ES'); }

const thStyle: React.CSSProperties = {
  padding: '11px 18px', fontSize: 10.5, fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)',
  borderBottom: '1px solid var(--card-border)',
  fontFamily: 'var(--font-mono), monospace',
};

export default function ImpuestometroPage() {
  const [salario, setSalario] = useState(28000);
  const [hijos, setHijos] = useState(0);
  const [comunidad, setComunidad] = useState('Madrid');

  const calc = useMemo(() => calcImpuestos(salario, hijos, comunidad), [salario, hijos, comunidad]);

  return (
    <>
      <PageHeader
        eyebrow="Calculadora · Impuestómetro 2024"
        title="¿Cuánto trabajas para el Estado y cuánto para ti?"
        lede="Mueve el slider con tu sueldo bruto anual y descubre, al céntimo, qué se queda Hacienda, qué se queda la Seguridad Social, y a qué partidas concretas se destina cada euro tuyo."
        meta={[
          { k: 'Datos', v: 'Tramos IRPF 2024' },
          { k: 'Cuotas SS', v: 'Régimen General 6,45%' },
          { k: 'Nota', v: 'Sin deducciones especiales' },
        ]}
      />

      {/* Calculadora */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 56, alignItems: 'start' }}>
            {/* Input */}
            <div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, padding: 28, background: 'var(--card)' }}>
                <div className="eyebrow-muted" style={{ marginBottom: 8 }}>Tu sueldo bruto anual</div>
                <div className="mono" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 18 }}>
                  {fmt(salario)}<span style={{ fontSize: 22, color: 'var(--muted)', marginLeft: 6 }}>€</span>
                </div>
                <input
                  type="range" min={12000} max={120000} step={500}
                  value={salario} onChange={e => setSalario(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent)', margin: 0 }}
                />
                <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                  <span>12.000 €</span><span>SMI 16.576 €</span><span>120.000 €</span>
                </div>

                <div style={{ marginTop: 26, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div>
                    <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Hijos a cargo</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[0, 1, 2, 3].map(n => (
                        <button key={n} onClick={() => setHijos(n)} style={{
                          flex: 1, padding: '10px 0', border: '1px solid var(--card-border)',
                          background: hijos === n ? 'var(--accent)' : 'transparent',
                          color: hijos === n ? '#fff' : 'var(--foreground)',
                          fontFamily: 'var(--font-mono), monospace', fontSize: 13, fontWeight: 600,
                          borderRadius: 3,
                        }}>{n === 3 ? '3+' : n}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Comunidad autónoma</div>
                    <select value={comunidad} onChange={e => setComunidad(e.target.value)} style={{
                      width: '100%', padding: '10px 12px', border: '1px solid var(--card-border)',
                      background: 'var(--background)', color: 'var(--foreground)',
                      borderRadius: 3, fontSize: 13, fontFamily: 'inherit',
                    }}>
                      {Object.keys(AJUSTE_CCAA).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Día de liberación */}
              <div style={{ marginTop: 24, padding: 24, background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 4 }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>Tu día de liberación fiscal</div>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.02em', marginBottom: 8 }}>
                  {calc.liberacion.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0, color: 'var(--foreground)' }}>
                  Trabajas <strong>{calc.diasPorImpuestos} días al año</strong> exclusivamente
                  para pagar impuestos y cotizaciones. A partir del{' '}
                  {calc.liberacion.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} empiezas a cobrar para ti.
                </p>
              </div>
            </div>

            {/* Desglose */}
            <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', background: 'var(--background)' }}>
                <div className="eyebrow-muted">Desglose anual</div>
              </div>
              {[
                { label: 'Sueldo bruto', value: fmt(salario), unit: '€', emphasis: true },
                { label: 'Seguridad Social (6,45%)', value: '−' + fmt(calc.ss), unit: '€', sub: 'A tu nombre, gestionada por TGSS' },
                { label: 'IRPF', value: '−' + fmt(calc.irpf), unit: '€', sub: `Tipo efectivo ${calc.tipoEfectivo.toFixed(1)}%`, alarm: true },
                { label: 'Sueldo neto anual', value: fmt(calc.neto), unit: '€', emphasis: true, last: true },
              ].map(row => (
                <div key={row.label} style={{
                  padding: '18px 24px',
                  borderBottom: row.last ? 0 : '1px solid var(--rule)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: row.emphasis ? 700 : 500 }}>{row.label}</div>
                    {row.sub && <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{row.sub}</div>}
                  </div>
                  <div className="mono" style={{
                    fontSize: row.emphasis ? 22 : 18, fontWeight: 600, letterSpacing: '-0.02em',
                    color: row.alarm ? 'var(--accent)' : 'var(--foreground)',
                  }}>
                    {row.value}<span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 4 }}>{row.unit}</span>
                  </div>
                </div>
              ))}
              <div style={{
                padding: '20px 24px', borderTop: '1px solid var(--card-border)',
                background: 'var(--background)', display: 'flex', justifyContent: 'space-between',
              }}>
                <span className="eyebrow-muted">Neto mensual (×14 pagas)</span>
                <span className="mono" style={{ fontWeight: 700, fontSize: 16 }}>{fmt(calc.netoMensual)} €</span>
              </div>
              {/* Total al Estado */}
              <div style={{
                padding: '20px 24px', background: 'var(--accent)', color: '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Total al Estado este año
                </span>
                <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{fmt(calc.totalImpuestos)} €</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* A dónde va tu dinero */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--rule)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>A dónde va tu dinero</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
            De cada euro que pagas, así se reparte:
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--muted-strong)', margin: '0 0 28px' }}>
            Los <strong>{fmt(calc.totalImpuestos)} €</strong> que pagarás este año en impuestos
            y cotizaciones se distribuyen aproximadamente así (% PGE 2024).
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'hidden' }}>
            {DESTINOS.map((d, i) => {
              const monto = (calc.totalImpuestos * d.pct) / 100;
              return (
                <div key={d.nombre} style={{
                  padding: '16px 24px',
                  borderBottom: i === DESTINOS.length - 1 ? 0 : '1px solid var(--rule)',
                  display: 'grid', gridTemplateColumns: '260px 1fr 130px 70px',
                  gap: 20, alignItems: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.nombre}</div>
                  <div style={{ height: 6, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
                    <div style={{ height: '100%', width: `${Math.min(d.pct * 2.5, 100)}%`, background: d.color }} />
                  </div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
                    {fmt(monto)}<span style={{ color: 'var(--muted)', marginLeft: 4 }}>€</span>
                  </div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'right' }}>{d.pct}%</div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
            * Distribución aproximada basada en el PGE 2024. No incluye IVA, IIVTNU, IBI ni otros impuestos indirectos que añaden ~10–15 pp al tipo efectivo real.
          </p>
        </div>
      </section>

      {/* Carga fiscal real con impuestos indirectos */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>La carga fiscal real (con impuestos indirectos)</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
            Lo que Hacienda no cuenta: el IVA y los indirectos
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--muted-strong)', margin: '0 0 28px' }}>
            El IRPF y la SS son solo la parte visible. Cuando gastas tu neto, pagas IVA, impuesto de carburantes,
            IBI, tasas municipales, impuesto sobre alcohol y tabaco... La carga real es considerablemente mayor.
          </p>

          {/* Comparación de 3 columnas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
            {[
              {
                label: 'SS + IRPF',
                sub: 'Impuestos directos visibles',
                value: fmt(calc.totalImpuestos),
                pct: calc.tipoEfectivo,
                muted: true,
              },
              {
                label: '+ IVA estimado',
                sub: '78% del neto en consumo × 13,5%',
                value: fmt(calc.totalImpuestos + calc.ivaEstimado),
                pct: ((calc.totalImpuestos + calc.ivaEstimado) / salario) * 100,
                muted: false,
              },
              {
                label: '+ Otros indirectos',
                sub: 'Carburantes, IBI, tasas, etc.',
                value: fmt(calc.totalReal),
                pct: calc.tipoEfectivoReal,
                muted: false,
                highlight: true,
              },
            ].map((col, i) => (
              <div key={col.label} style={{
                padding: '24px 22px',
                background: col.highlight ? 'var(--accent)' : 'var(--card)',
                borderRight: i < 2 ? '1px solid var(--card-border)' : 0,
              }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: col.highlight ? 'rgba(255,255,255,0.7)' : 'var(--muted)',
                  fontFamily: 'var(--font-mono), monospace', marginBottom: 10,
                }}>
                  {col.label}
                </div>
                <div className="mono" style={{
                  fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 6,
                  color: col.highlight ? '#fff' : 'var(--foreground)',
                }}>
                  {col.value} €
                </div>
                <div className="mono" style={{
                  fontSize: 20, fontWeight: 600, marginBottom: 8,
                  color: col.highlight ? 'rgba(255,255,255,0.85)' : 'var(--accent)',
                }}>
                  {col.pct.toFixed(1)}%
                </div>
                <div style={{
                  fontSize: 12, lineHeight: 1.4,
                  color: col.highlight ? 'rgba(255,255,255,0.65)' : 'var(--muted-strong)',
                }}>
                  {col.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Tipo efectivo real prominente */}
          <div style={{
            padding: '24px 28px',
            border: '1px solid var(--card-border)',
            borderRadius: 4,
            background: 'var(--card)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 20,
            marginBottom: 16,
          }}>
            <div>
              <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Tipo efectivo REAL</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span className="mono" style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--accent)' }}>
                  {calc.tipoEfectivoReal.toFixed(1)}%
                </span>
                <div>
                  <div style={{ fontSize: 14, color: 'var(--muted-strong)', marginBottom: 4 }}>
                    de tu salario bruto va al sector público
                  </div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>
                    Media UE: ~42% · España: ~45–47%
                  </div>
                </div>
              </div>
            </div>
            <div style={{
              padding: '16px 20px',
              background: 'var(--accent-light)',
              border: '1px solid var(--accent)',
              borderRadius: 4,
              fontSize: 13,
              lineHeight: 1.5,
              maxWidth: 320,
            }}>
              <strong style={{ color: 'var(--accent)' }}>Contexto europeo:</strong> España tiene una de las cargas
              fiscales reales más altas de la eurozona cuando se incluyen todos los impuestos indirectos.
              La media de la UE-27 se sitúa en torno al <strong>42%</strong>.
            </div>
          </div>

          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
            * IVA estimado sobre consumo del neto. Cifra orientativa. Los otros indirectos incluyen IEDMT, hidrocarburos, IBI y tasas estimados como 2,8% del bruto. Elaboración propia.
          </p>
        </div>
      </section>
    </>
  );
}
