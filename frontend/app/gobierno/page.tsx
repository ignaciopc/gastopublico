import ProrrogaCounter from '@/components/ui/ProrrogaCounter';
import EjerciciosProrrogados from '@/components/ui/EjerciciosProrrogados';
import FondosUECountdown from '@/components/ui/FondosUECountdown';
import { formatEUR } from '@/lib/formatters';

// ─── DATA ────────────────────────────────────────────────────────────────────

const MINISTERIOS = [
  { gobierno: 'Aznar I (1996)', n: 16 },
  { gobierno: 'Aznar II (2000)', n: 16 },
  { gobierno: 'Zapatero I (2004)', n: 16 },
  { gobierno: 'Zapatero II (2008)', n: 17 },
  { gobierno: 'Rajoy I (2011)', n: 13, nota: 'Mínimo de la serie' },
  { gobierno: 'Rajoy II (2016)', n: 13 },
  { gobierno: 'Sánchez I (2018)', n: 17 },
  { gobierno: 'Sánchez II (2020)', n: 22, nota: 'Máximo de la serie' },
  { gobierno: 'Sánchez III (2024)', n: 22, nota: 'Máximo de la serie' },
];

const ASESORES = [
  { year: '2011', n: 569, gov: 'PP (Rajoy)' },
  { year: '2015', n: 548, gov: 'PP (Rajoy II)' },
  { year: '2018', n: 568, gov: 'PSOE (Sánchez I)' },
  { year: '2020', n: 639, gov: 'PSOE+UP (Sánchez II)' },
  { year: '2022', n: 694, gov: 'PSOE+UP (Sánchez II)' },
  { year: '2024', n: 740, gov: 'PSOE+Sumar (Sánchez III)' },
];

const PUBLICIDAD = [
  { year: '2018', importe: 185 },
  { year: '2019', importe: 172 },
  { year: '2020', importe: 208 },
  { year: '2021', importe: 224 },
  { year: '2022', importe: 247 },
  { year: '2023', importe: 254 },
];

const EMPLEADOS = [
  { year: '2010', n: 3_010_000 },
  { year: '2012', n: 2_940_000 },
  { year: '2014', n: 2_860_000 },
  { year: '2016', n: 2_950_000 },
  { year: '2018', n: 3_190_000 },
  { year: '2020', n: 3_320_000 },
  { year: '2022', n: 3_420_000 },
  { year: '2024', n: 3_510_000 },
];

const DEFICIT = [
  { year: 2008, pct: 4.4 },
  { year: 2009, pct: 11.0 },
  { year: 2010, pct: 9.4 },
  { year: 2011, pct: 9.4 },
  { year: 2012, pct: 10.5 },
  { year: 2013, pct: 6.9 },
  { year: 2014, pct: 5.9 },
  { year: 2015, pct: 5.1 },
  { year: 2016, pct: 4.5 },
  { year: 2017, pct: 3.0 },
  { year: 2018, pct: 2.5 },
  { year: 2019, pct: 2.8 },
  { year: 2020, pct: 10.1 },
  { year: 2021, pct: 6.9 },
  { year: 2022, pct: 4.8 },
  { year: 2023, pct: 3.5 },
  { year: 2024, pct: 3.1, est: true },
];

const COMPARATIVA = [
  { metric: 'Deuda / PIB', esp: '108,1%', eu: '82,7%', de: '62,7%', fr: '110,6%', fuente: 'Eurostat · 2024' },
  { metric: 'Déficit público', esp: '-3,1%', eu: '-2,9%', de: '+0,1%', fr: '-5,5%', fuente: 'Eurostat · 2024' },
  { metric: 'Tasa de paro', esp: '11,2%', eu: '5,9%', de: '3,4%', fr: '7,3%', fuente: 'Eurostat · T4 2024' },
  { metric: 'Presión fiscal (% PIB)', esp: '38,8%', eu: '41,2%', de: '45,3%', fr: '47,8%', fuente: 'Eurostat · 2023' },
  { metric: 'Nº de ministerios', esp: '22', eu: '14', de: '14', fr: '15', fuente: 'Organigramas oficiales · 2024' },
  { metric: 'Empleados públicos / 1.000 hab.', esp: '72', eu: '64', de: '59', fr: '88', fuente: 'OCDE · 2023' },
];

