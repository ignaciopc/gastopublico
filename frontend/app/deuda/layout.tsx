import type { Metadata } from 'next';

// Cifras: Banco de España (deuda PDE a 30/06/2026, nota de 30/09/2026) e IGAE (intereses AAPP 2025, IT 4T 2025).
const OG_IMAGE = '/api/og?title=Deuda%20P%C3%BAblica%20de%20Espa%C3%B1a&sub=1.762.936%20M%E2%82%AC%20%C2%B7%20101%2C4%25%20del%20PIB%20%2830%2F06%2F2026%29%20%C2%B7%20Banco%20de%20Espa%C3%B1a';

export const metadata: Metadata = {
  title: 'Deuda Pública de España – Serie 2009–2025 y último dato (Banco de España)',
  description:
    'Deuda de las Administraciones Públicas según el PDE: 1.762.936 M€, el 101,4% del PIB, a 30 de junio de 2026 (Banco de España). Serie anual 2009–2025, intereses (IGAE), comparativa UE (Eurostat) y deuda de las CCAA.',
  keywords: [
    'deuda publica españa 2026',
    'deuda españa porcentaje PIB',
    'intereses deuda publica españa',
    'deuda publica española evolución',
    'deuda per capita españa',
    'comparativa deuda europa',
    'deuda comunidades autonomas',
    'banco de españa deuda',
  ],
  openGraph: {
    title: 'Deuda Pública de España – 101,4% del PIB a 30/06/2026 · Banco de España',
    description: 'Deuda PDE de las AAPP: 1.762.936 M€ a 30/06/2026 (Banco de España). Intereses de las AAPP en 2025: 40.314 M€ (IGAE).',
    url: 'https://gastopublico.es/deuda',
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Deuda Pública España – 1.762.936 M€ (30/06/2026)',
    description: '101,4% del PIB a 30/06/2026 (Banco de España). Intereses de las AAPP en 2025: 40.314 M€ (IGAE). Serie desde 2009.',
    images: [OG_IMAGE],
  },
  alternates: { canonical: 'https://gastopublico.es/deuda' },
};

export default function DeudaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
