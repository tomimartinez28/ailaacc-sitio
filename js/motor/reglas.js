// Reglas de negocio: agrupa las marcas por persona y por día y separa duplicadas.

import { MINUTOS_DUPLICADO } from '../config.js';

// Separa las marcas de un día en válidas y duplicadas (< MINUTOS_DUPLICADO de la anterior válida)
export function separarDuplicadas(marcasDelDia) {
  const ordenadas = [...marcasDelDia].sort((a, b) => a - b);
  const validas = [];
  const duplicadas = [];
  for (const m of ordenadas) {
    const anterior = validas[validas.length - 1];
    if (anterior !== undefined && m - anterior < MINUTOS_DUPLICADO) duplicadas.push(m);
    else validas.push(m);
  }
  return { validas, duplicadas };
}

// Devuelve [{ id, nombre, sector, equipos:Set, dias: Map("AAAA-MM-DD" -> {validas, duplicadas}) }]
export function agruparPorPersona(marcas) {
  const personas = new Map();

  for (const m of marcas) {
    if (!personas.has(m.id)) {
      personas.set(m.id, { id: m.id, nombre: m.nombre, sector: m.sector, equipos: new Set(), dias: new Map() });
    }
    const p = personas.get(m.id);
    if (m.equipo) p.equipos.add(m.equipo);
    if (!p.dias.has(m.fecha)) p.dias.set(m.fecha, []);
    p.dias.get(m.fecha).push(m.min);
  }

  for (const p of personas.values()) {
    for (const [fecha, lista] of p.dias) p.dias.set(fecha, separarDuplicadas(lista));
  }

  return [...personas.values()].sort((a, b) => Number(a.id) - Number(b.id) || a.id.localeCompare(b.id));
}
