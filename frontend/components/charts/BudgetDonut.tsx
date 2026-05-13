'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { BudgetBySeccion } from '@/lib/types';
import { formatEUR } from '@/lib/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = [
  '#c41e3a', '#e53e5c', '#f87171', '#fca5a5',
  '#1e40af', '#3b82f6', '#60a5fa', '#93c5fd',
  '#065f46', '#10b981', '#34d399', '#6ee7b7',
  '#92400e', '#f59e0b', '#fcd34d', '#fef08a',
];

interface BudgetDonutProps {
  data: BudgetBySeccion[];
  isDark?: boolean;
}

export default function BudgetDonut({ data, isDark = false }: BudgetDonutProps) {
  const top10 = [...data]
    .sort((a, b) => b.obligacionesReconocidas - a.obligacionesReconocidas)
    .slice(0, 10);

  const textColor = isDark ? '#9ca3af' : '#6b7280';

  const chartData = {
    labels: top10.map(d => {
      const words = d.descripcion.split(' ');
      return words.length <= 3 ? d.descripcion : words.slice(0, 3).join(' ') + '…';
    }),
    datasets: [
      {
        data: top10.map(d => d.obligacionesReconocidas / 1e9),
        backgroundColor: PALETTE.slice(0, top10.length),
        borderWidth: 2,
        borderColor: isDark ? '#0a0a0f' : '#f8f9fa',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: textColor,
          font: { size: 11 },
          boxWidth: 12,
          padding: 10,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: { label: string; raw: unknown }) =>
            ` ${ctx.label}: ${formatEUR(Number(ctx.raw) * 1e9, true)}`,
        },
      },
    },
  };

  return <Doughnut data={chartData} options={options} />;
}
