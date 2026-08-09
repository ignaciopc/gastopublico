import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pensiones en España – Gasto, Sostenibilidad y Proyecciones 2024',
  description:
    'El gasto en pensiones supera los 181.000 M€ en 2024, el 12,4% del PIB. Ratio cotizantes/pensionistas en mínimos históricos. Datos oficiales de la Seguridad Social.',
  keywords: [
    'pensiones España 2024',
    'gasto pensiones España',
    'sostenibilidad sistema pensiones',
    'ratio cotizantes pensionistas',
    'pensión media España',
    'déficit seguridad social España',
    'reforma pensiones España',
    'proyección pensiones 2050',
  ],
  openGraph: {
    title: 'Pensiones en España – Gasto y Sostenibilidad · Datos Oficiales',
    description: '181.000 M€ en pensiones (12,4% PIB), 10,8 millones de pensionistas, 2,5 cotizantes por pensionista. Datos oficiales de la Seguridad Social.',
    url: 'https://gastopublico.es/pensiones',
    images: [{ url: '/api/og?title=Pensiones%20en%20Espa%C3%B1a&sub=Gasto%2C%20sostenibilidad%20y%20proyecciones%202024%20%C2%B7%20Seguridad%20Social', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pensiones en España – 181.000 M€ y subiendo',
    description: '12,4% del PIB en pensiones, 10,8M pensionistas, solo 2,5 cotizantes por pensionista. Proyección preocupante hasta 2050.',
    images: ['/api/og?title=Pensiones%20en%20Espa%C3%B1a&sub=Gasto%2C%20sostenibilidad%20y%20proyecciones%202024%20%C2%B7%20Seguridad%20Social'],
  },
  alternates: { canonical: 'https://gastopublico.es/pensiones' },
};

export default function PensionesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
