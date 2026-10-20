// Librerías de planillas, compartidas por las herramientas. Mismas versiones que la versión HTML (vendor/):
// SheetJS 0.20.3 y ExcelJS 4.4.0. JSZip (3.10.2, la misma que usa ExcelJS) sirve para retocar el .xlsx generado.
// Se importan acá para que el resto del motor no dependa de globales.

import * as XLSX from 'xlsx';
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';

// El build "full" que se usaba antes incluía las codepages (necesarias para .xls viejos).
XLSX.set_cptable(cptable);

export { XLSX, ExcelJS, JSZip };
