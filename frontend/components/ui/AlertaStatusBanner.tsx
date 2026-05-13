'use client';

import { use } from 'react';

const STATUS_MSGS: Record<string, { text: string; color: string }> = {
  unsubscribed: { text: 'Te has dado de baja correctamente. Ya no recibirás más alertas.', color: 'var(--good)' },
  not_found: { text: 'El enlace de baja no es válido o ya caducó.', color: 'var(--muted)' },
  invalid: { text: 'Enlace inválido.', color: 'var(--bad)' },
  error: { text: 'Error al procesar la solicitud. Inténtalo de nuevo.', color: 'var(--bad)' },
};

export default function AlertaStatusBanner({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = use(searchParams);
  const status = params?.status;
  if (!status || !STATUS_MSGS[status]) return null;

  const { text, color } = STATUS_MSGS[status];
  return (
    <div style={{
      background: 'var(--card)', borderBottom: '1px solid var(--rule)',
      padding: '12px 24px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ margin: 0, fontSize: 14, color, fontWeight: 500 }}>{text}</p>
      </div>
    </div>
  );
}
