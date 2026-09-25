import { useEffect, useState } from 'react';

// Devuelve el id de la sección que está en el centro de la pantalla (para resaltar el menú).
export function useActiveSection(ids) {
  const [activa, setActiva] = useState(null);
  const clave = ids.join('|');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) setActiva(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    clave.split('|').forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [clave]);

  return activa;
}
