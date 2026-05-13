interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  actions?: React.ReactNode;
}

export default function SectionHeader({ title, subtitle, badge, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        {badge && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider text-accent mb-1">
            {badge}
          </span>
        )}
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
}
