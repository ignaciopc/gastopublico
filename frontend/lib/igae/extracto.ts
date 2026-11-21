// Lector del «Extracto de ejecución del Presupuesto. Administración General del Estado»
// que publica la IGAE cada mes (fichero «Cuadros», .xlsx).
//
// Sin dependencias: un .xlsx es un ZIP con XML. Solo se leen dos hojas:
//   - «GTOS 001»: estado de ejecución por secciones
//   - «GTOS 004»: estado de ejecución por capítulos
// Cada hoja trae el ejercicio corriente y el mismo periodo del anterior. Los importes
// están en miles de euros, tal como los publica la IGAE.
//
// Este módulo no importa nada del proyecto para poder ejecutarse también con
// `node scripts/igae-a-json.mts` (Node ≥ 22.18 elimina los tipos sin compilar).

import { inflateRawSync } from 'node:zlib';

// ─── ZIP ─────────────────────────────────────────────────────────────────────

function leerZip(buf: Buffer): Map<string, Buffer> {
  const EOCD = 0x06054b50;
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === EOCD) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('El fichero no es un .xlsx válido (ZIP sin directorio central)');

  const total = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const ficheros = new Map<string, Buffer>();

  for (let n = 0; n < total; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('ZIP corrupto: entrada de directorio inválida');
    const metodo = buf.readUInt16LE(p + 10);
    const tamComprimido = buf.readUInt32LE(p + 20);
    const largoNombre = buf.readUInt16LE(p + 28);
    const largoExtra = buf.readUInt16LE(p + 30);
    const largoComentario = buf.readUInt16LE(p + 32);
    const offsetLocal = buf.readUInt32LE(p + 42);
    const nombre = buf.toString('utf8', p + 46, p + 46 + largoNombre);

    const inicioDatos = offsetLocal + 30 + buf.readUInt16LE(offsetLocal + 26) + buf.readUInt16LE(offsetLocal + 28);
    const datos = buf.subarray(inicioDatos, inicioDatos + tamComprimido);
    if (metodo === 0) ficheros.set(nombre, Buffer.from(datos));
    else if (metodo === 8) ficheros.set(nombre, inflateRawSync(datos));
    else throw new Error(`ZIP con método de compresión no soportado (${metodo}) en ${nombre}`);

    p += 46 + largoNombre + largoExtra + largoComentario;
  }
  return ficheros;
}

// ─── XLSX → filas ────────────────────────────────────────────────────────────

type Celda = string | number | null;

function decodificarXml(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&amp;/g, '&');
}

function textoDe(xml: string): string {
  let out = '';
  for (const m of xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)) out += m[1];
  return decodificarXml(out);
}

function columnaAIndice(ref: string): number {
  const letras = ref.replace(/\d+/g, '');
  let n = 0;
  for (const c of letras) n = n * 26 + (c.charCodeAt(0) - 64);
  return n - 1;
}

function leerHojas(buf: Buffer, nombres: string[]): Map<string, Celda[][]> {
  const zip = leerZip(buf);
  const leer = (ruta: string) => {
    const f = zip.get(ruta);
    if (!f) throw new Error(`Falta ${ruta} dentro del .xlsx`);
    return f.toString('utf8');
  };

  const compartidas: string[] = [];
  if (zip.has('xl/sharedStrings.xml')) {
    for (const m of leer('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)) compartidas.push(textoDe(m[1]));
  }

  const rels = new Map<string, string>();
  for (const m of leer('xl/_rels/workbook.xml.rels').matchAll(/<Relationship\b[^>]*>/g)) {
    const id = /\bId="([^"]+)"/.exec(m[0])?.[1];
    const target = /\bTarget="([^"]+)"/.exec(m[0])?.[1];
    if (id && target) rels.set(id, target.replace(/^\/?xl\//, '').replace(/^\//, ''));
  }

  const rutas = new Map<string, string>();
  for (const m of leer('xl/workbook.xml').matchAll(/<sheet\b[^>]*>/g)) {
    const nombre = /\bname="([^"]+)"/.exec(m[0])?.[1];
    const rid = /\br:id="([^"]+)"/.exec(m[0])?.[1];
    if (nombre && rid && rels.has(rid)) rutas.set(decodificarXml(nombre), 'xl/' + rels.get(rid));
  }

  const hojas = new Map<string, Celda[][]>();
  for (const nombre of nombres) {
    const ruta = rutas.get(nombre);
    if (!ruta) throw new Error(`El .xlsx no contiene la hoja «${nombre}»`);
    const filas: Celda[][] = [];
    for (const fila of leer(ruta).matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
      const valores: Celda[] = [];
      for (const c of fila[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const attrs = c[1];
        const cuerpo = c[2] ?? '';
        const ref = /\br="([A-Z]+\d+)"/.exec(attrs)?.[1];
        const tipo = /\bt="([^"]+)"/.exec(attrs)?.[1];
        const v = /<v>([\s\S]*?)<\/v>/.exec(cuerpo)?.[1];
        let valor: Celda = null;
        if (tipo === 's' && v !== undefined) valor = compartidas[Number(v)] ?? null;
        else if (tipo === 'inlineStr') valor = textoDe(cuerpo);
        else if (tipo === 'str' && v !== undefined) valor = decodificarXml(v);
        else if (v !== undefined) valor = Number(v);
        const idx = ref ? columnaAIndice(ref) : valores.length;
        valores[idx] = valor;
      }
      for (let i = 0; i < valores.length; i++) if (valores[i] === undefined) valores[i] = null;
      if (valores.some(v => v !== null && v !== '')) filas.push(valores);
    }
    hojas.set(nombre, filas);
  }
  return hojas;
}

// ─── Extracto IGAE ───────────────────────────────────────────────────────────

