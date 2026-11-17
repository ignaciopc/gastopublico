# Auditoría de datos — área «datos»

Fecha: 2026-11-17. Ámbito: subvenciones, presupuesto, contratos, datasets, metodología, alertas, footer, `lib/constants.ts`, `lib/data/{bdns,igae,place}.ts`.
Comprobaciones: `npx tsc --noEmit -p .` → 0 errores · `npm run lint` → 0 errores (1 warning previo en `components/layout/Navbar.tsx`, fuera de mi lista).

Las líneas son las del archivo **original**.

## Hallazgos principales

1. **El «informe anual BDNS 2024» no se ha localizado.** La Memoria IGAE 2024 (resumen), en su apartado «BDNS: datos relevantes en 2024», no contiene 47.840 M€, 37.240 € ni 17,3 %. Da otras cifras que parecen acumuladas (100 millones de concesiones registradas, 775.760 M€). Las cifras de la web estaban además escritas a mano en `getBdnsSeedData()`, y el cron las copiaba a `subvenciones_stats` (el código lo dice expresamente: «use seed annual-report figures»). → **Retiradas.** Ahora los agregados se calculan en vivo sobre la tabla `subvenciones`.
2. **La tabla `subvenciones` no es «ejercicio 2024».** Sus 53.482 filas tienen `ejercicio=2024`, pero `fecha_concesion` va del 30/04/2026 al 13/11/2026. El parámetro `anio` de la API de BDNS no filtra por año. Es una copia que acumula las ~500 concesiones que el cron baja cada día desde el 01/05/2026. → Se quitó toda etiqueta «2024» y se muestra el rango real de fechas.
3. **`tipo_beneficiario` no es el tipo de beneficiario.** Es el `nivel1` de la BDNS, es decir, el nivel de la administración **concedente**. Solo tiene 3 valores: Autonómica, Local y Otros. «Otros» incluye CDTI, ICO, AEI e IDAE, porque `ESTATAL` nunca coincide. Los filtros «Empresa pública», «Persona física», etc. no devolvían nunca nada. → Se renombró a «Administración concedente», con los 3 valores reales.
4. **Presupuesto: los datos seed/fallback son inventados, y también lo es la BD.** `budget_executions` (42 filas: 2022 → 12, 2023 → 12, 2024 → 18; sin columna de mes) contiene las mismas cifras redondas que `getSeedData()` y que `public/data/presupuesto-*.json`. Tienen códigos de sección y programa que no existen en los PGE (ver tabla). `sync_log` muestra que el cron IGAE escribe cada día **8 filas**, que es exactamente el seed: los CSV del IGAE nunca se han cargado. → Fallback eliminado (`fetchIgaeBudget` devuelve `[]`) y `/presupuesto` muestra «Datos no disponibles».
5. **Alertas: no existe ningún envío de avisos.** No hay cron en `vercel.json` (solo `/api/cron/sync`), ninguna ruta envía alertas y no hay resumen de los lunes. Lo único que se envía es un email de confirmación al suscribirse, y solo si existe `RESEND_API_KEY`. → Los textos ahora dicen que el envío «aún no está activo».
6. **Contratos.** Los contratos no vienen de PLACE estatal. Vienen del feed `sindicacion_1044/PlataformasAgregadasSinMenores`: licitaciones publicadas mediante **agregación** (plataformas autonómicas y otras, sin contratos menores). Las últimas filas son de Navarra.
   - El importe es `TaxExclusiveAmount`, es decir, el **presupuesto base de licitación sin impuestos**, no lo adjudicado.
   - `adjudicatario` está vacío en el 100 % de las filas.
   - El **tipo de contrato estaba invertido**: código 1 se tomaba como obras y 3 como suministros. En BD, 1.129 de 1.702 filas «obras» tienen «suministro» en el título.

## Tabla de verificación

