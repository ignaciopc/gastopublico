'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { BudgetSummary, HistoricoSummary } from '@/lib/types';
import { formatEUR } from '@/lib/formatters';
import { CURRENT_EJERCICIO } from '@/lib/constants';
import PageHeader from '@/components/ui/PageHeader';
import { PageLoader } from '@/components/ui/Spinner';

type Tab = 'actual' | 'evolucion' | 'comparador';
type MinOrder = 'monto' | 'ejec' | 'delta';

const comparTh: React.CSSProperties = {
  padding: '12px 18px', textAlign: 'left', fontSize: 10.5, fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--muted)',
  borderBottom: '1px solid var(--card-border)',
  fontFamily: 'var(--font-mono), monospace',
};

function Gauge({ pct }: { pct: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(pct * eased);
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [pct]);
  const r = 110, c = Math.PI * r;
  const offset = c - (val / 100) * c;
  return (
    <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, padding: 24, background: 'var(--card)', textAlign: 'center' }}>
      <div className="eyebrow-muted" style={{ marginBottom: 14 }}>Grado de ejecución</div>
      <svg viewBox="0 0 260 150" style={{ width: '100%', maxWidth: 260, height: 'auto' }}>
        <path d={`M 20 130 A ${r} ${r} 0 0 1 240 130`} fill="none" stroke="var(--rule)" strokeWidth="14" strokeLinecap="round" />
        <path d={`M 20 130 A ${r} ${r} 0 0 1 240 130`} fill="none" stroke="var(--accent)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.1s linear' }} />
        <text x="130" y="120" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="600" fontSize="44" fill="var(--foreground)" letterSpacing="-2">
          {val.toFixed(1)}%
        </text>
      </svg>
    </div>
  );
}

