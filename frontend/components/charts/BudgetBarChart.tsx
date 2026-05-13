'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { BudgetBySeccion } from '@/lib/types';
import { formatEUR } from '@/lib/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface BudgetBarChartProps {
  data: BudgetBySeccion[];
  isDark?: boolean;
}

export default function BudgetBarChart({ data, isDark = false }: BudgetBarChartProps) {
  const sorted = [...data].sort((a, b) => b.obligacionesReconocidas - a.obligacionesReconocidas).slice(0, 15);

  const labels = sorted.map(d => {
    const words = d.descripcion.split(' ');
    if (words.length <= 3) return d.descripcion;
    return words.slice(0, 3).join(' ') + '…';
  });

  const textColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? '#1f1f2e' : '#f3f4f6';

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Créditos Definitivos',
        data: sorted.map(d => d.credDefinitivos / 1e9),
        backgroundColor: isDark ? 'rgba(196,30,58,0.25)' : 'rgba(196,30,58,0.15)',
        borderColor: 'rgba(196,30,58,0.6)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Obligaciones Reconocidas',
        data: sorted.map(d => d.obligacionesReconocidas / 1e9),
        backgroundColor: isDark ? 'rgba(196,30,58,0.85)' : 'rgba(196,30,58,0.8)',
        borderColor: '#c41e3a',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: { size: 12 },
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { dataset: { label?: string }; raw: unknown }) =>
            `${ctx.dataset.label}: ${formatEUR(Number(ctx.raw) * 1e9, true)}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor, font: { size: 11 } },
        grid: { color: gridColor },
      },
      y: {
        ticks: {
          color: textColor,
          font: { size: 11 },
          callback: (v: string | number) => `${Number(v).toFixed(0)} MM€`,
        },
        grid: { color: gridColor },
        title: {
          display: true,
          text: 'Miles de millones €',
          color: textColor,
          font: { size: 11 },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
