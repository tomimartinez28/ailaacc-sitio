// Genera extractos bancarios de prueba con datos FICTICIOS, imitando el formato de cada banco.
// Uso: node e2e/fixtures/generar-extractos.mjs
// Todos los CUIT de personas son inventados (con dígito verificador válido). Los de empresas que están en
// las reglas (InvertirOnline y los CUIT fijos) son los reales porque son parte de la configuración pública.
import * as XLSX from 'xlsx';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

// CUIT inventado con dígito verificador correcto
function cuit(base10) {
  const pesos = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let dv = 11 - (pesos.reduce((a, p, i) => a + p * Number(base10[i]), 0) % 11);
  if (dv === 11) dv = 0;
  if (dv === 10) dv = 9;
  return base10 + dv;
}
export const CUIT = {
  osUno: cuit('3071111111'), osDos: cuit('3072222222'), osTres: cuit('3073333333'),
  osCuatro: cuit('3074444444'), osCinco: cuit('3075555555'), persona: cuit('2033333333'),
  titular: cuit('2711111111'), hija: cuit('2722222222'), iol: '33707852459',
};

const guardar = (nombre, filas) => {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(filas), 'Hoja1');
  writeFileSync(join(dir, nombre), XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }));
};
const serial = (d, m) => Date.UTC(2026, m - 1, d) / 86400000 + 25569;
const texto = (d, m) => `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/2026`;
const r2 = (n) => Math.round(n * 100) / 100;

// Encadena saldos: movimientos en orden cronológico [dia, concepto, importe, ...extra]
function conSaldos(saldoInicial, movs) {
  let s = saldoInicial;
  return movs.map((m) => { s = r2(s + m[2]); return [...m, s]; });
}

// ---------- Credicoop: Débito/Crédito, fecha texto, más nuevo arriba ----------
function credicoop(nombre, { romperSaldo = false } = {}) {
  const movs = conSaldos(1000000, [
    [2, `Transf. Recibida o/Banco-Dist. Titular PROVEED-${CUIT.osUno}-CUENTAFICTICIA`, 250000.5],
    [2, 'Impuesto Ley 25.413 Ali Gral s/Creditos', -1500.0],
    [5, `Transf. Interbanking - Distinto Titular Ord.:${CUIT.osDos}-OBRA SOCIAL FICTICIA`, 120000],
    [5, 'Impuesto Ley 25.413 Ali Gral s/Creditos', -720],
    [9, `Transf. Inmediata e/Ctas. Dist. Titular ${CUIT.osTres}-FAC-OBRA SOCIAL TRES CBU Origen: 0110599520000055518882`, 80000],
    [12, 'Transf.Inmediata e/Ctas.Igual Tit.O/Bco 0000001-VAR-TITULAR FICTICIA', -300000],
    [12, 'Impuesto Ley 25.413 Ali Gral s/Debitos', -1800],
    [15, 'Debito/Credito Aut - Segurcoop Comercio SEGUR.SOCIO-123', -5000],
    [15, 'Suscripcion al Periodico Accion', -2000],
    [20, 'Comision por Transferencia B. INTERNET COM. USO-0001', -500],
    [20, 'Servicio acreditaciones automaticas SERV ACRED AUTOMATIC-0001', -30],
    [31, 'Com. mantenimiento cuenta', -65000],
    [31, 'Mantenimiento TJ Precargada', -4375],
    [31, 'IVA - Alicuota Exento', -r2((65000 + 4375 + 500 + 30) * 0.21)],
  ]);
  const filas = movs.reverse().map(([d, c, imp, s]) => [texto(d, 7), c, imp < 0 ? -imp : 0, imp > 0 ? imp : 0, s, '']);
  if (romperSaldo) filas[5][4] += 100;   // saldo alterado a mano
  guardar(nombre, [['Fecha', 'Concepto', 'Débito', 'Crédito', 'Saldo', 'Notas'], ...filas]);
}

