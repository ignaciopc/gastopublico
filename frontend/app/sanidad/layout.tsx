import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanidad en España – Gasto, Listas de Espera y Comparativa 2015–2024',
  description:
    'El gasto sanitario público alcanza 85.200 M€. Más de 836.000 pacientes en lista de espera quirúrgica. España por debajo de la media de la UE en enfermeras por habitante. Datos del Ministerio de Sanidad.',
  keywords: [
    'sanidad españa 2024',
    'gasto sanitario público españa',
    'lista de espera quirúrgica españa',
    'médicos enfermeras por habitante españa',
    'sistema nacional de salud datos',
    'sanidad pública vs privada españa',
    'comparativa sanidad europa',
    'ministerio de sanidad estadísticas',
  ],
  openGraph: {
    title: 'Sanidad en España – 836.000 en Lista de Espera · Datos Oficiales',
    description: '85.200 M€ de gasto, 836k pacientes esperando cirugía, déficit de enfermeras vs Europa. Datos del Ministerio de Sanidad y OCDE.',
    url: 'https://gastopublico.es/sanidad',
    images: [{ url: '/api/og?title=Sanidad%20en%20Espa%C3%B1a&sub=Gasto%2C%20listas%20de%20espera%20y%20comparativa%202024%20%C2%B7%20Ministerio%20de%20Sanidad', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sanidad en España – 836.000 en Lista de Espera',
    description: '85.200 M€ de gasto, 836k esperando quirófano, 113 días de espera media. Datos reales.',
    images: ['/api/og?title=Sanidad%20en%20Espa%C3%B1a&sub=Gasto%2C%20listas%20de%20espera%20y%20comparativa%202024%20%C2%B7%20Ministerio%20de%20Sanidad'],
  },
  alternates: { canonical: 'https://gastopublico.es/sanidad' },
};

export default function SanidadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
