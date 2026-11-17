import { Download, Database, RefreshCw, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Datasets y API – Open Data del Gasto Público Español',
  description:
    'Endpoints JSON públicos con los datos de contratos (PLACSP) y subvenciones (BDNS) que muestra GastoPúblico.es.',
  keywords: ['open data gasto público', 'API presupuesto España', 'datos abiertos gobierno', 'CSV gasto ministerios', 'IGAE open data', 'BDNS API'],
  openGraph: {
    title: 'Datasets y API – Open Data del Gasto Público Español',
    description: 'Endpoints JSON públicos con los datos de contratos (PLACSP) y subvenciones (BDNS).',
    url: 'https://gastopublico.es/datasets',
    images: [{ url: '/api/og?title=Datasets%20y%20API&sub=Endpoints%20JSON%20%C2%B7%20PLACSP%20y%20BDNS', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datasets y API – Open Data del Gasto Público Español',
    images: ['/api/og?title=Datasets%20y%20API&sub=Endpoints%20JSON%20%C2%B7%20PLACSP%20y%20BDNS'],
  },
  alternates: { canonical: 'https://gastopublico.es/datasets' },
};

// Los datasets de ejecución presupuestaria (2022–2024) se retiraron: la API devolvía
// cifras de ejemplo, no datos IGAE, y los enlaces CSV no corresponden a ficheros publicados.
const DATASETS = [
  {
    id: 'contratos',
    title: 'Licitaciones publicadas por agregación (PLACSP)',
    description: 'Las 50 licitaciones más recientes de nuestra copia del feed de la Plataforma de Contratación del Sector Público «licitaciones publicadas mediante mecanismos de agregación, excluidos contratos menores». El importe es el presupuesto base de licitación sin impuestos.',
    source: 'PLACSP',
    formats: ['JSON'],
    updated: 'Diaria, 06:00 UTC',
    rows: '50 filas',
    apiEndpoint: '/api/contratos',
  },
  {
    id: 'subvenciones',
    title: 'Concesiones de subvenciones sincronizadas (BDNS)',
    description: 'Resumen calculado sobre nuestra copia parcial de la BDNS (nº de concesiones, suma, media, rango de fechas, reparto por nivel de la administración concedente) y las 8 concesiones de mayor importe.',
    source: 'BDNS',
    formats: ['JSON'],
    updated: 'Diaria, 06:00 UTC',
    rows: 'Resumen + 8 filas',
    apiEndpoint: '/api/subvenciones',
  },
];

export default function DatasetsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Datos · JSON</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Datos y API</h1>
        <p className="text-sm text-muted mt-1">
          Los mismos datos que muestran las secciones de contratos y subvenciones, en JSON. Sin registro ni autenticación.
        </p>
      </div>

      {/* Value props */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, label: 'Fuentes oficiales', desc: 'PLACSP (Ministerio de Hacienda) y BDNS (IGAE)' },
          { icon: RefreshCw, label: 'Sincronización diaria', desc: 'Proceso automático cada día a las 06:00 UTC' },
          { icon: Database, label: 'Endpoints JSON', desc: 'Peticiones GET sin autenticación' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-card border border-card-border rounded-xl p-5 flex gap-3">
            <div className="shrink-0 p-2 h-fit rounded-lg bg-accent-light">
              <Icon size={18} className="text-accent" />
            </div>
            <div>
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-xs text-muted mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Datasets */}
      <div>
        <h2 className="font-bold text-lg mb-4">Datasets disponibles</h2>
        <div className="space-y-4">
          {DATASETS.map(ds => (
            <div key={ds.id} className="bg-card border border-card-border rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-bold">{ds.title}</h3>
                    <Badge variant="info">{ds.source}</Badge>
                    {ds.formats.map(f => (
                      <Badge key={f} variant="default">{f}</Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted leading-relaxed mb-3">{ds.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span>🗓 Actualización: {ds.updated}</span>
                    <span>📊 {ds.rows}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <a
                    href={ds.apiEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Download size={14} />
                    Descargar JSON
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          Los datos de ejecución presupuestaria no se ofrecen por ahora: no están cargados desde una fuente oficial.
        </p>
      </div>

      {/* API docs */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="font-bold text-lg mb-1">Endpoints</h2>
        <p className="text-sm text-muted mb-5">Peticiones GET que devuelven JSON. Sin autenticación. Sin garantía de estabilidad del formato.</p>
        <div className="space-y-4">
          {[
            {
              method: 'GET',
              path: '/api/contratos',
              desc: 'Las 50 licitaciones más recientes de la copia sincronizada (actualización diaria)',
              params: 'Sin parámetros',
            },
            {
              method: 'GET',
              path: '/api/subvenciones',
              desc: 'Sin parámetros: resumen sobre las concesiones sincronizadas y las 8 de mayor importe. Con parámetros: hasta 100 concesiones ordenadas por importe',
              params: '?q=texto (beneficiario o descripción) · ?tipo=Administración Local (nivel concedente) · ?all=1',
            },
          ].map(ep => (
            <div key={ep.path} className="border border-card-border rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-background border-b border-card-border">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">{ep.method}</span>
                <code className="text-sm font-mono">{ep.path}</code>
              </div>
              <div className="px-4 py-3 space-y-1">
                <p className="text-sm">{ep.desc}</p>
                <p className="text-xs text-muted font-mono">{ep.params}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* License */}
      <div className="bg-background border border-card-border rounded-xl p-5 text-sm text-muted">
        <strong className="text-foreground">Reutilización:</strong> los datos proceden de la Plataforma de Contratación del Sector Público
        y de la Base de Datos Nacional de Subvenciones. Su reutilización se rige por las condiciones de cada fuente y por la{' '}
        <a href="https://www.boe.es/buscar/act.php?id=BOE-A-2007-19814" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
          Ley 37/2007, sobre reutilización de la información del sector público
        </a>
        . Cita siempre la fuente original.
      </div>
    </div>
  );
}
