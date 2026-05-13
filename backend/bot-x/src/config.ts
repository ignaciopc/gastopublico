import 'dotenv/config';

function required(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Variable de entorno requerida: ${key}`);
  return v;
}

export const config = {
  supabase: {
    url: required('SUPABASE_URL'),
    secretKey: required('SUPABASE_SECRET_KEY'),
  },
  x: {
    apiKey: required('X_API_KEY'),
    apiSecret: required('X_API_SECRET'),
    accessToken: required('X_ACCESS_TOKEN'),
    accessTokenSecret: required('X_ACCESS_TOKEN_SECRET'),
  },
  umbrales: {
    contrato: Number(process.env.CONTRATO_UMBRAL ?? 1_000_000),
    subvencion: Number(process.env.SUBVENCION_UMBRAL ?? 500_000),
  },
  dryRun: process.argv.includes('--dry-run'),
};
