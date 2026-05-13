import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguridad en España – Datos Reales de Criminalidad 2015–2023',
  description:
    'Evolución real de la criminalidad en España 2015–2023. Infracciones penales, delitos sexuales, ciberdelitos, robos y homicidios. Datos oficiales del Ministerio del Interior y Anuario Estadístico.',
  keywords: [
    'criminalidad España 2023',
    'estadísticas delincuencia España',
    'balance criminalidad ministerio interior',
    'delitos sexuales España evolución',
    'ciberdelitos España 2023',
    'infracciones penales España',
    'seguridad ciudadana España datos',
    'policía nacional guardia civil efectivos',
  ],
  openGraph: {
    title: 'Seguridad en España – Criminalidad 2015–2023 · Datos Oficiales',
    description: 'Infracciones penales, ciberdelitos +328%, delitos sexuales +108%. Evolución real de la seguridad en España con datos del Ministerio del Interior.',
    url: 'https://gastopublico.es/seguridad',
    images: [{ url: '/api/og?title=Seguridad%20en%20Espa%C3%B1a&sub=Evoluci%C3%B3n%20de%20la%20criminalidad%202015%E2%80%932023%20%C2%B7%20Datos%20Ministerio%20del%20Interior', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seguridad en España – Criminalidad 2015–2023',
    description: 'Ciberdelitos +328%, delitos sexuales +108%, infracciones totales en máximos. Datos reales del Ministerio del Interior.',
    images: ['/api/og?title=Seguridad%20en%20Espa%C3%B1a&sub=Evoluci%C3%B3n%20de%20la%20criminalidad%202015%E2%80%932023%20%C2%B7%20Datos%20Ministerio%20del%20Interior'],
  },
  alternates: { canonical: 'https://gastopublico.es/seguridad' },
};

export default function SeguridadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
