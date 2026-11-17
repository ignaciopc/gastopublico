# Auditoría de datos: área «home»

Fecha: 17/11/2026. Archivos: `app/page.tsx`, `app/layout.tsx`, `components/ui/LiveSpendCounter.tsx`,
`components/ui/DeudaCounter.tsx`, `components/ui/ProrrogaCounter.tsx`, `components/ui/EjerciciosProrrogados.tsx`.
Los números de línea son los del archivo **original**.

Nota sobre el acceso: el proxy de este entorno bloquea `curl` a Eurostat, BdE, IGAE, INE y AEAT. Todo se ha
verificado con WebFetch sobre las páginas o PDF oficiales que se citan. Los cálculos derivados se han hecho con Python
y la fórmula está en un comentario del código.

## Tabla de verificación

| archivo:línea | afirmación original | veredicto | valor final | fuente |
|---|---|---|---|---|
| page.tsx:102 | Insignia «DATOS OFICIALES · IGAE» sobre el contador | CORREGIDO | «ESTIMACIÓN · DATOS IGAE 2025» | (el contador es una extrapolación) |
| page.tsx:108 | «Actualizado · {fecha de hoy}» (mostraba siempre la fecha del día, sin relación con los datos) | ELIMINADO | — | — |
| page.tsx:122-124 | «El Estado lleva gastados X en lo que va de año» | CORREGIDO | «Las Administraciones Públicas llevan gastados X en lo que va de año (estimación)» | IGAE, Informe trimestral AAPP 4T 2025: https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/Cap_Trim/IT_4T_2025.pdf |
| page.tsx:132 / LiveSpendCounter.tsx:5 / page.tsx:184-195 | 18.490 €/s; 1,1 M€/min; 66,5 M€/h; 1.597 M€/día (equivale a 583 mM€/año, que no coincide con ningún agregado oficial localizado) | CORREGIDO | Agregado: **empleos no financieros del conjunto de las AAPP 2025 = 764.884 M€** (contabilidad nacional). 764.884e6/(365×86.400) = **24.254 €/s**; 1,46 M€/min; 87,3 M€/h; 2.096 M€/día. Etiquetas «· 2025» y texto que explica el cálculo | IGAE IT 4T 2025 (enlace anterior), tabla del sector AAPP |
| LiveSpendCounter.tsx:9-23,37-45 | Valor de partida restaurado de localStorage (podía arrastrar valores de un año anterior o de otro ritmo) | CORREGIDO | Siempre segundos desde el 1 de enero del año en curso × ritmo | — |
| page.tsx:147 | «Deuda pública (estimación)» | CORREGIDO | «Deuda de las AAPP (PDE, estimación)» y una línea que explica el cálculo | — |
| DeudaCounter.tsx:5-9 | Base 1.640.000 M€ a 01/01/2025; ritmo de 1.515 €/s («crecimiento 2024 +47.800 M€») | CORREGIDO | Base **1.750 mm€ a 31/08/2026** (avance mensual BdE, publicado el 21/10/2026). Ritmo (1.750 − 1.699) mm€ / 31.536.000 s = **1.617 €/s** (variación de agosto de 2025 a agosto de 2026) | BdE: https://www.bde.es/wbe/es/noticias-eventos/actualidad-banco-espana/deuda-aapp-agosto26.html ; https://www.bde.es/wbe/es/noticias-eventos/actualidad-banco-espana/deuda-aapp-agosto25.html |
| page.tsx:152 | «+1.515 €/seg» | CORREGIDO | «Último dato: 1.750 mm€ a 31/08/2026 (Banco de España). Se suma +1.617 €/s…» | igual |
| page.tsx:210-211 / EjerciciosProrrogados.tsx | «España afronta {año actual} con los presupuestos de 2023 prorrogados por {año−2023}er año consecutivo» (se calculaba con la fecha actual, así que seguiría diciendo «prórroga» aunque se aprobara un PGE, y para n=2 escribiría «2er») | CORREGIDO | Lista fija y verificada `EJERCICIOS_PRORROGADOS = [2024, 2025, 2026]`: «Los ejercicios 2024, 2025 y 2026 se rigen por los presupuestos de 2023 prorrogados (3 ejercicios)». Constante `FECHA_VERIFICACION_PRORROGA = '17/11/2026'`. Se quita `'use client'` del módulo para que la página de servidor pueda importar las constantes | BOE Ley 31/2022: https://www.boe.es/buscar/pdf/2022/BOE-A-2022-22128-consolidado.pdf ; RDL 16/2025 (preámbulo: «prórroga automática de la Ley 31/2022» para 2026): https://www.boe.es/buscar/pdf/2025/BOE-A-2025-26458-consolidado.pdf ; RDL 13/2026, 02/06/2026 («la actual situación de prórroga presupuestaria»): https://www.boe.es/boe/dias/2026/06/03/pdfs/BOE-A-2026-11848.pdf |
| page.tsx:214-218 | El último PGE aprobado es el de 2023 (Ley 31/2022, de 23 de diciembre); 2024-2026 en prórroga (art. 134.4 CE) | OK | Sin cambios de fondo | igual que la fila anterior |
| page.tsx:217-218 | «En la última década, siete ejercicios han comenzado en prórroga: 2017, 2018, 2019, 2020, 2024, 2025 y 2026» | CORREGIDO (precisión) | «Entre 2016 y 2026, siete ejercicios comenzaron en prórroga: 2017 y 2018 (PGE aprobados en junio y julio), 2019 y 2020 (prórroga de los de 2018 todo el año) y 2024, 2025 y 2026» | Ley 3/2017, de 27 de junio: https://www.BOE.es/boe/dias/2017/06/28/pdfs/BOE-A-2017-7387.pdf ; Ley 6/2018, de 3 de julio: https://boe.es/buscar/pdf/2018/BOE-A-2018-9268-consolidado.pdf ; para 2019-2020 no hay Ley de PGE (la siguiente es la Ley 11/2020, PGE 2021) |
| page.tsx:221 | «Fuente: BOE · Ministerio de Hacienda (SEPG)» | CORREGIDO | «Fuente: BOE (Ley 31/2022; Ley 3/2017; Ley 6/2018; Real Decreto-ley 16/2025). Situación verificada a 17/11/2026» | — |
| ProrrogaCounter.tsx:10-16 | Años/meses/días calculados con 365,25 y 30,44 días (aproximados) | CORREGIDO | Diferencia de calendario exacta desde el 01/01/2024, más la nota «situación verificada a 17/11/2026». Color de alarma (#ef4d68) del número cambiado a neutro | — |
| page.tsx:250 | «El presupuesto del Estado, en tiempo real» | CORREGIDO | «El gasto público, con su fuente oficial» | — |
| page.tsx:271-274 | «IGAE (Intervención General del Estado)… Plataforma de Contratación del Estado… Actualizados automáticamente cada día» | CORREGIDO | Nombres oficiales (Intervención General de la Administración del Estado; Plataforma de Contratación del Sector Público), con BdE, Eurostat, AEAT e INE como fuentes de deuda, déficit e ingresos; «La web sincroniza los datos automáticamente cada día» | — |
| page.tsx:304 | Eyebrow «… · 2024» | CORREGIDO | «… · 2025» | — |
| page.tsx:320 | Deuda 1,64 billones; +47.800 M€ vs 2023; 108,1% PIB; media UE 82,7% | CORREGIDO | **1,70 billones (1.698.355 M€), +77.777 M€ vs 2024, 100,5% del PIB, cierre 2025.** Se quita la «media UE» de esta tarjeta (está en la tabla europea) | BdE, Boletín Estadístico, tabla 2.9: https://www.bde.es/webbe/en/estadisticas/compartido/datos/pdf/a0209e.pdf |
| page.tsx:321 | Recaudación tributaria 294,7 mM€, +8,4% vs 2023 | CORREGIDO (dato más reciente) | **325.356 M€ (325,4 mM€), +10,4% vs 2024**. Se quita «del Estado» (la AEAT no lo dice en el resumen) | AEAT, Informe anual de recaudación 2025: https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025/resumen.html ; https://sede.agenciatributaria.gob.es/Sede/normativa-criterios-interpretativos/analisis/2026/junio/29/ingresos-tributarios-ano-2025.html |
| page.tsx:322 | «Gasto público 2024: 583 mM€, +6,4%, 12.157 €/hab.» | CORREGIDO | **Gasto de las AAPP 2025 (empleos no financieros): 764,9 mM€; +5,5% vs 2024 (725.001 M€); 15.510 €/hab.** (764.884e6 / 49.315.949) | IGAE IT 4T 2025; INE ECP a 1/7/2025 (provisional): https://ine.es/dyngs/Prensa/ECP2T25.htm |
| page.tsx:323 | Intereses 39,9 mM€, +38% en 2 años, 6,8% del gasto | CORREGIDO | **40.314 M€ (AAPP, D.41, 2025); +3,9% vs 2024 (38.793 M€); 5,3% de los empleos no financieros de las AAPP** | IGAE IT 4T 2025 |
| page.tsx:358-369 | «Eurostat / AIReF · 2008–2024 · 17 ejercicios consecutivos en déficit» | CORREGIDO | «Déficit de las Administraciones Públicas, 2008–2025»; texto descriptivo sin «crónico» | BdE tabla 2.9 |
| page.tsx:363 | «El último superávit fue 2007» | OK | Se añade la cifra: 20.287 M€, 1,9% del PIB | BdE tabla 2.9 (2005-2007 superávit; déficit desde 2008) |
| page.tsx:369 | «Déficit acumulado 2008–2024 ~1,1 billones €» | CORREGIDO | **Suma de déficits 2008–2025 en euros corrientes: 1.244.258 M€ → 1,24 billones €** (suma de la columna en M€) | BdE tabla 2.9 |
| page.tsx:374-381 | Serie 2008–2024: 4,4 / 11,0 / 9,4 / 9,4 / 10,5 / 6,9 / 5,9 / 5,1 / 4,5 / 3,0 / 2,5 / 2,8 / 10,1 / 6,9 / 4,8 / 3,5 / 3,1 (casi todos desfasados) | CORREGIDO | 2008–2025: 4,6 / 11,2 / 9,5 / 9,7 / 11,5 / 7,5 / 6,0 / 5,3 / 4,2 / 3,1 / 2,6 / 3,1 / 9,9 / 6,7 / 4,6 / 3,3 / 3,2 / 2,4 | BdE tabla 2.9 (2009-2025 coinciden con BdE tabla 11.2: https://www.bde.es/webbe/es/estadisticas/compartido/datos/pdf/a1103.pdf ) |
| page.tsx:387-416 | Barras rojas «Déficit >5% PIB» frente a «<5%» (color usado como juicio) | ELIMINADO | Un solo color y una línea de fuente | — |
| page.tsx:430,450-451 | Eurostat · OCDE · 2024. Deuda: ES 108,1 / UE 82,7 / DE 62,7 / FR 110,6. Déficit: ES -3,1 / UE -2,9 / DE +0,1 / FR -5,5 | CORREGIDO | Eurostat · 2025. **Deuda: ES 100,7 / UE-27 81,7 / DE 63,5 / FR 115,6. Saldo: ES -2,4 / UE-27 -3,1 / DE -2,7 / FR -5,1.** «Media UE» pasa a «UE-27 (agregado)». Nota sobre la primera notificación y la cifra revisada del BdE | Nota de Eurostat del 22/04/2026, «Provision of deficit and debt data for 2025 – first notification» (copia del PDF en https://www.ksh.hu/en/first-releases/krm/eurostat_press_release_2026_04_22.pdf ; deuda trimestral confirmada en la web oficial https://ec.europa.eu/eurostat/web/products-euro-indicators/w/2-22042026-bp ) |
| page.tsx:28-41, 476-547 | «¿Cuándo gasta el Estado?»: % mensual (6,8%…10,4%), «Diciembre concentra el doble que enero», «efecto fin de año estructural… desde 2000», fechas clave (pensiones el día 1, 14,5 M pensionistas · 12.500 M€/mes; nóminas 3,5 M empleados · 4.800 M€/mes; IRPF «+94.000 M€ en 2024»; «aceleración Sep-Nov para evitar devolución del crédito») | ELIMINADO (toda la sección y la constante `GASTO_MENSUAL`) | — | No se encontró fuente oficial para la distribución mensual ni para estas cifras; varias afirmaciones eran interpretativas |
| page.tsx:553-559 | «PGE {CURRENT_EJERCICIO}» (=2024, ejercicio sin PGE propio); «cinco mayores capítulos» (en realidad son secciones) | CORREGIDO | «Ejercicio 2024 · Datos IGAE»; «Las cinco secciones con más obligaciones reconocidas — 2024»; añade «En 2024 rigió el presupuesto de 2023 prorrogado»; tasa = obligaciones reconocidas / crédito definitivo (como en `lib/transformers/budget.ts`) | — |
| page.tsx:573 | Tasa de ejecución en verde/rojo según umbrales | CORREGIDO | Color neutro | — |
| page.tsx:634 | «el próximo contrato millonario» | CORREGIDO | «un contrato de más de 1 M€» | — |
| page.tsx:21 | Etiqueta «Tiempo real» en Contratos (los datos se sincronizan a diario) | CORREGIDO | Etiqueta «PLACE» | — |
| layout.tsx:19,36,63 | «en tiempo real» en las descripciones SEO | CORREGIDO | «sincronizados a diario» o texto sin esa afirmación | — |
| layout.tsx:46 | Twitter: «18.490 € por segundo» | CORREGIDO | «Las Administraciones Públicas gastaron 24.254 € por segundo en 2025 (IGAE)…» | IGAE IT 4T 2025 |

`npx tsc --noEmit -p .`: 0 errores. `npm run lint`: 0 errores (3 avisos en `impuestometro`, `presupuesto` y `Navbar`, archivos fuera de esta área).

## Intereses de la deuda: dato que hay que unificar

- La portada decía 39.900 M€ y /deuda decía 37.500 M€. **Ninguna de las dos cifras es la oficial.**
- Dato oficial: intereses (D.41) del **conjunto de las AAPP** en contabilidad nacional:
  - **2025: 40.314 M€**
  - 2024: 38.793 M€
  - Para el subsector **Estado**: 34.918 M€ en 2025 y 32.204 M€ en 2024.
  - Fuente: IGAE, Informe trimestral de las AAPP 4T 2025.
- `app/deuda/page.tsx` ya usa 40.314 (lo habrá cambiado otro agente), así que ahora coincide con la portada.

## Pendiente / dudas

1. **Fechas de los datos (2025)**:
   - Gasto e intereses salen del IGAE IT 4T 2025, cuyas cifras coinciden con la notificación de abril de 2026 (déficit −51.267 / −40.330 M€).
   - La serie de déficit sale de la tabla 2.9 del BdE, que ya recoge una revisión posterior (2024: −50.807; 2025: −40.641 M€).
   - Por tanto la portada mezcla dos fechas para 2025. Cuando la IGAE publique las cuentas anuales revisadas de 2025, conviene actualizar gasto e intereses (y el ritmo del contador).
2. **Eurostat, notificación de octubre de 2026**:
   - Existe (21/10/2026), pero no pude abrirla: la web de Eurostat redirige a una página de bloqueo y no hay copia localizada.
   - Según la prensa, revisa la deuda de la UE-27 a 81,5% y la de Alemania a 62,8%, con un déficit alemán del 2,9%. No es fuente final, así que dejé los datos de abril de 2026 indicando que son la primera notificación.
   - La deuda de España según Eurostat (abril) es 100,7%; según el BdE (revisada), 100,5%. La nota de la tabla lo explica.
3. **Ritmo de DeudaCounter**: sale de dos cifras que el BdE redondea a mm€ (1.750 y 1.699). La diferencia (51 mm€) tiene un margen de ±1 mm€, es decir, alrededor de ±2% en el ritmo. El BdE no da en la nota la cifra exacta en millones.
4. **/deuda frente a la portada**: `app/deuda/page.tsx` usa el dato trimestral de junio de 2026 (1.762.936 M€, 101,4%). La portada usa el avance mensual de agosto de 2026 (1.750 mm€, 99,7%), que es más reciente. Ambos son oficiales; si se quiere uniformidad, conviene decidir cuál se usa.
5. **AEAT**: la página de resumen no dice si los 325.356 M€ incluyen la participación de las administraciones territoriales. Por eso la etiqueta solo dice «Ingresos tributarios».
6. **Último superávit (2007)**: verificado con la tabla 2.9 del BdE (2005-2007 en superávit), no con Eurostat directamente.
7. **«Top 5 secciones»**: depende de `fetchIgaeBudget` (`lib/data/igae.ts`), que puede recurrir a datos de reserva (seed). No lo he verificado porque está fuera de mi lista. Además, `CURRENT_EJERCICIO=2024` en `lib/constants.ts` está desfasado: la IGAE ya tiene la ejecución de 2025.
8. **Otras cosas fuera de mi lista**:
   - Los `keywords` SEO de `layout.tsx` («presupuesto general estado 2024», «calculadora IRPF 2024») no son afirmaciones visibles y los dejé.
   - `FEATURES` sigue diciendo «Comparador histórico 2022–2024» (es cierto mientras el selector solo ofrezca esos años).
9. **Lista de prórrogas**: es fija a 17/11/2026. Si se aprueba una Ley de PGE para 2027, hay que actualizar `EJERCICIOS_PRORROGADOS` en `components/ui/EjerciciosProrrogados.tsx`. ProrrogaCounter seguirá contando días hasta que alguien cambie la lista.
