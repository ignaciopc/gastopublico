export const revalidate = 86400;

const GASTO_PENSIONES = [
  { year: 2015, valor: 122.3 },
  { year: 2016, valor: 125.1 },
  { year: 2017, valor: 129.0 },
  { year: 2018, valor: 134.2 },
  { year: 2019, valor: 140.5 },
  { year: 2020, valor: 147.8 },
  { year: 2021, valor: 149.2 },
  { year: 2022, valor: 156.4 },
  { year: 2023, valor: 169.1 },
  { year: 2024, valor: 181.2 },
];

const PENSIONISTAS = [
  { year: 2010, valor: 8.70 },
  { year: 2012, valor: 9.00 },
  { year: 2014, valor: 9.28 },
  { year: 2016, valor: 9.49 },
  { year: 2018, valor: 9.77 },
  { year: 2020, valor: 10.01 },
  { year: 2022, valor: 10.40 },
  { year: 2024, valor: 10.84 },
];

const RATIO_COTIZANTES = [
  { year: 2010, valor: 2.50 },
  { year: 2012, valor: 2.18 },
  { year: 2014, valor: 2.02 },
  { year: 2016, valor: 2.19 },
  { year: 2018, valor: 2.42 },
  { year: 2020, valor: 2.31 },
  { year: 2022, valor: 2.51 },
  { year: 2024, valor: 2.54 },
];

const PENSION_MEDIA = [
  { year: 2015, valor: 917 },
  { year: 2016, valor: 929 },
  { year: 2017, valor: 942 },
  { year: 2018, valor: 961 },
  { year: 2019, valor: 979 },
  { year: 2020, valor: 1003 },
  { year: 2021, valor: 1025 },
  { year: 2022, valor: 1054 },
  { year: 2023, valor: 1109 },
  { year: 2024, valor: 1166 },
];

const PROYECCION = [
  { year: 2024, pib: 12.4 },
  { year: 2030, pib: 13.5 },
  { year: 2035, pib: 14.3 },
  { year: 2040, pib: 15.2 },
  { year: 2045, pib: 16.0 },
  { year: 2050, pib: 16.8 },
];

const COMPARATIVA_EU = [
  { pais: 'Italia', pib: 16.3 },
  { pais: 'Grecia', pib: 15.7 },
  { pais: 'Francia', pib: 14.5 },
  { pais: 'Austria', pib: 13.9 },
  { pais: 'España', pib: 12.4 },
  { pais: 'Portugal', pib: 12.1 },
  { pais: 'Alemania', pib: 10.8 },
  { pais: 'UE-27 media', pib: 11.0 },
  { pais: 'Países Bajos', pib: 6.2 },
  { pais: 'Irlanda', pib: 5.0 },
];

const TIPOS_PENSION = [
  { tipo: 'Jubilación', pensionistas: 6940, media: 1284 },
  { tipo: 'Viudedad', pensionistas: 2315, media: 747 },
  { tipo: 'Incapacidad permanente', pensionistas: 955, media: 1064 },
  { tipo: 'Orfandad', pensionistas: 340, media: 411 },
  { tipo: 'Favor de familiares', pensionistas: 31, media: 550 },
];

