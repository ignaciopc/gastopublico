import DeudaCounter from '@/components/ui/DeudaCounter';

export const revalidate = 86400;

// Deuda de las AAPP según el Protocolo de Déficit Excesivo (PDE), fin de año.
// Fuente: Banco de España, Boletín Estadístico, tablas 11.1 y 11.12 (serie actualizada con los datos del 2T 2026,
// publicados el 30/09/2026). total = millones de euros; pib = % del PIB tal como lo publica el BdE.
// Comprobación: pib = total / PIB pm (tabla 11.1) × 100.
const DEUDA_PIB = [
  { year: 2009, pib: 53.1, total: 569_535 },
  { year: 2010, pib: 60.3, total: 649_153 },
  { year: 2011, pib: 69.5, total: 743_043 },
  { year: 2012, pib: 89.6, total: 927_813 },
  { year: 2013, pib: 100.0, total: 1_025_805 },
  { year: 2014, pib: 104.4, total: 1_085_165 },
  { year: 2015, pib: 102.5, total: 1_114_129 },
  { year: 2016, pib: 102.0, total: 1_145_655 },
  { year: 2017, pib: 101.2, total: 1_184_148 },
  { year: 2018, pib: 99.8, total: 1_209_742 },
  { year: 2019, pib: 97.7, total: 1_224_364 },
  { year: 2020, pib: 119.3, total: 1_346_916 },
  { year: 2021, pib: 115.7, total: 1_429_404 },
  { year: 2022, pib: 109.3, total: 1_504_105 },
  { year: 2023, pib: 105.3, total: 1_575_377 },
  { year: 2024, pib: 101.4, total: 1_620_578 },
  { year: 2025, pib: 100.5, total: 1_698_355 },
];

// Último dato trimestral: 30/06/2026 (Banco de España, nota de 30/09/2026).
const ULTIMO_TRIMESTRE = { fecha: '30/06/2026', total: 1_762_936, pib: 101.4 };
// Población residente a 1/07/2026 (INE, Estadística Continua de Población, 06/08/2026).
const POBLACION_1JUL2026 = 49_801_559;
// Deuda por habitante = 1.762.936 M€ × 1e6 / 49.801.559 = 35.399 €
const DEUDA_PER_CAPITA = Math.round((ULTIMO_TRIMESTRE.total * 1e6) / POBLACION_1JUL2026);

// Intereses (gasto por intereses) del conjunto de las AAPP, contabilidad nacional, millones de euros.
// Fuente: IGAE, Informe trimestral de las AAPP (4.º trimestre). Cada año se toma del informe más
// reciente consultado que lo incluye: 2020–2021 → IT 4T 2021; 2022 → IT 4T 2023; 2023 → IT 4T 2024;
// 2024–2025 → IT 4T 2025.
const INTERESES = [
  { year: 2020, valor: 25_237 },
  { year: 2021, valor: 26_085 },
  { year: 2022, valor: 31_809 },
  { year: 2023, valor: 35_707 },
  { year: 2024, valor: 38_793 },
  { year: 2025, valor: 40_314 },
];
const INTERESES_PIB_2025 = 2.39; // % del PIB, IGAE IT 4T 2025
const EMPLEOS_NO_FIN_2025 = 764_884; // M€, empleos no financieros AAPP 2025, IGAE IT 4T 2025

// Deuda/PIB 2025 (%), Eurostat, «Provision of deficit and debt data for 2025 – first notification», 22/04/2026.
const COMPARATIVA_EU = [
  { pais: 'Grecia', pib: 146.1 },
  { pais: 'Italia', pib: 137.1 },
  { pais: 'Francia', pib: 115.6 },
  { pais: 'Bélgica', pib: 107.9 },
  { pais: 'España', pib: 100.7 },
  { pais: 'Portugal', pib: 89.7 },
  { pais: 'UE-27', pib: 81.7 },
  { pais: 'Austria', pib: 81.5 },
  { pais: 'Alemania', pib: 63.5 },
  { pais: 'Países Bajos', pib: 44.4 },
];