export const MESES = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'];

export type Nivel = 'seccion' | 'capitulo' | 'total';

export interface FilaEjecucion {
  ejercicio: number;
  mes: number;
  fecha_corte: string;          // AAAA-MM-DD
  nivel: Nivel;
  orden: number;                // posición en el cuadro oficial
  nombre: string;
  creditos_definitivos: number; // miles de euros
  gastos_comprometidos: number;
  obligaciones_reconocidas: number;
  pagos_realizados: number;
}

export interface Extracto {
  ejercicio: number;
  mes: number;
  fechaCorte: string;
  filas: FilaEjecucion[];       // ejercicio corriente y mismo periodo del anterior
}

function importe(v: Celda, contexto: string): number {
  if (v === null || v === '-' || v === '') return 0;
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  throw new Error(`Importe no numérico en ${contexto}: ${JSON.stringify(v)}`);
}

function leerCuadro(filas: Celda[][], hoja: string, esPartida: (nombre: string) => boolean) {
  const cabecera = filas.find(f => typeof f[0] === 'string' && /HASTA EL/i.test(f[0] as string));
  if (!cabecera) throw new Error(`${hoja}: no se encuentra la cabecera «HASTA EL …»`);
  const m = /HASTA EL (\d{1,2}) DE ([A-ZÁÉÍÓÚ]+)/i.exec(cabecera[0] as string);
  if (!m) throw new Error(`${hoja}: fecha de corte ilegible`);
  const dia = Number(m[1]);
  const mes = MESES.indexOf(m[2].toUpperCase()) + 1;
  const anio = Number(cabecera[1]);
  const anioAnterior = Number(cabecera[5]);
  if (!mes || !anio || anioAnterior !== anio - 1) throw new Error(`${hoja}: cabecera de ejercicios inesperada`);

  const columnas = filas[filas.indexOf(cabecera) + 1].map(c => String(c ?? '').replace(/\s+/g, ' '));
  const esperado = [/CR[ÉE]DITOS DEFINITIVOS/, /GASTOS COMPROMETIDOS/, /OBLIGACIONES RECONOCIDAS/, /PAGOS REALIZ/];
  for (let i = 0; i < 4; i++) {
    if (!esperado[i].test(columnas[1 + i]) || !esperado[i].test(columnas[5 + i])) {
      throw new Error(`${hoja}: las columnas no son las esperadas (${columnas.slice(1, 9).join(' | ')})`);
    }
  }

  const datos = filas.slice(filas.indexOf(cabecera) + 2);
  const total = datos.find(f => String(f[0] ?? '').trim() === 'TOTALES');
  if (!total) throw new Error(`${hoja}: falta la fila TOTALES`);
  const partidas = datos.filter(f => typeof f[0] === 'string' && esPartida(f[0].trim()));
  if (partidas.length === 0) throw new Error(`${hoja}: no hay partidas`);

  // Comprobación de integridad: la suma de las partidas debe dar exactamente el total oficial.
  for (let col = 1; col <= 8; col++) {
    const suma = partidas.reduce((s, f) => s + importe(f[col], `${hoja} col ${col}`), 0);
    const oficial = importe(total[col], `${hoja} TOTALES col ${col}`);
    if (suma !== oficial) throw new Error(`${hoja}: la suma de partidas (${suma}) no coincide con TOTALES (${oficial}) en la columna ${col}`);
  }

  return { dia, mes, anio, partidas, total };
}

function ultimoDiaDelMes(anio: number, mes: number): number {
  return new Date(Date.UTC(anio, mes, 0)).getUTCDate();
}

export function parseExtracto(buf: Buffer): Extracto {
  const hojas = leerHojas(buf, ['GTOS 001', 'GTOS 004']);
  const sec = leerCuadro(hojas.get('GTOS 001')!, 'GTOS 001', n => n !== 'TOTALES');
  const cap = leerCuadro(hojas.get('GTOS 004')!, 'GTOS 004', n => /^\d\.\s/.test(n));

  if (sec.mes !== cap.mes || sec.anio !== cap.anio || sec.dia !== cap.dia) {
    throw new Error('Las hojas GTOS 001 y GTOS 004 tienen fechas de corte distintas');
  }
  for (let col = 1; col <= 8; col++) {
    if (importe(sec.total[col], 'GTOS 001') !== importe(cap.total[col], 'GTOS 004')) {
      throw new Error(`El total por secciones y el total por capítulos no coinciden (columna ${col})`);
    }
  }

  const { anio, mes } = sec;
  const filas: FilaEjecucion[] = [];
  const fecha = (a: number) => {
    // El periodo del año anterior es el mismo mes completo (p. ej. 28 de febrero).
    const d = a === anio ? sec.dia : ultimoDiaDelMes(a, mes);
    return `${a}-${String(mes).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const anadir = (nivel: Nivel, orden: number, nombre: string, f: Celda[]) => {
    for (const [a, base] of [[anio, 1], [anio - 1, 5]] as const) {
      filas.push({
        ejercicio: a,
        mes,
        fecha_corte: fecha(a),
        nivel,
        orden,
        nombre,
        creditos_definitivos: importe(f[base], nombre),
        gastos_comprometidos: importe(f[base + 1], nombre),
        obligaciones_reconocidas: importe(f[base + 2], nombre),
        pagos_realizados: importe(f[base + 3], nombre),
      });
    }
  };

  sec.partidas.forEach((f, i) => anadir('seccion', i + 1, String(f[0]).trim(), f));
  cap.partidas.forEach((f, i) => anadir('capitulo', i + 1, String(f[0]).trim(), f));
  anadir('total', 0, 'TOTAL', sec.total);

  return { ejercicio: anio, mes, fechaCorte: fecha(anio), filas };
}