function BarChart({ data, maxVal, color = 'var(--accent)', fmt, labelWidth = 36 }: {
  data: { label: string; value: number; highlight?: boolean }[];
  maxVal: number;
  color?: string;
  fmt: (v: number) => string;
  labelWidth?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map(({ label, value, highlight }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: labelWidth, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{label}</span>
          <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 18, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((value / maxVal) * 100)}%`, background: highlight ? 'var(--accent)' : color, height: '100%', borderRadius: 2 }} />
          </div>
          <span style={{ width: 72, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function PensionesPage() {
  const gastoActual = GASTO_PENSIONES[GASTO_PENSIONES.length - 1].valor;
  const gastoBase = GASTO_PENSIONES[0].valor;
  const gastoSubida = Math.round(((gastoActual - gastoBase) / gastoBase) * 100);
  const pensionistasActual = PENSIONISTAS[PENSIONISTAS.length - 1].valor;
  const ratioActual = RATIO_COTIZANTES[RATIO_COTIZANTES.length - 1].valor;
  const pensionMediaActual = PENSION_MEDIA[PENSION_MEDIA.length - 1].valor;
  const maxGasto = Math.max(...GASTO_PENSIONES.map(d => d.valor));
  const maxPension = Math.max(...PENSION_MEDIA.map(d => d.valor));
  const maxEU = Math.max(...COMPARATIVA_EU.map(d => d.pib));
  const maxProyeccion = Math.max(...PROYECCION.map(d => d.pib));

  return (
    <main>

      {/* ── HERO OSCURO ───────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Ministerio de Inclusión · Seguridad Social · AIReF
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            Pensiones: el mayor gasto del Estado.<br />
            <span style={{ color: '#ef4d68' }}>Y creciendo sin freno.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 720, lineHeight: 1.6, margin: '0 0 32px' }}>
            {gastoActual.toLocaleString('es-ES')} MM€ en 2024 — el {gastoSubida}% más que en 2015.
            Con solo <strong style={{ color: '#ef4d68' }}>{ratioActual} cotizantes por cada pensionista</strong>{' '}
            y una proyección del 16,8% del PIB en 2050, el sistema de reparto actual
            es matemáticamente insostenible sin reformas profundas.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Gasto total 2024', value: `${gastoActual.toFixed(1)} MM€`, sub: `+${gastoSubida}% desde 2015` },
              { label: 'Pensionistas', value: `${pensionistasActual.toFixed(2)} M`, sub: '+2,1M desde 2010' },
              { label: 'Cotizantes/pensionista', value: ratioActual.toFixed(2), sub: 'Mínimo sostenible: 4,0' },
              { label: 'Pensión media', value: `${pensionMediaActual.toLocaleString('es-ES')} €`, sub: '+27% desde 2015' },
              { label: 'Proyección 2050', value: '16,8% PIB', sub: 'Sin reformas (AIReF)' },
            ].map((k, i, arr) => (
              <div key={k.label} style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.02)', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 0 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: '#ef4d68', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 5 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 0' }}>

      {/* KPI Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 48 }}>
        {[
          { label: 'Gasto total 2024', value: '181.200 M€', sub: `+${gastoSubida}% desde 2015`, color: 'var(--accent)' },
          { label: '% del PIB', value: '12,4%', sub: 'Media UE: 11,0%', color: '#e67e22' },
          { label: 'Pensionistas', value: `${pensionistasActual.toFixed(2)} M`, sub: '+2,1M desde 2010', color: '#e74c3c' },
          { label: 'Cotizantes / pensionista', value: ratioActual.toFixed(2), sub: 'Mínimo sostenible: 4,0', color: '#8e44ad' },
          { label: 'Pensión media', value: `${pensionMediaActual.toLocaleString('es-ES')} €/mes`, sub: '+27% desde 2015', color: '#27ae60' },
          { label: 'Proyección 2050', value: '16,8% PIB', sub: 'Sin reformas (AIReF)', color: '#e74c3c' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Gasto evolución */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gasto total en pensiones 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de millones de euros · Presupuesto ejecutado (Seguridad Social)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={GASTO_PENSIONES.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxGasto}
            color="var(--accent)"
            fmt={v => `${v.toFixed(1)} MM€`}
          />
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            El gasto ha crecido <strong>{gastoSubida}%</strong> en 9 años y supera ya a toda la recaudación del IRPF (<strong>~130.000 M€</strong>). Las pensiones son la mayor partida del presupuesto público español.
          </div>
        </div>
      </div>

      {/* Ratio cotizantes */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Ratio cotizantes por pensionista 2010–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Número de trabajadores cotizando a la Seguridad Social por cada pensionista · Mínimo técnicamente sostenible estimado: 4,0
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
            {RATIO_COTIZANTES.map(d => {
              const pct = Math.round((d.valor / 3.0) * 100);
              const color = d.valor < 2.2 ? '#e74c3c' : d.valor < 2.5 ? '#e67e22' : '#f39c12';
              return (
                <div key={d.year} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{d.year}</div>
                  <div style={{ height: 90, background: 'var(--card-border)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                    <div style={{ height: `${pct}%`, background: color, borderRadius: '0 0 4px 4px' }} />
                    {/* Line at 4.0 (ideal) */}
                    <div style={{ position: 'absolute', bottom: `${Math.round((4.0 / 3.0) * 100)}%`, left: 0, right: 0, height: 1, background: 'rgba(39,174,96,0.7)' }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 4 }}>{d.valor}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            En los 60-70, con demografía expansiva, el ratio superaba 6,0. El envejecimiento demográfico lo ha reducido a 2,54.
            La AIReF estima que para garantizar el equilibrio actuarial se necesitarían al menos 4 cotizantes por pensionista.
          </div>
        </div>
      </div>

      {/* Tipos de pensión */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Desglose por tipo de pensión — 2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de pensionistas y pensión media mensual · Seguridad Social, enero 2024
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipo</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pensionistas (miles)</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Pensión media</th>
                <th style={{ textAlign: 'right', padding: '8px 12px', fontWeight: 600, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>% del total</th>
              </tr>
            </thead>
            <tbody>
              {TIPOS_PENSION.map((t, i) => (
                <tr key={t.tipo} style={{ borderBottom: '1px solid var(--rule)', background: i % 2 === 0 ? 'transparent' : 'color-mix(in srgb, var(--card-border) 30%, transparent)' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 500 }}>{t.tipo}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted-strong)' }}>{t.pensionistas.toLocaleString('es-ES')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--accent)' }}>{t.media.toLocaleString('es-ES')} €</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted)' }}>{((t.pensionistas / TIPOS_PENSION.reduce((s, x) => s + x.pensionistas, 0)) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
            Las pensiones de viudedad (2,3M) tienen una pensión media de 747 €/mes — en muchos casos el único ingreso del hogar.
          </div>
        </div>
      </div>

      {/* Pensión media evolución */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Pensión media contributiva 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          €/mes · Pensión media del sistema contributivo (todas las clases) · Seguridad Social
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={PENSION_MEDIA.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxPension}
            color="#27ae60"
            fmt={v => `${v.toLocaleString('es-ES')} €`}
          />
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
            La pensión media ha crecido un 27% desde 2015 (+249 €). La revalorización está ligada al IPC desde la reforma de 2023.
          </div>
        </div>
      </div>

      {/* Comparativa EU */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gasto en pensiones — Comparativa europea</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % del PIB · Eurostat 2023 · España por encima de la media de la UE-27
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={COMPARATIVA_EU.sort((a, b) => b.pib - a.pib).map(d => ({ label: d.pais, value: d.pib, highlight: d.pais === 'España' }))}
            maxVal={maxEU}
            color="var(--muted-strong)"
            fmt={v => `${v}% PIB`}
            labelWidth={110}
          />
        </div>
      </div>

      {/* Proyección */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Proyección del gasto en pensiones hasta 2050</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % del PIB · Proyección AIReF (Autoridad Independiente de Responsabilidad Fiscal) · Escenario base sin reformas adicionales
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={PROYECCION.map(d => ({ label: String(d.year), value: d.pib, highlight: d.year === 2024 }))}
            maxVal={maxProyeccion}
            color="#e74c3c"
            fmt={v => `${v}% PIB`}
          />
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, #e74c3c 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            ⚠ En 2050 la generación del baby boom (nacidos 1960-1980) estará completamente jubilada.
            Si el gasto llega al 16,8% del PIB sin crecimiento económico equivalente, el sistema requerirá
            financiación adicional de <strong>~50.000 M€/año</strong> sobre los niveles actuales.
          </div>
        </div>
      </div>

      {/* Contexto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { title: 'El problema demográfico', text: 'España tiene una de las tasas de natalidad más bajas de Europa (1,19 hijos/mujer en 2022). Sin inversión del declive demográfico o inmigración masiva de trabajadores jóvenes, el ratio cotizantes/pensionistas seguirá deteriorándose.', color: '#e74c3c' },
          { title: 'La reforma de 2023', text: 'La reforma Escrivá amplió los años de cotización para el cálculo de la pensión máxima (de 25 a 29 años opcionalmente), subió el tipo de la cuota de solidaridad y estableció la revalorización automática con el IPC.', color: '#e67e22' },
          { title: 'El Fondo de Reserva', text: 'La "hucha de las pensiones" llegó a tener 67.000 M€ en 2011. Entre 2012-2017 se gastó casi todo para pagar pensiones durante la crisis. En 2024 tiene ~4.400 M€, suficiente para menos de 10 días de gasto.', color: '#8e44ad' },
          { title: '¿Qué pasa con las pensiones privadas?', text: 'Los planes de pensiones privados cuentan con ~80.000 M€ en activos, muy por debajo de la media europea. Solo el 27% de los trabajadores cotiza a un plan complementario. La dependencia del sistema público es total.', color: '#27ae60' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> Ministerio de Inclusión, Seguridad Social y Migraciones — Estadísticas de Pensiones en vigor ·
        AIReF — Informe sobre las proyecciones de gasto en pensiones 2022–2070 ·
        Eurostat — ESSPROS (Sistema Europeo de Estadísticas de Protección Social) ·
        Banco de España — Informe Anual
      </div>
      </div>{/* cierre del wrapper max-width */}

      {/* ── QUÉ SE DEBERÍA HACER ─────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '52px 0 64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>¿Qué se debería hacer?</div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 32px' }}>
            Cinco reformas para que el sistema sea sostenible en 2050.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { titulo: 'Ampliar el período de cómputo a 35 años', detalle: 'Calcular la pensión sobre los últimos 35 años (en lugar de 25 actuales) reduce la pensión media inicial pero refleja mejor la carrera real cotizada y desincentiva la evasión en los últimos años de trabajo.', impacto: 'Reducción del gasto estimado: ~3.000 M€/año', color: '#ef4d68' },
              { titulo: 'Separar prestaciones contributivas y no contributivas', detalle: 'El sistema contributivo debería financiarse solo con cotizaciones. Las pensiones no contributivas (pagas mínimas, complementos de mínimos) deben financiarse desde Presupuestos Generales vía impuestos. Ahora se mezclan, distorsionando la sostenibilidad.', impacto: 'Transparencia + 10.000 M€ explícitos en PGE', color: '#e67e22' },
              { titulo: 'Incentivo fiscal real al ahorro privado', detalle: 'Los planes de pensiones privados en España suman ~80.000 M€, frente a 1,3 billones en el Reino Unido. Una deducción progresiva real en IRPF (no el límite actual de 1.500 €) descargaría al sistema público.', impacto: 'Reducir dependencia del sistema público en 2–3 pp PIB a largo plazo', color: '#2563eb' },
              { titulo: 'Implantar el Factor de Equidad Intergeneracional', detalle: 'La derogación del Factor de Sostenibilidad en 2021 eliminó el mecanismo que ajustaba automáticamente la cuantía inicial de la pensión a la esperanza de vida. Sin él, cada año que aumenta la longevidad se convierte en más gasto sin ajuste.', impacto: 'Ahorro estructural estimado: 4.000–8.000 M€/año en 2035', color: '#8e44ad' },
              { titulo: 'Incentivar la inmigración laboral cualificada', detalle: 'Con 2,54 cotizantes por pensionista, necesitamos más trabajadores jóvenes cotizando. La inmigración regulada y empleada formalmente es el único camino realista a corto plazo mientras la demografía nacional no repunta.', impacto: '+500.000 cotizantes adicionales = ~2.500 M€/año más en ingresos SS', color: '#059669' },
            ].map(m => (
              <div key={m.titulo} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${m.color}30`, borderRadius: 6, padding: '20px 18px', borderTop: `3px solid ${m.color}` }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#ededeb', marginBottom: 8, lineHeight: 1.35 }}>{m.titulo}</div>
                <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 12 }}>{m.detalle}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: m.color, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font-mono), monospace' }}>→ {m.impacto}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
