import Link from 'next/link';
import { fetchIgaeBudget } from '@/lib/data/igae';
import { summarizeBudget } from '@/lib/transformers/budget';
import { supabase } from '@/lib/supabase';
import { CURRENT_EJERCICIO } from '@/lib/constants';
import { formatEUR } from '@/lib/formatters';
import type { ContratoRow } from '@/lib/supabase';
import type { Contract } from '@/lib/types';
import EditorialTicker from '@/components/ui/EditorialTicker';
import LiveSpendCounter from '@/components/ui/LiveSpendCounter';
import DeudaCounter from '@/components/ui/DeudaCounter';
import AlertaSubscribeForm from '@/components/ui/AlertaSubscribeForm';
import ProrrogaCounter from '@/components/ui/ProrrogaCounter';
import EjerciciosProrrogados from '@/components/ui/EjerciciosProrrogados';
import FondosUECountdown from '@/components/ui/FondosUECountdown';

export const revalidate = 3600;

// Ordenado por magnitud descendente (criterio neutro). La deuda sobre PIB va al
// final por expresarse en porcentaje y no en euros.
const MAXIMOS = [
  { concepto: 'Recaudación tributaria 2024', valor: '294.734 M€', delta: '+8,4% vs 2023', url: 'https://www.agenciatributaria.es' },
  { concepto: 'Gasto en pensiones 2024', valor: '201.500 M€', delta: '+10,9% vs 2023', url: 'https://www.seg-social.es' },
  { concepto: 'Intereses de la deuda', valor: '39.900 M€', delta: '+38% en 2 años', url: 'https://www.tesoro.es' },
  { concepto: 'Coste de altos cargos', valor: '678 M€', delta: '+12,1% vs 2023', url: 'https://www.hacienda.gob.es' },
  { concepto: 'Subvenciones a partidos políticos', valor: '82,4 M€', delta: '+5,2% vs 2023', url: 'https://www.interior.gob.es' },
  { concepto: 'Deuda pública s/ PIB', valor: '108,1%', delta: '+2,1 pp vs 2023', url: 'https://www.bde.es' },
];

const FEATURES = [
  { tag: 'Calculadora', title: 'Impuestómetro', desc: 'Introduce tu sueldo bruto y descubre cuánto pagas al año, a qué se destina cada euro y en qué fecha trabajas exclusivamente para ti.', cta: 'Calcular mis impuestos', href: '/impuestometro' },
  { tag: 'Dashboard', title: 'Presupuesto del Estado', desc: 'Ejecución mensual del PGE por ministerio. Comparador histórico 2022–2024 con datos IGAE actualizados.', cta: 'Ver presupuesto', href: '/presupuesto' },
  { tag: 'Tiempo real', title: 'Contratos públicos', desc: 'Feed de licitaciones y adjudicaciones del Estado vía PLACE. Filtros por importe, organismo y adjudicatario.', cta: 'Ver contratos', href: '/contratos' },
  { tag: 'Open data', title: 'Datasets y API', desc: 'Toda la información descargable en CSV y JSON. API REST documentada. Licencia CC-BY 4.0.', cta: 'Explorar datos', href: '/datasets' },
];

const PARTIDA_COLORS = ['var(--accent)', '#8a1428', '#6b6b66', '#3a3a35', '#1a1a18'];

const GASTO_MENSUAL = [
  { mes: 'Ene', pct: 6.8, nota: 'Inicio lento — liquidaciones año anterior' },
  { mes: 'Feb', pct: 7.2, nota: '' },
  { mes: 'Mar', pct: 8.0, nota: '' },
  { mes: 'Abr', pct: 8.1, nota: '' },
  { mes: 'May', pct: 8.4, nota: '' },
  { mes: 'Jun', pct: 8.8, nota: 'Cierre 1er semestre' },
  { mes: 'Jul', pct: 8.3, nota: '' },
  { mes: 'Ago', pct: 7.5, nota: 'Agosto — mínimo actividad' },
  { mes: 'Sep', pct: 8.6, nota: '' },
  { mes: 'Oct', pct: 8.7, nota: '' },
  { mes: 'Nov', pct: 9.2, nota: '' },
  { mes: 'Dic', pct: 10.4, nota: 'Efecto fin de año — pico máximo' },
];

