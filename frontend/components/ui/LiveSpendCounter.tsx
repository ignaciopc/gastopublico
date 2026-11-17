'use client';

import { useState, useEffect, useMemo } from 'react';

// Estimación. Empleos no financieros del conjunto de las AAPP en 2025: 764.884 M€
// (IGAE, Informe trimestral de las AAPP, 4T 2025, contabilidad nacional).
// 764.884e6 / (365 × 86.400) = 24.254 €/s, aplicado desde el 1 de enero del año en curso.
const DEFAULT_RATE = 24_254;

function secondsSinceYearStart() {
  const now = new Date();
  const yearStart = new Date(now.getFullYear(), 0, 1);
  return (now.getTime() - yearStart.getTime()) / 1000;
}

export default function LiveSpendCounter({ ratePerSecond = DEFAULT_RATE }: { ratePerSecond?: number }) {
  const [value, setValue] = useState(() => secondsSinceYearStart() * ratePerSecond);

  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setValue((v: number) => v + dt * ratePerSecond);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [ratePerSecond]);

  const bucket = Math.floor(value / 100);
  const formatted = useMemo(() => {
    return Math.floor(value).toLocaleString('es-ES');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket]);

  return (
    <span
      className="mono tick-flash"
      style={{
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }}
    >
      {formatted}<span style={{ color: 'var(--muted)', marginLeft: 4 }}>€</span>
    </span>
  );
}