// Deuda PDE de cada CCAA sobre su PIB regional, 2T 2026 (%).
// Fuente: Banco de España, Boletín Estadístico, tabla 13.10; nota de prensa de 30/09/2026.
const DEUDA_CCAA = [
  { ccaa: 'C. Valenciana', pib: 40.0 },
  { ccaa: 'R. de Murcia', pib: 30.8 },
  { ccaa: 'Cataluña', pib: 28.1 },
  { ccaa: 'Castilla-La Mancha', pib: 28.1 },
  { ccaa: 'Extremadura', pib: 19.2 },
  { ccaa: 'Castilla y León', pib: 18.3 },
  { ccaa: 'Andalucía', pib: 18.2 },
  { ccaa: 'Illes Balears', pib: 17.8 },
  { ccaa: 'Aragón', pib: 17.4 },
  { ccaa: 'Cantabria', pib: 17.2 },
  { ccaa: 'La Rioja', pib: 16.4 },
  { ccaa: 'Galicia', pib: 15.0 },
  { ccaa: 'P. de Asturias', pib: 12.5 },
  { ccaa: 'C. de Madrid', pib: 12.3 },
  { ccaa: 'País Vasco', pib: 11.7 },
  { ccaa: 'Canarias', pib: 10.9 },
  { ccaa: 'C. F. de Navarra', pib: 8.4 },
];
const DEUDA_CCAA_TOTAL = { mm: 355, pibNacional: 20.4 }; // total CCAA, mm€ y % del PIB de España, 2T 2026

