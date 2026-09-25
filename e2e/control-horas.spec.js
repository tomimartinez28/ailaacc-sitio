import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { volcarExcel } from './excel.js';
import { vigilarErrores } from './utils.js';

const fixture = (n) => fileURLToPath(new URL(`./fixtures/${n}`, import.meta.url));
const item = (page, nombre) => page.locator('#lista .item').filter({ has: page.getByRole('heading', { name: nombre, exact: true }) });

test.beforeEach(async ({ page }) => { await page.goto('./herramientas/control-horas'); });

test('procesa un reporte ANVIZ y descarga el Excel', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.locator('#archivos').setInputFiles(fixture('anviz.xlsx'));
  const it = item(page, 'anviz.xlsx');
  await expect(it.locator('.meta')).toHaveText('ANVIZ – registros · 3 personas · 128 marcas');
  await expect(it.locator('.chip.impar')).toHaveText('2 días a completar');
  await expect(it.locator('.chip.dup')).toHaveText('2 marcas duplicadas');

  const [descarga] = await Promise.all([page.waitForEvent('download'), it.getByRole('button', { name: 'Descargar Excel' }).click()]);
  expect(descarga.suggestedFilename()).toBe('anviz_horas.xlsx');
  const excel = await volcarExcel(readFileSync(await descarga.path()));
  expect(excel.hojas.map((h) => h.nombre)).toEqual(['Resumen', 'Incidencias', '3 Persona OFicticia Tres con no', '7 Persona Ficticia Uno', '12 Persona Ficticia Dos']);
  sinErrores();
});

test('varios archivos a la vez: se procesan en orden y el último queda arriba', async ({ page }) => {
  await page.locator('#archivos').setInputFiles([fixture('anviz.xls'), fixture('formato-b.xlsx'), fixture('invalido.xlsx')]);
  await expect(page.locator('#lista .item h2')).toHaveText(['invalido.xlsx', 'formato-b.xlsx', 'anviz.xls']);
  await expect(item(page, 'anviz.xls').locator('.meta')).toHaveText('ANVIZ – registros · 3 personas · 128 marcas');
  await expect(item(page, 'formato-b.xlsx').locator('.meta')).toHaveText(/^Formato B \(hoja Logs\) · 2 personas · \d+ marcas$/);
  await expect(item(page, 'invalido.xlsx').locator('.meta.err')).toHaveText(/^Formato no reconocido\./);
  await expect(item(page, 'invalido.xlsx').getByRole('button')).toHaveCount(0);
});

test('se puede volver a elegir el mismo archivo', async ({ page }) => {
  await page.locator('#archivos').setInputFiles(fixture('anviz.xlsx'));
  await expect(page.locator('#lista .item .chips')).toHaveCount(1);
  await page.locator('#archivos').setInputFiles(fixture('anviz.xlsx'));
  await expect(page.locator('#lista .item .chips')).toHaveCount(2);
});

test('arrastrar y soltar', async ({ page }) => {
  const bytes = [...readFileSync(fixture('anviz.xlsx'))];
  const dt = await page.evaluateHandle((b) => {
    const d = new DataTransfer();
    d.items.add(new File([new Uint8Array(b)], 'soltado.xlsx'));
    return d;
  }, bytes);
  await page.dispatchEvent('#zona', 'dragenter', { dataTransfer: dt });
  await expect(page.locator('#zona')).toHaveClass(/sobre/);
  await page.dispatchEvent('#zona', 'drop', { dataTransfer: dt });
  await expect(page.locator('#zona')).not.toHaveClass(/sobre/);
  await expect(item(page, 'soltado.xlsx').locator('.meta')).toHaveText('ANVIZ – registros · 3 personas · 128 marcas');
});

// ---------- Comparación contra la versión HTML anterior (rama main) ----------
const BASELINE = process.env.BASELINE_URL;

test.describe('mismo Excel que la versión anterior', () => {
  test.skip(!BASELINE, 'definir BASELINE_URL para comparar con la versión HTML');

  async function excelDe(page, url, archivo) {
    await page.goto(url);
    await page.locator('#archivos').setInputFiles(fixture(archivo));
    const it = item(page, archivo);
    await expect(it.getByRole('button', { name: 'Descargar Excel' })).toBeVisible();
    const textos = await it.locator('.meta, .chip').allTextContents();
    const [descarga] = await Promise.all([page.waitForEvent('download'), it.getByRole('button', { name: 'Descargar Excel' }).click()]);
    return { textos, nombre: descarga.suggestedFilename(), excel: await volcarExcel(readFileSync(await descarga.path())) };
  }

  for (const archivo of ['anviz.xlsx', 'anviz.xls', 'formato-b.xlsx']) {
    test(archivo, async ({ page }) => {
      const nuevo = await excelDe(page, './herramientas/control-horas', archivo);
      const viejo = await excelDe(page, BASELINE + 'control-horas.html', archivo);
      expect(nuevo.textos).toEqual(viejo.textos);
      expect(nuevo.nombre).toBe(viejo.nombre);
      expect(nuevo.excel.hojas.length).toBeGreaterThan(2);
      expect(nuevo.excel).toEqual(viejo.excel);
    });
  }

  test('mismo mensaje de error para un archivo inválido', async ({ page }) => {
    const leer = async (url) => {
      await page.goto(url);
      await page.locator('#archivos').setInputFiles(fixture('invalido.xlsx'));
      return item(page, 'invalido.xlsx').locator('.meta.err').textContent();
    };
    expect(await leer('./herramientas/control-horas')).toBe(await leer(BASELINE + 'control-horas.html'));
  });
});
