import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ejecución del Presupuesto del Estado por sección',
  description:
    'Ejecución del Presupuesto del Estado por sección presupuestaria a partir de las publicaciones de la IGAE: créditos, obligaciones reconocidas y pagos.',
  keywords: [
    'presupuesto general del estado',
    'ejecución presupuestaria España',
    'IGAE datos presupuesto',
    'gasto ministerios España',
    'obligaciones reconocidas',
    'presupuesto por ministerio',
  ],
  openGraph: {
    title: 'Ejecución del Presupuesto del Estado por sección',
    description: 'Ejecución del Presupuesto del Estado por sección presupuestaria (fuente: IGAE).',
    url: 'https://gastopublico.es/presupuesto',
    images: [{ url: '/api/og?title=Presupuesto%20del%20Estado&sub=Ejecuci%C3%B3n%20por%20secci%C3%B3n%20%C2%B7%20IGAE', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ejecución del Presupuesto del Estado por sección',
    description: 'Ejecución del Presupuesto del Estado por sección presupuestaria (fuente: IGAE).',
    images: ['/api/og?title=Presupuesto%20del%20Estado&sub=Ejecuci%C3%B3n%20por%20secci%C3%B3n%20%C2%B7%20IGAE'],
  },
  alternates: { canonical: 'https://gastopublico.es/presupuesto' },
};

export default function PresupuestoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
