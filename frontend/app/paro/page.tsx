export const revalidate = 86400;

const PARO_GENERAL = [
  { year: 2015, valor: 22.1 },
  { year: 2016, valor: 19.6 },
  { year: 2017, valor: 17.2 },
  { year: 2018, valor: 15.3 },
  { year: 2019, valor: 14.1 },
  { year: 2020, valor: 15.5 },
  { year: 2021, valor: 14.8 },
  { year: 2022, valor: 12.9 },
  { year: 2023, valor: 11.8 },
  { year: 2024, valor: 11.2 },
];

const PARO_JUVENIL = [
  { year: 2015, valor: 46.3 },
  { year: 2016, valor: 44.4 },
  { year: 2017, valor: 38.6 },
  { year: 2018, valor: 34.3 },
  { year: 2019, valor: 32.5 },
  { year: 2020, valor: 38.3 },
  { year: 2021, valor: 30.7 },
  { year: 2022, valor: 28.0 },
  { year: 2023, valor: 27.9 },
  { year: 2024, valor: 26.8 },
];

const CCAA = [
  { nombre: 'Ceuta', tasa: 22.1 },
  { nombre: 'Melilla', tasa: 21.4 },
  { nombre: 'Canarias', tasa: 17.0 },
  { nombre: 'Extremadura', tasa: 18.8 },
  { nombre: 'Andalucía', tasa: 17.2 },
  { nombre: 'Murcia', tasa: 14.2 },
  { nombre: 'C-La Mancha', tasa: 14.0 },
  { nombre: 'C. Valenciana', tasa: 12.8 },
  { nombre: 'España', tasa: 11.2 },
  { nombre: 'Aragón', tasa: 8.5 },
  { nombre: 'La Rioja', tasa: 8.2 },
  { nombre: 'País Vasco', tasa: 7.8 },
  { nombre: 'Navarra', tasa: 7.2 },
].sort((a, b) => b.tasa - a.tasa);

const EU_PARO = [
  { pais: 'España', tasa: 11.2, color: 'var(--accent)' },
  { pais: 'Grecia', tasa: 10.4, color: 'var(--muted-strong)' },
  { pais: 'Italia', tasa: 6.7, color: 'var(--muted-strong)' },
  { pais: 'Francia', tasa: 7.3, color: 'var(--muted-strong)' },
  { pais: 'Portugal', tasa: 6.4, color: 'var(--muted-strong)' },
  { pais: 'UE-27 media', tasa: 5.9, color: 'var(--muted-strong)' },
  { pais: 'Alemania', tasa: 3.4, color: 'var(--muted-strong)' },
  { pais: 'Países Bajos', tasa: 3.7, color: 'var(--muted-strong)' },
];

const SECTORES = [
  { sector: 'Agricultura', parados: 171 },
  { sector: 'Industria', parados: 245 },
  { sector: 'Construcción', parados: 312 },
  { sector: 'Servicios', parados: 2142 },
  { sector: 'Sin empleo anterior', parados: 498 },
];

