import Link from 'next/link';

export const revalidate = 86400;

const FUENTES = [
  {
    nombre: 'IGAE — Intervención General de la Administración del Estado',
    url: 'https://www.igae.pap.hacienda.gob.es/',
    dato: 'Ejecución presupuestaria mensual por sección y capítulo',
    frecuencia: 'Mensual · sincronización diaria a las 06:00 UTC',
    donde: '/presupuesto, home',
  },
  {
    nombre: 'PLACE — Plataforma de Contratación del Sector Público',
    url: 'https://contrataciondelestado.es/',
    dato: 'Licitaciones y adjudicaciones publicadas en el feed oficial',
    frecuencia: 'Continua · sincronización diaria a las 06:00 UTC',
    donde: '/contratos, home',
  },
  {
    nombre: 'BDNS — Base de Datos Nacional de Subvenciones',
    url: 'https://www.pap.hacienda.gob.es/bdnstrans/',
    dato: 'Concesiones de subvenciones y ayudas públicas',
    frecuencia: 'Continua · sincronización diaria a las 06:00 UTC',
    donde: '/subvenciones',
  },
  {
    nombre: 'INE — Instituto Nacional de Estadística',
    url: 'https://www.ine.es/',
    dato: 'EPA, padrón municipal, estadística de migraciones',
    frecuencia: 'Trimestral o anual según operación',
    donde: '/paro, /inmigracion, home',
  },
  {
    nombre: 'Banco de España',
    url: 'https://www.bde.es/',
    dato: 'Deuda pública según el Protocolo de Déficit Excesivo',
    frecuencia: 'Trimestral',
    donde: '/deuda, home',
  },
  {
    nombre: 'Eurostat',
    url: 'https://ec.europa.eu/eurostat',
    dato: 'Deuda, déficit y paro comparados entre Estados miembros (SEC 2010)',
    frecuencia: 'Trimestral y anual',
    donde: 'Tablas comparativas de home y /gobierno',
  },
  {
    nombre: 'BOE — Boletín Oficial del Estado',
    url: 'https://www.boe.es/',
    dato: 'Leyes de presupuestos, reales decretos de retribuciones y de estructura ministerial',
    frecuencia: 'Puntual, según publicación',
    donde: '/politicos, /gobierno',
  },
  {
    nombre: 'Portal de Transparencia',
    url: 'https://transparencia.gob.es/',
    dato: 'Altos cargos, personal eventual, retribuciones declaradas',
    frecuencia: 'Anual',
    donde: '/politicos, /gobierno',
  },
];

const NIVELES = [
  {
    etiqueta: 'OFICIAL',
    color: '#27ae60',
    titulo: 'Dato oficial',
    def: 'Cifra publicada tal cual por el organismo responsable, sin transformación por nuestra parte más allá del cambio de unidad o formato.',
    ejemplos: 'Obligaciones reconocidas por sección del IGAE · importe de adjudicación de un contrato en PLACE · retribución de un alto cargo fijada por real decreto · crédito inicial de un programa del PGE.',
  },
  {
    etiqueta: 'DERIVADO',
    color: '#2563eb',
    titulo: 'Dato derivado',
    def: 'Cálculo aritmético hecho por nosotros a partir de datos oficiales, cuyo resultado es reproducible aplicando la operación indicada a la fuente citada.',
    ejemplos: 'Tasa de ejecución (obligaciones reconocidas ÷ crédito definitivo) · gasto por habitante (gasto total ÷ población INE) · variación interanual · sumas de partidas · gasto por segundo del contador de la portada.',
  },
  {
    etiqueta: 'ESTIMACIÓN PROPIA',
    color: '#e67e22',
    titulo: 'Estimación propia',
    def: 'Cifra que requiere un supuesto no contenido en la fuente: un prorrateo, una imputación o una proyección. Va siempre marcada como tal y con el supuesto explicitado.',
    ejemplos: 'Coste del personal eventual (740 puestos × 80.000 €/año) · reparto del personal eventual por ministerio · coste de la flota aérea de uso gubernamental · gastos de representación.',
  },
];