export default function PresupuestoPage() {
  const [tab, setTab] = useState<Tab>('actual');
  const [result, setResult] = useState<{ data: BudgetSummary; meta: { lastUpdated: string; source: string } } | null>(null);
  const [historico, setHistorico] = useState<{ data: HistoricoSummary } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingHist, setLoadingHist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorHist, setErrorHist] = useState<string | null>(null);
  const [minOrder, setMinOrder] = useState<MinOrder>('monto');

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/presupuesto?ejercicio=${CURRENT_EJERCICIO}`);
      if (!res.ok) throw new Error('Error');
      setResult(await res.json());
    } catch { setError('No se pudieron cargar los datos.'); }
    finally { setLoading(false); }
  }, []);

  const loadHist = useCallback(async () => {
    if (historico) return;
    setLoadingHist(true); setErrorHist(null);
    try {
      const res = await fetch('/api/presupuesto/historico');
      if (!res.ok) throw new Error('Error');
      setHistorico(await res.json());
    } catch { setErrorHist('No se pudieron cargar los datos históricos.'); }
    finally { setLoadingHist(false); }
  }, [historico]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (tab === 'comparador' || tab === 'evolucion') loadHist(); }, [tab, loadHist]);

  const stats = result?.data;
  const hist = historico?.data;

  const ministeriosSorted = useMemo(() => {
    if (!stats) return [];
    return [...stats.bySeccion].sort((a, b) => {
      if (minOrder === 'ejec') return b.tasaEjecucion - a.tasaEjecucion;
      if (minOrder === 'delta') return b.tasaEjecucion - a.tasaEjecucion;
      return b.obligacionesReconocidas - a.obligacionesReconocidas;
    }).slice(0, 12);
  }, [stats, minOrder]);

  const TABS: { k: Tab; l: string }[] = [
    { k: 'actual', l: 'Año actual' },
    { k: 'evolucion', l: 'Comparador histórico' },
    { k: 'comparador', l: 'Tabla comparativa' },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`Dashboard · Presupuestos Generales del Estado ${CURRENT_EJERCICIO}`}
        title="583.000 millones. Y subiendo."
        lede="Cada mes, IGAE publica la ejecución del Presupuesto. Aquí lo abrimos por ministerio, lo cruzamos con los tres últimos ejercicios y filtras por partida."
        meta={[
          { k: 'Fuente', v: 'IGAE / Ministerio de Hacienda' },
          { k: 'Cobertura', v: 'Estado · OO.AA. · Seg. Social' },
          { k: 'Ejercicio', v: String(CURRENT_EJERCICIO) },
        ]}
      />

      {/* Tabs */}
      <section style={{ borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {TABS.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} style={{
              padding: '16px 22px', border: 0, background: 'transparent',
              borderBottom: tab === t.k ? '2px solid var(--accent)' : '2px solid transparent',
              color: tab === t.k ? 'var(--foreground)' : 'var(--muted)',
              fontSize: 13, fontWeight: 700, letterSpacing: '0.02em',
              cursor: 'pointer', marginBottom: -1,
            }}>{t.l}</button>
          ))}
        </div>
      </section>

      {/* TAB: Año actual */}
      {tab === 'actual' && (
        loading ? <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}><PageLoader /></div>
        : error ? (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--bad)', marginBottom: 16 }}>{error}</p>
            <button onClick={load} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 0, borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>Reintentar</button>
          </div>
        ) : stats ? (
          <>
            {/* KPIs */}
            <section style={{ padding: '28px 0 32px', borderBottom: '1px solid var(--rule)' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'hidden',
                }}>
                  {[
                    { label: 'Presupuesto inicial', value: formatEUR(stats.totalCredIniciales, true), delta: `Ejercicio ${CURRENT_EJERCICIO}`, bad: false },
                    { label: 'Créditos definitivos', value: formatEUR(stats.totalCredDefinitivos, true), delta: 'Tras modificaciones', bad: false },
                    { label: 'Gasto real ejecutado', value: formatEUR(stats.totalObligacionesReconocidas, true), delta: 'Obligaciones reconocidas', bad: true },
                    { label: 'Tasa de ejecución', value: stats.tasaEjecucionGlobal.toFixed(1) + '%', delta: 'Sobre créditos definitivos', bad: false },
                  ].map((k, i, arr) => (
                    <div key={k.label} style={{ padding: '22px 24px', borderRight: i === arr.length - 1 ? 0 : '1px solid var(--card-border)' }}>
                      <div className="eyebrow-muted" style={{ marginBottom: 10 }}>{k.label}</div>
                      <div className="mono" style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 6 }}>{k.value}</div>
                      <div className="mono" style={{ fontSize: 11, color: k.bad ? 'var(--bad)' : 'var(--muted)', fontWeight: 700 }}>{k.delta}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Gauge + ministerios */}
            <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
              <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 48, alignItems: 'start' }}>
                  <Gauge pct={stats.tasaEjecucionGlobal} />
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
                      <div>
                        <div className="eyebrow" style={{ marginBottom: 8 }}>Por sección · Ejecución {CURRENT_EJERCICIO}</div>
                        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
                          Gasto ejecutado por ministerio
                        </h2>
                      </div>
                      <select value={minOrder} onChange={e => setMinOrder(e.target.value as MinOrder)} style={{
                        padding: '8px 10px', border: '1px solid var(--card-border)',
                        background: 'var(--background)', color: 'var(--foreground)',
                        borderRadius: 3, fontSize: 12, fontFamily: 'inherit',
                      }}>
                        <option value="monto">Ordenar: importe</option>
                        <option value="ejec">Ordenar: % ejecutado</option>
                      </select>
                    </div>
                    <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
                      {ministeriosSorted.map((m, i) => {
                        const maxMonto = ministeriosSorted[0].obligacionesReconocidas;
                        return (
                          <div key={m.seccion} style={{
                            padding: '13px 18px', borderBottom: i === ministeriosSorted.length - 1 ? 0 : '1px solid var(--rule)',
                            display: 'grid', gridTemplateColumns: '200px 1fr 120px 70px', alignItems: 'center', gap: 14, fontSize: 13.5,
                          }}>
                            <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.descripcion}</div>
                            <div style={{ height: 4, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
                              <div style={{ height: '100%', width: `${(m.obligacionesReconocidas / maxMonto) * 100}%`, background: 'var(--foreground)', transition: 'width 1s ease' }} />
                            </div>
                            <div className="mono" style={{ textAlign: 'right', fontWeight: 600, fontSize: 12 }}>{formatEUR(m.obligacionesReconocidas, true)}</div>
                            <div className="mono" style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 12 }}>{m.tasaEjecucion.toFixed(1)}%</div>
                          </div>
                        );
                      })}
                    </div>
                    {result?.meta && (
                      <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                        Fuente: {result.meta.source} · {new Date(result.meta.lastUpdated).toLocaleString('es-ES')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : null
      )}

      {/* TAB: Evolución (usa datos históricos — comparador por secciones) */}
      {tab === 'evolucion' && (
        loadingHist ? <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}><PageLoader /></div>
        : errorHist ? (
          <div style={{ padding: '80px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--bad)', marginBottom: 16 }}>{errorHist}</p>
            <button onClick={() => { setHistorico(null); loadHist(); }} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 0, borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}>Reintentar</button>
          </div>
        ) : hist ? (
          <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
              {/* Totales */}
              <div className="eyebrow" style={{ marginBottom: 10 }}>Comparador histórico</div>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                En tres años, el gasto del Estado ha crecido un{' '}
                {hist.totales[2022] && hist.totales[2024]
                  ? ((hist.totales[2024].obligacionesReconocidas / hist.totales[2022].obligacionesReconocidas - 1) * 100).toFixed(1) + '%'
                  : '—'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'hidden', marginBottom: 32 }}>
                {hist.años.map((año, i) => {
                  const t = hist.totales[año];
                  const prev = i > 0 ? hist.totales[hist.años[i - 1]] : null;
                  const delta = prev ? ((t.obligacionesReconocidas - prev.obligacionesReconocidas) / prev.obligacionesReconocidas) * 100 : null;
                  return (
                    <div key={año} style={{ padding: '24px', borderRight: i < 2 ? '1px solid var(--card-border)' : 0 }}>
                      <div className="eyebrow-muted" style={{ marginBottom: 8 }}>Gasto total {año}</div>
                      <div className="mono" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 4 }}>
                        {formatEUR(t.obligacionesReconocidas, true)}
                      </div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>Tasa ejec.: {t.tasaEjecucion.toFixed(1)}%</div>
                      {delta !== null && (
                        <div className="mono" style={{ fontSize: 12, fontWeight: 700, color: 'var(--bad)' }}>
                          ▲ {delta.toFixed(1)}% vs {hist.años[i - 1]}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Chart de barras CSS puro */}
              <div className="eyebrow" style={{ marginBottom: 8 }}>Top 10 secciones por gasto 2024</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                Comparativa de gasto real ejecutado (miles de millones €)
              </h3>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', padding: '28px 24px' }}>
                {hist.secciones.slice(0, 10).map(s => {
                  const maxVal = Math.max(
                    ...hist.años.flatMap(a => [s.datos[a]?.obligacionesReconocidas ?? 0])
                  );
                  const globalMax = Math.max(...hist.secciones.slice(0, 10).flatMap(sec =>
                    hist.años.map(a => sec.datos[a]?.obligacionesReconocidas ?? 0)
                  ));
                  return (
                    <div key={s.seccion} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{s.descripcion}</div>
                      {hist.años.map((año, ai) => {
                        const val = s.datos[año]?.obligacionesReconocidas ?? 0;
                        const COLORS = ['#6b6b66', '#4a4a45', 'var(--accent)'];
                        return (
                          <div key={año} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                            <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{año}</span>
                            <div style={{ height: 10, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
                              <div style={{ height: '100%', width: val ? `${(val / globalMax) * 100}%` : '0%', background: COLORS[ai], transition: 'width 1s ease' }} />
                            </div>
                            <span className="mono" style={{ fontSize: 11, textAlign: 'right', color: 'var(--muted-strong)' }}>
                              {val ? formatEUR(val, true) : '—'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                <div style={{ display: 'flex', gap: 20, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--rule)' }}>
                  {hist.años.map((año, i) => (
                    <div key={año} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 12, height: 4, background: ['#6b6b66', '#4a4a45', 'var(--accent)'][i], borderRadius: 1 }} />
                      <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{año}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null
      )}

      {/* TAB: Tabla comparativa */}
      {tab === 'comparador' && (
        loadingHist ? <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}><PageLoader /></div>
        : hist ? (
          <section style={{ padding: '48px 0' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Tabla comparativa · Todas las secciones</div>
              <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
                Gasto real ejecutado por sección · 2022 · 2023 · 2024
              </h2>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
                  <thead>
                    <tr style={{ background: 'var(--background)' }}>
                      <th style={comparTh}>Sección</th>
                      {hist.años.map(a => <th key={a} style={{ ...comparTh, textAlign: 'right' }}>{a}</th>)}
                      <th style={{ ...comparTh, textAlign: 'right' }}>Δ 22→24</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hist.secciones.map((s, i) => {
                      const v22 = s.datos[2022]?.obligacionesReconocidas ?? null;
                      const v24 = s.datos[2024]?.obligacionesReconocidas ?? null;
                      const varPct = v22 && v24 ? ((v24 - v22) / v22) * 100 : null;
                      return (
                        <tr key={s.seccion} style={{ borderBottom: i === hist.secciones.length - 1 ? 0 : '1px solid var(--rule)' }}>
                          <td style={{ padding: '13px 18px', fontWeight: 500 }}>
                            <span className="mono" style={{ fontSize: 10, color: 'var(--muted)', marginRight: 8 }}>{s.seccion}</span>
                            {s.descripcion}
                          </td>
                          {hist.años.map(año => (
                            <td key={año} style={{ padding: '13px 18px', textAlign: 'right', fontFamily: 'var(--font-mono), monospace', fontSize: 13 }}>
                              {s.datos[año] ? formatEUR(s.datos[año].obligacionesReconocidas, true) : <span style={{ color: 'var(--muted)' }}>—</span>}
                            </td>
                          ))}
                          <td className="mono" style={{
                            padding: '13px 18px', textAlign: 'right', fontWeight: 700, fontSize: 12,
                            color: varPct === null ? 'var(--muted)' : varPct >= 0 ? 'var(--bad)' : 'var(--good)',
                          }}>
                            {varPct !== null ? `${varPct >= 0 ? '▲ +' : '▼ '}${varPct.toFixed(1)}%` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
                Fuente: IGAE · Obligaciones Reconocidas Netas · Euros corrientes sin deflactar
              </p>
            </div>
          </section>
        ) : null
      )}
    </>
  );
}
