// Librerías de planillas. Mismas versiones que usaba la versión HTML (vendor/):
// SheetJS 0.20.3 y ExcelJS 4.4.0. Se importan acá para que el resto del motor no dependa de globales.

import * as XLSX from 'xlsx';
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
import ExcelJS from 'exceljs';

// El build "full" que se usaba antes incluía las codepages (necesarias para .xls viejos).
XLSX.set_cptable(cptable);

export { XLSX, ExcelJS };
