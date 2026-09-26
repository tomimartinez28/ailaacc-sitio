import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages no conoce las rutas del SPA: servimos el mismo index.html como 404.html
// para que /herramientas/... funcione al entrar directo o al recargar.
const spaFallback = () => {
  let dist;
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    configResolved(config) { dist = resolve(config.root, config.build.outDir); },
    closeBundle() { copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html')); },
  };
};

export default defineConfig({
  // Se publica en https://tomimartinez28.github.io/ailaacc-sitio/
  base: '/ailaacc-sitio/',
  plugins: [react(), spaFallback()],
  build: {
    // SheetJS + ExcelJS pesan ~1.7 MB: van en el chunk de la herramienta, que se descarga solo al abrirla
    chunkSizeWarningLimit: 2000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    css: false,
    env: { VITE_LANDING_PUBLICA: 'true' },
  },
});
