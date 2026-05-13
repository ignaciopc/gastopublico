'use client';

import { useState, useEffect, useMemo } from 'react';

const DEFAULT_RATE = 18490;
const STORAGE_KEY = 'gp_spend_baseline_v1';

export default function LiveSpendCounter({ ratePerSecond = DEFAULT_RATE }: { ratePerSecond?: number }) {
  const [value, setValue] = useState(() => {
    // Try to restore from localStorage for continuity across refreshes
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.t && saved.v) {
        const elapsed = (Date.now() - saved.t) / 1000;
        return saved.v + elapsed * ratePerSecond;
      }
    } catch (_e) {}
    // Fallback: approximate spending so far this year
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const secondsThisYear = (now.getTime() - yearStart.getTime()) / 1000;
    return secondsThisYear * ratePerSecond;
  });

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

    // Persist baseline every 5 seconds
    const interval = setInterval(() => {
      try {
        setValue((v: number) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ t: Date.now(), v }));
          return v;
        });
      } catch (_e) {}
    }, 5000);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
    };
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
