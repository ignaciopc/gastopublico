'use client';

import { useState, useEffect } from 'react';

// Plazo límite para ejecutar los fondos del PNRR/MRR
// El Reglamento (UE) 2021/241 fija el 31 de agosto de 2026 como fecha límite
const DEADLINE = new Date('2026-08-31T23:59:59');
const FONDOS_SIN_EJECUTAR = 128_500; // M€

function calcRemaining() {
  const now = Date.now();
  const ms = DEADLINE.getTime() - now;
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, expired: false };
}

export default function FondosUECountdown() {
  const [rem, setRem] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRem(calcRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div style={{
      background: 'rgba(239,77,104,0.06)',
      border: '1px solid rgba(239,77,104,0.35)',
      borderRadius: 4,
      padding: '20px 24px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#ef4d68',
          display: 'inline-block', animation: 'pulse 1.6s ease-in-out infinite',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#ef4d68',
          fontFamily: 'var(--font-mono), monospace',
        }}>
          CUENTA ATRÁS · FONDOS UE
        </span>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#ededeb',
          lineHeight: 1.4, marginBottom: 4,
        }}>
          Plazo para ejecutar{' '}
          <span style={{ color: '#ef4d68', fontFamily: 'var(--font-mono), monospace' }}>
            {FONDOS_SIN_EJECUTAR.toLocaleString('es-ES')} M€
          </span>{' '}
          en fondos Next Generation EU
        </div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)' }}>
          Reglamento (UE) 2021/241 — Deadline: 31 agosto 2026
        </div>
      </div>

      {/* Countdown digits */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8, marginBottom: 12,
      }}>
        {[
          { val: rem.days, label: 'días' },
          { val: rem.hours, label: 'horas' },
          { val: rem.minutes, label: 'min' },
          { val: rem.seconds, label: 'seg' },
        ].map(({ val, label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em',
              color: '#ef4d68', lineHeight: 1,
            }}>
              {label === 'días' ? val.toLocaleString('es-ES') : pad(val)}
            </div>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
              marginTop: 5,
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5,
        borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10,
      }}>
        El Reglamento (UE) 2021/241 fija el 31 de agosto de 2026 como fecha límite de ejecución
        y no contempla prórroga. Tasa de ejecución de España a cierre de 2024:{' '}
        <strong style={{ color: 'rgba(255,255,255,0.65)' }}>21,4%</strong>.
      </div>
    </div>
  );
}