// ---------- NBCH Caja de ahorro: fecha como número de Excel, créditos en columna sin título ----------
function nbchCA() {
  const movs = conSaldos(5000000, [
    [1, 'Crédito Depósito Cheque Cámara. Nro. Cheque: 1234567', 900000],
    [1, 'Rechazo Depósito Cheque Cámara. Nro. Cheque: 1234567', -900000],
    [1, 'Comisión Gestión Depósito Cheque de Terceros', -14690],
    [1, 'IVA sobre comisiones', -3084.9],
    [2, `Crédito por Transferencia Cámara ${CUIT.osCuatro} OBRA`, 350000.25],
    [3, 'Crédito Depósito Cheque Cámara. Nro. Cheque: 7654321', 150000],
    [6, `Transferencia inmediata Mismo Titular ${CUIT.titular}`, 2000000],
    [7, `Transferencia inmediata Distinto Titul ${CUIT.iol}`, 1000000],
    [8, `Transferencia inmediata Distinto Titul ${CUIT.hija}`, 50000],
    [8, 'Crédito por Sentencia Judicial', 1892.39],
    [10, `Transferencia inmediata Distinto Titul ${CUIT.persona}`, -120000],
    [24, 'Pago Electrónico del Estado', 4500000],
    [27, `Transferencia debin Distinto Titular ${CUIT.osCinco} T`, 610000.1],
    [28, 'Pagos Efectuados Por Link', -40000],
    [30, 'Comisión Mantenimiento Convenios', -1400],
    [31, 'Rendimientos Obtenidos', 3030.88],
  ]);
  const filas = movs.map(([d, c, imp, s]) => ['CA $ 0000100000000001', serial(d, 7), imp < 0 ? imp : '', imp > 0 ? imp : '', c, s, '']);
  guardar('extracto-nbch-ca.xlsx', [['Cuenta', 'Fecha', 'Monto', '', 'Descripción', 'Saldo', 'Notas'], ...filas]);
}

// ---------- NBCH Cuenta corriente: monto con signo, saldo negativo (descubierto) ----------
function nbchCC() {
  const movs = conSaldos(-300000, [
    [2, 'Pago Cheque de Cámara. Nro. Cheque: 5555555', -200000],
    [2, 'Impuesto al Débito Ley 25413', -1200],
    [6, 'CARGO SEGURO SD', -323.22],
    [6, 'Impuesto al Débito Ley 25413', -1.94],
    [21, `Transferencia inmediata Distinto Titul ${CUIT.hija}`, 500000],
    [21, 'Impuesto al Crédito Ley 25413', -3000],
    [27, `Transferencia inmediata Mismo Titular ${CUIT.titular}`, 1000000],
    [31, 'Mantenimiento de cuenta', -64000],
    [31, 'IVA sobre comisiones', -13440],
    [31, 'Cobro Intereses Deudores N Acuerdos', -41670.47],
    [31, 'IVA sobre intereses', -8750.8],
  ]);
  const filas = movs.map(([d, c, imp, s]) => ['CC $ 0000100000000002', serial(d, 7), imp, c, s, '']);
  guardar('extracto-nbch-cc.xlsx', [['Cuenta', 'Fecha', 'Monto', 'Descripción', 'Saldo', 'Notas'], ...filas]);
}

