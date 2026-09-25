import { useEffect } from 'react';

export function useDocumentTitle(titulo) {
  useEffect(() => { document.title = titulo; }, [titulo]);
}

// Agrega un <meta name="..."> mientras el componente está montado (ej. robots=noindex en herramientas)
export function useMetaTag(name, content) {
  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = name;
    meta.content = content;
    document.head.append(meta);
    return () => meta.remove();
  }, [name, content]);
}
