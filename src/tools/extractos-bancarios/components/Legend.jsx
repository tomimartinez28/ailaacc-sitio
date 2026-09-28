import { Muestra, Nota } from '../../components/Nota.jsx';
import { BANCOS_SOPORTADOS } from '../motor/lectores.js';

export function Legend() {
  return (
    <Nota titulo="Qué contiene el Excel">
      <p><Muestra clase="muestra-ingreso" />Hoja Ingresos: los pagos recibidos, con Mes, Fecha, Monto, Banco y CUIT del emisor. No incluye traspasos entre cuentas propias, rescates de inversiones, intereses ni bonificaciones.</p>
      <p><Muestra clase="muestra-gasto" />Hoja Gastos: impuestos al débito y al crédito, comisiones, intereses y el IVA correspondiente, con su categoría y el concepto original del banco.</p>
      <p>{`Bancos soportados: ${BANCOS_SOPORTADOS.join(', ')}. Antes de procesar se verifica que los saldos del extracto cierren; si no cierran, el archivo se rechaza.`}</p>
    </Nota>
  );
}
