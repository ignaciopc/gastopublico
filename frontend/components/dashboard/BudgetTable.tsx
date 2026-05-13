'use client';

import { useState } from 'react';
import type { BudgetBySeccion } from '@/lib/types';
import { formatEUR, formatPercent } from '@/lib/formatters';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'descripcion' | 'credDefinitivos' | 'obligacionesReconocidas' | 'tasaEjecucion';

interface BudgetTableProps {
  data: BudgetBySeccion[];
}

export default function BudgetTable({ data }: BudgetTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('obligacionesReconocidas');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const toggle = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const filtered = data
    .filter(r => r.descripcion.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey] as string | number;
      const vb = b[sortKey] as string | number;
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronUp size={13} className="opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />;
  };

  const TasaBadge = ({ tasa }: { tasa: number }) => {
    const cls =
      tasa >= 90 ? 'text-emerald-700 dark:text-emerald-400' :
      tasa >= 70 ? 'text-amber-700 dark:text-amber-400' :
      'text-red-700 dark:text-red-400';
    return <span className={`font-semibold ${cls}`}>{formatPercent(tasa)}</span>;
  };

  return (
    <div className="bg-card border border-card-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-card-border">
        <input
          type="text"
          placeholder="Buscar sección o ministerio…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full sm:w-72 px-3 py-2 text-sm rounded-lg border border-card-border bg-background placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-background">
              {(
                [
                  { key: 'descripcion', label: 'Sección / Ministerio' },
                  { key: 'credDefinitivos', label: 'Créditos Definitivos' },
                  { key: 'obligacionesReconocidas', label: 'Obligaciones Reconocidas' },
                  { key: 'tasaEjecucion', label: 'Tasa Ejecución' },
                ] as { key: SortKey; label: string }[]
              ).map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => toggle(key)}
                  className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider text-muted cursor-pointer hover:text-foreground select-none whitespace-nowrap"
                >
                  <span className="flex items-center gap-1">
                    {label}
                    <SortIcon k={key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted text-sm">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              filtered.map(row => (
                <tr key={row.seccion} className="hover:bg-background transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{row.descripcion}</div>
                    <div className="text-xs text-muted">Sección {row.seccion}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums">
                    {formatEUR(row.credDefinitivos, true)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs tabular-nums font-semibold">
                    {formatEUR(row.obligacionesReconocidas, true)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <TasaBadge tasa={row.tasaEjecucion} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-card-border text-xs text-muted">
        {filtered.length} de {data.length} secciones · Fuente: IGAE
      </div>
    </div>
  );
}
