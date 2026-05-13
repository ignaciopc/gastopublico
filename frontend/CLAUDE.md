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
│   ├── presupuesto/page.tsx  # Dashboard completo IGAE (client component)
│   ├── contratos/page.tsx    # Feed licitaciones PLACE (client component)
│   ├── subvenciones/page.tsx # Placeholder BDNS (server component)
│   ├── datasets/page.tsx     # Open data + API docs (server component)
│   ├── api/
│   │   ├── presupuesto/route.ts        # Lee de Supabase → fallback IGAE
│   │   ├── presupuesto/detalle/route.ts # Filas raw por ejercicio/sección
│   │   ├── contratos/route.ts          # Lee de Supabase → fallback PLACE Atom feed
│   │   ├── cron/sync/route.ts          # Llamado por Vercel Cron (requiere CRON_SECRET)
│   │   └── revalidate/route.ts         # Invalida caché (requiere REVALIDATE_SECRET)
│   ├── sitemap.ts / robots.ts
│   ├── not-found.tsx / error.tsx
│   └── presupuesto/loading.tsx, contratos/loading.tsx
├── components/
│   ├── layout/  Navbar.tsx, Footer.tsx, ThemeProvider.tsx
│   ├── ui/      KpiCard.tsx, Badge.tsx, Spinner.tsx, SectionHeader.tsx
│   ├── charts/  BudgetBarChart.tsx, BudgetDonut.tsx, EjecucionGauge.tsx
│   └── dashboard/ BudgetTable.tsx, EjercicioSelector.tsx
├── lib/
│   ├── supabase.ts          # Clientes público y servidor + tipos DB
│   ├── cache.ts             # Caché en memoria (se pierde en cold start)
│   ├── constants.ts         # URLs IGAE, TTLs, MINISTERIOS_MAP, CURRENT_EJERCICIO=2024
│   ├── types.ts             # BudgetExecution, Contract, Dataset, KpiMetric...
│   ├── formatters.ts        # formatEUR, formatPercent, formatNumber, formatDateES
│   ├── data/igae.ts         # Fetch CSV del IGAE → transformBudgetRows → fallback seed
│   ├── transformers/budget.ts # transformBudgetRows, summarizeBudget
│   └── sync/
│       ├── budget.ts        # syncBudgetToSupabase(ejercicio)
│       └── contratos.ts     # syncContratosToSupabase(contracts[])
└── vercel.json              # Cron: /api/cron/sync cada día a las 06:00 UTC
```

## Esquema Supabase

**Tablas:** `budget_executions`, `contratos`, `sync_log`
**Vista:** `budget_summary_by_seccion` (agrega por ejercicio+sección, úsala para el dashboard)

Columnas snake_case en BD → camelCase en TypeScript vía mapeo manual (ver `lib/supabase.ts`).
RLS activado: lectura pública anónima, escritura solo con `SUPABASE_SECRET_KEY`.

## Flujo de datos
1. Vercel Cron llama `/api/cron/sync` → `syncBudgetToSupabase(2024)` → upsert en Supabase
2. Las API routes leen de **Supabase primero** (rápido, persistente)
3. Si Supabase está vacío → fetch directo de IGAE/PLACE
4. Si IGAE falla → datos seed hardcodeados en `lib/data/igae.ts:getSeedData()`
5. Caché en memoria (1h presupuesto, 30min contratos) evita hits repetidos a Supabase

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
- [x] Presupuesto IGAE: dashboard con gráficos, tabla, selector de ejercicio (2022–2024)
- [x] Contratos PLACE: feed en tiempo real parseado del Atom feed
- [x] Impuestómetro: calculadora IRPF + SS 2024, distribución por partidas, día de liberación fiscal
- [x] Datasets: página open data con enlaces a CSV/JSON y docs de API
- [x] Cron diario: sync automático a las 06:00 UTC via Vercel Cron
- [x] Dark mode, SEO básico, sitemap, robots.txt

### ✅ Fase 2 — Completada
- [x] **Subvenciones BDNS**: integración real con API REST `https://www.pap.hacienda.gob.es/bdnstrans/api/`
      Endpoint correcto: `/api/concesiones/busqueda?anio=XXXX&page=N&pageSize=100`
      Flujo: Supabase (cron) → BDNS directo → seed data. Cron sincroniza top 500 por importe.
      Stats de totales (47.84bn, 37.240€ medio, 17.3% top100) vienen del informe anual BDNS 2024
      porque la API no expone agregados — es la fuente más precisa disponible.
      Archivos: `lib/data/bdns.ts`, `lib/sync/subvenciones.ts`, `app/api/subvenciones/route.ts`.
- [x] **Comparador histórico**: implementado en `/presupuesto` (tabs "Comparador histórico" y "Tabla comparativa").
- [x] **Fix cron**: todos los syncs corren en paralelo (`Promise.all`), `maxDuration=300`.
      `syncContratosToSupabase()` ya no da timeout al correr junto con budget y BDNS.
- [x] **Fix fallback IGAE por año**: `loadSampleData()` carga `public/data/presupuesto-{año}.json`
      (archivos independientes para 2022, 2023, 2024). Ya no se reutiliza el fichero 2024 para
      todos los años. URLs IGAE bloqueadas por SharePoint en dev; en Vercel funcionan directamente.
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
- [ ] **Bot X** (@GastoPublicoES): webhook Node.js en `backend/` cuando contratos > umbral.
- [ ] **AdSense / Carbon Ads** en footer.

## Lo que NO hacer
- No instalar Prisma ni otro ORM — usamos Supabase client directamente
- No añadir autenticación de usuarios (los datos son públicos, no hay login)
- No usar `Github` de lucide-react (no existe en v1.8) — usar `GitFork`
- No pasar genérico a `Papa.parse<T>()` — hacer cast del resultado
- No usar `var(--*)` en clases Tailwind — usar clases canónicas (tabla arriba)
