export default function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin text-[var(--accent)]"
      aria-label="Cargando"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <Spinner size={36} />
      <p className="text-sm text-[var(--muted)]">Cargando datos oficiales…</p>
    </div>
  );
}
