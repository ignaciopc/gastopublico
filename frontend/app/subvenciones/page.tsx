'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { PageLoader } from '@/components/ui/Spinner';

interface StatKpi {
  label: string;
  value: string;
  delta: string;
  bad: boolean;
}

interface TopPerceptor {
  rank: number;
  beneficiario: string;
  concepto: string;
  organismo: string;
  importe: number;
}

interface TipoRow {
  tipo: string;
  pct: number;
  color: string;
}

interface SubvencionesData {
  stats: StatKpi[];
  top: TopPerceptor[];
  porTipo: TipoRow[];
  meta: { lastUpdated: string; source: string; ejercicio: number };
}

interface SearchResult {
  rank: number;
  beneficiario: string;
  concepto: string;
  organismo: string;
  tipo_beneficiario: string;
  importe: number;
}

const TIPOS_BENEFICIARIO = [
  'Administración Autonómica',
  'Administración Local',
  'Empresa pública',
  'Persona física',
  'Entidad privada',
  'Universidad',
  'ONG / Fundación',
];

function fmt(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2) + ' bn€';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + ' M€';
  return n.toLocaleString('es-ES') + ' €';
}

function PieRow({ t, idx, last }: { t: TipoRow; idx: number; last: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(t.pct), 80 + idx * 60);
    return () => clearTimeout(id);
  }, [t.pct, idx]);
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ fontWeight: 600 }}>{t.tipo}</span>
        <span className="mono" style={{ fontWeight: 600 }}>{t.pct}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
        <div style={{
          height: '100%',
          width: `${w * 3.5}%`,
          maxWidth: '100%',
          background: t.color,
          transition: 'width 1s cubic-bezier(0.2, 0.7, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}

export default function SubvencionesPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<SubvencionesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQ, setSearchQ] = useState(searchParams.get('q') ?? '');
  const [searchTipo, setSearchTipo] = useState('');
  const [searchImporte, setSearchImporte] = useState(0);
  const [searchSort, setSearchSort] = useState<'importe' | 'fecha'>('importe');
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/subvenciones');
      if (!res.ok) throw new Error('Error al cargar datos');
      setData(await res.json());
    } catch {
      setError('No se pudieron cargar los datos de subvenciones.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  // Pre-fill search from URL ?q= param
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) runSearch(q, '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runSearch = useCallback(async (q: string, tipo: string) => {
    if (!q && !tipo) {
      setSearchResults(null);
      return;
    }
    setSearchLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (tipo) params.set('tipo', tipo);
      if (!q && !tipo) params.set('all', '1');
      const res = await fetch(`/api/subvenciones?${params.toString()}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSearchResults(json.data ?? []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (q: string, tipo: string) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => runSearch(q, tipo), 350);
  };

  const pctTop100 = data?.stats.find(s => s.label.includes('Top'))?.value ?? '17,3%';

  const displayRows = useMemo(() => {
    let rows: (SearchResult | TopPerceptor)[] = searchResults ?? data?.top ?? [];
    if (searchImporte > 0) rows = rows.filter(r => r.importe >= searchImporte);
    if (searchSort === 'importe') rows = [...rows].sort((a, b) => b.importe - a.importe);
    return rows;
  }, [searchResults, data?.top, searchImporte, searchSort]);

  return (
    <>
      <PageHeader
        eyebrow="Subvenciones · Base de Datos Nacional"
        title={`47.840 millones repartidos. El ${pctTop100} va a 100 perceptores.`}
        lede="La BDNS publica todas las subvenciones concedidas por las administraciones públicas. Las hemos cruzado, agregado y ordenado para que veas, sin filtros, quién recibe el dinero público y por qué concepto."
        meta={[
          { k: 'Fuente', v: 'BDNS · Base de Datos Nacional de Subvenciones' },
          { k: 'Cobertura', v: 'Estado · CCAA · EELL' },
          { k: 'Concedidas 2024', v: data?.stats[0]?.value ?? '47.840 M€' },
        ]}
      />

      {/* Search + filtros */}
      <section style={{ padding: '28px 0 20px', borderBottom: '1px solid var(--rule)', background: 'var(--card)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Input principal */}
          <div>
            <div className="eyebrow-muted" style={{ marginBottom: 8 }}>🔍 Buscador de subvenciones</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="text"
                placeholder="Busca por beneficiario, organismo o descripción…"
                value={searchQ}
                onChange={e => { setSearchQ(e.target.value); handleSearchChange(e.target.value, searchTipo); }}
                style={{
                  flex: 1, padding: '11px 14px',
                  border: '1px solid var(--accent)', borderRadius: 4,
                  background: 'var(--background)', color: 'var(--foreground)',
                  fontSize: 14, fontFamily: 'inherit', outline: 'none',
                }}
              />
              {(searchQ || searchTipo || searchImporte > 0) && (
                <button onClick={() => { setSearchQ(''); setSearchTipo(''); setSearchImporte(0); setSearchResults(null); }}
                  style={{ padding: '0 16px', border: '1px solid var(--card-border)', borderRadius: 4, background: 'transparent', color: 'var(--muted)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                  Limpiar todo
                </button>
              )}
            </div>
          </div>

          {/* Filtros en fila */}
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>

            {/* Tipo de beneficiario */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Tipo de beneficiario</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[{ k: '', l: 'Todos' }, ...TIPOS_BENEFICIARIO.map(t => ({ k: t, l: t }))].map(f => (
                  <button key={f.k} onClick={() => { setSearchTipo(f.k); handleSearchChange(searchQ, f.k); }}
                    style={{
                      padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit',
                      border: '1px solid ' + (searchTipo === f.k ? 'var(--accent)' : 'var(--card-border)'),
                      background: searchTipo === f.k ? 'var(--accent)' : 'transparent',
                      color: searchTipo === f.k ? '#fff' : 'var(--foreground)',
                    }}>{f.l}</button>
                ))}
              </div>
            </div>

            {/* Importe mínimo */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Importe mínimo</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ k: 0, l: 'Todos' }, { k: 100_000, l: '≥ 100k€' }, { k: 1_000_000, l: '≥ 1M€' }, { k: 10_000_000, l: '≥ 10M€' }].map(f => (
                  <button key={f.k} onClick={() => setSearchImporte(f.k)}
                    style={{
                      padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 3, cursor: 'pointer', fontFamily: 'var(--font-mono), monospace',
                      border: '1px solid ' + (searchImporte === f.k ? 'var(--accent)' : 'var(--card-border)'),
                      background: searchImporte === f.k ? 'var(--accent)' : 'transparent',
                      color: searchImporte === f.k ? '#fff' : 'var(--foreground)',
                    }}>{f.l}</button>
                ))}
              </div>
            </div>

            {/* Ordenar */}
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Ordenar por</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ k: 'importe' as const, l: 'Mayor importe' }, { k: 'fecha' as const, l: 'Más recientes' }].map(f => (
                  <button key={f.k} onClick={() => setSearchSort(f.k)}
                    style={{
                      padding: '6px 12px', fontSize: 12, fontWeight: 600, borderRadius: 3, cursor: 'pointer', fontFamily: 'inherit',
                      border: '1px solid ' + (searchSort === f.k ? 'var(--foreground)' : 'var(--card-border)'),
                      background: searchSort === f.k ? 'var(--foreground)' : 'transparent',
                      color: searchSort === f.k ? 'var(--background)' : 'var(--foreground)',
                    }}>{f.l}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
          <PageLoader />
        </div>
      )}

      {error && (
        <div style={{ padding: '80px 24px', textAlign: 'center' }}>
          <p style={{ color: 'var(--bad)', marginBottom: 16 }}>{error}</p>
          <button
            onClick={load}
            style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 0, borderRadius: 4, fontWeight: 700, cursor: 'pointer' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {data && !loading && (
        <>
          {/* Stats */}
          <section style={{ padding: '32px 0', borderBottom: '1px solid var(--rule)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                border: '1px solid var(--card-border)',
                borderRadius: 4,
                background: 'var(--card)',
                overflow: 'hidden',
              }}>
                {data.stats.map((k, i) => (
                  <div
                    key={k.label}
                    style={{ padding: '22px 24px', borderRight: i === data.stats.length - 1 ? 0 : '1px solid var(--card-border)' }}
                  >
                    <div className="eyebrow-muted" style={{ marginBottom: 10 }}>{k.label}</div>
                    <div className="mono" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 6 }}>{k.value}</div>
                    <div className="mono" style={{ fontSize: 11, color: k.bad ? 'var(--bad)' : 'var(--good)', fontWeight: 700 }}>
                      {k.bad ? '▲ ' : '·  '}{k.delta}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Top perceptores + distribución */}
          <section style={{ padding: '48px 0', borderBottom: '1px solid var(--rule)' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48 }} className="subv-grid">

                {/* Top 8 or search results */}
                <div>
                  {searchResults !== null ? (
                    <>
                      <div className="eyebrow" style={{ marginBottom: 10 }}>
                        Resultados de búsqueda ({displayRows.length})
                      </div>
                      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
                        {displayRows.length === 0 ? 'Sin resultados' : `${displayRows.length} concesiones encontradas`}
                      </h2>
                    </>
                  ) : (
                    <>
                      <div className="eyebrow" style={{ marginBottom: 10 }}>Top {data.top.length} perceptores</div>
                      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.02em', textWrap: 'balance' }}>
                        Los que más se llevan, ordenados de mayor a menor.
                      </h2>
                    </>
                  )}
                  {searchLoading ? (
                    <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
                      <PageLoader />
                    </div>
                  ) : (
                    <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)' }}>
                      {displayRows.map((row, i) => {
                        const rows = displayRows;
                        return (
                          <div
                            key={row.rank}
                            style={{
                              padding: '16px 18px',
                              borderBottom: i === rows.length - 1 ? 0 : '1px solid var(--rule)',
                              display: 'grid',
                              gridTemplateColumns: '32px 1fr 130px',
                              gap: 14,
                              alignItems: 'center',
                            }}
                          >
                            <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
                              {String(row.rank).padStart(2, '0')}.
                            </div>
                            <div>
                              <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 3 }}>{row.beneficiario}</div>
                              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                                {row.concepto} · {row.organismo}
                              </div>
                            </div>
                            <div
                              className="mono"
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                textAlign: 'right',
                                color: row.rank <= 2 ? 'var(--accent)' : 'var(--foreground)',
                              }}
                            >
                              {fmt(row.importe)}
                            </div>
                          </div>
                        );
                      })}
                      {displayRows.length === 0 && (
                        <div style={{ padding: '32px 18px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                          No se encontraron resultados para tu búsqueda.
                        </div>
                      )}
                    </div>
                  )}
                  {data.meta && searchResults === null && (
                    <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                      Fuente: {data.meta.source} · {new Date(data.meta.lastUpdated).toLocaleString('es-ES')}
                    </p>
                  )}
                </div>

                {/* Distribución por tipo */}
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Distribución por tipo</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
                    ¿Quién recibe?
                  </h2>
                  <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', padding: 20 }}>
                    {data.porTipo.map((t, i) => (
                      <PieRow key={t.tipo} t={t} idx={i} last={i === data.porTipo.length - 1} />
                    ))}
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--rule)', fontSize: 12, color: 'var(--muted)' }}>
                      El <strong style={{ color: 'var(--accent)' }}>
                        {data.porTipo[0]?.pct ?? 27.1}%
                      </strong> del dinero público en subvenciones
                      acaba en otras administraciones públicas. Es decir: el Estado se subvenciona a sí mismo.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Metodología */}
          <section style={{ padding: '40px 0 64px' }}>
            <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
              <div style={{
                border: '1px solid var(--card-border)',
                borderRadius: 4,
                padding: '28px 32px',
                background: 'var(--card)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 24,
              }}>
                <div style={{ fontSize: 32 }}>📊</div>
                <div>
                  <div className="eyebrow" style={{ marginBottom: 8 }}>Metodología y fuente</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
                    Datos directos de la BDNS — actualizados cada 24h
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted-strong)', margin: 0 }}>
                    Los datos se obtienen en tiempo real de la API pública de la Base de Datos Nacional de
                    Subvenciones (BDNS) del Ministerio de Hacienda. El ranking muestra las concesiones de
                    mayor importe individual. Los porcentajes de distribución por tipo de beneficiario son
                    estimaciones basadas en el informe anual consolidado.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
