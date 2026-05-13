import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="p-4 rounded-full bg-accent-light mb-6">
        <SearchX size={36} className="text-accent" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404</h1>
      <p className="text-lg font-semibold mb-2">Página no encontrada</p>
      <p className="text-muted text-sm mb-8 max-w-sm">
        La página que buscas no existe o ha sido movida. Usa el menú de navegación para encontrar lo que necesitas.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-white font-semibold text-sm hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={16} />
        Volver al inicio
      </Link>
    </div>
  );
}
