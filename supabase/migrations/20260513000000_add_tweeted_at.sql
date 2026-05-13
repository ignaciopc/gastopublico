-- Añade columna tweeted_at para que el bot-x marque qué registros ya se han publicado en X.
ALTER TABLE contratos ADD COLUMN IF NOT EXISTS tweeted_at TIMESTAMPTZ;
ALTER TABLE subvenciones ADD COLUMN IF NOT EXISTS tweeted_at TIMESTAMPTZ;
