// Ruta a un archivo de /public respetando la base de publicación (GitHub Pages: /ailaacc-sitio/)
export const asset = (ruta) => import.meta.env.BASE_URL + ruta.replace(/^\//, '');

export const LOGO = { src: asset('img/logo-ailaacc.png'), width: 1000, height: 1228 };
