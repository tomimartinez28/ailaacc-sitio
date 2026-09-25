// Genera el Excel de salida con ExcelJS.
// Hojas: Resumen, Incidencias y una hoja por persona.

import { ExcelJS } from './librerias.js';
import { COLORES, FUENTE, PARES_MINIMOS, MINUTOS_DUPLICADO } from '../config.js';
import { DIAS_SEMANA, fechaIso, fechaLegible, minutosAHora } from './utilidades.js';

// ---------- ayudas de formato ----------
const relleno = (hex) => ({ type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + hex } });
const lineaFina = { style: 'thin', color: { argb: 'FF' + COLORES.borde } };
const BORDE = { top: lineaFina, bottom: lineaFina, left: lineaFina, right: lineaFina };
const ENLACE = { ...FUENTE, color: { argb: 'FF' + COLORES.enlace }, underline: true };

// Número de columna (1 = A, 2 = B, ... 27 = AA) -> letra
const letra = (n) => {
  let s = '';
  while (n) { const r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
};

// Referencia a otra hoja con comillas: 'Nombre de hoja'
const refHoja = (nombre) => `'${nombre.replace(/'/g, "''")}'`;

function estiloCabecera(fila) {
  fila.eachCell((c) => {
    c.font = { ...FUENTE, bold: true, color: { argb: 'FFFFFFFF' } };
    c.fill = relleno(COLORES.cabecera);
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = BORDE;
  });
}

// Nombre de hoja válido para Excel: máx. 31 caracteres, sin []:*?/\' y sin repetir
function nombreDeHoja(persona, usados) {
  const base = `${persona.id} ${persona.nombre}`.replace(/[\[\]:*?\/\\']/g, '').slice(0, 31).trim();
  let nombre = base;
  let k = 2;
  while (usados.has(nombre.toLowerCase())) nombre = `${base.slice(0, 27)} (${k++})`;
  usados.add(nombre.toLowerCase());
  return nombre;
}

// Todos los días del mes (o meses) que abarcan los datos
function calcularPeriodo(personas) {
  const fechas = personas.flatMap((p) => [...p.dias.keys()]).sort();
  const inicio = new Date(fechas[0].slice(0, 7) + '-01T00:00:00Z');
  const ultima = fechas[fechas.length - 1];
  const fin = new Date(Date.UTC(+ultima.slice(0, 4), +ultima.slice(5, 7), 0));
  const dias = [];
  for (let d = new Date(inicio); d <= fin; d.setUTCDate(d.getUTCDate() + 1)) dias.push(new Date(d));
  return { inicio, fin, dias };
}

// ---------- hoja de una persona ----------
function crearHojaPersona(libro, persona, nombreHoja, periodo, pares, incidencias) {
  const hoja = libro.addWorksheet(nombreHoja, { views: [{ state: 'frozen', ySplit: 5, xSplit: 2 }] });
  const nMarcas = pares * 2;
  const colHoras = 3 + nMarcas;          // Fecha, Día, marcas..., Horas
  const colDup = colHoras + 1;
  const colObs = colHoras + 2;
  const ultimaMarca = letra(2 + nMarcas);
  const filaInicio = 6;
  const filaFin = filaInicio + periodo.dias.length - 1;

  // Encabezado
  hoja.getCell('A1').value = persona.nombre;
  hoja.getCell('A1').font = { ...FUENTE, size: 14, bold: true };
  hoja.getCell('A2').value = `ID ${persona.id}`
    + (persona.sector ? `   |   Sector: ${persona.sector}` : '')
    + (persona.equipos.size ? `   |   Equipo(s): ${[...persona.equipos].join(', ')}` : '');
  hoja.getCell('A3').value = { text: '← Volver al resumen', hyperlink: "#'Resumen'!A1" };
  hoja.getCell('A3').font = ENLACE;

  const titulos = ['Fecha', 'Día'];
  for (let k = 1; k <= pares; k++) titulos.push(`Entrada ${k}`, `Salida ${k}`);
  titulos.push('Horas', 'Duplicadas (borrar)', 'Observaciones');
  hoja.getRow(5).values = titulos;
  hoja.getRow(5).height = 28;
  estiloCabecera(hoja.getRow(5));

  // Una fila por día
  periodo.dias.forEach((d, i) => {
    const f = filaInicio + i;
    const fila = hoja.getRow(f);
    const dia = persona.dias.get(fechaIso(d));

    fila.getCell(1).value = d;
    fila.getCell(1).numFmt = 'dd/mm/yyyy';
    fila.getCell(2).value = DIAS_SEMANA[d.getUTCDay()];

    // Marcas válidas, guardadas como hora de Excel para que las fórmulas funcionen
    if (dia) dia.validas.forEach((m, k) => { fila.getCell(3 + k).value = m / 1440; });
    for (let k = 0; k < nMarcas; k++) fila.getCell(3 + k).numFmt = 'hh:mm';

    // Horas: si la cantidad de marcas es impar muestra COMPLETAR; si no, suma (Salida - Entrada)
    const rango = `C${f}:${ultimaMarca}${f}`;
    const restas = [];
    for (let k = 0; k < pares; k++) restas.push(`(${letra(4 + 2 * k)}${f}-${letra(3 + 2 * k)}${f})`);
    fila.getCell(colHoras).value = {
      formula: `IF(COUNT(${rango})=0,"",IF(MOD(COUNT(${rango}),2)=1,"COMPLETAR",${restas.join('+')}))`,
    };
    fila.getCell(colHoras).numFmt = '[h]:mm';

    // Observaciones, duplicadas e incidencias
    const obs = [];
    if (dia && dia.validas.length % 2 === 1) {
      obs.push('Marcas impares: completar');
      incidencias.push({ persona, fecha: d, tipo: 'Marcas impares', marcas: dia.validas, hoja: nombreHoja, fila: f });
    }
    if (dia && dia.duplicadas.length) {
      fila.getCell(colDup).value = dia.duplicadas.map(minutosAHora).join('  ');
      obs.push(`${dia.duplicadas.length} duplicada(s)`);
      incidencias.push({ persona, fecha: d, tipo: `Duplicada (< ${MINUTOS_DUPLICADO} min)`, marcas: dia.duplicadas, hoja: nombreHoja, fila: f });
    }
    fila.getCell(colObs).value = obs.join(' · ');

    for (let c = 1; c <= colObs; c++) {
      const celda = fila.getCell(c);
      celda.border = BORDE;
      celda.font = FUENTE;
      celda.alignment = { horizontal: c > colHoras ? 'left' : 'center' };
    }
    if (dia && dia.duplicadas.length) fila.getCell(colDup).fill = relleno(COLORES.duplicada);
    if (d.getUTCDay() === 0 || d.getUTCDay() === 6) {
      fila.getCell(1).fill = relleno(COLORES.finDeSemana);
      fila.getCell(2).fill = relleno(COLORES.finDeSemana);
    }
  });

  // Totales
  const L = letra(colHoras);
  const total = hoja.getRow(filaFin + 1);
  total.getCell(colHoras - 1).value = 'Total';
  total.getCell(colHoras - 1).font = { ...FUENTE, bold: true };
  total.getCell(colHoras - 1).alignment = { horizontal: 'right' };
  total.getCell(colHoras).value = { formula: `SUM(${L}${filaInicio}:${L}${filaFin})` };
  total.getCell(colHoras).numFmt = '[h]:mm';
  total.getCell(colHoras).font = { ...FUENTE, bold: true };
  total.getCell(colHoras).border = BORDE;

  const decimal = hoja.getRow(filaFin + 2);
  decimal.getCell(colHoras - 1).value = 'Horas decimales';
  decimal.getCell(colHoras - 1).alignment = { horizontal: 'right' };
  decimal.getCell(colHoras - 1).font = FUENTE;
  decimal.getCell(colHoras).value = { formula: `${L}${filaFin + 1}*24` };
  decimal.getCell(colHoras).numFmt = '0.00';
  decimal.getCell(colHoras).font = FUENTE;

  // Rosa "en vivo" para días impares: desaparece al completar la marca faltante
  hoja.addConditionalFormatting({
    ref: `A${filaInicio}:${letra(colObs)}${filaFin}`,
    rules: [{
      type: 'expression',
      priority: 1,
      formulae: [`MOD(COUNT($C${filaInicio}:$${ultimaMarca}${filaInicio}),2)=1`],
      style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FF' + COLORES.impar } } },
    }],
  });

  hoja.getColumn(1).width = 12;
  hoja.getColumn(2).width = 6;
  for (let k = 0; k < nMarcas; k++) hoja.getColumn(3 + k).width = 10;
  hoja.getColumn(colHoras).width = 12;
  hoja.getColumn(colDup).width = 20;
  hoja.getColumn(colObs).width = 34;
  hoja.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };

  // Datos que necesita el Resumen para armar sus fórmulas
  return { persona, nombreHoja, colHoras: L, colDup: letra(colDup), filaInicio, filaFin };
}

// ---------- hoja Resumen ----------
function completarResumen(hoja, refs, meta, periodo) {
  hoja.getCell('A1').value = 'Control de horas trabajadas';
  hoja.getCell('A1').font = { ...FUENTE, size: 14, bold: true };
  hoja.getCell('A2').value = `Archivo: ${meta.archivo}   |   Formato: ${meta.formato}   |   `
    + `Período: ${fechaLegible(fechaIso(periodo.inicio))} al ${fechaLegible(fechaIso(periodo.fin))}`;

  hoja.getCell('A3').fill = relleno(COLORES.impar);
  hoja.getCell('B3').value = 'Días con marcas impares: escribí la hora faltante (ej. 08:15) en la columna que corresponda, respetando el orden entrada/salida. Las horas se recalculan solas.';
  hoja.getCell('A4').fill = relleno(COLORES.duplicada);
  hoja.getCell('B4').value = `Marcas a menos de ${MINUTOS_DUPLICADO} minutos de la anterior (columna "Duplicadas"): no se suman y pueden borrarse.`;
  hoja.getCell('B5').value = 'Mientras un día diga COMPLETAR, no suma al total de esa persona.';
  ['B3', 'B4', 'B5'].forEach((a) => { hoja.getCell(a).font = { ...FUENTE, italic: true, color: { argb: 'FF595959' } }; });

  hoja.getRow(7).values = ['ID', 'Nombre', 'Sector', 'Equipo(s)', 'Días con marcas', 'Horas (hh:mm)', 'Horas decimales', 'Días a completar', 'Días con duplicadas'];
  hoja.getRow(7).height = 30;
  estiloCabecera(hoja.getRow(7));

  refs.forEach((r, i) => {
    const f = 8 + i;
    const fila = hoja.getRow(f);
    const h = refHoja(r.nombreHoja);
    const rangoHoras = `${h}!${r.colHoras}${r.filaInicio}:${r.colHoras}${r.filaFin}`;
    const rangoDup = `${h}!${r.colDup}${r.filaInicio}:${r.colDup}${r.filaFin}`;

    fila.getCell(1).value = Number(r.persona.id) || r.persona.id;
    fila.getCell(2).value = { text: r.persona.nombre, hyperlink: `#${h}!A1` };
    fila.getCell(3).value = r.persona.sector;
    fila.getCell(4).value = [...r.persona.equipos].join(', ');
    fila.getCell(5).value = { formula: `SUMPRODUCT(--(LEN(${rangoHoras})>0))` };
    fila.getCell(6).value = { formula: `${h}!${r.colHoras}${r.filaFin + 1}` };
    fila.getCell(6).numFmt = '[h]:mm';
    fila.getCell(7).value = { formula: `F${f}*24` };
    fila.getCell(7).numFmt = '0.00';
    fila.getCell(8).value = { formula: `COUNTIF(${rangoHoras},"COMPLETAR")` };
    fila.getCell(9).value = { formula: `COUNTIF(${rangoDup},"?*")` };

    for (let c = 1; c <= 9; c++) {
      fila.getCell(c).border = BORDE;
      fila.getCell(c).font = c === 2 ? ENLACE : FUENTE;
    }
  });

  const fTotal = 8 + refs.length;
  hoja.getCell(`B${fTotal}`).value = 'Totales';
  hoja.getCell(`B${fTotal}`).font = { ...FUENTE, bold: true };
  ['E', 'F', 'G', 'H', 'I'].forEach((L) => {
    const c = hoja.getCell(`${L}${fTotal}`);
    c.value = { formula: `SUM(${L}8:${L}${fTotal - 1})` };
    c.font = { ...FUENTE, bold: true };
    c.border = BORDE;
  });
  hoja.getCell(`F${fTotal}`).numFmt = '[h]:mm';
  hoja.getCell(`G${fTotal}`).numFmt = '0.00';

  hoja.addConditionalFormatting({
    ref: `H8:H${fTotal - 1}`,
    rules: [{ type: 'cellIs', operator: 'greaterThan', priority: 1, formulae: ['0'],
      style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FF' + COLORES.impar } } } }],
  });
  [8, 32, 16, 12, 11, 12, 11, 11, 12].forEach((w, i) => { hoja.getColumn(i + 1).width = w; });
  hoja.autoFilter = { from: 'A7', to: `I${fTotal - 1}` };
  hoja.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
}

// ---------- hoja Incidencias ----------
function completarIncidencias(hoja, incidencias) {
  hoja.getRow(1).values = ['ID', 'Nombre', 'Fecha', 'Tipo', 'Marcas', 'Ir a'];
  estiloCabecera(hoja.getRow(1));

  incidencias.forEach((inc, i) => {
    const fila = hoja.getRow(2 + i);
    fila.values = [Number(inc.persona.id) || inc.persona.id, inc.persona.nombre, inc.fecha, inc.tipo, inc.marcas.map(minutosAHora).join('  ')];
    fila.getCell(6).value = { text: 'Ver día', hyperlink: `#${refHoja(inc.hoja)}!A${inc.fila}` };
    for (let c = 1; c <= 6; c++) {
      fila.getCell(c).border = BORDE;
      fila.getCell(c).font = c === 6 ? ENLACE : FUENTE;
    }
    fila.getCell(3).numFmt = 'dd/mm/yyyy';
    fila.getCell(4).fill = relleno(inc.tipo.startsWith('Dup') ? COLORES.duplicada : COLORES.impar);
  });

  [8, 32, 12, 20, 40, 10].forEach((w, i) => { hoja.getColumn(i + 1).width = w; });
  if (incidencias.length) hoja.autoFilter = { from: 'A1', to: `F${incidencias.length + 1}` };
  hoja.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
}

// ---------- función principal ----------
export async function generarExcel(personas, meta) {
  const libro = new ExcelJS.Workbook();
  libro.creator = 'Control de horas';

  const periodo = calcularPeriodo(personas);
  const maxMarcas = Math.max(0, ...personas.flatMap((p) => [...p.dias.values()].map((d) => d.validas.length)));
  const pares = Math.max(PARES_MINIMOS, Math.ceil((maxMarcas + 1) / 2));   // siempre queda lugar para completar

  const resumen = libro.addWorksheet('Resumen', { views: [{ state: 'frozen', ySplit: 7 }] });
  const hojaIncidencias = libro.addWorksheet('Incidencias', { views: [{ state: 'frozen', ySplit: 1 }] });

  const usados = new Set(['resumen', 'incidencias']);
  const incidencias = [];
  const refs = personas.map((p) => crearHojaPersona(libro, p, nombreDeHoja(p, usados), periodo, pares, incidencias));

  completarResumen(resumen, refs, meta, periodo);
  completarIncidencias(hojaIncidencias, incidencias);

  const estadisticas = {
    personas: personas.length,
    diasImpares: incidencias.filter((x) => x.tipo === 'Marcas impares').length,
    marcasDuplicadas: personas.reduce((a, p) => a + [...p.dias.values()].reduce((b, d) => b + d.duplicadas.length, 0), 0),
  };
  return { buffer: await libro.xlsx.writeBuffer(), estadisticas };
}
