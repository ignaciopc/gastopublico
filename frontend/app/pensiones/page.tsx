'use client';

import { useState, useEffect, useMemo } from 'react';

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

// Pirámide de población España 2024 (INE, miles de personas)
const PIRAMIDE = [
  { grupo: '80+',  h: 950,  m: 1380 },
  { grupo: '75-79', h: 960,  m: 1130 },
  { grupo: '70-74', h: 1100, m: 1250 },
  { grupo: '65-69', h: 1230, m: 1350 },
  { grupo: '60-64', h: 1510, m: 1590 },
  { grupo: '55-59', h: 1680, m: 1740 },
  { grupo: '50-54', h: 1870, m: 1910 },
  { grupo: '45-49', h: 1940, m: 1980 },
  { grupo: '40-44', h: 1900, m: 1950 },
  { grupo: '35-39', h: 1700, m: 1750 },
  { grupo: '30-34', h: 1450, m: 1500 },
  { grupo: '25-29', h: 1280, m: 1320 },
  { grupo: '20-24', h: 1150, m: 1180 },
  { grupo: '15-19', h: 1130, m: 1150 },
  { grupo: '10-14', h: 1210, m: 1160 },
  { grupo: '5-9',   h: 1160, m: 1110 },
  { grupo: '0-4',   h: 1010, m: 960  },
];

// ── Fórmula pensión España (simplificada) ────────────────────────────────────
function calcularPension(salarioBruto: number, aniosCotizados: number) {
  const base = salarioBruto * 0.94; // base reguladora aprox.
  let pct = 0;
  if (aniosCotizados >= 15) {
    pct = 0.50;
    const m1 = Math.min((aniosCotizados - 15) * 12, 120);
    pct += m1 * 0.0019;
    const m2 = Math.min(Math.max((aniosCotizados - 25) * 12, 0), 144);
    pct += m2 * 0.0018;
    const m3 = Math.max((aniosCotizados - 37) * 12, 0);
    pct += m3 * 0.002;
    pct = Math.min(pct, 1.0);
  }
  const bruta = base * pct;
  const pension = bruta > 0 ? Math.min(Math.max(Math.round(bruta), 737), 3175) : 0;
  return { pension, pct: Math.round(pct * 100), base: Math.round(base) };
}

function fmtK(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n);
}

// ── Componentes internos ──────────────────────────────────────────────────────

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

