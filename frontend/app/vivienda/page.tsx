'use client';

import { useState, useMemo } from 'react';
import ShareButton from '@/components/ui/ShareButton';

const PRECIO_COMPRA = [
  { year: 2015, valor: 1494 }, { year: 2016, valor: 1504 }, { year: 2017, valor: 1570 },
  { year: 2018, valor: 1637 }, { year: 2019, valor: 1678 }, { year: 2020, valor: 1640 },
  { year: 2021, valor: 1699 }, { year: 2022, valor: 1780 }, { year: 2023, valor: 1879 },
  { year: 2024, valor: 2050 },
];
const PRECIO_ALQUILER = [
  { year: 2015, valor: 7.5 }, { year: 2016, valor: 8.0 }, { year: 2017, valor: 8.9 },
  { year: 2018, valor: 10.0 }, { year: 2019, valor: 10.8 }, { year: 2020, valor: 10.5 },
  { year: 2021, valor: 10.2 }, { year: 2022, valor: 10.8 }, { year: 2023, valor: 11.5 },
  { year: 2024, valor: 13.1 },
];
const ESFUERZO = [
  { year: 2015, valor: 6.5 }, { year: 2016, valor: 6.5 }, { year: 2017, valor: 6.7 },
  { year: 2018, valor: 7.0 }, { year: 2019, valor: 7.2 }, { year: 2020, valor: 7.1 },
  { year: 2021, valor: 7.3 }, { year: 2022, valor: 7.6 }, { year: 2023, valor: 7.9 },
  { year: 2024, valor: 8.4 },
];
const DESAHUCIOS = [
  { year: 2015, valor: 67189 }, { year: 2016, valor: 59671 }, { year: 2017, valor: 60754 },
  { year: 2018, valor: 57853 }, { year: 2019, valor: 54005 }, { year: 2020, valor: 22642 },
  { year: 2021, valor: 34270 }, { year: 2022, valor: 46942 }, { year: 2023, valor: 49068 },
];
const CIUDADES = [
  { ciudad: 'Madrid',       alquiler: 20.5, compra: 4280 },
  { ciudad: 'Barcelona',    alquiler: 19.8, compra: 4150 },
  { ciudad: 'San Sebastián',alquiler: 17.2, compra: 4620 },
  { ciudad: 'Bilbao',       alquiler: 14.8, compra: 3150 },
  { ciudad: 'Valencia',     alquiler: 14.2, compra: 2450 },
  { ciudad: 'Málaga',       alquiler: 14.0, compra: 2890 },
  { ciudad: 'Sevilla',      alquiler: 11.8, compra: 2200 },
  { ciudad: 'Zaragoza',     alquiler:  9.5, compra: 1820 },
  { ciudad: 'Murcia',       alquiler:  8.0, compra: 1450 },
];
const VPO = [
  { year: 2008, valor: 105400 }, { year: 2010, valor: 61900 }, { year: 2012, valor: 23600 },
  { year: 2015, valor: 8300 },   { year: 2017, valor: 7900 },  { year: 2019, valor: 12900 },
  { year: 2021, valor: 10400 },  { year: 2023, valor: 10200 },
];

