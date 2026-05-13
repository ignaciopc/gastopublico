interface Meta {
  k: string;
  v: string;
}

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  lede: string;
  meta?: Meta[];
}

export default function PageHeader({ eyebrow, title, lede, meta }: PageHeaderProps) {
  return (
    <section style={{ borderBottom: '1px solid var(--rule)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Masthead bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 0', borderBottom: '2px solid var(--foreground)',
          flexWrap: 'wrap', gap: 8,
        }}>
          <span className="eyebrow">{eyebrow}</span>
          {meta && (
            <div style={{ display: 'flex', gap: 20 }}>
              {meta.map(m => (
                <span key={m.k} className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--muted)', marginRight: 4 }}>{m.k}:</span>
                  <span style={{ color: 'var(--foreground)', fontWeight: 600 }}>{m.v}</span>
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Title */}
        <div style={{ padding: '40px 0 36px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 56px)',
            lineHeight: 1.0, letterSpacing: '-0.03em',
            fontWeight: 800, margin: '0 0 18px',
            maxWidth: 900,
          }}>
            {title}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--muted-strong)', maxWidth: 760, margin: 0 }}>
            {lede}
          </p>
        </div>
      </div>
    </section>
  );
}
