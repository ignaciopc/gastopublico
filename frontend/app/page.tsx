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
import SinPresupuestoCounter from '@/components/ui/SinPresupuestoCounter';
import YearsWithoutBudget from '@/components/ui/YearsWithoutBudget';
import FondosUECountdown from '@/components/ui/FondosUECountdown';

export const revalidate = 3600;

const MAXIMOS = [
  { concepto: 'Recaudación tributaria 2024', valor: '294.734 M€', delta: '+8,4%', url: 'https://www.agenciatributaria.es' },
  { concepto: 'Gasto en pensiones 2024', valor: '201.500 M€', delta: '+10,9%', url: 'https://www.seg-social.es' },
  { concepto: 'Deuda pública s/ PIB', valor: '108,1%', delta: '+2,1 pp', url: 'https://www.bde.es' },
  { concepto: 'Coste de altos cargos', valor: '678 M€', delta: '+12,1%', url: 'https://www.hacienda.gob.es' },
  { concepto: 'Subvenciones a partidos políticos', valor: '82,4 M€', delta: '+5,2%', url: 'https://www.interior.gob.es' },
  { concepto: 'Intereses de la deuda', valor: '39.900 M€', delta: '+38%', url: 'https://www.tesoro.es' },
];

const FEATURES = [
  { tag: 'Calculadora', title: 'Impuestómetro', desc: 'Introduce tu sueldo bruto y descubre cuánto pagas al año, a qué se destina cada euro y en qué fecha trabajas exclusivamente para ti.', cta: 'Calcular mis impuestos', href: '/impuestometro' },
  { tag: 'Dashboard', title: 'Presupuesto del Estado', desc: 'Ejecución mensual del PGE por ministerio. Comparador histórico 2022–2024 con datos IGAE actualizados.', cta: 'Ver presupuesto', href: '/presupuesto' },
  { tag: 'Tiempo real', title: 'Contratos públicos', desc: 'Feed de licitaciones y adjudicaciones del Estado vía PLACE. Filtros por importe, organismo y adjudicatario.', cta: 'Ver contratos', href: '/contratos' },
  { tag: 'Open data', title: 'Datasets y API', desc: 'Toda la información descargable en CSV y JSON. API REST documentada. Licencia CC-BY 4.0.', cta: 'Explorar datos', href: '/datasets' },
];

const PARTIDA_COLORS = ['var(--accent)', '#8a1428', '#6b6b66', '#3a3a35', '#1a1a18'];