function PieRow({ t, idx, last }: { t: { tipo: string; pct: number; color: string }; idx: number; last: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(t.pct), 80 + idx * 60);
    return () => clearTimeout(id);
  }, [t.pct, idx]);
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ fontWeight: 600 }}>{t.tipo}</span>
        <span className="mono" style={{ fontWeight: 600 }}>{t.pct}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
        <div style={{
          height: '100%',
          width: `${w * 3.5}%`,
          maxWidth: '100%',
          background: t.color,
          transition: 'width 1s cubic-bezier(0.2, 0.7, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}

const POR_TIPO_DATA = [
  { tipo: 'Admón. Autonómica', pct: 27.1, color: '#ef4d68' },
  { tipo: 'Administración Local', pct: 18.4, color: '#e67e22' },
  { tipo: 'Empresas privadas', pct: 22.3, color: '#2563eb' },
  { tipo: 'Personas físicas', pct: 14.8, color: '#8e44ad' },
  { tipo: 'Entidades sin ánimo', pct: 9.6, color: '#059669' },
  { tipo: 'Universidades', pct: 7.8, color: '#0891b2' },
];

// ── Calculadora ───────────────────────────────────────────────────────────────
function Calculadora() {
  const [edad, setEdad] = useState(35);
  const [salario, setSalario] = useState(2000);
  const [anios, setAnios] = useState(10);

  const aniosHastaJubilacion = Math.max(0, 67 - edad);
  const aniosTotales = anios + aniosHastaJubilacion;
  const { pension, pct, base } = useMemo(
    () => calcularPension(salario, aniosTotales),
    [salario, aniosTotales]
  );
  const sustitucion = salario > 0 ? Math.round((pension / salario) * 100) : 0;
  const colorSust = sustitucion >= 70 ? '#27ae60' : sustitucion >= 50 ? '#e67e22' : '#e74c3c';
  const cotizacionMensual = Math.round(salario * 0.0635); // cuota trabajador SS

  return (
    <div style={{ border: '1px solid var(--card-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 48 }}>
      <div style={{ padding: '20px 24px', background: 'color-mix(in srgb, var(--accent) 8%, var(--card))', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Calculadora personal</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>¿Cuánto cobrarás de pensión?</h2>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 260, lineHeight: 1.5 }}>
          Estimación según la fórmula actual de la Seguridad Social. No tiene en cuenta inflación ni reformas futuras.
        </div>
      </div>

      <div style={{ padding: '24px', background: 'var(--card)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="calc-grid">
        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Tu edad actual</label>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{edad} años</span>
            </div>
            <input type="range" min={18} max={66} value={edad}
              onChange={e => setEdad(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
              <span>18</span><span>66</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Salario bruto mensual</label>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{salario.toLocaleString('es-ES')} €</span>
            </div>
            <input type="range" min={800} max={6000} step={100} value={salario}
              onChange={e => setSalario(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
              <span>800 €</span><span>6.000 €</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Años cotizados ya</label>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{anios} años</span>
            </div>
            <input type="range" min={0} max={45} value={anios}
              onChange={e => setAnios(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}>
              <span>0</span><span>45</span>
            </div>
          </div>

          <div style={{ padding: '12px 14px', background: 'var(--background)', borderRadius: 6, border: '1px solid var(--rule)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--foreground)' }}>Cuota mensual a la SS:</strong>{' '}
            <span className="mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>{cotizacionMensual.toLocaleString('es-ES')} €/mes</span>
            {' '}(6,35% del bruto).<br />
            Al jubilarte habrás cotizado durante <strong>{aniosTotales} años</strong> en total.
          </div>
        </div>

        {/* Resultado */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: '24px', borderRadius: 6,
            background: pension > 0 ? 'color-mix(in srgb, var(--accent) 6%, var(--background))' : 'color-mix(in srgb, #e74c3c 6%, var(--background))',
            border: `1px solid ${pension > 0 ? 'color-mix(in srgb, var(--accent) 25%, transparent)' : 'color-mix(in srgb, #e74c3c 25%, transparent)'}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
              Tu pensión estimada
            </div>
            <div style={{ fontSize: pension > 0 ? 48 : 32, fontWeight: 900, color: pension > 0 ? 'var(--accent)' : '#e74c3c', lineHeight: 1, letterSpacing: '-0.03em', fontFamily: 'var(--font-mono), monospace' }}>
              {pension > 0 ? `${pension.toLocaleString('es-ES')} €` : 'Sin derecho'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
              {pension > 0 ? 'brutos al mes · 14 pagas/año' : 'Mínimo 15 años cotizados'}
            </div>
          </div>

          {pension > 0 && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: '14px', background: 'var(--background)', border: '1px solid var(--rule)', borderRadius: 6, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Tasa sustitución</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: colorSust, fontFamily: 'var(--font-mono), monospace' }}>{sustitucion}%</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>de tu salario actual</div>
                </div>
                <div style={{ padding: '14px', background: 'var(--background)', border: '1px solid var(--rule)', borderRadius: 6, textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Te jubilas en</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--foreground)', fontFamily: 'var(--font-mono), monospace' }}>{aniosHastaJubilacion}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>años · edad 67</div>
                </div>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: 6, background: sustitucion < 60 ? 'color-mix(in srgb, #e74c3c 8%, var(--background))' : 'color-mix(in srgb, #27ae60 8%, var(--background))', border: `1px solid ${sustitucion < 60 ? 'color-mix(in srgb, #e74c3c 20%, transparent)' : 'color-mix(in srgb, #27ae60 20%, transparent)'}`, fontSize: 12.5, lineHeight: 1.65, color: 'var(--foreground)' }}>
                {sustitucion < 50 && <><strong>⚠ Tasa de sustitución baja.</strong> Con el sistema actual recibirías menos de la mitad de tu salario. La media española es del 72%, pero las proyecciones la sitúan en el 60% para 2050.</>}
                {sustitucion >= 50 && sustitucion < 70 && <><strong>· Tasa moderada.</strong> Recibirías entre el 50% y el 70% de tu salario. La media de la UE es del 58%. Considera complementar con ahorro privado.</>}
                {sustitucion >= 70 && <><strong>✓ Tasa de sustitución buena.</strong> Recibirías más del 70% de tu salario actual. Las proyecciones 2050 hacen este escenario difícil sin reformas que lo garanticen.</>}
              </div>

              <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6 }}>
                Cálculo según RDL 8/2015 (base reguladora = media últimos 25 años, porcentaje por tramos). No incluye complementos a mínimos, revalorización por IPC ni cambios legislativos futuros. Techo 2024: 3.175 €/mes.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pirámide de población ─────────────────────────────────────────────────────
function PiramidePoblacion() {
  const maxVal = Math.max(...PIRAMIDE.flatMap(d => [d.h, d.m]));
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Pirámide de población — España 2024</h2>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
        Miles de personas por grupo de edad y sexo · INE 2024 · La base estrecha y la cima ancha visualizan la inversión demográfica
      </p>
      <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>

        {/* Leyenda */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 16, fontSize: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: '#2563eb', display: 'inline-block' }} />
            Hombres
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: '#ef4d68', display: 'inline-block' }} />
            Mujeres
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(239,77,104,0.25)', display: 'inline-block', border: '1px dashed #ef4d68' }} />
            Jubilados (65+)
          </span>
        </div>

        {PIRAMIDE.map((d, i) => {
          const isJubilado = parseInt(d.grupo) >= 65;
          const hPct = (d.h / maxVal) * 100;
          const mPct = (d.m / maxVal) * 100;
          return (
            <div key={d.grupo} style={{ display: 'grid', gridTemplateColumns: '1fr 52px 1fr', gap: 4, marginBottom: 3, alignItems: 'center' }}>
              {/* Hombres (izquierda, crece hacia la izquierda) */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  height: 16,
                  width: `${hPct}%`,
                  background: isJubilado ? 'rgba(37,99,235,0.5)' : '#2563eb',
                  borderRadius: '4px 0 0 4px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
              {/* Etiqueta central */}
              <div style={{ textAlign: 'center', fontSize: 10, color: isJubilado ? 'var(--accent)' : 'var(--muted)', fontWeight: isJubilado ? 700 : 400, fontFamily: 'var(--font-mono), monospace' }}>
                {d.grupo}
              </div>
              {/* Mujeres (derecha) */}
              <div>
                <div style={{
                  height: 16,
                  width: `${mPct}%`,
                  background: isJubilado ? 'rgba(239,77,104,0.5)' : '#ef4d68',
                  borderRadius: '0 4px 4px 0',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          );
        })}

        {/* Totales */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, paddingTop: 14, borderTop: '1px solid var(--rule)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Menores de 20</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#27ae60', fontFamily: 'var(--font-mono), monospace' }}>9,9 M</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>futuros cotizantes</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>20-64 años</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#2563eb', fontFamily: 'var(--font-mono), monospace' }}>27,5 M</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>edad laboral activa</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>65 o más</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace' }}>9,9 M</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>pensionistas</div>
          </div>
        </div>

        <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, #e74c3c 8%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)', lineHeight: 1.6 }}>
          La pirámide ya no tiene forma de pirámide: la base (jóvenes) es casi igual de ancha que la cima (jubilados).
          En 2050, según el INE, habrá <strong>15,8 M de personas mayores de 65</strong> — casi el doble que ahora.
          España tiene la <strong>segunda esperanza de vida más alta de la UE</strong> (83,3 años) y la <strong>tasa de natalidad más baja</strong> (1,16 hijos/mujer en 2023).
        </div>
      </div>
    </div>
  );
}

// ── Deuda implícita ───────────────────────────────────────────────────────────
function DeudaImplicita() {
  const DEUDA_EXPLICITA_PCT = 108;
  const DEUDA_IMPLICITA_MIN = 290;
  const DEUDA_IMPLICITA_MAX = 380;
  const DEUDA_TOTAL_MED = DEUDA_EXPLICITA_PCT + Math.round((DEUDA_IMPLICITA_MIN + DEUDA_IMPLICITA_MAX) / 2);

  const items = [
    { label: 'Deuda pública explícita', pct: DEUDA_EXPLICITA_PCT, color: '#e67e22', desc: 'Bonos, letras, préstamos. Publicada oficialmente.' },
    { label: 'Pensiones futuras comprometidas', pct: 335, color: '#e74c3c', desc: 'Valor presente de todas las pensiones prometidas a cotizantes actuales (rango estimado: 290-380% PIB).' },
    { label: 'Otras obligaciones implícitas', pct: 45, color: '#8e44ad', desc: 'Sanidad, dependencia, contratos a largo plazo.' },
  ];
  const maxPct = Math.max(...items.map(i => i.pct));

  return (
    <div style={{ marginBottom: 48, border: '1px solid var(--card-border)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', background: 'color-mix(in srgb, #e74c3c 8%, var(--card))', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e74c3c', marginBottom: 4 }}>El número que nadie menciona</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>La deuda implícita de las pensiones: ~{DEUDA_IMPLICITA_MIN}–{DEUDA_IMPLICITA_MAX}% del PIB</h2>
      </div>
      <div style={{ padding: '24px', background: 'var(--card)' }}>
        <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--muted-strong)', margin: '0 0 24px' }}>
          La deuda oficial española (~108% del PIB) es solo la punta del iceberg. Existe una <strong>deuda implícita</strong>:
          el valor presente de todas las pensiones ya prometidas a los cotizantes actuales que el sistema deberá pagar en el futuro.
          El Banco de España y la AIReF la estiman entre <strong style={{ color: '#e74c3c' }}>290% y 380% del PIB</strong>.
          Sumada a la deuda explícita, la deuda total efectiva supera el <strong style={{ color: '#e74c3c' }}>{DEUDA_TOTAL_MED}% del PIB</strong>.
          Ningún candidato político habla de este número.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          {items.map(item => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: item.color }}>{item.pct}% PIB</span>
              </div>
              <div style={{ height: 20, background: 'var(--background)', borderRadius: 3, overflow: 'hidden', border: '1px solid var(--rule)' }}>
                <div style={{ width: `${(item.pct / maxPct) * 100}%`, height: '100%', background: item.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
          {[
            { val: `${DEUDA_TOTAL_MED}% PIB`, lbl: 'Deuda total efectiva', sub: 'explícita + implícita pensiones', color: '#e74c3c' },
            { val: '~1,5 billones €', lbl: 'Deuda implícita en €', sub: 'estimación central Banco de España', color: '#e67e22' },
            { val: '47.000 €', lbl: 'Por cada español', sub: 'solo deuda implícita de pensiones', color: '#8e44ad' },
            { val: 'No figura', lbl: 'En las cuentas públicas', sub: 'no se consolida en el déficit oficial', color: '#6b7280' },
          ].map(k => (
            <div key={k.lbl} style={{ background: 'var(--background)', border: '1px solid var(--rule)', borderRadius: 6, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{k.lbl}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: k.color, fontFamily: 'var(--font-mono), monospace', lineHeight: 1 }}>{k.val}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', background: 'color-mix(in srgb, #e74c3c 6%, var(--background))', borderRadius: 6, fontSize: 12.5, color: 'var(--muted-strong)', lineHeight: 1.7, borderLeft: '3px solid #e74c3c' }}>
          <strong>¿Por qué no aparece en el déficit?</strong> La contabilidad pública del SEC-2010 (norma europea) solo contabiliza
          obligaciones legalmente exigibles hoy. Las pensiones futuras son compromisos políticos, no contratos con fuerza legal inmediata —
          lo que significa que el Gobierno puede modificarlas. Esto es exactamente lo que hace el debate político tan relevante:
          cada reforma de pensiones es, en realidad, una renegociación de esa deuda invisible.
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
          Fuente: Banco de España (2023). «La sostenibilidad de las finanzas públicas a largo plazo» ·
          AIReF (2022). «Evaluación del gasto público: Sistema de pensiones contributivas» ·
          Comisión Europea (2021). «Ageing Report».
        </div>
      </div>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
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

      {/* ── CALCULADORA ────────────────────────────────────────────────── */}
      <Calculadora />

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

      {/* ── PIRÁMIDE DE POBLACIÓN ──────────────────────────────────────── */}
      <PiramidePoblacion />

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
          { title: 'El problema demográfico', text: 'España tiene una de las tasas de natalidad más bajas de Europa (1,16 hijos/mujer en 2023). Sin inversión del declive demográfico o inmigración masiva de trabajadores jóvenes, el ratio cotizantes/pensionistas seguirá deteriorándose.', color: '#e74c3c' },
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

      {/* ── DEUDA IMPLÍCITA ────────────────────────────────────────────── */}
      <DeudaImplicita />

      {/* ── ¿ES UN ESQUEMA PONZI? ─────────────────────────────────────── */}
      <div style={{ marginBottom: 48, border: '1px solid var(--card-border)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', background: 'color-mix(in srgb, #e74c3c 8%, var(--card))', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#e74c3c', marginBottom: 6 }}>Análisis estructural</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>¿Es el sistema de pensiones un esquema Ponzi?</h2>
        </div>
        <div style={{ padding: '24px', background: 'var(--card)' }}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--muted-strong)', margin: '0 0 20px' }}>
            La comparación no es un insulto político: fue el propio Premio Nobel de Economía <strong>Paul Samuelson</strong> quien la hizo en 1967,
            llamando al sistema de reparto un <em>«actuarial Ponzi scheme»</em> en su artículo <em>An Exact Consumption-Loan Model</em>.
            Lo decía en sentido técnico, no peyorativo. Analizamos las similitudes y las diferencias clave.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }} className="ponzi-grid">
            <div style={{ background: 'color-mix(in srgb, #e74c3c 6%, var(--background))', border: '1px solid color-mix(in srgb, #e74c3c 25%, transparent)', borderRadius: 6, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#e74c3c', textTransform: 'uppercase', marginBottom: 12 }}>⚠ Similitudes con un Ponzi</div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.75 }}>
                <li>Los cotizantes actuales pagan a los jubilados actuales — <strong>no hay capitalización</strong> de tus contribuciones.</li>
                <li>El sistema requiere un flujo continuo de nuevos participantes para sostenerse.</li>
                <li>La rentabilidad prometida depende del crecimiento de la masa salarial, no de inversiones reales.</li>
                <li>Con el ratio cayendo de 6,0 a 2,54, necesita aportes externos crecientes — igual que un Ponzi que pierde masa crítica.</li>
                <li>La «hucha» pasó de 67.000 M€ en 2011 a ~4.400 M€ en 2024: se consumió para pagar prestaciones.</li>
              </ul>
            </div>
            <div style={{ background: 'color-mix(in srgb, #27ae60 6%, var(--background))', border: '1px solid color-mix(in srgb, #27ae60 25%, transparent)', borderRadius: 6, padding: '18px 20px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#27ae60', textTransform: 'uppercase', marginBottom: 12 }}>✓ Diferencias clave</div>
              <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.75 }}>
                <li><strong>Es obligatorio</strong> — no es una estafa voluntaria: el Estado exige la cotización.</li>
                <li>El Estado puede <strong>subir impuestos, alargar la edad de jubilación o reducir prestaciones</strong>.</li>
                <li>Tiene un <strong>fin social explícito</strong> (evitar la pobreza en la vejez), no enriquecimiento del operador.</li>
                <li>Con <strong>crecimiento real del PIB</strong>, el sistema de reparto es matemáticamente sostenible (teorema de Samuelson).</li>
              </ul>
            </div>
          </div>

          <div style={{ background: 'color-mix(in srgb, var(--foreground) 5%, var(--background))', border: '1px solid var(--card-border)', borderRadius: 6, padding: '18px 20px', fontSize: 13.5, lineHeight: 1.7, color: 'var(--foreground)' }}>
            <strong>El veredicto honesto:</strong> estructuralmente, sí comparte la mecánica central de un Ponzi — los primeros participantes
            obtuvieron pensiones sin haber cotizado lo suficiente. La diferencia es que el Estado puede cambiar las reglas por ley.
            Lo que no puede hacer es ignorar la aritmética: con 2,54 cotizantes por pensionista,
            subiendo a 16,8% del PIB en 2050, <strong>el sistema necesita reforma estructural</strong> — no porque sea fraudulento,
            sino porque las bases demográficas sobre las que se diseñó en los años 60 ya no existen.
          </div>

          <div style={{ marginTop: 16, fontSize: 11, color: 'var(--muted)', lineHeight: 1.7 }}>
            <strong>Referencia:</strong> Samuelson, P.A. (1958). «An Exact Consumption-Loan Model» · <em>Journal of Political Economy</em>, 66(6) ·
            Feldstein, M. (1996). «The Missing Piece in Policy Analysis» · <em>American Economic Review</em>, 86(2) ·
            AIReF (2023). <em>Evaluación del gasto público: Pensiones contributivas</em>.
          </div>
        </div>
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> Ministerio de Inclusión, Seguridad Social y Migraciones — Estadísticas de Pensiones en vigor ·
        AIReF — Informe sobre las proyecciones de gasto en pensiones 2022–2070 ·
        Eurostat — ESSPROS · Banco de España — Informe Anual · INE — Padrón Municipal y Proyecciones de Población
      </div>
      </div>

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
              { titulo: 'Separar prestaciones contributivas y no contributivas', detalle: 'El sistema contributivo debería financiarse solo con cotizaciones. Las pensiones no contributivas deben financiarse desde Presupuestos Generales vía impuestos. Ahora se mezclan, distorsionando la sostenibilidad.', impacto: 'Transparencia + 10.000 M€ explícitos en PGE', color: '#e67e22' },
              { titulo: 'Incentivo fiscal real al ahorro privado', detalle: 'Los planes de pensiones privados en España suman ~80.000 M€, frente a 1,3 billones en el Reino Unido. Una deducción progresiva real en IRPF descargaría al sistema público.', impacto: 'Reducir dependencia pública en 2–3 pp PIB a largo plazo', color: '#2563eb' },
              { titulo: 'Implantar el Factor de Equidad Intergeneracional', detalle: 'La derogación del Factor de Sostenibilidad en 2021 eliminó el mecanismo que ajustaba automáticamente la cuantía inicial de la pensión a la esperanza de vida. Sin él, cada año de mayor longevidad es más gasto sin ajuste.', impacto: 'Ahorro estructural estimado: 4.000–8.000 M€/año en 2035', color: '#8e44ad' },
              { titulo: 'Incentivar la inmigración laboral cualificada', detalle: 'Con 2,54 cotizantes por pensionista, necesitamos más trabajadores jóvenes. La inmigración regulada y empleada formalmente es el único camino realista a corto plazo mientras la demografía nacional no repunta.', impacto: '+500.000 cotizantes = ~2.500 M€/año más en ingresos SS', color: '#059669' },
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
