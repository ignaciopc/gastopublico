import Link from 'next/link';
import { fetchIgaeBudget } from '@/lib/data/igae';
import { summarizeBudget } from '@/lib/transformers/budget';
import { supabase } from '@/lib/supabase';
import { CURRENT_EJERCICIO } from '@/lib/constants';
import { formatEUR } from '@/lib/formatters';
import type { ContratoRow } from '@/lib/supabase';
import type { Contract } from '@/lib/types';
import LiveSpendCounter from '@/components/ui/LiveSpendCounter';
import DeudaCounter from '@/components/ui/DeudaCounter';
import ProrrogaCounter from '@/components/ui/ProrrogaCounter';
import EjerciciosProrrogados, {
  EJERCICIOS_PRORROGADOS,
  FECHA_VERIFICACION_PRORROGA,
  ULTIMO_EJERCICIO_APROBADO,
} from '@/components/ui/EjerciciosProrrogados';

export const revalidate = 3600;

const FEATURES = [
  { tag: 'Calculadora', title: 'Impuestómetro', desc: 'Introduce tu sueldo bruto y calcula la retención de IRPF y las cotizaciones de 2026, y cómo se reparte el gasto de las AAPP por funciones (IGAE).', cta: 'Calcular mis impuestos', href: '/impuestometro' },
  { tag: 'BDNS', title: 'Subvenciones', desc: 'Concesiones de subvenciones y ayudas públicas de la Base de Datos Nacional de Subvenciones, con beneficiario, convocante e importe.', cta: 'Ver subvenciones', href: '/subvenciones' },
  { tag: 'PLACE', title: 'Contratos públicos', desc: 'Licitaciones publicadas en la Plataforma de Contratación del Sector Público, sincronizadas cada día. El importe es el presupuesto base de licitación sin impuestos.', cta: 'Ver contratos', href: '/contratos' },
  { tag: 'Banco de España · Eurostat', title: 'Deuda pública', desc: 'Evolución de la deuda de las Administraciones Públicas, coste de los intereses y comparativa europea con metodología SEC 2010.', cta: 'Ver deuda pública', href: '/deuda' },
  { tag: 'Open data', title: 'Datasets y API', desc: 'Los datos sincronizados de contratos y subvenciones en CSV y JSON, y los endpoints JSON que usa la web.', cta: 'Explorar datos', href: '/datasets' },
];

