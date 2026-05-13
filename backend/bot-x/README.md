# Bot X — @GastoPublicoES

Publica en X (Twitter) cada contrato adjudicado superior a 1 M€ y cada subvención notable de la BDNS.

## Arquitectura

Lee de Supabase (tablas `contratos` y `subvenciones`) los registros que aún no tienen `tweeted_at` relleno y los publica. Luego marca esos registros con la fecha actual para no volver a publicarlos.

**No hay servidor HTTP.** El bot se ejecuta como un proceso cron (cada hora, por ejemplo).

## Puesta en marcha

### 1. Requisitos previos

- Cuenta en [X Developer Portal](https://developer.twitter.com) con app creada y permisos de **lectura y escritura**
- Proyecto Supabase de GastoPublico.es ya en marcha
- Columna `tweeted_at TIMESTAMPTZ NULL` añadida a las tablas `contratos` y `subvenciones`

### 2. Instalar dependencias

```bash
cd backend/bot-x
npm install
```

### 3. Variables de entorno

Crea `backend/bot-x/.env`:

```env
SUPABASE_URL=https://uayqzvazhkowfhairbij.supabase.co
SUPABASE_SECRET_KEY=tu_clave_secreta
X_API_KEY=tu_api_key
X_API_SECRET=tu_api_secret
X_ACCESS_TOKEN=tu_access_token
X_ACCESS_TOKEN_SECRET=tu_access_token_secret
CONTRATO_UMBRAL=1000000
SUBVENCION_UMBRAL=500000
```

### 4. Migración Supabase

Ejecuta en el Dashboard de Supabase:

```sql
ALTER TABLE contratos ADD COLUMN IF NOT EXISTS tweeted_at TIMESTAMPTZ;
ALTER TABLE subvenciones ADD COLUMN IF NOT EXISTS tweeted_at TIMESTAMPTZ;
```

### 5. Probar sin publicar

```bash
npm run check
```

### 6. Ejecutar

```bash
npm run build
npm start
```

### 7. Programar como cron

En Railway / Render, configura el servicio de tipo **Cron Job** con schedule `0 * * * *` (cada hora).

En un VPS con crontab:

```
0 * * * * cd /opt/gastopublico/backend/bot-x && node dist/index.js >> /var/log/bot-x.log 2>&1
```

## Formato de los tweets

**Contrato adjudicado:**
```
✅ ADJUDICADO — 4,50 M€

📌 Suministro de equipamiento informático para los servicios centrales…
🏛️ Ministerio de Hacienda
🏢 Adjudicatario: HP Inc. España S.L.

💰 Tu dinero. Datos oficiales PLACE.

https://contrataciondelestado.es/...

#GastoPublico #Contratos #Transparencia
```

**Subvención notable:**
```
💸 SUBVENCIÓN — 1,20 M€

📌 Ayudas para proyectos de integración de personas inmigrantes…
🏛️ Convocante: Ministerio de Inclusión
🏢 Beneficiario: Cruz Roja Española

💰 Datos oficiales BDNS.

https://gastopublico.es/subvenciones

#GastoPublico #Subvenciones #Transparencia
```