function BarChart({ data, maxVal, color = 'var(--accent)', fmt }: {
  data: { label: string; value: number }[];
  maxVal: number; color?: string; fmt: (v: number) => string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 36, fontSize: 11, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 18, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((value / maxVal) * 100)}%`, background: color, height: '100%', borderRadius: 2 }} />
          </div>
          <span style={{ width: 80, fontSize: 11, color: 'var(--muted-strong)', textAlign: 'right', flexShrink: 0 }}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}

function Calculadora() {
  const [salario, setSalario] = useState(1900);
  const [ciudadIdx, setCiudadIdx] = useState(0);
  const [metros, setMetros] = useState(70);

  const ciudad = CIUDADES[ciudadIdx];
  const result = useMemo(() => {
    const alqMensual = Math.round(ciudad.alquiler * metros);
    const pctSalario = Math.round((alqMensual / salario) * 100);
    const precioCompra = ciudad.compra * 90;
    const entrada = precioCompra * 0.20;
    const ahorroMensual = salario * 0.20;
    const mesesEntrada = entrada / ahorroMensual;
    const anosEntrada = mesesEntrada / 12;
    return { alqMensual, pctSalario, precioCompra, entrada, anosEntrada: Math.round(anosEntrada) };
  }, [salario, ciudadIdx, metros, ciudad]);

  const colorPct = result.pctSalario > 50 ? '#e74c3c' : result.pctSalario > 30 ? '#e67e22' : '#27ae60';
  const shareText = `Gano ${salario.toLocaleString('es-ES')} €/mes y el alquiler de ${metros}m² en ${ciudad.ciudad} me costaría ${result.alqMensual.toLocaleString('es-ES')} € — el ${result.pctSalario}% de mi sueldo. El Banco de España recomienda no pasar del 30%. #ViviendaEspaña #GastoPúblico`;

  return (
    <div style={{ border: '1px solid var(--card-border)', borderRadius: 8, overflow: 'hidden', marginBottom: 48 }}>
      <div style={{ padding: '20px 24px', background: 'color-mix(in srgb, var(--accent) 8%, var(--card))', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 4 }}>Calculadora personal</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>¿Cuánto te come la vivienda?</h2>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', maxWidth: 240, lineHeight: 1.5 }}>Basado en precios Idealista 2024. 20% de entrada para compra.</div>
      </div>
      <div style={{ padding: '24px', background: 'var(--card)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }} className="calc-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Salario neto mensual</label>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{salario.toLocaleString('es-ES')} €</span>
            </div>
            <input type="range" min={800} max={5000} step={100} value={salario} onChange={e => setSalario(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}><span>800 €</span><span>5.000 €</span></div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Ciudad</label>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>{ciudad.ciudad}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CIUDADES.map((c, i) => (
                <button key={c.ciudad} onClick={() => setCiudadIdx(i)} style={{
                  padding: '5px 10px', fontSize: 11, fontWeight: 600, borderRadius: 3, cursor: 'pointer',
                  border: `1px solid ${ciudadIdx === i ? 'var(--accent)' : 'var(--card-border)'}`,
                  background: ciudadIdx === i ? 'var(--accent)' : 'transparent',
                  color: ciudadIdx === i ? '#fff' : 'var(--foreground)',
                }}>{c.ciudad}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 600 }}>Metros cuadrados</label>
              <span className="mono" style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>{metros} m²</span>
            </div>
            <input type="range" min={40} max={120} step={5} value={metros} onChange={e => setMetros(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--accent)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--muted)', marginTop: 3 }}><span>40 m²</span><span>120 m²</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ padding: '20px', borderRadius: 6, background: `color-mix(in srgb, ${colorPct} 6%, var(--background))`, border: `1px solid color-mix(in srgb, ${colorPct} 25%, transparent)`, textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6 }}>Alquiler mensual estimado</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: colorPct, lineHeight: 1, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em' }}>{result.alqMensual.toLocaleString('es-ES')} €</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{metros} m² en {ciudad.ciudad}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: '14px', background: 'var(--background)', border: '1px solid var(--rule)', borderRadius: 6, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>% del salario</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: colorPct, fontFamily: 'var(--font-mono), monospace' }}>{result.pctSalario}%</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>máx. recomendado: 30%</div>
            </div>
            <div style={{ padding: '14px', background: 'var(--background)', border: '1px solid var(--rule)', borderRadius: 6, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Años para la entrada</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: result.anosEntrada > 10 ? '#e74c3c' : '#e67e22', fontFamily: 'var(--font-mono), monospace' }}>{result.anosEntrada}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>ahorrando 20% del sueldo</div>
            </div>
          </div>
          <div style={{ padding: '12px 14px', borderRadius: 6, background: result.pctSalario > 50 ? 'color-mix(in srgb, #e74c3c 8%, var(--background))' : result.pctSalario > 30 ? 'color-mix(in srgb, #e67e22 8%, var(--background))' : 'color-mix(in srgb, #27ae60 8%, var(--background))', border: `1px solid ${result.pctSalario > 50 ? 'color-mix(in srgb, #e74c3c 20%, transparent)' : result.pctSalario > 30 ? 'color-mix(in srgb, #e67e22 20%, transparent)' : 'color-mix(in srgb, #27ae60 20%, transparent)'}`, fontSize: 12.5, lineHeight: 1.65 }}>
            {result.pctSalario > 50 && <><strong>🔴 Situación insostenible.</strong> Más de la mitad del sueldo en alquiler. Por encima del umbral de pobreza energética y sin margen para ahorro, alimentación o imprevistos.</>}
            {result.pctSalario > 30 && result.pctSalario <= 50 && <><strong>🟠 Por encima del límite recomendado.</strong> El Banco de España y la UE recomiendan no superar el 30% del salario en vivienda. Estás al {result.pctSalario}%, lo que deja poco margen de ahorro.</>}
            {result.pctSalario <= 30 && <><strong>🟢 Dentro del umbral recomendado.</strong> Dedicar el {result.pctSalario}% del salario al alquiler es sostenible según los criterios del Banco de España (&lt;30%).</>}
          </div>
          <ShareButton text={shareText} />
        </div>
      </div>
    </div>
  );
}

