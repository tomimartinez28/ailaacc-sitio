# Herramientas AILAACC

Herramientas internas del personal de A.I.L.A.A.C.C. (U.E.G.P. N° 195, Chaco), hechas con
**React + Vite + React Router**. Se publican en https://tomimartinez28.github.io/ailaacc-sitio/herramientas.

La landing pública es **otro proyecto** (`ailaacc-landing`, en https://ailaaccuep195.com/); su footer tiene el
link "Acceso personal · Herramientas" que lleva acá.

| Ruta | Qué es |
|---|---|
| `/` | Redirige a `/herramientas` (también cualquier dirección desconocida) |
| `/herramientas` | Listado de herramientas internas (no se indexa en buscadores) |
| `/herramientas/control-horas` | Procesa los reportes del registro dactilar |
| `/herramientas/extractos-bancarios` | Reportes de ingresos y gastos bancarios por extracto |

`/control-horas.html` (dirección de la versión anterior) redirige a la herramienta.

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
      data/institucion.js      nombre y registro de la institución (marca y footer)
      components/ui/           piezas reutilizables: Button, Icon, SectionHead, Brand
      components/layout/       header y footer del área de herramientas
      layouts/ToolsLayout.jsx  header + herramienta + footer
      pages/                   listado de herramientas y página de una herramienta
      tools/registro.js        registro de herramientas (se cargan de forma diferida)
      tools/components/        piezas comunes: ToolHero, ProcesadorArchivos, DropZone, ResultList, Nota
      tools/hooks/             useProcesarArchivos (estado de la lista de archivos)
      tools/control-horas/     motor/ (lógica de Excel), resumen.js, leyenda y colores propios
      tools/extractos-bancarios/  reglas.js (qué es ingreso/gasto), motor/ (un lector por banco, clasificación, Excel)
      styles/                  sitio.css (tokens y componentes base, copiados de la landing) y herramientas.css
    e2e/                       tests end-to-end y reportes de prueba

## Agregar una herramienta

1. Crear `src/tools/<slug>/` con un componente por defecto. Si procesa archivos, usar `ToolHero` +
   `ProcesadorArchivos` y definir `procesarArchivo`, `describir(resultado)` y `nombreSalida(nombre)`
   (ver `extractos-bancarios/` como plantilla).
2. Sumar una entrada en `src/tools/registro.js`. Aparece sola en `/herramientas` y en `/herramientas/<slug>`,
   y su código solo se descarga cuando alguien la abre. Con `enDesarrollo: true` la tarjeta lo indica.

## Control de horas

Procesa los reportes del registro dactilar (ANVIZ/CrossChex y formato con hoja "Logs") y genera un Excel
con entradas, salidas y horas por persona y por día. Todo ocurre en el navegador: ningún archivo se envía
a un servidor. Ajustes (minutos para duplicados, colores, columnas): `src/tools/control-horas/config.js`.

## Extractos bancarios

Lee extractos en Excel de **Santander, Credicoop, Francés (BBVA), NBCH y Galicia** (este último en `.xlsm`) y genera, por extracto, un Excel con dos hojas:

- **Ingresos**: Mes (primer día, formato `mmm-yyyy`), Fecha, Monto, Banco, CUIT del Emisor. Excluye traspasos
  (mismo titular, CUIT de la institución y familia, InvertirOnline, rescates de fondos), cheques rechazados,
  sentencias judiciales, intereses, bonificaciones y reintegros de promociones.
- **Gastos**: Mes, Fecha, Monto, Banco, Categoría (Impuesto al Débito/Crédito, Comisiones, IVA sobre comisiones,
  Intereses, IVA sobre intereses) y Concepto original.

Antes de clasificar verifica que los saldos del extracto cierren fila por fila (salvo Francés, que no informa saldo);
si no cierran, rechaza el archivo. Las reglas se editan en `src/tools/extractos-bancarios/reglas.js`.
Los CUIT de **personas** a excluir (titular, familia) no se guardan en claro, porque el repositorio y el sitio son
públicos: se guarda su huella SHA-256. Para agregar uno: `npm run huella-cuit -- <CUIT>` y copiar la línea en
`CUITS_PRIVADOS_EXCLUIDOS`. La herramienta está marcada como **Beta** (`estado` en `src/tools/registro.js`).
Para sumar un banco: agregar su lector en `motor/lectores.js`.

Los extractos de prueba (`e2e/fixtures/extracto-*.xlsx` y `.xlsm`) son ficticios: `node e2e/fixtures/generar-extractos.mjs`.

## Publicación

GitHub Pages con GitHub Actions (`.github/workflows/deploy.yml`): cada push a `main` corre lint, tests y build,
y publica `dist/`. En el repo: Settings → Pages → Source: **GitHub Actions**.

Nota: `.npmrc` usa `legacy-peer-deps` para evitar un error de npm 10.9 al resolver peers opcionales de Vitest.