function BarChart({ data, maxVal, color = 'var(--accent)', fmt }: {
  data: { label: string; value: number; highlight?: boolean }[];
  maxVal: number;
  color?: string;
  fmt: (v: number) => string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map(({ label, value, highlight }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 90, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{label}</span>
          <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 18, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((value / maxVal) * 100)}%`, background: highlight ? 'var(--accent)' : color, height: '100%', borderRadius: 2 }} />
          </div>
          <span style={{ width: 48, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ParoPage() {
  const paroActual = PARO_GENERAL[PARO_GENERAL.length - 1].valor;
  const paroPico = Math.max(...PARO_GENERAL.map(d => d.valor));
  const paroJuvenilActual = PARO_JUVENIL[PARO_JUVENIL.length - 1].valor;
  const maxCCAA = Math.max(...CCAA.map(d => d.tasa));
  const maxEU = Math.max(...EU_PARO.map(d => d.tasa));
  const totalParados = SECTORES.reduce((s, d) => s + d.parados, 0);

  return (
    <main>

      {/* ── HERO OSCURO ───────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            INE · Encuesta de Población Activa (EPA)
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            El doble de paro que Europa.<br />
            <span style={{ color: '#ef4d68' }}>Desde hace décadas.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 720, lineHeight: 1.6, margin: '0 0 32px' }}>
            España tiene el <strong style={{ color: '#ef4d68' }}>{paroActual}% de paro</strong> —
            la tasa más alta de la UE y el doble de la media europea (5,9%).
            El paro juvenil llega al <strong style={{ color: '#ef4d68' }}>{paroJuvenilActual}%</strong>,
            casi 3 veces la media alemana. Entre Navarra (7,2%) y Ceuta (22,1%) hay 15 puntos de diferencia.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Tasa de paro 2024', value: `${paroActual}%`, sub: '1ª en la UE' },
              { label: 'Paro juvenil <25', value: `${paroJuvenilActual}%`, sub: 'Media UE: 14,9%' },
              { label: 'Parados totales', value: `${(totalParados / 1000).toFixed(2)} M`, sub: 'Q1 2024 EPA' },
              { label: 'Pico histórico', value: `${paroPico}%`, sub: '2013 — crisis financiera' },
              { label: 'Mejor CCAA', value: '7,2%', sub: 'Navarra' },
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
          { label: 'Tasa de paro 2024', value: `${paroActual}%`, sub: '1ª en la UE', color: 'var(--accent)' },
          { label: 'Paro juvenil <25', value: `${paroJuvenilActual}%`, sub: 'Media UE: 14,9%', color: '#e74c3c' },
          { label: 'Parados totales', value: `${(totalParados / 1000).toFixed(2)} M`, sub: 'Q1 2024 (EPA)', color: '#e67e22' },
          { label: 'Pico histórico', value: `${paroPico}%`, sub: '2013 (crisis)', color: '#8e44ad' },
          { label: 'Mejor CCAA 2024', value: '7,2%', sub: 'Navarra (EPA)', color: '#27ae60' },
          { label: 'Peor CCAA 2024', value: '22,1%', sub: 'Ceuta', color: '#e74c3c' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Evolución paro general */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Evolución del paro 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Tasa de desempleo anual (media anual EPA, INE) · % sobre población activa
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PARO_GENERAL.map(d => {
              const pct = Math.round((d.valor / 25) * 100);
              const color = d.valor >= 18 ? '#e74c3c' : d.valor >= 14 ? '#e67e22' : '#27ae60';
              return (
                <div key={d.year} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 36, fontSize: 11, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{d.year}</span>
                  <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 22, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 2 }} />
                    {/* EU average line at ~6% */}
                    <div style={{ position: 'absolute', left: `${Math.round((5.9 / 25) * 100)}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.5)' }} />
                  </div>
                  <span style={{ width: 42, fontSize: 12, fontWeight: 700, color, textAlign: 'right', flexShrink: 0 }}>{d.valor}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: 11, color: 'var(--muted)' }}>
            La línea vertical blanca indica la media de la UE-27 (5,9%). España la dobla en todos los años del período.
          </div>
        </div>
      </div>

      {/* Paro juvenil */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Paro juvenil ({'<'}25 años) 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % sobre población activa menor de 25 años · España vs Media UE (14,9%)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
            {PARO_JUVENIL.map(d => {
              const pct = Math.round((d.valor / 50) * 100);
              const color = d.valor >= 35 ? '#e74c3c' : d.valor >= 28 ? '#e67e22' : '#f39c12';
              return (
                <div key={d.year} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{d.year}</div>
                  <div style={{ height: 90, background: 'var(--card-border)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
                    <div style={{ height: `${pct}%`, background: color, borderRadius: '0 0 4px 4px' }} />
                    {/* EU line at 14.9% */}
                    <div style={{ position: 'absolute', bottom: `${Math.round((14.9 / 50) * 100)}%`, left: 0, right: 0, height: 1, background: 'rgba(39,174,96,0.8)' }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color, marginTop: 4 }}>{d.valor}%</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ display: 'inline-block', width: 20, height: 2, background: '#27ae60' }} />
            Línea verde = media UE-27 (14,9%). El paro juvenil español casi la duplica.
          </div>
        </div>
      </div>

      {/* Paro por CCAA */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Paro por Comunidad Autónoma — 2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % tasa de paro · EPA Q1 2024 · Diferencia de 15 puntos entre la mejor y la peor CCAA
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={CCAA.map(d => ({ label: d.nombre, value: d.tasa, highlight: d.nombre === 'España' }))}
            maxVal={maxCCAA}
            color="#e67e22"
            fmt={v => `${v}%`}
          />
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            Nacer en Navarra o en Ceuta supone una diferencia de <strong>15 puntos</strong> en tu probabilidad de encontrar trabajo. La brecha territorial es estructural y lleva décadas sin cerrarse.
          </div>
        </div>
      </div>

      {/* Comparativa UE */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Comparativa europea — Tasa de paro 2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % población activa · Eurostat, T1 2024
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={EU_PARO.sort((a, b) => b.tasa - a.tasa).map(d => ({ label: d.pais, value: d.tasa, highlight: d.pais === 'España' }))}
            maxVal={maxEU}
            color="var(--muted-strong)"
            fmt={v => `${v}%`}
          />
        </div>
      </div>

      {/* Parados por sector */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Parados por sector económico — Q1 2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de personas · EPA, INE · Total: {totalParados.toLocaleString('es-ES')} miles
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={SECTORES.sort((a, b) => b.parados - a.parados).map(d => ({ label: d.sector, value: d.parados }))}
            maxVal={Math.max(...SECTORES.map(d => d.parados))}
            color="var(--accent)"
            fmt={v => `${v.toLocaleString('es-ES')} k`}
          />
        </div>
      </div>

      {/* Reforma laboral */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Reforma laboral 2022 — Impacto en la temporalidad</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            {
              periodo: 'Antes de la reforma (2021)',
              indefinidos: 8.3,
              temporales: 91.7,
              nota: 'De cada 100 contratos firmados, solo 8 eran indefinidos. España tenía la tasa de temporalidad más alta de la UE.',
              color: '#e74c3c',
            },
            {
              periodo: 'Después de la reforma (2023)',
              indefinidos: 62.4,
              temporales: 37.6,
              nota: 'La reforma laboral de febrero de 2022 invirtió la proporción. Los contratos indefinidos pasaron a ser mayoría.',
              color: '#27ae60',
            },
          ].map(r => (
            <div key={r.periodo} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${r.color}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.periodo}</div>
              <div style={{ display: 'flex', gap: 0, height: 28, borderRadius: 4, overflow: 'hidden', marginBottom: 10 }}>
                <div style={{ width: `${r.indefinidos}%`, background: '#27ae60', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{r.indefinidos}%</span>
                </div>
                <div style={{ width: `${r.temporales}%`, background: '#e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#fff' }}>{r.temporales}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: '#27ae60' }}>● Indefinidos</span>
                <span style={{ fontSize: 11, color: '#e74c3c' }}>● Temporales</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{r.nota}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Contexto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { title: '¿Por qué tanto paro?', text: 'Estructura económica con mucho sector servicios estacional (turismo, hostelería), poca industria, y un sistema educativo con alta tasa de abandono escolar (14%) que deja a muchos jóvenes sin cualificación demandada.', color: 'var(--accent)' },
          { title: 'El paro de larga duración', text: 'El 44% de los parados lleva más de 1 año buscando empleo. Muchos son mayores de 45 años que perdieron su empleo en la crisis y nunca volvieron al mercado laboral formal.', color: '#e67e22' },
          { title: 'Economía sumergida', text: 'Se estima que entre el 18-20% del PIB es economía informal. Parte del desempleo oficial coexiste con trabajo no declarado. España es de los países con mayor economía sumergida de la UE occidental.', color: '#8e44ad' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> INE — Encuesta de Población Activa (EPA), publicación trimestral ·
        Eurostat — Labour Force Survey, T1 2024 ·
        Ministerio de Trabajo y Economía Social — Estadísticas de contratos registrados ·
        SEPE — Estadísticas del paro registrado
      </div>
      </div>{/* cierre del wrapper max-width */}

      {/* ── QUÉ SE DEBERÍA HACER ─────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '52px 0 64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>¿Qué se debería hacer?</div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 32px' }}>
            Cinco reformas para bajar el paro estructural.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { titulo: 'Contrato único con indemnización creciente', detalle: 'El modelo de dos velocidades (indefinido vs. temporal) ha generado décadas de rotación masiva. Un contrato único con indemnización creciente por años cotizados (modelo austriaco) elimina el incentivo a despedir para recontratar temporal.', impacto: 'Reducir la tasa de temporalidad estructural al 12–15% (desde 28%)', color: '#ef4d68' },
              { titulo: 'Reforma del sistema de formación profesional', detalle: 'España tiene una tasa de abandono escolar del 14% y un sistema de FP desconectado de las necesidades del mercado. El modelo alemán de FP dual (empresa + centro formativo) reduce el paro juvenil a menos del 6%.', impacto: 'Paro juvenil del 26% podría bajar al 12–15% en 10 años', color: '#e67e22' },
              { titulo: 'Reducir el coste de la regulación laboral', detalle: 'Las empresas pequeñas evitan crecer por encima de los umbrales de regulación (25, 50 empleados) donde entran en juego comités de empresa, EREs y mayores costes de compliance. Neutralizar estos "escalones" regulatorios incentivaría la creación de empleo.', impacto: '+100.000–200.000 empleos estimados en PYMES', color: '#2563eb' },
              { titulo: 'Invertir en I+D+i para crear empleos de calidad', detalle: 'España gasta el 1,44% del PIB en I+D (media UE: 2,3%). Los países con menor paro estructural tienen economías de mayor valor añadido que crean empleos resistentes a los ciclos. La fuga de cerebros es el síntoma, no la causa.', impacto: 'Alcanzar el 2% del PIB en I+D generaría ~120.000 empleos directos', color: '#059669' },
              { titulo: 'Liberalizar sectores protegidos de la competencia', detalle: 'Taxis, farmacias, notarías, colegios profesionales y muchos servicios regulados tienen barreras de entrada que reducen empleo y suben precios. La CNMC ha identificado restricciones que frenan la creación de decenas de miles de puestos de trabajo.', impacto: '+0,8–1,2 pp de PIB y empleo en servicios liberalizados', color: '#8e44ad' },
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
