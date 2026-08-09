import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Paro en España – Desempleo y Mercado Laboral 2015–2024',
  description:
    'Evolución del desempleo en España 2015–2024. Paro juvenil 27%, mayor tasa de la UE, brecha entre CCAA. Datos oficiales de la EPA (INE) y Ministerio de Trabajo.',
  keywords: [
    'tasa paro España 2024',
    'desempleo España evolución',
    'paro juvenil España',
    'EPA encuesta población activa',
    'paro por comunidades autónomas',
    'mercado laboral España datos',
    'contratos temporales España',
    'reforma laboral 2022 resultados',
  ],
  openGraph: {
    title: 'Paro en España – Desempleo 2015–2024 · Datos EPA',
    description: 'España lidera el paro en la UE con 11,2%. Paro juvenil 27%, brecha de 15 puntos entre CCAA. Datos oficiales de la Encuesta de Población Activa.',
    url: 'https://gastopublico.es/paro',
    images: [{ url: '/api/og?title=Paro%20en%20Espa%C3%B1a&sub=Desempleo%20y%20mercado%20laboral%202015%E2%80%932024%20%C2%B7%20Datos%20EPA', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paro en España – Desempleo 2015–2024',
    description: 'Mayor tasa de paro de la UE, paro juvenil 27%, brecha de 15 puntos entre CCAA. Datos EPA oficiales.',
    images: ['/api/og?title=Paro%20en%20Espa%C3%B1a&sub=Desempleo%20y%20mercado%20laboral%202015%E2%80%932024%20%C2%B7%20Datos%20EPA'],
  },
  alternates: { canonical: 'https://gastopublico.es/paro' },
};

export default function ParoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
