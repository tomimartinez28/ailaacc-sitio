import { expect, test } from '@playwright/test';
import { vigilarErrores } from './utils.js';

// La landing es otro proyecto (ailaacc-landing): acá "/" y cualquier dirección desconocida llevan a las herramientas.

test('"/" lleva directo a las herramientas', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.goto('./');
  await expect(page).toHaveURL(/\/ailaacc-sitio\/herramientas$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Herramientas del personal');
  await expect(page).toHaveTitle('Herramientas – AILAACC');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  sinErrores();
});

test('las direcciones viejas de la landing y las desconocidas llevan a las herramientas', async ({ page }) => {
  for (const url of ['./#contacto', './cualquier-cosa']) {
    await page.goto(url);
    await expect(page).toHaveURL(/\/herramientas$/);
  }
});

test('la marca del header vuelve al listado y no se ofrece "Volver al sitio"', async ({ page }) => {
  await page.goto('./herramientas/control-horas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Control de horas');
  await expect(page.getByText('Volver al sitio')).toHaveCount(0);
  await page.locator('.brand').click();
  await expect(page).toHaveURL(/\/herramientas$/);
});

test('entrar directo (o recargar) una ruta interna funciona', async ({ page }) => {
  await page.goto('./herramientas/control-horas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Control de horas');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Control de horas');
});

test('la dirección de la versión anterior redirige a la herramienta', async ({ page }) => {
  await page.goto('./control-horas.html');
  await expect(page).toHaveURL(/\/herramientas\/control-horas$/);
});

test('el listado no descarga las librerías de Excel hasta abrir una herramienta', async ({ page }) => {
  const scripts = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('./herramientas');
  await page.waitForLoadState('networkidle');
  expect(scripts.some((u) => u.includes('ControlHoras'))).toBe(false);
  await page.getByRole('link', { name: /Control de horas/ }).click();
  await expect(page.locator('#zona')).toBeVisible();
  expect(scripts.some((u) => u.includes('ControlHoras'))).toBe(true);
});
