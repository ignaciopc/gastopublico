import DeudaCounter from '@/components/ui/DeudaCounter';

export const revalidate = 86400;

const DEUDA_PIB = [
  { year: 2008, pib: 39.7, total: 440 },
  { year: 2009, pib: 52.8, total: 570 },
  { year: 2010, pib: 60.1, total: 650 },
  { year: 2011, pib: 69.5, total: 740 },
  { year: 2012, pib: 85.7, total: 890 },
  { year: 2013, pib: 95.5, total: 966 },
  { year: 2014, pib: 100.4, total: 1034 },
  { year: 2015, pib: 99.3, total: 1073 },
  { year: 2016, pib: 99.2, total: 1107 },
  { year: 2017, pib: 98.6, total: 1144 },
  { year: 2018, pib: 97.6, total: 1173 },
  { year: 2019, pib: 95.5, total: 1188 },
  { year: 2020, pib: 120.0, total: 1346 },
  { year: 2021, pib: 118.4, total: 1427 },
  { year: 2022, pib: 113.2, total: 1502 },
  { year: 2023, pib: 109.8, total: 1578 },
  { year: 2024, pib: 107.7, total: 1623 },
];

const INTERESES = [
  { year: 2015, valor: 32.9 },
  { year: 2016, valor: 31.4 },
  { year: 2017, valor: 31.5 },
  { year: 2018, valor: 30.4 },
  { year: 2019, valor: 30.0 },
  { year: 2020, valor: 27.9 },
  { year: 2021, valor: 27.0 },
  { year: 2022, valor: 27.8 },
  { year: 2023, valor: 31.9 },
  { year: 2024, valor: 37.5 },
];

const COMPARATIVA_EU = [
  { pais: 'Grecia', pib: 161.9 },
  { pais: 'Italia', pib: 137.3 },
  { pais: 'Francia', pib: 111.9 },
  { pais: 'España', pib: 109.8 },
  { pais: 'Portugal', pib: 99.1 },
  { pais: 'Bélgica', pib: 105.2 },
  { pais: 'UE-27 media', pib: 81.7 },
  { pais: 'Austria', pib: 77.8 },
  { pais: 'Alemania', pib: 63.6 },
  { pais: 'Países Bajos', pib: 46.3 },
];

const DEUDA_CCAA = [
  { ccaa: 'Comunidad Valenciana', pib: 35.2 },
  { ccaa: 'Castilla-La Mancha', pib: 28.4 },
  { ccaa: 'Murcia', pib: 27.1 },
  { ccaa: 'Cataluña', pib: 24.8 },
  { ccaa: 'Andalucía', pib: 22.6 },
  { ccaa: 'Aragón', pib: 18.3 },
  { ccaa: 'España media', pib: 15.1 },
  { ccaa: 'Madrid', pib: 12.9 },
  { ccaa: 'País Vasco', pib: 10.4 },
];

