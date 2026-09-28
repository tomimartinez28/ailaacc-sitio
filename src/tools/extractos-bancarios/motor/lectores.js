// Lectores de extractos: uno por banco. Todos devuelven la misma estructura:
//   { banco, movimientos: [{ fecha: Date, concepto, importe (+ crédito / − débito), saldo | null }] }
// Para sumar un banco: escribir su lector y agregarlo a LECTORES (el orden importa: gana el primero que reconoce el archivo).

import { XLSX } from '../../lib/librerias.js';
import { aFecha, aNumero, normalizar } from './utilidades.js';

const filasDe = (hoja) => XLSX.utils.sheet_to_json(hoja, { header: 1, defval: '', raw: true });

// Busca la fila de encabezados que contiene todas las columnas pedidas (en las primeras 30 filas)
function buscarEncabezado(filas, requeridas) {
  for (let i = 0; i < Math.min(filas.length, 30); i++) {
    const celdas = filas[i].map(normalizar);
    if (requeridas.every((r) => celdas.includes(r))) return { fila: i, columna: (nombre) => celdas.indexOf(nombre), celdas };
  }
  return null;
}

// Concepto legible: sin tabulaciones ni espacios repetidos
const limpiar = (texto) => String(texto ?? '').replace(/\s+/g, ' ').trim();

// Filas con datos: tienen fecha
const conFecha = (filas, desde, colFecha) => filas.slice(desde + 1).filter((r) => String(r[colFecha] ?? '').trim() !== '');

// ---------- Santander (Cuenta Única): importes en dos columnas, Caja de Ahorro y Cuenta Corriente ----------
const santander = {
  banco: 'Santander',
  reconoce: (filas) => buscarEncabezado(filas, ['fecha', 'descripcion', 'referencia', 'caja de ahorro', 'cuenta corriente']),
  leer(filas, enc) {
    const c = { fecha: enc.columna('fecha'), desc: enc.columna('descripcion'), ca: enc.columna('caja de ahorro'), cc: enc.columna('cuenta corriente'), saldo: enc.columna('saldo') };
    return conFecha(filas, enc.fila, c.fecha).map((r) => ({
      fecha: aFecha(r[c.fecha]),
      concepto: limpiar(r[c.desc]),
      importe: aNumero(r[c.ca]) + aNumero(r[c.cc]),
      saldo: aNumero(r[c.saldo]),
    }));
  },
};

// ---------- NBCH (Cuenta Corriente y Caja de Ahorro): fechas como número de Excel ----------
// En Caja de Ahorro los créditos vienen en una columna sin título, entre "Monto" y "Descripción".
const nbch = {
  banco: 'NBCH',
  reconoce: (filas) => buscarEncabezado(filas, ['cuenta', 'fecha', 'monto', 'descripcion', 'saldo']),
  leer(filas, enc) {
    const c = { fecha: enc.columna('fecha'), monto: enc.columna('monto'), desc: enc.columna('descripcion'), saldo: enc.columna('saldo') };
    const extras = [];
    for (let i = c.monto + 1; i < c.desc; i++) if (enc.celdas[i] === '') extras.push(i);
    return conFecha(filas, enc.fila, c.fecha).map((r) => ({
      fecha: aFecha(r[c.fecha]),
      concepto: limpiar(r[c.desc]),
      importe: aNumero(r[c.monto]) + extras.reduce((acc, i) => acc + aNumero(r[i]), 0),
      saldo: aNumero(r[c.saldo]),
    }));
  },
};

// ---------- Credicoop (Cuenta Corriente): columnas Débito y Crédito ----------
const credicoop = {
  banco: 'Credicoop',
  reconoce: (filas) => buscarEncabezado(filas, ['fecha', 'concepto', 'debito', 'credito', 'saldo']),
  leer(filas, enc) {
    const c = { fecha: enc.columna('fecha'), concepto: enc.columna('concepto'), debito: enc.columna('debito'), credito: enc.columna('credito'), saldo: enc.columna('saldo') };
    return conFecha(filas, enc.fila, c.fecha).map((r) => ({
      fecha: aFecha(r[c.fecha]),
      concepto: limpiar(r[c.concepto]),
      importe: aNumero(r[c.credito]) - aNumero(r[c.debito]),
      saldo: aNumero(r[c.saldo]),
    }));
  },
};

// ---------- Francés / BBVA (Caja de Ahorro): importes como texto en formato argentino, sin saldo ----------
const frances = {
  banco: 'Frances',
  reconoce: (filas) => normalizar(filas[0]?.[0]).startsWith('detalle de movimientos de cuenta') && buscarEncabezado(filas, ['fecha', 'concepto', 'importe']),
  leer(filas, enc) {
    const c = { fecha: enc.columna('fecha'), concepto: enc.columna('concepto'), importe: enc.columna('importe') };
    return conFecha(filas, enc.fila, c.fecha).map((r) => ({
      fecha: aFecha(r[c.fecha]),
      concepto: limpiar(r[c.concepto]),
      importe: aNumero(r[c.importe]),
      saldo: null,
    }));
  },
};

export const LECTORES = [santander, nbch, credicoop, frances];
export const BANCOS_SOPORTADOS = ['Santander', 'NBCH', 'Credicoop', 'Francés'];

// Libro de Excel -> { banco, movimientos }
export function leerExtracto(libro) {
  const filas = filasDe(libro.Sheets[libro.SheetNames[0]]);
  for (const lector of LECTORES) {
    const enc = lector.reconoce(filas);
    if (enc) return { banco: lector.banco, movimientos: lector.leer(filas, enc) };
  }
  throw new Error(`No se reconoce el formato del extracto. Bancos soportados: ${BANCOS_SOPORTADOS.join(', ')}.`);
}
