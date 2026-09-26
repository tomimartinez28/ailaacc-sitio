import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { capturarWindowOpen, vigilarErrores } from './utils.js';
import { CONTACTO, REDES, WHATSAPP_NUMBER } from '../src/data/institucion.js';

// Corre contra el build con VITE_LANDING_PUBLICA=false (el que se publica mientras la landing está oculta)

test('la página de inicio muestra "Sitio en construcción" y no la landing', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.goto('./');
  await expect(page).toHaveTitle('AILAACC Chaco — Sitio en construcción');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Estamos preparando nuestro nuevo sitio.');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  for (const id of ['nosotros', 'servicios', 'sedes', 'contacto']) await expect(page.locator('#' + id)).toHaveCount(0);
  await expect(page.locator('.nav-links')).toHaveCount(0);
  expect(await page.locator('.en-construccion-logo').evaluate((i) => i.complete && i.naturalWidth)).toBeGreaterThan(0);
  const [scroll, ancho] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(scroll).toBeLessThanOrEqual(ancho);
  sinErrores();
});

test('los medios de contacto funcionan', async ({ page }) => {
  const abiertos = await capturarWindowOpen(page);
  await page.goto('./');
  await page.getByRole('button', { name: 'Escribinos por WhatsApp' }).click();
  expect((await abiertos())[0][0]).toBe(`https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent('Hola AILAACC, quisiera consultar por sus servicios.'));
  await expect(page.getByRole('link', { name: CONTACTO.telefono.texto })).toHaveAttribute('href', CONTACTO.telefono.href);
  for (const r of REDES) {
    await expect(page.getByRole('link', { name: r.red })).toHaveAttribute('href', r.url);
    await expect(page.getByRole('link', { name: r.red })).toHaveAttribute('target', '_blank');
  }
});

test('el personal llega a las herramientas y la herramienta funciona', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('link', { name: 'Acceso personal · Herramientas →' }).click();
  await expect(page).toHaveURL(/\/herramientas$/);
  await page.getByRole('link', { name: /Control de horas/ }).click();
  await page.locator('#archivos').setInputFiles(fileURLToPath(new URL('./fixtures/anviz.xlsx', import.meta.url)));
  await expect(page.locator('#lista .item .meta')).toHaveText('ANVIZ – registros · 3 personas · 128 marcas');
  await page.getByRole('link', { name: 'Volver al sitio' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Estamos preparando nuestro nuevo sitio.');
});

test('las direcciones viejas de la landing también muestran la página provisoria', async ({ page }) => {
  for (const url of ['./#contacto', './cualquier-cosa']) {
    await page.goto(url);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Estamos preparando nuestro nuevo sitio.');
  }
});

// Playwright exige desestructurar el primer parámetro aunque no se use ningún fixture
// eslint-disable-next-line no-empty-pattern
test('el código de la landing no está en los archivos publicados', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'en-construccion', 'basta con revisarlo una vez');
  const dir = fileURLToPath(new URL('../dist-e2e/construccion/assets/', import.meta.url));
  const archivos = readdirSync(dir).filter((f) => f.endsWith('.js'));
  expect(archivos.some((f) => f.startsWith('HomePage'))).toBe(false);
  const contenido = archivos.map((f) => readFileSync(dir + f, 'utf8')).join('\n');
  for (const texto of ['Cinco áreas de trabajo', 'Presentes en seis localidades', 'Consultar por esta sede', 'Un equipo interdisciplinario', 'Propuesta pedagógica', '+370 alumnos', 'Mariano Moreno 551']) {
    expect(contenido, texto).not.toContain(texto);
  }
});
