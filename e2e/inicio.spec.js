import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { expect, test } from '@playwright/test';
import { vigilarErrores } from './utils.js';

// Corre contra el build que se publica hoy (VITE_INICIO=herramientas)

test('"/" lleva directo a las herramientas', async ({ page }) => {
  const sinErrores = vigilarErrores(page);
  await page.goto('./');
  await expect(page).toHaveURL(/\/ailaacc-sitio\/herramientas$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Herramientas del personal');
  sinErrores();
});

test('las direcciones de la landing también llevan a las herramientas', async ({ page }) => {
  for (const url of ['./#contacto', './cualquier-cosa', './control-horas.html']) {
    await page.goto(url);
    await expect(page).toHaveURL(/\/herramientas(\/control-horas)?$/);
  }
});

test('sin sitio público, no se ofrece "Volver al sitio"', async ({ page }) => {
  await page.goto('./herramientas/control-horas');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Control de horas');
  await expect(page.getByText('Volver al sitio')).toHaveCount(0);
  await page.locator('.brand').click();
  await expect(page).toHaveURL(/\/herramientas$/);
});

// Playwright exige desestructurar el primer parámetro aunque no se use ningún fixture
// eslint-disable-next-line no-empty-pattern
test('el código de la landing y de la página provisoria no está en los archivos publicados', async ({}, testInfo) => {
  test.skip(testInfo.project.name !== 'herramientas', 'basta con revisarlo una vez');
  const dir = fileURLToPath(new URL('../dist-e2e/herramientas/assets/', import.meta.url));
  const archivos = readdirSync(dir).filter((f) => f.endsWith('.js'));
  expect(archivos.filter((f) => /^(HomePage|SiteLayout|EnConstruccion)/.test(f))).toEqual([]);
  const contenido = archivos.map((f) => readFileSync(dir + f, 'utf8')).join('\n');
  for (const texto of ['Cinco áreas de trabajo', 'Presentes en seis localidades', 'Consultar por esta sede', 'Estamos preparando', '+370 alumnos']) {
    expect(contenido, texto).not.toContain(texto);
  }
});
