# Auditoría de datos — Impuestómetro

Archivos: `frontend/app/impuestometro/page.tsx` y `frontend/app/impuestometro/layout.tsx`.
Fecha de la revisión: 2026-11-17. Ejercicio de la calculadora: **2026**, antes 2024. Los números de línea son los del archivo original.

## Decisión de método (IRPF)

El código original aplicaba una escala combinada del 19 % al 47 % sobre «bruto − SS». No restaba los 2.000 € de otros gastos ni la reducción por rendimientos del trabajo, y después aplicaba unos **ajustes por comunidad autónoma inventados** (Madrid −4 %, Cataluña +3 %…). Esa escala combinada coincide con la **escala de retención del art. 85.1 RIRPF**, una escala única para todo el territorio común.

Ahora la calculadora implementa completo el **algoritmo de cálculo de retenciones de la AEAT para 2026** (versión del 10-09-2026):
- rendimiento neto;
- 2.000 € de otros gastos;
- reducción del art. 20 LIRPF;
- mínimo personal y familiar;
- escala de retención aplicada a la base y al mínimo;
- límite excluyente;
- límite del 43 %;
- tipo truncado a 2 decimales.

Se ha quitado el selector de comunidad autónoma. El texto de la página dice que **no usa la escala autonómica de ninguna comunidad**, que el resultado es la retención y no la cuota final de la Renta, y que no aplica a País Vasco ni Navarra.

## Tabla de verificación

