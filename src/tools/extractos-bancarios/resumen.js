import { nombreDeSalida } from '../lib/descargar.js';
import { MONEDA } from './config.js';

// Cómo se muestra un extracto procesado en la lista
export function describirExtracto(resultado) {
  const { movimientos, ingresos, gastos, excluidos, saldos, sinSaldo = 0 } = resultado.estadisticas;
  const control = saldos !== 'verificados' ? 'el banco no informa saldos'
    : sinSaldo ? `saldos verificados (salvo ${sinSaldo} movimientos sin saldo informado)` : 'saldos verificados';
  return {
    meta: `${resultado.banco} · ${resultado.periodo} · ${movimientos} movimientos · ${control}`,
    chips: [
      { clase: 'ingreso', texto: `${ingresos.cantidad} ingresos · ${MONEDA.format(ingresos.total)}` },
      { clase: 'gasto', texto: `${gastos.cantidad} gastos bancarios · ${MONEDA.format(gastos.total)}` },
      ...(excluidos ? [{ clase: 'excluido', texto: `${excluidos} créditos excluidos (traspasos y otros)` }] : []),
    ],
  };
}

// "extracto-agosto.xlsx" -> "extracto-agosto_resumen.xlsx"
export const salidaExtracto = (nombre) => nombreDeSalida(nombre, 'resumen');
