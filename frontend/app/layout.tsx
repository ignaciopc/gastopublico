import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ThemeProvider from '@/components/layout/ThemeProvider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

const OG_DEFAULT = '/api/og?title=GastoPublico.es&sub=Transparencia%20del%20Gasto%20P%C3%BAblico%20Espa%C3%B1ol';

export const metadata: Metadata = {
  title: {
    default: 'GastoPublico.es – Transparencia del Gasto Público Español',
    template: '%s | GastoPublico.es',
  },
  description:
    'Datos oficiales del gasto público español, sincronizados a diario: presupuesto del Estado, contratos públicos y subvenciones. Fuentes: IGAE, BDNS y Plataforma de Contratación del Sector Público.',
  keywords: [
    'gasto público España',
    'presupuesto general estado 2024',
    'transparencia fiscal España',
    'obligaciones reconocidas IGAE',
    'subvenciones BDNS España',
    'contratos públicos licitaciones',
    'calculadora IRPF 2024',
    'datos abiertos gobierno España',
    'gasto ministerios España',
    'impuestómetro España',
  ],
  authors: [{ name: 'GastoPublico.es' }],
  openGraph: {
    title: 'GastoPublico.es – Transparencia del Gasto Público Español',
    description:
      'Presupuesto del Estado por ministerio, contratos públicos y subvenciones, con la fuente oficial de cada dato. IGAE, BDNS y PLACE.',
    url: 'https://gastopublico.es',
    siteName: 'GastoPublico.es',
    locale: 'es_ES',
    type: 'website',
    images: [{ url: OG_DEFAULT, width: 1200, height: 630, alt: 'GastoPublico.es – Transparencia del Gasto Público Español' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GastoPublico.es – Transparencia del Gasto Público Español',
    // 764.884 M€ (empleos no financieros AAPP 2025, IGAE) / (365 × 86.400 s) = 24.254 €/s
    description: 'Las Administraciones Públicas gastaron 24.254 € por segundo en 2025 (IGAE). Datos oficiales del presupuesto, contratos y subvenciones.',
    site: '@GastoPublicoES',
    images: [OG_DEFAULT],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  metadataBase: new URL('https://gastopublico.es'),
  alternates: { canonical: 'https://gastopublico.es' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://gastopublico.es/#website',
      url: 'https://gastopublico.es',
      name: 'GastoPublico.es',
      description: 'Transparencia del gasto público español con datos oficiales',
      inLanguage: 'es-ES',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: 'https://gastopublico.es/contratos?q={search_term_string}' },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://gastopublico.es/#organization',
      name: 'GastoPublico.es',
      url: 'https://gastopublico.es',
      logo: { '@type': 'ImageObject', url: 'https://gastopublico.es/favicon.ico' },
      sameAs: ['https://x.com/GastoPublicoES'],
    },
    {
      '@type': 'DataCatalog',
      '@id': 'https://gastopublico.es/#datacatalog',
      name: 'GastoPublico.es – Open Data del Gasto Público Español',
      description: 'Presupuesto General del Estado, contratos públicos y subvenciones en formatos abiertos CSV y JSON.',
      url: 'https://gastopublico.es/datasets',
      license: 'https://creativecommons.org/licenses/by/4.0/',
      creator: { '@id': 'https://gastopublico.es/#organization' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
