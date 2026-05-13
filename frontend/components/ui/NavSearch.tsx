'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, FileText, HandCoins, PieChart } from 'lucide-react';

const btnStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 12,
  width: '100%', padding: '11px 14px',
  background: 'transparent', border: '1px solid transparent',
  borderRadius: 5, color: 'var(--foreground)',
  cursor: 'pointer', textAlign: 'left', fontSize: 14,
  fontFamily: 'inherit', transition: 'background 0.1s, border-color 0.1s',
};

const SECTIONS = [
  { path: '/contratos', label: 'Contratos públicos', desc: 'Licitaciones y adjudicaciones PLACE', icon: FileText },
  { path: '/subvenciones', label: 'Subvenciones BDNS', desc: 'Concesiones a empresas, ONGs y personas', icon: HandCoins },
  { path: '/presupuesto', label: 'Presupuesto por ministerio', desc: 'Ejecución IGAE 2022–2024', icon: PieChart },
];

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hover, setHover] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !open &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') { setOpen(false); setQ(''); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const close = () => { setOpen(false); setQ(''); };

  const go = (path: string) => {
    const dest = q.trim() ? `${path}?q=${encodeURIComponent(q.trim())}` : path;
    router.push(dest);
    close();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Buscar"
        title="Buscar (/)"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', border: '1px solid var(--card-border)',
          background: 'var(--card)', color: 'var(--muted)',
          borderRadius: 4, fontSize: 12, cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <Search size={13} />
        <span className="hidden sm:inline">Buscar</span>
        <kbd style={{ fontSize: 10, opacity: 0.5, fontFamily: 'var(--font-mono), monospace' }}>/</kbd>
      </button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 300,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
            paddingTop: 80, paddingLeft: 16, paddingRight: 16,
          }}
          onClick={close}
        >
          <div
            style={{
              width: '100%', maxWidth: 580,
              background: 'var(--card)', border: '1px solid var(--card-border)',
              borderRadius: 10, boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--rule)' }}>
              <Search size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && q.trim()) go('/contratos'); }}
                placeholder="Buscar contratos, subvenciones, ministerios…"
                style={{
                  flex: 1, border: 0, background: 'transparent',
                  color: 'var(--foreground)', fontSize: 16, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button onClick={close} style={{ background: 'transparent', border: 0, color: 'var(--muted)', cursor: 'pointer', padding: 2 }}>
                <X size={16} />
              </button>
            </div>

            {/* Quick actions */}
            <div style={{ padding: '8px 8px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', padding: '6px 8px 8px' }}>
                {q.trim() ? `Buscar "${q}" en…` : 'Ir a…'}
              </div>
              {SECTIONS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.path}
                    onClick={() => go(s.path)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    style={{
                      ...btnStyle,
                      background: hover === i ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                      borderColor: hover === i ? 'color-mix(in srgb, var(--accent) 20%, transparent)' : 'transparent',
                    }}
                  >
                    <span style={{
                      width: 32, height: 32, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      background: 'color-mix(in srgb, var(--accent) 12%, transparent)',
                      borderRadius: 6, flexShrink: 0,
                    }}>
                      <Icon size={15} style={{ color: 'var(--accent)' }} />
                    </span>
                    <span>
                      <div style={{ fontWeight: 600, marginBottom: 2 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.desc}</div>
                    </span>
                  </button>
                );
              })}
            </div>

            <div style={{ padding: '8px 16px 12px', fontSize: 11, color: 'var(--muted)', borderTop: '1px solid var(--rule)', display: 'flex', gap: 16 }}>
              <span><kbd style={{ fontFamily: 'var(--font-mono), monospace' }}>Enter</kbd> → contratos</span>
              <span><kbd style={{ fontFamily: 'var(--font-mono), monospace' }}>Esc</kbd> cerrar</span>
              <span><kbd style={{ fontFamily: 'var(--font-mono), monospace' }}>/</kbd> abrir</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
