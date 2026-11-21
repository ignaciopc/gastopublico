@AGENTS.md

# GastoPublico.es — Guía para Claude

## Qué es este proyecto
Web de transparencia del gasto público español. Datos oficiales del IGAE, BDNS y Plataforma de Contratación del Estado. Next.js 16 + Supabase + Vercel.

## Stack exacto
- **Framework:** Next.js 16.2.1 con App Router y Turbopack
- **CSS:** Tailwind CSS v4 — ver sección crítica abajo
- **Gráficos:** Chart.js 4 + react-chartjs-2
- **BD:** Supabase (PostgreSQL 17) — proyecto `uayqzvazhkowfhairbij` región `eu-west-1`
- **Icons:** lucide-react v1.8 — `Github` NO existe, usar `GitFork`
- **Parsing:** papaparse (usar cast `as Papa.ParseResult<T>`, no genérico en `.parse()`)
- **Deploy:** Vercel + cron diario a las 06:00 UTC via `/api/cron/sync`

## ⚠️ Tailwind v4 — CRÍTICO
En Tailwind v4 las variables CSS del `@theme inline` generan clases canónicas directamente.
**Nunca uses** `bg-[var(--card)]` — usa la clase canónica equivalente:

| Variable CSS        | Clase canónica       |
|---------------------|----------------------|
| `--background`      | `bg-background`, `text-background` |
| `--foreground`      | `text-foreground`    |
| `--card`            | `bg-card`            |
| `--card-border`     | `border-card-border`, `divide-card-border` |
| `--muted`           | `text-muted`         |
| `--accent`          | `bg-accent`, `text-accent`, `border-accent` |
| `--accent-light`    | `bg-accent-light`    |

Otras preferencias de clase: usar `shrink-0` no `flex-shrink-0`.

## Estructura de archivos clave

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout: ThemeProvider + Navbar + Footer + SEO
│   ├── page.tsx            # Home: hero, KPI bar, features grid, top 5 partidas
│   ├── presupuesto/page.tsx  # Ejecución del Presupuesto del Estado (server, datos igae_ejecucion)
│   ├── contratos/page.tsx    # Feed licitaciones PLACE (client component)
│   ├── subvenciones/page.tsx # Placeholder BDNS (server component)
│   ├── datasets/page.tsx     # Open data + API docs (server component)
│   ├── api/
│   │   ├── presupuesto/route.ts        # Último extracto IGAE en JSON (igae_ejecucion)
│   │   ├── contratos/route.ts          # Lee de Supabase → fallback PLACE Atom feed
│   │   ├── cron/sync/route.ts          # Llamado por Vercel Cron (requiere CRON_SECRET)
│   │   └── revalidate/route.ts         # Invalida caché (requiere REVALIDATE_SECRET)
│   ├── sitemap.ts / robots.ts
│   ├── not-found.tsx / error.tsx
│   └── presupuesto/loading.tsx, contratos/loading.tsx
├── components/
│   ├── layout/  Navbar.tsx, Footer.tsx, ThemeProvider.tsx
│   ├── ui/      KpiCard.tsx, Badge.tsx, Spinner.tsx, SectionHeader.tsx
├── lib/
│   ├── supabase.ts          # Clientes público y servidor + tipos DB
│   ├── cache.ts             # Caché en memoria (se pierde en cold start)
│   ├── constants.ts         # Feed PLACE, TTLs
│   ├── types.ts             # Contract, Dataset, KpiMetric...
│   ├── formatters.ts        # formatEUR, formatPercent, formatNumber, formatDateES
│   ├── igae/extracto.ts     # Lector del Excel del extracto mensual de la IGAE
│   ├── igae/consultas.ts    # getUltimaEjecucion()
│   └── sync/
│       ├── igae.ts          # syncIgaeExtracto(): descarga y carga el extracto nuevo
│       └── contratos.ts     # syncContratosToSupabase(contracts[])
└── vercel.json              # Cron: /api/cron/sync cada día a las 06:00 UTC
```

## Esquema Supabase

**Tablas:** `igae_ejecucion`, `contratos`, `subvenciones`, `alert_subscriptions`, `sync_log`
(`budget_executions`, `subvenciones_stats` y la vista `budget_summary_by_seccion` son restos sin uso)

Columnas snake_case en BD → camelCase en TypeScript vía mapeo manual (ver `lib/supabase.ts`).
RLS activado: lectura pública anónima, escritura solo con `SUPABASE_SECRET_KEY`.

## Flujo de datos
1. Vercel Cron llama `/api/cron/sync` → `syncIgaeExtracto()`, contratos PLACE y subvenciones BDNS → upsert en Supabase
2. Las páginas y API routes leen de Supabase. Si no hay datos, muestran «no disponible»: nunca cifras de ejemplo
3. Caché en memoria (30 min contratos) evita hits repetidos a Supabase

## Variables de entorno necesarias
```
NEXT_PUBLIC_SUPABASE_URL          # URL del proyecto Supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # Clave pública (safe para browser)
SUPABASE_SECRET_KEY               # Clave secreta (NUNCA con NEXT_PUBLIC_)
REVALIDATE_SECRET                 # Para el endpoint /api/revalidate
CRON_SECRET                       # Vercel lo inyecta automáticamente en producción
NEXT_PUBLIC_BASE_URL              # https://gastopublico.es en prod
```

## Convenciones de código
- Componentes de página con datos del servidor: `async function`, `export const revalidate = 3600`
- Componentes interactivos (filtros, selectors): `'use client'` + `useState/useEffect`
- Los charts de Chart.js siempre son `'use client'` (necesitan DOM)
- No añadir comentarios salvo que el WHY sea no obvio
- No usar `flex-shrink-0` → `shrink-0`

## Estado de funcionalidades

### ✅ Fase 1 — Completada
- [x] Contratos PLACE: feed en tiempo real parseado del Atom feed
- [x] Impuestómetro: retención IRPF (algoritmo AEAT 2026) + cotizaciones 2026, reparto COFOG IGAE 2024
- [x] Datasets: página open data con enlaces a CSV/JSON y docs de API
- [x] Cron diario: sync automático a las 06:00 UTC via Vercel Cron
- [x] Dark mode, SEO básico, sitemap, robots.txt

### ✅ Fase 2 — Completada
- [x] **Subvenciones BDNS**: integración real con API REST `https://www.pap.hacienda.gob.es/bdnstrans/api/`
      Endpoint correcto: `/api/concesiones/busqueda?anio=XXXX&page=N&pageSize=100`
      Flujo: Supabase (cron) → BDNS directo. Cron sincroniza 500 concesiones por ejecución.
      Agregados calculados en vivo sobre lo sincronizado (ver «Estado real de los datos»).
      Archivos: `lib/data/bdns.ts`, `lib/sync/subvenciones.ts`, `app/api/subvenciones/route.ts`.
