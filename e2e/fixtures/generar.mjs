// Genera reportes de prueba con datos FICTICIOS (no hay personas reales).
// Uso: node e2e/fixtures/generar.mjs
import * as XLSX from 'xlsx';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const guardar = (wb, nombre, bookType) => writeFileSync(join(dir, nombre), XLSX.write(wb, { type: 'buffer', bookType }));

// Serial de Excel para "AAAA-MM-DD HH:MM:SS"
const serial = (s) => {
  const [f, h] = s.split(' ');
  const [hh, mm, ss = 0] = h.split(':').map(Number);
  return Date.UTC(...f.split('-').map((n, i) => (i === 1 ? n - 1 : +n))) / 86400000 + 25569 + (hh * 3600 + mm * 60 + +ss) / 86400;
};

// ---------- ANVIZ / CrossChex: una fila por marca ----------
const personas = [
  ['7', 'Persona Ficticia Uno', 'Administración', '1'],
  ['12', 'Persona Ficticia Dos', 'Terapia', '2'],
  ['3', "Persona O'Ficticia Tres con nombre muy largo", 'Transporte', '1'],
];
const marcas = [];
for (let d = 3; d <= 14; d++) {
  const fecha = `2026-08-${String(d).padStart(2, '0')}`;
  const dow = new Date(fecha + 'T00:00:00Z').getUTCDay();
  if (dow === 0) continue;                                // domingos sin marcas
  personas.forEach(([id, nombre, sector, equipo], i) => {
    const horas = dow === 6 ? ['08:00:00', '12:00:00'] : ['07:4' + i + ':07', '12:0' + i + ':00', '14:00:00', '18:3' + i + ':00'];
    if (id === '12' && d === 5) horas.pop();                             // impar
    if (id === '7' && d === 6) horas.splice(1, 0, '07:43:30');           // duplicada (< 5 min)
    if (id === '3' && d === 10) horas.push('18:32:10', '19:15:00');      // duplicada + impar
    horas.forEach((h) => marcas.push([id, nombre, sector, `${fecha} ${h}`, equipo]));
  });
}
const cabecera = ['ID de usuario', 'Nombre', 'Departamento', 'Fecha/Hora', 'Dispositivo Nro.'];
// mitad de las fechas como texto y mitad como número de Excel: el lector soporta ambas
const filas = marcas.map((m, i) => (i % 2 ? [...m.slice(0, 3), serial(m[3]), m[4]] : m));

let wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([cabecera, ...filas]), 'Registros');
guardar(wb, 'anviz.xlsx', 'xlsx');
guardar(wb, 'anviz.xls', 'biff8');   // formato viejo de Excel (usa codepages)

// ---------- Formato B: reporte con hoja "Logs" ----------
const logs = [];
logs.push(['Attendance Record Report']);
logs.push(['Att. Time', '', '2026/09/01 ~ 2026/09/30']);
logs.push(Array.from({ length: 30 }, (_, i) => String(i + 1)));
const filaId = (id, nombre, sector) => {
  const f = Array(21).fill('');
  f[0] = 'ID :'; f[2] = id; f[8] = 'Name :'; f[10] = nombre; f[18] = 'Dept. :'; f[20] = sector;
  return f;
};
logs.push(filaId('2', 'Ficticia Logs A', 'Dirección'));
logs.push(Array.from({ length: 30 }, (_, i) => (i % 7 === 5 ? '' : i === 3 ? '08:01\n08:03\n12:00' : i === 8 ? '07:55' : '07:58\n12:02')));
logs.push(filaId('5', 'Ficticia Logs B', 'Terapia'));
logs.push(Array.from({ length: 30 }, (_, i) => (i % 7 === 6 ? '' : '13:00\n17:30\n17:31')));
wb = XLSX.utils.book_new();
['Stat', 'Logs', 'Abnormal', 'Exceptional'].forEach((n) => {
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(n === 'Logs' ? logs : [['x']]), n);
});
guardar(wb, 'formato-b.xlsx', 'xlsx');

// ---------- Archivo que no es un reporte válido ----------
wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['Columna', 'Otra'], [1, 2]]), 'Hoja1');
guardar(wb, 'invalido.xlsx', 'xlsx');

console.log('fixtures generados en', dir);
