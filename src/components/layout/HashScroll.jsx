import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Al llegar a una ruta con #ancla (ej. desde una herramienta a "/#contacto"), baja hasta esa sección.
export function HashScroll() {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!hash) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }   // #ancla mal codificada (ej. "#%E0"): se ignora
    const el = document.getElementById(id);
    if (el) requestAnimationFrame(() => el.scrollIntoView());
  }, [hash, pathname]);
  return null;
}
