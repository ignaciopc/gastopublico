import type { Metadata } from 'next';
import AlertaSubscribeForm from '@/components/ui/AlertaSubscribeForm';
import AlertaStatusBanner from '@/components/ui/AlertaStatusBanner';

export const metadata: Metadata = {
  title: 'Alertas por email – Contratos y subvenciones',
  description:
    'Suscripción a avisos por email sobre licitaciones de más de 1 M€ y concesiones de la BDNS de más de 500.000 €. El envío de avisos aún no está activo.',
  keywords: ['alertas contratos públicos', 'avisos subvenciones España', 'notificaciones gasto público', 'alertas BDNS', 'alertas licitaciones'],
  openGraph: {
    title: 'Alertas por email – Contratos y subvenciones',
    description: 'Suscripción a avisos por email sobre contratos y subvenciones. El envío de avisos aún no está activo.',
    url: 'https://gastopublico.es/alertas',
    images: [{ url: '/api/og?title=Alertas%20de%20Gasto%20P%C3%BAblico&sub=Contratos%20y%20subvenciones%20%C2%B7%20Suscripci%C3%B3n%20por%20email', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alertas por email – Contratos y subvenciones',
    description: 'Suscripción a avisos por email sobre contratos y subvenciones. El envío de avisos aún no está activo.',
    images: ['/api/og?title=Alertas%20de%20Gasto%20P%C3%BAblico&sub=Contratos%20y%20subvenciones%20%C2%B7%20Suscripci%C3%B3n%20por%20email'],
  },
  alternates: { canonical: 'https://gastopublico.es/alertas' },
};

const HOW_IT_WORKS = [
  { num: '01', title: 'Elige tus alertas', desc: 'Selecciona los tipos de aviso que te interesan: contratos de más de 1 M€, subvenciones de más de 500.000 € o resumen semanal.' },
  { num: '02', title: 'Introduce tu email', desc: 'Se guarda tu email y los tipos elegidos. Sin contraseña.' },
  { num: '03', title: 'Envío de avisos (aún no activo)', desc: 'Todavía no hay ningún proceso que detecte novedades y envíe los avisos. Tu suscripción queda registrada para cuando se active.' },
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
            Alertas por email sobre<br />
            contratos y subvenciones
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: 'var(--muted-strong)', maxWidth: 600, margin: 0 }}>
            Puedes registrar tu email para recibir avisos sobre licitaciones y concesiones de subvenciones.
            El envío de avisos todavía no está activo: por ahora solo se guarda la suscripción.
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
                Registrar suscripción
              </h2>
              <div style={{ border: '1px solid var(--card-border)', borderRadius: 6, padding: '28px 24px', background: 'var(--card)' }}>
                <AlertaSubscribeForm />
              </div>
            </div>

            {/* How it works */}
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Cómo funciona</div>
              <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px' }}>
                Estado del servicio
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
                <div className="eyebrow" style={{ marginBottom: 14 }}>Qué incluirá cada alerta (pendiente de activar)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
                  {[
                    { tipo: 'Contratos > 1 M€', frec: 'No activa', desc: 'Licitaciones con presupuesto base de licitación sin impuestos superior a 1 M€ del feed de agregación de la Plataforma de Contratación del Sector Público.' },
                    { tipo: 'Subvenciones > 500.000 €', frec: 'No activa', desc: 'Concesiones de la Base de Datos Nacional de Subvenciones (BDNS) por encima de 500.000 €.' },
                    { tipo: 'Resumen semanal', frec: 'No activa', desc: 'Resumen de los contratos y subvenciones de mayor importe de la semana.' },
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
          <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 28px' }}>Preguntas sobre las alertas</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 1, border: '1px solid var(--card-border)', borderRadius: 4, overflow: 'hidden' }}>
            {[
              { q: '¿Es gratuito?', a: 'Sí. La suscripción no tiene coste.' },
              { q: '¿Cuándo llegan los avisos?', a: 'Todavía no se envían. Al suscribirte solo se registra tu email y, si el servicio de correo está configurado, recibes un email de confirmación.' },
              { q: '¿Qué datos guardáis?', a: 'Tu dirección de email y los tipos de alerta elegidos, en la base de datos del sitio (Supabase). El email de confirmación se envía a través del proveedor de correo Resend.' },
              { q: '¿Puedo cancelar?', a: 'Sí. El email de confirmación incluye un enlace para darte de baja.' },
              { q: '¿Por qué el umbral de 1 M€ en contratos?', a: 'Es un criterio propio para limitar el número de avisos. Se aplica al presupuesto base de licitación sin impuestos.' },
              { q: '¿Cada cuánto se actualizan los datos?', a: 'Los contratos y las subvenciones se sincronizan una vez al día, a las 06:00 UTC, desde la Plataforma de Contratación del Sector Público y la API de la BDNS.' },
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
