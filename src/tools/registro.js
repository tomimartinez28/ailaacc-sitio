import { lazy } from 'react';

// Registro de herramientas del personal. Para sumar una nueva:
//  1. crear su carpeta en src/tools/<slug>/ con un componente por defecto
//  2. agregar una entrada acá (se carga de forma diferida: no pesa en la landing)
//     estado: 'Beta' (u otro texto corto) -> se muestra como etiqueta en la tarjeta del listado
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
    descripcion: 'Procesa los extractos de Santander, Credicoop, Francés y NBCH y genera un Excel con ingresos y gastos bancarios.',
    etiqueta: 'Bancos',
    icono: 'banco',
    tone: 'green',
    estado: 'Beta',
    Componente: lazy(() => import('./extractos-bancarios/ExtractosBancarios.jsx')),
  },
];

export const buscarHerramienta = (slug) => HERRAMIENTAS.find((h) => h.slug === slug);
