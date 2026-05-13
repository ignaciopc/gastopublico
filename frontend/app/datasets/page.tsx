import { Download, ExternalLink, FileText, Database, RefreshCw, Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Badge from '@/components/ui/Badge';

export const metadata: Metadata = {
  title: 'Datasets y API – Open Data del Gasto Público Español',
  description:
    'Descarga gratis los datos del gasto público español en CSV y JSON. API REST documentada con endpoint por ejercicio y ministerio. Fuentes: IGAE, BDNS y PLACE. Licencia CC-BY 4.0.',
  keywords: ['open data gasto público', 'API presupuesto España', 'datos abiertos gobierno', 'CSV gasto ministerios', 'IGAE open data', 'BDNS API'],
  openGraph: {
    title: 'Datasets y API – Open Data del Gasto Público Español',
    description: 'Descarga CSV y JSON del presupuesto, contratos y subvenciones. API REST documentada. Licencia CC-BY 4.0.',
    url: 'https://gastopublico.es/datasets',
    images: [{ url: '/api/og?title=Datasets%20y%20API&sub=Open%20data%20del%20gasto%20p%C3%BAblico%20espa%C3%B1ol%20%C2%B7%20CC-BY%204.0', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Datasets y API – Open Data del Gasto Público Español',
    images: ['/api/og?title=Datasets%20y%20API&sub=Open%20data%20del%20gasto%20p%C3%BAblico%20espa%C3%B1ol%20%C2%B7%20CC-BY%204.0'],
  },
  alternates: { canonical: 'https://gastopublico.es/datasets' },
};

const DATASETS = [
  {
    id: 'presupuesto-2024',
    title: 'Ejecución Presupuestaria 2024',
    description: 'Obligaciones reconocidas, créditos definitivos y tasa de ejecución por sección y programa presupuestario. Datos del IGAE.',
    source: 'IGAE',
    formats: ['CSV', 'JSON'],
    updated: '2024-11-01',
    rows: '~2.400 filas',
    apiEndpoint: '/api/presupuesto?ejercicio=2024',
    csvUrl: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2024.csv',
  },
  {
    id: 'presupuesto-2023',
    title: 'Ejecución Presupuestaria 2023',
    description: 'Mismo formato que 2024. Permite comparación interanual del gasto ejecutado por ministerio.',
    source: 'IGAE',
    formats: ['CSV', 'JSON'],
    updated: '2024-01-15',
    rows: '~2.200 filas',
    apiEndpoint: '/api/presupuesto?ejercicio=2023',
    csvUrl: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2023.csv',
  },
  {
    id: 'presupuesto-2022',
    title: 'Ejecución Presupuestaria 2022',
    description: 'Datos de ejecución del ejercicio 2022 normalizados al mismo esquema que los ejercicios posteriores.',
    source: 'IGAE',
    formats: ['CSV', 'JSON'],
    updated: '2023-02-10',
    rows: '~2.100 filas',
    apiEndpoint: '/api/presupuesto?ejercicio=2022',
    csvUrl: 'https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/ejecucion/Documents/EjecucionPresupuestariaEstado2022.csv',
  },
  {
    id: 'contratos-live',
    title: 'Contratos Públicos (tiempo real)',
    description: 'Últimas licitaciones y adjudicaciones del Estado, parseadas del Atom feed de la Plataforma de Contratación.',
    source: 'PLACE',
    formats: ['JSON'],
    updated: 'Cada 30 min',
    rows: '~50 más recientes',
    apiEndpoint: '/api/contratos',
    csvUrl: null,
  },
];

const SCHEMA_FIELDS = [
  { field: 'ejercicio', type: 'number', desc: 'Año del ejercicio presupuestario' },
  { field: 'seccion', type: 'string', desc: 'Código de sección (2 dígitos)' },
  { field: 'seccionDescripcion', type: 'string', desc: 'Nombre del ministerio o sección' },
  { field: 'programa', type: 'string', desc: 'Código de programa presupuestario' },
  { field: 'programaDescripcion', type: 'string', desc: 'Descripción del programa' },
  { field: 'credIniciales', type: 'number', desc: 'Créditos iniciales en euros' },
  { field: 'credModificaciones', type: 'number', desc: 'Modificaciones de crédito en euros' },
  { field: 'credDefinitivos', type: 'number', desc: 'Créditos definitivos = iniciales + modificaciones' },
  { field: 'obligacionesReconocidas', type: 'number', desc: 'Gasto real ejecutado en euros' },
  { field: 'obligacionesPagadas', type: 'number', desc: 'Pagos realizados en euros' },
  { field: 'tasaEjecucion', type: 'number', desc: 'Porcentaje de ejecución (0–100)' },
];

export default function DatasetsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-accent">Open Data · Libre</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">Descarga de Datos</h1>
        <p className="text-sm text-muted mt-1">
          Datos del gasto público español ya limpios, normalizados y listos para usar. Sin registro, sin coste, licencia CC BY 4.0.
        </p>
      </div>

      {/* Value props */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Shield, label: 'Fuentes oficiales', desc: 'IGAE, PLACE — sin intermediarios' },
          { icon: RefreshCw, label: 'Siempre actualizado', desc: 'Los datos se sincronizan automáticamente' },
          { icon: Database, label: 'API REST incluida', desc: 'Consulta JSON directamente desde tu app' },
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
                    <span>🗓 Actualizado: {ds.updated}</span>
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
                  {ds.csvUrl && (
                    <a
                      href={ds.csvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Accede directamente al CSV oficial del IGAE (puede requerir navegador)"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-card-border bg-background text-sm font-medium hover:border-accent transition-colors"
                    >
                      <FileText size={14} />
                      Fuente original IGAE ↗
                      <ExternalLink size={12} className="opacity-60" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-3">
          * Los CSV del IGAE se sirven desde SharePoint y pueden requerir acceso desde navegador. Usa el endpoint JSON de nuestra API para acceso programático.
        </p>
      </div>

      {/* API docs */}
      <div className="bg-card border border-card-border rounded-xl p-6">
        <h2 className="font-bold text-lg mb-1">API REST</h2>
        <p className="text-sm text-muted mb-5">Consulta los datos directamente desde tu aplicación. Sin autenticación requerida.</p>
        <div className="space-y-4">
          {[
            {
              method: 'GET',
              path: '/api/presupuesto',
              desc: 'Resumen del presupuesto con KPIs y breakdown por sección',
              params: '?ejercicio=2024 (opcional, por defecto 2024)',
            },
            {
              method: 'GET',
              path: '/api/presupuesto/detalle',
              desc: 'Todas las filas de ejecución a nivel de programa',
              params: '?ejercicio=2024&seccion=08 (seccion opcional)',
            },
            {
              method: 'GET',
              path: '/api/contratos',
              desc: 'Últimas licitaciones y adjudicaciones en tiempo real',
              params: 'Sin parámetros',
            },
            {
              method: 'GET',
              path: '/api/subvenciones',
              desc: 'Top perceptores BDNS y estadísticas de subvenciones',
              params: '?ejercicio=2024&q=busqueda (q opcional)',
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

      {/* Schema */}
      <div>
        <h2 className="font-bold text-lg mb-4">Esquema de datos (Presupuesto)</h2>
        <div className="bg-card border border-card-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-background">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Campo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted">Descripción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {SCHEMA_FIELDS.map(f => (
                <tr key={f.field} className="hover:bg-background transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-accent">{f.field}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={f.type === 'number' ? 'info' : 'default'}>{f.type}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-muted text-xs">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* License */}
      <div className="bg-background border border-card-border rounded-xl p-5 text-sm text-muted">
        <strong className="text-foreground">Licencia:</strong> Los datos son de fuentes oficiales del Gobierno de España y se publican bajo licencia{' '}
        <a href="https://datos.gob.es/es/aviso-legal" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">
          Creative Commons Attribution 4.0 (CC BY 4.0)
        </a>.
        Puedes usarlos libremente para análisis, periodismo, investigación o desarrollo de aplicaciones citando la fuente original.
      </div>
    </div>
  );
}
