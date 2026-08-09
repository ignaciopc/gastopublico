import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retribuciones de altos cargos – Datos oficiales 2024',
  description:
    'Retribuciones del presidente, vicepresidentes, ministros y altos cargos del Gobierno de España. 740 puestos de personal eventual, parque móvil oficial y pensiones de ex-presidentes. Datos del BOE y Portal de Transparencia 2024.',
  keywords: [
    'retribución presidente del gobierno España',
    'retribuciones ministros 2024',
    'personal eventual administración España',
    'altos cargos retribuciones BOE',
    'parque móvil del Estado',
    'pensiones expresidentes',
    'portal transparencia retribuciones',
  ],
  openGraph: {
    title: 'Retribuciones de altos cargos del Gobierno de España – 2024',
    description: '96.179 € el presidente. 740 puestos de personal eventual. 678 M€ de coste total. Retribuciones fijadas por real decreto y publicadas en el BOE.',
    url: 'https://gastopublico.es/politicos',
    images: [{ url: '/api/og?title=Retribuciones%20de%20altos%20cargos&sub=Retribuciones%2C%20personal%20eventual%20y%20parque%20m%C3%B3vil%20%C2%B7%20BOE%202024', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retribuciones de altos cargos – 2024',
    description: '96.179 € el presidente. 740 puestos de personal eventual. 678 M€ de coste total. Datos del BOE.',
    images: ['/api/og?title=Retribuciones%20de%20altos%20cargos&sub=Retribuciones%2C%20personal%20eventual%20y%20parque%20m%C3%B3vil%20%C2%B7%20BOE%202024'],
  },
  alternates: { canonical: 'https://gastopublico.es/politicos' },
};

export default function PoliticosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
