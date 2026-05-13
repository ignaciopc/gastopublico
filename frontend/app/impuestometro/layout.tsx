import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impuestómetro – Calcula Cuánto Pagas en Impuestos',
  description:
    'Calcula cuánto pagas en IRPF y Seguridad Social según tu sueldo bruto. Descubre a qué destina el Estado cada euro de tus impuestos y cuándo llega tu Día de la Liberación Fiscal 2024.',
  keywords: [
    'calculadora IRPF 2024',
    'cuánto pago en impuestos España',
    'impuestos sueldo bruto',
    'día liberación fiscal 2024',
    'calculadora seguridad social',
    'impuestómetro España',
    'IRPF España calculator',
  ],
  openGraph: {
    title: 'Impuestómetro – Calcula Cuánto Pagas en Impuestos',
    description: 'Introduce tu sueldo bruto y descubre cuánto pagas en IRPF, a qué se destina cada euro y en qué fecha trabajas solo para ti.',
    url: 'https://gastopublico.es/impuestometro',
    images: [{ url: '/api/og?title=Impuest%C3%B3metro&sub=Calcula%20cu%C3%A1nto%20pagas%20en%20IRPF%20y%20Seguridad%20Social%20%C2%B7%202024', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Impuestómetro – Calcula Cuánto Pagas en Impuestos',
    description: 'Calculadora IRPF 2024. Descubre cuánto pagas y cuál es tu Día de la Liberación Fiscal.',
    images: ['/api/og?title=Impuest%C3%B3metro&sub=Calcula%20cu%C3%A1nto%20pagas%20en%20IRPF%20y%20Seguridad%20Social%20%C2%B7%202024'],
  },
  alternates: { canonical: 'https://gastopublico.es/impuestometro' },
};

export default function ImpuestometroLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
