import { expect, test } from '@playwright/test';
import { vigilarErrores } from './utils.js';

test('del footer a herramientas, a control de horas y de vuelta al sitio', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.goto('./');
  await page.getByRole('link', { name: 'Acceso personal · Herramientas →' }).click();
  await expect(page).toHaveURL(/\/ailaacc-sitio\/herramientas$/);
  await expect(page).toHaveTitle('Herramientas – AILAACC');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');

  await page.getByRole('link', { name: /Control de horas/ }).click();
  await expect(page).toHaveURL(/\/herramientas\/control-horas$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Control de horas');
  await expect(page).toHaveTitle('Control de horas – AILAACC');

  await page.getByRole('link', { name: 'Volver al sitio' }).first().click();
  await expect(page).toHaveURL(/\/ailaacc-sitio\/$/);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page).toHaveTitle('AILAACC Chaco');
  sinErrores();
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

test('la landing no descarga las librerías de Excel', async ({ page }) => {
  const scripts = [];
  page.on('request', (r) => { if (r.resourceType() === 'script') scripts.push(r.url()); });
  await page.goto('./');
  await page.waitForLoadState('networkidle');
  expect(scripts.some((u) => u.includes('ControlHoras'))).toBe(false);
  await page.getByRole('link', { name: 'Acceso personal · Herramientas →' }).click();
  await page.getByRole('link', { name: /Control de horas/ }).click();
  await expect(page.locator('#zona')).toBeVisible();
  expect(scripts.some((u) => u.includes('ControlHoras'))).toBe(true);
});
