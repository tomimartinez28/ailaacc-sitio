import { WHATSAPP_NUMBER } from '../data/institucion.js';

export const esNumeroPlaceholder = (numero = WHATSAPP_NUMBER) => /0{6}$/.test(numero);

export function urlWhatsApp(texto, numero = WHATSAPP_NUMBER) {
  return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
}

export function abrirWhatsApp(texto, numero = WHATSAPP_NUMBER) {
  window.open(urlWhatsApp(texto, numero), '_blank', 'noopener');
}

// Mensaje del formulario de contacto (mismo texto que la versión HTML)
export function mensajeConsulta({ nombre, telefono, sede, motivo, mensaje }) {
  const lineas = [
    'Hola AILAACC, soy ' + nombre + '.',
    'Sede de interés: ' + sede + '.',
    'Motivo: ' + motivo + '.',
    'Mi teléfono de contacto: ' + telefono + '.',
  ];
  if (mensaje) lineas.push('Mensaje: ' + mensaje);
  return lineas.join('\n');
}

export const MENSAJE_RAPIDO = 'Hola AILAACC, quisiera consultar por sus servicios.';
