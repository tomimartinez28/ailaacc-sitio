// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import ExcelJS from 'exceljs';
import { procesarArchivo } from './index.js';
import { agruparPorPersona, separarDuplicadas } from './reglas.js';
import { horaAMinutos, minutosAHora, horasDeCelda } from './utilidades.js';

const fixture = (n) => {
  const b = readFileSync(new URL(`../../../../e2e/fixtures/${n}`, import.meta.url));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
};

describe('reglas', () => {
  it('separa marcas a menos de 5 minutos de la anterior válida', () => {
    expect(separarDuplicadas([480, 483, 720, 724.9, 725])).toEqual({ validas: [480, 720, 725], duplicadas: [483, 724.9] });
  });
  it('agrupa por persona, ordena por ID numérico y junta equipos', () => {
    const p = agruparPorPersona([
      { id: '10', nombre: 'B', sector: '', equipo: '2', fecha: '2026-08-03', min: 600 },
      { id: '9', nombre: 'A', sector: '', equipo: '', fecha: '2026-08-03', min: 480 },
      { id: '10', nombre: 'B', sector: '', equipo: '1', fecha: '2026-08-03', min: 470 },
    ]);
    expect(p.map((x) => x.id)).toEqual(['9', '10']);
    expect([...p[1].equipos]).toEqual(['2', '1']);
    expect(p[1].dias.get('2026-08-03').validas).toEqual([470, 600]);
  });
});

describe('utilidades', () => {
  it('convierte horas', () => {
    expect(horaAMinutos('07:40:30')).toBe(460.5);
    expect(minutosAHora(460.5)).toBe('07:40:30');
    expect(horasDeCelda('08:01\n12:00')).toEqual([481, 720]);
  });
});

describe('procesarArchivo (motor completo)', () => {
  it('ANVIZ .xlsx', async () => {
    const r = await procesarArchivo(fixture('anviz.xlsx'), 'anviz.xlsx');
    expect(r.formato).toBe('ANVIZ – registros');
    expect(r.estadisticas).toEqual({ personas: 3, marcas: 128, diasImpares: 2, marcasDuplicadas: 2 });
  });

  it('ANVIZ .xls (formato viejo, codepages) da el mismo Excel que el .xlsx', async () => {
    const [a, b] = await Promise.all([
      procesarArchivo(fixture('anviz.xlsx'), 'x'),
      procesarArchivo(fixture('anviz.xls'), 'x'),
    ]);
    expect(b.estadisticas).toEqual(a.estadisticas);
    const leer = async (buf) => { const wb = new ExcelJS.Workbook(); await wb.xlsx.load(buf); return wb; };
    const [wa, wb] = await Promise.all([leer(a.buffer), leer(b.buffer)]);
    expect(wb.worksheets.map((w) => w.name)).toEqual(wa.worksheets.map((w) => w.name));
    wa.worksheets.forEach((hoja, i) => {
      const otra = wb.worksheets[i];
      hoja.eachRow((fila, n) => expect(otra.getRow(n).values).toEqual(fila.values));
    });
  });

  it('formato B (hoja Logs)', async () => {
    const r = await procesarArchivo(fixture('formato-b.xlsx'), 'formato-b.xlsx');
    expect(r.formato).toBe('Formato B (hoja Logs)');
    expect(r.estadisticas.personas).toBe(2);
    expect(r.estadisticas.marcasDuplicadas).toBeGreaterThan(0);
    expect(r.estadisticas.diasImpares).toBeGreaterThan(0);
  });

  it('rechaza un archivo que no es un reporte', async () => {
    await expect(procesarArchivo(fixture('invalido.xlsx'), 'invalido.xlsx')).rejects.toThrow('Formato no reconocido');
  });
});