| archivo:línea | afirmación original | veredicto | valor final | fuente |
|---|---|---|---|---|
| page.tsx:6-9 | Tramos IRPF 19/24/30/37/45/47 % (12.450 / 20.200 / 35.200 / 60.000 / 300.000) «Tramos IRPF 2024» | CORREGIDO (se mantienen los valores y cambia la etiqueta) | Misma escala, presentada como escala de retención del art. 85.1 RIRPF, ejercicio 2026 | AEAT, Algoritmo de retenciones 2026 (tabla 2), https://sede.agenciatributaria.gob.es/static_files/Sede/Programas_ayuda/Retenciones/2026/Algoritmo%20Retenciones-2026_10sept.pdf (10-09-2026) |
| page.tsx:11-14, 47, 126-134 | Ajustes CCAA (Madrid −4 %, Cataluña +3 %, Andalucía −2 %, C. Valenciana +2 %, P. Vasco −6 %, Galicia +1 %) | ELIMINADO | Sin selector de CCAA; nota que explica que se usa la escala única de retención | Sin fuente: inventados. País Vasco tiene régimen foral y no se puede tratar como un ajuste |
| page.tsx:34 | Base IRPF = bruto − SS (sin gastos ni reducción) | CORREGIDO | Base = bruto − cotizaciones − 2.000 € − reducción art. 20 (7.302 € si RNT ≤ 14.852; 7.302 − 1,75·(RNT−14.852) hasta 17.673,52; 2.364,34 − 1,14·(RNT−17.673,52) hasta 19.747,50; 0 después) − 600 € si hay más de 2 hijos | Algoritmo AEAT 2026 (ídem) |
| page.tsx:45 | Mínimo personal 5.550; descendientes 2.400 / 2.700 / 4.000 | OK, con corrección del método | 5.550 €; 2.400 / 2.700 / 4.000 / 4.500 € al 50 % (por defecto en el modelo 145). Se aplica la escala al mínimo, no un 19 % fijo | Algoritmo AEAT 2026 (ídem) |
| page.tsx:46 | Mínimo × 19 % | CORREGIDO | cuota = escala(base) − escala(mínimo), con el límite excluyente (15.876 / 16.342 / 16.867 € en situación 3) y el límite del 43 % si el bruto ≤ 35.200 € | Algoritmo AEAT 2026; art. 81 y 85.3 RIRPF |
| page.tsx:32-33, 85, 159 | SS trabajador 6,45 %; base máxima 53.946 €/año | CORREGIDO | 6,50 % = contingencias comunes 4,70 + desempleo 1,55 (indefinido) + FP 0,10 + MEI 0,15. Base máxima 5.101,20 €/mes (61.214,40 €/año). Se añade la cotización de solidaridad del trabajador: 0,19 / 0,21 / 0,24 % por tramos por encima de la base máxima. Nota: 53.946 € (4.495,50 €/mes) era la base máxima de 2023, no la de 2024 | Orden PJC/297/2026, BOE 31-03-2026, arts. 2.1, 4.a, 16, 17.1 y 33.2: https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-7296 |
| page.tsx:159 | «A tu nombre, gestionada por TGSS» | ELIMINADO | Detalle de los tipos aplicados y aviso de que no incluye la cuota empresarial | Las cotizaciones no son una cuenta individual: el texto inducía a error |
| page.tsx:107 | «SMI 16.576 €» (colocado en mitad del slider, en una posición que no le corresponde) | CORREGIDO | SMI 2026: 17.094 €/año (1.221 €/mes × 14), en una línea aparte | RD 126/2026, BOE 19-02-2026: https://www.boe.es/buscar/doc.php?id=BOE-A-2026-3815 |
| page.tsx:80-87 | Eyebrow «Impuestómetro 2024», título «¿Cuánto trabajas para el Estado y cuánto para ti?», lede «descubre, al céntimo, qué se queda Hacienda…», meta | CORREGIDO (lenguaje y año) | «Retención de IRPF y cotizaciones de un sueldo bruto en 2026», lede neutro; meta con las tres fuentes | Regla 6 |
| page.tsx:121 | Botón «3+» hijos (solo calculaba 3) | CORREGIDO | «3» | Coherencia con el cálculo |
| page.tsx:140-148 | Día de liberación fiscal; «trabajas N días exclusivamente para pagar impuestos… empiezas a cobrar para ti»; año = año actual del navegador | CORREGIDO | Etiquetado como «cálculo propio», con la fórmula en la UI: días = round(365 × (IRPF + cotizaciones) / bruto); fecha = 1-ene-2026 + días. Año fijo 2026. Redacción neutra | Cálculo propio, sin citar a terceros |
| page.tsx:160, 174 | Tipo efectivo (SS+IRPF)/bruto mostrado bajo «IRPF»; color de «alarma» en la fila IRPF | CORREGIDO | Bajo IRPF figura el tipo de retención; el % total aparece en el bloque de liberación. Fuera el color de alarma | Regla 6 |
| page.tsx:184 | Neto mensual ×14 pagas | OK (supuesto) | Se mantiene, rotulado «14 pagas» | Supuesto declarado |
| page.tsx:188-196 | «Total al Estado este año» con fondo de acento | CORREGIDO | «IRPF + cotizaciones del trabajador», sin fondo de acento (las cotizaciones van a la Seguridad Social, no «al Estado») | — |
| page.tsx:16-29 | DESTINOS «% PGE 2024»: Pensiones 34,6; Deuda 12,4; Sanidad 9,8; Desempleo 7,6; Educación 6,4; Defensa 5,9; Infraestructuras 4,2; Administración y altos cargos 3,8; Subvenciones 3,1; RTVE 0,9; Casa Real y Cortes 0,4; Otros 10,9 | ELIMINADO y sustituido | Clasificación COFOG del gasto total de las AAPP en 2024 (P), 725.001 M€: edad avanzada 22,8 %; salud 14,2; asuntos económicos 11,2; educación 9,1; servicios públicos generales salvo deuda 7,3; enfermedad e incapacidad 6,1; deuda pública (01.7) 5,5; supérstites 4,9; otra protección social 4,0; orden público 3,9; desempleo 3,3; ocio, cultura y religión 2,6; medio ambiente 2,1; defensa 2,0; vivienda 1,1. Los % se calculan en el código como importe / 725.001 | IGAE, «Clasificación funcional del gasto de las AAPP 2020-2024» (datos de la notificación PDE de octubre de 2025): https://www.igae.pap.hacienda.gob.es/sitios/igae/es-ES/Contabilidad/ContabilidadNacional/Publicaciones/Documents/AAPP_A/Funcional%202020-2024.pdf. Cifras idénticas en Eurostat gov_10a_exp (ES, S13, TE, actualizado el 16-09-2026). Los subgrupos suman el total de cada división y las divisiones suman 725.001 (comprobado con Python) |
| page.tsx:211, 236 | «aproximadamente así (% PGE 2024)»; «No incluye IVA… que añaden ~10–15 pp al tipo efectivo real» | ELIMINADO / CORREGIDO | Nota de fuente con el año y aviso de que el reparto es ilustrativo (los ingresos no están afectados a gastos y el gasto de 2024 no se financió solo con impuestos) | — |
| page.tsx:54-57, 241-361 | Sección «La carga fiscal real»: IVA = 78 % del neto × 13,5 %; otros indirectos = 2,8 % del bruto; «Tipo efectivo REAL»; «Media UE ~42 % · España ~45–47 %»; «España tiene una de las cargas fiscales reales más altas de la eurozona»; «Lo que Hacienda no cuenta» | ELIMINADO (sección entera) | — | Coeficientes sin fuente («elaboración propia», «orientativa»). Las comparaciones UE no se pudieron verificar y el texto era valorativo |
| page.tsx:63-68 | `thStyle` sin usar (warning de eslint) | ELIMINADO | — | — |
| layout.tsx:4-26 | «Calculadora IRPF 2024», «Día de la Liberación Fiscal 2024», «cuánto pagas», OG «2024» | CORREGIDO | Metadatos y OG de 2026 que describen el método (retención AEAT, Orden PJC/297/2026, IGAE 2024) | Las de arriba |

