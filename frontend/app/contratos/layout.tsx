import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contratos públicos – Licitaciones publicadas por agregación en PLACSP',
  description:
    'Últimas licitaciones publicadas en la Plataforma de Contratación del Sector Público mediante mecanismos de agregación (sin contratos menores), actualizadas a diario. Filtra por importe, órgano de contratación y fecha.',
  keywords: [
    'contratos públicos España',
    'licitaciones estado',
    'plataforma contratación estado PLACE',
    'adjudicaciones contratos públicos',
    'contratos gobierno España',
    'transparencia contratación pública',
  ],
  openGraph: {
    title: 'Contratos públicos – Licitaciones publicadas por agregación en PLACSP',
    description: 'Últimas licitaciones publicadas por agregación en PLACSP, actualizadas a diario.',
    url: 'https://gastopublico.es/contratos',
    images: [{ url: '/api/og?title=Contratos%20P%C3%BAblicos&sub=Licitaciones%20publicadas%20por%20agregaci%C3%B3n%20%C2%B7%20PLACSP', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contratos públicos – Licitaciones publicadas por agregación en PLACSP',
    description: 'Últimas licitaciones publicadas por agregación en PLACSP, actualizadas a diario.',
    images: ['/api/og?title=Contratos%20P%C3%BAblicos&sub=Licitaciones%20publicadas%20por%20agregaci%C3%B3n%20%C2%B7%20PLACSP'],
  },
  alternates: { canonical: 'https://gastopublico.es/contratos' },
};

export default function ContratosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
