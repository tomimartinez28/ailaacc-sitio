# Sitio AILAACC

Sitio estático de A.I.L.A.A.C.C. (U.E.G.P. N° 195, Chaco) con dos páginas que comparten estética:

| Página | Para quién | Qué hace |
|---|---|---|
| `index.html` | Familias y público | Landing institucional: servicios, sedes, contacto por WhatsApp |
| `control-horas.html` | Personal (uso interno, `noindex`) | Procesa los reportes del registro dactilar |

## Control de horas

Procesa los reportes del registro dactilar (ANVIZ/CrossChex y formato con hoja "Logs")
y genera un Excel con entradas, salidas y horas por persona y por día.

Todo el procesamiento ocurre en el navegador: ningún archivo se envía a un servidor.

## Estructura

    index.html            landing
    control-horas.html    herramienta
    css/sitio.css         estilos compartidos (tokens de color, tipografía, header, footer)
    css/estilos.css       estilos propios de la herramienta
    js/                   lógica de la herramienta (app.js + motor/)
    vendor/               SheetJS y ExcelJS (copias locales)
    img/                  logo, favicon

## Uso local
    python -m http.server 8000
Abrir http://localhost:8000 (la herramienta usa módulos ES y no funciona abriendo el archivo directo).

## Ajustes
- Herramienta — minutos para duplicados, colores del Excel y cantidad de columnas: `js/config.js`
- Landing — número de WhatsApp: `WHATSAPP_NUMBER` en el script de `index.html`.
  Los datos pendientes de confirmar están marcados con `TODO`.
