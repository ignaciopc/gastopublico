import Link from 'next/link';

export const revalidate = 86400;

// «Dónde se usa» refleja las secciones existentes tras retirar /gobierno, /politicos, /paro, etc.
const FUENTES = [
  {
    nombre: 'PLACSP — Plataforma de Contratación del Sector Público',
    url: 'https://contrataciondelestado.es/',
    dato: 'Feed de licitaciones publicadas mediante mecanismos de agregación, excluidos contratos menores',
    frecuencia: 'Sincronización automática diaria (06:00 UTC)',
    donde: '/contratos, portada',
  },
  {
    nombre: 'BDNS — Base de Datos Nacional de Subvenciones',
    url: 'https://www.pap.hacienda.gob.es/bdnstrans/',
    dato: 'Concesiones de subvenciones (copia parcial: las últimas publicadas cada día)',
    frecuencia: 'Sincronización automática diaria (06:00 UTC)',
    donde: '/subvenciones',
  },
  {
    nombre: 'IGAE — Intervención General de la Administración del Estado',
    url: 'https://www.igae.pap.hacienda.gob.es/',
    dato: 'Contabilidad nacional de las AAPP (gasto, intereses) y clasificación funcional del gasto (COFOG). La ejecución presupuestaria mensual del Estado no está cargada todavía',
    frecuencia: 'Actualización manual cuando se publica',
    donde: 'portada, /deuda, /impuestometro, /presupuesto (sin datos)',
  },
  {
    nombre: 'Banco de España',
    url: 'https://www.bde.es/',
    dato: 'Deuda de las AAPP según el Protocolo de Déficit Excesivo, total y por comunidad autónoma',
    frecuencia: 'Actualización manual cuando se publica',
    donde: '/deuda, portada',
  },
  {
    nombre: 'Eurostat',
    url: 'https://ec.europa.eu/eurostat',
    dato: 'Deuda y saldo de las AAPP de los Estados miembros (SEC 2010)',
    frecuencia: 'Actualización manual cuando se publica',
    donde: '/deuda, portada',
  },
  {
    nombre: 'AEAT — Agencia Tributaria',
    url: 'https://sede.agenciatributaria.gob.es/',
    dato: 'Recaudación tributaria anual y algoritmo de retenciones del IRPF',
    frecuencia: 'Actualización manual cuando se publica',
    donde: 'portada, /impuestometro',
  },
  {
    nombre: 'INE — Instituto Nacional de Estadística',
    url: 'https://www.ine.es/',
    dato: 'Población residente (denominador de las cifras por habitante)',
    frecuencia: 'Actualización manual cuando se publica',
    donde: 'portada, /deuda',
  },
  {
    nombre: 'BOE — Boletín Oficial del Estado',
    url: 'https://www.boe.es/',
    dato: 'Leyes de Presupuestos Generales del Estado y normas de cotización',
    frecuencia: 'Actualización manual cuando se publica',
    donde: 'portada (prórroga presupuestaria), /impuestometro',
  },
];

const NIVELES = [
  {
    etiqueta: 'OFICIAL',
    color: '#27ae60',
    titulo: 'Dato oficial',
    def: 'Cifra publicada tal cual por el organismo responsable, sin transformación por nuestra parte más allá del cambio de unidad o formato.',
    ejemplos: 'Deuda PDE del Banco de España · presupuesto base de licitación de un contrato en PLACSP · importe de una concesión en la BDNS.',
  },
  {
    etiqueta: 'DERIVADO',
    color: '#2563eb',
    titulo: 'Dato derivado',
    def: 'Cálculo aritmético hecho por nosotros a partir de datos oficiales, cuyo resultado es reproducible aplicando la operación indicada a la fuente citada.',
    ejemplos: 'Gasto o deuda por habitante (importe ÷ población INE) · variación interanual · media por segundo (importe anual ÷ 31.536.000 s) · suma, media y reparto de las concesiones de la BDNS sincronizadas.',
  },
  {
    etiqueta: 'ESTIMACIÓN PROPIA',
    color: '#e67e22',
    titulo: 'Estimación propia',
    def: 'Cifra que requiere un supuesto no contenido en la fuente: un prorrateo, una imputación o una proyección. Va siempre marcada como tal y con el supuesto explicitado.',
    ejemplos: 'Contadores en marcha de la portada y de /deuda, que extrapolan linealmente el último dato oficial al segundo actual.',
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
            un dato oficial de uno calculado por nosotros. Una cifra de este sitio que no encaje en
            ninguna de las tres categorías de abajo es un error y debe corregirse o retirarse.
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
            Un proceso automático sincroniza cada día a las 06:00 UTC los contratos (PLACSP) y las
            subvenciones (BDNS). El resto de cifras se actualiza manualmente cuando el organismo
            publica una nueva edición; cada bloque indica la fecha o el periodo del dato.
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
              { t: 'Agregación por sección', d: 'El presupuesto se agrega por sección presupuestaria, la unidad de la clasificación orgánica de los Presupuestos Generales del Estado. No se reagrupan secciones en categorías temáticas propias.' },
              { t: 'Tasa de ejecución', d: 'Obligaciones reconocidas divididas entre crédito definitivo del mismo ejercicio y sección.' },
              { t: 'Contratos y subvenciones', d: 'Son copias parciales que se amplían cada día: los totales, medias y porcentajes se calculan sobre las filas sincronizadas y se indica cuántas son. En contratos, el importe es el presupuesto base de licitación sin impuestos, no el importe adjudicado.' },
              { t: 'Contadores (estimación)', d: 'Los contadores en marcha de la portada y de /deuda extrapolan linealmente el último dato oficial con un ritmo medio calculado a partir de datos oficiales; cada contador indica su cálculo. No son una medición en vivo: el gasto y la deuda no evolucionan de forma uniforme a lo largo del año.' },
              { t: 'Comparación entre países', d: 'Solo se comparan cifras calculadas con la misma metodología. Deuda y déficit siguen el SEC 2010 y proceden de Eurostat.' },
              { t: 'Prórroga presupuestaria', d: 'El último PGE aprobado por las Cortes es el del ejercicio 2023 (Ley 31/2022, de 23 de diciembre). Desde 2024 se aplica su prórroga automática conforme al art. 134.4 de la Constitución.' },
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
              { t: 'Perímetros distintos', d: 'La ejecución presupuestaria cubre el Estado; las cifras de contabilidad nacional (IGAE, Banco de España, Eurostat) cubren el conjunto de las Administraciones Públicas. No son directamente comparables y cada bloque indica su perímetro.' },
              { t: 'Desfase de publicación', d: 'Las fuentes publican con retraso respecto al periodo al que se refieren y pueden revisar sus cifras en ediciones posteriores.' },
              { t: 'Copias parciales', d: 'Contratos y subvenciones no son el total publicado por PLACSP o la BDNS: son las filas que el proceso diario ha descargado desde que empezó a funcionar.' },
              { t: 'Presupuesto del Estado sin datos', d: 'La sección /presupuesto no muestra cifras: las que había no procedían de la IGAE. Se publicarán cuando se carguen desde la fuente oficial.' },
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
                Cuando se detecta un error en una cifra publicada, se corrige o se retira.
                Un dato sin fuente verificable se retira aunque resulte plausible: la ausencia de
                fuente es motivo suficiente para no publicarlo.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px' }}>Datos abiertos</h3>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 12px', lineHeight: 1.65 }}>
                Los datos de contratos y subvenciones están disponibles en JSON a través de los
                endpoints listados en la página de datos.
              </p>
              <Link href="/datasets" style={{ fontSize: 13.5, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Ir a datos y API →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
