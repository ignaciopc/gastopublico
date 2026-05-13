import { formatNumber } from '@/lib/formatters';

// ─── DATA OFICIAL ─────────────────────────────────────────────────────────────
// Fuente: Anuario Estadístico del Ministerio del Interior + Balance de Criminalidad
// https://www.interior.gob.es/opencms/es/estadistica/anuarios/

const INFRACCIONES = [
  { year: 2014, n: 1_943_657 },
  { year: 2015, n: 2_036_741 },
  { year: 2016, n: 2_044_862 },
  { year: 2017, n: 2_068_688 },
  { year: 2018, n: 2_105_654 },
  { year: 2019, n: 2_204_793 },
  { year: 2020, n: 1_741_832, covid: true },
  { year: 2021, n: 2_010_380 },
  { year: 2022, n: 2_268_779 },
  { year: 2023, n: 2_347_419 },
];

const CIBERDELITOS = [
  { year: 2018, n: 110_613 },
  { year: 2019, n: 218_584 },
  { year: 2020, n: 287_963 },
  { year: 2021, n: 305_477 },
  { year: 2022, n: 374_737 },
  { year: 2023, n: 472_503 },
];

const DELITOS_SEXUALES = [
  { year: 2015, n: 10_649 },
  { year: 2016, n: 11_538 },
  { year: 2017, n: 12_637 },
  { year: 2018, n: 14_901 },
  { year: 2019, n: 16_249 },
  { year: 2020, n: 14_011, covid: true },
  { year: 2021, n: 18_529 },
  { year: 2022, n: 21_453 },
  { year: 2023, n: 22_174 },
];

const ROBOS_VIOLENCIA = [
  { year: 2015, n: 78_451 },
  { year: 2016, n: 76_822 },
  { year: 2017, n: 76_048 },
  { year: 2018, n: 75_296 },
  { year: 2019, n: 76_849 },
  { year: 2020, n: 52_428, covid: true },
  { year: 2021, n: 65_180 },
  { year: 2022, n: 72_598 },
  { year: 2023, n: 76_234 },
];

const HOMICIDIOS = [
  { year: 2015, n: 336 },
  { year: 2016, n: 315 },
  { year: 2017, n: 308 },
  { year: 2018, n: 339 },
  { year: 2019, n: 349 },
  { year: 2020, n: 286, covid: true },
  { year: 2021, n: 345 },
  { year: 2022, n: 332 },
  { year: 2023, n: 371 },
];

const HURTOS = [
  { year: 2015, n: 603_823 },
  { year: 2016, n: 618_545 },
  { year: 2017, n: 631_827 },
  { year: 2018, n: 660_340 },
  { year: 2019, n: 694_180 },
  { year: 2020, n: 484_372, covid: true },
  { year: 2021, n: 596_845 },
  { year: 2022, n: 693_521 },
  { year: 2023, n: 723_804 },
];

const PLANTILLA = [
  { year: '2015', pn: 66_800, gc: 80_100 },
  { year: '2017', pn: 67_200, gc: 79_700 },
  { year: '2019', pn: 67_900, gc: 80_200 },
  { year: '2021', pn: 67_200, gc: 79_400 },
  { year: '2023', pn: 67_100, gc: 79_300 },
];

