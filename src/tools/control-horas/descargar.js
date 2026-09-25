const MIME_XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Descarga un archivo generado en memoria
export function descargar(nombre, buffer) {
  const url = URL.createObjectURL(new Blob([buffer], { type: MIME_XLSX }));
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// "reporte.xls" -> "reporte_horas.xlsx"
export const nombreDeSalida = (nombreArchivo) => nombreArchivo.replace(/\.[^.]+$/, '') + '_horas.xlsx';