## Prueba con 3 sueldos (0 hijos, contrato indefinido, situación 3)

«Manual» es una implementación independiente en Python del algoritmo AEAT 2026 y de la Orden PJC/297/2026 (`/tmp/ic/work/ref.py`). «Nueva» es la función TS de la página, extraída y ejecutada con node.

| Bruto | SS (nueva = manual) | Retención IRPF (nueva = manual) | Tipo ret. | Neto | Días / fecha | Versión anterior (SS + IRPF, Madrid) | Diferencia |
|---|---|---|---|---|---|---|---|
| 20.000 € | 1.300,00 | 1.772,00 | 8,86 % | 16.928 € | 56 / 26-feb | 1.290 + 2.701 = 3.991 € | −919 € |
| 35.000 € | 2.275,00 | 6.328,00 | 18,08 % | 26.397 € | 90 / 1-abr | 2.258 + 6.656 = 8.914 € | −311 € |
| 60.000 € | 3.900,00 | 14.664,00 | 24,44 % | 41.436 € | 113 / 24-abr | 3.480 + 14.937 = 18.417 € | +147 € |

La versión nueva coincide al céntimo con el cálculo manual en los tres casos. También coincide con 2 y 3 hijos y con 120.000 €; en este último caso hay 1 céntimo de diferencia en la SS por el orden de redondeo.

Causas de la diferencia con la versión anterior:
- **20.000 €:** antes no se restaban los 2.000 € de gastos ni la reducción del art. 20 (1.194,15 €), y no se aplicaba el límite del 43 % ((20.000 − 15.876) × 0,43 = 1.773,32 €), que aquí es el que fija la cuota.
- **35.000 €:** faltaban los 2.000 € de gastos (unos 600 € de cuota al 30 %), y el −4 % «Madrid», inventado, compensaba en parte.
- **60.000 €:** la base máxima antigua (53.946 €, la de 2023) rebajaba la SS en unos 420 €.
- **Todos los tramos:** el tipo de la SS pasa del 6,45 % al 6,50 % (el MEI sube del 0,10 % de 2024 al 0,15 % de 2026).

**No se ha ejecutado el simulador web de retenciones de la AEAT:** es una aplicación interactiva que no se puede usar desde este entorno. La comparación se ha hecho contra el algoritmo oficial publicado por la AEAT, que es el que usa el propio simulador.

## Pendiente / dudas

- **Retención ≠ cuota final de la Renta.** La página muestra la retención, que usa una escala única. La cuota de la declaración depende de la escala autonómica, de las deducciones y de la regularización, y puede ser distinta. No he calculado escalas autonómicas concretas: para ofrecerlas habría que verificar las 15 tarifas autonómicas de 2026 en el BOE y en los boletines autonómicos.
- **Supuestos fijos sin control en la UI:** contrato indefinido (en uno temporal, el desempleo es 1,60 %), mínimo por descendientes al 50 %, hijos mayores de 3 años, menor de 65 años y sin discapacidad. Están explicados en la nota de la página.
- **Slider desde 12.000 €:** por debajo del SMI anual solo tiene sentido a tiempo parcial. La cotización se calcula sobre el sueldo real, sin aplicar bases mínimas.
- **COFOG 2024 es provisional (P).** La IGAE publicará la serie 2021-2025 hacia diciembre de 2026: conviene actualizar `DESTINOS` entonces.
- **Otros archivos fuera de mi lista:**
  - `app/page.tsx:22`: «descubre cuánto pagas…, a qué se destina cada euro y en qué fecha trabajas exclusivamente para ti» (encuadre editorial).
  - `app/page.tsx:~280`: «descubres a qué se destina cada euro que pagas» (ahora el reparto es ilustrativo según COFOG).
  - `app/layout.tsx:27`: keyword «calculadora IRPF 2024».
  - `frontend/CLAUDE.md`: dice «Impuestómetro: calculadora IRPF + SS 2024».
- **Warnings de lint en otros archivos** (no son míos): `presupuesto/page.tsx` `maxVal` y `Navbar.tsx` `ALL_LINKS`. `npx tsc --noEmit -p .` y `npm run lint` terminan con 0 errores.
- **Extracción de los datos:** los PDF y el JSON de la AEAT, el BOE, la IGAE y Eurostat se leyeron mediante WebFetch, porque curl estaba bloqueado por el proxy. La coherencia interna de las cifras COFOG (los subgrupos suman las divisiones y estas el total) y la coincidencia entre la IGAE y Eurostat dan confianza en los valores. Aun así, es una lectura indirecta.
