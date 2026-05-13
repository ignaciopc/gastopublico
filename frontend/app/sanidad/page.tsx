'use client';

import ShareButton from '@/components/ui/ShareButton';

const GASTO_SANITARIO = [
  { year: 2015, valor: 61.2 },
  { year: 2016, valor: 62.3 },
  { year: 2017, valor: 64.4 },
  { year: 2018, valor: 67.3 },
  { year: 2019, valor: 70.7 },
  { year: 2020, valor: 83.9 },
  { year: 2021, valor: 83.1 },
  { year: 2022, valor: 81.6 },
  { year: 2023, valor: 85.2 },
];

const LISTA_ESPERA = [
  { year: 2015, valor: 571 },
  { year: 2016, valor: 603 },
  { year: 2017, valor: 625 },
  { year: 2018, valor: 666 },
  { year: 2019, valor: 718 },
  { year: 2020, valor: 645 },
  { year: 2021, valor: 760 },
  { year: 2022, valor: 805 },
  { year: 2023, valor: 836 },
];

const ESPERA_DIAS = [
  { year: 2015, valor: 90 },
  { year: 2016, valor: 89 },
  { year: 2017, valor: 93 },
  { year: 2018, valor: 95 },
  { year: 2019, valor: 103 },
  { year: 2020, valor: 120 },
  { year: 2021, valor: 119 },
  { year: 2022, valor: 115 },
  { year: 2023, valor: 113 },
];

const COMPARATIVA_MEDICOS = [
  { pais: 'Grecia', valor: 6.3 },
  { pais: 'Austria', valor: 5.4 },
  { pais: 'Portugal', valor: 5.6 },
  { pais: 'Alemania', valor: 4.5 },
  { pais: 'Italia', valor: 4.1 },
  { pais: 'España', valor: 4.1 },
  { pais: 'UE-27 media', valor: 3.9 },
  { pais: 'Francia', valor: 3.2 },
  { pais: 'Países Bajos', valor: 3.7 },
];

const COMPARATIVA_ENFERMERAS = [
  { pais: 'Alemania', valor: 13.9 },
  { pais: 'Países Bajos', valor: 10.8 },
  { pais: 'Austria', valor: 10.4 },
  { pais: 'Francia', valor: 9.9 },
  { pais: 'UE-27 media', valor: 8.8 },
  { pais: 'Italia', valor: 6.5 },
  { pais: 'España', valor: 5.6 },
  { pais: 'Portugal', valor: 7.1 },
  { pais: 'Grecia', valor: 3.3 },
];

const GASTO_PIB_EU = [
  { pais: 'Alemania', pib: 12.8 },
  { pais: 'Francia', pib: 11.9 },
  { pais: 'Austria', pib: 11.5 },
  { pais: 'Países Bajos', pib: 11.1 },
  { pais: 'UE-27 media', pib: 10.9 },
  { pais: 'Italia', pib: 9.5 },
  { pais: 'España', pib: 9.1 },
  { pais: 'Portugal', pib: 9.8 },
  { pais: 'Grecia', pib: 8.5 },
];

