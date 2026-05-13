import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'El Coste del Gobierno – Datos y Cifras Oficiales',
  description:
    '7 años sin presupuesto propio, 22 ministerios récord, 740 asesores, 3,5 millones de empleados públicos y 128.500 M€ en fondos europeos sin ejecutar. Datos oficiales del coste real del Gobierno español.',
  keywords: [
    'coste gobierno España',
    'presupuestos prorrogados España',
    'ministerios gobierno Sánchez',
    'asesores gobierno España',
    'empleados públicos España 2024',
    'fondos europeos sin ejecutar España',
    'déficit público España histórico',
    'gasto político España',
  ],
  openGraph: {
    title: 'El Coste del Gobierno – 7 Años Sin Presupuesto Propio',
    description: '22 ministerios, 740 asesores, 3,5M empleados públicos y 128.500M€ en fondos UE sin ejecutar. Todos los datos del coste real del Gobierno.',
    url: 'https://gastopublico.es/gobierno',
    images: [{ url: '/api/og?title=El%20Coste%20del%20Gobierno&sub=7%20a%C3%B1os%20sin%20presupuesto%20%C2%B7%2022%20ministerios%20%C2%B7%20datos%20oficiales', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'El Coste del Gobierno – 7 Años Sin Presupuesto Propio',
    description: '22 ministerios, 740 asesores, 128.500M€ en fondos UE sin ejecutar. Datos oficiales.',
    images: ['/api/og?title=El%20Coste%20del%20Gobierno&sub=7%20a%C3%B1os%20sin%20presupuesto%20%C2%B7%2022%20ministerios%20%C2%B7%20datos%20oficiales'],
  },
  alternates: { canonical: 'https://gastopublico.es/gobierno' },
};

export default function GobiernoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
