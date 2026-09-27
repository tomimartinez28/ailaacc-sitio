// Parámetros de la herramienta de extractos bancarios.

// Formatos de archivo que se aceptan. PROVISORIO: se ajusta cuando se definan los bancos y sus extractos.
export const FORMATOS_ACEPTADOS = '.xls,.xlsx,.csv,.pdf';

// Moneda para mostrar los totales
export const MONEDA = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
