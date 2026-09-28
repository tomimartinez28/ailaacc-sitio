// Excel de salida: una hoja de Ingresos y una de Gastos, listas para copiar a la planilla general.
// Sin filas de totales, para que se puedan pegar directo (los totales se muestran en la herramienta).

import { ExcelJS } from '../../lib/librerias.js';

const FUENTE = { name: 'Arial', size: 10 };
const CABECERA = { fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } }, font: { ...FUENTE, bold: true, color: { argb: 'FFFFFFFF' } } };

// Columnas de cada hoja: [título, clave, ancho, formato numérico]
const COLUMNAS = {
  Ingresos: [
    ['Mes', 'mes', 11, 'mmm-yyyy'],      // primer día del mes, se ve "jul-2026"
    ['Fecha', 'fecha', 12, 'dd/mm/yyyy'],
    ['Monto', 'monto', 16, '#,##0.00'],
    ['Banco', 'banco', 12],
    ['CUIT del Emisor', 'cuit', 16, '@'],  // como texto: conserva los 11 dígitos tal cual
  ],
  Gastos: [
    ['Mes', 'mes', 11, 'mmm-yyyy'],
    ['Fecha', 'fecha', 12, 'dd/mm/yyyy'],
    ['Monto', 'monto', 16, '#,##0.00'],
    ['Banco', 'banco', 12],
    ['Categoría', 'categoria', 22],
    ['Concepto original', 'concepto', 60],
  ],
};

function agregarHoja(libro, nombre, filas) {
  const columnas = COLUMNAS[nombre];
  const hoja = libro.addWorksheet(nombre, { views: [{ state: 'frozen', ySplit: 1 }] });
  hoja.columns = columnas.map(([header, key, width, numFmt]) => ({ header, key, width, style: { font: FUENTE, ...(numFmt ? { numFmt } : null) } }));
  hoja.getRow(1).eachCell((c) => { c.fill = CABECERA.fill; c.font = CABECERA.font; c.alignment = { vertical: 'middle' }; });
  filas.forEach((f) => hoja.addRow(f));
  if (filas.length) hoja.autoFilter = { from: 'A1', to: { row: filas.length + 1, column: columnas.length } };
}

export async function generarExcel({ ingresos, gastos }) {
  const libro = new ExcelJS.Workbook();
  libro.creator = 'Extractos bancarios · AILAACC';
  agregarHoja(libro, 'Ingresos', ingresos);
  agregarHoja(libro, 'Gastos', gastos);
  return libro.xlsx.writeBuffer();
}
