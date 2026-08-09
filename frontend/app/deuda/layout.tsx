import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deuda Pública de España – Evolución y Comparativa 2008–2024',
  description:
    'La deuda pública española supera 1,6 billones de euros (107% del PIB). Pagamos 37.500 M€ en intereses al año. Evolución desde la crisis de 2008 con datos del Banco de España y Eurostat.',
  keywords: [
    'deuda publica españa 2024',
    'deuda españa porcentaje PIB',
    'intereses deuda publica españa',
    'deuda publica española evolución',
    'deuda per capita españa',
    'déficit público españa histórico',
    'comparativa deuda europa',
    'banco de españa deuda',
  ],
  openGraph: {
    title: 'Deuda Pública de España – 1,6 Billones y 107% del PIB · Datos Oficiales',
    description: '1,6 billones de euros de deuda, 37.500 M€ en intereses/año, 34.000 € por habitante. Datos oficiales del Banco de España y Eurostat.',
    url: 'https://gastopublico.es/deuda',
    images: [{ url: '/api/og?title=Deuda%20P%C3%BAblica%20de%20Espa%C3%B1a&sub=1%2C6%20billones%20%C2%B7%20107%25%20del%20PIB%20%C2%B7%20Datos%20Banco%20de%20Espa%C3%B1a', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deuda Pública España – 1,6 Billones €',
    description: '107% del PIB, 37.500 M€ en intereses al año, 34.000€ por habitante. Evolución desde 2008.',
    images: ['/api/og?title=Deuda%20P%C3%BAblica%20de%20Espa%C3%B1a&sub=1%2C6%20billones%20%C2%B7%20107%25%20del%20PIB%20%C2%B7%20Datos%20Banco%20de%20Espa%C3%B1a'],
  },
  alternates: { canonical: 'https://gastopublico.es/deuda' },
};

export default function DeudaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
