import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://gastopublico.es';
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/presupuesto`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/subvenciones`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contratos`, lastModified: now, changeFrequency: 'hourly', priority: 0.8 },
    { url: `${base}/datasets`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/gobierno`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/seguridad`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/vivienda`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/paro`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/pensiones`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/deuda`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/sanidad`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/educacion`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/alertas`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/impuestometro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/inmigracion`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/politicos`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/metodologia`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ];
}
