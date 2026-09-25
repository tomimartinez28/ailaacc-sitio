import { useContext } from 'react';
import { AccionesContext, EstadoContext } from './contactoEstado.js';

export function useFormularioContacto() {
  const estado = useContext(EstadoContext);
  if (!estado) throw new Error('useFormularioContacto debe usarse dentro de <ContactoProvider>');
  return estado;
}

export function useAccionesContacto() {
  const acciones = useContext(AccionesContext);
  if (!acciones) throw new Error('useAccionesContacto debe usarse dentro de <ContactoProvider>');
  return acciones;
}