- [x] **Ejecución presupuestaria real** (21/11/2026): extracto mensual IGAE, ver sección propia.
- [x] **Fix cron**: todos los syncs corren en paralelo (`Promise.all`), `maxDuration=300`.
      `syncContratosToSupabase()` ya no da timeout al correr junto con budget y BDNS.
- [x] **Fallback IGAE eliminado** (17/11/2026): los JSON de ejemplo no eran datos oficiales.
      La descarga de CSV del IGAE nunca ha funcionado en producción (sync_log solo registró filas de ejemplo).
- [x] **Fix namespace XML PLACE**: `lib/data/place.ts` usaba prefijo `ns2:` incorrecto.
      Corregido a `cac-place-ext:`, `cac:`, `cbc:`, `cbc-place-ext:` (CODICE 2.x).
- [x] **Fix endpoint BDNS**: URL anterior era una SPA Angular, no una API REST.
      URL real descubierta del bundle Angular de BDNS.
- [x] **Fix dedup subvenciones**: upsert en batch fallaba con "ON CONFLICT DO UPDATE command
      cannot affect row a second time". Fix: dedup con Set antes del upsert.

### ✅ Fase 3 — Completada (parcialmente)
- [x] **Sistema de alertas**: Resend + tabla `alert_subscriptions` en Supabase + UI de suscripción.
      Archivos: `app/alertas/page.tsx`, `app/api/alertas/subscribe/route.ts`,
      `app/api/alertas/unsubscribe/route.ts`, `components/ui/AlertaSubscribeForm.tsx`,
      `components/ui/AlertaStatusBanner.tsx`.
      SQL migration: `supabase/migrations/20260511_alert_subscriptions.sql` (ejecutar en Supabase Dashboard).
      Requiere: `RESEND_API_KEY` en `.env.local`. Sin la clave guarda suscripciones en BD pero no envía emails.
      Alertas disponibles: `contratos_grandes` (>1M€), `subvenciones_destacadas` (>500k€), `resumen_semanal`.
- [ ] **AdSense / Carbon Ads** en footer.

