# Backend — GastoPublico.es

## Propósito

Scripts, workers y bots que complementan el frontend Next.js.

## Estructura

```
backend/
├── bot-x/          # Bot @GastoPublicoES en X (Twitter)
│   └── README.md   # Ver instrucciones de puesta en marcha
└── CLAUDE.md       # Este fichero
```

## Stack

- **Runtime:** Node.js 20 + TypeScript
- **X API:** Twitter API v2 via `twitter-api-v2`
- **Supabase:** mismo proyecto que el frontend (`uayqzvazhkowfhairbij` / `eu-west-1`)
- **Deploy:** proceso independiente (Railway, Render o VPS)

## Variables de entorno necesarias (bot-x)

```
SUPABASE_URL                  # Igual que en frontend
SUPABASE_SECRET_KEY           # Igual que en frontend
X_API_KEY                     # API Key de la app X Developer
X_API_SECRET                  # API Secret
X_ACCESS_TOKEN                # Access Token de la cuenta @GastoPublicoES
X_ACCESS_TOKEN_SECRET         # Access Token Secret
CONTRATO_UMBRAL               # Importe mínimo para tuitear (default: 1000000)
```

## Lo que NO hacer

- No duplicar lógica de sincronización — el cron de Vercel ya llena Supabase
- No usar Prisma — el cliente de Supabase es suficiente
- No añadir frameworks web — los workers son scripts cron, no servidores HTTP
