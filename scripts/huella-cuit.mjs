// Calcula la huella de uno o más CUIT para agregarlos a CUITS_PRIVADOS_EXCLUIDOS (src/tools/extractos-bancarios/reglas.js).
// Uso: npm run huella-cuit -- 20123456789
import { cuitValido, huellaCuit } from '../src/tools/extractos-bancarios/motor/utilidades.js';

const cuits = process.argv.slice(2).map((c) => c.replace(/\D/g, ''));
if (!cuits.length) { console.error('Uso: npm run huella-cuit -- <CUIT> [<CUIT>...]'); process.exit(1); }
for (const c of cuits) {
  if (!cuitValido(c)) { console.error(`${c}: no es un CUIT válido`); process.exitCode = 1; continue; }
  console.log(`'${await huellaCuit(c)}': 'Descripción genérica',`);
}
