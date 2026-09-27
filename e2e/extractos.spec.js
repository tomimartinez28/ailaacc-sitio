import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { vigilarErrores } from './utils.js';

const fixture = (n) => fileURLToPath(new URL(`./fixtures/${n}`, import.meta.url));

test('desde el listado se abre la herramienta de extractos', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.goto('./herramientas');
  await expect(page.locator('.tools-grid .hcard')).toHaveCount(2);
  const tarjeta = page.getByRole('link', { name: /Extractos bancarios/ });
  await expect(tarjeta.locator('.tool-badge')).toHaveText('En desarrollo');
  await tarjeta.click();
  await expect(page).toHaveURL(/\/herramientas\/extractos-bancarios$/);
  await expect(page).toHaveTitle('Extractos bancarios – AILAACC');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Procesamiento de extractos bancarios');
  await expect(page.getByRole('note')).toContainText('Herramienta en desarrollo');
  await expect(page.locator('.nota-titulo')).toHaveText('Qué contiene el Excel');
  sinErrores();
});

test('al subir extractos, cada uno muestra el aviso de que todavía no se procesa', async ({ page }) => {
  await page.goto('./herramientas/extractos-bancarios');
  await page.locator('#archivos').setInputFiles([fixture('anviz.xlsx'), fixture('invalido.xlsx')]);
  await expect(page.locator('#lista .item h2')).toHaveText(['invalido.xlsx', 'anviz.xlsx']);
  await expect(page.locator('#lista .item .meta.err')).toHaveText([
    'Esta herramienta todavía está en desarrollo: aún no procesa extractos.',
    'Esta herramienta todavía está en desarrollo: aún no procesa extractos.',
  ]);
});

test('la herramienta de extractos no carga el código de Control de horas', async ({ page }) => {
  const scripts = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('./herramientas/extractos-bancarios');
  await expect(page.locator('#zona')).toBeVisible();
  expect(scripts.some((u) => u.includes('ControlHoras'))).toBe(false);
  expect(scripts.some((u) => u.includes('ExtractosBancarios'))).toBe(true);
});
