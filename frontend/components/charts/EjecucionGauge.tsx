'use client';

interface EjecucionGaugeProps {
  tasa: number;
  label?: string;
  size?: number;
}

export default function EjecucionGauge({ tasa, label = 'Ejecución', size = 120 }: EjecucionGaugeProps) {
  const radius = 40;
  const cx = 60;
  const cy = 60;
  const circumference = Math.PI * radius;
  const progress = Math.min(tasa / 100, 1);
  const strokeDashoffset = circumference * (1 - progress);

  const color =
    tasa >= 90 ? '#10b981' :
    tasa >= 70 ? '#f59e0b' :
    '#ef4444';

  return (
    <div className="flex flex-col items-center gap-1" style={{ width: size }}>
      <svg width={size} height={size * 0.6} viewBox="0 0 120 72">
        {/* Background arc */}
        <path
          d={`M 20 60 A 40 40 0 0 1 100 60`}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d={`M 20 60 A 40 40 0 0 1 100 60`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        {/* Center text */}
        <text x={cx} y={cy + 2} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">
          {tasa.toFixed(1)}%
        </text>
      </svg>
      <p className="text-xs text-[var(--muted)] text-center">{label}</p>
    </div>
  );
}
