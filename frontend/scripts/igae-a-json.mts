// Uso: node scripts/igae-a-json.mts <fichero.xlsx> [...]
// Vuelca a stdout (JSON) las filas leídas por lib/igae/extracto.ts. Sirve para verificar el
// lector contra los ficheros oficiales y para cargas manuales.
import { readFileSync } from 'node:fs';
import { parseExtracto } from '../lib/igae/extracto.ts';

const salida = process.argv.slice(2).map(f => ({ fichero: f, ...parseExtracto(readFileSync(f)) }));
process.stdout.write(JSON.stringify(salida));