| archivo:línea | afirmación original | veredicto | valor final | fuente |
|---|---|---|---|---|
| app/subvenciones/page.tsx:167 | «47.840 millones repartidos. El 17,3% va a 100 perceptores.» | ELIMINADO | «Concesiones de subvenciones sincronizadas desde la BDNS» | No localizado en fuente oficial. [Memoria IGAE 2024 (resumen)](https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/QuienesSomos/Documents/RESUMEN_Memoria%20IGAE_2024.pdf) no lo contiene |
| app/subvenciones/page.tsx:168 | «La BDNS publica todas las subvenciones… Aquí se muestran agregadas» | CORREGIDO | «Copia parcial… cada día se descargan las últimas concesiones… no representan el total nacional» | Supabase `subvenciones` (53.482 filas, fechas 30/04–13/11/2026) |
| app/subvenciones/page.tsx:171-172 | «Cobertura: Estado · CCAA · EELL», «Concedidas 2024: 47.840 M€» | CORREGIDO | «Concesiones sincronizadas: N», «Fechas: min – max» (en vivo) | Supabase `subvenciones` |
| app/api/subvenciones/route.ts:189 / lib/data/bdns.ts:183 | Total concedido 2024 = 47.840 M€ («47.84bn») | ELIMINADO | «Importe de esas concesiones» = suma en vivo (hoy 926,6 M€ sobre 53.482) | Supabase, `SUM(importe)` |
| route.ts:189 | «+8,2% vs. 2023» (en rojo) | ELIMINADO | — | Sin fuente |
| route.ts:190 / bdns.ts:184 | Nº concesiones (1.284.600 seed / 31.909.898 `totalElements` de la API) «todas las AAPP» | CORREGIDO | Nº de concesiones sincronizadas (en vivo) | Supabase `COUNT(*)`. El significado de `totalElements` no es verificable |
| route.ts:191 / bdns.ts:185 | Importe medio 37.240 € | CORREGIDO | suma ÷ N en vivo (hoy 17.325 €; fórmula en comentario) | Supabase |
| route.ts:192-196 / bdns.ts:186 | Top 100 perceptores = 17,3 % «del total nacional» | ELIMINADO | — | Sin fuente. No calculable sobre una copia parcial |
| route.ts:144-152 | Extrapolación de totales desde 100 filas de la API BDNS | ELIMINADO | Fallback eliminado. Si Supabase falla, «Datos no disponibles» | — |
| bdns.ts:107-180 | Top 8 seed (Generalitat 3.840 M€ SEPE, etc.) | ELIMINADO | `getBdnsSeedData` devuelve vacío (se mantiene la firma porque la usa `lib/sync`) | Sin fuente |
| bdns.ts:188-194 / page.tsx:389-402 | Reparto «por tipo» (27,1 % otras AAPP…) y «el Estado se subvenciona a sí mismo» | CORREGIDO | «Por nivel de la administración concedente», en vivo: Autonómica 63,9 %, Otros 24,3 %, Local 11,8 % (hoy). Frase editorial eliminada | Supabase, `SUM(importe) GROUP BY tipo_beneficiario` |
| page.tsx:54-62 | Filtro «Tipo de beneficiario» con 7 valores | CORREGIDO | «Administración concedente»: Autonómica / Local / Otros | Valores reales de la columna |
| page.tsx:244 | Orden «Más recientes» (no ordenaba) | CORREGIDO | «Fecha de concesión», ahora ordena por `fecha_concesion` | — |
| page.tsx:324-326 | «Top N perceptores · Los que más se llevan» | CORREGIDO | «8 concesiones de mayor importe · ordenadas por importe» | — |
| page.tsx:425-431 | «actualizados cada 24h… en tiempo real… estimaciones basadas en el informe anual» | CORREGIDO | «Copia diaria parcial… 06:00 UTC… 500 concesiones» | `vercel.json` (0 6 * * *), `lib/sync/subvenciones.ts` (5 páginas × 100) |
| app/subvenciones/layout.tsx:4-25 | «Subvenciones del Estado 2024… datos oficiales» | CORREGIDO | «Concesiones sincronizadas de la BDNS», copia parcial | — |
| lib/data/igae.ts:37-66 | Seed de 8 partidas (Pensiones 271A 145.000 M€, Defensa sec. 08, Hacienda 929A…) | ELIMINADO | Sin fallback: devuelve `[]` | No coincide con los PGE (ver las 3 filas siguientes) |
| public/data/presupuesto-2023.json (no editado) | Sección 60 · 271A Pensiones contributivas · crédito inicial 142.500 M€ | INCORRECTO | Oficial: **211A** Pensiones contributivas de la SS = 159.688,8 M€ | [PGE 2023 Ley, Sección 60](https://www.sepg.pap.hacienda.gob.es/Presup/PGE2023Ley/MaestroTomos/PGE-ROM/doc/L_23_E_G19.PDF) |
| presupuesto-2023.json (no editado) | Sección 13 Min. Empleo · 251M Desempleo · 20.500 M€ | INCORRECTO | Oficial: **Sección 19** (Trabajo) · 251M = 21.278,0 M€ (proyecto 2023) | [PGE 2023 Proyecto, Sección 19](https://www.sepg.pap.hacienda.gob.es/Presup/PGE2023Proyecto/MaestroTomos/PGE-ROM/doc/L_23_A_G9.PDF) |
| presupuesto-2022.json (no editado) | Sección 08 · 122A «Fuerzas Armadas» · 8.700 M€ | INCORRECTO | Oficial: **Sección 14** Defensa · 122A «Modernización de las FF. AA.» = 398,3 M€ | [PGE 2022 Ley, Sección 14](https://www.sepg.pap.hacienda.gob.es/Presup/PGE2022Ley/MaestroTomos/PGE-ROM/doc/L_22_E_G4.PDF) |
| app/presupuesto/page.tsx:112 | «583.000 millones. Y subiendo.» | ELIMINADO | «Ejecución del Presupuesto del Estado por sección» | Sin fuente en esta página. Encuadre editorial |
| presupuesto/page.tsx:111,117,154,177 | «Ejercicio 2025» (`CURRENT_EJERCICIO`) con datos de `presupuesto-2024.json` reetiquetados (fallback `[ejercicio, 2024]`) | ELIMINADO | «Datos no disponibles» + enlace a IGAE. Constante `DATOS_VERIFICADOS = false` | BD `budget_executions` sin 2025 y sin mes; [IGAE ejecución presupuestaria](https://www.igae.pap.hacienda.gob.es/sitios/igae/en-GB/Contabilidad/ContabilidadPublica/CPE/EjecucionPresupuestaria) |
| presupuesto/page.tsx:248-251 | «En tres años, el gasto del Estado ha crecido un X%» | CORREGIDO (en código oculto) | «Obligaciones reconocidas por ejercicio». ▲ rojos / ▼ verdes → neutros | — |
| presupuesto/page.tsx:156 | «Gasto real ejecutado» en color «bad» | CORREGIDO (oculto) | «Obligaciones reconocidas», neutro | — |
| app/presupuesto/layout.tsx:4-25 | «Presupuesto 2024… Datos IGAE actualizados… Comparador 2022–2024» | CORREGIDO | Descripción sin año ni «actualizados» | — |
| lib/constants.ts:1-2 | `IGAE_BASE_URL` (…/ContabilidadNacional/ejecucion/Paginas/) | ELIMINADO (no se usaba) | — | No verificable |
| lib/constants.ts:5-6 | «IGAE publishes monthly budget execution CSVs. These are the direct download URLs.» | CORREGIDO (comentario) | «UNVERIFIED URLs…». La IGAE publica en PDF | Búsqueda sin resultados; `sync_log` = 8 filas/día (seed) |
| lib/constants.ts:32-50 | `MINISTERIOS_MAP` (08 Defensa, 13 Empleo, 09 Hacienda…) | ELIMINADO (no se usaba) | — | Defensa = Sección 14 y Trabajo = Sección 19 en los PGE |
| lib/constants.ts:16 | «Plataforma de Contratación del Estado – Atom feed» | CORREGIDO (comentario) | Feed de agregación, no perfiles estatales | [Especificación sindicación PLACSP 1.3](https://www.hacienda.gob.es/Documentacion/Publico/D.G.%20PATRIMONIO/Plataforma_Contratacion/especificacion-sindicacion-1-3.pdf); datos en BD (Navarra) |
| lib/data/place.ts:60-62 | Tipo: código 1 = obras, 3 = suministros | CORREGIDO | 1 = suministros, 3 = obras | Comprobado en BD: 1.129 de 1.702 filas «obras» tienen «suministro» en el título. Lista CODICE no leída directamente (ver dudas) |
| app/contratos/page.tsx:77,100 | Tipo de contrato mostrado por fila | ELIMINADO | No se muestra: las filas ya guardadas tienen el tipo invertido | Ídem |
| contratos/page.tsx:128 | «Total adjudicado (último día)» | CORREGIDO | «Importe licitado (último día)», con nº y fecha | `TaxExclusiveAmount` = «Presupuesto base de licitación sin impuestos» (especificación sindicación 1.3, §4.4) |
| contratos/page.tsx:129 | «Grandes contratos ≥ 5 M€» en rojo ▲ | CORREGIDO | «Licitaciones ≥ 5 M€ de N cargadas», neutro | — |
| contratos/page.tsx:238 | «X € en el feed actual. ¿Sabes a quién?» | CORREGIDO | «Últimas N licitaciones del feed de agregación de PLACSP» | — |
| contratos/page.tsx:239 | «Cada licitación y adjudicación del sector público estatal pasa por nuestro radar» | CORREGIDO | Explica feed de agregación, sin menores, no estatal, 50 más recientes, importe = PBL sin impuestos | Ídem + `app/api/contratos/route.ts` (`limit(50)`) |
| contratos/page.tsx:99 | «Fecha completa» | CORREGIDO | «Último anuncio publicado» | `updated` = «momento de publicación del último anuncio» (especificación §3.3.1) |
| contratos/page.tsx:102,144 | «Adjudicatario» / «En proceso…» | CORREGIDO | «Estado» / «En licitación» | `adjudicatario` NULL en el 100 % de las filas de BD |
| contratos/page.tsx:300,328,367 | buscador «adjudicatario», «✅ Completados», pie «Plataforma de Contratación del Estado» | CORREGIDO | «Objeto del contrato», «Adjudicados, resueltos o anulados», pie con nombre exacto del feed | — |
| app/contratos/layout.tsx:4-25 | «Licitaciones del Estado en Tiempo Real» | CORREGIDO | «Licitaciones publicadas por agregación en PLACSP… actualizadas a diario» | `vercel.json` |
| app/datasets/page.tsx:24-57 | Datasets «Ejecución presupuestaria 2022/2023/2024», «IGAE», actualizado 2024-11-01 / 2024-01-15 / 2023-02-10, «~2.400/2.200/2.100 filas», enlaces CSV IGAE | ELIMINADO | Nota: presupuesto no se ofrece hasta cargarlo de fuente oficial | La API devolvía 8–18 filas seed. URLs CSV no verificables |
| datasets/page.tsx:58-68 | «Contratos públicos (tiempo real)… del Estado… Cada 30 min… ~50» | CORREGIDO | «Licitaciones publicadas por agregación (PLACSP)… Diaria, 06:00 UTC… 50 filas» | `vercel.json`. Los 30 min eran TTL de caché, no actualización |
| datasets/page.tsx:8,12,93,246 | «API REST documentada… Licencia CC-BY 4.0… CSV y JSON» | CORREGIDO | «Endpoints JSON»; reutilización según cada fuente y la Ley 37/2007 | [Ley 37/2007 (BOE-A-2007-19814)](https://www.boe.es/buscar/act.php?id=BOE-A-2007-19814). La web no ofrece CSV ni declara licencia propia |
| datasets/page.tsx:100-102 | «IGAE, PLACE — sin intermediarios», «Siempre actualizado», «API REST incluida» | CORREGIDO | «PLACSP y BDNS», «Sincronización diaria 06:00 UTC», «Endpoints JSON» | — |
| datasets/page.tsx:176-199 | Endpoints `/api/presupuesto(?ejercicio=2024)`, `/api/subvenciones?ejercicio=2024` | CORREGIDO | Solo `/api/contratos` y `/api/subvenciones` con sus parámetros reales (`q`, `tipo`, `all`). `ejercicio` no existe | Código de las rutas |
| datasets/page.tsx:71-83,215-240 | Esquema de datos de Presupuesto | ELIMINADO | — | Dataset retirado |
| app/alertas/page.tsx:8,12,19 | «Recibe avisos… Entérate el mismo día… Gratis, sin spam» | CORREGIDO | «Suscripción a avisos… El envío de avisos aún no está activo» | No hay código de envío (grep `resend`: solo confirmación en `subscribe/route.ts`) |
| alertas/page.tsx:26-28 | «Te avisamos el mismo día que se publican…» | CORREGIDO | Paso 3: «Envío de avisos (aún no activo)» | Ídem |
| alertas/page.tsx:45-50 | «Saber antes que nadie… Contratos adjudicados al día siguiente… resumen cada lunes» | CORREGIDO | «Alertas por email sobre contratos y subvenciones… solo se guarda la suscripción» | Ídem; `vercel.json` sin cron de alertas |
| alertas/page.tsx:100-102 | Frecuencias «Diaria / Diaria / Lunes»; «Contratos adjudicados > 1 M€ … PLACE»; «gasto ejecutado de la semana» | CORREGIDO | «No activa» en las tres; contratos = PBL sin impuestos > 1 M€ del feed de agregación; sin «gasto ejecutado» | Ídem |
| alertas/page.tsx:130-135 | FAQ: envío diario y lunes; «no compartimos datos con nadie»; baja «en cada email»; «tiempo real» | CORREGIDO | No se envían avisos; datos en Supabase y confirmación vía Resend; baja en el email de confirmación; sincronización diaria 06:00 UTC | `subscribe/route.ts`, `unsubscribe/route.ts` |
| alertas/page.tsx:134 | «¿Por qué solo desde 1 M€?… España publica miles de contratos menores cada día» | CORREGIDO | «Criterio propio para limitar avisos». Cifra eliminada | Sin fuente |
| components/layout/Footer.tsx:18 | Enlace «Licencia CC-BY 4.0» | CORREGIDO | «Reutilización de datos» | Ver datasets |
| Footer.tsx:39-42 | «Saber antes que nadie dónde va tu dinero. Contratos > 1 M€ · … · Resumen semanal — Sin spam.» | CORREGIDO | «Suscripción a avisos… El envío aún no está activo» | Ídem alertas |
| Footer.tsx:67-68 | «Periodismo de datos… Sin filiación política. Sin publicidad. Sin patrocinios… Datos abiertos siempre.» | CORREGIDO | «Datos sobre el gasto público español a partir de fuentes oficiales. Cada sección indica su fuente y periodo.» | — |
| Footer.tsx:76,97,100 | «Datos: IGAE · INE · …», «Todos los datos son de fuentes oficiales», «Transparencia es democracia» | CORREGIDO / ELIMINADO | «Fuentes: ver metodología», «Fuentes indicadas en cada sección». Eslogan eliminado | — |
| app/metodologia/page.tsx:5-55 | Tabla de fuentes: IGAE «ejecución mensual… sincronización diaria… /presupuesto, home»; INE «semestral»; Eurostat «tablas de home y /deuda»; BOE «home» | CORREGIDO | 8 fuentes según su uso real tras la limpieza (PLACSP, BDNS, IGAE, BdE, Eurostat, AEAT, INE, BOE). Solo PLACSP y BDNS tienen sincronización diaria; el resto «manual cuando se publica» | Código de `app/page.tsx`, `app/deuda`, `app/impuestometro` a 17/11/2026 |
| metodologia/page.tsx:63,70,77 | Ejemplos: «importe de adjudicación… PLACE»; «gasto por segundo» como derivado; estimaciones «personal eventual 740 × 80.000 €, flota aérea, gastos de representación» | CORREGIDO | Ejemplos de lo que hay hoy: deuda PDE, PBL, importe BDNS; derivados per cápita/interanual/por segundo/agregados BDNS; estimación = contadores en marcha | Las estimaciones citadas eran de secciones retiradas (/gobierno) |
| metodologia/page.tsx:104 | «escríbenos y la corregimos» | CORREGIDO | «es un error y debe corregirse o retirarse» | No hay canal de contacto en la web |
| metodologia/page.tsx:174-176 | «sincroniza… las fuentes que exponen API o fichero descargable» | CORREGIDO | Solo contratos (PLACSP) y subvenciones (BDNS) | `app/api/cron/sync/route.ts` |
| metodologia/page.tsx:217 | «unidad del clasificador orgánico del IGAE» | CORREGIDO | «clasificación orgánica de los PGE» | — |
| metodologia/page.tsx:218 | «Una tasa superior al 100% indica ampliación de crédito» | ELIMINADO | — | Incorrecto: las ampliaciones aumentan el crédito definitivo |
| metodologia/page.tsx:219 | «Contadores en tiempo real… último dato anual» | CORREGIDO | «Contadores (estimación)… último dato oficial con ritmo medio; cada contador indica su cálculo» | — |
| metodologia/page.tsx:220 | «número de ministerios… organigramas» | ELIMINADO | — | Sección /gobierno retirada |
| metodologia/page.tsx:221 | Ley 31/2022 PGE 2023 y prórroga art. 134.4 CE; «contadores de prórroga desde 1/1/2024» | OK / ELIMINADO | Se mantiene la ley y la prórroga. Se elimina la frase de contadores (no existen) | Coherente con la portada («verificado» por el área de portada) |
| metodologia/page.tsx:241-244 | «Cobertura estatal… datos del IGAE cubren la AGE»; «indicadores laborales y de asilo»; «gasto por colectivo» | CORREGIDO | «Perímetros distintos» (Estado vs AAPP), «Copias parciales», «Presupuesto sin datos» | La portada y /deuda usan IGAE contabilidad nacional de las AAPP |
| metodologia/page.tsx:262,270-271 | «se corrige y se indica el cambio»; «Todo… en CSV y JSON, API REST documentada, CC-BY 4.0» | CORREGIDO | «se corrige o se retira»; «contratos y subvenciones en JSON» | No hay registro de cambios ni CSV |

## Cambios de código relevantes

- `app/api/subvenciones/route.ts`
  - Reescrito.
  - Cuenta las filas (`count: 'exact'`) y las lee paginando de 1.000 en 1.000.
  - Si lo leído ≠ `count` (límite de PostgREST), devuelve `disponible:false` en vez de una suma parcial.
  - Calcula suma, media, rango de fechas, última sincronización y reparto por nivel concedente, con la fórmula en un comentario.
  - Caché de 6 h.
  - Fallbacks eliminados: BDNS directo con extrapolación y seed.
  - Ya no filtra por `ejercicio` (la etiqueta es falsa).
  - El payload cambia: `porTipo` pasa a `porNivel`, desaparece `bad` y aparece `disponible`. Solo lo consume `app/subvenciones/page.tsx`.
- `lib/data/igae.ts`: sin `loadSampleData`/`getSeedData`. Si el CSV falla, devuelve `[]`. Esto también afecta a la portada (`app/page.tsx` oculta «Top 5 partidas» cuando no hay filas) y a `/api/presupuesto/detalle`. Además, el cron dejará de reescribir las 8 filas seed (`syncBudgetToSupabase` devuelve «No data fetched» sin hacer upsert).
- `app/presupuesto/page.tsx`: `const DATOS_VERIFICADOS: boolean = false`. Mientras sea false no se llama a la API y se muestra «Datos no disponibles» con enlace a la IGAE. También se muestra si la API devuelve 0 secciones.

## Pendiente / dudas

1. **Vaciar `budget_executions`** (42 filas inventadas). Yo solo tenía permisos SELECT. Mientras no se vacíe, `/api/presupuesto`, `/api/presupuesto/historico` y `/api/presupuesto/detalle` siguen sirviendo esas cifras en JSON a quien llame directamente (la UI ya no las muestra). Las rutas no están en mi lista. Recomiendo `DELETE FROM budget_executions;` y cargar los datos reales desde la IGAE (que publica en PDF; no he encontrado CSV), con ejercicio y mes.
2. **Borrar `public/data/presupuesto-{2022,2023,2024}.json`**: son inventados. No los he editado, por regla. Ya no se leen.
3. **`lib/sync/subvenciones.ts`** (no es mío): sigue escribiendo `subvenciones_stats` y guarda `ejercicio=2024` para concesiones de 2026. Con el cambio en `bdns.ts` ahora escribirá 0 en `total_importe`, `importe_medio` y `pct_top100`. La fila actual de `subvenciones_stats` sigue teniendo 47.840.000.000 / 37.240 / 17,3, aunque ya nadie la lee. Recomiendo:
   - borrar esa tabla o dejar de escribirla;
   - guardar como `ejercicio` el año de `fecha_concesion`;
   - corregir `nivelToTipo` (`ESTATAL` no coincide con el código real de la BDNS) y renombrar la columna a algo como `nivel_concedente`.
4. **`contratos.tipo` en BD está invertido** (suministros ↔ obras) en todas las filas sincronizadas hasta hoy. El arreglo en `place.ts` solo afecta a las nuevas. Recomiendo `UPDATE contratos SET tipo = CASE tipo WHEN 'obras' THEN 'suministros' WHEN 'suministros' THEN 'obras' ELSE tipo END WHERE synced_at < '<fecha del deploy>';`. Después se puede volver a mostrar el tipo en `/contratos`. **Ojo:** `app/page.tsx` (portada) podría mostrar `c.tipo` u otros textos sobre contratos.
5. **Verificación parcial del código CODICE**: no pude leer directamente la lista oficial `ContractCode` (el PDF consultado no la incluía en el tramo leído). La corrección 1 = Suministros / 3 = Obras se basa en la evidencia de los títulos en BD y en mi conocimiento de CODICE.
6. **API BDNS no accesible** desde este entorno (proxy 403). Que `anio` no filtra lo deduzco de las fechas guardadas, no de una llamada directa. Tampoco he podido comprobar qué significa `totalElements` (31.909.898).
7. **Licencia**: no pude abrir el aviso legal de datos.gob.es. Por eso no afirmo CC BY 4.0 y remito a la Ley 37/2007 y a las condiciones de cada fuente.
8. **Otros archivos fuera de mi lista con afirmaciones equivalentes** (a corregir por quien los tenga):
   - `components/ui/AlertaSubscribeForm.tsx`: «Licitaciones y adjudicaciones millonarias», «Digest cada lunes».
   - `app/api/alertas/subscribe/route.ts`: el email de confirmación dice «Te avisaremos en cuanto haya novedades relevantes». Bug: busca el token con `.eq('email', email)` sin pasar a minúsculas, así que si el usuario escribe mayúsculas el enlace de baja sale sin token.
   - `app/page.tsx` (portada):
     - tarjeta «Presupuesto del Estado… Ejecución mensual… Comparador histórico 2022–2024 con datos IGAE actualizados»;
     - tarjeta contratos «Feed de licitaciones y adjudicaciones del Estado vía PLACE… adjudicatario»;
     - texto «La web sincroniza los datos automáticamente cada día» (solo contratos/subvenciones);
     - CTA de alertas «Contratos adjudicados > 1 M€… Resumen semanal los lunes»;
     - bloque «Top partidas · Datos IGAE», que ahora quedará oculto.
   - `app/sitemap.ts`: `/contratos` con `changeFrequency: 'hourly'` (los datos cambian a diario).
   - `CLAUDE.md` del frontend: describe las stats 47.84bn como del «informe anual BDNS 2024», dice que el cron sincroniza el «top 500 por importe» (en realidad son las 500 que devuelve la API) y afirma que los CSV IGAE «en Vercel funcionan directamente» (`sync_log` lo contradice).
9. **Metodología «dónde se usa»** refleja el estado de portada, `/deuda` e `/impuestometro` a 17/11/2026, mientras otras áreas los están editando. Conviene repasarlo cuando esas áreas cierren. Dos puntos concretos:
   - Si la portada deja de usar AEAT, INE o BOE, hay que quitarlos de la tabla.
   - En `Footer.tsx` dejé «Banco de España» en la columna de fuentes porque `/deuda` lo usa.
10. No he podido ejecutar la ruta `/api/subvenciones` contra Supabase con las claves reales (no hay servidor en marcha). Los valores «hoy» de la tabla (926,6 M€; 17.325 €; 63,9/24,3/11,8 %; 30/04/2026–13/11/2026) los he calculado con SQL y Python sobre la misma tabla.