function BarChart({ data, maxVal, color = 'var(--accent)', fmt, labelWidth = 40 }: {
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
          <span style={{ width: 80, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function DeudaPage() {
  const deudaActual = DEUDA_PIB[DEUDA_PIB.length - 1];
  const deudaBase = DEUDA_PIB[0];
  const interesesActual = INTERESES[INTERESES.length - 1].valor;
  const maxPib = Math.max(...DEUDA_PIB.map(d => d.pib));
  const maxTotal = Math.max(...DEUDA_PIB.map(d => d.total));
  const maxIntereses = Math.max(...INTERESES.map(d => d.valor));
  const maxEU = Math.max(...COMPARATIVA_EU.map(d => d.pib));
  const maxCCAA = Math.max(...DEUDA_CCAA.map(d => d.pib));

  const interesesPorSegundo = Math.round((interesesActual * 1_000_000_000) / (365.25 * 24 * 3600));

  return (
    <main>

      {/* ── HERO OSCURO ───────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Banco de España · Eurostat · Ministerio de Hacienda
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            La deuda de España sube en este momento.
          </h1>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono), monospace', marginBottom: 6 }}>
              Deuda pública ahora mismo
            </div>
            <div style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', lineHeight: 1 }}>
              <DeudaCounter />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontFamily: 'var(--font-mono), monospace' }}>
              +1.515 €/segundo · +131 M€/día · +47.800 M€/año
            </div>
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 680, lineHeight: 1.6, margin: '0 0 32px' }}>
            El {deudaActual.pib}% del PIB. Solo en intereses pagamos{' '}
            <strong style={{ color: '#ededeb' }}>37.500 millones al año</strong> —
            más que todo el presupuesto de Educación. La deuda creció un{' '}
            <strong style={{ color: '#ef4d68' }}>{Math.round(((deudaActual.total - deudaBase.total) / deudaBase.total) * 100)}%</strong>{' '}
            desde 2008.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Deuda total', value: '1,64 bill. €', sub: `+${Math.round(((deudaActual.total - deudaBase.total) / deudaBase.total) * 100)}% desde 2008` },
              { label: '% del PIB', value: `${deudaActual.pib}%`, sub: 'Límite Maastricht: 60%' },
              { label: 'Intereses/año', value: `${interesesActual} MM€`, sub: `${interesesPorSegundo.toLocaleString('es-ES')} €/seg` },
              { label: 'Deuda per cápita', value: '~34.000 €', sub: 'Por cada habitante' },
              { label: 'Ranking UE', value: '4ª', sub: 'En deuda/PIB' },
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12, marginBottom: 48 }}>
        {[
          { label: 'Deuda total 2024', value: '1,62 bill. €', sub: `+${Math.round(((deudaActual.total - deudaBase.total) / deudaBase.total) * 100)}% desde 2008`, color: 'var(--accent)' },
          { label: '% del PIB', value: `${deudaActual.pib}%`, sub: `vs ${deudaBase.pib}% en 2008`, color: '#e74c3c' },
          { label: 'Intereses/año', value: `${interesesActual.toFixed(1)} MM€`, sub: `${interesesPorSegundo.toLocaleString('es-ES')} €/segundo`, color: '#e67e22' },
          { label: 'Deuda per cápita', value: '~34.000 €', sub: 'por cada habitante', color: '#8e44ad' },
          { label: 'Ranking UE', value: '4ª', sub: 'en deuda/PIB (2023)', color: '#e74c3c' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Deuda % PIB evolución */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Deuda pública % del PIB — 2008–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Administraciones Públicas · Protocolo de Déficit Excesivo (PDE) · Banco de España
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {DEUDA_PIB.map(d => {
              const pct = Math.round((d.pib / maxPib) * 100);
              const color = d.pib >= 100 ? '#e74c3c' : d.pib >= 85 ? '#e67e22' : '#f39c12';
              const isLast = d.year === deudaActual.year;
              return (
                <div key={d.year} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 36, fontSize: 11, color: isLast ? 'var(--foreground)' : 'var(--muted)', textAlign: 'right', flexShrink: 0, fontWeight: isLast ? 700 : 400 }}>{d.year}</span>
                  <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 20, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 2 }} />
                    {/* 60% Maastricht line */}
                    <div style={{ position: 'absolute', left: `${Math.round((60 / maxPib) * 100)}%`, top: 0, bottom: 0, width: 1, background: 'rgba(39,174,96,0.6)' }} />
                  </div>
                  <span style={{ width: 52, fontSize: 11, fontWeight: isLast ? 700 : 400, color: isLast ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0 }}>{d.pib}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ display: 'inline-block', width: 20, height: 2, background: '#27ae60' }} />
            Línea verde = límite del 60% del PIB establecido por el Tratado de Maastricht. España lo incumple desde 2010.
          </div>
        </div>
      </div>

      {/* Deuda en euros absolutos */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Deuda total en millones de euros — 2008–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de millones de euros · Deuda bruta consolidada de las AA.PP.
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={DEUDA_PIB.map(d => ({ label: String(d.year), value: d.total }))}
            maxVal={maxTotal}
            color="#e74c3c"
            fmt={v => `${v.toLocaleString('es-ES')} MM€`}
            labelWidth={36}
          />
        </div>
      </div>

      {/* Intereses */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Intereses pagados por la deuda — 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de millones de euros anuales · El coste de financiar la deuda acumulada
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={INTERESES.map(d => ({ label: String(d.year), value: d.valor, highlight: d.year === 2024 }))}
            maxVal={maxIntereses * 1.1}
            color="#e67e22"
            fmt={v => `${v.toFixed(1)} MM€`}
          />
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
            {[
              { label: 'Intereses diarios', value: `${Math.round(interesesActual * 1e9 / 365.25 / 1e6).toLocaleString('es-ES')} M€/día` },
              { label: 'Intereses por segundo', value: `${interesesPorSegundo.toLocaleString('es-ES')} €/seg` },
              { label: 'Más que educación completa', value: `Educación: ~35.000 M€` },
              { label: 'Equivale a…', value: '12 hospitales grandes/día' },
            ].map(r => (
              <div key={r.label} style={{ background: 'color-mix(in srgb, #e67e22 10%, transparent)', borderRadius: 6, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e67e22' }}>{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparativa EU */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Comparativa europea — Deuda/PIB 2023</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % del PIB · Eurostat, Protocolo de Déficit Excesivo · España en 4.ª posición
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={COMPARATIVA_EU.sort((a, b) => b.pib - a.pib).map(d => ({ label: d.pais, value: d.pib, highlight: d.pais === 'España' }))}
            maxVal={maxEU}
            color="var(--muted-strong)"
            fmt={v => `${v}%`}
            labelWidth={110}
          />
        </div>
      </div>

      {/* Deuda por CCAA */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Deuda de las CCAA — % del PIB regional (2023)</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Deuda de cada Comunidad Autónoma sobre su propio PIB regional · Ministerio de Hacienda
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={DEUDA_CCAA.sort((a, b) => b.pib - a.pib).map(d => ({ label: d.ccaa, value: d.pib, highlight: d.ccaa === 'España media' }))}
            maxVal={maxCCAA}
            color="#e74c3c"
            fmt={v => `${v}%`}
            labelWidth={145}
          />
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            La Comunidad Valenciana lidera el endeudamiento autonómico con el 35% de su PIB regional. Es la CCAA que recibió más rescates del Fondo de Liquidez Autonómica (FLA).
          </div>
        </div>
      </div>

      {/* Contexto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { title: '¿Por qué explotó la deuda en 2020?', text: 'La pandemia obligó a disparar el gasto público (ERTE, ayudas directas, sanidad) mientras el PIB se desplomaba un 10,8%. La deuda saltó de 95,5% a 120% del PIB en un solo año. El mayor salto desde la Guerra Civil.', color: 'var(--accent)' },
          { title: '¿Por qué bajó desde 2021?', text: 'El denominador (PIB) creció con fuerza por la inflación y la recuperación económica post-COVID. La deuda nominal siguió creciendo en euros absolutos, pero el ratio deuda/PIB bajó al crecer el PIB más rápido.', color: '#27ae60' },
          { title: 'El efecto bola de nieve', text: 'Cuando el tipo de interés supera el crecimiento económico, la deuda crece sola aunque haya superávit primario. Con tipos al 3-4% y crecimiento al ~2%, España está en zona de riesgo de espiral de deuda.', color: '#e67e22' },
          { title: 'El riesgo de refinanciación', text: 'España necesita refinanciar ~200.000 M€ de deuda cada año. Si los mercados pierden confianza y suben la prima de riesgo, el coste se dispara. El spread con Alemania fue de 650pb en 2012 (crisis del euro).', color: '#e74c3c' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> Banco de España — Deuda de las Administraciones Públicas según el Protocolo de Déficit Excesivo ·
        Eurostat — Government finance statistics ·
        Ministerio de Hacienda — Deuda de las Comunidades Autónomas ·
        AIReF — Informe sobre sostenibilidad fiscal a largo plazo
      </div>
      </div>{/* cierre del wrapper max-width */}
    </main>
  );
}
