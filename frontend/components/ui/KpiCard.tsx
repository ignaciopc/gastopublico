import { formatEUR, formatPercent, formatNumber } from '@/lib/formatters';

interface KpiCardProps {
  label: string;
  value: number;
  format?: 'currency' | 'percent' | 'number';
  compact?: boolean;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  description?: string;
}

export default function KpiCard({
  label,
  value,
  format = 'currency',
  compact = true,
  delta,
  deltaLabel,
  icon,
  description,
}: KpiCardProps) {
  const formatted =
    format === 'currency'
      ? formatEUR(value, compact)
      : format === 'percent'
      ? formatPercent(value)
      : formatNumber(value, compact);

  const deltaPositive = delta !== undefined && delta >= 0;

  return (
    <div className="bg-card border border-card-border rounded-xl p-5 flex flex-col gap-3 hover:border-accent transition-colors group">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
        {icon && (
          <span className="text-muted group-hover:text-accent transition-colors">
            {icon}
          </span>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-bold tracking-tight leading-none">{formatted}</p>
      {(delta !== undefined || description) && (
        <div className="flex items-center gap-2 flex-wrap">
          {delta !== undefined && (
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                deltaPositive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {deltaPositive ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {deltaLabel && <span className="text-xs text-muted">{deltaLabel}</span>}
          {description && !deltaLabel && <span className="text-xs text-muted">{description}</span>}
        </div>
      )}
    </div>
  );
}
