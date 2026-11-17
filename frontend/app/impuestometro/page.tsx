'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';

// --- calculo:inicio
const EJERCICIO = 2026;

// Orden PJC/297/2026 (BOE-A-2026-7296): cuota a cargo del trabajador, contrato indefinido.
const SS_CONTINGENCIAS_COMUNES = 0.047;
const SS_DESEMPLEO = 0.0155;
const SS_FORMACION_PROFESIONAL = 0.001;
const SS_MEI = 0.0015;
const SS_TIPO_TRABAJADOR = SS_CONTINGENCIAS_COMUNES + SS_DESEMPLEO + SS_FORMACION_PROFESIONAL + SS_MEI;
const SS_BASE_MAXIMA_MENSUAL = 5101.2;
// Cotización adicional de solidaridad (art. 17.1): tramos mensuales sobre la base máxima, parte del trabajador.
const SS_SOLIDARIDAD: [number, number, number][] = [
  [5101.2, 5611.32, 0.0019],
  [5611.32, 7651.8, 0.0021],
  [7651.8, Infinity, 0.0024],
];

// Algoritmo de retenciones AEAT 2026, tabla 2 (escala de retención del art. 85.1 RIRPF).
const ESCALA_RETENCION: [number, number][] = [
  [12450, 0.19], [20200, 0.24], [35200, 0.30],
  [60000, 0.37], [300000, 0.45], [Infinity, 0.47],
];
// Límite excluyente de retención (art. 81 RIRPF), situación familiar 3, por nº de hijos (0, 1, 2+).
const LIMITE_EXCLUYENTE = [15876, 16342, 16867];
const MINIMO_PERSONAL = 5550;
const MINIMO_DESCENDIENTES = [2400, 2700, 4000, 4500];
const OTROS_GASTOS = 2000;

function escala(importe: number) {
  let cuota = 0;
  let prev = 0;
  for (const [tope, tipo] of ESCALA_RETENCION) {
    if (importe <= prev) break;
    cuota += (Math.min(importe, tope) - prev) * tipo;
    prev = tope;
  }
  return cuota;
}

function reduccionTrabajo(rnt: number) {
  let r = 0;
  if (rnt <= 14852) r = 7302;
  else if (rnt <= 17673.52) r = 7302 - 1.75 * (rnt - 14852);
  else if (rnt < 19747.5) r = 2364.34 - 1.14 * (rnt - 17673.52);
  return Math.round(r * 100) / 100;
}

function calcImpuestos(salario: number, hijos: number) {
  // Cotizaciones: 12 mensualidades iguales (pagas extra prorrateadas).
  const mensual = salario / 12;
  const ssBase = Math.min(mensual, SS_BASE_MAXIMA_MENSUAL) * SS_TIPO_TRABAJADOR * 12;
  let ssSolidaridad = 0;
  for (const [desde, hasta, tipo] of SS_SOLIDARIDAD) {
    if (mensual > desde) ssSolidaridad += (Math.min(mensual, hasta) - desde) * tipo * 12;
  }
  const ss = ssBase + ssSolidaridad;

  // Retención IRPF: base = bruto − cotizaciones − 2.000 € − reducción art. 20 LIRPF (− 600 € si >2 hijos).
  const rnt = Math.max(0, salario - ss);
  const otrosGastos = Math.min(OTROS_GASTOS, rnt);
  const red20 = reduccionTrabajo(rnt);
  const reduccionHijos = hijos > 2 ? 600 : 0;
  const base = Math.max(0, rnt - otrosGastos - red20 - reduccionHijos);
  // Mínimo por descendientes al 50 % (dos progenitores con derecho, opción por defecto del modelo 145).
  let minimo = MINIMO_PERSONAL;
  for (let i = 0; i < hijos; i++) minimo += MINIMO_DESCENDIENTES[Math.min(i, 3)] * 0.5;
  let cuota = Math.max(0, escala(base) - escala(minimo));
  const limite = LIMITE_EXCLUYENTE[Math.min(hijos, 2)];
  if (salario <= limite) cuota = 0;
  else if (salario <= 35200) cuota = Math.min(cuota, (salario - limite) * 0.43);
  // Tipo truncado a 2 decimales; importe = bruto × tipo.
  const tipoRetencion = Math.floor((cuota / salario) * 10000 + 1e-6) / 100;
  const irpf = Math.round(salario * tipoRetencion) / 100;

  const totalImpuestos = ss + irpf;
  const neto = salario - totalImpuestos;
  const tipoEfectivo = (totalImpuestos / salario) * 100;
  // Día de liberación (cálculo propio): días = round(365 × (cotizaciones + IRPF) / bruto); fecha = 1 de enero + días.
  const diasPorImpuestos = Math.round(365 * (totalImpuestos / salario));
  const liberacion = new Date(EJERCICIO, 0, 1 + diasPorImpuestos);
  return { ss, irpf, tipoRetencion, neto, totalImpuestos, tipoEfectivo, netoMensual: neto / 14, diasPorImpuestos, liberacion };
}
// --- calculo:fin

