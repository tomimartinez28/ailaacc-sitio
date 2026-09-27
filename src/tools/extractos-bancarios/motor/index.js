// Motor de la herramienta de extractos bancarios.
// PENDIENTE: la lógica de procesamiento se define más adelante. Por ahora rechaza los archivos
// con un aviso, y la interfaz lo muestra como un error en la lista.
//
// Contrato que la interfaz ya espera del resultado (ver ../resumen.js):
//   {
//     banco: 'Nombre del banco',
//     periodo: '01/08/2026 al 31/08/2026',
//     buffer: ArrayBuffer,                          // el .xlsx a descargar
//     estadisticas: {
//       movimientos: 123,                           // movimientos leídos del extracto
//       ingresos: { cantidad: 40, total: 1500000 }, // pagos recibidos
//       gastos: { cantidad: 12, total: 35000 },     // gastos bancarios (comisiones)
//     },
//   }

export const MENSAJE_EN_DESARROLLO = 'Esta herramienta todavía está en desarrollo: aún no procesa extractos.';

export async function procesarExtracto(/* arrayBuffer, nombreArchivo */) {
  throw new Error(MENSAJE_EN_DESARROLLO);
}
