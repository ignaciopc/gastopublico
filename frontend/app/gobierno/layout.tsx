import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El coste del Gobierno – Estructura y cifras oficiales',
  description:
    'Presupuestos prorrogados desde 2024, 22 ministerios, 740 puestos de personal eventual, 3,5 millones de empleados públicos y 128.500 M€ en fondos europeos pendientes de ejecutar. Datos oficiales con su fuente.',
  keywords: [
    'coste gobierno España',
    'presupuestos prorrogados España',
    'número de ministerios España',
    'personal eventual administración España',
    'empleados públicos España 2024',
    'fondos europeos sin ejecutar España',
    'déficit público España serie histórica',
  ],
  openGraph: {
    title: 'El coste del Gobierno – Estructura y cifras oficiales',
    description: '22 ministerios, 740 puestos de personal eventual, 3,5M empleados públicos y 128.500M€ en fondos UE pendientes de ejecutar.',
    url: 'https://gastopublico.es/gobierno',
    images: [{ url: '/api/og?title=El%20coste%20del%20Gobierno&sub=Estructura%2C%20personal%20y%20ejecuci%C3%B3n%20presupuestaria%20%C2%B7%20datos%20oficiales', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El coste del Gobierno – Estructura y cifras oficiales',
    description: '22 ministerios, 740 puestos de personal eventual, 128.500M€ en fondos UE pendientes de ejecutar.',
    images: ['/api/og?title=El%20coste%20del%20Gobierno&sub=Estructura%2C%20personal%20y%20ejecuci%C3%B3n%20presupuestaria%20%C2%B7%20datos%20oficiales'],
  },
  alternates: { canonical: 'https://gastopublico.es/gobierno' },
};

export default function GobiernoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