const PARTIDA_COLORS = ['var(--accent)', '#8a1428', '#6b6b66', '#3a3a35', '#1a1a18'];

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
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4d68', display: 'inline-block' }} />
              ESTIMACIÓN · DATOS IGAE 2025
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
            Las Administraciones Públicas llevan gastados<br />
            <LiveSpendCounter /><br />
            en lo que va de año (estimación).
          </h1>

          {/* lede */}
          <p style={{
            fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.6)',
            maxWidth: 720, margin: '0 0 28px',
          }}>
            Estimación: el gasto no financiero del conjunto de las Administraciones Públicas (Estado,
            comunidades autónomas, entidades locales y Seguridad Social) fue de 764.884 M€ en 2025
            (IGAE, contabilidad nacional), es decir, 24.254 € por segundo; el contador aplica ese ritmo
            desde el 1 de enero. Esta web publica la contratación pública y las subvenciones (sincronizadas a diario) y
            los datos de deuda y gasto de las AAPP, siempre con su fuente oficial.
          </p>

          {/* Deuda de las AAPP (estimación a partir del último dato del BdE) */}
          <div style={{
            marginBottom: 28,
            padding: '14px 20px',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 4,
            background: 'rgba(255,255,255,0.03)',
            display: 'inline-flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono), monospace' }}>
              Deuda de las AAPP (PDE, estimación)
            </span>
            <span style={{ fontSize: 28, fontWeight: 700, color: '#ededeb', fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>
              <DeudaCounter />
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono), monospace', maxWidth: 520, lineHeight: 1.5 }}>
              Último dato: 1.750 mm€ a 31/08/2026 (Banco de España). Se suma +1.617 €/s, la variación
              entre agosto de 2025 (1.699 mm€) y agosto de 2026, repartida por segundo.
            </span>
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
            <Link href="/deuda" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 22px', borderRadius: 4, fontSize: 14, fontWeight: 700,
              background: 'transparent', color: '#ededeb',
              border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none',
              letterSpacing: '0.02em',
            }}>
              Ver la deuda pública
            </Link>
          </div>

          {/* speed stats strip */}
          <div style={{
            marginTop: 48,
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {/* 764.884 M€ (AAPP, empleos no financieros 2025, IGAE) / (365 × 86.400 s) = 24.254 €/s; ×60, ×3.600, /365 */}
            <MiniStat label="Por segundo · 2025" value="24.254 €" />
            <MiniStat label="Por minuto · 2025" value="1,46 M€" />
            <MiniStat label="Por hora · 2025" value="87,3 M€" />
            <div style={{ padding: '10px 20px', flex: 1 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono), monospace', marginBottom: 6,
              }}>Por día · 2025</div>
              <div style={{
                fontFamily: 'var(--font-mono), monospace', fontSize: 22,
                fontWeight: 600, letterSpacing: '-0.02em', color: '#fff',
              }}>2.096 M€</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRÓRROGA PRESUPUESTARIA ──────────────────────────────────── */}
      <section style={{ background: '#0f0f12', color: '#ededeb', padding: '52px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.1fr)', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '4px 10px', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Ejecución presupuestaria</span>
              </div>
              <h2 style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: '#ededeb', letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 14px' }}>
                Los ejercicios {EJERCICIOS_PRORROGADOS.join(', ').replace(/, (\d+)$/, ' y $1')} se rigen por
                los presupuestos de {ULTIMO_EJERCICIO_APROBADO} prorrogados (
                <EjerciciosProrrogados /> ejercicios).
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', maxWidth: 520 }}>
                Los últimos Presupuestos Generales del Estado aprobados por las Cortes son los de 2023 (
                <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Ley 31/2022, de 23 de diciembre</strong>).
                Desde 2024 se aplica su prórroga automática (art. 134.4 de la Constitución). Entre 2016 y
                2026, siete ejercicios comenzaron en situación de prórroga: 2017 y 2018 (cuyos PGE se
                aprobaron en junio y julio, respectivamente), 2019 y 2020 (prórroga de los PGE de 2018
                durante todo el año) y 2024, 2025 y 2026.
              </p>
              <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', margin: '0 0 18px', fontFamily: 'var(--font-mono), monospace' }}>
                Fuente: BOE (Ley 31/2022; Ley 3/2017; Ley 6/2018; Real Decreto-ley 16/2025). Situación verificada a {FECHA_VERIFICACION_PRORROGA}.
              </p>
            </div>
            <div>
              <ProrrogaCounter />
            </div>
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
                El gasto público, con su fuente oficial
              </h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted-strong)', margin: 0 }}>
                GastoPublico.es recopila y publica los datos oficiales del gasto público español
                — contratación pública, subvenciones, deuda y gasto de las AAPP — en un formato
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
                Datos de la <strong>IGAE</strong> (Intervención General de la Administración del Estado)
                para el gasto y los intereses de las AAPP, la <strong>Plataforma de Contratación del Sector Público (PLACE)</strong> para
                licitaciones y la <strong>BDNS</strong> (Base de Datos Nacional de Subvenciones). Deuda, déficit e
                ingresos: Banco de España, Eurostat, AEAT e INE. Contratos y subvenciones se sincronizan cada día; el resto de cifras se actualizan cuando el organismo publica y llevan la fecha del dato.
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
                Con el <strong>Impuestómetro</strong> calculas tu retención de IRPF y cotizaciones. En
                {' '}<strong>Contratos</strong> y <strong>Subvenciones</strong> consultas las últimas publicaciones
                oficiales, y en <strong>Datasets</strong> descargas lo sincronizado en CSV o JSON.
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
              <div className="eyebrow" style={{ marginBottom: 6 }}>IGAE · AEAT · INE · Banco de España · 2025</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                Indicadores principales
              </h2>
            </div>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              Fuentes: IGAE (Informe trimestral AAPP 4T 2025) / AEAT / INE / BdE
            </span>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            border: '1px solid var(--card-border)', borderRadius: 4,
            background: 'var(--card)', overflow: 'hidden',
          }}>
            {[
              // Deuda PDE 2025: 1.698.355 M€; 2024: 1.620.578 M€ → +77.777 M€ (BdE, Boletín Estadístico, tabla 2.9)
              { label: 'Deuda de las AAPP · 2025', value: '1,70', unit: 'billones €', delta: '+77.777 M€', deltaLabel: 'vs. 2024', sub: '1.698.355 M€ · 100,5% del PIB · Banco de España (PDE), cierre 2025' },
              { label: 'Ingresos tributarios · 2025', value: '325,4', unit: 'mM€', delta: '+10,4%', deltaLabel: 'vs. 2024', sub: '325.356 M€ · AEAT, Informe anual de recaudación tributaria 2025' },
              // 764.884 / 725.001 − 1 = +5,5 %; 764.884e6 / 49.315.949 hab. (INE, 1/7/2025, provisional) = 15.510 €
              { label: 'Gasto de las AAPP · 2025', value: '764,9', unit: 'mM€', delta: '+5,5%', deltaLabel: 'vs. 2024', sub: 'Empleos no financieros (IGAE) · 15.510 € por habitante (INE)' },
              // 40.314 / 38.793 − 1 = +3,9 %; 40.314 / 764.884 = 5,3 %
              { label: 'Intereses de la deuda · 2025', value: '40,3', unit: 'mM€', delta: '+3,9%', deltaLabel: 'vs. 2024', sub: '40.314 M€ (AAPP, D.41, IGAE) · 5,3% del gasto de las AAPP' },
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

      {/* ── SALDO DE LAS AAPP ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Banco de España (Ministerio de Hacienda / INE) · 2008–2025</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                Déficit de las Administraciones Públicas, 2008–2025
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--muted-strong)', margin: 0 }}>
                Necesidad de financiación en porcentaje del PIB (contabilidad nacional, SEC 2010). Las AAPP
                registran déficit en todos los ejercicios desde 2008; el último superávit fue el de 2007
                (20.287 M€, 1,9% del PIB).
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Suma de déficits 2008–2025 (euros corrientes)</div>
              {/* Suma de la necesidad de financiación anual en M€, 2008–2025 (BdE, tabla 2.9) = 1.244.258 M€ */}
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-mono), monospace', letterSpacing: '-0.02em' }}>1,24 billones €</div>
            </div>
          </div>
          {/* Mini bar chart */}
          {(() => {
            // BdE, Boletín Estadístico, tabla 2.9 «General Government deficit and debt», consultada el 17/11/2026
            const data = [
              { y: 2008, v: 4.6 }, { y: 2009, v: 11.2 }, { y: 2010, v: 9.5 },
              { y: 2011, v: 9.7 }, { y: 2012, v: 11.5 }, { y: 2013, v: 7.5 },
              { y: 2014, v: 6.0 }, { y: 2015, v: 5.3 }, { y: 2016, v: 4.2 },
              { y: 2017, v: 3.1 }, { y: 2018, v: 2.6 }, { y: 2019, v: 3.1 },
              { y: 2020, v: 9.9 }, { y: 2021, v: 6.7 }, { y: 2022, v: 4.6 },
              { y: 2023, v: 3.3 }, { y: 2024, v: 3.2 }, { y: 2025, v: 2.4 },
            ];
            const max = Math.max(...data.map(d => d.v));
            return (
              <>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120, borderBottom: '1px solid var(--rule)', paddingBottom: 6 }}>
                  {data.map(d => {
                    const h = Math.round((d.v / max) * 100);
                    return (
                      <div key={d.y} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 8.5, color: 'var(--muted)', fontFamily: 'var(--font-mono), monospace' }}>
                          {d.v.toLocaleString('es-ES', { minimumFractionDigits: 1 })}%
                        </span>
                        <div style={{ width: '100%', height: h, background: 'var(--accent)', borderRadius: '2px 2px 0 0' }} />
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
            <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
              Fuente: Banco de España, Boletín Estadístico, tabla 2.9 (déficit: Ministerio de Hacienda; PIB: INE).
            </span>
            <Link href="/deuda" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Ver deuda y déficit →
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPARATIVA EUROPA ───────────────────────────────────────────── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Eurostat · 2025</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                España en el contexto europeo
              </h2>
            </div>
            <Link href="/deuda" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>
              Ver deuda pública →
            </Link>
          </div>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--background)' }}>
                  {['Indicador', '🇪🇸 España', 'UE-27', '🇩🇪 Alemania', '🇫🇷 Francia', 'Fuente · año'].map((h, i) => (
                    <th key={h} style={{ padding: '10px 16px', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', textAlign: i === 0 || i === 5 ? 'left' : 'center', borderBottom: '1px solid var(--card-border)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  // Eurostat, euro indicators 22/04/2026, «Provision of deficit and debt data for 2025 – first notification»
                  { m: 'Deuda / PIB', esp: '100,7%', eu: '81,7%', de: '63,5%', fr: '115,6%', fuente: 'Eurostat · 2025' },
                  { m: 'Saldo / PIB', esp: '-2,4%', eu: '-3,1%', de: '-2,7%', fr: '-5,1%', fuente: 'Eurostat · 2025' },
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
            metodología (SEC 2010). UE-27 es el agregado de los 27 Estados miembros (no una media simple).
            La selección de comparadores condiciona la lectura: los datos completos de los 27 están disponibles
            en Eurostat. Datos de la primera notificación de 2026 (nota de Eurostat de 22/04/2026); revisiones
            posteriores pueden modificarlos (el Banco de España sitúa la deuda de España en el 100,5% del PIB
            tras la revisión de las cuentas nacionales).
          </p>
        </div>
      </section>

      {/* ── TOP PARTIDAS (real IGAE) ─────────────────────────────────────── */}
      {top5.length > 0 && (
        <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Ejercicio {CURRENT_EJERCICIO} · Datos IGAE</div>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 6px', letterSpacing: '-0.02em' }}>
              Las cinco secciones con más obligaciones reconocidas — {CURRENT_EJERCICIO}
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 24px' }}>
              Obligaciones reconocidas por sección presupuestaria del Estado.
              {EJERCICIOS_PRORROGADOS.includes(CURRENT_EJERCICIO) && ` En ${CURRENT_EJERCICIO} rigió el presupuesto de ${ULTIMO_EJERCICIO_APROBADO} prorrogado.`}
              {' '}El porcentaje indica la tasa de ejecución: obligaciones reconocidas sobre crédito definitivo.
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
                    <span className="mono" style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'right' }}>
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
