'use client';

const EJERCICIOS = [2024, 2023, 2022];

interface EjercicioSelectorProps {
  value: number;
  onChange: (year: number) => void;
}

export default function EjercicioSelector({ value, onChange }: EjercicioSelectorProps) {
  return (
    <div className="inline-flex rounded-lg border border-card-border overflow-hidden">
      {EJERCICIOS.map(year => (
        <button
          key={year}
          onClick={() => onChange(year)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            value === year
              ? 'bg-accent text-white'
              : 'bg-card text-muted hover:text-foreground hover:bg-card-border'
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