async function getData() {
  const [rows, contratosResult] = await Promise.allSettled([
    fetchIgaeBudget(CURRENT_EJERCICIO),
    supabase.from('contratos').select('*').order('fecha_publicacion', { ascending: false }).limit(5),
  ]);

  const budgetRows = rows.status === 'fulfilled' ? rows.value : [];
  const summary = summarizeBudget(budgetRows, CURRENT_EJERCICIO);

  const contratos: Contract[] = contratosResult.status === 'fulfilled' && contratosResult.value.data
    ? (contratosResult.value.data as ContratoRow[]).map(r => ({
        id: r.id, titulo: r.titulo, organoContratante: r.organo_contratante,
        tipo: r.tipo, importe: Number(r.importe), estado: r.estado,
        fechaPublicacion: r.fecha_publicacion,
        fechaAdjudicacion: r.fecha_adjudicacion ?? undefined,
        adjudicatario: r.adjudicatario ?? undefined,
        enlace: r.enlace,
      }))
    : [];

  return { summary, contratos };
}

// ── Mini stat for the speed strip ──────────────────────────────────────────
function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '10px 20px', flex: 1, borderRight: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono), monospace', marginBottom: 6,
      }}>{label}</div>
      <div style={{
        fontFamily: 'var(--font-mono), monospace', fontSize: 22,
        fontWeight: 600, letterSpacing: '-0.02em', color: '#fff',
      }}>{value}</div>
    </div>
  );
}

