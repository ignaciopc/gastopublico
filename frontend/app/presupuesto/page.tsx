import PageHeader from '@/components/ui/PageHeader';
import { getUltimaEjecucion, type PartidaEjecucion } from '@/lib/igae/consultas';
import { IGAE_EXTRACTO_PAGINA } from '@/lib/sync/igae';
import { EJERCICIOS_PRORROGADOS, ULTIMO_EJERCICIO_APROBADO } from '@/components/ui/EjerciciosProrrogados';

export const revalidate = 3600;

// useGrouping 'always': separador de miles también en cifras de 4 dígitos (7.487,2), para alinear tablas.
const NUM_1 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1, useGrouping: 'always' } as Intl.NumberFormatOptions);

// La IGAE deja sin tasa («-») algunas variaciones extremas; aquí se omiten las superiores al 500 %.
const VARIACION_MAXIMA = 500;

const millones = (euros: number) => `${NUM_1.format(euros / 1e6)} M€`;
const milesDeMillones = (euros: number) => NUM_1.format(euros / 1e9);
const pct = (parte: number, total: number) => (total > 0 ? `${NUM_1.format((parte / total) * 100)} %` : '—');
const variacion = (actual: number, anterior: number | null) => {
  if (anterior === null || anterior <= 0) return '—';
  const v = ((actual - anterior) / anterior) * 100;
  if (Math.abs(v) >= VARIACION_MAXIMA) return '—';
  return `${v > 0 ? '+' : ''}${NUM_1.format(v)} %`;
};

const th: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'right', fontSize: 10.5, fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)',
  borderBottom: '1px solid var(--card-border)', fontFamily: 'var(--font-mono), monospace',
  whiteSpace: 'nowrap',
};
const td: React.CSSProperties = {
  padding: '9px 12px', textAlign: 'right', fontSize: 13, borderBottom: '1px solid var(--rule)',
  fontFamily: 'var(--font-mono), monospace', whiteSpace: 'nowrap',
};

