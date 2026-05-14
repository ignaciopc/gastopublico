import Link from 'next/link';
import { formatEUR, formatNumber } from '@/lib/formatters';

export const revalidate = 86400;

type Partida = { label: string; importe: number; nota: string; tipo: 'oficial' | 'estimacion' };

const PARTIDAS_ESTADO: Partida[] = [
  { label: 'Acogida humanitaria y asilo (Prog. 231N)', importe: 496_100_000, nota: 'Centros de acogida, CIEs, CEAR, Cruz Roja, Accem', tipo: 'oficial' },
  { label: 'MENA — Menores no acompañados', importe: 420_000_000, nota: 'Transferencias a CCAA para tutela, acogida y educación', tipo: 'oficial' },
  { label: 'FAMI — Fondo UE de Asilo y Migración', importe: 267_200_000, nota: 'Fondos europeos gestionados por España (2021–2027)', tipo: 'oficial' },
  { label: 'Integración social de inmigrantes', importe: 185_000_000, nota: 'Planes de integración, formación, inserción laboral', tipo: 'oficial' },
  { label: 'Control de fronteras (parte asignada)', importe: 354_400_000, nota: 'Guardia Civil + Policía Nacional (prorrateado por actividad migratoria)', tipo: 'estimacion' },
  { label: 'Gestión de flujos migratorios (Prog. 231E)', importe: 124_300_000, nota: 'Tramitación visados, regularizaciones, acuerdos bilaterales', tipo: 'oficial' },
];

const PARTIDAS_CCAA = [
  { ccaa: 'Cataluña', importe: 980_000_000, concepto: 'Sanidad + educación + servicios sociales' },
  { ccaa: 'Madrid', importe: 820_000_000, concepto: 'Sanidad + educación + servicios sociales' },
  { ccaa: 'Andalucía', importe: 610_000_000, concepto: 'Sanidad + educación + servicios sociales' },
  { ccaa: 'Comunitat Valenciana', importe: 420_000_000, concepto: 'Sanidad + educación + servicios sociales' },
  { ccaa: 'Murcia', importe: 180_000_000, concepto: 'Sanidad + educación + servicios sociales' },
  { ccaa: 'Canarias', importe: 310_000_000, concepto: 'MENA + sanidad + educación (llegadas irregulares)' },
  { ccaa: 'Resto CCAA', importe: 1_080_000_000, concepto: 'Distribución estimada restante' },
];

const EVOLUCION = [
  { year: 2018, importe: 890, solicitudesAsilo: 54_050 },
  { year: 2019, importe: 1_020, solicitudesAsilo: 118_264 },
  { year: 2020, importe: 1_180, solicitudesAsilo: 88_762 },
  { year: 2021, importe: 1_310, solicitudesAsilo: 65_322 },
  { year: 2022, importe: 1_510, solicitudesAsilo: 118_796 },
  { year: 2023, importe: 1_690, solicitudesAsilo: 145_698 },
  { year: 2024, importe: 1_847, solicitudesAsilo: 163_220 },
];

const COMPARATIVA_EU = [
  { pais: '🇩🇪 Alemania', gasto_pib: '0,8%', importe_hab: '412 €', inmigrantes_pct: '18,4%' },
  { pais: '🇫🇷 Francia', gasto_pib: '0,6%', importe_hab: '298 €', inmigrantes_pct: '13,5%' },
  { pais: '🇮🇹 Italia', gasto_pib: '0,4%', importe_hab: '187 €', inmigrantes_pct: '10,6%' },
  { pais: '🇪🇸 España', gasto_pib: '0,35%', importe_hab: '193 €', inmigrantes_pct: '17,9%' },
  { pais: '🇸🇪 Suecia', gasto_pib: '1,1%', importe_hab: '623 €', inmigrantes_pct: '20,1%' },
  { pais: '🇳🇱 Países Bajos', gasto_pib: '0,7%', importe_hab: '381 €', inmigrantes_pct: '14,2%' },
];

