'use client';

import { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { PageLoader } from '@/components/ui/Spinner';
import type { Contract } from '@/lib/types';

interface ContratoItem {
  fecha: string;
  hora: string;
  objeto: string;
  organismo: string;
  proc: string;
  licit: number;
  adjud: string;
  estado: string;
  importe: number;
  flag: string;
  enlace: string;
}

interface StatsKpi {
  label: string;
  value: string;
  delta: string;
  bad: boolean;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid var(--card-border)',
  background: 'var(--background)', color: 'var(--foreground)',
  borderRadius: 3, fontSize: 13, fontFamily: 'inherit',
};

function fmtImp(n: number): string {
  return n >= 1_000_000 ? (n / 1_000_000).toFixed(2) + ' M€' : n.toLocaleString('es-ES') + ' €';
}

function fmtFecha(f: string): string {
  return new Date(f).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function ContratoRow({ row, last }: { row: ContratoItem; last: boolean }) {
  const [open, setOpen] = useState(false);
  const flagged = !!row.flag;
  return (
    <div style={{
      borderBottom: last ? 0 : '1px solid var(--rule)',
      background: flagged ? 'color-mix(in srgb, var(--accent-light) 60%, transparent)' : 'transparent',
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          padding: '14px 18px', display: 'grid', gap: 14,
          gridTemplateColumns: '120px 1fr 200px 140px 30px',
          alignItems: 'center', cursor: 'pointer', fontSize: 14,
        }}
        className="contratos-row"
      >
        <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.4 }}>
          <div style={{ color: 'var(--foreground)', fontWeight: 600 }}>{fmtFecha(row.fecha)}</div>
          <div>{row.hora}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 3 }}>{row.objeto}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
            {row.organismo} · {row.proc}
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted-strong)' }}>{row.adjud}</div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 14, fontWeight: 600, color: flagged ? 'var(--accent)' : 'var(--foreground)' }}>
            {fmtImp(row.importe)}
          </div>
          {flagged && (
            <div className="mono" style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              ⚑ {row.flag}
            </div>
          )}
        </div>
        <span style={{ color: 'var(--muted)', display: 'inline-block', transform: open ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>›</span>
      </div>
      {open && (
        <div style={{
          padding: '14px 18px 18px 138px', borderTop: '1px solid var(--rule)',
          background: 'var(--card)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, fontSize: 12.5,
        }}>
          <div><div className="eyebrow-muted" style={{ marginBottom: 4 }}>Fecha completa</div>{row.fecha} · {row.hora}</div>
          <div><div className="eyebrow-muted" style={{ marginBottom: 4 }}>Tipo de contrato</div>{row.proc}</div>
          <div>
            <div className="eyebrow-muted" style={{ marginBottom: 4 }}>Adjudicatario</div>
            {row.adjud}
          </div>
          {row.enlace && row.enlace !== '#' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <a href={row.enlace} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono), monospace' }}>
                Ver en PLACE →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function buildStats(list: ContratoItem[]): StatsKpi[] {
  const maxDate = list.reduce((a, b) => a.fecha > b.fecha ? a : b, list[0])?.fecha ?? '';
  const hoy = list.filter(c => c.fecha === maxDate);
  const totalHoy = hoy.reduce((a, b) => a + b.importe, 0);
  const grandes = list.filter(c => c.importe >= 5_000_000);
  const organismos = new Set(list.map(c => c.organismo)).size;
  const medio = list.length > 0 ? list.reduce((a, b) => a + b.importe, 0) / list.length : 0;

  return [
    { label: 'Total adjudicado (último día)', value: fmtImp(totalHoy), delta: `${hoy.length} contratos`, bad: false },
    { label: 'Grandes contratos', value: String(grandes.length), delta: '≥ 5 M€', bad: true },
    { label: 'Organismos activos', value: String(organismos), delta: 'en el feed actual', bad: false },
    { label: 'Importe medio', value: fmtImp(medio), delta: 'por licitación', bad: false },
  ];
}

function toItem(c: Contract): ContratoItem {
  const dateObj = new Date(c.fechaPublicacion);
  return {
    fecha: c.fechaPublicacion.split('T')[0],
    hora: dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
    objeto: c.titulo,
    organismo: c.organoContratante,
    proc: c.tipo,
    licit: 1,
    adjud: c.adjudicatario || (c.estado === 'adjudicado' ? 'Adjudicado' : c.estado === 'resuelto' ? 'Resuelto' : c.estado === 'anulado' ? 'Anulado' : 'En proceso…'),
    estado: c.estado,
    importe: c.importe,
    flag: c.importe >= 5_000_000 ? 'grandes' : '',
    enlace: c.enlace,
  };
}

export default function ContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('fecha');
  const [period, setPeriod] = useState('all');
  const [organismo, setOrganismo] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/contratos')
      .then(r => r.json())
      .then(j => setContracts(j.data || []))
      .catch(() => setError('No se pudieron cargar los datos de contratos.'))
      .finally(() => setLoading(false));
  }, []);

  const list = useMemo(() => contracts.map(toItem), [contracts]);
  const stats = useMemo(() => list.length > 0 ? buildStats(list) : [], [list]);

  const organismos = useMemo(() => {
    const s = new Set(list.map(x => x.organismo));
    return ['all', ...Array.from(s).sort()];
  }, [list]);

  const filtered = useMemo(() => {
    let result = [...list];
    if (filter === 'grandes') result = result.filter(x => x.importe >= 5_000_000);
    if (filter === 'directa') result = result.filter(x => x.flag === 'directa');
    if (filter === 'completados') result = result.filter(x => x.estado === 'adjudicado' || x.estado === 'resuelto' || x.estado === 'anulado');
    if (organismo !== 'all') result = result.filter(x => x.organismo === organismo);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(x => x.objeto.toLowerCase().includes(q) || x.adjud.toLowerCase().includes(q));
    }
    if (list.length > 0) {
      const maxDate = list.reduce((a, b) => a.fecha > b.fecha ? a : b).fecha;
      const ref = new Date(maxDate);
      if (period === 'today') result = result.filter(x => x.fecha === maxDate);
      if (period === 'week') {
        const ago = new Date(ref); ago.setDate(ref.getDate() - 7);
        result = result.filter(x => new Date(x.fecha) >= ago);
      }
      if (period === 'month') {
        const ago = new Date(ref); ago.setMonth(ref.getMonth() - 1);
        result = result.filter(x => new Date(x.fecha) >= ago);
      }
    }
    if (dateFrom) result = result.filter(x => x.fecha >= dateFrom);
    if (dateTo) result = result.filter(x => x.fecha <= dateTo);
    if (sort === 'importe') result.sort((a, b) => b.importe - a.importe);
    else result.sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
    return result;
  }, [list, filter, sort, period, organismo, dateFrom, dateTo, search]);

  const totalFiltrado = filtered.reduce((a, b) => a + b.importe, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <PageLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--bad)' }}>{error}</p>
      </div>
    );
  }

  const topImporte = filtered.length > 0 ? fmtImp(Math.max(...filtered.map(c => c.importe))) : '—';

  return (
    <>
      <PageHeader
        eyebrow="Contratación pública · En directo"
        title={`${fmtImp(totalFiltrado)} en el feed actual. ¿Sabes a quién?`}
        lede="Cada licitación y adjudicación del sector público estatal pasa por nuestro radar. Filtra por organismo, fechas, importe o tipo de contrato."
        meta={[
          { k: 'Fuente', v: 'PLACE · Plataforma de Contratación' },
          { k: 'Actualización', v: 'Cron diario · 06:00 UTC' },
          { k: 'Contratos cargados', v: String(list.length) },
        ]}
      />

      {/* Stats */}
      <section style={{ padding: '32px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'hidden',
          }}>
            {stats.map((k, i) => (
              <div key={k.label} style={{ padding: '22px 24px', borderRight: i === stats.length - 1 ? 0 : '1px solid var(--card-border)' }}>
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

      {/* Period switcher */}
      <section style={{ padding: '24px 0 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {[
              { k: 'today', l: 'Último día' },
              { k: 'week', l: 'Última semana' },
              { k: 'month', l: 'Último mes' },
              { k: 'all', l: 'Todos' },
            ].map(p => (
              <button key={p.k} onClick={() => setPeriod(p.k)} style={{
                padding: '8px 16px',
                border: '1px solid ' + (period === p.k ? 'var(--foreground)' : 'var(--card-border)'),
                background: period === p.k ? 'var(--foreground)' : 'transparent',
                color: period === p.k ? 'var(--background)' : 'var(--foreground)',
                fontSize: 12, fontWeight: 700, borderRadius: 3, cursor: 'pointer',
                fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>{p.l}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '8px 0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            border: '1px solid var(--card-border)', borderRadius: 4, padding: 16,
            background: 'var(--card)',
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12,
          }} className="contratos-filtros">
            <div>
              <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Buscar</div>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Objeto o adjudicatario…" style={inputStyle} />
            </div>
            <div>
              <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Organismo</div>
              <select value={organismo} onChange={e => setOrganismo(e.target.value)} style={inputStyle}>
                {organismos.map(o => <option key={o} value={o}>{o === 'all' ? 'Todos' : o}</option>)}
              </select>
            </div>
            <div>
              <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Desde</div>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <div className="eyebrow-muted" style={{ marginBottom: 6 }}>Hasta</div>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={inputStyle} />
            </div>
          </div>
        </div>
      </section>

      {/* Flag filters + sort + totals */}
      <section style={{ padding: '0 0 24px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { k: 'all', l: 'Todos' },
                { k: 'grandes', l: '≥ 5 M€' },
                { k: 'completados', l: '✅ Completados' },
              ].map(f => (
                <button key={f.k} onClick={() => setFilter(f.k)} style={{
                  padding: '8px 14px',
                  border: '1px solid ' + (filter === f.k ? 'var(--accent)' : 'var(--card-border)'),
                  background: filter === f.k ? 'var(--accent)' : 'transparent',
                  color: filter === f.k ? '#fff' : 'var(--foreground)',
                  fontSize: 12, fontWeight: 600, borderRadius: 3, cursor: 'pointer',
                  fontFamily: 'var(--font-mono), monospace',
                }}>{f.l}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                <strong style={{ color: 'var(--foreground)' }}>{filtered.length}</strong> resultados ·{' '}
                <strong style={{ color: 'var(--accent)' }}>{fmtImp(totalFiltrado)}</strong>
                {filtered.length > 0 && <> · mayor: <strong style={{ color: 'var(--foreground)' }}>{topImporte}</strong></>}
              </span>
              <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inputStyle, width: 'auto' }}>
                <option value="fecha">Más recientes</option>
                <option value="importe">Mayor importe</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section style={{ padding: '0 0 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ border: '1px solid var(--card-border)', borderRadius: 4, background: 'var(--card)', overflow: 'hidden' }}>
            {filtered.map((row, i) => (
              <ContratoRow key={row.fecha + row.objeto + i} row={row} last={i === filtered.length - 1} />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Sin resultados.</div>
            )}
          </div>
          <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 14 }}>
            ⚑ <span style={{ color: 'var(--accent)' }}>grandes</span> = importe ≥ 5 M€ · Datos: PLACE · Plataforma de Contratación del Estado
          </p>
        </div>
      </section>
    </>
  );
}
