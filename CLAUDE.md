# GastoPublico.es — Raíz del monorepo

## Estructura del repositorio

```
GastoPublicoES/
├── frontend/          # Aplicación Next.js 16 — toda la lógica de la web
│   └── CLAUDE.md      # ← Guía principal del proyecto: léela siempre
├── backend/           # Reservado (vacío actualmente)
│   │                  # Uso previsto: bot X, scripts de scraping, workers
└── .claude/
    └── settings.local.json   # Permisos de Claude Code para este repo
```

## Punto de entrada

**Todo el código está en `frontend/`**. Lee `frontend/CLAUDE.md` antes de tocar cualquier cosa.

El directorio `backend/` está vacío — si vas a crear algo allí (bot, worker, script),
crea primero un `backend/CLAUDE.md` describiendo su stack y propósito.

## Comandos desde la raíz

```bash
cd frontend && npm run dev      # Arrancar servidor de desarrollo (puerto 3000)
cd frontend && npm run build    # Build de producción
cd frontend && npm run lint     # Linter ESLint
```

## Variables de entorno

El fichero `.env.local` vive en `frontend/.env.local` (nunca en la raíz).
Ver la sección de variables en `frontend/CLAUDE.md`.

## Deploy

Vercel apunta a la carpeta `frontend/`. El cron diario corre a las 06:00 UTC.