## Alcance del proyecto (nov 2026)
La web se limita a datos de gasto público: contratos (PLACE), subvenciones (BDNS), deuda,
impuestómetro, datasets, metodología y alertas. Las secciones `gobierno`, `politicos`,
`inmigracion`, `seguridad`, `vivienda`, `paro`, `pensiones`, `sanidad` y `educacion` se
retiraron y redirigen (308) a `/` desde `next.config.ts`. El bot de X se eliminó.

## Regla de datos: la web no puede afirmar nada que no sea verificable
- Toda cifra mostrada lleva fuente oficial y periodo/fecha. Si no se puede verificar, no se publica.
- Lo extrapolado (contadores) se etiqueta como «estimación» y explica su cálculo.
- Sin adjetivos valorativos ni comparaciones elegidas para impresionar.
- Auditoría completa del 17/11/2026: informes en el PR #2 («fix/datos-verificados»).

## Estado real de los datos (auditoría 17/11/2026)
- **Presupuesto (IGAE): datos reales desde nov 2026.** Fuente: «Extracto de ejecución del
  Presupuesto. Administración General del Estado» (mensual, fichero «Cuadros» .xlsx). Ver
  la sección «Ejecución presupuestaria (IGAE)» más abajo. La antigua tabla `budget_executions`
  (datos de ejemplo inventados) está vacía y ya no se usa.
- **Subvenciones (BDNS):** los agregados se calculan en vivo sobre las concesiones
  sincronizadas (no es el total nacional). El parámetro `anio` de la API no filtra por año:
  la columna `ejercicio` no es fiable. `tipo_beneficiario` guarda el nivel de la
  administración concedente, no el tipo de beneficiario. `subvenciones_stats` ya no se escribe.
- **Contratos (PLACE):** es el feed de licitaciones por agregación (no solo AGE), el importe
  es presupuesto base de licitación sin impuestos y el adjudicatario viene vacío. El código
  de tipo estaba invertido (corregido en `lib/data/place.ts`; las filas antiguas siguen mal).
- **Alertas:** solo se guarda la suscripción y se manda el email de confirmación. No existe
  envío de avisos; la UI lo indica.

`alert_subscriptions` no debe tener políticas RLS públicas: las rutas `/api/alertas/*` usan
`SUPABASE_SECRET_KEY`.

## Ejecución presupuestaria (IGAE)
- **Lector:** `lib/igae/extracto.ts` (sin dependencias: lee el ZIP/XML del .xlsx con `node:zlib`).
  Lee las hojas `GTOS 001` (secciones) y `GTOS 004` (capítulos), ejercicio actual y mismo
  periodo del anterior. Rechaza el fichero si la suma de partidas no coincide exactamente
  con TOTALES o si los totales de ambas hojas difieren. Importes en **miles de euros**.
- **Tabla:** `igae_ejecucion` (PK ejercicio, mes, nivel, nombre). Migración
  `supabase/migrations/20261121000000_igae_ejecucion.sql`.
- **Carga automática:** `lib/sync/igae.ts` → `syncIgaeExtracto()` desde el cron diario. Busca el
  mes siguiente al último cargado; enlaces sacados de la página de la IGAE o, si no, con el
  nombre `EXTRACTO_<MES>_<AÑO>_EXCEL.xlsx`. **No verificado aún desde Vercel**: revisar
  `sync_log` (source `IGAE_EXTRACTO`) a final de mes.
- **Cargado el 21/11/2026:** septiembre de 2026 completo (secciones + capítulos + total, con el
  mismo periodo de 2025) y los totales mensuales de enero a agosto de 2026 (para la evolución).
  Las secciones/capítulos de enero–agosto no se cargaron; se pueden añadir con el script.
  Siguiente extracto: octubre (la IGAE lo publica el 23/11 según su calendario 2026).
- **Carga manual:** `node scripts/igae-a-json.mts <fichero.xlsx>` vuelca las filas en JSON
  (Node ≥ 22.18). Sirve para verificar ficheros y cargar a mano si la descarga falla.
- **Consulta/UI:** `lib/igae/consultas.ts` → `getUltimaEjecucion()`; `/presupuesto`,
  `/api/presupuesto` y el bloque «top 5 secciones» de la portada.

## Lo que NO hacer
- No instalar Prisma ni otro ORM — usamos Supabase client directamente
- No añadir autenticación de usuarios (los datos son públicos, no hay login)
- No usar `Github` de lucide-react (no existe en v1.8) — usar `GitFork`
- No pasar genérico a `Papa.parse<T>()` — hacer cast del resultado
- No usar `var(--*)` en clases Tailwind — usar clases canónicas (tabla arriba)
