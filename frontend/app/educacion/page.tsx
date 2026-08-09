'use client';

import ShareButton from '@/components/ui/ShareButton';

const GASTO_EDUCACION = [
  { year: 2015, valor: 43.8, pib: 4.3 },
  { year: 2016, valor: 44.2, pib: 4.2 },
  { year: 2017, valor: 45.8, pib: 4.2 },
  { year: 2018, valor: 47.3, pib: 4.2 },
  { year: 2019, valor: 49.6, pib: 4.4 },
  { year: 2020, valor: 54.1, pib: 5.0 },
  { year: 2021, valor: 53.8, pib: 4.8 },
  { year: 2022, valor: 54.9, pib: 4.6 },
  { year: 2023, valor: 57.2, pib: 4.8 },
];

const ABANDONO_ESCOLAR = [
  { year: 2015, valor: 20.0 },
  { year: 2016, valor: 19.0 },
  { year: 2017, valor: 18.3 },
  { year: 2018, valor: 17.9 },
  { year: 2019, valor: 17.3 },
  { year: 2020, valor: 16.0 },
  { year: 2021, valor: 13.3 },
  { year: 2022, valor: 13.9 },
  { year: 2023, valor: 13.7 },
];

const PISA = [
  { year: 2015, mates: 486, lectura: 496, ciencias: 493 },
  { year: 2018, mates: 481, lectura: 477, ciencias: 483 },
  { year: 2022, mates: 473, lectura: 474, ciencias: 485 },
];

const COMPARATIVA_ABANDONO = [
  { pais: 'España', valor: 13.7 },
  { pais: 'Rumanía', valor: 15.6 },
  { pais: 'Hungría', valor: 12.4 },
  { pais: 'Bulgaria', valor: 11.2 },
  { pais: 'UE-27 media', valor: 9.5 },
  { pais: 'Italia', valor: 10.5 },
  { pais: 'Alemania', valor: 11.8 },
  { pais: 'Francia', valor: 7.8 },
  { pais: 'Portugal', valor: 5.9 },
  { pais: 'Finlandia', valor: 8.3 },
  { pais: 'Países Bajos', valor: 6.9 },
];

const COMPARATIVA_GASTO_PIB = [
  { pais: 'Suecia', pib: 6.7 },
  { pais: 'Noruega', pib: 6.4 },
  { pais: 'Finlandia', pib: 5.9 },
  { pais: 'Dinamarca', pib: 6.3 },
  { pais: 'Francia', pib: 5.5 },
  { pais: 'UE-27 media', pib: 5.1 },
  { pais: 'Alemania', pib: 4.9 },
  { pais: 'España', pib: 4.8 },
  { pais: 'Italia', pib: 4.3 },
  { pais: 'Grecia', pib: 4.4 },
];

const UNIVERSITARIOS = [
  { pais: 'Irlanda', pct: 57.0 },
  { pais: 'Luxemburgo', pct: 55.6 },
  { pais: 'España', pct: 47.7 },
  { pais: 'Países Bajos', pct: 50.7 },
  { pais: 'UE-27 media', pct: 42.0 },
  { pais: 'Francia', pct: 48.0 },
  { pais: 'Alemania', pct: 35.7 },
  { pais: 'Italia', pct: 28.4 },
];

