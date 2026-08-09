'use client';

import { useState } from 'react';
import ShareButton from '@/components/ui/ShareButton';

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

function Calculadora() {
  const [salario, setSalario] = useState(1800);
  const [meses, setMeses] = useState(18);

  const duracion = Math.min(Math.floor(meses / 3), 24);
  const base = salario * 0.7; // base reguladora aproximada (70% salario bruto ≈ base cotización)

  // Prestación: 70% base 1os 6 meses, 50% resto
  const meses1 = Math.min(duracion, 6);
  const meses2 = Math.max(0, duracion - 6);
  const prestacion1 = base * 0.70;
  const prestacion2 = base * 0.50;

  const MIN = 560;
  const MAX_SIN_HIJOS = 1575;

  const prest1 = Math.min(Math.max(prestacion1, MIN), MAX_SIN_HIJOS);
  const prest2 = Math.min(Math.max(prestacion2, MIN), MAX_SIN_HIJOS);

  const totalBruto = meses1 * prest1 + meses2 * prest2;
  const tasaSust1 = Math.round((prest1 / salario) * 100);

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '28px 24px', marginBottom: 48 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Calcula tu prestación por desempleo</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Basado en el RDL 3/2015 — SEPE · Estimación orientativa</p>
        </div>
        <ShareButton text={`Si me quedara en paro hoy, cobraría ${prest1.toFixed(0)}€/mes durante ${duracion} meses. Con un salario de ${salario}€. Así funciona la prestación por desempleo en España.`} size="sm" />
      </div>

      <div className="calc-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
            Salario bruto mensual: <span style={{ color: 'var(--foreground)' }}>{salario.toLocaleString('es-ES')} €</span>
          </label>
          <input
            type="range" min={800} max={5000} step={50} value={salario}
            onChange={e => setSalario(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
            <span>800 €</span><span>5.000 €</span>
          </div>
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>
            Meses cotizados (últimos 6 años): <span style={{ color: 'var(--foreground)' }}>{meses} meses</span>
          </label>
          <input
            type="range" min={12} max={72} step={1} value={meses}
            onChange={e => setMeses(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
            <span>12 meses</span><span>72 meses</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Prestación 1os 6 meses</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-mono), monospace' }}>{prest1.toFixed(0)} €</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>70% base reguladora</div>
        </div>
        <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>A partir del mes 7</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: meses2 > 0 ? 'var(--accent)' : 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
            {meses2 > 0 ? `${prest2.toFixed(0)} €` : '—'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>50% base reguladora</div>
        </div>
        <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Duración total</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--foreground)', fontFamily: 'var(--font-mono), monospace' }}>{duracion} meses</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{meses} meses cotizados ÷ 3</div>
        </div>
        <div style={{ background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 6, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Tasa de sustitución</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: tasaSust1 >= 50 ? '#059669' : 'var(--accent)', fontFamily: 'var(--font-mono), monospace' }}>{tasaSust1}%</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>del salario bruto</div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: 'color-mix(in srgb, var(--accent) 8%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)', lineHeight: 1.6 }}>
        <strong>Total estimado:</strong> {totalBruto.toLocaleString('es-ES', { maximumFractionDigits: 0 })} € brutos durante {duracion} meses.
        Mínimo legal: {MIN} €/mes. Máximo sin hijos: {MAX_SIN_HIJOS.toLocaleString('es-ES')} €/mes.
        Con hijos: hasta 1.838 €/mes. El SEPE descuenta IRPF y cotización a la Seguridad Social.
      </div>
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

      {/* Calculadora prestación */}
      <Calculadora />

      {/* Evolución paro general */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Evolución del paro 2015–2024</h2>
          <ShareButton text={`España lleva una década con el doble de paro que la media europea. En 2024: ${paroActual}% vs 5,9% de la UE.`} size="sm" />
        </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Paro juvenil ({'<'}25 años) 2015–2024</h2>
          <ShareButton text={`El paro juvenil en España es del ${paroJuvenilActual}%. La media de la UE es 14,9%. Casi el doble.`} size="sm" />
        </div>
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Paro por Comunidad Autónoma — 2024</h2>
          <ShareButton text={`Nacer en Navarra (7,2% paro) o en Ceuta (22,1%) supone 15 puntos de diferencia en tu probabilidad de encontrar trabajo. La brecha territorial es estructural.`} size="sm" />
        </div>
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
    </main>
  );
}
