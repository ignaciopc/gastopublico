import Link from 'next/link';
import { formatEUR, formatNumber } from '@/lib/formatters';

export const revalidate = 86400;

type Partida = { label: string; programa: string; importe: number; nota: string };

// Partidas identificables del PGE 2024. Solo se incluyen las que corresponden a un
// programa presupuestario concreto; los prorrateos y estimaciones quedan fuera.
const PARTIDAS_ESTADO: Partida[] = [
  { label: 'Acogida humanitaria y asilo', programa: '231N', importe: 496_100_000, nota: 'Centros de acogida, CIEs y entidades colaboradoras (CEAR, Cruz Roja, Accem)' },
  { label: 'Menores migrantes no acompañados', programa: '231N', importe: 420_000_000, nota: 'Transferencias a CCAA para tutela, acogida y escolarización' },
  { label: 'FAMI — Fondo de Asilo, Migración e Integración', programa: '231N', importe: 267_200_000, nota: 'Fondos UE gestionados por España, marco financiero 2021–2027' },
  { label: 'Integración social de personas migrantes', programa: '231B', importe: 185_000_000, nota: 'Planes de integración, formación e inserción laboral' },
  { label: 'Gestión de flujos migratorios', programa: '231E', importe: 124_300_000, nota: 'Tramitación de visados, regularizaciones y acuerdos bilaterales' },
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
  { pais: '🇸🇪 Suecia', gasto_pib: '1,1%', importe_hab: '623 €', poblacion_extranjera: '20,1%' },
  { pais: '🇩🇪 Alemania', gasto_pib: '0,8%', importe_hab: '412 €', poblacion_extranjera: '18,4%' },
  { pais: '🇳🇱 Países Bajos', gasto_pib: '0,7%', importe_hab: '381 €', poblacion_extranjera: '14,2%' },
  { pais: '🇫🇷 Francia', gasto_pib: '0,6%', importe_hab: '298 €', poblacion_extranjera: '13,5%' },
  { pais: '🇮🇹 Italia', gasto_pib: '0,4%', importe_hab: '187 €', poblacion_extranjera: '10,6%' },
  { pais: '🇪🇸 España', gasto_pib: '0,35%', importe_hab: '193 €', poblacion_extranjera: '17,9%' },
];

const TOTAL_ESTADO = PARTIDAS_ESTADO.reduce((s, p) => s + p.importe, 0);