// IGAE, Clasificación funcional del gasto de las AAPP (COFOG) 2020-2024, año 2024 (provisional),
// millones de €. Coincide con Eurostat gov_10a_exp (ES, S13, TE). % = importe / 725.001 × 100.
const GASTO_TOTAL_AAPP_2024 = 725001;
const DESTINOS = [
  { nombre: 'Protección social: edad avanzada (10.2)', mill: 165050 },
  { nombre: 'Salud (07)', mill: 102942 },
  { nombre: 'Asuntos económicos (04)', mill: 80908 },
  { nombre: 'Educación (09)', mill: 65862 },
  { nombre: 'Servicios públicos generales, salvo deuda (01)', mill: 92551 - 39644 },
  { nombre: 'Protección social: enfermedad e incapacidad (10.1)', mill: 44019 },
  { nombre: 'Operaciones de deuda pública (01.7)', mill: 39644 },
  { nombre: 'Protección social: supérstites (10.3)', mill: 35425 },
  { nombre: 'Protección social: otras (10.4, 10.6–10.9)', mill: 297532 - 165050 - 44019 - 35425 - 24077 },
  { nombre: 'Orden público y seguridad (03)', mill: 28628 },
  { nombre: 'Protección social: desempleo (10.5)', mill: 24077 },
  { nombre: 'Ocio, cultura y religión (08)', mill: 19193 },
  { nombre: 'Protección del medio ambiente (05)', mill: 15539 },
  { nombre: 'Defensa (02)', mill: 14233 },
  { nombre: 'Vivienda y servicios comunitarios (06)', mill: 7613 },
].map(d => ({ ...d, pct: (d.mill / GASTO_TOTAL_AAPP_2024) * 100 }));
const MAX_PCT = Math.max(...DESTINOS.map(d => d.pct));

