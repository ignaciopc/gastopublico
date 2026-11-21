-- Ejecución del Presupuesto del Estado (Administración General del Estado) según el
-- «Extracto de ejecución del Presupuesto» mensual de la IGAE (hojas GTOS 001 y GTOS 004).
-- Importes en MILES DE EUROS, acumulados desde el 1 de enero hasta fecha_corte.
-- Cada extracto trae también el mismo periodo del ejercicio anterior; se guarda con su
-- propio ejercicio y el fichero de origen.
CREATE TABLE IF NOT EXISTS public.igae_ejecucion (
  ejercicio                 smallint    NOT NULL,
  mes                       smallint    NOT NULL CHECK (mes BETWEEN 1 AND 12),
  nivel                     text        NOT NULL CHECK (nivel IN ('seccion', 'capitulo', 'total')),
  nombre                    text        NOT NULL,
  orden                     smallint    NOT NULL,
  fecha_corte               date        NOT NULL,
  creditos_definitivos      bigint      NOT NULL,
  gastos_comprometidos      bigint      NOT NULL,
  obligaciones_reconocidas  bigint      NOT NULL,
  pagos_realizados          bigint      NOT NULL,
  fichero                   text        NOT NULL,
  cargado_at                timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ejercicio, mes, nivel, nombre)
);

ALTER TABLE public.igae_ejecucion ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public read igae_ejecucion" ON public.igae_ejecucion;
CREATE POLICY "public read igae_ejecucion" ON public.igae_ejecucion
  FOR SELECT TO anon, authenticated USING (true);