const TOTAL_ESTADO = PARTIDAS_ESTADO.reduce((s, p) => s + p.importe, 0);
const TOTAL_CCAA = PARTIDAS_CCAA.reduce((s, p) => s + p.importe, 0);

export default function InmigracionPage() {
  const maxEstado = PARTIDAS_ESTADO[0].importe;
  const maxCCAA = PARTIDAS_CCAA[0].importe;
  const maxEvo = Math.max(...EVOLUCION.map(e => e.importe));

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '52px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>GastoPublico.es</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Inmigración</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 12, color: 'rgba(255,255,255,0.5)' }}>
            PGE 2024 · Secretaría de Estado de Migraciones · IGAE
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 16px', color: '#ededeb' }}>
            ¿Cuánto gasta España<br />en inmigración?
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 680, margin: '0 0 32px' }}>
            Los datos oficiales del Presupuesto General del Estado 2024 muestran{' '}
            <strong style={{ color: '#ededeb' }}>1.847 millones de euros</strong>{' '}
            en partidas directas. Si sumamos lo que gastan las Comunidades Autónomas en sanidad,
            educación y servicios sociales, la cifra supera los{' '}
            <strong style={{ color: '#ef4d68' }}>6.000 millones de euros anuales</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', maxWidth: 860 }}>
            {[
              { label: 'Gasto Estado directo', value: '1.847 M€', sub: 'Partidas PGE 2024' },
              { label: 'Estimado total (+ CCAA)', value: '+6.000 M€', sub: 'Incluyendo sanidad y educación' },
              { label: 'Por habitante', value: '193 €', sub: 'Cada español al año' },
              { label: 'Inmigrantes en España', value: '8,5 M', sub: '17,9% de la población — INE' },
            ].map((k, i, arr) => (
              <div key={k.label} style={{ padding: '18px 20px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: '#ededeb', letterSpacing: '-0.02em' }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTIDAS ESTADO ─────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Presupuesto General del Estado 2024</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Gasto directo del Estado central
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.08em', marginBottom: 2 }}>TOTAL</div>
              <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', color: 'var(--bad)' }}>
                {formatEUR(TOTAL_ESTADO, true)}
              </div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 12 }}>
            {PARTIDAS_ESTADO.map((p, i) => {
              const pct = Math.round((p.importe / maxEstado) * 100);
              const share = ((p.importe / TOTAL_ESTADO) * 100).toFixed(1);
              return (
                <div key={p.label} style={{ padding: '16px 20px', borderBottom: i < PARTIDAS_ESTADO.length - 1 ? '1px solid var(--rule)' : 0, background: 'var(--card)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.label}</span>
                        <span style={{
                          fontSize: 9, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase',
                          padding: '2px 6px', borderRadius: 2,
                          border: `1px solid ${p.tipo === 'oficial' ? 'rgba(39,174,96,0.5)' : 'rgba(230,126,34,0.5)'}`,
                          color: p.tipo === 'oficial' ? '#27ae60' : '#e67e22',
                          background: p.tipo === 'oficial' ? 'rgba(39,174,96,0.06)' : 'rgba(230,126,34,0.06)',
                          fontFamily: 'var(--font-mono), monospace', flexShrink: 0,
                        }}>
                          {p.tipo === 'oficial' ? 'OFICIAL' : 'ESTIMACIÓN'}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.nota}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{share}%</span>
                      <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono), monospace' }}>{formatEUR(p.importe, true)}</span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: p.tipo === 'oficial' ? 'var(--accent)' : '#e67e22', borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
            Fuentes: PGE 2024 (Ministerio de Hacienda), IGAE, Secretaría de Estado de Migraciones.
            La partida de control de fronteras es una estimación prorrateada del presupuesto de Guardia Civil y Policía Nacional
            por su dedicación a actividad migratoria (aprox. 35%).
          </p>
        </div>
      </section>

      {/* ── CCAA ────────────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Estimación · CCAA · 2024</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Gasto de las Comunidades Autónomas
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0, maxWidth: 640 }}>
                Las CCAA asumen el coste de sanidad universal, educación pública y servicios sociales
                para todos los residentes, incluidos los inmigrantes. Estos datos son estimaciones basadas
                en el padrón municipal y los presupuestos autonómicos publicados.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.08em', marginBottom: 2 }}>TOTAL CCAA ESTIMADO</div>
              <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', color: 'var(--bad)' }}>
                ~{formatEUR(TOTAL_CCAA, true)}
              </div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
            {PARTIDAS_CCAA.map((p, i) => {
              const pct = Math.round((p.importe / maxCCAA) * 100);
              return (
                <div key={p.ccaa} style={{ padding: '14px 20px', borderBottom: i < PARTIDAS_CCAA.length - 1 ? '1px solid var(--rule)' : 0, background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7, gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{p.ccaa}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>{p.concepto}</div>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', flexShrink: 0 }}>
                      ~{formatEUR(p.importe, true)}
                    </span>
                  </div>
                  <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 5, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2, opacity: 0.7 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: '14px 16px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 4, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: 12.5, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.55 }}>
              <strong>Nota metodológica:</strong> El gasto de las CCAA es una estimación calculada aplicando
              el porcentaje de población inmigrante de cada comunidad (según INE 2024) al gasto total en sanidad,
              educación y servicios sociales. No es gasto exclusivo: estas mismas partidas cubren a toda la
              población residente. Las cifras reales pueden variar según la tasa de utilización efectiva de servicios.
            </p>
          </div>
        </div>
      </section>

      {/* ── EVOLUCIÓN HISTÓRICA ──────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>2018–2024</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Evolución del gasto en inmigración
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 28px' }}>
            El gasto ha crecido un <strong>107%</strong> en seis años, paralelo al aumento de solicitudes de asilo.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Año', 'Gasto Estado (M€)', 'Variación', 'Solicitudes de asilo', '% vs 2018'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i === 0 ? 'left' : 'right', borderBottom: '1px solid var(--card-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {EVOLUCION.map((row, i) => {
                  const prev = i > 0 ? EVOLUCION[i - 1].importe : null;
                  const delta = prev ? (((row.importe - prev) / prev) * 100).toFixed(1) : null;
                  const pctBase = (((row.importe - EVOLUCION[0].importe) / EVOLUCION[0].importe) * 100).toFixed(0);
                  const isLast = i === EVOLUCION.length - 1;
                  return (
                    <tr key={row.year} style={{ background: isLast ? 'color-mix(in srgb, var(--accent) 5%, var(--card))' : i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td style={{ padding: '11px 16px', fontWeight: isLast ? 700 : 500, fontSize: 13.5, borderBottom: '1px solid var(--rule)' }}>{row.year}{isLast && ' 🔴'}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--rule)', color: isLast ? 'var(--bad)' : 'inherit' }}>{row.importe.toLocaleString('es-ES')}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)', color: delta ? 'var(--bad)' : 'var(--muted)' }}>{delta ? `+${delta}%` : '—'}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{formatNumber(row.solicitudesAsilo)}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)', color: 'var(--bad)' }}>{i === 0 ? 'base' : `+${pctBase}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mini bar chart de evolución */}
          <div style={{ marginTop: 24, display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {EVOLUCION.map(e => {
              const h = Math.round((e.importe / maxEvo) * 100);
              const isLast = e.year === 2024;
              return (
                <div key={e.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', height: `${h}%`, background: isLast ? '#8a1428' : 'var(--accent)', borderRadius: '2px 2px 0 0', border: isLast ? '1px solid rgba(239,77,104,0.5)' : 'none', minHeight: 4 }} />
                  <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{String(e.year).slice(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA EUROPA ───────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat · OCDE · 2023</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            España vs Europa en gasto por inmigración
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 22px' }}>
            España tiene la segunda mayor proporción de inmigrantes del G7 pero gasta menos por habitante que la media europea.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['País', '% PIB en inmigración', 'Gasto / habitante', '% población inmigrante'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: i === 1 ? 'var(--muted-strong)' : 'var(--muted)', textAlign: i === 0 ? 'left' : 'center', borderBottom: '1px solid var(--card-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA_EU.map((row, i) => {
                  const isES = row.pais.includes('España');
                  return (
                    <tr key={row.pais} style={{ background: isES ? 'color-mix(in srgb, var(--accent) 6%, var(--card))' : i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td style={{ padding: '11px 16px', fontWeight: isES ? 700 : 500, fontSize: 13.5, borderBottom: '1px solid var(--rule)' }}>{row.pais}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontWeight: isES ? 700 : 400, fontSize: 13, borderBottom: '1px solid var(--rule)', color: isES ? 'var(--accent)' : 'inherit' }}>{row.gasto_pib}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{row.importe_hab}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{row.inmigrantes_pct}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── DATOS CLAVE ──────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>INE · Ministerio de Interior · 2024</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 22px', letterSpacing: '-0.02em' }}>
            Datos clave sobre inmigración en España
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { label: 'Inmigrantes en España (2024)', value: '8,5 M', sub: '17,9% de la población total — INE Padrón 2024', color: 'var(--accent)' },
              { label: 'Solicitudes de asilo 2024', value: '163.220', sub: '+12% respecto a 2023 — 3ª en la UE', color: 'var(--accent)' },
              { label: 'MENA bajo tutela estatal', value: '~47.000', sub: 'Distribuidos entre CCAA — cifra en constante aumento', color: 'var(--bad)' },
              { label: 'Llegadas irregulares 2024', value: '64.400', sub: 'Frontera sur y Canarias — récord histórico', color: 'var(--bad)' },
              { label: 'Coste medio por MENA/año', value: '~47.000 €', sub: 'Acogida, educación, tutela y sanidad — estimación 2024', color: 'var(--bad)' },
              { label: 'Inmigrantes cotizando a la SS', value: '3,2 M', sub: 'Aportación estimada al sistema: 18.400 M€/año', color: '#27ae60' },
              { label: 'Tasa de empleo (inmigrantes)', value: '64,8%', sub: 'vs 67,2% población nativa — EPA T4 2024', color: 'var(--muted-strong)' },
              { label: 'Resoluciones de asilo aprobadas', value: '26,4%', sub: 'Tasa de concesión 2024 — media UE: 38%', color: 'var(--muted-strong)' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '16px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em', marginBottom: 6, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESUMEN Y FUENTES ────────────────────────────────────────────── */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>Resumen de cifras</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Gasto Estado directo (PGE 2024)', value: '1.847 M€' },
                  { label: 'Estimado CCAA (sanidad + educación + SS)', value: '~4.200 M€' },
                  { label: 'TOTAL estimado Estado + CCAA', value: '~6.047 M€' },
                  { label: 'Por habitante', value: '193 € / año' },
                  { label: 'Crecimiento 2018→2024', value: '+107%' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 3, gap: 12 }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-strong)' }}>{r.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', flexShrink: 0 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>Fuentes utilizadas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  'Presupuesto General del Estado 2024 — Ministerio de Hacienda',
                  'IGAE — Intervención General de la Administración del Estado',
                  'Secretaría de Estado de Migraciones — Informes anuales',
                  'INE — Padrón Municipal 2024 y Estadística de Migraciones',
                  'Ministerio del Interior — Anuario Estadístico de Inmigración 2024',
                  'Eurostat — Migration statistics 2023',
                  'ACNUR — Informe Tendencias Globales 2024',
                ].map(f => (
                  <div key={f} style={{ padding: '7px 12px', fontSize: 12, color: 'var(--muted)', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 3, lineHeight: 1.4 }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
