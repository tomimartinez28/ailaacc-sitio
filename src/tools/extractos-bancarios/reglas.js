// Reglas de negocio de la herramienta de extractos bancarios.
// Acá se ajusta QUÉ cuenta como ingreso y QUÉ como gasto, sin tocar el motor.
// Los patrones se comparan contra el concepto/descripción del movimiento, sin distinguir
// mayúsculas ni acentos (ver normalizar() en motor/utilidades.js).

// ---------- Ingresos (créditos) ----------

// CUIT de empresas cuyos créditos NO son pagos recibidos (traspasos de saldo)
export const CUITS_EXCLUIDOS = {
  '33707852459': 'InvertirOnline (traspaso de inversiones)',
};

// CUIT de PERSONAS cuyos créditos NO son pagos recibidos (cuentas propias y familia).
// Se guarda solo su huella SHA-256 para no publicar el CUIT (el repositorio y el sitio son públicos).
// Para agregar uno: npm run huella-cuit -- <CUIT>  y copiar la línea que imprime.
export const CUITS_PRIVADOS_EXCLUIDOS = {
  '6727dab33d3d378cd3d4565ebc159280ac0479e7727cebc42f3a997d7bb272cf': 'Cuenta propia (titular)',
  '2c5807e8a4bd6684f2565d6fb7300ab1ae6ca3cc529bf85ff14d20ddd37c6d02': 'Familiar de la titular',
};

// Créditos que no son pagos recibidos, según el concepto
export const INGRESOS_EXCLUIDOS = [
  { patron: /mismo titular|igual tit/, motivo: 'Transferencia entre cuentas propias' },
  { patron: /rescate (de )?fondos/, motivo: 'Rescate de fondos (traspaso)' },
  { patron: /sentencia judicial/, motivo: 'Crédito por sentencia judicial' },
  { patron: /rendimientos? obtenidos?|intereses? ganados?|interes(es)? por saldo/, motivo: 'Intereses de la cuenta' },
  { patron: /bonificacion/, motivo: 'Bonificación o promoción' },
];

// Conceptos que no traen el CUIT en el detalle: se les asigna uno fijo.
// Solo se usa si el detalle no tiene un CUIT válido (ej. Santander sí lo trae en "Pago a proveedores recibido").
export const CUIT_POR_CONCEPTO = [
  { patron: /pago electronico del estado/, cuit: '30999175461' },
  { patron: /pago a proveedores/, cuit: '30546741253' },
];

// ---------- Gastos bancarios (débitos) ----------
// Se evalúan en orden: gana la primera categoría que coincide.
// Débitos que no coinciden con ninguna (transferencias, pagos, seguros, etc.) no son gastos bancarios.
export const CATEGORIAS_GASTO = [
  { categoria: 'Impuesto al Débito', patron: /(ley\s*25\.?413.*debito)|impuesto al debito/ },
  { categoria: 'Impuesto al Crédito', patron: /(ley\s*25\.?413.*credito)|impuesto al credito/ },
  { categoria: 'IVA sobre intereses', patron: /iva sobre intereses/ },
  // Credicoop lo llama "IVA - Alicuota Exento"; Santander "Iva 21% reg de transfisc ley 27743"
  { categoria: 'IVA sobre comisiones', patron: /iva sobre comisiones|^iva - alicuota|^iva \d+% reg de transfisc/ },
  { categoria: 'Intereses', patron: /intereses deudores|interes(es)? por descubierto|intereses por saldo deudor/ },
  { categoria: 'Comisiones', patron: /^com(\.|ision)|mantenimiento|servicio acreditaciones/ },
  { categoria: 'Impuesto de Sellos', patron: /impuesto de sellos/ },
  // Solo el seguro que cobra NBCH en la cuenta corriente; los seguros de Credicoop (Segurcoop, CNP) no son gasto bancario
  { categoria: 'Seguros', patron: /cargo seguro sd/ },
  // No es un gasto bancario en sentido estricto, pero se lo considera así a pedido de administración
  { categoria: 'Suscripción Periódico Acción', patron: /suscripcion al periodico accion/ },
];
