# Control de horas

Procesa los reportes del registro dactilar (ANVIZ/CrossChex y formato con hoja "Logs")
y genera un Excel con entradas, salidas y horas por persona y por día.

Todo el procesamiento ocurre en el navegador: ningún archivo se envía a un servidor.

## Uso local
    python -m http.server 8000
Abrir http://localhost:8000

## Ajustes
Minutos para duplicados, colores y cantidad de columnas: `js/config.js`
