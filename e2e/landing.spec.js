import { expect, test } from '@playwright/test';
import { capturarWindowOpen, vigilarErrores } from './utils.js';

test.describe('landing', () => {
  test('carga completa, sin errores y con todas las secciones', async ({ page }) => {
    const sinErrores = vigilarErrores(page);
    await page.goto('./');
    await expect(page).toHaveTitle('AILAACC Chaco');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Acompañamos a las personas con discapacidad, en cada etapa.');
    for (const id of ['inicio', 'nosotros', 'servicios', 'sedes', 'contacto']) await expect(page.locator('#' + id)).toBeAttached();
    await expect(page.locator('.serv-card')).toHaveCount(6);
    await expect(page.locator('.sede-item')).toHaveCount(6);
    expect(await page.locator('.brand img').evaluate((i) => i.complete && i.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator('.hero-cards .hcard')).toHaveCount(3);
    await expect(page.locator('.hero-cards .hcard h3')).toHaveText(['Centro Educativo Terapéutico', 'Integración Escolar', 'Estimulación Temprana']);
    await expect(page.locator('.hero-trust > span')).toHaveText([
      '6 sedes en la provincia del Chaco', '+370 alumnos', '+160 colaboradores', '+10 años de experiencia',
    ]);
    sinErrores();
  });

  test('el menú lleva a cada sección y marca la activa', async ({ page, isMobile, viewport }) => {
    await page.goto('./');
    if (viewport.width <= 860) {
      await page.getByRole('button', { name: 'Abrir menú' }).click();
      await expect(page.locator('#mobile-panel')).toBeVisible();
      await page.locator('#mobile-panel').getByRole('link', { name: 'Sedes' }).click();
      await expect(page.locator('#mobile-panel')).toBeHidden();
    } else {
      await page.locator('.nav-links').getByRole('link', { name: 'Sedes' }).click();
      await expect(page.locator('.nav-links a.active')).toHaveText('Sedes');
    }
    await expect(page).toHaveURL(/#sedes$/);
    await expect(page.locator('#sedes h2')).toBeInViewport();
    void isMobile;
  });

  test('mapa y acordeón de sedes sincronizados', async ({ page }) => {
    await page.goto('./#sedes');
    const item = (n) => page.locator(`.sede-item[data-sede="${n}"]`);
    await expect(item('saenz-pena')).toHaveClass(/active/);
    await page.locator('.map-pin[data-sede="villa-angela"]').click();
    await expect(item('villa-angela')).toHaveClass(/active/);
    await expect(item('saenz-pena')).not.toHaveClass(/active/);
    await expect(item('villa-angela').getByText('(3735) 42-0000 · WhatsApp disponible')).toBeVisible();
    await page.locator('.map-pin[data-sede="charata"]').focus();
    await page.keyboard.press('Enter');
    await expect(item('charata')).toHaveClass(/active/);
    await item('charata').getByRole('button').click();
    await expect(page.locator('.sede-item.active')).toHaveCount(0);
  });

  test('los CTA preseleccionan sede y motivo, y el formulario abre WhatsApp', async ({ page }) => {
    const abiertos = await capturarWindowOpen(page);
    await page.goto('./#sedes');
    await page.locator('.sede-item[data-sede="quitilipi"] .sede-head').click();
    await page.locator('.sede-item[data-sede="quitilipi"]').getByRole('link', { name: 'Consultar por esta sede' }).click();
    await expect(page).toHaveURL(/#contacto$/);
    await expect(page.getByLabel('Sede de interés')).toHaveValue('Quitilipi');

    await page.getByRole('link', { name: 'Enviar CV / postularme' }).click();
    await expect(page.getByLabel('Motivo de la consulta')).toHaveValue('Quiero trabajar en AILAACC (envío de CV)');

    await page.getByLabel('Nombre y apellido').fill('María Gómez');
    await page.getByLabel('Teléfono / WhatsApp').fill('3644 000000');
    await page.getByLabel('Mensaje (opcional)').fill('  Adjunto CV  ');
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();
    await expect(page.locator('#form-status')).toHaveText('Abriendo WhatsApp…');
    const texto = 'Hola AILAACC, soy María Gómez.\nSede de interés: Quitilipi.\nMotivo: Quiero trabajar en AILAACC (envío de CV).\nMi teléfono de contacto: 3644 000000.\nMensaje: Adjunto CV';
    expect(await abiertos()).toEqual([['https://wa.me/5493644000000?text=' + encodeURIComponent(texto), '_blank', 'noopener']]);
  });

  test('el formulario no se envía con campos vacíos', async ({ page }) => {
    const abiertos = await capturarWindowOpen(page);
    await page.goto('./#contacto');
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();
    expect(await page.getByLabel('Nombre y apellido').evaluate((i) => i.validity.valueMissing)).toBe(true);
    await page.getByLabel('Nombre y apellido').fill('   ');
    await page.getByLabel('Teléfono / WhatsApp').fill('123');
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();
    await expect(page.locator('#form-status')).toHaveText('Completá nombre y teléfono para continuar.');
    await expect(page.getByLabel('Nombre y apellido')).toHaveAttribute('aria-invalid', 'true');
    expect(await abiertos()).toEqual([]);
  });

  test('botón flotante de WhatsApp', async ({ page }) => {
    const abiertos = await capturarWindowOpen(page);
    await page.goto('./');
    await page.getByRole('button', { name: 'Escribir por WhatsApp' }).click();
    expect(await abiertos()).toEqual([['https://wa.me/5493644000000?text=' + encodeURIComponent('Hola AILAACC, quisiera consultar por sus servicios.'), '_blank', 'noopener']]);
  });

  test('sin scroll horizontal', async ({ page }) => {
    await page.goto('./');
    const [scroll, ancho] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(scroll).toBeLessThanOrEqual(ancho);
  });
});

test.describe('scroll suave', () => {
  test('las anclas se desplazan con animación', async ({ page }) => {
    await page.goto('./');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('smooth');
    await page.locator('.hero-actions').getByRole('link', { name: 'Ver sedes en el Chaco' }).click();
    // a mitad de camino: el scroll arrancó pero todavía no llegó
    await page.waitForFunction(() => window.scrollY > 0);
    const intermedio = await page.evaluate(() => window.scrollY);
    await expect(page.locator('#sedes h2')).toBeInViewport();
    const final = await page.evaluate(() => window.scrollY);
    expect(intermedio).toBeLessThan(final);
  });

  test('con "reducir movimiento" el salto es inmediato', async ({ browser }) => {
    const page = await browser.newPage({ reducedMotion: 'reduce' });
    await page.goto('http://localhost:4173/ailaacc-sitio/');
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
    await page.close();
  });

  test('al cambiar de página se arranca arriba', async ({ page }) => {
    await page.goto('./#contacto');
    await page.getByRole('link', { name: 'Acceso personal · Herramientas →' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Herramientas del personal');
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  });
});
