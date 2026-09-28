// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { procesarExtracto } from './index.js';
import { aFecha, aNumero, cuitValido, extraerCuit, huellaCuit, normalizar } from './utilidades.js';
import { clasificar, verificarSaldos } from './clasificar.js';

const fixture = (n) => {
  const b = readFileSync(new URL(`../../../../e2e/fixtures/extracto-${n}.xlsx`, import.meta.url));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};
// Huellas de los CUIT FICTICIOS de titular e hija que usan los extractos de prueba
const PRIVADOS_DE_PRUEBA = {
  '04d6f76ab4d8d5a5d13849b47bd38ca7f5f7546c1e505aa95163d695d9c89eaf': 'Cuenta propia (titular)',   // 27111111117
  '0d111b834b3c59280dfbca75e35edcc2c6435babf5956814e025a3f323388250': 'Familiar de la titular',     // 27222222228
};
const procesar = (n, opciones = { cuitsPrivados: PRIVADOS_DE_PRUEBA }) => procesarExtracto(fixture(n), `extracto-${n}.xlsx`, opciones);
const ingresos = (r) => r.reporte.ingresos.map((i) => [i.monto, i.cuit]);
const gastos = (r) => r.reporte.gastos.map((g) => [g.categoria, g.monto]);
const motivos = (r) => r.reporte.excluidos.map((x) => x.motivo);

describe('utilidades', () => {
  it('lee importes en los tres formatos que usan los bancos', () => {
    expect(aNumero(-96447.84)).toBe(-96447.84);
    expect(aNumero('-96.447,84')).toBe(-96447.84);   // Francés
    expect(aNumero('-30000.00')).toBe(-30000);        // Santander (no es -3.000.000)
    expect(aNumero('6.202.747,94')).toBe(6202747.94);
    expect(aNumero('')).toBe(0);
    expect(() => aNumero('abc')).toThrow('Importe ilegible');
  });
  it('lee fechas como número de Excel o texto', () => {
    expect(aFecha(46204).toISOString().slice(0, 10)).toBe('2026-07-01');
    expect(aFecha('31/07/2026').toISOString().slice(0, 10)).toBe('2026-07-31');
  });
  it('acepta solo CUIT con dígito verificador correcto', () => {
    expect(cuitValido('30999175461')).toBe(true);
    expect(cuitValido('30999175462')).toBe(false);
    expect(extraerCuit('Cta discapacida 30654855168 202 62700650043')).toBe('30654855168');
    expect(extraerCuit('Nro 62700650043 CBU 0110599520000055518882')).toBe('');
    expect(normalizar('  Débito\tLEY ')).toBe('debito ley');
  });
  it('la huella de un CUIT es estable y distinta para cada CUIT', async () => {
    expect(await huellaCuit('27111111117')).toBe('04d6f76ab4d8d5a5d13849b47bd38ca7f5f7546c1e505aa95163d695d9c89eaf');
    expect(await huellaCuit('27222222228')).not.toBe(await huellaCuit('27111111117'));
  });
  it('reglas.js no publica CUIT de personas en claro (solo huellas)', () => {
    const reglas = readFileSync(new URL('../reglas.js', import.meta.url), 'utf8');
    expect(reglas.match(/(?<!\d)(20|23|24|27)\d{9}(?!\d)/g)).toBeNull();
  });
});

describe('integridad', () => {
  const m = (saldo, importe) => ({ fecha: new Date(0), concepto: 'x', importe, saldo });
  it('acepta saldos encadenados en cualquier orden y rechaza si no cierran', () => {
    expect(verificarSaldos([m(100, 0), m(150, 50), m(120, -30)])).toBe('verificados');
    expect(verificarSaldos([m(120, -30), m(150, 50), m(100, 0)])).toBe('verificados');
    expect(verificarSaldos([{ ...m(0, 1), saldo: null }, { ...m(0, 1), saldo: null }])).toBe('no disponible');
    expect(() => verificarSaldos([m(100, 0), m(151, 50)])).toThrow('Los saldos del extracto no cierran');
  });
  it('un crédito con concepto de gasto (reintegro) resta del gasto y no es ingreso', async () => {
    const r = await clasificar([{ fecha: new Date(0), concepto: 'Com. mantenimiento cuenta reintegro', importe: 500, saldo: null }], 'X');
    expect(r.ingresos).toEqual([]);
    expect(r.gastos.map((g) => [g.categoria, g.monto])).toEqual([['Comisiones', -500]]);
  });
});

