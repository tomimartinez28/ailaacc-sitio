import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Al llegar a una ruta con #ancla (ej. desde una herramienta a "/#contacto"), baja hasta esa sección.
export function HashScroll() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el) requestAnimationFrame(() => el.scrollIntoView());
  }, [hash, pathname]);
  return null;
}
