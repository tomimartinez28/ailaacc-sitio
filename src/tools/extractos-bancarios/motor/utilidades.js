// Funciones chicas, sin dependencias, para leer extractos.

// Texto en minúsculas, sin acentos y con espacios simples (para comparar conceptos con las reglas)
export const normalizar = (texto) => String(texto ?? '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/\s+/g, ' ').trim();

// Importe de una celda -> número. Soporta:
//   número de Excel            -96447.84
//   texto formato argentino    "-96.447,84"  (BBVA)
//   texto con punto decimal    "-30000.00"   (Santander)
//   celda vacía                ""  -> 0
export function aNumero(valor) {
  if (typeof valor === 'number') return valor;
  const s = String(valor ?? '').replace(/\s|\$/g, '');
  if (s === '') return 0;
  const n = s.includes(',') ? Number(s.replace(/\./g, '').replace(',', '.')) : Number(s);
  if (Number.isNaN(n)) throw new Error(`Importe ilegible: "${valor}"`);
  return n;
}

// Redondeo a centavos (evita errores de coma flotante al sumar)
export const centavos = (n) => Math.round(n * 100) / 100;

// Fecha de una celda -> Date (UTC, sin hora). Soporta número de serie de Excel y texto "dd/mm/aaaa".
export function aFecha(valor) {
  if (typeof valor === 'number') {
    const d = new Date(Math.round((valor - 25569) * 86400000));
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }
  const m = String(valor ?? '').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) throw new Error(`Fecha ilegible: "${valor}"`);
  return new Date(Date.UTC(Number(m[3]), Number(m[2]) - 1, Number(m[1])));
}

export const primerDiaDelMes = (fecha) => new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), 1));

const pad = (n) => String(n).padStart(2, '0');
export const fechaLegible = (d) => `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;

// CUIT/CUIL válido: 11 dígitos, prefijo conocido y dígito verificador correcto
export function cuitValido(cuit) {
  if (!/^(20|23|24|25|26|27|30|33|34)\d{9}$/.test(cuit)) return false;
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const suma = pesos.reduce((acc, p, i) => acc + p * Number(cuit[i]), 0);
  let dv = 11 - (suma % 11);
  if (dv === 11) dv = 0;
  if (dv === 10) dv = 9;
  return dv === Number(cuit[10]);
}

// Huella SHA-256 de un CUIT (hex). Se usa para excluir CUIT de personas sin publicarlos en el código.
// Mismo cálculo en el navegador y en Node (Web Crypto). Ver scripts/huella-cuit.mjs.
export async function huellaCuit(cuit) {
  const datos = new TextEncoder().encode(`ailaacc-extractos:${cuit}`);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', datos);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Primer CUIT válido que aparece en el texto (ignora números de operación o CBU que no son CUIT)
export function extraerCuit(texto) {
  for (const [, numero] of String(texto ?? '').matchAll(/(?<!\d)(\d{11})(?!\d)/g)) {
    if (cuitValido(numero)) return numero;
  }
  return '';
}
