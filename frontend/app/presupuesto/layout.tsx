import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presupuesto del Estado 2024 – Ejecución por Ministerio',
  description:
    'Consulta la ejecución del Presupuesto General del Estado 2024 por ministerio. Datos IGAE actualizados: créditos definitivos, obligaciones reconocidas y tasa de ejecución. Comparador histórico 2022–2024.',
  keywords: [
    'presupuesto general estado 2024',
    'ejecución presupuestaria España',
    'IGAE datos presupuesto',
    'gasto ministerios España',
    'obligaciones reconocidas 2024',
    'presupuesto por ministerio',
  ],
  openGraph: {
    title: 'Presupuesto del Estado 2024 – Ejecución por Ministerio',
    description: 'Datos IGAE actualizados del Presupuesto General del Estado 2024. Créditos, obligaciones y tasa de ejecución por ministerio.',
    url: 'https://gastopublico.es/presupuesto',
    images: [{ url: '/api/og?title=Presupuesto%20del%20Estado%202024&sub=Ejecuci%C3%B3n%20por%20ministerio%20%C2%B7%20Datos%20IGAE', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Presupuesto del Estado 2024 – Ejecución por Ministerio',
    description: 'Datos IGAE actualizados. Créditos, obligaciones y tasa de ejecución por ministerio.',
    images: ['/api/og?title=Presupuesto%20del%20Estado%202024&sub=Ejecuci%C3%B3n%20por%20ministerio%20%C2%B7%20Datos%20IGAE'],
  },
  alternates: { canonical: 'https://gastopublico.es/presupuesto' },
};

export default function PresupuestoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