const fmtM = (v: number) => `${v.toLocaleString('es-ES')} M€`;
const fmtPct = (v: number) => `${v.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

function BarChart({ data, maxVal, color = 'var(--accent)', fmt, labelWidth = 40, valueWidth = 80 }: {
  data: { label: string; value: number; highlight?: boolean }[];
  maxVal: number;
  color?: string;
  fmt: (v: number) => string;
  labelWidth?: number;
  valueWidth?: number;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map(({ label, value, highlight }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: labelWidth, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{label}</span>
          <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 18, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((value / maxVal) * 100)}%`, background: highlight ? 'var(--accent)' : color, height: '100%', borderRadius: 2 }} />
          </div>
          <span style={{ width: valueWidth, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function DeudaPage() {
  const deudaActual = DEUDA_PIB[DEUDA_PIB.length - 1];
  const deudaAnterior = DEUDA_PIB[DEUDA_PIB.length - 2];
  const deudaBase = DEUDA_PIB[0];
  const interesesActual = INTERESES[INTERESES.length - 1];
  const maxPib = Math.max(...DEUDA_PIB.map(d => d.pib));
  const maxTotal = Math.max(...DEUDA_PIB.map(d => d.total));
  const maxIntereses = Math.max(...INTERESES.map(d => d.valor));
  const maxEU = Math.max(...COMPARATIVA_EU.map(d => d.pib));
  const maxCCAA = Math.max(...DEUDA_CCAA.map(d => d.pib));

  // Variación anual 2025 = 1.698.355 − 1.620.578 = 77.777 M€
  const variacionAnual = deudaActual.total - deudaAnterior.total;
  // Intereses medios por segundo = 40.314 M€ × 1e6 / (365 × 86.400 s) ≈ 1.278 €/s (2025 no es bisiesto)
  const interesesPorSegundo = Math.round((interesesActual.valor * 1e6) / (365 * 86_400));
  // Intereses medios por día = 40.314 / 365 ≈ 110 M€
  const interesesPorDia = Math.round(interesesActual.valor / 365);
  // Peso de los intereses en los empleos no financieros = 40.314 / 764.884 × 100 ≈ 5,3%
  const interesesSobreEmpleos = (interesesActual.valor / EMPLEOS_NO_FIN_2025) * 100;
  // Posición de España en la UE-27 por deuda/PIB 2025 (Eurostat): se cuenta solo países, no la media
  const posicionUE = COMPARATIVA_EU.filter(d => d.pais !== 'UE-27').sort((a, b) => b.pib - a.pib).findIndex(d => d.pais === 'España') + 1;

  return (
    <main>

      {/* ── HERO OSCURO ───────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Banco de España · IGAE · Eurostat · INE
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            Deuda de las Administraciones Públicas.
          </h1>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono), monospace', marginBottom: 6 }}>
              Deuda pública (estimación, no es un dato publicado)
            </div>
            <div style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 800, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', lineHeight: 1 }}>
              <DeudaCounter />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 6, fontFamily: 'var(--font-mono), monospace', maxWidth: 720, lineHeight: 1.5 }}>
              El contador extrapola linealmente un dato oficial del Banco de España con un ritmo medio de crecimiento. Último dato oficial trimestral: {fmtM(ULTIMO_TRIMESTRE.total)} a {ULTIMO_TRIMESTRE.fecha}.
            </div>
          </div>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 680, lineHeight: 1.6, margin: '0 0 32px' }}>
            A {ULTIMO_TRIMESTRE.fecha} la deuda de las AAPP según el Protocolo de Déficit Excesivo era de{' '}
            <strong style={{ color: '#ededeb' }}>{fmtM(ULTIMO_TRIMESTRE.total)}</strong>, el {fmtPct(ULTIMO_TRIMESTRE.pib)} del PIB (Banco de España).
            En 2025 el gasto por intereses de las AAPP fue de{' '}
            <strong style={{ color: '#ededeb' }}>{fmtM(interesesActual.valor)}</strong> (IGAE, contabilidad nacional).
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: `Deuda AAPP · ${ULTIMO_TRIMESTRE.fecha}`, value: fmtM(ULTIMO_TRIMESTRE.total), sub: 'PDE · Banco de España (30/09/2026)' },
              { label: `% del PIB · ${ULTIMO_TRIMESTRE.fecha}`, value: fmtPct(ULTIMO_TRIMESTRE.pib), sub: 'Valor de referencia UE: 60%' },
              { label: `Intereses AAPP · ${interesesActual.year}`, value: fmtM(interesesActual.valor), sub: `${INTERESES_PIB_2025.toLocaleString('es-ES')}% del PIB · IGAE` },
              { label: 'Deuda por habitante', value: `${DEUDA_PER_CAPITA.toLocaleString('es-ES')} €`, sub: `Deuda ${ULTIMO_TRIMESTRE.fecha} ÷ población 1/07/2026 (INE)` },
              { label: 'Posición UE-27 · 2025', value: `${posicionUE}.ª`, sub: 'Deuda/PIB · Eurostat (22/04/2026)' },
            ].map((k, i, arr) => (
              <div key={k.label} style={{ padding: '18px 20px', background: 'rgba(255,255,255,0.02)', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 0 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: '#ededeb', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>{k.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 10 }}>
            Avance mensual más reciente del Banco de España (21/10/2026): 1.750 mm€ a agosto de 2026, el 99,7% del PIB.
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 0' }}>

      {/* KPI Strip — cierre del último año completo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))', gap: 12, marginBottom: 48 }}>
        {[
          { label: `Deuda a 31/12/${deudaActual.year}`, value: fmtM(deudaActual.total), sub: `${variacionAnual > 0 ? '+' : ''}${fmtM(variacionAnual)} respecto a ${deudaAnterior.year}` },
          { label: `% del PIB ${deudaActual.year}`, value: fmtPct(deudaActual.pib), sub: `${fmtPct(deudaBase.pib)} en ${deudaBase.year}` },
          { label: `Intereses AAPP ${interesesActual.year}`, value: fmtM(interesesActual.valor), sub: `${interesesPorSegundo.toLocaleString('es-ES')} €/segundo de media` },
          { label: `Intereses / empleos no financieros ${interesesActual.year}`, value: fmtPct(interesesSobreEmpleos), sub: `Sobre ${fmtM(EMPLEOS_NO_FIN_2025)} · IGAE` },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--foreground)', lineHeight: 1.1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Deuda % PIB evolución */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Deuda pública % del PIB — {deudaBase.year}–{deudaActual.year}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Administraciones Públicas · Protocolo de Déficit Excesivo (PDE) · Banco de España, Boletín Estadístico, tablas 11.1 y 11.12 (serie actualizada a 30/09/2026) · dato a 31 de diciembre de cada año
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {DEUDA_PIB.map(d => {
              const pct = Math.round((d.pib / maxPib) * 100);
              const isLast = d.year === deudaActual.year;
              return (
                <div key={d.year} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 36, fontSize: 11, color: isLast ? 'var(--foreground)' : 'var(--muted)', textAlign: 'right', flexShrink: 0, fontWeight: isLast ? 700 : 400 }}>{d.year}</span>
                  <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 20, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${pct}%`, background: 'var(--muted-strong)', height: '100%', borderRadius: 2 }} />
                    {/* Línea del 60% (valor de referencia del Protocolo n.º 12 del TFUE) */}
                    <div style={{ position: 'absolute', left: `${Math.round((60 / maxPib) * 100)}%`, top: 0, bottom: 0, width: 1, background: 'var(--accent)' }} />
                  </div>
                  <span style={{ width: 52, fontSize: 11, fontWeight: isLast ? 700 : 400, color: isLast ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0 }}>{fmtPct(d.pib)}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ display: 'inline-block', width: 20, height: 2, background: 'var(--accent)', flexShrink: 0 }} />
            Línea vertical = valor de referencia del 60% del PIB (Protocolo n.º 12 del TFUE, criterio de Maastricht). La ratio de España está por encima de ese valor desde 2010.
          </div>
        </div>
      </div>

      {/* Deuda en euros absolutos */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Deuda total en millones de euros — {deudaBase.year}–{deudaActual.year}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Millones de euros · Deuda bruta consolidada de las AA.PP. según el PDE, a 31 de diciembre · Banco de España
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={DEUDA_PIB.map(d => ({ label: String(d.year), value: d.total }))}
            maxVal={maxTotal}
            color="var(--muted-strong)"
            fmt={fmtM}
            labelWidth={36}
            valueWidth={96}
          />
        </div>
      </div>

      {/* Intereses */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gasto en intereses de las AAPP — {INTERESES[0].year}–{interesesActual.year}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Millones de euros · Conjunto de las Administraciones Públicas, contabilidad nacional (intereses devengados) · IGAE, Informe trimestral de las AAPP (4.º trimestre). 2020–2021: informe 4T 2021; 2022: 4T 2023; 2023: 4T 2024; 2024–2025: 4T 2025.
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={INTERESES.map(d => ({ label: String(d.year), value: d.valor, highlight: d.year === interesesActual.year }))}
            maxVal={maxIntereses * 1.1}
            color="var(--muted-strong)"
            fmt={fmtM}
            valueWidth={90}
          />
          <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 12 }}>
            {[
              { label: `Media diaria ${interesesActual.year}`, value: `${interesesPorDia.toLocaleString('es-ES')} M€/día` },
              { label: `Media por segundo ${interesesActual.year}`, value: `${interesesPorSegundo.toLocaleString('es-ES')} €/s` },
              { label: `% del PIB ${interesesActual.year}`, value: `${INTERESES_PIB_2025.toLocaleString('es-ES')}%` },
              { label: `% de los empleos no financieros ${interesesActual.year}`, value: fmtPct(interesesSobreEmpleos) },
            ].map(r => (
              <div key={r.label} style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--foreground)' }}>{r.value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            Medias calculadas como intereses anuales ÷ 365 días (o ÷ 31.536.000 s). Esta serie es de las AAPP en contabilidad nacional; no coincide con los pagos del capítulo 3 del presupuesto del Estado (35.900 M€ pagados en 2025, IGAE, avance de ejecución presupuestaria de diciembre de 2025).
          </div>
        </div>
      </div>

      {/* Comparativa EU */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Comparativa europea — Deuda/PIB 2025</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % del PIB · Eurostat, notificación PDE de abril de 2026 (22/04/2026) · España ocupa la {posicionUE}.ª posición de 27
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={[...COMPARATIVA_EU].sort((a, b) => b.pib - a.pib).map(d => ({ label: d.pais, value: d.pib, highlight: d.pais === 'España' }))}
            maxVal={maxEU}
            color="var(--muted-strong)"
            fmt={fmtPct}
            labelWidth={110}
          />
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            Eurostat publicó para España un 100,7% en abril de 2026; la serie del Banco de España actualizada el 30/09/2026 da un 100,5% para 2025.
          </div>
        </div>
      </div>

      {/* Deuda por CCAA */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Deuda de las CCAA — % del PIB regional ({ULTIMO_TRIMESTRE.fecha})</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Deuda PDE de cada Comunidad Autónoma sobre su propio PIB regional · Banco de España, Boletín Estadístico, tabla 13.10 (2T 2026)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={DEUDA_CCAA.map(d => ({ label: d.ccaa, value: d.pib }))}
            maxVal={maxCCAA}
            color="var(--muted-strong)"
            fmt={fmtPct}
            labelWidth={145}
          />
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            El conjunto de las CCAA debía {DEUDA_CCAA_TOTAL.mm} mm€ a {ULTIMO_TRIMESTRE.fecha}, el {fmtPct(DEUDA_CCAA_TOTAL.pibNacional)} del PIB de España (este total se mide sobre el PIB nacional, no es comparable con las ratios regionales).
          </div>
        </div>
      </div>

      {/* Contexto: solo datos de las series anteriores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          // 1.346.916 − 1.224.364 = 122.552 M€; PIB pm 2020/2019 = 1.129.214 / 1.253.710 − 1 = −9,9% (BdE, tabla 11.1)
          { title: '2019–2020', text: 'La ratio pasó del 97,7% al 119,3% del PIB. La deuda aumentó en 122.552 M€ y el PIB nominal se redujo un 9,9% (Banco de España, tabla 11.1).' },
          // Deuda 2025/2020 = 1.698.355 / 1.346.916 − 1 = +26,1%; PIB 2025/2020 = 1.690.012 / 1.129.214 − 1 = +49,7%
          { title: '2020–2025', text: 'La deuda en euros aumentó un 26,1% y el PIB nominal un 49,7%. La ratio bajó del 119,3% al 100,5% del PIB (Banco de España, tabla 11.1).' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong>{' '}
        <a href="https://www.bde.es/webbe/es/estadisticas/compartido/datos/pdf/a1112.pdf">Banco de España — Deuda según el PDE, tablas 11.1 y 11.12</a> y{' '}
        <a href="https://www.bde.es/wbe/es/noticias-eventos/actualidad-banco-espana/deuda-aapp-2026t2.html">nota del 2T 2026 (30/09/2026)</a> ·{' '}
        <a href="https://www.bde.es/webbe/es/estadisticas/compartido/datos/pdf/a1310.pdf">Banco de España — Deuda PDE por CCAA, tabla 13.10</a> ·{' '}
        <a href="https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/Cap_Trim/IT_4T_2025.pdf">IGAE — Informe trimestral de las AAPP, 4T 2025</a> ·{' '}
        <a href="https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-22042026-bp">Eurostat — Deficit and debt data for 2025, 1.ª notificación (22/04/2026)</a> ·{' '}
        <a href="https://www.ine.es/dyngs/Prensa/ECP2T26.htm">INE — Estadística Continua de Población, 1/07/2026</a> ·{' '}
        <a href="https://eur-lex.europa.eu/eli/treaty/tfeu_2016/pro_12/oj/eng">Protocolo n.º 12 del TFUE</a>
      </div>
      </div>{/* cierre del wrapper max-width */}
    </main>
  );
}