const GASTO_ALUMNO = [
  { nivel: 'Infantil y Primaria', euros: 6420 },
  { nivel: 'Secundaria obligatoria', euros: 7380 },
  { nivel: 'Bachillerato/FP', euros: 7850 },
  { nivel: 'Universidad', euros: 9100 },
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

export default function EducacionPage() {
  const gastoActual = GASTO_EDUCACION[GASTO_EDUCACION.length - 1];
  const abandonoActual = ABANDONO_ESCOLAR[ABANDONO_ESCOLAR.length - 1].valor;
  const pisaUltimo = PISA[PISA.length - 1];
  const pisaPrimero = PISA[0];
  const maxAbandonoEU = Math.max(...COMPARATIVA_ABANDONO.map(d => d.valor));
  const maxGastoPib = Math.max(...COMPARATIVA_GASTO_PIB.map(d => d.pib));
  const maxUniv = Math.max(...UNIVERSITARIOS.map(d => d.pct));
  const maxAlumno = Math.max(...GASTO_ALUMNO.map(d => d.euros));

  return (
    <main>

      {/* ── HERO OSCURO ───────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Ministerio de Educación · OCDE PISA · Eurostat
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            8 leyes educativas en 50 años.<br />
            <span style={{ color: '#ef4d68' }}>Los resultados bajan en cada PISA.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 720, lineHeight: 1.6, margin: '0 0 32px' }}>
            España gasta el <strong style={{ color: '#ef4d68' }}>4,8% del PIB</strong> en educación, por debajo de la media europea.
            El abandono escolar temprano es del <strong style={{ color: '#ef4d68' }}>{abandonoActual}%</strong> — casi el doble de la UE.
            Y los resultados PISA <strong style={{ color: '#ef4d68' }}>bajan en cada edición</strong> desde 2015.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Gasto educación 2023', value: `${gastoActual.valor.toFixed(1)} MM€`, sub: `${gastoActual.pib}% del PIB` },
              { label: 'Abandono escolar', value: `${abandonoActual}%`, sub: 'Media UE: 9,5%' },
              { label: 'PISA Matemáticas', value: `${pisaUltimo.mates} pts`, sub: `−${pisaPrimero.mates - pisaUltimo.mates} desde 2015` },
              { label: 'Universitarios 25–34', value: '47,7%', sub: 'por encima media UE' },
              { label: 'Leyes educativas', value: '8', sub: 'desde 1970 — inestabilidad' },
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
          { label: 'Gasto educación 2023', value: `${gastoActual.valor.toFixed(1)} MM€`, sub: `${gastoActual.pib}% del PIB`, color: 'var(--accent)' },
          { label: 'Abandono escolar', value: `${abandonoActual}%`, sub: 'Media UE: 9,5%', color: '#e74c3c' },
          { label: 'PISA Matemáticas 2022', value: `${pisaUltimo.mates}`, sub: `OCDE: 472 pts`, color: '#e67e22' },
          { label: 'PISA Lectura 2022', value: `${pisaUltimo.lectura}`, sub: `OCDE: 476 pts`, color: '#e67e22' },
          { label: 'Universitarios 25–34', value: '47,7%', sub: 'por encima media UE ✓', color: '#27ae60' },
          { label: 'Gasto/alumno univ.', value: '9.100 €', sub: 'OCDE: 10.200 € media', color: '#e67e22' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Abandono escolar evolución */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Abandono escolar temprano 2015–2023</h2>
          <ShareButton text={`El ${abandonoActual}% de los jóvenes españoles abandona los estudios antes de acabar el bachillerato. La media de la UE es 9,5%. España casi la dobla.`} size="sm" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % de jóvenes de 18–24 años que solo tienen educación obligatoria y no siguen estudiando (Eurostat / INE)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ABANDONO_ESCOLAR.map(d => {
              const pct = Math.round((d.valor / 25) * 100);
              const color = d.valor >= 18 ? '#e74c3c' : d.valor >= 14 ? '#e67e22' : '#f39c12';
              return (
                <div key={d.year} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 36, fontSize: 11, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{d.year}</span>
                  <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 22, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 2 }} />
                    <div style={{ position: 'absolute', left: `${Math.round((9.5 / 25) * 100)}%`, top: 0, bottom: 0, width: 1, background: 'rgba(39,174,96,0.7)' }} />
                  </div>
                  <span style={{ width: 48, fontSize: 12, fontWeight: 700, color, textAlign: 'right', flexShrink: 0 }}>{d.valor}%</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ display: 'inline-block', width: 20, height: 2, background: '#27ae60' }} />
            Línea verde = objetivo UE 2030 (9%). España aún está a 4,2 puntos del objetivo europeo.
          </div>
        </div>
      </div>

      {/* PISA */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Resultados PISA — España 2015–2022</h2>
          <ShareButton text={`Los resultados PISA de España bajan en cada edición desde 2015. Matemáticas: ${pisaPrimero.mates}→${pisaUltimo.mates} pts. 8 leyes educativas y los resultados empeoran.`} size="sm" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Puntuación media en la evaluación triennial de la OCDE a alumnos de 15 años · Media OCDE: ~470 pts
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {(['mates', 'lectura', 'ciencias'] as const).map(area => {
              const labels: Record<string, string> = { mates: 'Matemáticas', lectura: 'Lectura', ciencias: 'Ciencias' };
              const colors: Record<string, string> = { mates: 'var(--accent)', lectura: '#8e44ad', ciencias: '#27ae60' };
              const caida = pisaUltimo[area] - pisaPrimero[area];
              return (
                <div key={area}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors[area], marginBottom: 12, textAlign: 'center' }}>{labels[area]}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {PISA.map(d => (
                      <div key={d.year} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 32, fontSize: 10, color: 'var(--muted)', flexShrink: 0 }}>{d.year}</span>
                        <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 14, overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round(((d[area] - 430) / 80) * 100)}%`, background: colors[area], height: '100%' }} />
                        </div>
                        <span style={{ width: 32, fontSize: 11, fontWeight: 700, color: colors[area], textAlign: 'right', flexShrink: 0 }}>{d[area]}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, textAlign: 'center', color: caida < 0 ? '#e74c3c' : '#27ae60', fontWeight: 700 }}>
                    {caida > 0 ? '+' : ''}{caida} pts desde 2015
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'color-mix(in srgb, #e67e22 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            En 2022 se produjo un <strong>descenso generalizado en toda la OCDE</strong> atribuido al impacto de la pandemia. Sin embargo, la tendencia a la baja en España es anterior: las notas ya caían en 2018 respecto a 2015.
          </div>
        </div>
      </div>

      {/* Abandono comparativa EU */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Abandono escolar — Comparativa europea 2023</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % jóvenes 18–24 con solo educación obligatoria · Eurostat · España en el podio negativo de la UE
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={COMPARATIVA_ABANDONO.sort((a, b) => b.valor - a.valor).map(d => ({ label: d.pais, value: d.valor, highlight: d.pais === 'España' }))}
            maxVal={maxAbandonoEU}
            color="var(--muted-strong)"
            fmt={v => `${v}%`}
            labelWidth={110}
          />
        </div>
      </div>

      {/* Gasto PIB comparativa */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gasto en educación % del PIB — Comparativa UE</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Gasto público en educación como % del PIB · Eurostat 2022 · España por debajo de la media
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={COMPARATIVA_GASTO_PIB.sort((a, b) => b.pib - a.pib).map(d => ({ label: d.pais, value: d.pib, highlight: d.pais === 'España' }))}
            maxVal={maxGastoPib}
            color="var(--muted-strong)"
            fmt={v => `${v}% PIB`}
            labelWidth={110}
          />
        </div>
      </div>

      {/* Universitarios */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Titulados universitarios 25–34 años — Comparativa UE</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % de la población de 25–34 años con educación superior · Eurostat 2023 · España por encima de la media
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={UNIVERSITARIOS.sort((a, b) => b.pct - a.pct).map(d => ({ label: d.pais, value: d.pct, highlight: d.pais === 'España' }))}
            maxVal={maxUniv}
            color="#27ae60"
            fmt={v => `${v}%`}
            labelWidth={110}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
            España tiene muchos titulados universitarios pero con un mercado laboral que no absorbe esa cualificación. El resultado es una <strong>sobrecualificación</strong> crónica: el 36% de los universitarios españoles trabajan en puestos que no requieren ese nivel de estudios.
          </div>
        </div>
      </div>

      {/* Gasto por alumno */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gasto público por alumno en España — 2023</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Euros anuales por alumno · Estadística del Gasto Público en Educación (Ministerio)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={GASTO_ALUMNO.map(d => ({ label: d.nivel, value: d.euros }))}
            maxVal={maxAlumno}
            color="var(--accent)"
            fmt={v => `${v.toLocaleString('es-ES')} €`}
            labelWidth={175}
          />
        </div>
      </div>

      {/* Contexto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { title: 'La paradoja española', text: 'España tiene alta tasa de universitarios (47,7%) pero el abandono escolar más alto de la UE occidental (13,7%). La distribución es muy desigual: o se llega a la universidad o se abandona pronto. La FP intermedia es el eslabón débil.', color: 'var(--accent)' },
          { title: 'FP: la gran asignatura pendiente', text: 'Solo el 22% de los jóvenes españoles estudia Formación Profesional, frente al 46% de la UE. En Alemania y Austria supera el 60%. La FP tiene mala imagen social y falta de plazas en ciclos demandados.', color: '#e67e22' },
          { title: 'Brecha CCAA en PISA', text: 'La diferencia entre la CCAA mejor puntuada (Castilla y León, ~520 pts) y la peor (Canarias, ~450) es equivalente a casi 2 años de escolarización. El sistema tiene 17 modelos distintos con resultados muy dispares.', color: '#8e44ad' },
          { title: 'La ley educativa eterna', text: 'España ha tenido 8 leyes educativas distintas desde 1970 (LGE, LODE, LOGSE, LOPEG, LOCE, LOE, LOMCE, LOMLOE). Ningún gobierno ha resistido la tentación de reformar la educación. La inestabilidad legislativa es parte del problema.', color: '#e74c3c' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> Ministerio de Educación, Formación Profesional y Deportes — Estadística del Gasto Público en Educación ·
        OCDE — PISA 2022 Results ·
        Eurostat — Education and training statistics ·
        INE — Encuesta de Población Activa (módulo de educación)
      </div>
      </div>{/* cierre del wrapper max-width */}
    </main>
  );
}