const th: React.CSSProperties = {
  padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: 'var(--muted)', textAlign: 'left',
  borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap',
};

export default function MetodologiaPage() {
  return (
    <div>
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '52px 0 48px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Link href="/" style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>GastoPublico.es</Link>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>›</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Metodología</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 16px', color: '#ededeb' }}>
            Metodología
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', maxWidth: 760, margin: 0 }}>
            De dónde salen los datos, cada cuánto se actualizan, cómo se agregan y qué distingue
            un dato oficial de uno calculado por nosotros. Si una cifra de este sitio no encaja en
            ninguna de las tres categorías de abajo, es un error: escríbenos y la corregimos.
          </p>
        </div>
      </section>

      {/* ── CRITERIO EDITORIAL ──────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Criterio</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            Qué publicamos y qué no
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, maxWidth: 1000 }}>
            {[
              { t: 'Descripción, no interpretación', d: 'Los titulares describen qué contiene cada bloque. Cuando un dato admite comparación, se publica el término de comparación al lado en vez de un superlativo.' },
              { t: 'Toda cifra lleva fuente', d: 'Cada dato numérico o comparativo indica el organismo que lo publica y el año al que corresponde. Si no hay fuente citable, el dato no se publica.' },
              { t: 'Sin agregados sin base', d: 'No se construyen categorías de gasto que no existan en el clasificador presupuestario. Cuando una agregación es nuestra, se marca como estimación.' },
              { t: 'Los comparadores se justifican', d: 'La elección de países o períodos con los que se compara es en sí misma un argumento, así que se explicita el criterio de selección.' },
            ].map(c => (
              <div key={c.t} style={{ padding: '18px 20px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 7 }}>{c.t}</div>
                <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.6 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NIVELES DE DATO ─────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Clasificación</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Oficial, derivado o estimado
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 24px', maxWidth: 760, lineHeight: 1.6 }}>
            Las tres categorías en las que cae cualquier cifra publicada en este sitio.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {NIVELES.map(n => (
              <div key={n.etiqueta} style={{ padding: '20px 22px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 4, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                    padding: '4px 9px', borderRadius: 2,
                    border: `1px solid ${n.color}80`, color: n.color, background: `${n.color}12`,
                    fontFamily: 'var(--font-mono), monospace', whiteSpace: 'nowrap',
                  }}>{n.etiqueta}</span>
                </div>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{n.titulo}</div>
                  <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 8px', lineHeight: 1.6 }}>{n.def}</p>
                  <p style={{ fontSize: 12.5, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                    <strong>Ejemplos en este sitio:</strong> {n.ejemplos}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FUENTES ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Origen de los datos</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Fuentes y frecuencia de actualización
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 24px', maxWidth: 800, lineHeight: 1.6 }}>
            Un proceso automático sincroniza cada día a las 06:00 UTC las fuentes que exponen API o
            fichero descargable. El resto se actualiza manualmente cuando el organismo publica una
            nueva edición.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  <th style={th}>Fuente</th>
                  <th style={th}>Qué aporta</th>
                  <th style={th}>Actualización</th>
                  <th style={th}>Dónde se usa</th>
                </tr>
              </thead>
              <tbody>
                {FUENTES.map((f, i) => (
                  <tr key={f.nombre} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: '1px solid var(--rule)' }}>
                      <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                        {f.nombre} ↗
                      </a>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 12.5, color: 'var(--muted-strong)', borderBottom: '1px solid var(--rule)' }}>{f.dato}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--rule)' }}>{f.frecuencia}</td>
                    <td style={{ padding: '12px 16px', fontSize: 12, fontFamily: 'var(--font-mono), monospace', color: 'var(--muted)', borderBottom: '1px solid var(--rule)' }}>{f.donde}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CRITERIOS DE AGREGACIÓN ─────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Cálculo</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            Criterios de agregación
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 980 }}>
            {[
              { t: 'Ejercicio presupuestario', d: 'Salvo indicación expresa, el año que acompaña a una cifra es el ejercicio presupuestario, no el año natural de pago. Se distingue entre crédito inicial, crédito definitivo y obligaciones reconocidas; la etiqueta de cada tabla indica cuál se está mostrando.' },
              { t: 'Agregación por sección', d: 'El presupuesto se agrega por sección presupuestaria, que es la unidad del clasificador orgánico del IGAE. No se reagrupan secciones en categorías temáticas propias.' },
              { t: 'Tasa de ejecución', d: 'Obligaciones reconocidas divididas entre crédito definitivo del mismo ejercicio y sección. Una tasa superior al 100% indica ampliación de crédito durante el ejercicio.' },
              { t: 'Contadores en tiempo real', d: 'Los contadores de la portada extrapolan linealmente el último dato anual publicado al segundo actual. Son una representación del ritmo medio, no una medición en vivo: el gasto real no se distribuye de forma uniforme a lo largo del año.' },
              { t: 'Comparación entre países', d: 'Solo se comparan cifras calculadas con la misma metodología. Deuda y déficit siguen el SEC 2010 y proceden de Eurostat. Los indicadores institucionales (número de ministerios) proceden de los organigramas oficiales de cada país y no tienen definición armonizada, lo que se advierte en la tabla.' },
              { t: 'Prórroga presupuestaria', d: 'El último PGE aprobado por las Cortes es el del ejercicio 2023 (Ley 31/2022, de 23 de diciembre). Los ejercicios posteriores se rigen por prórroga automática conforme al art. 134.4 CE. Los contadores de prórroga cuentan desde el 1 de enero de 2024.' },
            ].map(c => (
              <div key={c.t} style={{ padding: '16px 20px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{c.t}</div>
                <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.6 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LÍMITES CONOCIDOS ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Transparencia sobre los límites</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            Limitaciones conocidas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14, maxWidth: 1000 }}>
            {[
              { t: 'Cobertura estatal, no consolidada', d: 'Los datos del IGAE cubren la Administración General del Estado. El gasto de comunidades autónomas y entidades locales no está incluido salvo mención expresa, por lo que las cifras no representan el gasto público total de España.' },
              { t: 'Desfase de publicación', d: 'La ejecución presupuestaria se publica con semanas de retraso respecto al mes al que se refiere. El último mes disponible puede revisarse al alza o a la baja en ediciones posteriores.' },
              { t: 'Datos de contexto no presupuestarios', d: 'Indicadores demográficos, laborales y de asilo proceden de operaciones estadísticas distintas del presupuesto, con su propia metodología y calendario. No son directamente comparables con las cifras de gasto.' },
              { t: 'Agregaciones que no publicamos', d: 'No publicamos totales de gasto por colectivo de población, porque los servicios universales se presupuestan por residente sin distinguir origen y cualquier reparto exigiría supuestos que la fuente no sostiene.' },
            ].map(c => (
              <div key={c.t} style={{ padding: '18px 20px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 7 }}>{c.t}</div>
                <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.6 }}>{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORRECCIONES ────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0 56px', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, maxWidth: 1000 }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>Correcciones</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0, lineHeight: 1.65 }}>
                Cuando se detecta un error en una cifra publicada, se corrige y se indica el cambio.
                Un dato sin fuente verificable se retira aunque resulte plausible: la ausencia de
                fuente es motivo suficiente para no publicarlo.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>Datos abiertos</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 12px', lineHeight: 1.65 }}>
                Todo lo que se publica aquí está disponible en CSV y JSON, con API REST documentada
                y licencia CC-BY 4.0.
              </p>
              <Link href="/datasets" style={{ fontSize: 13.5, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Ir a datasets y API →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
