import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Migración y asilo en el PGE 2024 – Partidas presupuestarias',
  description:
    'Las cinco partidas del Presupuesto General del Estado 2024 destinadas a acogida, asilo, integración y gestión de flujos migratorios, con su programa presupuestario e importe. 1.492,6 M€ en total.',
  keywords: [
    'partidas presupuestarias migración España',
    'presupuesto asilo PGE 2024',
    'programa 231N acogida humanitaria',
    'FAMI fondo asilo migración integración',
    'gasto público migración datos oficiales',
    'menores migrantes no acompañados presupuesto',
  ],
  openGraph: {
    title: 'Migración y asilo en el PGE 2024 · Partidas presupuestarias',
    description: '1.492,6 M€ en cinco partidas identificadas de los programas 231N, 231B y 231E. Importe y programa presupuestario de cada una.',
    url: 'https://gastopublico.es/inmigracion',
    images: [{ url: '/api/og?title=Migraci%C3%B3n%20y%20asilo%20en%20el%20PGE%202024&sub=1.492%2C6%20M%E2%82%AC%20en%20cinco%20partidas%20%C2%B7%20Programas%20231N%2C%20231B%20y%20231E', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Migración y asilo en el PGE 2024',
    description: '1.492,6 M€ en cinco partidas identificadas de los programas 231N, 231B y 231E.',
    images: ['/api/og?title=Migraci%C3%B3n%20y%20asilo%20en%20el%20PGE%202024&sub=1.492%2C6%20M%E2%82%AC%20en%20cinco%20partidas%20%C2%B7%20Programas%20231N%2C%20231B%20y%20231E'],
  },
  alternates: { canonical: 'https://gastopublico.es/inmigracion' },
};

export default function InmigracionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