function TablaPartidas({ titulo, partidas, total, ejercicio }: {
  titulo: string; partidas: PartidaEjecucion[]; total: PartidaEjecucion; ejercicio: number;
}) {
  return (
    <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
        <thead>
          <tr>
            <th style={{ ...th, textAlign: 'left' }}>{titulo}</th>
            <th style={th}>Créditos definitivos</th>
            <th style={th}>Obligaciones reconocidas</th>
            <th style={th}>% ejecutado</th>
            <th style={th}>Oblig. mismo periodo {ejercicio - 1}</th>
            <th style={th}>Variación</th>
          </tr>
        </thead>
        <tbody>
          {partidas.map(p => (
            <tr key={p.nombre}>
              <td style={{ ...td, textAlign: 'left', fontFamily: 'inherit', whiteSpace: 'normal' }}>{p.nombre}</td>
              <td style={td}>{millones(p.creditosDefinitivos)}</td>
              <td style={td}>{millones(p.obligacionesReconocidas)}</td>
              <td style={td}>{pct(p.obligacionesReconocidas, p.creditosDefinitivos)}</td>
              <td style={td}>{p.obligacionesAnterior === null ? '—' : millones(p.obligacionesAnterior)}</td>
              <td style={td}>{variacion(p.obligacionesReconocidas, p.obligacionesAnterior)}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 700 }}>
            <td style={{ ...td, textAlign: 'left', fontFamily: 'inherit' }}>Total</td>
            <td style={td}>{millones(total.creditosDefinitivos)}</td>
            <td style={td}>{millones(total.obligacionesReconocidas)}</td>
            <td style={td}>{pct(total.obligacionesReconocidas, total.creditosDefinitivos)}</td>
            <td style={td}>{total.obligacionesAnterior === null ? '—' : millones(total.obligacionesAnterior)}</td>
            <td style={td}>{variacion(total.obligacionesReconocidas, total.obligacionesAnterior)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function NoDisponible() {
  return (
    <section style={{ padding: '64px 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 12px' }}>Datos no disponibles</h2>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted-strong)', margin: '0 0 16px' }}>
          No se ha podido leer la ejecución presupuestaria cargada desde la IGAE.
        </p>
        <a href={IGAE_EXTRACTO_PAGINA} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: 13 }}>
          Extracto de ejecución del Presupuesto (IGAE) ↗
        </a>
      </div>
    </section>
  );
}

export default async function PresupuestoPage() {
  const datos = await getUltimaEjecucion();

  if (!datos) {
    return (
      <>
        <PageHeader
          eyebrow="Ejecución presupuestaria · IGAE"
          title="Presupuesto del Estado"
          lede="Ejecución del Presupuesto de gastos del Estado según el extracto mensual de la IGAE."
        />
        <NoDisponible />
      </>
    );
  }

  const { ejercicio, total } = datos;
  const prorrogado = EJERCICIOS_PRORROGADOS.includes(ejercicio);
  const maxMensual = Math.max(...datos.totalesMensuales.map(m => m.obligacionesReconocidas), 1);

  const kpis = [
    { k: 'Créditos definitivos', v: `${milesDeMillones(total.creditosDefinitivos)} mM€`, s: 'Crédito disponible tras modificaciones' },
    { k: 'Obligaciones reconocidas', v: `${milesDeMillones(total.obligacionesReconocidas)} mM€`, s: `${variacion(total.obligacionesReconocidas, total.obligacionesAnterior)} vs. mismo periodo ${ejercicio - 1}` },
    { k: 'Grado de ejecución', v: pct(total.obligacionesReconocidas, total.creditosDefinitivos), s: 'Obligaciones / créditos definitivos' },
    { k: 'Pagos realizados', v: `${milesDeMillones(total.pagosRealizados)} mM€`, s: `${pct(total.pagosRealizados, total.obligacionesReconocidas)} de las obligaciones` },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Ejecución presupuestaria · IGAE"
        title={`Presupuesto del Estado: ejecución hasta el ${datos.etiquetaCorte}`}
        lede={`Gasto acumulado del Presupuesto del Estado (Administración General del Estado) desde el 1 de enero, por capítulos y por secciones, según el extracto mensual de la IGAE.${prorrogado ? ` En ${ejercicio} rige el presupuesto de ${ULTIMO_EJERCICIO_APROBADO} prorrogado.` : ''}`}
        meta={[{ k: 'Ejercicio', v: String(ejercicio) }, { k: 'Corte', v: datos.fechaCorte.split('-').reverse().join('/') }]}
      />

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {kpis.map(k => (
            <div key={k.k} style={{ border: '1px solid var(--card-border)', borderRadius: 4, padding: 18, background: 'var(--card)' }}>
              <div className="eyebrow-muted" style={{ marginBottom: 8 }}>{k.k}</div>
              <div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{k.v}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{k.s}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', margin: '10px 0 0' }}>
          mM€ = miles de millones de euros. Importes acumulados hasta el {datos.etiquetaCorte}.
        </p>
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Por capítulos</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>En qué tipo de gasto</h2>
        <TablaPartidas titulo="Capítulo" partidas={datos.capitulos} total={total} ejercicio={ejercicio} />
      </section>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 0' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Por secciones</div>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 6px' }}>Quién lo gasta</h2>
        <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: '0 0 16px', maxWidth: 820, lineHeight: 1.6 }}>
          Las secciones corresponden a ministerios, órganos constitucionales y partidas como la deuda
          pública, las clases pasivas o la financiación de comunidades autónomas y entidades locales.
          Ordenadas por obligaciones reconocidas. Las variaciones respecto al año anterior pueden
          reflejar cambios en la estructura de los ministerios o en la imputación de partidas; las
          superiores al {VARIACION_MAXIMA} % no se muestran (—).
        </p>
        <TablaPartidas titulo="Sección" partidas={datos.secciones} total={total} ejercicio={ejercicio} />
      </section>

      {datos.totalesMensuales.length > 1 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 0' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Evolución en {ejercicio}</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 16px' }}>Obligaciones reconocidas acumuladas por mes</h2>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, padding: 18, background: 'var(--card)' }}>
            {datos.totalesMensuales.map(m => (
              <div key={m.mes} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 110px', alignItems: 'center', gap: 12, padding: '4px 0' }}>
                <span style={{ fontSize: 12, color: 'var(--muted-strong)', textTransform: 'capitalize' }}>
                  {new Date(Date.UTC(ejercicio, m.mes - 1, 1)).toLocaleDateString('es-ES', { month: 'long', timeZone: 'UTC' })}
                </span>
                <div style={{ height: 10, background: 'var(--rule)', borderRadius: 2 }}>
                  <div style={{ width: `${(m.obligacionesReconocidas / maxMensual) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
                </div>
                <span className="mono" style={{ fontSize: 12, textAlign: 'right' }}>{milesDeMillones(m.obligacionesReconocidas)} mM€</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, fontSize: 13, lineHeight: 1.6, color: 'var(--muted-strong)' }}>
          <div>
            <div className="eyebrow-muted" style={{ marginBottom: 8 }}>Qué significa cada columna</div>
            <p style={{ margin: '0 0 6px' }}><strong>Créditos definitivos:</strong> importe máximo que se puede gastar, tras las modificaciones aprobadas durante el año.</p>
            <p style={{ margin: '0 0 6px' }}><strong>Obligaciones reconocidas:</strong> gasto ya realizado y reconocido como deuda de la Administración (el servicio se ha prestado o la entrega se ha producido).</p>
            <p style={{ margin: 0 }}><strong>Pagos realizados:</strong> parte de esas obligaciones que ya se ha pagado.</p>
          </div>
          <div>
            <div className="eyebrow-muted" style={{ marginBottom: 8 }}>Fuente</div>
            <p style={{ margin: '0 0 6px' }}>
              IGAE, <a href={IGAE_EXTRACTO_PAGINA} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Extracto de ejecución del Presupuesto. Administración General del Estado</a>,
              cuadros «Estado de ejecución. Secciones» y «Estado de ejecución. Capítulos» (fichero {datos.fichero}).
            </p>
            <p style={{ margin: 0 }}>
              La IGAE publica los importes en miles de euros; aquí se muestran en millones. La comparación
              con {ejercicio - 1} usa el mismo periodo que publica la IGAE en ese extracto. Al cargar cada fichero
              se comprueba que la suma de partidas coincide con el total oficial.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
