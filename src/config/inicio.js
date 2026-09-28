// Modo de la página de inicio (ver src/router.jsx y .env). Con 'herramientas' no hay sitio público:
// se ocultan los accesos "Volver al sitio" del área de herramientas.
export const HAY_SITIO_PUBLICO = import.meta.env.VITE_INICIO === 'landing' || import.meta.env.VITE_INICIO === 'construccion';
