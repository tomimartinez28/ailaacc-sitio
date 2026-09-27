import { Muestra, Nota } from '../../components/Nota.jsx';

// PROVISORIO: se ajusta cuando se defina el formato del Excel de salida
export function Legend() {
  return (
    <Nota titulo="Qué contiene el Excel">
      <p><Muestra clase="muestra-ingreso" />Ingresos: los pagos recibidos en la cuenta, con su fecha, concepto e importe.</p>
      <p><Muestra clase="muestra-gasto" />Gastos bancarios: las comisiones y cargos que cobra el banco.</p>
      <p>Una hoja de resumen muestra los totales de cada uno por extracto.</p>
    </Nota>
  );
}