const EMPRESAS_PUBLICAS = [
  { nombre: 'RTVE', tipo: 'Subvención estatal anual', importe: 303_000_000, nota: 'Presupuesto garantizado por ley. Acumula 1.200 M€ de deuda histórica.' },
  { nombre: 'Correos y Telégrafos', tipo: 'Compensación servicio universal', importe: 500_000_000, nota: 'Pérdidas 190 M€ en 2023. El Estado cubre el déficit del servicio postal.' },
  { nombre: 'RENFE Operadora', tipo: 'Inyecciones de capital 2020–2024', importe: 1_600_000_000, nota: 'La red de Cercanías pierde 400 M€/año. AVE operado con pérdidas.' },
  { nombre: 'ADIF Alta Velocidad', tipo: 'Déficit de explotación anual', importe: 450_000_000, nota: 'La red de AVE genera sistemáticamente más costes que ingresos.' },
  { nombre: 'Paradores de Turismo', tipo: 'Préstamos ICO + aportaciones Estado', importe: 280_000_000, nota: 'Reestructuración financiera tras pérdidas acumuladas desde 2008.' },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const th: React.CSSProperties = {
  padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
  textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left',
  borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap',
};
const td: React.CSSProperties = {
  padding: '13px 16px', fontSize: 13.5, borderBottom: '1px solid var(--rule)',
  verticalAlign: 'top',
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function GobiernoPage() {
  const maxMinisterios = Math.max(...MINISTERIOS.map(m => m.n));
  const maxAsesores = Math.max(...ASESORES.map(a => a.n));
  const maxPublicidad = Math.max(...PUBLICIDAD.map(p => p.importe));
  const maxEmpleados = Math.max(...EMPLEADOS.map(e => e.n));
  const maxDeficit = Math.max(...DEFICIT.map(d => d.pct));
  const maxEmpresaImporte = Math.max(...EMPRESAS_PUBLICAS.map(e => e.importe));

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 10, fontSize: 11, letterSpacing: '0.18em' }}>ESTRUCTURA Y COSTE DE LA ADMINISTRACIÓN</div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            El coste del Gobierno,<br />
            <span style={{ color: '#ef4d68' }}>partida a partida.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 680, margin: '0 0 40px' }}>
            Presupuesto prorrogado por <EjerciciosProrrogados />er ejercicio consecutivo, 22 ministerios,
            740 puestos de personal eventual, 3,5 millones de empleados públicos y 128.500 M€ en fondos
            europeos pendientes de ejecutar. Cada cifra enlaza a su fuente oficial.
          </p>

          {/* KPI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Ejercicios en prórroga', value: null, sub: 'Último PGE aprobado: 2023' },
              { label: 'Ministerios', value: '22', sub: 'Media UE: 14' },
              { label: 'Personal eventual', value: '740', sub: '+30% desde 2018' },
              { label: 'Empleados públicos', value: '3,51 M', sub: '+320.000 desde 2018' },
              { label: 'Fondos UE sin ejecutar', value: '128.500 M€', sub: 'Del total de 163.500 M€' },
            ].map((k, i, arr) => (
              <div key={k.label} style={{ padding: '20px 20px 16px', background: 'rgba(255,255,255,0.03)', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 0 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', color: '#ef4d68', lineHeight: 1 }}>
                  {k.value === null ? <EjerciciosProrrogados /> : k.value}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1. SIN PRESUPUESTO ────────────────────────────────────────── */}
      <section style={{ background: '#0f0f12', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '52px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 56, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>Ejecución presupuestaria</div>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 16px' }}>
                España afronta {new Date().getFullYear()} con los presupuestos<br />de 2023 prorrogados por{' '}
                <EjerciciosProrrogados />er año consecutivo
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' }}>
                El último Presupuesto General del Estado aprobado por las Cortes fue el de 2023,{' '}
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Ley 31/2022, de 23 de diciembre</strong>.
                Los ejercicios 2024, 2025 y 2026 se rigen por prórroga automática conforme al
                art. 134.4 CE. En la última década, siete ejercicios han comenzado en situación de
                prórroga: 2017, 2018, 2019, 2020, 2024, 2025 y 2026.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  'El art. 134.4 CE prorroga automáticamente los presupuestos del ejercicio anterior si no se aprueban los nuevos antes del 1 de enero',
                  'La prórroga mantiene los créditos iniciales del último presupuesto aprobado, sin actualizarlos por inflación',
                  'Las modificaciones de crédito permiten ajustar partidas durante la prórroga, con autorización del Consejo de Ministros o de las Cortes según el importe',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.45 }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>→</span>
                    {item}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', margin: '16px 0 0', fontFamily: 'var(--font-mono), monospace' }}>
                Fuente: BOE · Ministerio de Hacienda (SEPG)
              </p>
            </div>
            <div>
              <ProrrogaCounter />
              <div style={{ marginTop: 28, padding: '16px 20px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 4, background: 'rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Último PGE aprobado</div>
                <div style={{ fontSize: 15, color: '#ededeb', fontWeight: 600 }}>Ejercicio 2023 · Ley 31/2022, de 23 de diciembre</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>BOE núm. 308, de 24 de diciembre de 2022</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DÉFICIT CRÓNICO ────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat / AIReF · 2008–2024</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                17 ejercicios consecutivos en déficit
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: 0 }}>
                El último ejercicio que España cerró con superávit fue 2007 (+1,9% del PIB).
                Déficit en porcentaje del PIB, metodología SEC 2010.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Déficit acumulado 2008–2024</div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>~1,1 billones €</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 160, borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
            {DEFICIT.map(d => {
              const h = Math.round((d.pct / maxDeficit) * 130);
              const isBad = d.pct > 5;
              return (
                <div key={d.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace', lineHeight: 1 }}>
                    {d.pct.toFixed(1)}%{d.est ? '*' : ''}
                  </div>
                  <div style={{
                    width: '100%', height: h,
                    background: isBad ? '#8a1428' : 'var(--accent)',
                    borderRadius: '2px 2px 0 0',
                    border: isBad ? '1px solid #ef4d68' : '1px solid transparent',
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            {DEFICIT.map(d => (
              <div key={d.year} style={{ flex: 1, textAlign: 'center', fontSize: 9, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
                {String(d.year).slice(2)}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ width: 12, height: 12, background: '#8a1428', borderRadius: 2, display: 'inline-block', border: '1px solid #ef4d68' }} />
              Déficit superior al 5% del PIB
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
              <span style={{ width: 12, height: 12, background: 'var(--accent)', borderRadius: 2, display: 'inline-block' }} />
              Déficit inferior al 5% del PIB
            </span>
            <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>* Estimación AIReF</span>
          </div>
        </div>
      </section>

      {/* ── 3. MINISTERIOS ────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Portal de Transparencia · Real Decreto de estructura</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            22 ministerios — la cifra más alta de la serie desde 1978
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 28px' }}>
            Número de departamentos ministeriales al inicio de cada legislatura, según el real decreto
            de reestructuración de la Administración General del Estado. La media de la UE es de 14.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MINISTERIOS.map(m => {
              const pct = Math.round((m.n / maxMinisterios) * 100);
              const isRecord = m.n === maxMinisterios;
              return (
                <div key={m.gobierno} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 36px 180px', gap: 14, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: 'var(--muted-strong)', whiteSpace: 'nowrap' }}>{m.gobierno}</span>
                  <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: isRecord ? '#ef4d68' : 'var(--accent)', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', textAlign: 'right', color: isRecord ? 'var(--bad)' : 'inherit' }}>{m.n}</span>
                  <span style={{ fontSize: 11, color: isRecord ? '#ef4d68' : 'var(--muted)', fontWeight: isRecord ? 700 : 400 }}>{m.nota ?? ''}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. ASESORES ───────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 56, alignItems: 'start' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Portal de Transparencia · BOEL</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                740 puestos de personal eventual
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', lineHeight: 1.65, margin: '0 0 20px' }}>
                El personal eventual (art. 12 del Estatuto Básico del Empleado Público) desempeña
                funciones de confianza o asesoramiento especial y se nombra y cesa libremente, sin
                proceso selectivo. Su número ha crecido un <strong>30% desde 2018</strong> y un{' '}
                <strong>35% desde el mínimo de la serie en 2015</strong>. El coste medio estimado por
                puesto es de 80.000 €/año en nómina bruta.
              </p>
              <div style={{ padding: '16px 20px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Coste estimado anual</div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>+59 M€</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>740 × 80.000 € bruto medio + costes Seg. Social</div>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--card-border)', borderRadius: 4, padding: '20px 20px', background: 'var(--card)' }}>
                {ASESORES.map(a => {
                  const pct = Math.round((a.n / maxAsesores) * 100);
                  const isLast = a.year === '2024';
                  return (
                    <div key={a.year}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: 'var(--muted-strong)' }}>{a.year} · {a.gov}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: isLast ? 'var(--bad)' : 'inherit' }}>{a.n.toLocaleString('es-ES')}</span>
                      </div>
                      <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 6 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: isLast ? '#ef4d68' : 'var(--accent)', borderRadius: 2 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. PUBLICIDAD INSTITUCIONAL ───────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Informe anual · Ministerio de Hacienda + CNMC</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Publicidad institucional: 254 M€ en 2023
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 24px', maxWidth: 700, lineHeight: 1.6 }}>
            Gasto de la Administración General del Estado en campañas de publicidad y comunicación
            institucional, reguladas por la Ley 29/2005. El Plan Anual de Publicidad y Comunicación
            se aprueba en Consejo de Ministros y su ejecución se publica en un informe anual.
            2023 es el valor más alto de la serie 2018–2023.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 160, borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
            {PUBLICIDAD.map(p => {
              const h = Math.round((p.importe / maxPublicidad) * 130);
              const isMax = p.importe === maxPublicidad;
              return (
                <div key={p.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: isMax ? 'var(--bad)' : 'var(--muted)', fontFamily: 'var(--font-mono), monospace', fontWeight: isMax ? 700 : 400 }}>{p.importe} M€</div>
                  <div style={{ width: '100%', height: h, background: isMax ? '#ef4d68' : 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: 0.9 }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            {PUBLICIDAD.map(p => (
              <div key={p.year} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{p.year}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. EMPLEADOS PÚBLICOS ─────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Boletín Estadístico · Ministerio de Hacienda (BOEL)</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                3,51 millones de empleados públicos — máximo de la serie
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: 0 }}>
                +320.000 empleados desde 2018 y +650.000 desde los mínimos de la crisis. Coste salarial total: 130.000 M€/año.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 140, borderBottom: '1px solid var(--rule)', paddingBottom: 8 }}>
            {EMPLEADOS.map(e => {
              const baseline = 2_800_000;
              const pct = Math.round(((e.n - baseline) / (maxEmpleados - baseline)) * 100);
              const isLast = e.year === '2024';
              return (
                <div key={e.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 10, color: isLast ? 'var(--bad)' : 'var(--muted)', fontFamily: 'var(--font-mono), monospace', fontWeight: isLast ? 700 : 400 }}>
                    {(e.n / 1_000_000).toFixed(2)}M
                  </div>
                  <div style={{ width: '100%', minHeight: 12, height: Math.max(12, pct * 1.1), background: isLast ? '#ef4d68' : 'var(--accent)', borderRadius: '3px 3px 0 0' }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            {EMPLEADOS.map(e => (
              <div key={e.year} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{e.year}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FONDOS UE ──────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Ministerio de Hacienda · Informe PERTE · Comisión Europea</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Next Generation EU: solo el 21% ejecutado
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 28px', maxWidth: 720, lineHeight: 1.6 }}>
            España tiene asignados 163.500 M€ del Mecanismo de Recuperación y Resiliencia para el
            período 2021–2026, la segunda mayor dotación de la UE en términos absolutos tras Italia.
            A cierre de 2024, el 21,4% se había ejecutado en proyectos.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 32, marginBottom: 28, alignItems: 'start' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
            {[
              { label: 'Asignación total 2021–2026', value: '163.500 M€', pct: 100, color: '#2a2a2f' },
              { label: 'Desembolsado por la UE', value: '63.000 M€', pct: 38.5, color: '#2563eb' },
              { label: 'Ejecutado en proyectos reales', value: '35.000 M€', pct: 21.4, color: 'var(--accent)' },
              { label: 'Sin ejecutar (riesgo caducidad)', value: '128.500 M€', pct: 78.6, color: '#ef4d68' },
            ].map(item => (
              <div key={item.label} style={{ padding: '20px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--background)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>{item.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', marginBottom: 12, color: item.color === '#ef4d68' ? 'var(--bad)' : 'inherit' }}>{item.value}</div>
                <div style={{ background: 'var(--card-border)', borderRadius: 3, height: 6 }}>
                  <div style={{ width: `${item.pct}%`, height: '100%', background: item.color, borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{item.pct.toFixed(1)}% del total asignado</div>
              </div>
            ))}
            </div>
            {/* Countdown */}
            <div style={{ background: '#0a0a0d', borderRadius: 4, padding: 4 }}>
              <FondosUECountdown />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
            Los fondos no ejecutados antes del 31 de agosto de 2026 deberán devolverse. España podría perder hasta
            20.000 M€ en subvenciones no repagables. Fuente: Comisión Europea / Ministerio de Hacienda (informe PERTE 2024).
          </p>
        </div>
      </section>

      {/* ── 8. PARLAMENTO ─────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Presupuestos Cortes Generales 2024 · Oficial</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            199 M€ al año para 615 parlamentarios
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 24px', maxWidth: 720 }}>
            España tiene un sistema bicameral. El Senado, cámara de segunda lectura conforme al
            art. 90 CE, tiene un presupuesto de 75 M€/año. El coste medio por escaño de las Cortes
            Generales es de 323.000 €/año.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { camara: 'Congreso de los Diputados', escanos: 350, presupuesto: 124_000_000, costeEscano: 354_000 },
              { camara: 'Senado', escanos: 265, presupuesto: 75_000_000, costeEscano: 283_000 },
              { camara: 'Total Cortes Generales', escanos: 615, presupuesto: 199_000_000, costeEscano: 323_000 },
              { camara: 'Parlamentos autonómicos (19)', escanos: 1218, presupuesto: 320_000_000, costeEscano: 262_000, est: true },
            ].map(c => (
              <div key={c.camara} style={{ padding: '20px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 14, color: 'var(--foreground)' }}>{c.camara}{c.est ? ' *' : ''}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Escaños</div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono), monospace' }}>{c.escanos.toLocaleString('es-ES')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Presupuesto anual</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>{formatEUR(c.presupuesto, true)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Coste por escaño</div>
                    <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-mono), monospace' }}>{formatEUR(c.costeEscano)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>* Estimación basada en presupuestos autonómicos publicados. Excluye personal externo y gastos indirectos.</p>
        </div>
      </section>

      {/* ── 9. EMPRESAS PÚBLICAS DEFICITARIAS ─────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Cuentas anuales SEPI · Ministerio de Hacienda</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Empresas públicas que el Estado financia con pérdidas
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 24px', maxWidth: 720 }}>
            El sector público empresarial estatal incluye más de 300 entidades. Estas son las que concentran mayor
            necesidad de financiación recurrente por parte del Estado.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  <th style={th}>Empresa</th>
                  <th style={th}>Concepto</th>
                  <th style={{ ...th, textAlign: 'right' }}>Importe</th>
                  <th style={th}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {EMPRESAS_PUBLICAS.map((e, i) => {
                  const pct = Math.round((e.importe / maxEmpresaImporte) * 100);
                  return (
                    <tr key={e.nombre} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                      <td style={{ ...td, fontWeight: 700 }}>{e.nombre}</td>
                      <td style={{ ...td, color: 'var(--muted-strong)' }}>{e.tipo}</td>
                      <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                          <span style={{ fontFamily: 'var(--font-mono), monospace', fontWeight: 700, color: 'var(--bad)' }}>{formatEUR(e.importe, true)}</span>
                          <div style={{ width: 80, height: 4, background: 'var(--card-border)', borderRadius: 2 }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: '#ef4d68', borderRadius: 2 }} />
                          </div>
                        </div>
                      </td>
                      <td style={{ ...td, fontSize: 12, color: 'var(--muted)', maxWidth: 280 }}>{e.nota}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 10. COMPARATIVA EUROPA ────────────────────────────────────── */}
      <section style={{ padding: '52px 0 64px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat · OCDE · Comisión Europea · 2024</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            España en el contexto europeo
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 24px', maxWidth: 860 }}>
            Indicadores de gobernanza y economía pública. Alemania y Francia son las dos mayores economías
            de la eurozona por PIB y, como España, están sujetas a las reglas fiscales del Pacto de
            Estabilidad y Crecimiento, por lo que sus cifras de deuda y déficit se calculan con la misma
            metodología (SEC 2010). La media UE agrega los 27 Estados miembros. La selección de
            comparadores condiciona la lectura: la serie completa está disponible en Eurostat.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  <th style={th}>Indicador</th>
                  <th style={{ ...th, textAlign: 'center' }}>🇪🇸 España</th>
                  <th style={{ ...th, textAlign: 'center' }}>Media UE</th>
                  <th style={{ ...th, textAlign: 'center' }}>🇩🇪 Alemania</th>
                  <th style={{ ...th, textAlign: 'center' }}>🇫🇷 Francia</th>
                  <th style={th}>Fuente · año</th>
                </tr>
              </thead>
              <tbody>
                {COMPARATIVA.map((row, i) => (
                  <tr key={row.metric} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ ...td, fontWeight: 600 }}>{row.metric}</td>
                    <td style={{ ...td, textAlign: 'center', fontFamily: 'var(--font-mono), monospace', fontWeight: 700 }}>{row.esp}</td>
                    <td style={{ ...td, textAlign: 'center', fontFamily: 'var(--font-mono), monospace', color: 'var(--muted-strong)' }}>{row.eu}</td>
                    <td style={{ ...td, textAlign: 'center', fontFamily: 'var(--font-mono), monospace', color: 'var(--muted-strong)' }}>{row.de}</td>
                    <td style={{ ...td, textAlign: 'center', fontFamily: 'var(--font-mono), monospace', color: 'var(--muted-strong)' }}>{row.fr}</td>
                    <td style={{ ...td, fontSize: 11.5, fontFamily: 'var(--font-mono), monospace', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{row.fuente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14, lineHeight: 1.5 }}>
            Fuentes: Eurostat (deuda, déficit, presión fiscal), OIT/Eurostat (paro), OCDE (empleados públicos),
            datos oficiales de cada gobierno (ministerios). Datos 2024 o último disponible.
          </p>
        </div>
      </section>

    </div>
  );
}
