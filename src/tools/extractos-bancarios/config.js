// Parámetros de la herramienta de extractos bancarios.

// Todos los bancos soportados exportan sus extractos en Excel (.xlsx)
export const FORMATOS_ACEPTADOS = '.xlsx';

// Moneda para mostrar los totales
export const MONEDA = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });
