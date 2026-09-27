import { nombreDeSalida } from '../lib/descargar.js';

// Cómo se muestra un reporte procesado en la lista (mismo texto que la versión HTML original)
export function describirHoras(resultado) {
  const e = resultado.estadisticas;
  return {
    meta: `${resultado.formato} · ${e.personas} personas · ${e.marcas} marcas`,
    chips: [
      { clase: 'impar', texto: `${e.diasImpares} días a completar` },
      { clase: 'dup', texto: `${e.marcasDuplicadas} marcas duplicadas` },
    ],
  };
}

// "reporte.xls" -> "reporte_horas.xlsx"
export const salidaHoras = (nombre) => nombreDeSalida(nombre, 'horas');