export default function InmigracionPage() {
  const maxEstado = PARTIDAS_ESTADO[0].importe;
  const maxEvo = Math.max(...EVOLUCION.map(e => e.importe));

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '52px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>GastoPublico.es</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Migración y asilo</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 12, color: 'rgba(255,255,255,0.5)' }}>
            PGE 2024 · Secretaría de Estado de Migraciones · IGAE
          </div>
          <h1 style={{ fontSize: 'clamp(26px, 4.4vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.06, margin: '0 0 16px', color: '#ededeb' }}>
            Partidas presupuestarias<br />relacionadas con migración y asilo
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 720, margin: '0 0 32px' }}>
            Los Presupuestos Generales del Estado de 2024 recogen{' '}
            <strong style={{ color: '#ededeb' }}>{formatEUR(TOTAL_ESTADO, true)}</strong>{' '}
            distribuidos en cinco partidas identificables, asignadas a los programas 231N, 231B y 231E.
            Esta página muestra únicamente esas partidas, con su importe y su programa presupuestario.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', maxWidth: 720 }}>
            {[
              { label: 'Suma de partidas identificadas', value: formatEUR(TOTAL_ESTADO, true), sub: 'PGE 2024' },
              { label: 'Programas presupuestarios', value: '3', sub: '231N · 231B · 231E' },
              { label: 'Serie histórica disponible', value: '2018–2024', sub: 'Gasto del Estado, en M€' },
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

      {/* ── ALCANCE Y LÍMITES ───────────────────────────────────────────── */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid var(--rule)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', maxWidth: 900 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Qué incluye y qué no incluye esta página</div>
              <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: '0 0 8px', lineHeight: 1.6 }}>
                &quot;Gasto en migración&quot; no es una categoría del clasificador presupuestario del IGAE.
                Lo que existe son programas concretos con una finalidad declarada. Esta página recoge
                los cinco programas del PGE 2024 cuya finalidad es explícitamente migratoria o de asilo,
                y no construye agregados por encima de ellos.
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.6 }}>
                Quedan fuera los servicios universales prestados por las Comunidades Autónomas —sanidad,
                educación y servicios sociales—, que se financian por población residente sin distinguir
                nacionalidad ni origen. Cualquier cifra que los reparta por origen es una estimación
                derivada, no un dato presupuestario. Ver{' '}
                <Link href="/metodologia" style={{ color: 'var(--accent)', fontWeight: 600 }}>metodología</Link>.
              </p>
            </div>
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
                Partidas por programa presupuestario
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.08em', marginBottom: 2 }}>SUMA DE LAS PARTIDAS LISTADAS</div>
              <div style={{ fontSize: 30, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em' }}>
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
                          fontSize: 9.5, fontWeight: 800, letterSpacing: '0.12em',
                          padding: '2px 6px', borderRadius: 2,
                          border: '1px solid var(--card-border)',
                          color: 'var(--muted)', background: 'var(--background)',
                          fontFamily: 'var(--font-mono), monospace', flexShrink: 0,
                        }}>
                          PROG. {p.programa}
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
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
            Fuente: PGE 2024 (Ministerio de Hacienda), IGAE y Secretaría de Estado de Migraciones.
            Los importes corresponden a crédito inicial del ejercicio, no a obligaciones reconocidas.
          </p>
        </div>
      </section>

      {/* ── EVOLUCIÓN HISTÓRICA ──────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>PGE 2018–2024 · Eurostat (solicitudes de asilo)</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Evolución 2018–2024
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 28px', maxWidth: 760, lineHeight: 1.6 }}>
            Gasto total del Estado en las partidas de migración y asilo, incluida la partida de control
            de fronteras que no figura en la tabla anterior por no ser imputable a un único programa.
            Se muestra junto al número de solicitudes de asilo registradas cada año; ambas series
            crecen en el período, sin que la coincidencia implique por sí sola una relación causal.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', overflowX: 'auto' }}>
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
                      <td style={{ padding: '11px 16px', fontWeight: isLast ? 700 : 500, fontSize: 13.5, borderBottom: '1px solid var(--rule)' }}>{row.year}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--rule)' }}>{row.importe.toLocaleString('es-ES')}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{delta ? `+${delta}%` : '—'}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{formatNumber(row.solicitudesAsilo)}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{i === 0 ? 'base' : `+${pctBase}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 24, display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
            {EVOLUCION.map(e => {
              const h = Math.round((e.importe / maxEvo) * 100);
              return (
                <div key={e.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ width: '100%', height: `${h}%`, background: 'var(--accent)', borderRadius: '2px 2px 0 0', minHeight: 4 }} />
                  <span style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{String(e.year).slice(2)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA EUROPA ───────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat · OCDE · 2023</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Gasto en migración y asilo en la UE
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 22px', maxWidth: 820, lineHeight: 1.6 }}>
            Estados miembros de la UE con datos comparables publicados, ordenados por porcentaje del PIB.
            El porcentaje de población de nacionalidad extranjera se incluye como contexto demográfico;
            no es un componente del cálculo del gasto y las dos columnas no son proporcionales entre sí.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['País', '% PIB', 'Gasto / habitante', '% población extranjera'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i === 0 ? 'left' : 'center', borderBottom: '1px solid var(--card-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA_EU.map((row, i) => {
                  const isES = row.pais.includes('España');
                  return (
                    <tr key={row.pais} style={{ background: isES ? 'color-mix(in srgb, var(--accent) 6%, var(--card))' : i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td style={{ padding: '11px 16px', fontWeight: isES ? 700 : 500, fontSize: 13.5, borderBottom: '1px solid var(--rule)' }}>{row.pais}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontWeight: isES ? 700 : 400, fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{row.gasto_pib}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{row.importe_hab}</td>
                      <td style={{ padding: '11px 16px', textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontSize: 13, borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.poblacion_extranjera}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 0', lineHeight: 1.55 }}>
            Los criterios de imputación presupuestaria varían entre Estados miembros, por lo que las
            cifras por habitante no son estrictamente homogéneas. Fuente: Eurostat y OCDE, datos de 2023.
          </p>
        </div>
      </section>

      {/* ── CONTEXTO DEMOGRÁFICO Y DE ASILO ──────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>INE · Ministerio del Interior · Eurostat · 2024</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Contexto demográfico y de asilo
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 22px', maxWidth: 820, lineHeight: 1.6 }}>
            Indicadores de población y de tramitación de asilo. Se presentan separados de las cifras
            presupuestarias: son magnitudes de distinta naturaleza y ponerlas juntas sugeriría una
            relación que los datos, por sí solos, no establecen.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { label: 'Población nacida en el extranjero', value: '8,5 M', sub: '17,9% del total — INE, Padrón 2024' },
              { label: 'Solicitudes de asilo 2024', value: '163.220', sub: '+12% vs 2023 — Ministerio del Interior' },
              { label: 'Tasa de concesión de asilo', value: '26,4%', sub: 'Resoluciones favorables 2024 — media UE: 38%' },
              { label: 'Llegadas irregulares 2024', value: '64.400', sub: 'Frontera sur y Canarias — Ministerio del Interior' },
              { label: 'Menores no acompañados tutelados', value: '~47.000', sub: 'Distribuidos entre CCAA — cifra agregada' },
              { label: 'Afiliados extranjeros a la Seguridad Social', value: '3,2 M', sub: 'Media anual 2024 — Seguridad Social' },
              { label: 'Tasa de empleo (nacidos fuera de España)', value: '64,8%', sub: 'vs 67,2% nacidos en España — EPA T4 2024' },
              { label: 'Recaudación por cotizaciones asociada', value: '18.400 M€', sub: 'Estimación propia sobre afiliación media' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '16px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{stat.label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em', marginBottom: 6 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUENTES ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px' }}>Resumen presupuestario</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'Suma de partidas identificadas (PGE 2024)', value: formatEUR(TOTAL_ESTADO, true) },
                  { label: 'Programas presupuestarios implicados', value: '231N · 231B · 231E' },
                  { label: 'Crecimiento del gasto del Estado 2018→2024', value: '+107%' },
                  { label: 'Naturaleza del dato', value: 'Crédito inicial' },
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
                  'Eurostat — Migration and asylum statistics 2023–2024',
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
