import { useMemo, useReducer } from 'react';
import { AccionesContext, EstadoContext, FORMULARIO_INICIAL, reducerContacto } from './contactoEstado.js';

export function ContactoProvider({ children }) {
  const [estado, dispatch] = useReducer(reducerContacto, FORMULARIO_INICIAL);

  // Creadas una sola vez: los componentes que solo usan acciones nunca se re-renderizan por el formulario
  const acciones = useMemo(() => ({
    cambiarCampo: (name, value) => dispatch({ type: 'campo', name, value }),
    elegirSede: (sede) => dispatch({ type: 'preseleccionar', valores: { sede } }),
    elegirMotivo: (motivo) => dispatch({ type: 'preseleccionar', valores: { motivo } }),
  }), []);

  return (
    <AccionesContext value={acciones}>
      <EstadoContext value={estado}>{children}</EstadoContext>
    </AccionesContext>
  );
}
