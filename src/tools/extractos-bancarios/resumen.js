import { nombreDeSalida } from '../lib/descargar.js';
import { MONEDA } from './config.js';

// Cómo se muestra un extracto procesado en la lista
export function describirExtracto(resultado) {
  const { movimientos, ingresos, gastos } = resultado.estadisticas;
  return {
    meta: `${resultado.banco} · ${resultado.periodo} · ${movimientos} movimientos`,
    chips: [
      { clase: 'ingreso', texto: `${ingresos.cantidad} ingresos · ${MONEDA.format(ingresos.total)}` },
      { clase: 'gasto', texto: `${gastos.cantidad} gastos bancarios · ${MONEDA.format(gastos.total)}` },
    ],
  };
}

// "extracto-agosto.pdf" -> "extracto-agosto_resumen.xlsx"
export const salidaExtracto = (nombre) => nombreDeSalida(nombre, 'resumen');