function fmt(n: number) { return Math.round(n).toLocaleString('es-ES'); }
function fmtPct(n: number, dec = 1) { return n.toLocaleString('es-ES', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }

export default function ImpuestometroPage() {
  const [salario, setSalario] = useState(28000);
  const [hijos, setHijos] = useState(0);

  const calc = useMemo(() => calcImpuestos(salario, hijos), [salario, hijos]);
  const fechaLiberacion = calc.liberacion.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });

  return (
    <>
      <PageHeader
        eyebrow={`Calculadora · Impuestómetro ${EJERCICIO}`}
        title={`Retención de IRPF y cotizaciones de un sueldo bruto en ${EJERCICIO}`}
        lede="Introduce el sueldo bruto anual para estimar la retención de IRPF y las cotizaciones a la Seguridad Social a cargo del trabajador, y cómo se reparte ese importe según el peso de cada función en el gasto de las Administraciones Públicas."
        meta={[
          { k: 'IRPF', v: `Algoritmo de retenciones AEAT ${EJERCICIO}` },
          { k: 'Cotizaciones', v: 'Orden PJC/297/2026' },
          { k: 'Reparto', v: 'IGAE COFOG 2024' },
        ]}
      />

      {/* Calculadora */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 56, alignItems: 'start' }}>
            {/* Input */}
            <div>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, padding: 28, background: 'var(--card)' }}>
                <div className="eyebrow-muted" style={{ marginBottom: 8 }}>Sueldo bruto anual</div>
                <div className="mono" style={{ fontSize: 56, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 18 }}>
                  {fmt(salario)}<span style={{ fontSize: 22, color: 'var(--muted)', marginLeft: 6 }}>€</span>
                </div>
                <input
                  type="range" min={12000} max={120000} step={500}
                  value={salario} onChange={e => setSalario(+e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--accent)', margin: 0 }}
                />
                <div className="mono" style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                  <span>12.000 €</span><span>120.000 €</span>
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                  SMI 2026: 17.094 €/año a jornada completa (RD 126/2026)
                </div>

                <div style={{ marginTop: 26 }}>
                  <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Hijos menores de 25 años</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2, 3].map(n => (
                      <button key={n} onClick={() => setHijos(n)} style={{
                        flex: 1, padding: '10px 0', border: '1px solid var(--card-border)',
                        background: hijos === n ? 'var(--accent)' : 'transparent',
                        color: hijos === n ? '#fff' : 'var(--foreground)',
                        fontFamily: 'var(--font-mono), monospace', fontSize: 13, fontWeight: 600,
                        borderRadius: 3,
                      }}>{n}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Día de liberación */}
              <div style={{ marginTop: 24, padding: 24, background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div className="eyebrow-muted" style={{ marginBottom: 8 }}>Día de liberación fiscal (cálculo propio)</div>
                <div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
                  {fechaLiberacion} de {EJERCICIO}
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.5, margin: 0, color: 'var(--foreground)' }}>
                  La retención de IRPF y las cotizaciones suman el {fmtPct(calc.tipoEfectivo)} % del bruto,
                  equivalente a <strong>{calc.diasPorImpuestos} de 365 días</strong>. Fórmula: días = 365 ×
                  (IRPF + cotizaciones) / bruto, redondeado; la fecha es el 1 de enero más ese número de días.
                  Supone que el sueldo se reparte por igual entre todos los días del año.
                </p>
              </div>
            </div>

            {/* Desglose */}
            <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)', background: 'var(--background)' }}>
                <div className="eyebrow-muted">Desglose anual estimado · {EJERCICIO}</div>
              </div>
              {[
                { label: 'Sueldo bruto', value: fmt(salario), unit: '€', emphasis: true },
                { label: 'Cotizaciones a la Seguridad Social', value: '−' + fmt(calc.ss), unit: '€', sub: 'Trabajador: contingencias comunes 4,70 % + desempleo 1,55 % + FP 0,10 % + MEI 0,15 %; base máx. 5.101,20 €/mes' },
                { label: 'Retención de IRPF', value: '−' + fmt(calc.irpf), unit: '€', sub: `Tipo de retención ${fmtPct(calc.tipoRetencion, 2)} %` },
                { label: 'Sueldo neto anual', value: fmt(calc.neto), unit: '€', emphasis: true, last: true },
              ].map(row => (
                <div key={row.label} style={{
                  padding: '18px 24px',
                  borderBottom: row.last ? 0 : '1px solid var(--rule)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12,
                }}>
                  <div>
                    <div style={{ fontSize: 14.5, fontWeight: row.emphasis ? 700 : 500 }}>{row.label}</div>
                    {row.sub && <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{row.sub}</div>}
                  </div>
                  <div className="mono" style={{
                    fontSize: row.emphasis ? 22 : 18, fontWeight: 600, letterSpacing: '-0.02em',
                    color: 'var(--foreground)', whiteSpace: 'nowrap',
                  }}>
                    {row.value}<span style={{ color: 'var(--muted)', fontSize: 12, marginLeft: 4 }}>{row.unit}</span>
                  </div>
                </div>
              ))}
              <div style={{
                padding: '20px 24px', borderTop: '1px solid var(--card-border)',
                background: 'var(--background)', display: 'flex', justifyContent: 'space-between',
              }}>
                <span className="eyebrow-muted">Neto mensual (14 pagas)</span>
                <span className="mono" style={{ fontWeight: 700, fontSize: 16 }}>{fmt(calc.netoMensual)} €</span>
              </div>
              <div style={{
                padding: '20px 24px', borderTop: '1px solid var(--card-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  IRPF + cotizaciones del trabajador
                </span>
                <span className="mono" style={{ fontSize: 24, fontWeight: 700 }}>{fmt(calc.totalImpuestos)} €</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--muted)', marginTop: 24, maxWidth: 900 }}>
            <p style={{ margin: '0 0 6px' }}>
              <strong>Cómo se calcula.</strong> El IRPF es la retención anual según el{' '}
              <a href="https://sede.agenciatributaria.gob.es/static_files/Sede/Programas_ayuda/Retenciones/2026/Algoritmo%20Retenciones-2026_10sept.pdf" target="_blank" rel="noopener noreferrer">algoritmo de retenciones {EJERCICIO} de la AEAT</a>,
              que aplica la escala única del art. 85.1 del Reglamento del IRPF en todo el territorio común (19 %–47 %).
              No usa la escala autonómica de ninguna comunidad: la cuota definitiva de la declaración de la Renta
              suma la escala estatal y la de la comunidad de residencia y puede diferir de la retención.
              No aplica a País Vasco ni Navarra (régimen foral).
            </p>
            <p style={{ margin: '0 0 6px' }}>
              Base: bruto − cotizaciones − 2.000 € de otros gastos − reducción por rendimientos del trabajo (art. 20 LIRPF:
              7.302 € hasta 14.852 € de rendimiento neto, decreciente hasta 0 € a partir de 19.747,50 €).
              Mínimo personal 5.550 €; mínimo por descendientes 2.400 / 2.700 / 4.000 € al 50 %. Se aplican el límite
              excluyente de retención y el límite del 43 % del art. 85.3 RIRPF.
            </p>
            <p style={{ margin: 0 }}>
              Supuestos: contrato indefinido, menor de 65 años, sin discapacidad, situación familiar 3 (modelo 145),
              hijos mayores de 3 años, sin movilidad geográfica ni préstamo de vivienda, un solo pagador y 12 mensualidades
              iguales para la cotización. No incluye la cotización a cargo de la empresa.
              Cotizaciones según la{' '}
              <a href="https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296" target="_blank" rel="noopener noreferrer">Orden PJC/297/2026 (BOE 31/03/2026)</a>,
              incluida la cotización adicional de solidaridad del trabajador por encima de la base máxima.
            </p>
          </div>
        </div>
      </section>

      {/* Reparto por funciones */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--rule)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Reparto por funciones del gasto</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.025em' }}>
            Gasto de las Administraciones Públicas por funciones, 2024
          </h2>
          <p style={{ fontSize: 14.5, color: 'var(--muted-strong)', margin: '0 0 28px' }}>
            Reparto proporcional de los <strong>{fmt(calc.totalImpuestos)} €</strong> de IRPF y cotizaciones según el peso
            de cada función en el gasto total de las Administraciones Públicas en 2024 ({fmt(GASTO_TOTAL_AAPP_2024)} millones de €).
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'hidden' }}>
            {DESTINOS.map((d, i) => {
              const monto = (calc.totalImpuestos * d.pct) / 100;
              return (
                <div key={d.nombre} style={{
                  padding: '16px 24px',
                  borderBottom: i === DESTINOS.length - 1 ? 0 : '1px solid var(--rule)',
                  display: 'grid', gridTemplateColumns: '260px 1fr 130px 70px',
                  gap: 20, alignItems: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.nombre}</div>
                  <div style={{ height: 6, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
                    <div style={{ height: '100%', width: `${(d.pct / MAX_PCT) * 100}%`, background: 'var(--muted-strong)' }} />
                  </div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600, textAlign: 'right' }}>
                    {fmt(monto)}<span style={{ color: 'var(--muted)', marginLeft: 4 }}>€</span>
                  </div>
                  <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'right' }}>{fmtPct(d.pct)} %</div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, lineHeight: 1.6 }}>
            Fuente: IGAE,{' '}
            <a href="https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/AAPP_A/Funcional%202020-2024.pdf" target="_blank" rel="noopener noreferrer">Clasificación funcional del gasto de las Administraciones Públicas (COFOG) 2020-2024</a>,
            año 2024 provisional; total AAPP (Estado, comunidades autónomas, corporaciones locales y Seguridad Social).
            Mismas cifras en Eurostat (gov_10a_exp). Entre paréntesis, el código COFOG. Los ingresos públicos no están
            asignados a gastos concretos: el reparto es ilustrativo y aplica a tu importe la estructura del gasto total,
            que en 2024 no se financió solo con impuestos y cotizaciones.
          </p>
        </div>
      </section>
    </>
  );
}
