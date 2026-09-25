import { expect } from '@playwright/test';

// Reemplaza window.open para registrar lo que se abriría (WhatsApp) sin salir de la página
export async function capturarWindowOpen(page) {
  await page.addInitScript(() => {
    window.__abiertos = [];
    window.open = (...args) => { window.__abiertos.push(args); return null; };
  });
  return async () => page.evaluate(() => window.__abiertos);
}

// Falla el test si la página tira errores de consola o excepciones
export function vigilarErrores(page) {
  const errores = [];
  page.on('pageerror', (e) => errores.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  return () => expect(errores, 'errores en la consola').toEqual([]);
}
