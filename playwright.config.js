import { defineConfig } from '@playwright/test';

// E2E sobre el build de producción (vite preview), usando el Google Chrome instalado.
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
    { name: 'escritorio', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'celular', use: { viewport: { width: 390, height: 844 }, hasTouch: true }, testMatch: /landing|rutas/ },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173/ailaacc-sitio/',
    reuseExistingServer: false,
    timeout: 120000,
  },
});