describe('extractos por banco', () => {
  it('Credicoop: CUIT en tres formatos, impuestos, comisiones y su IVA', async () => {
    const r = await procesar('credicoop');
    expect(r.banco).toBe('Credicoop');
    expect(r.estadisticas.saldos).toBe('verificados');
    expect(ingresos(r)).toEqual([[250000.5, '30711111111'], [120000, '30722222225'], [80000, '30733333339']]);
    expect(gastos(r)).toEqual([
      ['Impuesto al Crédito', 1500], ['Impuesto al Crédito', 720], ['Impuesto al Débito', 1800],
      ['Comisiones', 30], ['Comisiones', 500], ['IVA sobre comisiones', 14680.05], ['Comisiones', 4375], ['Comisiones', 65000],
    ]);
    expect(motivos(r)).toEqual([]);   // la transferencia "Igual Tit." es un débito: no aparece
  });

  it('NBCH Caja de ahorro: cheque rechazado, titular, hija, InvertirOnline y CUIT fijo', async () => {
    const r = await procesar('nbch-ca');
    expect(r.banco).toBe('NBCH');
    expect(ingresos(r)).toEqual([[350000.25, '30744444442'], [150000, ''], [4500000, '30999175461'], [610000.1, '30755555556']]);
    expect(gastos(r)).toEqual([['Comisiones', 14690], ['IVA sobre comisiones', 3084.9], ['Comisiones', 1400]]);
    expect(motivos(r)).toEqual(['Cheque rechazado', 'Cuenta propia (titular)', 'InvertirOnline (traspaso de inversiones)',
      'Familiar de la titular', 'Crédito por sentencia judicial', 'Intereses de la cuenta']);
  });

  it('NBCH Cuenta corriente: intereses y su IVA; el seguro no es gasto bancario', async () => {
    const r = await procesar('nbch-cc');
    expect(ingresos(r)).toEqual([]);
    expect(gastos(r)).toEqual([
      ['Impuesto al Débito', 1200], ['Impuesto al Débito', 1.94], ['Impuesto al Crédito', 3000], ['Comisiones', 64000],
      ['IVA sobre comisiones', 13440], ['Intereses', 41670.47], ['IVA sobre intereses', 8750.8],
    ]);
    expect(r.reporte.gastos.some((g) => /seguro/i.test(g.concepto))).toBe(false);
  });

  it('Santander: importes con punto decimal, exclusiones y número de operación que no es CUIT', async () => {
    const r = await procesar('santander');
    expect(r.estadisticas.saldos).toBe('verificados');
    expect(ingresos(r)).toEqual([[481663, '30711111111'], [682187.06, '30722222225'], [236174.58, '30733333339']]);
    expect(gastos(r)).toEqual([
      ['IVA sobre comisiones', 22741.66], ['Intereses', 26862.21], ['Comisiones', 5289.26], ['Comisiones', 76142.15], ['Impuesto al Débito', 30000],
    ]);
    expect(motivos(r)).toEqual(['InvertirOnline (traspaso de inversiones)', 'Intereses de la cuenta', 'Bonificación o promoción',
      'Cuenta propia (titular)', 'Rescate de fondos (traspaso)']);
  });

  it('con las reglas reales, los CUIT ficticios no se excluyen, pero "Mismo Titular" sí (por el concepto)', async () => {
    const r = await procesarExtracto(fixture('nbch-ca'));
    expect(motivos(r)).toContain('Transferencia entre cuentas propias');
    expect(ingresos(r)).toContainEqual([50000, '27222222228']);
  });

  it('Francés: importes en formato argentino, sin saldo, CUIT fijo para "PAGO A PROVEEDORES"', async () => {
    const r = await procesar('frances');
    expect(r.banco).toBe('Frances');
    expect(r.estadisticas.saldos).toBe('no disponible');
    expect(ingresos(r)).toEqual([[8334826.46, '30546741253'], [6202747.94, '30546741253']]);
    expect(gastos(r)).toEqual([]);
    expect(motivos(r)).toEqual(['Intereses de la cuenta']);
  });

  it('rechaza un extracto con el saldo alterado y un archivo que no es de un banco soportado', async () => {
    await expect(procesar('saldo-alterado')).rejects.toThrow('Los saldos del extracto no cierran');
    const b = readFileSync(new URL('../../../../e2e/fixtures/invalido.xlsx', import.meta.url));
    await expect(procesarExtracto(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))).rejects.toThrow('No se reconoce el formato del extracto');
  });
});

describe('Excel de salida', () => {
  it('hojas Ingresos y Gastos con las columnas y formatos acordados', async () => {
    const r = await procesar('nbch-ca');
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(r.buffer);
    expect(wb.worksheets.map((h) => h.name)).toEqual(['Ingresos', 'Gastos']);
    const ing = wb.getWorksheet('Ingresos');
    expect(ing.getRow(1).values.slice(1)).toEqual(['Mes', 'Fecha', 'Monto', 'Banco', 'CUIT del Emisor']);
    const fila = ing.getRow(4);   // Pago Electrónico del Estado, 24/07
    expect(fila.getCell(1).value.toISOString().slice(0, 10)).toBe('2026-07-01');   // primer día del mes
    expect(fila.getCell(1).numFmt).toBe('mmm-yyyy');
    expect(fila.getCell(2).value.toISOString().slice(0, 10)).toBe('2026-07-24');
    expect(fila.getCell(2).numFmt).toBe('dd/mm/yyyy');
    expect(fila.getCell(3).value).toBe(4500000);
    expect(fila.getCell(4).value).toBe('NBCH');
    expect(fila.getCell(5).value).toBe('30999175461');
    expect(ing.rowCount).toBe(5);   // encabezado + 4 ingresos, sin fila de totales
    const gas = wb.getWorksheet('Gastos');
    expect(gas.getRow(1).values.slice(1)).toEqual(['Mes', 'Fecha', 'Monto', 'Banco', 'Categoría', 'Concepto original']);
    expect(gas.getRow(2).values.slice(3)).toEqual([14690, 'NBCH', 'Comisiones', 'Comisión Gestión Depósito Cheque de Terceros']);
  });
});
