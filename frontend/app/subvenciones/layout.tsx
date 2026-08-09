import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subvenciones del Estado 2024 – Base de Datos BDNS',
  description:
    'Buscador de subvenciones públicas del Estado español. Datos oficiales de la Base de Datos Nacional de Subvenciones (BDNS) del Ministerio de Hacienda. Filtra por beneficiario, organismo e importe.',
  keywords: [
    'subvenciones estado España 2024',
    'BDNS base datos subvenciones',
    'subvenciones ministerio hacienda',
    'ayudas públicas España',
    'concesiones BDNS',
    'transparencia subvenciones',
  ],
  openGraph: {
    title: 'Subvenciones del Estado 2024 – Base de Datos BDNS',
    description: 'Buscador de subvenciones públicas del Estado español. Datos oficiales de la BDNS del Ministerio de Hacienda.',
    url: 'https://gastopublico.es/subvenciones',
    images: [{ url: '/api/og?title=Subvenciones%20del%20Estado%202024&sub=Base%20de%20Datos%20Nacional%20de%20Subvenciones%20%C2%B7%20BDNS', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subvenciones del Estado 2024 – Base de Datos BDNS',
    description: 'Buscador de subvenciones públicas. Datos oficiales BDNS del Ministerio de Hacienda.',
    images: ['/api/og?title=Subvenciones%20del%20Estado%202024&sub=Base%20de%20Datos%20Nacional%20de%20Subvenciones%20%C2%B7%20BDNS'],
  },
  alternates: { canonical: 'https://gastopublico.es/subvenciones' },
};

export default function SubvencionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
