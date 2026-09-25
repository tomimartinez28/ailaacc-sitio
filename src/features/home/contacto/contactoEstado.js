import { createContext } from 'react';
import { OPCIONES_MOTIVO, OPCIONES_SEDE } from '../../../data/sitio.js';

// Estado del formulario de contacto, compartido con los botones de otras secciones
// ("Consultar por esta sede", "Enviar CV", "Escribinos") que preseleccionan sede o motivo.
//
// Se separa en dos contextos para no re-renderizar de más:
//  - EstadoContext: valores del formulario (solo lo consume el formulario; cambia al tipear).
//  - AccionesContext: funciones estables (lo consumen los botones; nunca cambia).

export const FORMULARIO_INICIAL = {
  nombre: '',
  telefono: '',
  sede: OPCIONES_SEDE[0],
  motivo: OPCIONES_MOTIVO[0].value,
  mensaje: '',
};

export function reducerContacto(estado, accion) {
  switch (accion.type) {
    case 'campo':
      return estado[accion.name] === accion.value ? estado : { ...estado, [accion.name]: accion.value };
    case 'preseleccionar':
      return { ...estado, ...accion.valores };
    default:
      return estado;
  }
}

export const EstadoContext = createContext(null);
export const AccionesContext = createContext(null);