export default async function HomePage() {
  const { summary, contratos } = await getData();
  const top5 = summary.bySeccion.slice(0, 5);
  const maxVal = top5[0]?.obligacionesReconocidas ?? 1;

  return (
    <div>
      {/* ── TICKER — encima del hero, igual que en Claude Design ────────── */}
      <EditorialTicker />

      {/* ── HERO — dark counter ─────────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', color: '#ededeb', padding: '56px 0 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          {/* badge + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-mono), monospace', fontSize: 10,
              fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
              padding: '4px 8px', border: '1px solid #ef4d68', borderRadius: 3,
              color: '#ef4d68',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4d68', animation: 'pulse 1.6s ease-in-out infinite', display: 'inline-block' }} />
              EN DIRECTO · IGAE
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono), monospace',
            }}>
              Edición de hoy · {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }).toUpperCase()}
            </span>
          </div>

          {/* headline + counter */}
          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 76px)',
            lineHeight: 0.98,
            letterSpacing: '-0.035em',
            fontWeight: 800,
            margin: '0 0 20px',
            maxWidth: 1100,
            color: '#ededeb',
          }}>
            El Estado lleva gastados<br />
            <LiveSpendCounter /><br />
            en lo que va de año.
          </h1>

          {/* lede */}
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.6)',
            maxWidth: 720, margin: '0 0 28px',
          }}>
            18.490 € por segundo. 1.597 millones por día. Esta web publica la ejecución
            presupuestaria, la contratación pública y las subvenciones del Estado español,
            partida a partida, a partir de fuentes oficiales actualizadas a diario.
          </p>

          {/* Deuda en tiempo real */}
          <div style={{
            marginBottom: 28,
            padding: '14px 20px',
            border: '1px solid rgba(239,77,104,0.25)',
            borderRadius: 4,
            background: 'rgba(239,77,104,0.05)',
            display: 'inline-flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono), monospace' }}>
              Deuda pública ahora mismo
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#ef4d68', fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>
              <DeudaCounter />
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono), monospace' }}>+1.515 €/seg</span>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/impuestometro" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 22px', borderRadius: 4, fontSize: 14, fontWeight: 700,
              background: '#ef4d68', color: '#fff', border: '1px solid #ef4d68',
              textDecoration: 'none', letterSpacing: '0.02em',
              transition: 'background 0.15s',
            }}>
              Calcula lo que pagas tú →
            </Link>
            <Link href="/presupuesto" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 22px', borderRadius: 4, fontSize: 14, fontWeight: 700,
              background: 'transparent', color: '#ededeb',
              border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none',
              letterSpacing: '0.02em',
            }}>
              Ver el presupuesto completo
            </Link>
          </div>

          {/* speed stats strip */}
          <div style={{
            marginTop: 48,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            <MiniStat label="Por segundo" value="18.490 €" />
            <MiniStat label="Por minuto" value="1,1 M€" />
            <MiniStat label="Por hora" value="66,5 M€" />
            <div style={{ padding: '10px 20px', flex: 1 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono), monospace', marginBottom: 6,
              }}>Por día</div>
              <div style={{
                fontFamily: 'var(--font-mono), monospace', fontSize: 22,
                fontWeight: 600, letterSpacing: '-0.02em', color: '#fff',
              }}>1.597 M€</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIN PRESUPUESTO DESDE 2018 ──────────────────────────────────── */}
      <section style={{ background: '#0f0f12', color: '#ededeb', padding: '52px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Ejecución presupuestaria</span>
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 14px' }}>
                España afronta {new Date().getFullYear()} con los presupuestos<br />de 2023 prorrogados por{' '}
                <EjerciciosProrrogados style={{ color: '#ef4d68' }} />er año consecutivo.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', maxWidth: 520 }}>
                El último PGE aprobado por las Cortes fue el de 2023 (
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Ley 31/2022, de 23 de diciembre</strong>).
                Los ejercicios 2024, 2025 y 2026 se rigen por prórroga automática conforme al
                art. 134.4 CE. En la última década, siete ejercicios han comenzado en situación
                de prórroga: 2017, 2018, 2019, 2020, 2024, 2025 y 2026.
              </p>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', margin: '0 0 18px', fontFamily: 'var(--font-mono), monospace' }}>
                Fuente: BOE · Ministerio de Hacienda (SEPG)
              </p>
              <Link href="/gobierno" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px',
                borderRadius: 4, fontSize: 13, fontWeight: 700,
                border: '1px solid rgba(255,255,255,0.2)', color: '#ededeb',
                textDecoration: 'none', letterSpacing: '0.02em',
              }}>
                Ver todos los datos del Gobierno →
              </Link>
            </div>
            <div>
              <ProrrogaCounter />
              <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { val: '22', label: 'ministerios (media UE: 14)' },
                  { val: '740', label: 'puestos de asesor (personal eventual)' },
                  { val: '128.500 M€', label: 'fondos UE sin ejecutar' },
                ].map(k => (
                  <div key={k.label} style={{ flex: 1, minWidth: 120 }}>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: '#ededeb', letterSpacing: '-0.02em' }}>{k.val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4, lineHeight: 1.4 }}>{k.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FONDOS UE CUENTA ATRÁS ──────────────────────────────────────── */}
      <section style={{ background: '#0a0a0d', padding: '48px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '4px 10px', border: '1px solid rgba(239,77,104,0.4)', borderRadius: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Mecanismo de Recuperación y Resiliencia</span>
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 14px' }}>
                Fondos Next Generation EU:{' '}
                <span style={{ color: '#ef4d68' }}>21,4% ejecutado</span>{' '}
                a 20 meses del cierre.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', maxWidth: 520 }}>
                El{' '}
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Reglamento (UE) 2021/241</strong>{' '}
                fija el 31 de agosto de 2026 como fecha límite para la ejecución. España tiene asignados
                163.500 M€ para el período 2021–2026, de los que ha ejecutado en proyectos el{' '}
                <strong style={{ color: '#ef4d68' }}>21,4%</strong>.
                El reglamento no contempla prórroga del plazo.
              </p>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', margin: '0 0 18px', fontFamily: 'var(--font-mono), monospace' }}>
                Fuente: Comisión Europea · Ministerio de Hacienda (informe PERTE 2024)
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { val: '163.500 M€', label: 'Asignación total 2021–2026' },
                  { val: '128.500 M€', label: 'Sin ejecutar (riesgo caducidad)' },
                  { val: '21,4%', label: 'Ejecutado en proyectos reales' },
                ].map(k => (
                  <div key={k.label}>
                    <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: '#ededeb', letterSpacing: '-0.02em' }}>{k.val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 3, lineHeight: 1.4 }}>{k.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <FondosUECountdown />
          </div>
        </div>
      </section>

      {/* ── SOBRE ESTA WEB ──────────────────────────────────────────────── */}
      <section style={{ padding: '52px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 1px minmax(0,1fr) 1px minmax(0,1fr)', gap: '0 36px', alignItems: 'start' }}>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 32, height: 32, borderRadius: 6, background: '#ef4d68', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📊</span>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Qué es esto</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
                El presupuesto del Estado, en tiempo real
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted-strong)', margin: 0 }}>
                GastoPublico.es recopila y publica los datos oficiales del gasto público español
                — presupuesto del Estado, contratos públicos y subvenciones — en un formato
                legible para cualquier ciudadano, con la fuente oficial de cada cifra
                y sin agregaciones que la fuente no sostenga.
              </p>
            </div>

            <div style={{ background: 'var(--rule)', alignSelf: 'stretch' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 32, height: 32, borderRadius: 6, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🔗</span>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>De dónde vienen los datos</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
                Fuentes oficiales del Estado
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted-strong)', margin: 0 }}>
                Datos del <strong>IGAE</strong> (Intervención General del Estado) para el presupuesto,
                la <strong>Plataforma de Contratación del Estado (PLACE)</strong> para licitaciones y
                la <strong>BDNS</strong> (Base de Datos Nacional de Subvenciones) del Ministerio de Hacienda.
                Actualizados automáticamente cada día.
              </p>
            </div>

            <div style={{ background: 'var(--rule)', alignSelf: 'stretch' }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span style={{ width: 32, height: 32, borderRadius: 6, background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>💡</span>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted)' }}>Para qué sirve</span>
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 10px', letterSpacing: '-0.01em' }}>
                Qué puedes hacer con estos datos
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted-strong)', margin: 0 }}>
                Con el <strong>Impuestómetro</strong> descubres a qué se destina cada euro que pagas en
                impuestos. Con el <strong>Presupuesto</strong> comparas ejercicios. Con los <strong>Contratos</strong>
                {' '}ves quién gana las licitaciones. Descárgalo todo en CSV o vía API.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── KPI STRIP ───────────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>IGAE · INE · Banco de España · 2024</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Indicadores principales
              </h2>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              Fuentes: IGAE / INE / BdE
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            border: '1px solid var(--card-border)', borderRadius: 4,
            background: 'var(--card)', overflow: 'hidden',
          }}>
            {[
              { label: 'Deuda pública', value: '1,64', unit: 'billones €', delta: '+47.800 M€', deltaLabel: 'vs. 2023', sub: '108,1% del PIB · media UE: 82,7%' },
              { label: 'Parados EPA', value: '11,2', unit: '%', delta: 'media UE: 5,9%', deltaLabel: 'T4 2024', sub: 'Encuesta de Población Activa · INE' },
              { label: 'Gasto público 2024', value: '583', unit: 'mM€', delta: '+6,4%', deltaLabel: 'vs. 2023', sub: '12.157 € por habitante' },
              { label: 'Intereses deuda', value: '39,9', unit: 'mM€', delta: '+38%', deltaLabel: 'en 2 años', sub: '6,8% del gasto público total' },
            ].map((k, i, arr) => (
              <div key={k.label} style={{
                padding: '26px 24px 22px',
                borderRight: i === arr.length - 1 ? 0 : '1px solid var(--card-border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span className="eyebrow-muted">{k.label}</span>
                  <span className="mono" style={{
                    fontSize: 10, color: 'var(--muted)', background: 'var(--background)',
                    padding: '2px 6px', borderRadius: 2, border: '1px solid var(--card-border)',
                  }}>0{i + 1}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 8 }}>
                  <span className="mono" style={{ fontSize: 38, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }}>{k.value}</span>
                  <span className="mono" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>{k.unit}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted-strong)' }}>{k.delta}</span>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{k.deltaLabel}</span>
                </div>
                <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--muted-strong)', paddingTop: 10, borderTop: '1px solid var(--rule)' }}>
                  {k.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DÉFICIT CRÓNICO ─────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat / AIReF · 2008–2024</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                17 ejercicios consecutivos en déficit
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
                El último ejercicio que España cerró con superávit fue 2007. Déficit en porcentaje del PIB,
                metodología SEC 2010.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Déficit acumulado 2008–2024</div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', color: 'var(--bad)', letterSpacing: '-0.02em' }}>~1,1 billones €</div>
            </div>
          </div>
          {/* Mini bar chart */}
          {(() => {
            const data = [
              { y: 2008, v: 4.4 }, { y: 2009, v: 11.0 }, { y: 2010, v: 9.4 },
              { y: 2011, v: 9.4 }, { y: 2012, v: 10.5 }, { y: 2013, v: 6.9 },
              { y: 2014, v: 5.9 }, { y: 2015, v: 5.1 }, { y: 2016, v: 4.5 },
              { y: 2017, v: 3.0 }, { y: 2018, v: 2.5 }, { y: 2019, v: 2.8 },
              { y: 2020, v: 10.1 }, { y: 2021, v: 6.9 }, { y: 2022, v: 4.8 },
              { y: 2023, v: 3.5 }, { y: 2024, v: 3.1 },
            ];
            const max = 11.0;
            return (
              <>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120, borderBottom: '1px solid var(--rule)', paddingBottom: 6 }}>
                  {data.map(d => {
                    const h = Math.round((d.v / max) * 100);
                    const big = d.v > 5;
                    return (
                      <div key={d.y} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 8.5, color: big ? 'var(--bad)' : 'var(--muted)', fontFamily: 'var(--font-mono), monospace', fontWeight: big ? 700 : 400 }}>
                          {d.v}%
                        </span>
                        <div style={{ width: '100%', height: h, background: big ? '#8a1428' : 'var(--accent)', borderRadius: '2px 2px 0 0', border: big ? '1px solid rgba(239,77,104,0.5)' : 'none' }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 5 }}>
                  {data.map(d => (
                    <div key={d.y} style={{ flex: 1, textAlign: 'center', fontSize: 8.5, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
                      {String(d.y).slice(2)}
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--muted)' }}>
                <span style={{ width: 10, height: 10, background: '#8a1428', borderRadius: 2, display: 'inline-block', border: '1px solid rgba(239,77,104,0.5)' }} /> Déficit {'>'}5% PIB
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--muted)' }}>
                <span style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: 2, display: 'inline-block' }} /> Déficit {'<'}5% PIB
              </span>
            </div>
            <Link href="/gobierno" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Ver análisis completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA EUROPA ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat · OCDE · 2024</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                España en el contexto europeo
              </h2>
            </div>
            <Link href="/gobierno" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Análisis completo →
            </Link>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Indicador', '🇪🇸 España', 'Media UE', '🇩🇪 Alemania', '🇫🇷 Francia', 'Fuente · año'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i === 0 || i === 5 ? 'left' : 'center', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { m: 'Deuda / PIB', esp: '108,1%', eu: '82,7%', de: '62,7%', fr: '110,6%', fuente: 'Eurostat · 2024' },
                  { m: 'Déficit', esp: '-3,1%', eu: '-2,9%', de: '+0,1%', fr: '-5,5%', fuente: 'Eurostat · 2024' },
                  { m: 'Paro', esp: '11,2%', eu: '5,9%', de: '3,4%', fr: '7,3%', fuente: 'Eurostat · T4 2024' },
                  { m: 'Ministerios', esp: '22', eu: '14', de: '14', fr: '15', fuente: 'Organigramas oficiales · 2024' },
                ].map((row, i) => (
                  <tr key={row.m} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 13.5, fontWeight: 600, borderBottom: '1px solid var(--rule)' }}>{row.m}</td>
                    <td style={{ padding: '11px 16px', fontSize: 14, fontFamily: 'var(--font-mono), monospace', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid var(--rule)' }}>{row.esp}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono), monospace', textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.eu}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono), monospace', textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.de}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono), monospace', textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.fr}</td>
                    <td style={{ padding: '11px 16px', fontSize: 11.5, fontFamily: 'var(--font-mono), monospace', borderBottom: '1px solid var(--rule)', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{row.fuente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '12px 0 0', lineHeight: 1.55, maxWidth: 860 }}>
            <strong>Criterio de selección de comparadores:</strong> Alemania y Francia son las dos mayores
            economías de la eurozona por PIB y, como España, están sujetas a las reglas fiscales del Pacto
            de Estabilidad y Crecimiento, por lo que sus cifras de deuda y déficit se calculan con la misma
            metodología (SEC 2010). La media UE se incluye como referencia agregada de los 27 Estados miembros.
            La selección de comparadores condiciona la lectura: los datos completos de los 27 están disponibles
            en Eurostat.
          </p>
        </div>
      </section>

      {/* ── MÁXIMOS HISTÓRICOS ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>AEAT · Seguridad Social · Tesoro · Hacienda · Interior · BdE</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Máximos históricos 2024
          </h2>
          <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: '0 0 24px' }}>
            Partidas que alcanzaron su valor más alto de la serie en 2024, ordenadas por magnitud.
            Cada concepto enlaza al organismo que publica el dato.
          </p>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            {MAXIMOS.map((row, i) => (
              <div key={row.concepto} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: i < MAXIMOS.length - 1 ? '1px solid var(--rule)' : 0,
                background: 'var(--card)',
              }}>
                {row.url ? (
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="maximos-link"
                    style={{ fontSize: 14, color: 'var(--muted-strong)', textDecoration: 'none' }}
                  >
                    {row.concepto}
                  </a>
                ) : (
                  <span style={{ fontSize: 14, color: 'var(--muted-strong)' }}>{row.concepto}</span>
                )}
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{row.valor}</span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted-strong)', fontWeight: 600, minWidth: 100, textAlign: 'right' }}>{row.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUÁNDO SE GASTA ─────────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>IGAE · Ejecución mensual 2024</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                ¿Cuándo gasta el Estado?
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: 0 }}>
                Diciembre concentra el doble de gasto que enero. El "efecto fin de año" es estructural.
              </p>
            </div>
            <Link href="/presupuesto" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Ver ejecución mensual →
            </Link>
          </div>

          {/* Bar chart mensual */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 140, marginBottom: 8 }}>
            {GASTO_MENSUAL.map((m) => {
              const maxPct = 10.4;
              const h = Math.round((m.pct / maxPct) * 100);
              const isPeak = m.pct >= 10;
              const isLow = m.pct <= 7.2;
              return (
                <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{
                    fontSize: 9, fontFamily: 'var(--font-mono), monospace', fontWeight: 700,
                    color: isPeak ? 'var(--bad)' : isLow ? 'var(--muted)' : 'var(--muted-strong)',
                  }}>{m.pct}%</span>
                  <div style={{
                    width: '100%', height: `${h}%`,
                    background: isPeak ? '#8a1428' : isLow ? 'var(--card-border)' : 'var(--accent)',
                    borderRadius: '3px 3px 0 0',
                    border: isPeak ? '1px solid rgba(239,77,104,0.4)' : 'none',
                    minHeight: 4,
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 6, borderTop: '1px solid var(--rule)', paddingTop: 6, marginBottom: 24 }}>
            {GASTO_MENSUAL.map(m => (
              <div key={m.mes} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
                {m.mes}
              </div>
            ))}
          </div>

          {/* Fechas clave */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
            {[
              { fecha: 'Día 1 de cada mes', concepto: 'Pago de pensiones', detalle: '14,5 millones de pensionistas · 12.500 M€/mes', color: 'var(--accent)' },
              { fecha: 'Último hábil del mes', concepto: 'Nóminas de funcionarios', detalle: '3,5 millones de empleados públicos · 4.800 M€/mes', color: 'var(--accent)' },
              { fecha: '1 abr – 30 jun', concepto: 'Campaña IRPF', detalle: 'El mayor ingreso del año. +94.000 M€ recaudados en 2024', color: '#2563eb' },
              { fecha: 'Sep – Nov', concepto: 'Aceleración presupuestaria', detalle: 'Las unidades gastadoras aceleran para evitar devolución del crédito', color: '#e67e22' },
              { fecha: 'Diciembre', concepto: 'Pico de gasto: "efecto fin de año"', detalle: '10,4% del gasto anual en un solo mes. Patrón repetido en toda la serie desde 2000', color: '#8a1428' },
              { fecha: '31 de diciembre', concepto: 'Cierre del ejercicio', detalle: 'El crédito no ejecutado se devuelve al Tesoro o se incorpora al año siguiente', color: 'var(--muted)' },
            ].map(ev => (
              <div key={ev.concepto} style={{ padding: '14px 16px', background: 'var(--background)', border: '1px solid var(--card-border)', borderRadius: 4, display: 'flex', gap: 12 }}>
                <div style={{ width: 3, borderRadius: 2, background: ev.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono), monospace', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 4, textTransform: 'uppercase' }}>{ev.fecha}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{ev.concepto}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>{ev.detalle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARD LINKS: INMIGRACIÓN + POLÍTICOS ─────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Más análisis</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 22px', letterSpacing: '-0.02em' }}>
            Análisis por áreas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 1, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <Link href="/inmigracion" style={{ display: 'block', padding: '28px 26px', background: 'var(--card)', textDecoration: 'none', color: 'inherit', borderRight: '1px solid var(--card-border)' }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>PGE 2024 · Partidas presupuestarias</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>Migración y asilo</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted-strong)', margin: '0 0 16px' }}>
                Las cinco partidas del PGE 2024 destinadas a acogida, asilo, integración y gestión
                de flujos migratorios, con su código de programa presupuestario y su importe.
              </p>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {[{ v: '1.492,6 M€', l: 'Suma de partidas oficiales' }, { v: '5', l: 'Programas identificados' }, { v: '2018–2024', l: 'Serie disponible' }].map(k => (
                  <div key={k.l}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{k.v}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{k.l}</div>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Ver el desglose →</span>
            </Link>
            <Link href="/politicos" style={{ display: 'block', padding: '28px 26px', background: 'var(--card)', textDecoration: 'none', color: 'inherit' }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>BOE · Portal Transparencia · 2024</div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em' }}>Retribuciones de altos cargos</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted-strong)', margin: '0 0 16px' }}>
                Retribuciones del presidente, ministros y altos cargos fijadas por real decreto.
                Personal eventual, parque móvil y pensiones de ex-presidentes. Datos del BOE y del
                Portal de Transparencia.
              </p>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                {[{ v: '678 M€', l: 'Coste total altos cargos' }, { v: '740', l: 'Puestos de personal eventual' }, { v: '96.179 €', l: 'Retribución del presidente' }].map(k => (
                  <div key={k.l}>
                    <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>{k.v}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>{k.l}</div>
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>Ver todos los datos →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TOP PARTIDAS (real IGAE) ─────────────────────────────────────── */}
      {top5.length > 0 && (
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>PGE {CURRENT_EJERCICIO} · Datos IGAE</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Los cinco mayores capítulos de gasto — PGE {CURRENT_EJERCICIO}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 24px' }}>
              Obligaciones reconocidas por sección presupuestaria. El porcentaje indica la tasa de
              ejecución: qué proporción del crédito asignado se ha ejecutado.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {top5.map((s, i) => {
                const pct = Math.round((s.obligacionesReconocidas / maxVal) * 100);
                return (
                  <div key={s.seccion} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 140px 80px', gap: 16, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--muted-strong)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.descripcion}</span>
                    <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 8, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: PARTIDA_COLORS[i], borderRadius: 2 }} />
                    </div>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                      {formatEUR(s.obligacionesReconocidas)}
                    </span>
                    <span className="mono" style={{ fontSize: 12, color: s.tasaEjecucion >= 90 ? 'var(--good)' : s.tasaEjecucion >= 70 ? 'var(--muted)' : 'var(--bad)', textAlign: 'right' }}>
                      {s.tasaEjecucion.toFixed(1)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTRATOS FEED ───────────────────────────────────────────────── */}
      {contratos.length > 0 && (
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 6 }}>Feed PLACE</div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                  Últimas licitaciones y adjudicaciones
                </h2>
              </div>
              <Link href="/contratos" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
                Ver todos →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
              {contratos.map((c, i) => (
                <a key={c.id} href={c.enlace} target="_blank" rel="noopener noreferrer" style={{
                  display: 'grid', gridTemplateColumns: '1fr 140px 160px 100px',
                  gap: 16, padding: '14px 20px', alignItems: 'center',
                  borderBottom: i < contratos.length - 1 ? '1px solid var(--rule)' : 0,
                  background: 'var(--card)', textDecoration: 'none', color: 'inherit',
                }}>
                  <span style={{ fontSize: 13.5, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.titulo}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.organoContratante}</span>
                  <span className="mono" style={{ fontSize: 13, fontWeight: 600, textAlign: 'right' }}>
                    {c.importe > 0 ? formatEUR(c.importe) : '—'}
                  </span>
                  <span className="mono" style={{
                    fontSize: 10, fontWeight: 700, padding: '3px 7px', borderRadius: 3, textAlign: 'center',
                    border: '1px solid',
                    color: c.estado === 'adjudicado' ? 'var(--good)' : c.estado === 'en_licitacion' ? 'var(--accent)' : 'var(--muted)',
                    borderColor: c.estado === 'adjudicado' ? 'var(--good)' : c.estado === 'en_licitacion' ? 'var(--accent)' : 'var(--card-border)',
                  }}>
                    {c.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── ALERTAS CTA ─────────────────────────────────────────────────── */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--rule)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 56, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 8 }}>Alertas gratuitas</div>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 14px' }}>
                Recibe un aviso cuando<br />se adjudica el próximo contrato millonario.
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--muted-strong)', margin: '0 0 20px', maxWidth: 520 }}>
                Contratos {'>'} 1 M€, subvenciones destacadas de la BDNS o un resumen cada lunes.
                Sin spam. Con un clic te das de baja.
              </p>
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {['Contratos adjudicados > 1 M€', 'Subvenciones BDNS > 500.000 €', 'Resumen semanal los lunes'].map(item => (
                  <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--muted-strong)' }}>
                    <span style={{ color: 'var(--good)', fontWeight: 700 }}>✓</span> {item}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ border: '1px solid var(--card-border)', borderRadius: 6, padding: '24px 22px', background: 'var(--card)' }}>
              <AlertaSubscribeForm compact />
              <p style={{ margin: '12px 0 0', fontSize: 11.5, color: 'var(--muted)' }}>
                ¿Quieres más opciones?{' '}
                <Link href="/alertas" style={{ color: 'var(--accent)', fontWeight: 600 }}>Ver todas las alertas →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section style={{ padding: '56px 0 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Herramientas</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
            Todo lo que contiene esta web
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <Link key={f.href} href={f.href} style={{
                display: 'block', padding: '28px 24px', background: 'var(--card)',
                borderRight: i % 2 === 0 ? '1px solid var(--card-border)' : 0,
                textDecoration: 'none', color: 'inherit',
              }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>{f.tag}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.01em' }}>{f.title}</div>
                <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted-strong)', margin: '0 0 16px' }}>{f.desc}</p>
                <span style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>{f.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
