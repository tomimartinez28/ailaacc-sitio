// Parámetros de la herramienta de extractos bancarios.

// Todos los bancos soportados exportan sus extractos en Excel: .xlsx, salvo Galicia que usa .xlsm
// (las macros de un .xlsm nunca se ejecutan: solo se leen los datos de la hoja)
export const FORMATOS_ACEPTADOS = '.xlsx,.xlsm';

// Moneda para mostrar los totales
export const MONEDA = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
