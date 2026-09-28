import { defineConfig } from '@playwright/test';

// E2E sobre builds de producción (vite preview), usando el Google Chrome instalado.
// Se compilan dos versiones: con la landing (puerto 4173) y la que se publica hoy, solo herramientas (4174).
// Comparación con la versión HTML anterior: BASELINE_URL=http://localhost:8801/ npm run test:e2e
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173/ailaacc-sitio/',
    channel: 'chrome',
    acceptDownloads: true,
  },
  projects: [
    // Build con la landing (VITE_INICIO=landing, puerto 4173)
    { name: 'landing', use: { viewport: { width: 1280, height: 900 } }, testMatch: /landing|rutas/ },
    { name: 'landing-celular', use: { viewport: { width: 390, height: 844 }, hasTouch: true }, testMatch: /landing|rutas/ },
    // Build tal como se publica hoy (VITE_INICIO=herramientas, puerto 4174)
    { name: 'herramientas', use: { baseURL: 'http://localhost:4174/ailaacc-sitio/', viewport: { width: 1280, height: 900 } }, testMatch: /inicio|control-horas|extractos/ },
    { name: 'herramientas-celular', use: { baseURL: 'http://localhost:4174/ailaacc-sitio/', viewport: { width: 390, height: 844 }, hasTouch: true }, testMatch: /inicio|extractos/ },
  ],
  webServer: [
    {
      command: 'VITE_INICIO=landing npx vite build --outDir dist-e2e/landing && npx vite preview --outDir dist-e2e/landing --port 4173 --strictPort',
      url: 'http://localhost:4173/ailaacc-sitio/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'VITE_INICIO=herramientas npx vite build --outDir dist-e2e/herramientas && npx vite preview --outDir dist-e2e/herramientas --port 4174 --strictPort',
      url: 'http://localhost:4174/ailaacc-sitio/',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
