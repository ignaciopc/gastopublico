# Reglas comunes de la auditoría de datos — GastoPublico.es

Contexto: repo en /home/claude/gastopublico (rama fix/datos-verificados ya creada; NO ejecutes
comandos git). Código en frontend/ (Next.js 16, App Router; lee frontend/CLAUDE.md y AGENTS.md).
Fecha de hoy: 2026-11-17. El dueño quiere que la web NO MIENTA: solo datos verificables, con
fuente oficial y fecha, sin adjetivos ni encuadre editorial.

Para cada cifra, fecha, comparación o afirmación factual de los archivos que te tocan:
1. Verifícala contra la fuente oficial primaria (IGAE, BOE, AEAT, Seguridad Social, INE,
   Banco de España, Eurostat, AIReF, Tesoro, BDNS, PLACE, Comisión Europea…) con WebSearch/WebFetch.
   Medios de comunicación solo como pista para encontrar la fuente primaria, nunca como fuente final.
2. Si es correcta: déjala y asegúrate de que en la UI figura la fuente y el periodo/fecha del dato.
3. Si es incorrecta o está desfasada y hay dato oficial más reciente: corrígela, actualiza la
   etiqueta de periodo (p. ej. «2024» → «2025») y la fuente.
4. Si NO puedes verificarla en una fuente oficial: elimínala de la UI (o el bloque entero si queda
   vacío). Prohibido mantener cifras «aproximadas» sin base, inventar o redondear a ojo.
5. Cálculos derivados (por segundo, per cápita, %): recalcúlalos tú con Python a partir de los
   datos verificados y deja la fórmula en un comentario corto del código.
6. Lenguaje neutro: fuera adjetivos valorativos, preguntas retóricas, colores de «alarma» usados
   como juicio, comparaciones elegidas para impresionar. Describe, no opines.
7. Etiqueta como «estimación» todo lo que sea extrapolación (contadores en tiempo real, etc.) y
   explica en una línea cómo se calcula.
8. No cambies la arquitectura ni el diseño más allá de lo necesario. No instales dependencias.
   No toques archivos fuera de tu lista (si algo de otro archivo está mal, apúntalo en el informe).
9. Al terminar ejecuta en frontend/: `npx tsc --noEmit -p .` y `npm run lint` y deja 0 errores.

Entregable: además de editar el código, escribe /home/claude/factcheck/<area>.md con una tabla:
| archivo:línea | afirmación original | veredicto (OK / CORREGIDO / ELIMINADO) | valor final | fuente (URL oficial + fecha/periodo) |
y al final una sección «Pendiente / dudas» con lo que no pudiste resolver y cifras que afectan a
otros archivos. Sé honesto: si una verificación fue parcial, dilo.
