'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageHeader from '@/components/ui/PageHeader';
import { PageLoader } from '@/components/ui/Spinner';

function SearchInit({ onQ }: { onQ: (q: string) => void }) {
  const params = useSearchParams();
  useEffect(() => {
    const q = params.get('q') ?? '';
    if (q) onQ(q);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

interface StatKpi {
  label: string;
  value: string;
  note: string;
}

interface TopConcesion {
  rank: number;
  beneficiario: string;
  concepto: string;
  organismo: string;
  fecha: string | null;
  importe: number;
}

interface NivelRow {
  nivel: string;
  pct: number;
  importe: number;
  n: number;
}

interface SubvencionesData {
  disponible: boolean;
  stats: StatKpi[];
  top: TopConcesion[];
  porNivel: NivelRow[];
  meta: {
    source: string;
    concesiones: number;
    fechaMin: string | null;
    fechaMax: string | null;
    ultimaSincronizacion: string | null;
  };
}

interface SearchResult extends TopConcesion {
  tipo_beneficiario: string;
}

// Valores reales de la columna tipo_beneficiario: es el nivel de la administración
// CONCEDENTE (campo nivel1 de la BDNS), no el tipo de beneficiario.
const NIVELES_CONCEDENTE = [
  'Administración Autonómica',
  'Administración Local',
  'Otros',
];

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString('es-ES', { maximumFractionDigits: 1 }) + ' M€';
  return n.toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' €';
}

function fmtFecha(iso: string | null): string {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

function PieRow({ t, idx, last }: { t: NivelRow; idx: number; last: boolean }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setW(t.pct), 80 + idx * 60);
    return () => clearTimeout(id);
  }, [t.pct, idx]);
  return (
    <div style={{ marginBottom: last ? 0 : 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
        <span style={{ fontWeight: 600 }}>{t.nivel}</span>
        <span className="mono" style={{ fontWeight: 600 }}>{t.pct.toLocaleString('es-ES')}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--background)', borderRadius: 1, overflow: 'hidden', border: '1px solid var(--rule)' }}>
        <div style={{
          height: '100%',
          width: `${w}%`,
          maxWidth: '100%',
          background: 'var(--foreground)',
          transition: 'width 1s cubic-bezier(0.2, 0.7, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}

export default function SubvencionesPage() {
  const [data, setData] = useState<SubvencionesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQ, setSearchQ] = useState('');
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

  const displayRows = useMemo(() => {
    let rows: (SearchResult | TopConcesion)[] = searchResults ?? data?.top ?? [];
    if (searchImporte > 0) rows = rows.filter(r => r.importe >= searchImporte);
    if (searchSort === 'importe') rows = [...rows].sort((a, b) => b.importe - a.importe);
    else rows = [...rows].sort((a, b) => (b.fecha ?? '').localeCompare(a.fecha ?? ''));
    return rows;
  }, [searchResults, data?.top, searchImporte, searchSort]);

  const n = data?.meta.concesiones ?? 0;

  return (
    <>
      <Suspense fallback={null}>
        <SearchInit onQ={q => { setSearchQ(q); handleSearchChange(q, searchTipo); }} />
      </Suspense>
      <PageHeader
        eyebrow="Subvenciones · Base de Datos Nacional"
        title="Concesiones de subvenciones sincronizadas desde la BDNS"
        lede="Copia parcial de las concesiones publicadas en la Base de Datos Nacional de Subvenciones (BDNS): cada día se descargan las últimas concesiones publicadas y se guardan aquí. Las cifras de esta página se calculan sobre esa copia y no representan el total nacional."
        meta={[
          { k: 'Fuente', v: 'BDNS · Ministerio de Hacienda (IGAE)' },
          { k: 'Concesiones sincronizadas', v: n > 0 ? n.toLocaleString('es-ES') : '—' },
          { k: 'Fechas', v: data?.meta.fechaMin ? `${fmtFecha(data.meta.fechaMin)} – ${fmtFecha(data.meta.fechaMax)}` : '—' },
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
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Administración concedente</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {[{ k: '', l: 'Todas' }, ...NIVELES_CONCEDENTE.map(t => ({ k: t, l: t }))].map(f => (
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
                {[{ k: 'importe' as const, l: 'Mayor importe' }, { k: 'fecha' as const, l: 'Fecha de concesión' }].map(f => (
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

      {data && !loading && !data.disponible && (
        <div style={{ padding: '64px 24px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
          Datos no disponibles: no se han podido leer las concesiones sincronizadas.
        </div>
      )}

      {data && !loading && data.disponible && (
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
                    <div className="mono" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 6 }}>{k.value}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700 }}>
                      {k.note}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                Calculado sobre las {n.toLocaleString('es-ES')} concesiones sincronizadas, no sobre el total nacional de la BDNS.
              </p>
            </div>
          </section>

          {/* Top concesiones + distribución */}
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
                      <div className="eyebrow" style={{ marginBottom: 10 }}>{data.top.length} concesiones de mayor importe</div>
                      <h2 style={{ fontSize: 26, fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.02em', textWrap: 'balance' }}>
                        Concesiones sincronizadas ordenadas por importe
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
                                {row.concepto} · {row.organismo} · {fmtFecha(row.fecha)}
                              </div>
                            </div>
                            <div
                              className="mono"
                              style={{
                                fontSize: 15,
                                fontWeight: 600,
                                textAlign: 'right',
                                color: 'var(--foreground)',
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
                  <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                    Fuente: {data.meta.source}
                    {data.meta.ultimaSincronizacion && <> · última sincronización {new Date(data.meta.ultimaSincronizacion).toLocaleString('es-ES')}</>}
                    {searchResults !== null && <> · máximo 100 resultados por búsqueda</>}
                  </p>
                </div>

                {/* Distribución por tipo */}
                <div>
                  <div className="eyebrow" style={{ marginBottom: 10 }}>Distribución por importe</div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 18px', letterSpacing: '-0.02em' }}>
                    Por nivel de la administración concedente
                  </h2>
                  <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', padding: 20 }}>
                    {data.porNivel.map((t, i) => (
                      <PieRow key={t.nivel} t={t} idx={i} last={i === data.porNivel.length - 1} />
                    ))}
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--rule)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                      Porcentaje del importe de las {n.toLocaleString('es-ES')} concesiones sincronizadas según
                      el nivel de la administración que concede (campo «nivel 1» de la BDNS). «Otros» agrupa
                      los niveles no clasificados en la sincronización, entre ellos órganos de la
                      Administración General del Estado (p. ej. CDTI o ICO), universidades y grupos de acción local.
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
                    Copia diaria parcial de la BDNS
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--muted-strong)', margin: 0 }}>
                    Cada día a las 06:00 UTC un proceso automático descarga 500 concesiones de la API
                    pública de la BDNS (las primeras que devuelve la API, que en la práctica son las de
                    fecha más reciente) y las añade a esta copia. Por eso la
                    tabla solo contiene concesiones desde que empezó la sincronización y no incluye todas
                    las publicadas. Totales, medias y porcentajes se calculan sobre esa copia. Para
                    consultas completas, usa el buscador oficial del{' '}
                    <a href="https://www.pap.hacienda.gob.es/bdnstrans/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Sistema Nacional de Publicidad de Subvenciones</a>.
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
