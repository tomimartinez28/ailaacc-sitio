// Lectores de cada formato de reporte.
// Todos devuelven la misma lista de marcas:
//   { id, nombre, sector, equipo, fecha: "AAAA-MM-DD", min: minutos desde 00:00 }

import { XLSX } from './librerias.js';
import { pad, serialAFecha, fechaIso, horaAMinutos, horasDeCelda } from './utilidades.js';

const filasDe = (hoja) => XLSX.utils.sheet_to_json(hoja, { header: 1, defval: '', raw: true });

// ---------- ANVIZ / CrossChex: listado de registros (una fila por marca) ----------
function leerAnviz(libro) {
  const filas = filasDe(libro.Sheets[libro.SheetNames[0]]);
  const cabecera = filas[0].map((c) => String(c).trim());

  const columna = (nombre) => {
    const i = cabecera.indexOf(nombre);
    if (i < 0) throw new Error(`Falta la columna "${nombre}"`);
    return i;
  };
  const cId = columna('ID de usuario');
  const cNombre = columna('Nombre');
  const cFechaHora = columna('Fecha/Hora');
  const cSector = cabecera.indexOf('Departamento');
  const cEquipo = cabecera.indexOf('Dispositivo Nro.');

  const marcas = [];
  for (const fila of filas.slice(1)) {
    const valor = fila[cFechaHora];
    if (valor === '' || valor == null) continue;

    let fecha, min;
    if (typeof valor === 'number') {              // fecha/hora como número de Excel
      fecha = fechaIso(serialAFecha(valor));
      min = (valor % 1) * 1440;
    } else {                                       // fecha/hora como texto "2026-08-03 07:40:07"
      const m = String(valor).match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}:\d{2}(:\d{2})?)/);
      if (!m) continue;
      fecha = `${m[1]}-${m[2]}-${m[3]}`;
      min = horaAMinutos(m[4]);
    }

    marcas.push({
      id: String(fila[cId]).trim(),
      nombre: String(fila[cNombre]).trim(),
      sector: cSector >= 0 ? String(fila[cSector]).trim() : '',
      equipo: cEquipo >= 0 ? String(fila[cEquipo]).trim() : '',
      fecha,
      min,
    });
  }
  return marcas;
}

// ---------- Formato B: reporte XML de 4 hojas (se usa la hoja "Logs") ----------
function leerFormatoB(libro) {
  const filas = filasDe(libro.Sheets['Logs']);

  const periodo = filas.flat().find((c) => /\d{4}\/\d{1,2}\/\d{1,2}\s*~/.test(c));
  if (!periodo) throw new Error('No se encontró el período en la hoja Logs');
  const [, anio, mes] = periodo.match(/(\d{4})\/(\d{1,2})/);

  // Fila con los números de día 1, 2, 3... 31
  const filaDias = filas.find((f) => String(f[0]) === '1' && String(f[1]) === '2');

  const marcas = [];
  filas.forEach((fila, i) => {
    if (!String(fila[0]).startsWith('ID')) return;   // fila "ID : 2 ... Name : nerina ..."
    const persona = {
      id: String(fila[2]).trim(),
      nombre: String(fila[10]).trim(),
      sector: String(fila[20]).trim(),
      equipo: '',
    };
    // La fila siguiente tiene las marcas de cada día
    (filas[i + 1] || []).forEach((celda, col) => {
      const fecha = `${anio}-${pad(mes)}-${pad(filaDias[col])}`;
      horasDeCelda(celda).forEach((min) => marcas.push({ ...persona, fecha, min }));
    });
  });
  return marcas;
}

// ---------- Detección automática del formato ----------
export function detectarFormato(libro) {
  if (libro.SheetNames.includes('Logs')) {
    return { nombre: 'Formato B (hoja Logs)', leer: leerFormatoB };
  }

  const primera = filasDe(libro.Sheets[libro.SheetNames[0]]);
  const cabecera = (primera[0] || []).map((c) => String(c).trim());

  if (cabecera.includes('Fecha/Hora') && cabecera.includes('ID de usuario')) {
    return { nombre: 'ANVIZ – registros', leer: leerAnviz };
  }
  if (String(primera[0]?.[0]).includes('Reporte diario de registros')) {
    throw new Error('Este es el "Reporte diario" de CrossChex, que no trae el ID real de cada persona. Exportá el listado de registros (una fila por marca).');
  }
  throw new Error('Formato no reconocido. Se admiten: ANVIZ/CrossChex (listado de registros) y el reporte con hoja "Logs".');
}
