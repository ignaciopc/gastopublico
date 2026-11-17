import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impuestómetro 2026 – Retención de IRPF y cotizaciones de tu sueldo',
  description:
    'Calcula la retención de IRPF y las cotizaciones a la Seguridad Social de un sueldo bruto en 2026 (algoritmo de retenciones de la AEAT y Orden PJC/297/2026) y su reparto según el gasto de las Administraciones Públicas por funciones en 2024 (IGAE).',
  keywords: [
    'calculadora IRPF 2026',
    'retención IRPF nómina 2026',
    'cotizaciones seguridad social 2026',
    'sueldo neto 2026',
    'día liberación fiscal 2026',
    'impuestómetro España',
  ],
  openGraph: {
    title: 'Impuestómetro 2026 – Retención de IRPF y cotizaciones de tu sueldo',
    description: 'Introduce tu sueldo bruto y obtén la retención de IRPF y las cotizaciones de 2026, y su reparto según el gasto público por funciones (IGAE, 2024).',
    url: 'https://gastopublico.es/impuestometro',
    images: [{ url: '/api/og?title=Impuest%C3%B3metro&sub=Retenci%C3%B3n%20de%20IRPF%20y%20cotizaciones%20%C2%B7%202026', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impuestómetro 2026 – Retención de IRPF y cotizaciones de tu sueldo',
    description: 'Retención de IRPF y cotizaciones de 2026 según la normativa de la AEAT y la Seguridad Social.',
    images: ['/api/og?title=Impuest%C3%B3metro&sub=Retenci%C3%B3n%20de%20IRPF%20y%20cotizaciones%20%C2%B7%202026'],
  },
  alternates: { canonical: 'https://gastopublico.es/impuestometro' },
};

export default function ImpuestometroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