const COMPARATIVA_EU = [
  { pais: '🇩🇪 Alemania', tasa: 6563, pob: 84 },
  { pais: '🇧🇪 Bélgica', tasa: 5821, pob: 11.6 },
  { pais: '🇫🇷 Francia', tasa: 5491, pob: 68 },
  { pais: '🇬🇧 Reino Unido', tasa: 5023, pob: 68 },
  { pais: '🇪🇸 España', tasa: 4982, pob: 47.4, highlight: true },
  { pais: '🇵🇹 Portugal', tasa: 3831, pob: 10.3 },
  { pais: '🇮🇹 Italia', tasa: 3751, pob: 59 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function MiniChart({
  data, color = 'var(--accent)', height = 100, showCovid = true,
}: {
  data: { year: number; n: number; covid?: boolean }[];
  color?: string;
  height?: number;
  showCovid?: boolean;
}) {
  const max = Math.max(...data.map(d => d.n));
  return (
    <div>
      <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height, borderBottom: '1px solid var(--rule)', paddingBottom: 6 }}>
        {data.map(d => {
          const h = Math.max(6, Math.round((d.n / max) * (height - 24)));
          return (
            <div key={d.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <div style={{ fontSize: 8.5, color: d.covid ? 'var(--muted)' : color === '#ef4d68' ? 'var(--bad)' : 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
                {d.n >= 100_000
                  ? `${(d.n / 1000).toFixed(0)}k`
                  : d.n >= 1000
                    ? `${(d.n / 1000).toFixed(1)}k`
                    : d.n}
              </div>
              <div style={{
                width: '100%', height: h,
                background: d.covid ? 'var(--card-border)' : color,
                borderRadius: '2px 2px 0 0',
                opacity: d.covid ? 0.5 : 1,
              }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
        {data.map(d => (
          <div key={d.year} style={{ flex: 1, textAlign: 'center', fontSize: 8.5, color: d.covid ? 'var(--muted)' : 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
            {String(d.year).slice(2)}
          </div>
        ))}
      </div>
    </div>
  );
}

function delta(arr: { n: number }[], fromIdx = 0) {
  const first = arr[fromIdx].n;
  const last = arr[arr.length - 1].n;
  return (((last - first) / first) * 100).toFixed(1);
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SeguridadPage() {
  const maxComparativa = Math.max(...COMPARATIVA_EU.map(c => c.tasa));

  return (
    <div>

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ color: '#ef4d68', marginBottom: 10 }}>MINISTERIO DEL INTERIOR · ANUARIO ESTADÍSTICO</div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            Seguridad en España.<br />
            <span style={{ color: '#ef4d68' }}>Los datos reales.</span>
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', maxWidth: 680, margin: '0 0 36px' }}>
            Las infracciones penales alcanzaron en 2023 su <strong style={{ color: '#ededeb' }}>máximo histórico</strong> con 2,35 millones.
            Los ciberdelitos se han multiplicado por 4,3 desde 2018. Los delitos sexuales conocidos han crecido un 108%
            desde 2015. La plantilla policial lleva una década sin crecer.
          </p>

          {/* KPI strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Infracciones penales 2023', value: '2.347.419', sub: 'Máximo histórico · +15,3% vs 2015', bad: true },
              { label: 'Ciberdelitos 2023', value: '472.503', sub: '+328% desde 2018', bad: true },
              { label: 'Delitos sexuales 2023', value: '22.174', sub: '+108% desde 2015', bad: true },
              { label: 'Tasa criminalidad 2023', value: '49,8‰', sub: 'Por 1.000 hab · media EU: ~52‰', bad: false },
              { label: 'Efectivos policiales', value: '~146.400', sub: 'Policía Nacional + Guardia Civil', bad: false },
            ].map((k, i, arr) => (
              <div key={k.label} style={{ padding: '20px 20px 16px', background: 'rgba(255,255,255,0.03)', borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 0 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 8 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', color: k.bad ? '#ef4d68' : '#4ade80', lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 6 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 1. INFRACCIONES TOTALES ───────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Balance de Criminalidad · Ministerio del Interior</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                Infracciones penales: máximo histórico en 2023
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: 0, maxWidth: 680 }}>
                2,35 millones de delitos y faltas conocidos por las Fuerzas y Cuerpos de Seguridad en 2023.
                El dato excluye el año del confinamiento (2020) que distorsiona la serie.
              </p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Variación 2014–2023</div>
              <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>+{delta(INFRACCIONES)}%</div>
            </div>
          </div>
          <MiniChart data={INFRACCIONES} color="#ef4d68" height={140} />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
            Las barras grises corresponden a 2020 (confinamiento COVID). Fuente: Anuario Estadístico del Ministerio del Interior.
          </p>
        </div>
      </section>

      {/* ── 2. CATEGORÍAS DE DELITOS ─────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Desglose por categoría · 2015–2023</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            No todos los delitos evolucionan igual
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 32px', maxWidth: 700 }}>
            Los robos con violencia se han estabilizado. Los hurtos crecen con el turismo y la crisis de vivienda.
            Los delitos sexuales y los ciberdelitos son los que más alarman por su ritmo de crecimiento.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

            {/* Ciberdelitos */}
            <div style={{ padding: '22px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--background)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Ciberdelitos</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{formatNumber(CIBERDELITOS.at(-1)!.n)}</div>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(239,77,104,0.12)', border: '1px solid rgba(239,77,104,0.3)', borderRadius: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace' }}>+{delta(CIBERDELITOS)}%</span>
                </div>
              </div>
              <MiniChart data={CIBERDELITOS} color="#ef4d68" height={80} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                El delito de mayor crecimiento en España. Estafas online, phishing y suplantación de identidad representan el 75% de los casos.
              </p>
            </div>

            {/* Delitos sexuales */}
            <div style={{ padding: '22px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--background)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Delitos contra la libertad sexual</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{formatNumber(DELITOS_SEXUALES.at(-1)!.n)}</div>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(239,77,104,0.12)', border: '1px solid rgba(239,77,104,0.3)', borderRadius: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace' }}>+{delta(DELITOS_SEXUALES)}%</span>
                </div>
              </div>
              <MiniChart data={DELITOS_SEXUALES} color="#8a1428" height={80} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                Parte del aumento refleja mayor denuncia tras reformas legales (Ley del «sólo sí es sí»).
                Los expertos señalan que ambos factores —mayor incidencia y mayor denuncia— contribuyen.
              </p>
            </div>

            {/* Robos con violencia */}
            <div style={{ padding: '22px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--background)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Robos con violencia</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{formatNumber(ROBOS_VIOLENCIA.at(-1)!.n)}</div>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(100,100,100,0.1)', border: '1px solid var(--card-border)', borderRadius: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-strong)', fontFamily: 'var(--font-mono), monospace' }}>{delta(ROBOS_VIOLENCIA, 0)}%</span>
                </div>
              </div>
              <MiniChart data={ROBOS_VIOLENCIA} color="var(--accent)" height={80} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                Recuperado a niveles pre-COVID tras caer en 2020. La evolución es prácticamente plana
                a largo plazo, lo que indica estabilidad en este tipo de delito.
              </p>
            </div>

            {/* Hurtos */}
            <div style={{ padding: '22px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--background)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Hurtos</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{formatNumber(HURTOS.at(-1)!.n)}</div>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(239,77,104,0.12)', border: '1px solid rgba(239,77,104,0.3)', borderRadius: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace' }}>+{delta(HURTOS)}%</span>
                </div>
              </div>
              <MiniChart data={HURTOS} color="#6b6b30" height={80} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                El delito más frecuente en España. Crece con el turismo (zonas costeras y capitales)
                y con la inflación. Concentrado en Madrid, Barcelona y Málaga.
              </p>
            </div>

            {/* Homicidios */}
            <div style={{ padding: '22px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--background)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Homicidios dolosos y asesinatos</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{formatNumber(HOMICIDIOS.at(-1)!.n)}</div>
                </div>
                <div style={{ padding: '4px 8px', background: 'rgba(100,100,100,0.1)', border: '1px solid var(--card-border)', borderRadius: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-strong)', fontFamily: 'var(--font-mono), monospace' }}>~estable</span>
                </div>
              </div>
              <MiniChart data={HOMICIDIOS} color="#3a5a3a" height={80} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                España tiene una de las tasas de homicidio más bajas de Europa (0,8 por 100.000 hab.)
                Los datos son relativamente estables en la última década.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. PLANTILLA POLICIAL ─────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 56, alignItems: 'start' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Boletín Estadístico del Personal · Ministerio del Interior</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                Plantilla policial: plana desde 2015 mientras el crimen sube
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', lineHeight: 1.65, margin: '0 0 20px' }}>
                Los efectivos de Policía Nacional y Guardia Civil suman aproximadamente{' '}
                <strong>146.400 agentes</strong>, prácticamente los mismos que en 2015.
                En el mismo período, las infracciones penales crecieron un{' '}
                <strong style={{ color: 'var(--bad)' }}>+15,3%</strong>.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { org: 'Policía Nacional', n: '67.100', pct: 46 },
                  { org: 'Guardia Civil', n: '79.300', pct: 54 },
                  { org: 'Total (sin policías locales)', n: '146.400', pct: 100 },
                ].map(r => (
                  <div key={r.org}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13, color: 'var(--muted-strong)' }}>{r.org}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono), monospace' }}>{r.n}</span>
                    </div>
                    <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 6 }}>
                      <div style={{ width: `${r.pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: '14px 16px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Plazas vacantes estimadas (2024)</div>
                <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)' }}>~12.000</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Según sindicatos policiales (JUPOL, SPP, AUGC)</div>
              </div>
            </div>
            <div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, padding: '20px', background: 'var(--card)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Evolución plantilla (miles de efectivos)</div>
                {PLANTILLA.map(p => {
                  const total = p.pn + p.gc;
                  const pct = Math.round((total / 150_000) * 100);
                  return (
                    <div key={p.year} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, color: 'var(--muted-strong)' }}>{p.year}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono), monospace' }}>{(total / 1000).toFixed(1)}k</span>
                      </div>
                      <div style={{ display: 'flex', height: 10, borderRadius: 3, overflow: 'hidden', background: 'var(--card-border)' }}>
                        <div style={{ width: `${Math.round((p.pn / total) * pct)}%`, background: 'var(--accent)', opacity: 0.8 }} />
                        <div style={{ width: `${Math.round((p.gc / total) * pct)}%`, background: '#6b6b30', opacity: 0.8 }} />
                      </div>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}><span style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: 2, display: 'inline-block' }} /> Policía Nacional</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)' }}><span style={{ width: 10, height: 10, background: '#6b6b30', borderRadius: 2, display: 'inline-block' }} /> Guardia Civil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CIBERDELITOS DETALLE ───────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Balance de Criminalidad · Ciberdelincuencia · Ministerio del Interior</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            Ciberdelitos: de 110.613 a 472.503 en 5 años
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 28px', maxWidth: 720, lineHeight: 1.6 }}>
            El cibercrimen es ya el <strong>segundo tipo de delito más frecuente</strong> en España, solo por detrás de los hurtos.
            España tiene la tercera tasa de ciberdelitos más alta de la UE y el porcentaje de esclarecimiento
            no supera el 15%.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 40, alignItems: 'center' }}>
            <MiniChart data={CIBERDELITOS} color="#ef4d68" height={160} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { tipo: 'Fraudes y estafas online', pct: 75, color: '#ef4d68' },
                { tipo: 'Amenazas y coacciones', pct: 11, color: '#8a1428' },
                { tipo: 'Accesos ilegítimos', pct: 6, color: '#6b2222' },
                { tipo: 'Pornografía infantil', pct: 4, color: '#4a1a1a' },
                { tipo: 'Otros', pct: 4, color: 'var(--card-border)' },
              ].map(t => (
                <div key={t.tipo}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12.5, color: 'var(--muted-strong)' }}>{t.tipo}</span>
                    <span style={{ fontSize: 12, fontFamily: 'var(--font-mono), monospace', color: 'var(--muted)' }}>{t.pct}%</span>
                  </div>
                  <div style={{ background: 'var(--background)', borderRadius: 2, height: 6 }}>
                    <div style={{ width: `${t.pct}%`, height: '100%', background: t.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Distribución estimada según tipología INCIBE 2023</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. COMPARATIVA EUROPEA ────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat Crime Statistics · 2022 (último disponible)</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.02em' }}>
            España en Europa: por debajo de la media en crimen general
          </h2>
          <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: '0 0 28px', maxWidth: 720, lineHeight: 1.6 }}>
            En términos absolutos, España tiene <strong>menos delitos per cápita que Alemania, Francia y el Reino Unido</strong>.
            El problema no es el nivel absoluto sino la tendencia alcista en cibercrimen, delitos sexuales
            y la falta de inversión en modernización policial.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {COMPARATIVA_EU.map(c => {
              const pct = Math.round((c.tasa / maxComparativa) * 100);
              return (
                <div key={c.pais} style={{
                  display: 'grid', gridTemplateColumns: '200px 1fr 120px',
                  gap: 16, alignItems: 'center',
                  padding: c.highlight ? '10px 12px' : '0',
                  background: c.highlight ? 'var(--card)' : 'transparent',
                  border: c.highlight ? '1px solid var(--card-border)' : 'none',
                  borderRadius: c.highlight ? 4 : 0,
                }}>
                  <span style={{ fontSize: 13.5, fontWeight: c.highlight ? 700 : 400 }}>{c.pais}</span>
                  <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 10, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: c.highlight ? 'var(--accent)' : 'var(--muted)', borderRadius: 2, opacity: c.highlight ? 1 : 0.5 }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', textAlign: 'right', color: c.highlight ? 'var(--good)' : 'inherit' }}>
                    {c.tasa.toLocaleString('es-ES')} <span style={{ fontSize: 10, fontWeight: 400, color: 'var(--muted)' }}>por 100k hab.</span>
                  </span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16, lineHeight: 1.5 }}>
            Fuente: Eurostat, Statistics on crime — police data (tasa por 100.000 habitantes). Los criterios de registro varían entre países.
            España registra menos delitos que sus vecinos principalmente porque incluye menos infracciones menores en el cómputo oficial.
          </p>
        </div>
      </section>

      {/* ── 6. CONTEXTO Y METODOLOGÍA ────────────────────────────────── */}
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 16 }}>Notas metodológicas</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              {
                title: '¿Qué son las infracciones penales?',
                body: 'Las infracciones penales son los hechos delictivos conocidos por Policía Nacional y Guardia Civil. No incluyen los conocidos por policías locales ni los no denunciados. Se estima que la cifra negra (no denunciados) es 4–5 veces la oficial.',
              },
              {
                title: 'El efecto COVID en 2020',
                body: 'El confinamiento redujo drásticamente los delitos callejeros y de movilidad en 2020. Los datos de ese año no son comparables con el resto de la serie. Por eso aparecen en gris en los gráficos.',
              },
              {
                title: 'Ciberdelitos y cifra negra',
                body: 'Los expertos estiman que solo 1 de cada 10 ciberdelitos se denuncia. La cifra oficial (472.503 en 2023) podría representar menos del 10% del total real. La escasa tasa de esclarecimiento (~15%) desincentiva la denuncia.',
              },
              {
                title: 'Comparativa internacional',
                body: 'Los sistemas de registro de delitos difieren entre países. España tiene criterios más estrictos que Alemania o Francia, lo que hace que las comparativas directas sean orientativas. Eurostat intenta normalizar los datos pero las diferencias persisten.',
              },
            ].map(n => (
              <div key={n.title} style={{ padding: '18px 20px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 8 }}>{n.title}</div>
                <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.6 }}>{n.body}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 20, lineHeight: 1.6 }}>
            Fuentes: Anuario Estadístico del Ministerio del Interior (ediciones 2015–2023), Balance de Criminalidad (publicación trimestral),
            Eurostat Crime Statistics, INCIBE Informe Ciberamenazas 2023, sindicatos policiales JUPOL / SPP / AUGC.
          </p>
        </div>
      </section>

    </div>
  );
}
