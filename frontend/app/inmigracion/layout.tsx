import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gasto en Inmigración – Datos Oficiales PGE 2024',
  description:
    '1.847 M€ en partidas directas del Estado. Más de 6.000 M€ sumando sanidad, educación y servicios sociales de las CCAA. Desglose completo del gasto en inmigración en España con datos del PGE 2024.',
  keywords: [
    'gasto inmigración España 2024',
    'presupuesto inmigración PGE',
    'MENA coste tutela',
    'FAMI fondo asilo migración',
    'inmigrantes España gasto público',
    'coste inmigración comunidades autónomas',
    'acogida humanitaria presupuesto',
    'gasto público inmigración datos oficiales',
  ],
  openGraph: {
    title: 'Gasto en Inmigración en España – PGE 2024 · Datos Oficiales',
    description: '1.847 M€ directos + 6.000 M€ estimados con CCAA. MENA, asilo, FAMI, integración. Partida a partida.',
    url: 'https://gastopublico.es/inmigracion',
    images: [{ url: '/api/og?title=Gasto%20en%20Inmigraci%C3%B3n&sub=1.847%20M%E2%82%AC%20directos%20%C2%B7%20%2B6.000%20M%E2%82%AC%20estimados%20con%20CCAA%20%C2%B7%20PGE%202024', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gasto en Inmigración – PGE 2024',
    description: '1.847 M€ directos. Más de 6.000 M€ con CCAA. MENA, FAMI, asilo, integración. Datos oficiales.',
    images: ['/api/og?title=Gasto%20en%20Inmigraci%C3%B3n&sub=1.847%20M%E2%82%AC%20directos%20%C2%B7%20%2B6.000%20M%E2%82%AC%20estimados%20con%20CCAA%20%C2%B7%20PGE%202024'],
  },
  alternates: { canonical: 'https://gastopublico.es/inmigracion' },
};

export default function InmigracionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
