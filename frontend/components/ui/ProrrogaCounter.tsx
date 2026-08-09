'use client';

import { useState, useEffect } from 'react';
import { ULTIMO_EJERCICIO_APROBADO } from './EjerciciosProrrogados';

// Inicio de la prórroga vigente: 1 de enero de 2024, primer ejercicio regido por
// prórroga automática de los PGE 2023 (Ley 31/2022, de 23 de diciembre).
const INICIO_PRORROGA = new Date(`${ULTIMO_EJERCICIO_APROBADO + 1}-01-01T00:00:00`);

function calcDiff() {
  const ms = Date.now() - INICIO_PRORROGA.getTime();
  const totalDays = Math.floor(ms / 86_400_000);
  const years = Math.floor(totalDays / 365.25);
  const months = Math.floor((totalDays % 365.25) / 30.44);
  const remainDays = Math.floor(((totalDays % 365.25) % 30.44));
  return { totalDays, years, months, remainDays };
}

export default function ProrrogaCounter() {
  const [diff, setDiff] = useState(calcDiff);

  useEffect(() => {
    const id = setInterval(() => setDiff(calcDiff()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40, flexWrap: 'wrap' }}>
      <div>
        <div style={{
          fontSize: 'clamp(64px, 11vw, 120px)',
          fontWeight: 900,
          fontFamily: 'var(--font-mono), monospace',
          color: '#ef4d68',
          letterSpacing: '-0.04em',
          lineHeight: 0.9,
        }}>
          {diff.totalDays.toLocaleString('es-ES')}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: 10 }}>
          días de prórroga presupuestaria
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>
          Desde el 1 de enero de {ULTIMO_EJERCICIO_APROBADO + 1}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 28, paddingBottom: 12 }}>
        {[
          { val: diff.years, label: 'años' },
          { val: diff.months, label: 'meses' },
          { val: diff.remainDays, label: 'días' },
        ].map(({ val, label }) => (
          <div key={label}>
            <div style={{ fontSize: 40, fontWeight: 700, fontFamily: 'var(--font-mono), monospace', color: '#ededeb', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {val}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
