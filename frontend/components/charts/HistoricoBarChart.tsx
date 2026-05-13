'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import type { HistoricoSummary } from '@/lib/types';
import { formatEUR } from '@/lib/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const YEAR_COLORS: Record<number, { bg: string; border: string }> = {
  2022: { bg: 'rgba(107, 114, 128, 0.75)', border: 'rgba(107, 114, 128, 1)' },
  2023: { bg: 'rgba(99, 102, 241, 0.75)', border: 'rgba(99, 102, 241, 1)' },
  2024: { bg: 'rgba(220, 38, 38, 0.85)', border: 'rgba(220, 38, 38, 1)' },
};

interface Props {
  data: HistoricoSummary;
  isDark: boolean;
  topN?: number;
}

export default function HistoricoBarChart({ data, isDark, topN = 12 }: Props) {
  const topSecciones = data.secciones.slice(0, topN);
  const labels = topSecciones.map(s => {
    const words = s.descripcion.split(' ');
    // Wrap long labels at ~20 chars
    const lines: string[] = [];
    let line = '';
    for (const w of words) {
      if ((line + ' ' + w).trim().length > 20) {
        lines.push(line.trim());
        line = w;
      } else {
        line = (line + ' ' + w).trim();
      }
    }
    if (line) lines.push(line);
    return lines;
  });

  const datasets = data.años.map(año => ({
    label: String(año),
    data: topSecciones.map(s => (s.datos[año]?.obligacionesReconocidas ?? 0) / 1e9),
    backgroundColor: YEAR_COLORS[año]?.bg ?? 'rgba(100,100,100,0.7)',
    borderColor: YEAR_COLORS[año]?.border ?? 'rgba(100,100,100,1)',
    borderWidth: 1,
    borderRadius: 3,
  }));

  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';

  return (
    <Bar
      data={{ labels, datasets }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: { color: textColor, boxWidth: 12, padding: 16, font: { size: 12 } },
          },
          tooltip: {
            callbacks: {
              title: (items) => {
                const idx = items[0].dataIndex;
                return topSecciones[idx].descripcion;
              },
              label: (item) => {
                const raw = item.raw as number;
                return ` ${item.dataset.label}: ${formatEUR(raw * 1e9, true)}`;
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { size: 10 }, maxRotation: 0 },
            grid: { display: false },
          },
          y: {
            ticks: {
              color: textColor,
              font: { size: 11 },
              callback: (v) => `${v}B€`,
            },
            grid: { color: gridColor },
            title: { display: true, text: 'Miles de millones €', color: textColor, font: { size: 11 } },
          },
        },
      }}
    />
  );
}
