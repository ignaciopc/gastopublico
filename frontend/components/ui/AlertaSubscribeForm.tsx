'use client';

import { useState } from 'react';

const TIPOS = [
  { id: 'contratos_grandes', label: 'Contratos > 1 M€', desc: 'Licitaciones y adjudicaciones millonarias' },
  { id: 'subvenciones_destacadas', label: 'Subvenciones destacadas', desc: 'Concesiones de la BDNS por encima de 500.000 €' },
  { id: 'resumen_semanal', label: 'Resumen semanal', desc: 'Digest cada lunes con lo más relevante de la semana' },
];

interface Props {
  compact?: boolean;
}

export default function AlertaSubscribeForm({ compact = false }: Props) {
  const [email, setEmail] = useState('');
  const [tipos, setTipos] = useState<string[]>(['contratos_grandes', 'resumen_semanal']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  function toggleTipo(id: string) {
    setTipos(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || tipos.length === 0) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/alertas/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipos }),
      });
      const data = await res.json() as { message?: string; error?: string };
      if (res.ok) {
        setStatus('ok');
        setMsg(data.message ?? 'Suscripción registrada.');
        setEmail('');
      } else {
        setStatus('error');
        setMsg(data.error ?? 'Error al suscribirse. Inténtalo de nuevo.');
      }
    } catch {
      setStatus('error');
      setMsg('Error de conexión. Inténtalo de nuevo.');
    }
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.es"
          required
          disabled={status === 'loading' || status === 'ok'}
          style={{
            flex: '1 1 200px', minWidth: 0,
            padding: '9px 12px', fontSize: 14,
            border: '1px solid var(--card-border)', borderRadius: 3,
            background: 'var(--background)', color: 'var(--foreground)',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading' || status === 'ok' || !email}
          style={{
            padding: '9px 16px', fontSize: 13, fontWeight: 700, borderRadius: 3,
            background: status === 'ok' ? 'var(--good)' : 'var(--accent)',
            color: '#fff', border: 'none', cursor: 'pointer',
            opacity: status === 'loading' || !email ? 0.6 : 1,
            transition: 'background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          {status === 'loading' ? 'Enviando…' : status === 'ok' ? '✓ Suscrito' : 'Activar alertas'}
        </button>
        {msg && (
          <p style={{ width: '100%', margin: 0, fontSize: 12.5, color: status === 'ok' ? 'var(--good)' : 'var(--bad)' }}>
            {msg}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Tipo selector */}
      <div style={{ marginBottom: 20 }}>
        <div className="eyebrow-muted" style={{ marginBottom: 12 }}>¿Qué quieres vigilar?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TIPOS.map(t => {
            const checked = tipos.includes(t.id);
            return (
              <label key={t.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
                padding: '12px 14px', border: `1px solid ${checked ? 'var(--accent)' : 'var(--card-border)'}`,
                borderRadius: 4, background: checked ? 'var(--accent-light)' : 'var(--card)',
                transition: 'border-color 0.15s, background 0.15s',
              }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleTipo(t.id)}
                  style={{ marginTop: 2, accentColor: 'var(--accent)', width: 15, height: 15, cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.label}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)' }}>{t.desc}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: 14 }}>
        <label htmlFor="alerta-email" className="eyebrow-muted" style={{ display: 'block', marginBottom: 8 }}>
          Tu email
        </label>
        <input
          id="alerta-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.es"
          required
          disabled={status === 'loading' || status === 'ok'}
          style={{
            width: '100%', padding: '10px 13px', fontSize: 14,
            border: '1px solid var(--card-border)', borderRadius: 3,
            background: 'var(--background)', color: 'var(--foreground)',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading' || status === 'ok' || !email || tipos.length === 0}
        style={{
          width: '100%', padding: '12px', fontSize: 14, fontWeight: 700, borderRadius: 3,
          background: status === 'ok' ? 'var(--good)' : 'var(--accent)',
          color: '#fff', border: 'none', cursor: 'pointer',
          opacity: status === 'loading' || !email || tipos.length === 0 ? 0.6 : 1,
          transition: 'background 0.15s',
          marginBottom: 10,
        }}
      >
        {status === 'loading' ? 'Enviando…' : status === 'ok' ? '✓ Suscripción activada' : 'Activar alertas →'}
      </button>

      {msg && (
        <p style={{ margin: 0, fontSize: 13, color: status === 'ok' ? 'var(--good)' : 'var(--bad)' }}>
          {msg}
        </p>
      )}

      <p style={{ margin: '10px 0 0', fontSize: 11.5, color: 'var(--muted)', lineHeight: 1.5 }}>
        Sin spam. Sin publicidad. Puedes cancelar en cualquier momento con un clic.
        Datos tratados conforme al RGPD.
      </p>
    </form>
  );
}
