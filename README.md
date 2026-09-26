# Sitio AILAACC

Sitio de A.I.L.A.A.C.C. (U.E.G.P. N° 195, Chaco) hecho con **React + Vite + React Router**.

| Ruta | Para quién | Qué es |
|---|---|---|
| `/` | Familias y público | Landing: servicios, sedes, contacto por WhatsApp (o "Sitio en construcción", ver abajo) |
| `/herramientas` | Personal (no se indexa) | Listado de herramientas internas |
| `/herramientas/control-horas` | Personal | Procesa los reportes del registro dactilar |

`/control-horas.html` (dirección de la versión anterior) redirige a la herramienta.

## Landing publicada u oculta

La variable `VITE_LANDING_PUBLICA` decide qué se ve en `/`:

| Archivo | Valor | Resultado |
|---|---|---|
| `.env` (lo que se publica) | `false` | Página "Sitio en construcción" con WhatsApp, teléfono y redes. El código de la landing **no se incluye** en el build. |
| `.env.development` (`npm run dev`) | `true` | Se ve la landing, para seguir trabajando en ella. |

- Ver la página provisoria en local: `VITE_LANDING_PUBLICA=false npm run dev`
- **Lanzar la landing:** cambiar `.env` a `VITE_LANDING_PUBLICA=true`, commit y push.

Las herramientas (`/herramientas`) funcionan igual en los dos casos.

## Uso

    npm install
    npm run dev        # desarrollo: http://localhost:5173/ailaacc-sitio/
    npm run build      # genera dist/ (incluye 404.html para las rutas en GitHub Pages)
    npm run preview    # sirve dist/ localmente

## Tests

    npm test           # unitarios y de componentes (Vitest)
    npm run test:e2e   # end-to-end sobre el build, con Google Chrome (Playwright)

Para comprobar que el Excel generado es idéntico al de la versión HTML anterior, servir esa versión
(p. ej. un `git worktree` de la versión HTML con `python -m http.server 8801`) y correr:

    BASELINE_URL=http://localhost:8801/ npm run test:e2e

Los reportes de prueba de `e2e/fixtures/` tienen datos ficticios (`node e2e/fixtures/generar.mjs`).

## Estructura

    src/
      data/institucion.js      datos compartidos: institución, contacto, WhatsApp, redes, horario
      data/sitio.js            contenido de la landing: sedes (dirección, teléfono), servicios, textos
      components/ui/           piezas reutilizables: Button, Icon, SectionHead, Brand
      components/layout/       headers, footers, botón de WhatsApp, scroll a #anclas
      layouts/                 SiteLayout (landing) y ToolsLayout (área del personal)
      features/home/           secciones de la landing; contacto/ tiene el estado del formulario
      pages/                   Home, "Sitio en construcción", listado de herramientas, página de una herramienta
      tools/registro.js        registro de herramientas (se cargan de forma diferida)
      tools/control-horas/     la herramienta: componentes, hook de estado y motor/ (lógica de Excel)
      styles/                  sitio.css (tokens y componentes) y herramientas.css
    e2e/                       tests end-to-end y reportes de prueba

## Agregar una herramienta

1. Crear `src/tools/<slug>/` con un componente por defecto (puede usar `ToolHero`).
2. Sumar una entrada en `src/tools/registro.js`. Aparece sola en `/herramientas` y en `/herramientas/<slug>`,
   y su código solo se descarga cuando alguien la abre.

## Control de horas

Procesa los reportes del registro dactilar (ANVIZ/CrossChex y formato con hoja "Logs") y genera un Excel
con entradas, salidas y horas por persona y por día. Todo ocurre en el navegador: ningún archivo se envía
a un servidor. Ajustes (minutos para duplicados, colores, columnas): `src/tools/control-horas/config.js`.

## Publicación

GitHub Pages con GitHub Actions (`.github/workflows/deploy.yml`): cada push a `main` corre lint, tests y build,
y publica `dist/`. En el repo: Settings → Pages → Source: **GitHub Actions**.

Nota: `.npmrc` usa `legacy-peer-deps` para evitar un error de npm 10.9 al resolver peers opcionales de Vitest.