// ---------- Santander Cuenta Única: 13 filas de título, importes CA/CC, textos con punto decimal ----------
function santander() {
  // [dia, concepto, importe, columna 'ca'|'cc', como texto]
  const movs = conSaldos(-470000, ([
    [2, `Pago a proveedores recibido \t Obra social ficticia uno    ${CUIT.osUno} 03 7711160`, 481663, 'ca'],
    [3, 'Transferencia recibida \t De invertironline s.a.    / var          - var / ' + CUIT.iol, 2000000, 'ca'],
    [7, 'Pago interes por saldo en cuenta \t Del 01/06/26 al 30/06/26', 149.94, 'ca'],
    [11, 'Bonificacion promocion \t 30% de ahorro en pedidosya plus', 3330, 'ca'],
    [14, `Transferencia recibida \t De obra soc ficticia  / 9184         - fac / ${CUIT.osDos}`, 682187.06, 'ca'],
    [17, `Transferencia recibida \t De titular ficticia       /              - var / ${CUIT.titular}`, 500000, 'ca'],
    [22, 'Rescate fondos comunes inversion \t ', 600810.71, 'ca'],
    [27, `Pago a proveedores recibido \t Cta discapacida      ${CUIT.osTres} 202 62700650043`, 236174.58, 'ca'],
    [28, `Transferencia realizada \t A persona ficticia        / varios       - var / ${CUIT.persona}`, -100000, 'ca'],
    [30, 'Comision por servicio de cuenta', -76142.15, 'cc', true],
    [30, 'Comision por sorpresa santander \t Adhesion a programa de beneficios', -5289.26, 'cc', true],
    [30, 'Cobro de interes por descubierto \t Del 01/07/26 al 31/07/26', -26862.21, 'cc', true],
    [30, 'Iva 21% reg de transfisc ley27743', -r2((76142.15 + 5289.26 + 26862.21) * 0.21), 'cc', true],
    [31, 'Impuesto ley 25.413 debito 0,6% \t ', -30000, 'cc', true],
  ]).map(([d, c, imp, col, comoTexto = false]) => [d, c, imp, col, comoTexto]));
  const filas = movs.reverse().map(([d, c, imp, col, comoTexto, s]) => {
    const v = comoTexto ? imp.toFixed(2) : imp;
    return [texto(d, 7), c, '00000001', col === 'ca' ? v : '', col === 'cc' ? v : '', comoTexto ? s.toFixed(2) : s, ''];
  });
  const vacia = ['', '', '', '', '', '', ''];
  guardar('extracto-santander.xlsx', [
    vacia, vacia, ['', '', '', '', '', 'viernes, 14 de agosto de 2026 - 10:43', ''], vacia, vacia, vacia,
    ['Cuenta', 'Cuenta única 000-000000/0', '', '', '', '', ''], ['Moneda', 'Pesos', '', '', '', '', ''],
    ['Fecha', '01/07/2026 - 31/07/2026', '', '', '', '', ''], vacia, vacia, ['Últimos movimientos', '', '', '', '', '', ''], vacia,
    ['Fecha', 'Descripción', 'Referencia', 'Caja de Ahorro', 'Cuenta Corriente', 'Saldo', 'Saldo'],
    ...filas,
  ]);
}

// ---------- Francés / BBVA: título en la primera fila, importes texto formato argentino, sin saldo ----------
function frances() {
  const ar = (n) => n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const movs = [
    [31, 'Transferencia inmediata', '100 - BANCA ONLINE', -96447.84],
    [23, 'PAGO A PROVEEDORES OP.5655274', '587 - DATANET', 6202747.94],
    [20, 'PAGO A PROVEEDORES OP.5060816', '587 - DATANET', 8334826.46],
    [15, 'PAGO CON VISA DEBITO 1234 OP123', '100 - BANCA ONLINE', -59543.07],
    [1, 'INTERESES GANADOS', '295 - SUCURSAL', 143.84],
  ];
  guardar('extracto-frances.xlsx', [
    ['Detalle de Movimientos de Cuenta: CA$ 000-000000/0', '', '', '', ''],
    ['Fecha', 'Concepto', '', 'Importe', 'Notas'],
    ...movs.map(([d, c, o, imp]) => [texto(d, 7), c, o, ar(imp), '']),
  ]);
}

credicoop('extracto-credicoop.xlsx');
credicoop('extracto-saldo-alterado.xlsx', { romperSaldo: true });
nbchCA();
nbchCC();
santander();
frances();
console.log('extractos ficticios generados en', dir);
