export const revalidate = 86400;

const PRECIO_COMPRA = [
  { year: 2015, valor: 1494 },
  { year: 2016, valor: 1504 },
  { year: 2017, valor: 1570 },
  { year: 2018, valor: 1637 },
  { year: 2019, valor: 1678 },
  { year: 2020, valor: 1640 },
  { year: 2021, valor: 1699 },
  { year: 2022, valor: 1780 },
  { year: 2023, valor: 1879 },
  { year: 2024, valor: 2050 },
];

const PRECIO_ALQUILER = [
  { year: 2015, valor: 7.5 },
  { year: 2016, valor: 8.0 },
  { year: 2017, valor: 8.9 },
  { year: 2018, valor: 10.0 },
  { year: 2019, valor: 10.8 },
  { year: 2020, valor: 10.5 },
  { year: 2021, valor: 10.2 },
  { year: 2022, valor: 10.8 },
  { year: 2023, valor: 11.5 },
  { year: 2024, valor: 13.1 },
];

const ESFUERZO = [
  { year: 2015, valor: 6.5 },
  { year: 2016, valor: 6.5 },
  { year: 2017, valor: 6.7 },
  { year: 2018, valor: 7.0 },
  { year: 2019, valor: 7.2 },
  { year: 2020, valor: 7.1 },
  { year: 2021, valor: 7.3 },
  { year: 2022, valor: 7.6 },
  { year: 2023, valor: 7.9 },
  { year: 2024, valor: 8.4 },
];

const DESAHUCIOS = [
  { year: 2015, valor: 67189 },
  { year: 2016, valor: 59671 },
  { year: 2017, valor: 60754 },
  { year: 2018, valor: 57853 },
  { year: 2019, valor: 54005 },
  { year: 2020, valor: 22642 },
  { year: 2021, valor: 34270 },
  { year: 2022, valor: 46942 },
  { year: 2023, valor: 49068 },
];

const CIUDADES = [
  { ciudad: 'Madrid', alquiler: 20.5, compra: 4280 },
  { ciudad: 'Barcelona', alquiler: 19.8, compra: 4150 },
  { ciudad: 'San Sebastián', alquiler: 17.2, compra: 4620 },
  { ciudad: 'Bilbao', alquiler: 14.8, compra: 3150 },
  { ciudad: 'Valencia', alquiler: 14.2, compra: 2450 },
  { ciudad: 'Málaga', alquiler: 14.0, compra: 2890 },
  { ciudad: 'Sevilla', alquiler: 11.8, compra: 2200 },
  { ciudad: 'Zaragoza', alquiler: 9.5, compra: 1820 },
  { ciudad: 'Murcia', alquiler: 8.0, compra: 1450 },
];

const VPO = [
  { year: 2008, valor: 105400 },
  { year: 2010, valor: 61900 },
  { year: 2012, valor: 23600 },
  { year: 2015, valor: 8300 },
  { year: 2017, valor: 7900 },
  { year: 2019, valor: 12900 },
  { year: 2021, valor: 10400 },
  { year: 2023, valor: 10200 },
];

