import Link from 'next/link';
import { formatEUR } from '@/lib/formatters';
import GabineteGrid from '@/components/ui/GabineteGrid';

export const revalidate = 86400;

// Fuente: Real Decreto 451/2012 + actualizaciones. BOE 2024
const RETRIBUCIONES = [
  { cargo: 'Presidente del Gobierno', nombre: 'Pedro Sánchez', salario: 96_179, complementos: '~12.000', total: '~108.000', notas: 'Residencia oficial La Moncloa (coste: ~20 M€/año operativos)' },
  { cargo: '1ª Vicepresidenta', nombre: 'María Jesús Montero', salario: 83_394, complementos: '~8.000', total: '~91.000', notas: 'Vicepresidenta Ejecutiva y ministra de Hacienda' },
  { cargo: '2ª Vicepresidente', nombre: 'Yolanda Díaz', salario: 83_394, complementos: '~8.000', total: '~91.000', notas: 'Ministro de Transformación Digital y Función Pública' },
  { cargo: '3er Vicepresidente', nombre: 'José Luis Escrivá', salario: 83_394, complementos: '~8.000', total: '~91.000', notas: '' },
  { cargo: 'Ministro/a (22 carteras)', nombre: '22 ministros', salario: 79_380, complementos: '~7.000', total: '~86.000', notas: 'Sueldos idénticos por cargo. Incluye secretarías de Estado propias.' },
  { cargo: 'Secretario/a de Estado', nombre: '~35 cargos', salario: 73_001, complementos: '~5.500', total: '~78.500', notas: 'Nombramiento por Real Decreto del Consejo de Ministros' },
  { cargo: 'Secretario/a General', nombre: '~55 cargos', salario: 63_124, complementos: '~4.000', total: '~67.000', notas: '' },
  { cargo: 'Subsecretario/a', nombre: '~25 cargos', salario: 67_167, complementos: '~4.500', total: '~71.500', notas: '' },
  { cargo: 'Director/a General', nombre: '~250 cargos', salario: 54_610, complementos: '~3.000', total: '~57.500', notas: 'Nombramiento político. No requieren oposición.' },
];

const ASESORES_MINISTERIO = [
  { ministerio: 'Presidencia del Gobierno', asesores: 98, coste_anual_est: 7_840_000 },
  { ministerio: 'Ministerio de Hacienda', asesores: 52, coste_anual_est: 4_160_000 },
  { ministerio: 'Ministerio del Interior', asesores: 48, coste_anual_est: 3_840_000 },
  { ministerio: 'Ministerio de Transportes', asesores: 46, coste_anual_est: 3_680_000 },
  { ministerio: 'Ministerio de Trabajo', asesores: 44, coste_anual_est: 3_520_000 },
  { ministerio: 'Ministerio de Transición Ecológica', asesores: 42, coste_anual_est: 3_360_000 },
  { ministerio: 'Ministerio de Economía', asesores: 40, coste_anual_est: 3_200_000 },
  { ministerio: 'Ministerio de Asuntos Exteriores', asesores: 38, coste_anual_est: 3_040_000 },
  { ministerio: 'Resto de ministerios (14)', asesores: 332, coste_anual_est: 26_560_000 },
];

const PENSIONES_EXPRESIDENTES = [
  { nombre: 'Felipe González', desde: 1996, pension_anual: 78_600, extras: 'Oficina, staff, seguridad' },
  { nombre: 'José María Aznar', desde: 2004, pension_anual: 78_600, extras: 'Oficina, staff, seguridad' },
  { nombre: 'José Luis Rodríguez Zapatero', desde: 2011, pension_anual: 78_600, extras: 'Oficina, staff, seguridad' },
  { nombre: 'Mariano Rajoy', desde: 2018, pension_anual: 78_600, extras: 'Oficina, staff, seguridad' },
];