export default function ViviendaPage() {
  const alquilerBase = PRECIO_ALQUILER[0].valor;
  const alquilerActual = PRECIO_ALQUILER[PRECIO_ALQUILER.length - 1].valor;
  const alquilerSubida = Math.round(((alquilerActual - alquilerBase) / alquilerBase) * 100);
  const compraBase = PRECIO_COMPRA[0].valor;
  const compraActual = PRECIO_COMPRA[PRECIO_COMPRA.length - 1].valor;
  const compraSubida = Math.round(((compraActual - compraBase) / compraBase) * 100);
  const esfuerzoActual = ESFUERZO[ESFUERZO.length - 1].valor;
  const desahuciosActual = DESAHUCIOS[DESAHUCIOS.length - 1].valor;
  const maxAlquiler = Math.max(...PRECIO_ALQUILER.map(d => d.valor));
  const maxCompra = Math.max(...PRECIO_COMPRA.map(d => d.valor));
  const maxDesahucios = Math.max(...DESAHUCIOS.map(d => d.valor));
  const maxCiudadAlq = Math.max(...CIUDADES.map(d => d.alquiler));

  return (
    <main>
      {/* HERO OSCURO */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Ministerio de Transportes · INE · Banco de España
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            El alquiler sube {alquilerSubida}% en 9 años.<br />
            <span style={{ color: '#ef4d68' }}>El salario, solo un 18%.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 720, lineHeight: 1.6, margin: '0 0 32px' }}>
            Comprar un piso de 90 m² exige <strong style={{ color: '#ef4d68' }}>{esfuerzoActual} años de salario íntegro</strong>.
            Cada día se ejecutan <strong style={{ color: '#ef4d68' }}>134 desahucios</strong>.
            La VPO iniciada en 2023 es un <strong style={{ color: '#ef4d68' }}>90% menor que en 2008</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Alquiler medio 2024', value: `${alquilerActual} €/m²/mes`, sub: `+${alquilerSubida}% desde 2015` },
              { label: 'Compra media 2024',   value: `${compraActual.toLocaleString('es-ES')} €/m²`, sub: `+${compraSubida}% desde 2015` },
              { label: 'Esfuerzo salarial',   value: `${esfuerzoActual} años`, sub: 'para comprar 90 m²' },
              { label: 'Desahucios 2023',     value: desahuciosActual.toLocaleString('es-ES'), sub: '134 al día' },
              { label: 'VPO iniciadas 2023',  value: '10.200', sub: 'vs 105.400 en 2008 (−90%)' },
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
            { label: 'Alquiler medio', value: `${alquilerActual} €/m²/mes`, sub: `+${alquilerSubida}% desde 2015`, color: 'var(--accent)' },
            { label: 'Compra media', value: `${compraActual.toLocaleString('es-ES')} €/m²`, sub: `+${compraSubida}% desde 2015`, color: 'var(--accent)' },
            { label: 'Esfuerzo salarial', value: `${esfuerzoActual} años`, sub: 'para comprar 90 m²', color: '#e67e22' },
            { label: 'Desahucios 2023', value: desahuciosActual.toLocaleString('es-ES'), sub: '134 al día', color: '#e74c3c' },
            { label: 'VPO iniciadas 2023', value: '10.200', sub: 'vs 105.400 en 2008', color: '#8e44ad' },
          ].map(k => (
            <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* CALCULADORA */}
        <Calculadora />

        {/* Alquiler evolución */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Precio del alquiler 2015–2024</h2>
            <ShareButton text={`El alquiler en España ha subido un ${alquilerSubida}% desde 2015, cuatro veces más rápido que los salarios (+18%). En 2024 la media nacional es ${alquilerActual} €/m²/mes. #ViviendaEspaña`} size="sm" />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>€/m²/mes · Índice nacional (Fotocasa/Ministerio de Vivienda)</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
            <BarChart data={PRECIO_ALQUILER.map(d => ({ label: String(d.year), value: d.valor }))} maxVal={maxAlquiler} color="var(--accent)" fmt={v => `${v} €`} />
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
              ⚠ El salario medio en España creció un <strong>~18%</strong> en el mismo período. El alquiler subió <strong>4,5 veces más rápido</strong> que los salarios.
            </div>
          </div>
        </div>

        {/* Compra */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Precio de compra 2015–2024</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>€/m² · Precio libre de vivienda terminada (Ministerio de Transportes)</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
            <BarChart data={PRECIO_COMPRA.map(d => ({ label: String(d.year), value: d.valor }))} maxVal={maxCompra} color="#e67e22" fmt={v => `${v.toLocaleString('es-ES')} €`} />
          </div>
        </div>

        {/* Esfuerzo */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Esfuerzo salarial para comprar vivienda</h2>
            <ShareButton text={`Comprar un piso de 90m² en España requiere ${esfuerzoActual} años de salario íntegro. El Banco de España recomienda máximo 3,3 años. Estamos en el doble. #ViviendaEspaña`} size="sm" />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Años de salario bruto necesarios para comprar un piso de 90 m² al precio medio nacional</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 8 }}>
              {ESFUERZO.map(d => {
                const pct = Math.round((d.valor / 10) * 100);
                const color = d.valor >= 8 ? '#e74c3c' : d.valor >= 7 ? '#e67e22' : '#27ae60';
                return (
                  <div key={d.year} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 4 }}>{d.year}</div>
                    <div style={{ height: 80, background: 'var(--card-border)', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <div style={{ height: `${pct}%`, background: color, borderRadius: '0 0 4px 4px' }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color, marginTop: 4 }}>{d.valor}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
              El Banco de España recomienda no destinar más de un 30% del salario a la vivienda, equivalente a ~3,3 años de esfuerzo. Estamos en {esfuerzoActual}, casi el triple.
            </div>
          </div>
        </div>

        {/* Ciudades */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Alquiler por ciudades — 2024</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>€/m²/mes · Precio medio anunciado (Idealista, 2024)</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CIUDADES.map(c => (
                <div key={c.ciudad} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 110, fontSize: 12, color: 'var(--foreground)', flexShrink: 0, fontWeight: 500 }}>{c.ciudad}</span>
                  <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 20, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round((c.alquiler / maxCiudadAlq) * 100)}%`, background: 'var(--accent)', height: '100%', borderRadius: 2 }} />
                  </div>
                  <span style={{ width: 90, fontSize: 12, color: 'var(--muted-strong)', textAlign: 'right', flexShrink: 0 }}>{c.alquiler} €/m²/mes</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
              Un piso de 70 m² en Madrid cuesta <strong>~1.435 €/mes</strong>. Con el salario medio neto (~1.900 €/mes), eso es el <strong>75% del sueldo íntegro</strong> solo en alquiler.
            </div>
          </div>
        </div>

        {/* Desahucios */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Desahucios practicados 2015–2023</h2>
            <ShareButton text={`En 2023 se ejecutaron 49.068 desahucios en España — 134 familias expulsadas de su hogar cada día. En 2015 eran 67.189. La crisis de vivienda no para. #ViviendaEspaña`} size="sm" />
          </div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Lanzamientos practicados · INE</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
            <BarChart data={DESAHUCIOS.map(d => ({ label: String(d.year), value: d.valor }))} maxVal={maxDesahucios} color="#e74c3c" fmt={v => v.toLocaleString('es-ES')} />
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
              El descenso en 2020 se debe a las moratorias por COVID-19. En 2023 se recuperaron los niveles prepandemia con 49.068 desahucios — <strong>134 familias al día</strong>.
            </div>
          </div>
        </div>

        {/* VPO */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Vivienda protegida (VPO) iniciada</h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Viviendas de protección oficial iniciadas por año (Ministerio de Transportes)</p>
          <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
            <BarChart data={VPO.map(d => ({ label: String(d.year), value: d.valor }))} maxVal={VPO[0].valor} color="#8e44ad" fmt={v => v.toLocaleString('es-ES')} />
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, #8e44ad 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
              En 2008 se iniciaron <strong>105.400 VPOs</strong>. En 2023, apenas <strong>10.200</strong> — una caída del <strong>90%</strong> en la construcción de vivienda asequible.
            </div>
          </div>
        </div>

        {/* Contexto */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
          {[
            { title: '¿Por qué sube el alquiler?', text: 'Escasa oferta nueva (permisos de construcción en mínimos), auge del alquiler turístico en ciudades, y subida de tipos que fuerza a propietarios a alquilar en lugar de vender. La demanda supera la oferta en todas las grandes ciudades.', color: 'var(--accent)' },
            { title: '¿Y la Ley de Vivienda?', text: 'La Ley 12/2023 estableció índices de contención de alquileres en zonas tensionadas. Su aplicación es voluntaria para las CCAA. Madrid, Andalucía y otras comunidades del PP no la aplican.', color: '#e67e22' },
            { title: 'Comparativa Europa', text: 'España dedica ~1,5% del PIB a políticas de vivienda. Países Bajos: 3,8%, Alemania: 2,9%, Francia: 2,5%. En viviendas sociales: España 2,5%, Austria 24%, Países Bajos 30%.', color: '#27ae60' },
            { title: 'El problema estructural', text: 'La demanda de vivienda por formación de hogares supera la nueva oferta. Se necesitan ~100.000 viviendas/año en zonas tensionadas. La construcción lleva años por debajo de ese umbral.', color: '#8e44ad' },
          ].map(c => (
            <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
          <strong>Fuentes:</strong> Ministerio de Transportes · INE — Estadística de Ejecuciones Hipotecarias · Fotocasa Research / Idealista Data · Banco de España
        </div>
      </div>

      {/* QUÉ SE DEBERÍA HACER */}
      <section style={{ background: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '52px 0 64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>¿Qué se debería hacer?</div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 32px' }}>
            Cinco medidas para que la vivienda sea asequible.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { titulo: 'Movilizar suelo público para VPO', detalle: 'España tiene decenas de miles de hectáreas de suelo público sin edificar. Cederlo a promotoras bajo la condición de construir VPO con alquiler asequible durante 50 años aumentaría el parque sin coste presupuestario directo.', impacto: 'Potencial de 200.000–300.000 VPOs en 10 años', color: '#ef4d68' },
              { titulo: 'Reforma fiscal: gravar pisos vacíos', detalle: 'España tiene ~3,8 millones de viviendas vacías según el Censo. Un impuesto progresivo sobre vivienda vacía (como en Francia o Reino Unido) incentivaría sacar al mercado un parque enorme ya construido.', impacto: 'Hasta 500.000 nuevas viviendas en alquiler sin construir nada', color: '#e67e22' },
              { titulo: 'Regular el alquiler turístico', detalle: 'Las plataformas de alquiler vacacional (Airbnb, Booking) han sacado ~340.000 viviendas del mercado residencial en las principales ciudades. Una regulación clara con licencias limitadas y revocables reduciría la presión en zonas tensionadas.', impacto: 'Recuperar 100.000–150.000 viviendas para residentes', color: '#2563eb' },
              { titulo: 'Agilizar licencias de construcción', detalle: 'Obtener una licencia de obra nueva en España tarda de media 18 meses. En Alemania: 3 meses. La burocracia municipal es uno de los principales frenos a la construcción de nueva oferta. Una ventanilla única digital reduciría tiempos y costes.', impacto: '+30.000–50.000 viviendas nuevas/año si se reduce a 6 meses', color: '#8e44ad' },
              { titulo: 'Ampliar el parque público de alquiler social', detalle: 'España tiene 290.000 viviendas de alquiler social (2,5% del parque). Francia tiene 5,3 millones (17%), Países Bajos 2,3 millones (30%). Sin inversión directa del Estado no hay solución estructural para los hogares de menor renta.', impacto: 'Triplicar el parque público requiere ~30.000 M€ en 10 años', color: '#059669' },
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
