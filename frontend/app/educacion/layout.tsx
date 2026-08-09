import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educación en España – Gasto, Abandono Escolar y PISA 2015–2024',
  description:
    'España gasta el 4,8% del PIB en educación, por debajo de la media de la UE. Tasa de abandono escolar del 13,7%, casi el doble que Europa. Resultados PISA en caída. Datos del Ministerio de Educación e INE.',
  keywords: [
    'educación españa 2024',
    'abandono escolar españa',
    'gasto educación españa PIB',
    'resultados PISA españa',
    'sistema educativo español datos',
    'fracaso escolar españa estadísticas',
    'comparativa educación europa',
    'ministerio educación estadísticas',
  ],
  openGraph: {
    title: 'Educación en España – Abandono Escolar 13,7% · Datos Oficiales',
    description: 'Abandono escolar casi el doble que la UE, resultados PISA en caída, gasto por debajo de la media europea. Datos del Ministerio de Educación.',
    url: 'https://gastopublico.es/educacion',
    images: [{ url: '/api/og?title=Educaci%C3%B3n%20en%20Espa%C3%B1a&sub=Abandono%20escolar%2C%20PISA%20y%20gasto%202015%E2%80%932024%20%C2%B7%20Ministerio%20de%20Educaci%C3%B3n', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Educación en España – Abandono Escolar y PISA',
    description: 'Abandono 13,7% (doble que UE), PISA cayendo, 4,8% PIB en educación. Datos oficiales.',
    images: ['/api/og?title=Educaci%C3%B3n%20en%20Espa%C3%B1a&sub=Abandono%20escolar%2C%20PISA%20y%20gasto%202015%E2%80%932024%20%C2%B7%20Ministerio%20de%20Educaci%C3%B3n'],
  },
  alternates: { canonical: 'https://gastopublico.es/educacion' },
};

export default function EducacionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
