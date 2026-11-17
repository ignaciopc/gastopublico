import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subvenciones – Concesiones sincronizadas de la BDNS',
  description:
    'Buscador sobre una copia parcial, actualizada a diario, de las concesiones publicadas en la Base de Datos Nacional de Subvenciones (BDNS). Filtra por beneficiario, administración concedente e importe.',
  keywords: [
    'subvenciones España',
    'BDNS base datos subvenciones',
    'subvenciones ministerio hacienda',
    'ayudas públicas España',
    'concesiones BDNS',
    'transparencia subvenciones',
  ],
  openGraph: {
    title: 'Subvenciones – Concesiones sincronizadas de la BDNS',
    description: 'Buscador sobre una copia parcial, actualizada a diario, de las concesiones publicadas en la BDNS.',
    url: 'https://gastopublico.es/subvenciones',
    images: [{ url: '/api/og?title=Subvenciones&sub=Base%20de%20Datos%20Nacional%20de%20Subvenciones%20%C2%B7%20BDNS', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Subvenciones – Concesiones sincronizadas de la BDNS',
    description: 'Buscador sobre una copia parcial de las concesiones publicadas en la BDNS.',
    images: ['/api/og?title=Subvenciones&sub=Base%20de%20Datos%20Nacional%20de%20Subvenciones%20%C2%B7%20BDNS'],
  },
  alternates: { canonical: 'https://gastopublico.es/subvenciones' },
};

export default function SubvencionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
