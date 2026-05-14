import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sueldos y Cargos de los Políticos – Datos Oficiales 2024',
  description:
    'Retribuciones del presidente, vicepresidentes, ministros y altos cargos del Gobierno de España. 740 asesores nombrados a dedo, coches oficiales, viajes y pensiones vitalicias. Datos del BOE y Portal de Transparencia 2024.',
  keywords: [
    'sueldo presidente gobierno España',
    'retribuciones ministros 2024',
    'asesores gobierno España',
    'altos cargos sueldo BOE',
    'coches oficiales gobierno',
    'pensiones expresidentes',
    'coste político España',
    'portal transparencia retribuciones',
  ],
  openGraph: {
    title: 'Sueldos y Cargos de los Políticos Españoles – 2024',
    description: '96.179€ el presidente. 740 asesores. 678 M€ coste total. Coches, viajes y pensiones vitalicias. Todo en el BOE.',
    url: 'https://gastopublico.es/politicos',
    images: [{ url: '/api/og?title=Pol%C3%ADticos%20y%20Cargos&sub=Sueldos%2C%20asesores%2C%20coches%20y%20pensiones%20%C2%B7%20Datos%20BOE%202024', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sueldos y Cargos de los Políticos – 2024',
    description: '96.179€ el presidente. 740 asesores. 678 M€. Todo lo que cuesta el Gobierno de España.',
    images: ['/api/og?title=Pol%C3%ADticos%20y%20Cargos&sub=Sueldos%2C%20asesores%2C%20coches%20y%20pensiones%20%C2%B7%20Datos%20BOE%202024'],
  },
  alternates: { canonical: 'https://gastopublico.es/politicos' },
};

export default function PoliticosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
