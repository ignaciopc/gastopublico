'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GastoPublico] Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
        <AlertTriangle size={36} className="text-red-600 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-bold mb-2">Algo ha ido mal</h2>
      <p className="text-muted text-sm mb-8 max-w-sm">
        Ha ocurrido un error inesperado. Los datos del gasto público siguen disponibles, inténtalo de nuevo.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <RefreshCw size={16} />
        Reintentar
      </button>
    </div>
  );
}
