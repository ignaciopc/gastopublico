'use client';

import { useState, useEffect, useMemo } from 'react';

// Deuda pública a 1 enero 2025: ~1.640.000 M€ (Banco de España / BdE)
// Crecimiento 2024: +47.800 M€ → 1.515 €/segundo (proyección 2025 similar)
const DEUDA_BASELINE = 1_640_000_000_000;
const BASELINE_DATE = new Date('2025-01-01T00:00:00').getTime();
const RATE_PER_SECOND = 1_515; // €/s

function calcDeuda() {
  const elapsed = (Date.now() - BASELINE_DATE) / 1000;
  return DEUDA_BASELINE + elapsed * RATE_PER_SECOND;
}

export default function DeudaCounter() {
  const [value, setValue] = useState(calcDeuda);

  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setValue(v => v + dt * RATE_PER_SECOND);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const bucket = Math.floor(value / 100_000);
  const formatted = useMemo(() => {
    const billions = value / 1_000_000_000_000;
    return billions.toLocaleString('es-ES', { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket]);

  return (
    <span
      className="mono"
      style={{
        display: 'inline-block',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
      }}
    >
      {formatted}<span style={{ color: 'rgba(255,255,255,0.45)', marginLeft: 4, fontSize: '0.55em', verticalAlign: 'middle' }}>billones €</span>
    </span>
  );
}
