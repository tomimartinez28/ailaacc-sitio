// Datos institucionales y de contacto. Los usan todas las páginas (landing, herramientas y
// "Sitio en construcción"), por eso están separados del contenido de la landing (sitio.js).

export const INSTITUCION = {
  sigla: 'AILAACC',
  nombre: 'A.I.L.A.A.C.C.',
  registro: 'U.E.G.P. N° 195',
  provincia: 'Chaco',
};

// WhatsApp de la casa central (formato internacional: 54 9 + código de área + número, sin espacios)
export const WHATSAPP_NUMBER = '5493644359654';

export const HORARIO_SEDES = 'Lunes a viernes, 8 a 12 hs y 16 a 20 hs';

// Datos de la casa central (la dirección está en SEDES, más abajo)
export const CONTACTO = {
  telefono: { texto: '(3644) 359654', href: 'tel:+543644359654' },
  email: 'admisioneingresosailaacc195@gmail.com',
  horario: `${HORARIO_SEDES}, en todas las sedes.`,
};

// Redes oficiales. Se muestran como "<texto> en <red>" con el ícono de cada una.
export const REDES = [
  { red: 'Instagram', icono: 'instagram', texto: '@ailaacc_sp', url: 'https://www.instagram.com/ailaacc_sp/' },
  { red: 'Facebook', icono: 'facebook', texto: 'AILAACC', url: 'https://www.facebook.com/share/1DwVV2fMqY/' },
  { red: 'LinkedIn', icono: 'linkedin', texto: 'AILAACC', url: 'https://www.linkedin.com/company/102258350/' },
];
