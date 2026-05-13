import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contratos Públicos – Licitaciones del Estado en Tiempo Real',
  description:
    'Feed en tiempo real de licitaciones y adjudicaciones del Estado español. Datos de la Plataforma de Contratación del Estado (PLACE). Filtra por importe, organismo contratante y adjudicatario.',
  keywords: [
    'contratos públicos España',
    'licitaciones estado',
    'plataforma contratación estado PLACE',
    'adjudicaciones contratos públicos',
    'contratos gobierno España',
    'transparencia contratación pública',
  ],
  openGraph: {
    title: 'Contratos Públicos – Licitaciones del Estado en Tiempo Real',
    description: 'Licitaciones y adjudicaciones del Estado en tiempo real. Datos de PLACE filtrados por importe y organismo.',
    url: 'https://gastopublico.es/contratos',
    images: [{ url: '/api/og?title=Contratos%20P%C3%BAblicos&sub=Licitaciones%20y%20adjudicaciones%20en%20tiempo%20real%20%C2%B7%20PLACE', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contratos Públicos – Licitaciones del Estado en Tiempo Real',
    description: 'Feed en tiempo real de licitaciones y adjudicaciones del Estado. Datos PLACE.',
    images: ['/api/og?title=Contratos%20P%C3%BAblicos&sub=Licitaciones%20y%20adjudicaciones%20en%20tiempo%20real%20%C2%B7%20PLACE'],
  },
  alternates: { canonical: 'https://gastopublico.es/contratos' },
};

export default function ContratosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
