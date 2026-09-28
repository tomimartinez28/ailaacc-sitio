// Verificación de saldos y clasificación de movimientos en ingresos y gastos bancarios.

import { CATEGORIAS_GASTO, CUIT_POR_CONCEPTO, CUITS_EXCLUIDOS, CUITS_PRIVADOS_EXCLUIDOS, INGRESOS_EXCLUIDOS } from '../reglas.js';
import { centavos, extraerCuit, fechaLegible, huellaCuit, normalizar, primerDiaDelMes } from './utilidades.js';

// ---------- Integridad: el saldo de cada fila debe ser el anterior + el importe ----------
// Los bancos listan los movimientos del más nuevo al más viejo o al revés: se acepta cualquiera de los dos órdenes.
// Si algunas filas no traen saldo (ej. movimientos del día sin procesar), se suman sus importes hasta la próxima
// fila con saldo, así la cadena se sigue controlando; solo quedan sin verificar las de los extremos.
// Devuelve { estado: 'verificados' | 'no disponible', sinSaldo } o lanza un error si los saldos no cierran.
export function verificarSaldos(movimientos) {
  const sinSaldo = movimientos.filter((m) => m.saldo === null).length;
  if (movimientos.length - sinSaldo < 2) return { estado: 'no disponible', sinSaldo };
  const primeraFalla = (viejoArriba) => {
    const orden = viejoArriba ? movimientos : [...movimientos].reverse();
    let saldoAnterior = null;
    let pendiente = 0;
    for (const m of orden) {
      if (m.saldo === null) { if (saldoAnterior !== null) pendiente += m.importe; continue; }
      if (saldoAnterior !== null && Math.abs(saldoAnterior + pendiente + m.importe - m.saldo) > 0.005) return m;
      saldoAnterior = m.saldo;
      pendiente = 0;
    }
    return null;
  };
  const falla = primeraFalla(true) && primeraFalla(false);
  if (falla) {
    throw new Error(`Los saldos del extracto no cierran (movimiento del ${fechaLegible(falla.fecha)}: "${falla.concepto}"). Revisá que el archivo no esté modificado.`);
  }
  return { estado: 'verificados', sinSaldo };
}

// ---------- Reglas ----------
const categoriaDeGasto = (concepto) => CATEGORIAS_GASTO.find((c) => c.patron.test(concepto))?.categoria;

// Cheques depositados y rechazados: se descartan ambos movimientos (el ingreso no se concretó)
const nroCheque = (concepto) => concepto.match(/cheque.*?(\d{4,})/)?.[1];
const chequesRechazados = (movimientos) => new Set(movimientos
  .map((m) => normalizar(m.concepto))
  .filter((c) => c.startsWith('rechazo') && c.includes('cheque'))
  .map(nroCheque).filter(Boolean));

function cuitDelEmisor(concepto) {
  return extraerCuit(concepto) || CUIT_POR_CONCEPTO.find((r) => r.patron.test(normalizar(concepto)))?.cuit || '';
}

// Motivo de exclusión por CUIT: empresas por su número, personas por su huella
async function exclusionesPorCuit(cuits, privados) {
  const motivos = new Map();
  for (const cuit of new Set(cuits.filter(Boolean))) {
    const motivo = CUITS_EXCLUIDOS[cuit] ?? privados[await huellaCuit(cuit)];
    if (motivo) motivos.set(cuit, motivo);
  }
  return motivos;
}

// movimientos -> { ingresos, gastos, excluidos }
//   ingresos:  { mes, fecha, monto, banco, cuit }
//   gastos:    { mes, fecha, monto (positivo; negativo si es un reintegro), banco, categoria, concepto }
//   excluidos: { fecha, concepto, importe, motivo }  créditos que no son pagos recibidos
// opciones.cuitsPrivados: huellas de CUIT de personas a excluir (por defecto, las de reglas.js; los tests usan otras)
export async function clasificar(movimientos, banco, { cuitsPrivados = CUITS_PRIVADOS_EXCLUIDOS } = {}) {
  const rechazados = chequesRechazados(movimientos);
  const cuitExcluido = await exclusionesPorCuit(movimientos.filter((m) => m.importe > 0).map((m) => cuitDelEmisor(m.concepto)), cuitsPrivados);
  const ingresos = [];
  const gastos = [];
  const excluidos = [];

  for (const m of movimientos) {
    const concepto = normalizar(m.concepto);
    const base = { mes: primerDiaDelMes(m.fecha), fecha: m.fecha, banco };
    const categoria = categoriaDeGasto(concepto);

    if (m.importe < 0) {
      if (categoria) gastos.push({ ...base, monto: centavos(-m.importe), categoria, concepto: m.concepto });
      continue;
    }
    if (m.importe === 0) continue;

    // Crédito con concepto de gasto (ej. devolución de una comisión): resta del gasto, no es un ingreso
    if (categoria) {
      gastos.push({ ...base, monto: centavos(-m.importe), categoria, concepto: m.concepto });
      continue;
    }

    const excluir = (motivo) => excluidos.push({ fecha: m.fecha, concepto: m.concepto, importe: m.importe, motivo });
    const cuit = cuitDelEmisor(m.concepto);
    const cheque = concepto.includes('deposito') ? nroCheque(concepto) : undefined;
    const regla = INGRESOS_EXCLUIDOS.find((r) => r.patron.test(concepto));

    if (cheque && rechazados.has(cheque)) excluir('Cheque rechazado');
    else if (cuitExcluido.has(cuit)) excluir(cuitExcluido.get(cuit));
    else if (regla) excluir(regla.motivo);
    else ingresos.push({ ...base, monto: centavos(m.importe), cuit });
  }

  const porFecha = (a, b) => a.fecha - b.fecha;
  return { ingresos: ingresos.sort(porFecha), gastos: gastos.sort(porFecha), excluidos: excluidos.sort(porFecha) };
}
