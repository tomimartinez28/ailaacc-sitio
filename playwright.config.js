import { defineConfig } from '@playwright/test';

// E2E sobre builds de producción (vite preview), usando el Google Chrome instalado.
// Se compilan dos versiones: con la landing (puerto 4173) y con "Sitio en construcción" (4174).
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
    { name: 'escritorio', use: { viewport: { width: 1280, height: 900 } }, testIgnore: /construccion/ },
    { name: 'celular', use: { viewport: { width: 390, height: 844 }, hasTouch: true }, testMatch: /landing|rutas/ },
    // Build tal como se publica mientras la landing está oculta (VITE_LANDING_PUBLICA=false)
    { name: 'en-construccion', use: { baseURL: 'http://localhost:4174/ailaacc-sitio/', viewport: { width: 1280, height: 900 } }, testMatch: /construccion/ },
    { name: 'en-construccion-celular', use: { baseURL: 'http://localhost:4174/ailaacc-sitio/', viewport: { width: 390, height: 844 }, hasTouch: true }, testMatch: /construccion/ },
  ],
  webServer: [
    {
      command: 'VITE_LANDING_PUBLICA=true npx vite build --outDir dist-e2e/landing && npx vite preview --outDir dist-e2e/landing --port 4173 --strictPort',
      url: 'http://localhost:4173/ailaacc-sitio/',
      reuseExistingServer: false,
      timeout: 120000,
    },
    {
      command: 'VITE_LANDING_PUBLICA=false npx vite build --outDir dist-e2e/construccion && npx vite preview --outDir dist-e2e/construccion --port 4174 --strictPort',
      url: 'http://localhost:4174/ailaacc-sitio/',
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