type InmigracionPartida = { label: string; importe: number; nota: string; tipo: 'oficial' | 'estimacion' };
const INMIGRACION_PARTIDAS: InmigracionPartida[] = [
  { label: 'Acogida humanitaria y asilo (Prog. 231N)', importe: 496_100_000, nota: 'Centros acogida, CIEs, CEAR, Cruz Roja', tipo: 'oficial' },
  { label: 'MENA — Menores no acompañados', importe: 420_000_000, nota: 'Transferencias a CCAA para tutela y acogida', tipo: 'oficial' },
  { label: 'FAMI — Fondo UE Asilo y Migración', importe: 267_200_000, nota: 'Fondos europeos gestionados por España', tipo: 'oficial' },
  { label: 'Integración social de inmigrantes', importe: 185_000_000, nota: 'Planes de integración, formación, inserción', tipo: 'oficial' },
  { label: 'Gestión de flujos migratorios (Prog. 231E)', importe: 124_300_000, nota: 'Tramitación visados, regularizaciones', tipo: 'oficial' },
  { label: 'Control de fronteras (parte asignada)', importe: 354_400_000, nota: 'Guardia Civil + Policía Nacional', tipo: 'estimacion' },
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
            18.490 € por segundo. 1.597 millones por día. Y la deuda crece más rápido todavía.
            Esta web rastrea, partida a partida, contrato a contrato, dónde acaba cada euro
            que sale de tu nómina. Datos oficiales. Cero opacidad.
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
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '4px 10px', border: '1px solid rgba(239,77,104,0.4)', borderRadius: 3 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4d68', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ef4d68' }}>Récord democrático</span>
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 14px' }}>
                España lleva <YearsWithoutBudget style={{ color: '#ef4d68' }} /> años sin<br />aprobar un presupuesto propio.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', maxWidth: 480 }}>
                El último PGE aprobado fue la{' '}
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Ley 6/2018 de 3 de julio</strong> (Rajoy).
                Desde entonces, Pedro Sánchez gobierna con prórrogas automáticas.
                Ningún otro gobierno europeo democrático supera 3 años en esta situación.
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
              <SinPresupuestoCounter />
              <div style={{ marginTop: 24, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { val: '22', label: 'ministerios (récord UE)' },
                  { val: '740', label: 'asesores nombrados a dedo' },
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
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4d68', display: 'inline-block' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ef4d68' }}>Urgente · Plazo improrrogable</span>
              </div>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 14px' }}>
                España puede perder{' '}
                <span style={{ color: '#ef4d68' }}>hasta 20.000 M€</span>{' '}
                en fondos europeos no repagables.
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', maxWidth: 520 }}>
                El{' '}
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Reglamento (UE) 2021/241</strong>{' '}
                fija el 31 de agosto de 2026 como plazo límite. España ha ejecutado solo el{' '}
                <strong style={{ color: '#ef4d68' }}>21,4%</strong>{' '}
                de los 163.500 M€ asignados — el peor ratio del G7.
                Los fondos no ejecutados se devuelven. No se prorrogan.
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
                legible para cualquier ciudadano. Sin tecnicismos, sin filtros políticos.
                Sólo los números.
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
                Información que cambia perspectivas
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
              <div className="eyebrow" style={{ marginBottom: 6 }}>Indicadores críticos</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Cuatro cifras que el gobierno no pone en sus carteles
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
              { label: 'Deuda pública', value: '1,64', unit: 'billones €', delta: '+47.800 M€', deltaLabel: 'vs. 2023', bad: true, sub: '108,1% del PIB · récord histórico' },
              { label: 'Parados EPA', value: '11,2', unit: '%', delta: '2× media UE', deltaLabel: 'T4 2024', bad: true, sub: 'El doble de la media UE (5,9%)' },
              { label: 'Gasto público 2024', value: '583', unit: 'mM€', delta: '+6,4%', deltaLabel: 'vs. 2023', bad: true, sub: '12.157 € por habitante' },
              { label: 'Intereses deuda', value: '39,9', unit: 'mM€', delta: '+38%', deltaLabel: 'en 2 años', bad: true, sub: 'Más que Educación + Justicia' },
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
                  <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--bad)' }}>▲ {k.delta}</span>
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
                17 años consecutivos en déficit
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
                España no cierra un ejercicio con superávit desde 2007. Ningún país del G7 lo supera.
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
                España vs Europa: lo que no sale en los mítines
              </h2>
            </div>
            <Link href="/gobierno" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Análisis completo →
            </Link>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Indicador', '🇪🇸 España', 'Media UE', '🇩🇪 Alemania', '🇫🇷 Francia'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: i === 1 ? 'var(--bad)' : 'var(--muted)', textAlign: i === 0 ? 'left' : 'center', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { m: 'Deuda / PIB', esp: '108,1%', eu: '82,7%', de: '62,7%', fr: '110,6%', bad: true },
                  { m: 'Déficit', esp: '-3,1%', eu: '-2,9%', de: '+0,1%', fr: '-5,5%', bad: true },
                  { m: 'Paro', esp: '11,2%', eu: '5,9%', de: '3,4%', fr: '7,3%', bad: true },
                  { m: 'Ministerios', esp: '22', eu: '14', de: '14', fr: '15', bad: true },
                  { m: 'Años sin PGE propio', esp: '7', eu: '0,4', de: '0', fr: '0', bad: true },
                ].map((row, i) => (
                  <tr key={row.m} style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--background)' }}>
                    <td style={{ padding: '11px 16px', fontSize: 13.5, fontWeight: 600, borderBottom: '1px solid var(--rule)' }}>{row.m}</td>
                    <td style={{ padding: '11px 16px', fontSize: 14, fontFamily: 'var(--font-mono), monospace', fontWeight: 700, textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--bad)' }}>{row.esp}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono), monospace', textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.eu}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono), monospace', textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.de}</td>
                    <td style={{ padding: '11px 16px', fontSize: 13, fontFamily: 'var(--font-mono), monospace', textAlign: 'center', borderBottom: '1px solid var(--rule)', color: 'var(--muted-strong)' }}>{row.fr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MÁXIMOS HISTÓRICOS ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Máximos históricos 2024</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
            Todo récord. Menos lo que importa.
          </h2>
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
                  <span className="mono" style={{ fontSize: 12, color: 'var(--bad)', fontWeight: 700, minWidth: 60, textAlign: 'right' }}>{row.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GASTO EN INMIGRACIÓN ────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>PGE 2024 · Secretaría de Estado de Migraciones</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
                ¿Cuánto gastamos en inmigración?
              </h2>
              <p style={{ fontSize: 14, color: 'var(--muted-strong)', margin: 0, maxWidth: 640, lineHeight: 1.55 }}>
                Partidas directas del Presupuesto General del Estado 2024. No incluye el gasto
                de las Comunidades Autónomas en educación, sanidad y servicios sociales para
                personas inmigrantes, que eleva el coste total estimado a más de 6.000 M€/año.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.08em', marginBottom: 4 }}>TOTAL PARTIDAS DIRECTAS</div>
              <div style={{ fontSize: 38, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.03em', color: 'var(--bad)' }}>
                1.847 M€
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                193 € por habitante · 217 € por inmigrante
              </div>
            </div>
          </div>

          {/* Barras de partidas */}
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
            {INMIGRACION_PARTIDAS.map((p, i) => {
              const maxImporte = INMIGRACION_PARTIDAS[0].importe;
              const pct = Math.round((p.importe / maxImporte) * 100);
              const total = INMIGRACION_PARTIDAS.reduce((s, x) => s + x.importe, 0);
              const share = ((p.importe / total) * 100).toFixed(1);
              return (
                <div key={p.label} style={{
                  padding: '16px 20px',
                  borderBottom: i < INMIGRACION_PARTIDAS.length - 1 ? '1px solid var(--rule)' : 0,
                  background: 'var(--card)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.label}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 800, letterSpacing: '0.14em',
                        textTransform: 'uppercase', padding: '2px 6px', borderRadius: 2,
                        border: `1px solid ${p.tipo === 'oficial' ? 'rgba(39,174,96,0.5)' : 'rgba(230,126,34,0.5)'}`,
                        color: p.tipo === 'oficial' ? '#27ae60' : '#e67e22',
                        background: p.tipo === 'oficial' ? 'rgba(39,174,96,0.06)' : 'rgba(230,126,34,0.06)',
                        fontFamily: 'var(--font-mono), monospace', flexShrink: 0,
                      }}>
                        {p.tipo === 'oficial' ? 'OFICIAL' : 'ESTIMACIÓN'}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{p.nota}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexShrink: 0 }}>
                      <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>{share}%</span>
                      <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono), monospace' }}>
                        {formatEUR(p.importe, true)}
                      </span>
                    </div>
                  </div>
                  <div style={{ background: 'var(--card-border)', borderRadius: 2, height: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2, opacity: 0.8 + i * 0.02 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nota y contexto */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { label: 'Inmigrantes en España (2024)', value: '8,5 M', sub: '17,9% de la población total — INE' },
              { label: 'Solicitudes de asilo 2024', value: '163.220', sub: '+12% respecto a 2023 — Ministerio Interior' },
              { label: 'MENA bajo tutela estatal', value: '~47.000', sub: 'Distribuidos entre CCAA — estimación 2024' },
              { label: 'Gasto estimado total (Estado + CCAA)', value: '+6.000 M€', sub: 'Incluyendo sanidad, educación y servicios sociales' },
            ].map(stat => (
              <div key={stat.label} style={{ padding: '14px 16px', background: 'var(--card)', border: '1px solid var(--card-border)', borderRadius: 4 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em', marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: 'var(--muted)', margin: '14px 0 0', lineHeight: 1.5 }}>
            Fuentes: PGE 2024 (Ministerio de Hacienda), IGAE, INE, Ministerio de Interior. La partida de control de fronteras es una estimación basada en el presupuesto de Guardia Civil y Policía Nacional prorrateado por actividad migratoria.
          </p>
        </div>
      </section>

      {/* ── TOP PARTIDAS (real IGAE) ─────────────────────────────────────── */}
      {top5.length > 0 && (
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>PGE {CURRENT_EJERCICIO} · Datos IGAE</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Top 5 partidas por gasto ejecutado
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 24px' }}>
              Obligaciones reconocidas netas · Euros corrientes
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
