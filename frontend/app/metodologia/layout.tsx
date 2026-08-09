import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metodología – Fuentes, actualización y criterios de agregación',
  description:
    'De dónde salen los datos de GastoPublico.es, cada cuánto se actualizan, cómo se agregan y qué distingue un dato oficial de uno derivado o estimado.',
  keywords: [
    'metodología datos gasto público',
    'fuentes IGAE PLACE BDNS',
    'criterios agregación presupuesto',
    'dato oficial derivado estimado',
  ],
  openGraph: {
    title: 'Metodología · GastoPublico.es',
    description: 'Fuentes, frecuencia de actualización, criterios de agregación y clasificación de los datos: oficial, derivado o estimación propia.',
    url: 'https://gastopublico.es/metodologia',
    images: [{ url: '/api/og?title=Metodolog%C3%ADa&sub=Fuentes%2C%20actualizaci%C3%B3n%20y%20criterios%20de%20agregaci%C3%B3n', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metodología · GastoPublico.es',
    description: 'Fuentes, frecuencia de actualización y criterios de agregación de los datos publicados.',
    images: ['/api/og?title=Metodolog%C3%ADa&sub=Fuentes%2C%20actualizaci%C3%B3n%20y%20criterios%20de%20agregaci%C3%B3n'],
  },
  alternates: { canonical: 'https://gastopublico.es/metodologia' },
};

export default function MetodologiaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
