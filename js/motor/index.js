// Punto de entrada del motor: archivo -> Excel procesado.

import { detectarFormato } from './lectores.js';
import { agruparPorPersona } from './reglas.js';
import { generarExcel } from './excel.js';

export async function procesarArchivo(arrayBuffer, nombreArchivo) {
  const libro = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });   // 1. leer
  const formato = detectarFormato(libro);                                     // 2. detectar
  const marcas = formato.leer(libro);                                         // 3. extraer marcas
  if (!marcas.length) throw new Error('El archivo no tiene marcas para procesar.');

  const personas = agruparPorPersona(marcas);                                 // 4. aplicar reglas
  const { buffer, estadisticas } = await generarExcel(personas, {             // 5. generar Excel
    archivo: nombreArchivo,
    formato: formato.nombre,
  });

  return { buffer, formato: formato.nombre, estadisticas: { ...estadisticas, marcas: marcas.length } };
}