const ESPECIALIDADES_ESPERA = [
  { esp: 'Traumatología y Cirugía Ortopédica', dias: 156 },
  { esp: 'Cirugía General y del Aparato Digestivo', dias: 128 },
  { esp: 'Oftalmología', dias: 117 },
  { esp: 'Otorrinolaringología', dias: 114 },
  { esp: 'Urología', dias: 109 },
  { esp: 'Cirugía Cardíaca', dias: 85 },
  { esp: 'Neurología', dias: 78 },
  { esp: 'Dermatología', dias: 72 },
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
          <span style={{ width: 72, fontSize: 11, color: highlight ? 'var(--foreground)' : 'var(--muted-strong)', textAlign: 'right', flexShrink: 0, fontWeight: highlight ? 700 : 400 }}>{fmt(value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function SanidadPage() {
  const gastoActual = GASTO_SANITARIO[GASTO_SANITARIO.length - 1].valor;
  const gastoBase = GASTO_SANITARIO[0].valor;
  const listaActual = LISTA_ESPERA[LISTA_ESPERA.length - 1].valor;
  const diasActual = ESPERA_DIAS[ESPERA_DIAS.length - 1].valor;
  const maxGasto = Math.max(...GASTO_SANITARIO.map(d => d.valor));
  const maxLista = Math.max(...LISTA_ESPERA.map(d => d.valor));
  const maxDias = Math.max(...ESPERA_DIAS.map(d => d.valor));
  const maxMedicos = Math.max(...COMPARATIVA_MEDICOS.map(d => d.valor));
  const maxEnfermeras = Math.max(...COMPARATIVA_ENFERMERAS.map(d => d.valor));
  const maxGastoPib = Math.max(...GASTO_PIB_EU.map(d => d.pib));
  const maxEspDias = Math.max(...ESPECIALIDADES_ESPERA.map(d => d.dias));

  return (
    <main>

      {/* ── HERO OSCURO ───────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Ministerio de Sanidad · OCDE · Eurostat
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 64px)', fontWeight: 900, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 900, color: '#ededeb' }}>
            Gasto récord en sanidad.<br />
            <span style={{ color: '#ef4d68' }}>836.000 en lista de espera.</span>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', maxWidth: 720, lineHeight: 1.6, margin: '0 0 32px' }}>
            España gasta <strong style={{ color: '#ef4d68' }}>85.200 millones de euros</strong> en sanidad — un máximo histórico.
            A la vez, <strong style={{ color: '#ef4d68' }}>836.000 pacientes</strong> esperan una operación con una demora media de{' '}
            <strong style={{ color: '#ef4d68' }}>{diasActual} días</strong>.
            El sistema tiene médicos suficientes pero un déficit grave de <strong style={{ color: '#ef4d68' }}>135.000 enfermeras</strong>.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { label: 'Gasto sanitario 2023', value: `${gastoActual} MM€`, sub: `+${Math.round(((gastoActual - gastoBase) / gastoBase) * 100)}% desde 2015` },
              { label: '% del PIB', value: '9,1%', sub: 'Media UE: 10,9%' },
              { label: 'Lista espera', value: `${listaActual.toLocaleString('es-ES')} k`, sub: 'pacientes en espera' },
              { label: 'Espera media', value: `${diasActual} días`, sub: '3,7 meses de media' },
              { label: 'Déficit enfermeras', value: '−135.000', sub: 'para alcanzar media UE' },
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
          { label: 'Gasto sanitario 2023', value: `${gastoActual} MM€`, sub: `+${Math.round(((gastoActual - gastoBase) / gastoBase) * 100)}% desde 2015`, color: 'var(--accent)' },
          { label: '% del PIB', value: '9,1%', sub: 'Media UE: 10,9%', color: '#e67e22' },
          { label: 'Lista espera quirúrgica', value: `${listaActual.toLocaleString('es-ES')} k`, sub: 'pacientes en espera', color: '#e74c3c' },
          { label: 'Espera media', value: `${diasActual} días`, sub: '3,7 meses de media', color: '#e74c3c' },
          { label: 'Médicos / 1.000 hab', value: '4,1', sub: 'Media UE: 3,9 ✓', color: '#27ae60' },
          { label: 'Enfermeras / 1.000 hab', value: '5,6', sub: 'Media UE: 8,8 ✗', color: '#e74c3c' },
        ].map(k => (
          <div key={k.label} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1.1 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Gasto evolución */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Gasto sanitario público 2015–2023</h2>
          <ShareButton text={`España gasta ${gastoActual} MM€ en sanidad — máximo histórico. Pero sigue por debajo de la media de la UE (10,9% del PIB vs 9,1% en España).`} size="sm" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de millones de euros · Gasto consolidado del Sistema Nacional de Salud
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={GASTO_SANITARIO.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxGasto}
            color="var(--accent)"
            fmt={v => `${v.toFixed(1)} MM€`}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
            El pico de 2020 corresponde al gasto extraordinario de la pandemia COVID-19 (test masivos, UCIs, vacunación). En 2022 bajó al normalizarse, pero 2023 marca un nuevo máximo histórico.
          </div>
        </div>
      </div>

      {/* Listas de espera */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Lista de espera quirúrgica 2015–2023</h2>
          <ShareButton text={`836.000 españoles esperan una operación. Un 46% más que en 2015. La espera media es de ${diasActual} días (3,7 meses). ¿Esto es sanidad pública de calidad?`} size="sm" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Miles de pacientes en espera de intervención quirúrgica · CISNS (Ministerio de Sanidad), diciembre de cada año
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={LISTA_ESPERA.map(d => ({ label: String(d.year), value: d.valor, highlight: d.year === 2023 }))}
            maxVal={maxLista * 1.05}
            color="#e74c3c"
            fmt={v => `${v.toLocaleString('es-ES')} k`}
          />
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, #e74c3c 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            En 2023 hay un <strong>46% más de pacientes en lista de espera</strong> que en 2015. La pandemia agravó el problema pero la tendencia al alza es anterior. El descenso de 2020 es artificial: se paralizaron las listas durante el confinamiento.
          </div>
        </div>
      </div>

      {/* Días de espera */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Demora media hasta operación — 2015–2023</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Días de espera medio desde que el médico indica la intervención hasta que se realiza
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={ESPERA_DIAS.map(d => ({ label: String(d.year), value: d.valor }))}
            maxVal={maxDias * 1.05}
            color="#e67e22"
            fmt={v => `${v} días`}
          />
        </div>
      </div>

      {/* Espera por especialidad */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Demora por especialidad quirúrgica — 2023</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          Días de espera media por especialidad · CISNS · Las especialidades con mayor demora
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={ESPECIALIDADES_ESPERA.sort((a, b) => b.dias - a.dias).map(d => ({ label: d.esp, value: d.dias }))}
            maxVal={maxEspDias}
            color="#e74c3c"
            fmt={v => `${v} días`}
            labelWidth={260}
          />
        </div>
      </div>

      {/* Médicos comparativa */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Médicos por 1.000 habitantes — Comparativa UE</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          OCDE Health Statistics 2023 · España en la media europea — un punto fuerte del sistema
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={COMPARATIVA_MEDICOS.sort((a, b) => b.valor - a.valor).map(d => ({ label: d.pais, value: d.valor, highlight: d.pais === 'España' }))}
            maxVal={maxMedicos}
            color="#27ae60"
            fmt={v => `${v}`}
            labelWidth={110}
          />
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
            En médicos, España está en la media europea. El problema no es la cantidad sino la <strong>distribución territorial</strong>: zonas rurales con grave escasez y esperas de meses para médico de familia.
          </div>
        </div>
      </div>

      {/* Enfermeras comparativa */}
      <div style={{ marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Enfermeras por 1.000 habitantes — Comparativa UE</h2>
          <ShareButton text="España necesita 135.000 enfermeras más para alcanzar la media europea. Solo tiene 5,6 por 1.000 habitantes vs 8,8 de media en la UE. Es el principal cuello de botella del SNS." size="sm" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          OCDE Health Statistics 2023 · España tiene el 36% menos de enfermeras que la media europea
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={COMPARATIVA_ENFERMERAS.sort((a, b) => b.valor - a.valor).map(d => ({ label: d.pais, value: d.valor, highlight: d.pais === 'España' }))}
            maxVal={maxEnfermeras}
            color="var(--muted-strong)"
            fmt={v => `${v}`}
            labelWidth={110}
          />
          <div style={{ marginTop: 14, padding: '10px 14px', background: 'color-mix(in srgb, #e74c3c 10%, transparent)', borderRadius: 6, fontSize: 12, color: 'var(--muted-strong)' }}>
            España necesitaría <strong>~135.000 enfermeras más</strong> para alcanzar la media de la UE. La ratio es una de las más bajas de Europa occidental y es la principal causa de sobrecarga del personal sanitario.
          </div>
        </div>
      </div>

      {/* Gasto PIB comparativa */}
      <div style={{ marginBottom: 48 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Gasto sanitario total % del PIB — Comparativa UE</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
          % del PIB (gasto público + privado) · OCDE 2022 · España por debajo de la media
        </p>
        <div style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '24px 20px' }}>
          <BarChart
            data={GASTO_PIB_EU.sort((a, b) => b.pib - a.pib).map(d => ({ label: d.pais, value: d.pib, highlight: d.pais === 'España' }))}
            maxVal={maxGastoPib}
            color="var(--muted-strong)"
            fmt={v => `${v}% PIB`}
            labelWidth={110}
          />
        </div>
      </div>

      {/* Contexto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
        {[
          { title: 'La crisis de médicos de familia', text: 'El 48% de los médicos de familia en España tiene más de 55 años. En los próximos 10 años se jubilará casi la mitad. El MIR no forma suficientes especialistas en Medicina de Familia para reemplazarlos.', color: 'var(--accent)' },
          { title: 'Sanidad privada en auge', text: 'El 24% de la población tiene seguro sanitario privado (2023), el mayor porcentaje histórico. El motivo principal citado: escapar de las listas de espera de la pública. Madrid lidera con el 37% de cobertura privada.', color: '#e67e22' },
          { title: 'La descentralización', text: 'La sanidad está transferida a las 17 CCAA desde 2002. Hay diferencias abismales: la espera quirúrgica media en País Vasco es de 62 días; en Canarias supera los 160 días. Mismos impuestos, servicios muy distintos.', color: '#8e44ad' },
          { title: 'Infraestructura y equipamiento', text: 'España tiene 3,0 camas hospitalarias por 1.000 hab, frente a 7,8 de Alemania y 5,9 de Francia. El parque de TACs y RMNs está por debajo de la OCDE, lo que alarga las esperas diagnósticas.', color: '#e74c3c' },
        ].map(c => (
          <div key={c.title} style={{ background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 8, padding: '20px 18px', borderTop: `3px solid ${c.color}` }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 13, color: 'var(--muted-strong)', lineHeight: 1.6 }}>{c.text}</div>
          </div>
        ))}
      </div>

      {/* Fuentes */}
      <div style={{ borderTop: '1px solid var(--rule)', paddingTop: 20, fontSize: 11, color: 'var(--muted)', lineHeight: 1.8 }}>
        <strong>Fuentes:</strong> Ministerio de Sanidad — Sistema de Información sobre Listas de Espera del SNS (SISLE) ·
        OCDE — Health at a Glance 2023 ·
        Eurostat — Healthcare expenditure statistics ·
        Consejo Interterritorial del Sistema Nacional de Salud
      </div>
      </div>{/* cierre del wrapper max-width */}

      {/* ── QUÉ SE DEBERÍA HACER ─────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '52px 0 64px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 11, color: '#ef4d68', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>¿Qué se debería hacer?</div>
          <h2 style={{ fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.1, margin: '0 0 32px' }}>
            Cinco reformas para un SNS sostenible.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {[
              { titulo: 'Formación masiva de enfermeras', detalle: 'España necesita 135.000 enfermeras más para alcanzar la media europea. Hay que incrementar las plazas universitarias de Enfermería, mejorar las condiciones laborales (el 18% de las enfermeras formadas en España trabaja en el extranjero) y crear incentivos para zonas rurales.', impacto: 'Reducir la ratio paciente/enfermera y las listas de espera en 3–4 años', color: '#ef4d68' },
              { titulo: 'Copago inteligente por renta', detalle: 'El sistema sanitario es gratuito en el punto de uso, lo que desincentiva el uso eficiente. Un copago simbólico ajustado por renta (exento para pensionistas y rentas bajas, como en Francia) reduciría las urgencias no urgentes (30–40% de los casos actuales).', impacto: 'Liberar ~3 MM de consultas innecesarias anuales', color: '#e67e22' },
              { titulo: 'Digitalización y telemedicina', detalle: 'España tiene una historia clínica electrónica fragmentada en 17 sistemas incompatibles. La interoperabilidad permitiría a cualquier médico ver el historial completo del paciente. La telemedicina podría resolver el 35–40% de las consultas de atención primaria sin desplazamiento.', impacto: 'Ahorro estimado de 2.000–3.000 MM€/año', color: '#2563eb' },
              { titulo: 'Autorización ágil de medicamentos y tecnología', detalle: 'El tiempo medio de acceso a nuevos medicamentos oncológicos en España es de 18 meses desde la aprobación de la EMA (media UE: 6 meses). El sistema de precio-referencia retrasa el acceso a tratamientos innovadores.', impacto: 'Acelerar el acceso a tratamientos oncológicos e innovadores', color: '#059669' },
              { titulo: 'Gestión unificada de listas de espera', detalle: 'Hoy cada CCAA gestiona su propia lista. Un paciente con 160 días de espera en Canarias podría operarse en 40 días en País Vasco. Una lista de espera nacional con derivación interterritorial eliminaría esta inequidad.', impacto: 'Reducir la espera media al nivel de las mejores CCAA (40–60 días)', color: '#8e44ad' },
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
