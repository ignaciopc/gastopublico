const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const EUR_COMPACT_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  notation: 'compact',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const PERCENT_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const NUMBER_COMPACT_FORMATTER = new Intl.NumberFormat('es-ES', {
  notation: 'compact',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function formatEUR(value: number, compact = false): string {
  if (compact) return EUR_COMPACT_FORMATTER.format(value);
  return EUR_FORMATTER.format(value);
}

export function formatPercent(value: number): string {
  return PERCENT_FORMATTER.format(value / 100);
}

export function formatNumber(value: number, compact = false): string {
  if (compact) return NUMBER_COMPACT_FORMATTER.format(value);
  return new Intl.NumberFormat('es-ES').format(value);
}

export function formatDateES(isoString: string): string {
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(isoString));
  } catch {
    return isoString;
  }
}

export function formatDelta(delta: number): {
  symbol: string;
  colorClass: string;
  formatted: string;
} {
  const formatted = `${delta > 0 ? '+' : ''}${delta.toFixed(1)}%`;
  if (delta > 0) {
    return { symbol: '↑', colorClass: 'text-green-600 dark:text-green-400', formatted };
  } else if (delta < 0) {
    return { symbol: '↓', colorClass: 'text-red-600 dark:text-red-400', formatted };
  }
  return { symbol: '→', colorClass: 'text-zinc-500', formatted };
}

export function millionsToFull(millones: number): number {
  return millones * 1_000_000;
}
