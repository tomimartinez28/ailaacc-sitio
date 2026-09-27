import { lazy } from 'react';

// Registro de herramientas del personal. Para sumar una nueva:
//  1. crear su carpeta en src/tools/<slug>/ con un componente por defecto
//  2. agregar una entrada acá (se carga de forma diferida: no pesa en la landing)
//     enDesarrollo: true -> la tarjeta del listado lo indica
export const HERRAMIENTAS = [
  {
    slug: 'control-horas',
    nombre: 'Control de horas',
    descripcion: 'Procesa los reportes del registro dactilar y genera un Excel con entradas, salidas y horas por persona.',
    etiqueta: 'Registro dactilar',
    icono: 'planilla',
    tone: 'orange',
    Componente: lazy(() => import('./control-horas/ControlHoras.jsx')),
  },
  {
    slug: 'extractos-bancarios',
    nombre: 'Extractos bancarios',
    descripcion: 'Procesa los extractos de los distintos bancos y genera un Excel con el resumen de ingresos y gastos bancarios.',
    etiqueta: 'Bancos',
    icono: 'banco',
    tone: 'green',
    enDesarrollo: true,
    Componente: lazy(() => import('./extractos-bancarios/ExtractosBancarios.jsx')),
  },
];

export const buscarHerramienta = (slug) => HERRAMIENTAS.find((h) => h.slug === slug);