const COCHES_OFICIALES = [
  { organismo: 'Presidencia del Gobierno', unidades: 42, coste_anual: 1_890_000, modelo_ref: 'Audi A8 / Mercedes Clase S' },
  { organismo: 'Ministerios (22)', unidades: 284, coste_anual: 8_520_000, modelo_ref: 'BMW Serie 5 / Audi A6' },
  { organismo: 'Secretarías de Estado', unidades: 87, coste_anual: 1_740_000, modelo_ref: 'BMW Serie 3 / Audi A4' },
  { organismo: 'Resto altos cargos', unidades: 212, coste_anual: 3_180_000, modelo_ref: 'Vehículos mixtos' },
];

const EVOLUCION_ASESORES = [
  { year: '2011', n: 569, gov: 'PP · Rajoy I', color: '#2563eb' },
  { year: '2015', n: 548, gov: 'PP · Rajoy II', color: '#2563eb' },
  { year: '2018', n: 568, gov: 'PSOE · Sánchez I', color: '#ef4d68' },
  { year: '2020', n: 639, gov: 'PSOE+UP · Sánchez II', color: '#ef4d68' },
  { year: '2022', n: 694, gov: 'PSOE+UP · Sánchez II', color: '#ef4d68' },
  { year: '2024', n: 740, gov: 'PSOE+Sumar · Sánchez III', color: '#8a1428' },
];

const TOTAL_COCHES_COSTE = COCHES_OFICIALES.reduce((s, c) => s + c.coste_anual, 0);
const TOTAL_COCHES_UNIDADES = COCHES_OFICIALES.reduce((s, c) => s + c.unidades, 0);
const TOTAL_ASESORES_COSTE = ASESORES_MINISTERIO.reduce((s, a) => s + a.coste_anual_est, 0);
const TOTAL_ASESORES_N = ASESORES_MINISTERIO.reduce((s, a) => s + a.asesores, 0);
const MAX_ASESORES = Math.max(...EVOLUCION_ASESORES.map(e => e.n));

