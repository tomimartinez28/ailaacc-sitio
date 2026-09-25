import ExcelJS from 'exceljs';

// Vuelca un .xlsx a un objeto comparable: todo lo que ve quien abre el Excel
// (valores, fórmulas, formatos, colores, bordes, enlaces, formato condicional, anchos, paneles).
// Se ignoran solo los metadatos de fecha de creación/modificación del archivo.
export async function volcarExcel(buffer) {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(buffer);
  return {
    creador: wb.creator,
    hojas: wb.worksheets.map((h) => {
      const celdas = {};
      h.eachRow({ includeEmpty: true }, (fila, n) => {
        fila.eachCell({ includeEmpty: true }, (c) => {
          const v = c.value instanceof Date ? c.value.toISOString() : c.value;
          celdas[c.address] = { v, numFmt: c.numFmt, font: c.font, fill: c.fill, border: c.border, alignment: c.alignment };
        });
        celdas['fila' + n] = { alto: fila.height };
      });
      return {
        nombre: h.name,
        vistas: h.views,
        columnas: h.columns?.map((col) => col.width) ?? [],
        autoFilter: h.autoFilter,
        pageSetup: { orientation: h.pageSetup.orientation, fitToPage: h.pageSetup.fitToPage, fitToWidth: h.pageSetup.fitToWidth, fitToHeight: h.pageSetup.fitToHeight },
        condicional: h.conditionalFormattings,
        celdas,
      };
    }),
  };
}
