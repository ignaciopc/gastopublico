import Link from 'next/link';
import AlertaSubscribeForm from '@/components/ui/AlertaSubscribeForm';

const COLS = [
  { h: 'Secciones', links: [
    { l: 'Impuestómetro', href: '/impuestometro' },
    { l: 'Presupuesto', href: '/presupuesto' },
    { l: 'Contratos', href: '/contratos' },
    { l: 'Subvenciones', href: '/subvenciones' },
    { l: 'Datasets', href: '/datasets' },
    { l: 'Alertas', href: '/alertas' },
  ]},
  { h: 'Metodología', links: [
    { l: 'Cómo trabajamos', href: '/metodologia' },
    { l: 'Fuentes y actualización', href: '/metodologia' },
    { l: 'Criterios de agregación', href: '/metodologia' },
    { l: 'API pública', href: '/datasets' },
    { l: 'Licencia CC-BY 4.0', href: '/datasets' },
  ]},
  { h: 'Datos', links: [
    { l: 'IGAE', href: 'https://www.igae.pap.hacienda.gob.es/' },
    { l: 'PLACE', href: 'https://contrataciondelestado.es/' },
    { l: 'BDNS', href: 'https://www.pap.hacienda.gob.es/bdnstrans/' },
    { l: 'Banco de España', href: 'https://www.bde.es/' },
  ]},
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--rule)' }}>

      {/* Newsletter strip */}
      <div style={{ borderBottom: '1px solid var(--rule)', padding: '32px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: 48, alignItems: 'center' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: 6 }}>Alertas gratuitas</div>
              <p style={{ fontSize: 15, fontWeight: 600, margin: '0 0 4px', letterSpacing: '-0.01em' }}>
                Saber antes que nadie dónde va tu dinero.
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted-strong)', margin: 0 }}>
                Contratos &gt; 1 M€ · Subvenciones BDNS · Resumen semanal — Sin spam.
              </p>
            </div>
            <AlertaSubscribeForm compact />
          </div>
        </div>
      </div>

      {/* Links grid */}
      <div style={{ padding: '40px 0 56px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 28, height: 28, background: 'var(--accent)', color: '#fff',
                  fontWeight: 800, fontSize: 16, fontFamily: 'var(--font-mono), ui-monospace, monospace',
                  borderRadius: 2,
                }}>G</span>
                <span style={{ fontWeight: 800, fontSize: 15 }}>
                  GastoPúblico<span style={{ color: 'var(--muted)' }}>.es</span>
                </span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--muted-strong)', margin: '0 0 10px', maxWidth: 380 }}>
                Periodismo de datos sobre el gasto público español. Sin filiación política.
                Sin publicidad. Sin patrocinios institucionales. Datos abiertos siempre.
              </p>
              <p style={{ fontSize: 13, margin: '0 0 12px' }}>
                <Link href="/metodologia" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  Metodología: fuentes, actualización y criterios →
                </Link>
              </p>
              <p className="mono" style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
                Datos: IGAE · INE · Banco de España · PLACE · BDNS · Eurostat
              </p>
            </div>
            {COLS.map(col => (
              <div key={col.h}>
                <div className="eyebrow" style={{ marginBottom: 14, color: 'var(--foreground)' }}>{col.h}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.links.map(li => (
                    <li key={li.l}>
                      <Link href={li.href} style={{ fontSize: 13.5, color: 'var(--muted-strong)' }}>
                        {li.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <hr className="rule" style={{ margin: '36px 0 18px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              © 2024–2026 GastoPúblico.es · Todos los datos son de fuentes oficiales del Gobierno de España
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
              Transparencia es democracia
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
