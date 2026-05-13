import type { Metadata } from 'next';
import AlertaSubscribeForm from '@/components/ui/AlertaSubscribeForm';
import AlertaStatusBanner from '@/components/ui/AlertaStatusBanner';

export const metadata: Metadata = {
  title: 'Alertas – Contratos Millonarios y Subvenciones del Estado',
  description:
    'Recibe avisos por email cuando se adjudiquen contratos de más de 1 M€ o se publiquen subvenciones destacadas de la BDNS. Gratis, sin registro, con un clic te das de baja.',
  keywords: ['alertas contratos públicos', 'avisos subvenciones España', 'notificaciones gasto público', 'alertas BDNS', 'contratos millonarios estado'],
  openGraph: {
    title: 'Alertas – Contratos Millonarios y Subvenciones del Estado',
    description: 'Entérate el mismo día que se adjudican contratos de +1 M€ o se publican subvenciones destacadas. Gratis, sin spam.',
    url: 'https://gastopublico.es/alertas',
    images: [{ url: '/api/og?title=Alertas%20de%20Gasto%20P%C3%BAblico&sub=Contratos%20%2B1M%E2%82%AC%20y%20subvenciones%20destacadas%20%C2%B7%20Gratis', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alertas – Contratos Millonarios y Subvenciones del Estado',
    description: 'Entérate el mismo día que se adjudican contratos de +1 M€. Gratis, sin spam.',
    images: ['/api/og?title=Alertas%20de%20Gasto%20P%C3%BAblico&sub=Contratos%20%2B1M%E2%82%AC%20y%20subvenciones%20destacadas%20%C2%B7%20Gratis'],
  },
  alternates: { canonical: 'https://gastopublico.es/alertas' },
};

const HOW_IT_WORKS = [
  { num: '01', title: 'Elige tus alertas', desc: 'Selecciona si quieres recibir avisos de contratos grandes (> 1 M€), subvenciones destacadas o el resumen semanal.' },
  { num: '02', title: 'Introduce tu email', desc: 'Solo necesitamos tu email. Sin registro, sin contraseñas, sin datos personales innecesarios.' },
  { num: '03', title: 'Recibe los avisos', desc: 'Te avisamos el mismo día que se publican los contratos o adjudicaciones relevantes en PLACE y BDNS.' },
];

export default function AlertasPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  return (
    <div>
      <AlertaStatusBanner searchParams={searchParams} />

      {/* Header */}
      <section style={{ padding: '56px 0 48px', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Sistema de alertas</div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.05, margin: '0 0 18px', maxWidth: 800 }}>
            Saber antes que nadie<br />
            cuándo se gasta tu dinero.
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted-strong)', maxWidth: 600, margin: 0 }}>
            Contratos adjudicados al día siguiente de publicarse. Subvenciones millonarias en cuanto las conceden.
            Un resumen cada lunes con lo más relevante de la semana. Gratis. Sin spam.
          </p>
        </div>
      </section>

      {/* Main: form + how it works */}
      <section style={{ padding: '56px 0', borderBottom: '1px solid var(--rule)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 64, alignItems: 'start' }}>

            {/* Form */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Activar alertas</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
                Activa tu suscripción gratuita
              </h2>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 6, padding: '28px 24px', background: 'var(--card)' }}>
                <AlertaSubscribeForm />
              </div>
            </div>

            {/* How it works */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Cómo funciona</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px' }}>
                Tres pasos, cero fricciones
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {HOW_IT_WORKS.map((step, i) => (
                  <div key={step.num} style={{
                    display: 'flex', gap: 20, padding: '20px 0',
                    borderBottom: i < HOW_IT_WORKS.length - 1 ? '1px solid var(--rule)' : 0,
                  }}>
                    <span className="mono" style={{
                      fontSize: 11, fontWeight: 700, color: 'var(--accent)',
                      minWidth: 28, paddingTop: 3,
                    }}>{step.num}</span>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{step.title}</div>
                      <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--muted-strong)' }}>{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tipos de alerta */}
              <div style={{ marginTop: 36 }}>
                <div className="eyebrow" style={{ marginBottom: 14 }}>Qué incluye cada alerta</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
                  {[
                    { tipo: 'Contratos > 1 M€', frec: 'Diaria', desc: 'Contratos adjudicados por encima del millón de euros publicados en la Plataforma de Contratación del Estado (PLACE).' },
                    { tipo: 'Subvenciones destacadas', frec: 'Diaria', desc: 'Concesiones de la BDNS por encima de 500.000 € según datos de la Intervención General del Estado.' },
                    { tipo: 'Resumen semanal', frec: 'Lunes', desc: 'Digest con los 5 contratos más grandes, el gasto ejecutado de la semana y las subvenciones más relevantes.' },
                  ].map((row, i, arr) => (
                    <div key={row.tipo} style={{
                      padding: '14px 18px',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 0,
                      background: 'var(--card)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{row.tipo}</span>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em' }}>{row.frec}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.5, color: 'var(--muted)' }}>{row.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '48px 0 64px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Preguntas frecuentes</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px' }}>Todo lo que necesitas saber</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 1, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { q: '¿Es gratuito?', a: 'Sí, completamente. GastoPúblico.es no cobra por ningún servicio. Los datos son públicos y su seguimiento también debe serlo.' },
              { q: '¿Con qué frecuencia llegan los avisos?', a: 'Las alertas de contratos y subvenciones se envían a diario si hay novedades. El resumen semanal llega cada lunes. Si un día no hay nada relevante, no enviamos nada.' },
              { q: '¿Qué datos guardáis?', a: 'Solo tu dirección de email y las preferencias de alerta que indiques. Nada más. No hay seguimiento, no hay cookies de terceros, no compartimos datos con nadie.' },
              { q: '¿Puedo cancelar?', a: 'Sí. Cada email incluye un enlace para darte de baja con un solo clic. Sin formularios, sin confirmaciones, sin preguntas.' },
              { q: '¿Por qué solo desde 1 M€ en contratos?', a: 'Para evitar el ruido. España publica miles de contratos menores cada día. Filtramos por relevancia para que cada aviso que recibas valga la pena.' },
              { q: '¿Los datos son en tiempo real?', a: 'Los contratos se sincronizan diariamente desde la Plataforma de Contratación del Estado (PLACE). Las subvenciones vienen de la API de la BDNS con el mismo intervalo.' },
            ].map((faq, i) => (
              <div key={faq.q} style={{
                padding: '22px 20px', background: 'var(--card)',
                borderRight: i % 2 === 0 ? '1px solid var(--card-border)' : 0,
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{faq.q}</div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted-strong)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
