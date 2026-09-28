import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import ExcelJS from 'exceljs';
import { vigilarErrores } from './utils.js';

const fixture = (n) => fileURLToPath(new URL(`./fixtures/${n}`, import.meta.url));
// Los extractos de prueba usan CUIT ficticios para titular e hija: con las reglas reales (que solo tienen las
// huellas de los CUIT verdaderos) esos créditos cuentan como ingresos, salvo que el concepto diga "Mismo Titular".
const item = (page, nombre) => page.locator('#lista .item').filter({ has: page.getByRole('heading', { name: nombre, exact: true }) });

test('desde el listado se abre la herramienta de extractos', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.goto('./herramientas');
  await expect(page.locator('.tools-grid .hcard')).toHaveCount(2);
  await expect(page.locator('.tool-badge')).toHaveText(['Beta']);
  await page.getByRole('link', { name: /Extractos bancarios/ }).click();
  await expect(page).toHaveURL(/\/herramientas\/extractos-bancarios$/);
  await expect(page).toHaveTitle('Extractos bancarios – AILAACC');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Procesamiento de extractos bancarios');
  await expect(page.locator('#archivos')).toHaveAttribute('accept', '.xlsx');
  await expect(page.getByRole('note', { name: 'Versión beta' })).toBeVisible();
  sinErrores();
});

test('procesa los extractos de los cuatro bancos, en orden, y rechaza los que no corresponden', async ({ page }) => {
  await page.goto('./herramientas/extractos-bancarios');
  const archivos = ['extracto-santander.xlsx', 'extracto-credicoop.xlsx', 'extracto-nbch-ca.xlsx', 'extracto-nbch-cc.xlsx',
    'extracto-frances.xlsx', 'extracto-saldo-alterado.xlsx', 'invalido.xlsx'];
  await page.locator('#archivos').setInputFiles(archivos.map(fixture));
  await expect(page.locator('#lista .item h2')).toHaveText([...archivos].reverse());
  await expect(page.locator('#lista .item .meta')).toHaveText([
    /^No se reconoce el formato del extracto\. Bancos soportados: Santander, NBCH, Credicoop, Francés\.$/,
    /^Los saldos del extracto no cierran/,
    'Frances · 01/07/2026 al 31/07/2026 · 5 movimientos · el banco no informa saldos',
    'NBCH · 02/07/2026 al 31/07/2026 · 11 movimientos · saldos verificados',
    'NBCH · 01/07/2026 al 31/07/2026 · 16 movimientos · saldos verificados',
    'Credicoop · 02/07/2026 al 31/07/2026 · 14 movimientos · saldos verificados',
    'Santander · 02/07/2026 al 31/07/2026 · 14 movimientos · saldos verificados',
  ]);
  const chips = (n) => item(page, n).locator('.chip').allTextContents();
  expect((await chips('extracto-nbch-ca.xlsx')).map((t) => t.replace(/\s/g, ' '))).toEqual([
    '5 ingresos · $ 5.660.000,35', '3 gastos bancarios · $ 19.174,90', '5 créditos excluidos (traspasos y otros)',
  ]);
  await expect(item(page, 'extracto-saldo-alterado.xlsx').getByRole('button')).toHaveCount(0);
});

test('el Excel descargado tiene las hojas Ingresos y Gastos con los datos correctos', async ({ page }) => {
  await page.goto('./herramientas/extractos-bancarios');
  await page.locator('#archivos').setInputFiles(fixture('extracto-santander.xlsx'));
  const it = item(page, 'extracto-santander.xlsx');
  const [descarga] = await Promise.all([page.waitForEvent('download'), it.getByRole('button', { name: 'Descargar Excel' }).click()]);
  expect(descarga.suggestedFilename()).toBe('extracto-santander_resumen.xlsx');
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(readFileSync(await descarga.path()));
  const filas = (hoja) => wb.getWorksheet(hoja).getSheetValues().slice(2).map((r) => r.slice(1).map((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v)));
  expect(filas('Ingresos')).toEqual([
    ['2026-07-01', '2026-07-02', 481663, 'Santander', '30711111111'],
    ['2026-07-01', '2026-07-14', 682187.06, 'Santander', '30722222225'],
    ['2026-07-01', '2026-07-17', 500000, 'Santander', '27111111117'],   // titular FICTICIA: las reglas reales no la conocen
    ['2026-07-01', '2026-07-27', 236174.58, 'Santander', '30733333339'],
  ]);
  expect(filas('Gastos').map((f) => f.slice(2, 5))).toEqual([
    [22741.66, 'Santander', 'IVA sobre comisiones'], [26862.21, 'Santander', 'Intereses'],
    [5289.26, 'Santander', 'Comisiones'], [76142.15, 'Santander', 'Comisiones'], [30000, 'Santander', 'Impuesto al Débito'],
  ]);
  expect(wb.getWorksheet('Ingresos').getCell('A2').numFmt).toBe('mmm-yyyy');
});

test('la herramienta de extractos no carga el código de Control de horas', async ({ page }) => {
  const scripts = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('./herramientas/extractos-bancarios');
  await expect(page.locator('#zona')).toBeVisible();
  expect(scripts.some((u) => u.includes('ControlHoras'))).toBe(false);
  expect(scripts.some((u) => u.includes('ExtractosBancarios'))).toBe(true);
});