export default function PoliticosPage() {
  const maxCochesCoste = COCHES_OFICIALES[0].coste_anual;
  const maxAsesoresMin = ASESORES_MINISTERIO[0].asesores;

  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '52px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>GastoPublico.es</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Políticos y cargos</span>
          </div>
          <div className="eyebrow" style={{ marginBottom: 12, color: 'rgba(255,255,255,0.5)' }}>
            BOE · Portal de Transparencia · Registro de Altos Cargos · 2024
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 16px', color: '#ededeb' }}>
            Sueldos y cargos<br />de los políticos
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 700, margin: '0 0 32px' }}>
            Toda la información sobre retribuciones de altos cargos es <strong style={{ color: '#ededeb' }}>información pública</strong>{' '}
            recogida en el BOE y el Portal de Transparencia. Aquí la ponemos en un solo lugar,
            sin tecnicismos y sin filtros.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden', maxWidth: 860 }}>
            {[
              { label: 'Coste total altos cargos', value: '678 M€', sub: 'Incluye nóminas, complementos y gastos de representación · 2024' },
              { label: 'Asesores nombrados a dedo', value: '740', sub: 'Récord histórico — Portal de Transparencia 2024' },
              { label: 'Sueldo del presidente', value: '96.179 €', sub: 'Bruto anual · BOE RD 451/2012 actualizado' },
              { label: 'Coches oficiales (aprox.)', value: '625 vehículos', sub: 'Presidencia + ministerios + altos cargos' },
            ].map((k, i, arr) => (
              <div key={k.label} style={{ padding: '18px 20px', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 0 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: '#ededeb', letterSpacing: '-0.02em' }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4, lineHeight: 1.4 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GabineteGrid />

      {/* ── TABLA RETRIBUCIONES ──────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>BOE · Real Decreto 451/2012 + actualizaciones 2024</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Retribuciones de altos cargos
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
                Salario bruto anual fijado por ley. No incluye complementos, dietas ni gastos de representación.
              </p>
            </div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Cargo', 'Ejemplo / Número', 'Salario bruto/año', 'Complementos est.', 'Total est.', 'Notas'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i < 2 ? 'left' : 'right', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RETRIBUCIONES.map((row, i) => (
                  <tr key={row.cargo} style={{ background: i === 0 ? 'color-mix(in srgb, var(--bad) 4%, var(--card))' : i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '11px 14px', fontWeight: 600, fontSize: 13, borderBottom: '1px solid var(--rule)', whiteSpace: 'nowrap' }}>{row.cargo}</td>
                    <td style={{ padding: '11px 14px', fontSize: 12.5, color: 'var(--muted-strong)', borderBottom: '1px solid var(--rule)' }}>{row.nombre}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 13.5, borderBottom: '1px solid var(--rule)', color: i === 0 ? 'var(--bad)' : 'inherit' }}>
                      {row.salario.toLocaleString('es-ES')} €
                    </td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--rule)' }}>{row.complementos}</td>
                    <td style={{ padding: '11px 14px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 600, fontSize: 13, borderBottom: '1px solid var(--rule)' }}>{row.total}</td>
                    <td style={{ padding: '11px 14px', fontSize: 11.5, color: 'var(--muted)', borderBottom: '1px solid var(--rule)', maxWidth: 240 }}>{row.notas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 0', lineHeight: 1.5 }}>
            Fuente: BOE — Real Decreto 451/2012 de 5 de marzo, por el que se regula el régimen retributivo de los máximos responsables y directivos en el sector público empresarial y otras entidades.
            Los complementos y totales son estimaciones. Los altos cargos también tienen derecho a seguro médico privado, pensión complementaria y, en algunos casos, vivienda oficial.
          </p>
        </div>
      </section>

      {/* ── ASESORES ────────────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 48, alignItems: 'start' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Portal de Transparencia · 2024</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                740 asesores nombrados a dedo
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 20px', lineHeight: 1.6 }}>
                Los asesores y personal de confianza se nombran sin oposición ni concurso público.
                Su coste medio estimado es de <strong>80.000 €/año</strong> (salario + cotizaciones sociales).
                El total supera los <strong>59 millones de euros anuales</strong>.
              </p>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
                {ASESORES_MINISTERIO.map((a, i) => {
                  const pct = Math.round((a.asesores / maxAsesoresMin) * 100);
                  return (
                    <div key={a.ministerio} style={{ padding: '12px 16px', borderBottom: i < ASESORES_MINISTERIO.length - 1 ? '1px solid var(--rule)' : 0, background: 'var(--background)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, gap: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{a.ministerio}</span>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexShrink: 0 }}>
                          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
                            ~{formatEUR(a.coste_anual_est, true)}/año
                          </span>
                          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', minWidth: 28, textAlign: 'right' }}>{a.asesores}</span>
                        </div>
                      </div>
                      <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: i === 0 ? 'var(--bad)' : 'var(--accent)', borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ padding: '12px 16px', background: 'var(--card)', borderTop: '2px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>TOTAL</span>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>~{formatEUR(TOTAL_ASESORES_COSTE, true)}/año</span>
                    <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>{TOTAL_ASESORES_N}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evolución asesores */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>2011–2024</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
                Evolución histórica
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: '0 0 20px' }}>
                El número ha crecido un <strong style={{ color: 'var(--bad)' }}>+30%</strong> desde 2011, independientemente del partido en el gobierno.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {EVOLUCION_ASESORES.map(e => {
                  const pct = Math.round((e.n / MAX_ASESORES) * 100);
                  const isLast = e.year === '2024';
                  return (
                    <div key={e.year}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'baseline' }}>
                        <div>
                          <span style={{ fontSize: 13, fontWeight: isLast ? 700 : 500 }}>{e.year}</span>
                          <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8 }}>{e.gov}</span>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: isLast ? 'var(--bad)' : 'inherit' }}>
                          {e.n}{isLast && ' 🔴'}
                        </span>
                      </div>
                      <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: e.color, borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COCHES OFICIALES ────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Parque móvil del Estado · 2024</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Coches oficiales
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
                El Parque Móvil del Estado gestiona vehículos de alta gama para altos cargos.
                El coste incluye adquisición, mantenimiento, combustible y conductores.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.08em', marginBottom: 2 }}>COSTE ANUAL ESTIMADO</div>
              <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', color: 'var(--bad)' }}>
                ~{formatEUR(TOTAL_COCHES_COSTE, true)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{TOTAL_COCHES_UNIDADES} vehículos</div>
            </div>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Organismo', 'Vehículos', 'Coste anual est.', 'Modelo de referencia'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i === 0 ? 'left' : i === 3 ? 'left' : 'right', borderBottom: '1px solid var(--card-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COCHES_OFICIALES.map((c, i) => {
                  const pct = Math.round((c.coste_anual / maxCochesCoste) * 100);
                  return (
                    <tr key={c.organismo} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 500, fontSize: 13.5, borderBottom: '1px solid var(--rule)' }}>
                        <div>{c.organismo}</div>
                        <div style={{ marginTop: 5, background: 'var(--card-border)', borderRadius: 2, height: 4, overflow: 'hidden', maxWidth: 200 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 600, fontSize: 14, borderBottom: '1px solid var(--rule)' }}>{c.unidades}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 13.5, borderBottom: '1px solid var(--rule)', color: 'var(--bad)' }}>
                        ~{formatEUR(c.coste_anual, true)}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--muted-strong)', borderBottom: '1px solid var(--rule)' }}>{c.modelo_ref}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: 'var(--card)', borderTop: '2px solid var(--card-border)' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 13 }}>TOTAL</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 14 }}>{TOTAL_COCHES_UNIDADES}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 14, color: 'var(--bad)' }}>
                    ~{formatEUR(TOTAL_COCHES_COSTE, true)}
                  </td>
                  <td style={{ padding: '12px 16px' }} />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PENSIONES EXPRESIDENTES ──────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Ley 74/1980 · actualizada · Ministerio de Presidencia</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Pensiones vitalicias de ex-presidentes
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 22px', maxWidth: 680, lineHeight: 1.6 }}>
            Los ex-presidentes del Gobierno tienen derecho a pensión vitalicia, más una oficina oficial
            con staff (secretaria, asesores) y escolta de seguridad. El coste total por ex-presidente
            se estima en <strong>500.000–800.000 €/año</strong> incluyendo todos los beneficios.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 20 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Ex-presidente', 'Percibiendo desde', 'Pensión bruta/año', 'Beneficios adicionales', 'Coste total est./año'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i < 2 ? 'left' : 'right', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PENSIONES_EXPRESIDENTES.map((p, i) => (
                  <tr key={p.nombre} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13.5, borderBottom: '1px solid var(--rule)' }}>{p.nombre}</td>
                    <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--muted-strong)', borderBottom: '1px solid var(--rule)' }}>Desde {p.desde}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 700, fontSize: 14, borderBottom: '1px solid var(--rule)' }}>
                      {p.pension_anual.toLocaleString('es-ES')} €
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontSize: 12.5, color: 'var(--muted)', borderBottom: '1px solid var(--rule)' }}>{p.extras}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontWeight: 600, fontSize: 13, color: 'var(--bad)', borderBottom: '1px solid var(--rule)' }}>~500.000–800.000 €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {[
              { label: 'Ex-presidentes activos', value: '4', sub: 'González, Aznar, Zapatero y Rajoy' },
              { label: 'Pensión base unitaria', value: '78.600 €', sub: 'Bruto anual · actualizado con IPC' },
              { label: 'Coste total estimado/año', value: '~2,4 M€', sub: 'Solo pensiones directas, sin seguridad ni oficinas' },
              { label: 'Coste estimado total (todo)', value: '~3 M€/año', sub: 'Incluyendo seguridad, staff y gastos de oficina' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '14px 16px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em', marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OTROS BENEFICIOS ────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Portal de Transparencia · IGAE · 2024</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 22px', letterSpacing: '-0.02em' }}>
            Otros beneficios y gastos de representación
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {[
              {
                titulo: 'Avión presidencial y flota aérea',
                importe: '~82 M€/año',
                detalle: 'La flota del SASEMAR y el CLAEX incluye aeronaves para uso gubernamental. El TP-001 (Airbus A310) y el TP-002 tienen un coste operativo estimado de 12.000–28.000 €/hora de vuelo. En 2023 se realizaron 847 vuelos oficiales.',
                fuente: 'Ministerio de Defensa / CLAEX',
                color: '#2563eb',
              },
              {
                titulo: 'Palacio de La Moncloa',
                importe: '~20 M€/año',
                detalle: 'Costes operativos del complejo presidencial: personal de mantenimiento, seguridad, jardines, cocina, protocolo. Incluye la residencia del Presidente y zonas de representación. Presupuesto independiente del sueldo.',
                fuente: 'Ministerio de la Presidencia',
                color: '#e67e22',
              },
              {
                titulo: 'Gastos de representación',
                importe: '~38 M€/año',
                detalle: 'Dietas y gastos de viaje de altos cargos en el extranjero, recepciones, cenas de Estado, viajes de representación oficial. El Presidente tiene una asignación especial no sujeta a justificación detallada.',
                fuente: 'Presupuesto Ministerio de Presidencia',
                color: '#8a1428',
              },
              {
                titulo: 'Seguridad de los políticos',
                importe: '~340 M€/año',
                detalle: 'El Cuerpo Nacional de Policía destina unos 3.400 efectivos a protección de personalidades. Incluye Presidente, ex-presidentes, ministros, altos cargos y sus familias. Coste medio por escoltado: ~60.000 €/año.',
                fuente: 'Ministerio del Interior / CNP',
                color: '#059669',
              },
            ].map(b => (
              <div key={b.titulo} style={{ padding: '20px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 3, borderRadius: 2, background: b.color, alignSelf: 'stretch', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{b.titulo}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)', letterSpacing: '-0.02em' }}>{b.importe}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted-strong)', margin: '0 0 10px' }}>{b.detalle}</p>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>Fuente: {b.fuente}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTALES OFICIALES ───────────────────────────────────────────── */}
      <section style={{ padding: '40px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 14px' }}>Consulta las fuentes originales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {[
              { nombre: 'Portal de Transparencia del Gobierno', url: 'https://transparencia.gob.es', desc: 'Altos cargos, retribuciones, declaraciones de bienes' },
              { nombre: 'BOE — Retribuciones sector público', url: 'https://www.boe.es', desc: 'Real Decreto 451/2012 y actualizaciones anuales' },
              { nombre: 'Registro de Altos Cargos', url: 'https://transparencia.gob.es/transparencia/transparencia_Home/index/PublicidadActiva/AltosCargos.html', desc: 'Listado oficial de todos los altos cargos y actividades' },
              { nombre: 'Parque Móvil del Estado', url: 'https://www.pme.gob.es', desc: 'Flota oficial y gestión de vehículos del Estado' },
            ].map(p => (
              <a key={p.nombre} href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>{p.nombre} ↗</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{p.desc}</div>
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '20px 0 0', lineHeight: 1.6 }}>
            Todos los datos de retribuciones son públicos por mandato de la Ley 3/2015 de 30 de marzo, reguladora del ejercicio del alto cargo de la Administración General del Estado,
            y la Ley 19/2013 de Transparencia, Acceso a la Información Pública y Buen Gobierno.
            Los complementos y totales estimados se calculan a partir de los datos disponibles en el BOE.
          </p>
        </div>
      </section>
    </div>
  );
}