function BarChart({ data, maxVal, color = 'var(--accent)', fmt }: {
  data: { label: string; value: number }[];
  maxVal: number;
  color?: string;
  fmt: (v: number) => string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {data.map(({ label, value }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 36, fontSize: 11, color: 'var(--muted)', textAlign: 'right', flexShrink: 0 }}>{label}</span>
          <div style={{ flex: 1, background: 'var(--card-border)', borderRadius: 2, height: 18, overflow: 'hidden' }}>
            <div style={{ width: `${Math.round((value / maxVal) * 100)}%`, background: color, height: '100%', borderRadius: 2 }} />
          </div>
          <span style={{ width: 72, fontSize: 11, color: 'var(--muted-strong)', textAlign: 'right', flexShrink: 0 }}>{fmt(value)}</span>
        </div>
      ))}
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
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            Ministerio de Transportes · INE · Fotocasa
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(26px,5vw,42px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 14, lineHeight: 1.1 }}>
          Vivienda en España
        </h1>
        <p style={{ fontSize: 16, color: 'var(--muted-strong)', maxWidth: 620, lineHeight: 1.6 }}>
          El precio del alquiler ha subido un <strong style={{ color: 'var(--foreground)' }}>{alquilerSubida}%</strong> desde 2015.
          Comprar un piso exige <strong style={{ color: 'var(--foreground)' }}>8,4 años</strong> de salario íntegro.
          Cada año se ejecutan cerca de <strong style={{ color: 'var(--foreground)' }}>49.000 desahucios</strong>.
        </p>
      </div>

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

      {/* Sección alquiler */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Precio del alquiler 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          €/m²/mes · Índice de referencia nacional (Fotocasa/Ministerio de Vivienda)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={PRECIO_ALQUILER.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxAlquiler}
            color="var(--accent)"
            fmt={v => `${v} €`}
          />
          <div style={{ marginTop: 16, padding: '10px 14px', background: 'color-mix(in srgb, var(--accent) 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            ⚠ El salario medio en España creció un <strong>~18%</strong> en el mismo período. El alquiler subió <strong>4,5 veces más rápido</strong> que los salarios.
          </div>
        </div>
      </div>

      {/* Sección compra */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Precio de compra 2015–2024</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          €/m² · Precio libre de vivienda terminada (Ministerio de Transportes, Movilidad y Agenda Urbana)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={PRECIO_COMPRA.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxCompra}
            color="#e67e22"
            fmt={v => `${v.toLocaleString('es-ES')} €`}
          />
        </div>
      </div>

      {/* Esfuerzo salarial */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Esfuerzo salarial para comprar vivienda</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Años de salario bruto necesarios para comprar un piso de 90 m² al precio medio nacional
        </p>
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
            El Banco de España recomienda no destinar más de un 30% del salario a la vivienda, lo que equivale a un esfuerzo máximo de ~3,3 años.
          </div>
        </div>
      </div>

      {/* Alquiler por ciudades */}
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
                <span style={{ width: 90, fontSize: 12, color: 'var(--muted-strong)', textAlign: 'right', flexShrink: 0 }}>
                  {c.alquiler} €/m²/mes
                </span>
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
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Desahucios practicados 2015–2023</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Lanzamientos practicados por los Servicios Comunes de Notificaciones y Embargos (INE)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={DESAHUCIOS.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxDesahucios}
            color="#e74c3c"
            fmt={v => v.toLocaleString('es-ES')}
          />
          <div style={{ marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>
            El descenso en 2020 se debe a las moratorias por COVID-19. En 2023 se recuperaron los niveles prepandemia con 49.068 desahucios — <strong>134 familias al día</strong>.
          </div>
        </div>
      </div>

      {/* VPO */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Vivienda protegida (VPO) iniciada</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Número de viviendas de protección oficial iniciadas por año (Ministerio de Transportes)
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={VPO.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={VPO[0].valor}
            color="#8e44ad"
            fmt={v => v.toLocaleString('es-ES')}
          />
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, #8e44ad 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            En 2008 se iniciaron <strong>105.400 VPOs</strong>. En 2023, apenas <strong>10.200</strong> — una caída del <strong>90%</strong> en la construcción de vivienda asequible.
          </div>
        </div>
      </div>

      {/* Contexto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { title: '¿Por qué sube el alquiler?', text: 'Escasa oferta nueva (permisos de construcción en mínimos históricos), auge del alquiler turístico en zonas costeras y ciudades, y subida de tipos de interés que fuerza a muchos propietarios a alquilar en lugar de vender.', color: 'var(--accent)' },
          { title: '¿Y la Ley de Vivienda?', text: 'La Ley 12/2023 estableció índices de contención de alquilas en zonas tensionadas. Su aplicación es voluntaria para las CCAA. Madrid y otras comunidades del PP no la aplican.', color: '#e67e22' },
          { title: 'Comparativa Europa', text: 'España dedica ~1,5% del PIB a políticas de vivienda. Países Bajos dedica 3,8%, Alemania 2,9%, Francia 2,5%. En número de viviendas sociales: España 2,5%, Austria 24%, Países Bajos 30%.', color: '#27ae60' },
          { title: 'El problema estructural', text: 'La demanda de vivienda por formación de hogares supera ampliamente la nueva oferta. Se necesitan ~100.000 viviendas/año en las zonas más tensionadas. La construcción lleva años por debajo de ese umbral.', color: '#8e44ad' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> Ministerio de Transportes, Movilidad y Agenda Urbana — Estadística de Precios de Vivienda ·
        INE — Estadística de Ejecuciones Hipotecarias y Desahucios ·
        Fotocasa Research / Idealista Data — Índice de Precios del Alquiler 2024 ·
        Banco de España — Indicadores de Esfuerzo Hipotecario
      </div>
    </main>
  );
}
