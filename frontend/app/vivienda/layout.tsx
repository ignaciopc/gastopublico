import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vivienda en España – Precios, Alquiler y Desahucios 2015–2024',
  description:
    'Evolución del precio de la vivienda en España 2015–2024. Alquiler +80%, esfuerzo salarial 8 años, 49.000 desahucios anuales. Datos oficiales del Ministerio de Transportes e INE.',
  keywords: [
    'precio vivienda España 2024',
    'alquiler España evolución',
    'desahucios España estadísticas',
    'esfuerzo salarial comprar casa',
    'VPO vivienda protegida',
    'crisis vivienda España datos',
    'precio metro cuadrado España',
    'alquiler Madrid Barcelona 2024',
  ],
  openGraph: {
    title: 'Vivienda en España – Precios, Alquiler y Desahucios · Datos Oficiales',
    description: 'Alquiler +80% en 10 años, esfuerzo salarial de 8 años, 49.000 desahucios en 2023. Datos oficiales del Ministerio de Transportes e INE.',
    url: 'https://gastopublico.es/vivienda',
    images: [{ url: '/api/og?title=Vivienda%20en%20Espa%C3%B1a&sub=Precios%2C%20alquiler%20y%20desahucios%202015%E2%80%932024%20%C2%B7%20Datos%20oficiales', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vivienda en España – Precios y Crisis 2015–2024',
    description: 'Alquiler +80%, esfuerzo salarial 8 años de salario, 49.000 desahucios/año. Datos oficiales.',
    images: ['/api/og?title=Vivienda%20en%20Espa%C3%B1a&sub=Precios%2C%20alquiler%20y%20desahucios%202015%E2%80%932024%20%C2%B7%20Datos%20oficiales'],
  },
  alternates: { canonical: 'https://gastopublico.es/vivienda' },
};

export default function ViviendaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
