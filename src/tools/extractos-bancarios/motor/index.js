// Motor de la herramienta de extractos bancarios: archivo -> reportes de ingresos y gastos.

import { XLSX } from '../../lib/librerias.js';
import { leerExtracto } from './lectores.js';
import { clasificar, verificarSaldos } from './clasificar.js';
import { generarExcel } from './excel.js';
import { centavos, fechaLegible } from './utilidades.js';

const total = (filas) => centavos(filas.reduce((acc, f) => acc + f.monto, 0));

// Resultado que muestra la interfaz (ver ../resumen.js)
// opciones: se pasan a clasificar() (los tests inyectan sus propias reglas)
export async function procesarExtracto(arrayBuffer, _nombreArchivo, opciones) {
  const libro = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });   // 1. leer
  const { banco, movimientos } = leerExtracto(libro);                        // 2. reconocer el banco
  if (!movimientos.length) throw new Error('El extracto no tiene movimientos.');
  const saldos = verificarSaldos(movimientos);                                // 3. controlar integridad
  const reporte = await clasificar(movimientos, banco, opciones);             // 4. clasificar
  const buffer = await generarExcel(reporte);                                 // 5. generar Excel

  const fechas = movimientos.map((m) => m.fecha).sort((a, b) => a - b);
  return {
    banco,
    periodo: `${fechaLegible(fechas[0])} al ${fechaLegible(fechas.at(-1))}`,
    buffer,
    reporte,
    estadisticas: {
      movimientos: movimientos.length,
      ingresos: { cantidad: reporte.ingresos.length, total: total(reporte.ingresos) },
      gastos: { cantidad: reporte.gastos.length, total: total(reporte.gastos) },
      excluidos: reporte.excluidos.length,
      saldos,
    },
  };
}
